'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import type { Post, Comment } from '@/types';

const POSTS_COLLECTION = 'posts';
const COMMENTS_COLLECTION = 'comments';

// Helper to convert Firestore post data to match app types
const postFromFirestore = (docSnap: { id: string; data: () => any; }): Post => {
  const data = docSnap.data();
  let date;
  if (data.date && typeof data.date.toDate === 'function') {
    date = (data.date as Timestamp).toDate().toISOString();
  } else {
    // Use a consistent fallback date to prevent hydration errors
    date = new Date(0).toISOString(); 
  }

  return {
    id: docSnap.id,
    title: data.title || '',
    subtitle: data.subtitle || '',
    content: data.content || '',
    author: data.author || 'Anônimo',
    authorImage: data.authorImage || '',
    date: date,
    tags: data.tags || [],
    imageUrl: data.imageUrl || '',
    imageHint: data.imageHint || '',
  };
};

// Helper to convert Firestore comment data to match app types
const commentFromFirestore = (docSnap: { id: string; data: () => any; }): Comment => {
  const data = docSnap.data();
  let date;
  if (data.date && typeof data.date.toDate === 'function') {
    date = (data.date as Timestamp).toDate().toISOString();
  } else {
    // Use a consistent fallback date to prevent hydration errors
    date = new Date(0).toISOString();
  }
  
  return {
    id: docSnap.id,
    postId: data.postId || '',
    author: data.author || 'Anônimo',
    content: data.content || '',
    date: date,
  };
};

export async function getPosts(): Promise<Post[]> {
  const db = getDbInstance();
  const postsCollection = collection(db, POSTS_COLLECTION);
  const q = query(postsCollection, orderBy('date', 'desc'));
  const postsSnapshot = await getDocs(q);
  return postsSnapshot.docs.map(postFromFirestore);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const db = getDbInstance();
  const postDocRef = doc(db, POSTS_COLLECTION, id);
  const postSnap = await getDoc(postDocRef);

  if (!postSnap.exists()) {
    return undefined;
  }
  return postFromFirestore(postSnap);
}

async function createPost(postData: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>): Promise<Post> {
  const db = getDbInstance();
  const newPostData = {
    ...postData,
    date: new Date(),
    author: 'Klebsu', // Hardcoded for now
    authorImage: 'https://picsum.photos/seed/authorKlebsu/40/40',
  };
  
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPostData);

  return {
    ...newPostData,
    id: docRef.id,
    date: newPostData.date.toISOString(),
  };
}

async function updatePost(id: string, postData: Partial<Omit<Post, 'id'>>): Promise<Post | undefined> {
  const db = getDbInstance();
  const postDocRef = doc(db, POSTS_COLLECTION, id);

  const dataToUpdate: { [key: string]: any } = { ...postData };
  if (dataToUpdate.date) {
    dataToUpdate.date = new Date(dataToUpdate.date);
  }

  await updateDoc(postDocRef, dataToUpdate);
  return await getPostById(id);
}

export async function deletePostAndComments(id: string): Promise<void> {
  const db = getDbInstance();
  const batch = writeBatch(db);
  
  const postDocRef = doc(db, POSTS_COLLECTION, id);
  batch.delete(postDocRef);
  
  const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where('postId', '==', id));
  const commentsSnapshot = await getDocs(commentsQuery);
  
  commentsSnapshot.forEach(commentDoc => {
    batch.delete(commentDoc.ref);
  });
  
  await batch.commit();
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const db = getDbInstance();
  const q = query(collection(db, COMMENTS_COLLECTION), where('postId', '==', postId), orderBy('date', 'desc'));
  const commentsSnapshot = await getDocs(q);
  return commentsSnapshot.docs.map(commentFromFirestore);
}

async function createCommentInDb(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  const db = getDbInstance();
  const newCommentData = {
    ...commentData,
    date: new Date(),
  };
  
  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), newCommentData);
  
  return {
    ...newCommentData,
    id: docRef.id,
    date: newCommentData.date.toISOString(),
  };
}


const PostSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  subtitle: z.string().min(3, { message: 'O subtítulo deve ter pelo menos 3 caracteres.' }),
  content: z.string().min(10, { message: 'O conteúdo deve ter pelo menos 10 caracteres.' }),
  imageUrl: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }).or(z.literal('')).optional(),
  imageHint: z.string().optional(),
  tags: z.string().optional(),
});

export async function createPostAction(prevState: any, formData: FormData) {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    content: formData.get('content'),
    imageUrl: formData.get('imageUrl'),
    imageHint: formData.get('imageHint'),
    tags: formData.get('tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const data = validatedFields.data;
  const imageUrl = data.imageUrl || `https://picsum.photos/seed/${Date.now()}/1200/630`;
  const tags = data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [];

  let newPost;
  try {
    newPost = await createPost({ 
      title: data.title, 
      subtitle: data.subtitle,
      content: data.content,
      tags,
      imageUrl: imageUrl,
      imageHint: data.imageHint || 'filosofia abstrata'
    });
  } catch (error: any) {
    return {
      errors: { _form: [`Falha ao criar o post: ${error.message}`] }
    }
  }

  revalidatePath('/');
  redirect(`/`);
}

export async function updatePostAction(id: string, prevState: any, formData: FormData) {
    const validatedFields = PostSchema.safeParse({
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        content: formData.get('content'),
        imageUrl: formData.get('imageUrl'),
        imageHint: formData.get('imageHint'),
        tags: formData.get('tags'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const data = validatedFields.data;
    const tags = data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [];

    try {
        const oldPost = await getPostById(id);
        if (!oldPost) {
            return { errors: { _form: ['Post não encontrado.'] } };
        }

        await updatePost(id, {
            title: data.title,
            subtitle: data.subtitle,
            content: data.content,
            tags,
            imageUrl: data.imageUrl || oldPost.imageUrl,
            imageHint: data.imageHint || oldPost.imageHint,
        });
    } catch (error) {
        return {
            errors: { _form: ['Falha ao atualizar o post.'] }
        }
    }

    revalidatePath('/');
    revalidatePath(`/posts/${id}`);
    redirect(`/posts/${id}`);
}

export async function deletePostAction(id: string) {
    try {
        await deletePostAndComments(id);
    } catch (e) {
        throw new Error('Falha ao excluir o post');
    }
    revalidatePath('/');
    redirect('/');
}

const CommentSchema = z.object({
  author: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  content: z.string().min(1, 'O comentário não pode estar vazio.'),
});

export async function createCommentAction(postId: string, prevState: any, formData: FormData) {
  const validatedFields = CommentSchema.safeParse({
    author: formData.get('author'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false
    };
  }

  try {
    await createCommentInDb({ 
      postId, 
      author: validatedFields.data.author,
      content: validatedFields.data.content,
    });
    revalidatePath(`/posts/${postId}`);
    return { errors: {}, success: true };
  } catch (error) {
    return {
      errors: { _form: ['Falha ao adicionar o comentário.'] },
      success: false
    }
  }
}