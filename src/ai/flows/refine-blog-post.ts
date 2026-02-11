/**
 * @fileOverview A flow to refine a draft blog post using AI to improve its clarity, tone, and philosophical depth.
 *
 * - refineBlogPost - A function that refines a draft blog post.
 * - RefineBlogPostInput - The input type for the refineBlogPost function.
 * - RefineBlogPostOutput - The return type for the refineBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineBlogPostInputSchema = z.object({
  title: z.string().describe('O título atual do post do blog.'),
  content: z.string().describe('O conteúdo do rascunho do post do blog.'),
});
export type RefineBlogPostInput = z.infer<typeof RefineBlogPostInputSchema>;

const RefineBlogPostOutputSchema = z.object({
  refinedTitle: z.string().describe('O título refinado do post do blog.'),
  refinedContent: z.string().describe('O conteúdo refinado do post do blog.'),
});
export type RefineBlogPostOutput = z.infer<typeof RefineBlogPostOutputSchema>;

export async function refineBlogPost(input: RefineBlogPostInput): Promise<RefineBlogPostOutput> {
  return refineBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineBlogPostPrompt',
  input: {schema: RefineBlogPostInputSchema},
  output: {schema: RefineBlogPostOutputSchema},
  prompt: `Você é um escritor de blog contemporâneo especializado em filosofia, com uma linguagem clara, reflexiva e acessível para um público geral. Refine o seguinte post de blog para melhorar sua clareza, tom e profundidade filosófica, tornando-o mais envolvente e instigante.

Siga estas diretrizes:
- Escreva como um blog moderno, não um artigo acadêmico.
- Use uma linguagem simples, reflexiva e provocadora.
- Use exemplos da vida cotidiana, cultura, internet e vida moderna.
- Adote um estilo ensaístico, quase como uma conversa inteligente.
- Evite soar como um professor explicando.
- Provoque o leitor com perguntas.
- Não seja muito neutro; tome uma posição filosófica.

Mantenha a seguinte estrutura:
- Título: Reflexivo e cativante.
- Introdução: Curta (1-2 parágrafos), apresentando uma situação comum conectada a um problema filosófico.
- Desenvolvimento: Explique a ideia filosófica central, cite filósofos (Platão, Nietzsche, Kant, Foucault, etc.) sem formalidade excessiva e relacione-a com o mundo atual.
- Reflexão Crítica: Questione crenças comuns e aponte paradoxos ou contradições.
- Encerramento: Conclua com uma pergunta ou provocação, convidando o leitor a pensar.

Título Original: {{{title}}}
Conteúdo Original: {{{content}}}

Título Refinado: // forneça um título melhor para o artigo
Conteúdo Refinado: // O conteúdo completo e refinado do post, seguindo as diretrizes e estrutura acima.
`,
});

const refineBlogPostFlow = ai.defineFlow(
  {
    name: 'refineBlogPostFlow',
    inputSchema: RefineBlogPostInputSchema,
    outputSchema: RefineBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
