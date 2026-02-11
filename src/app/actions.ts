'use server';

import { z } from 'zod';
import { createPost, updatePost, deletePostAndComments, createCommentInDb, getPostById } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { refineBlogPost } from '@/ai/flows/refine-blog-post';

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

export async function refinePostAction(title: string, content: string) {
  if (!title || !content) {
    return { error: 'O título e o conteúdo não podem estar vazios.' };
  }
  try {
    const result = await refineBlogPost({ title, content });
    return { data: result };
  } catch (e: any) {
    console.error(e);
    return { error: `Falha ao refinar post com IA: ${e.message}` };
  }
}
