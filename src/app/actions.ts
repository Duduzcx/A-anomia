'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import type { Post, Comment } from '@/types';

// Path to the JSON database file
const dbPath = path.resolve(process.cwd(), 'src/lib/db.json');

type DbData = {
  posts: Post[];
  comments: Comment[];
};

// Helper to read the database
function readDb(): DbData {
  try {
    const fileContent = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist or is empty, return a default structure
    return { posts: [], comments: [] };
  }
}

// Helper to write to the database
function writeDb(data: DbData) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getPosts(): Promise<Post[]> {
  const db = readDb();
  // Sort by date descending
  return db.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const db = readDb();
  return db.posts.find(p => p.id === id);
}

async function createPost(postData: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>): Promise<Post> {
  const db = readDb();
  const newPost: Post = {
    ...postData,
    id: Date.now().toString(), // Simple ID generation
    date: new Date().toISOString(),
    author: 'Klebsu', // Hardcoded as before
    authorImage: 'https://picsum.photos/seed/authorKlebsu/40/40',
  };
  
  db.posts.unshift(newPost); // Add to the beginning of the array
  writeDb(db);

  return newPost;
}

async function updatePost(id: string, postData: Partial<Omit<Post, 'id'>>): Promise<Post | undefined> {
  const db = readDb();
  const postIndex = db.posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return undefined;
  }

  const updatedPost = { ...db.posts[postIndex], ...postData };
  if(postData.date) {
    updatedPost.date = new Date(postData.date).toISOString();
  }

  db.posts[postIndex] = updatedPost as Post;
  writeDb(db);
  
  return updatedPost as Post;
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const db = readDb();
  const postComments = db.comments.filter(c => c.postId === postId);
  // Sort by date descending
  return postComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function createCommentInDb(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  const db = readDb();
  const newComment: Comment = {
    ...commentData,
    id: Date.now().toString() + Math.random().toString(36).substring(2), // Simple unique ID
    date: new Date().toISOString(),
  };

  db.comments.unshift(newComment);
  writeDb(db);

  return newComment;
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

function deletePostAndComments(id: string) {
    const db = readDb();
    
    const updatedPosts = db.posts.filter(p => p.id !== id);
    const updatedComments = db.comments.filter(c => c.postId !== id);

    writeDb({ posts: updatedPosts, comments: updatedComments });
}

export async function deletePostAction(id: string, formData: FormData) {
    try {
        deletePostAndComments(id);
    } catch (e: any) {
        console.error("Falha ao excluir o post:", e);
        throw new Error(`Falha ao excluir o post: ${e.message}`);
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
