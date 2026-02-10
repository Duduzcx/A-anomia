'use server';

import { z } from 'zod';
import { createPost, updatePost, deletePost as deletePostFromDb, createComment as createCommentInDb } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateBlogPost } from '@/ai/flows/generate-blog-post';
import { refineBlogPost } from '@/ai/flows/refine-blog-post';

const PostSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  subtitle: z.string().min(3, { message: 'O subtítulo deve ter pelo menos 3 caracteres.' }),
  content: z.string().min(10, { message: 'O conteúdo deve ter pelo menos 10 caracteres.' }),
  imageUrl: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }),
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
  
  const tags = validatedFields.data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [];

  let newPost;
  try {
    newPost = await createPost({ 
      title: validatedFields.data.title, 
      subtitle: validatedFields.data.subtitle,
      content: validatedFields.data.content,
      tags,
      imageUrl: validatedFields.data.imageUrl,
      imageHint: validatedFields.data.imageHint || 'filosofia abstrata'
    });
  } catch (error) {
    return {
      errors: { _form: ['Falha ao criar o post.'] }
    }
  }

  revalidatePath('/');
  redirect(`/posts/${newPost.id}`);
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

    const tags = validatedFields.data.tags?.split(',').map(tag => tag.trim()).filter(Boolean) ?? [];

    try {
        await updatePost(id, {
            title: validatedFields.data.title,
            subtitle: validatedFields.data.subtitle,
            content: validatedFields.data.content,
            tags,
            imageUrl: validatedFields.data.imageUrl,
            imageHint: validatedFields.data.imageHint || 'filosofia abstrata',
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
        await deletePostFromDb(id);
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
      errors: { _form: ['Falha ao adicionar o comentário.'] }
    }
  }
}

export async function generatePostAction(topic: string) {
  if (!topic) {
    return { error: 'O tópico não pode estar vazio.' };
  }
  try {
    const result = await generateBlogPost({ topic });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Falha ao gerar post com IA.' };
  }
}

export async function refinePostAction(title: string, content: string) {
  if (!title || !content) {
    return { error: 'O título e o conteúdo não podem estar vazios.' };
  }
  try {
    const result = await refineBlogPost({ title, content });
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Falha ao refinar post com IA.' };
  }
}
