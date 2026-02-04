'use server';

import { z } from 'zod';
import { createPost, updatePost, deletePost as deletePostFromDb, createComment as createCommentInDb } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateBlogPost } from '@/ai/flows/generate-blog-post';
import { refineBlogPost } from '@/ai/flows/refine-blog-post';

const PostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long.' }),
  tags: z.string().optional(),
});

export async function createPostAction(prevState: any, formData: FormData) {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    tags: formData.get('tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const tags = validatedFields.data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [];

  try {
    const newPost = await createPost({ 
      title: validatedFields.data.title, 
      content: validatedFields.data.content,
      tags,
      imageUrl: `https://picsum.photos/seed/${Math.random()}/1200/800`, // random image
      imageHint: 'philosophy abstract'
    });
    revalidatePath('/');
    redirect(`/posts/${newPost.id}`);
  } catch (error) {
    return {
      errors: { _form: ['Failed to create post.'] }
    }
  }
}

export async function updatePostAction(id: string, prevState: any, formData: FormData) {
    const validatedFields = PostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        tags: formData.get('tags'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const tags = validatedFields.data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [];

    try {
        await updatePost(id, {
            title: validatedFields.data.title,
            content: validatedFields.data.content,
            tags,
        });
        revalidatePath('/');
        revalidatePath(`/posts/${id}`);
    } catch (error) {
        return {
            errors: { _form: ['Failed to update post.'] }
        }
    }
    redirect(`/posts/${id}`);
}

export async function deletePostAction(id: string) {
    try {
        await deletePostFromDb(id);
    } catch (e) {
        throw new Error('Failed to delete post');
    }
    revalidatePath('/');
    redirect('/');
}

const CommentSchema = z.object({
  author: z.string().min(2, 'Name must be at least 2 characters.'),
  content: z.string().min(1, 'Comment cannot be empty.'),
});

export async function createCommentAction(postId: string, prevState: any, formData: FormData) {
  const validatedFields = CommentSchema.safeParse({
    author: formData.get('author'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
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
      errors: { _form: ['Failed to add comment.'] }
    }
  }
}

export async function generatePostAction(topic: string) {
  if (!topic) {
    return { error: 'Topic cannot be empty.' };
  }
  try {
    const result = await generateBlogPost({ topic });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate blog post with AI.' };
  }
}

export async function refinePostAction(title: string, content: string) {
  if (!title || !content) {
    return { error: 'Title and content cannot be empty.' };
  }
  try {
    const result = await refineBlogPost({ title, content });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to refine blog post with AI.' };
  }
}
