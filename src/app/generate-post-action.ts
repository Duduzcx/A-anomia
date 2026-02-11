'use server';

import { generateBlogPost } from '@/ai/flows/generate-blog-post';

export async function generatePostAction(topic: string) {
  if (!topic) {
    return { error: 'O tópico não pode estar vazio.' };
  }
  try {
    const result = await generateBlogPost({ topic });
    return { data: result };
  } catch (e: any) {
    console.error(e);
    return { error: `Falha ao gerar post com IA: ${e.message}` };
  }
}
