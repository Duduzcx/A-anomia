'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase-admin';
import type { Post, Comment } from '@/types';

const DB_ERROR_MESSAGE = 'Database not configured. Set FIREBASE_SERVICE_ACCOUNT environment variable.';

// Helper to convert Firestore doc to our Post type
function docToPost(doc: FirebaseFirestore.DocumentSnapshot): Post {
  const data = doc.data()!;
  return {
    id: doc.id,
    author: data.author,
    authorImage: data.authorImage,
    content: data.content,
    date: data.date,
    imageHint: data.imageHint,
    imageUrl: data.imageUrl,
    subtitle: data.subtitle,
    tags: data.tags,
    title: data.title,
  };
}

// Helper to convert Firestore doc to our Comment type
function docToComment(doc: FirebaseFirestore.DocumentSnapshot): Comment {
  const data = doc.data()!;
  return {
    id: doc.id,
    postId: data.postId,
    author: data.author,
    content: data.content,
    date: data.date,
  };
}


export async function getPosts(): Promise<Post[]> {
  if (!db) {
    console.warn(DB_ERROR_MESSAGE);
    return [];
  }

  try {
    const snapshot = await db.collection('posts').orderBy('date', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docToPost);
  } catch (error) {
    console.error("Error fetching posts from Firestore:", error);
    // Return empty array to prevent the app from crashing.
    return [];
  }
}

export async function getPostById(id: string): Promise<Post | undefined> {
  if (!db) {
    console.warn(DB_ERROR_MESSAGE);
    return undefined;
  }

  try {
    const doc = await db.collection('posts').doc(id).get();
    if (!doc.exists) {
      return undefined;
    }
    return docToPost(doc);
  } catch (error) {
    console.error(`Error fetching post with id ${id} from Firestore:`, error);
    // Return undefined to prevent the app from crashing.
    return undefined;
  }
}

async function createPost(postData: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>): Promise<Post> {
    if (!db) {
        throw new Error(DB_ERROR_MESSAGE);
    }
    const fullPostData = {
        ...postData,
        author: 'Klebsu',
        authorImage: 'https://picsum.photos/seed/authorKlebsu/40/40',
    };

    const newPostData = {
        ...fullPostData,
        date: new Date().toISOString(),
    };
  
    const docRef = await db.collection('posts').add(newPostData);
  
    return {
        id: docRef.id,
        ...newPostData
    };
}

async function updatePost(id: string, postData: Partial<Omit<Post, 'id'>>): Promise<Post | undefined> {
    if (!db) {
        throw new Error(DB_ERROR_MESSAGE);
    }

    const postRef = db.collection('posts').doc(id);
    const doc = await postRef.get();

    if (!doc.exists) {
        return undefined;
    }

    const updateData: { [key: string]: any } = { ...postData };
    if (postData.date) {
        updateData.date = new Date(postData.date).toISOString();
    }

    await postRef.update(updateData);
    
    const updatedDoc = await postRef.get();
    return docToPost(updatedDoc);
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  if (!db) {
    console.warn(DB_ERROR_MESSAGE);
    return [];
  }

  try {
    const snapshot = await db.collection('comments').where('postId', '==', postId).orderBy('date', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(docToComment);
  } catch (error) {
    console.error(`Error fetching comments for post ${postId} from Firestore:`, error);
    // Return empty array to prevent the app from crashing.
    return [];
  }
}

async function createCommentInDb(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  if (!db) {
    throw new Error(DB_ERROR_MESSAGE);
  }
  
  const newCommentData = {
    ...commentData,
    date: new Date().toISOString(),
  };

  const docRef = await db.collection('comments').add(newCommentData);

  return {
    id: docRef.id,
    ...newCommentData
  };
}

async function deletePostAndComments(id: string) {
    if (!db) {
        throw new Error(DB_ERROR_MESSAGE);
    }

    const postRef = db.collection('posts').doc(id);
    const commentsSnapshot = await db.collection('comments').where('postId', '==', id).get();

    const batch = db.batch();

    commentsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });

    batch.delete(postRef);

    await batch.commit();
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

  try {
    await createPost({ 
      title: data.title, 
      subtitle: data.subtitle,
      content: data.content,
      tags,
      imageUrl: imageUrl,
      imageHint: data.imageHint || 'filosofia abstrata'
    });
  } catch (error: any) {
    console.error("Database Error:", error);
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
    } catch (error: any) {
      console.error("Database Error:", error);
      return {
          errors: { _form: [`Falha ao atualizar o post: ${error.message}`] }
      }
    }

    revalidatePath('/');
    revalidatePath(`/posts/${id}`);
    redirect(`/posts/${id}`);
}

export async function deletePostAction(id: string, formData: FormData) {
    try {
        await deletePostAndComments(id);
    } catch (e: any) {
        console.error("Falha ao excluir o post:", e);
        // This is a workaround to show the error on the client until redirects can be fixed
        redirect(`/?error=${encodeURIComponent(e.message)}`);
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
  } catch (error: any) {
    console.error("Database Error:", error);
    return {
      errors: { _form: [`Falha ao adicionar o comentário: ${error.message}`] },
      success: false
    }
  }
}
