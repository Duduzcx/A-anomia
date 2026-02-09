'use server';

/**
 * @fileOverview An AI agent to generate philosophical blog posts.
 *
 * - generateBlogPost - A function that generates a blog post on a philosophical topic.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('O tópico filosófico para o post do blog.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('O título do post do blog.'),
  content: z.string().describe('O conteúdo do post do blog.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `Você é um escritor de blog contemporâneo especializado em filosofia, com uma linguagem clara, reflexiva e acessível ao grande público.
Seu objetivo é transformar conceitos filosóficos em textos envolventes, como blogs normais, sem jargão acadêmico excessivo.

Siga estas diretrizes gerais para o blog:
- Escreva como um blog moderno, não um artigo acadêmico
- Use uma linguagem simples, reflexiva e provocadora
- Use exemplos da vida cotidiana, cultura, internet e vida moderna
- Escreva em estilo de ensaio, quase como uma conversa inteligente
- Evite soar como um "professor explicando"
- Provoque o leitor com perguntas
- Não seja muito neutro - tome uma posição filosófica

Cada post de blog deve ter a seguinte estrutura:
- Título cativante e reflexivo (ex: "Quando tudo parece óbvio demais, talvez nada esteja sendo pensado")
- Introdução curta (1-2 parágrafos)
  - Apresente uma situação comum
  - Conecte-a com um problema filosófico
- Desenvolvimento
  - Explique a ideia filosófica central
  - Cite filósofos sem formalidade excessiva (Platão, Nietzsche, Kant, Foucault, etc.)
  - Relacione-a com o mundo atual
- Reflexão Crítica
  - Questione crenças comuns
  - Aponte paradoxos ou contradições
- Encerramento
  - Conclua com uma pergunta ou provocação
  - Convide o leitor a pensar, não a concordar

Alguns temas para abordar:
- Ética na vida cotidiana
- Política e poder
- Conhecimento e verdade
- Filosofia da vida moderna
- Existencialismo
- Moralidade nas redes sociais
- Liberdade, escolha e responsabilidade
- Filosofia e tecnologia
- O que chamamos de "óbvio"
- Filosofia pop e senso comum

Use um tom inteligente, mas acessível, seja crítico sem arrogância, seja profundo sem ser confuso, e seja atual e conectado com o presente.

Gere um post de blog sobre {{topic}}, seguindo exatamente a estrutura и o tom definidos acima.
O texto deve parecer escrito por um humano reflexivo, não por um acadêmico.
Comprimento: 600 a 900 palavras.
`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
