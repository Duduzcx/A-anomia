'use server';

import { refineBlogPost } from '@/ai/flows/refine-blog-post';

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
