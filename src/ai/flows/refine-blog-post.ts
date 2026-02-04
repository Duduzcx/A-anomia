'use server';

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
  title: z.string().describe('The current title of the blog post.'),
  content: z.string().describe('The draft content of the blog post.'),
});
export type RefineBlogPostInput = z.infer<typeof RefineBlogPostInputSchema>;

const RefineBlogPostOutputSchema = z.object({
  refinedTitle: z.string().describe('The refined title of the blog post.'),
  refinedContent: z.string().describe('The refined content of the blog post.'),
});
export type RefineBlogPostOutput = z.infer<typeof RefineBlogPostOutputSchema>;

export async function refineBlogPost(input: RefineBlogPostInput): Promise<RefineBlogPostOutput> {
  return refineBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineBlogPostPrompt',
  input: {schema: RefineBlogPostInputSchema},
  output: {schema: RefineBlogPostOutputSchema},
  prompt: `You are a contemporary blog writer specializing in philosophy, with a clear, reflective, and accessible language for a general audience. Refine the following blog post to improve its clarity, tone, and philosophical depth, making it more engaging and thought-provoking.

Follow these guidelines:
- Write like a modern blog, not an academic article.
- Use simple, reflective, and provocative language.
- Use examples from everyday life, culture, the internet, and modern life.
- Adopt an essayistic style, almost like an intelligent conversation.
- Avoid sounding like a professor explaining.
- Provoke the reader with questions.
- Do not be too neutral; take a philosophical stance.

Keep the following structure:
- Title: Reflective and catchy.
- Introduction: Short (1-2 paragraphs), presenting a common situation connected to a philosophical problem.
- Development: Explain the central philosophical idea, cite philosophers (Plato, Nietzsche, Kant, Foucault, etc.) without excessive formality, and relate it to the current world.
- Critical Reflection: Question common beliefs and point out paradoxes or contradictions.
- Closing: Conclude with a question or provocation, inviting the reader to think.

Original Title: {{{title}}}
Original Content: {{{content}}}

Refined Title: // provide a better title for the article
Refined Content: // The complete refined blog post content, following the above guidelines and structure.
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
