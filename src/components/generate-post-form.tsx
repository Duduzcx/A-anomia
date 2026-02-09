'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createPostAction, generatePostAction } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { SubmitButton } from './submit-button';

const philosophicalTopics = [
  "Ética no dia a dia",
  "Política e poder",
  "Conhecimento e verdade",
  "Filosofia da vida moderna",
  "Existencialismo",
  "Moralidade nas redes sociais",
  "Liberdade, escolha e responsabilidade",
  "Filosofia e tecnologia",
  "A natureza da consciência",
  "O sentido da vida"
];

export default function GeneratePostForm() {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState<{ title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createState, createFormAction] = useFormState(createPostAction, { errors: {} });

  const handleGenerate = async () => {
    if (!topic) {
      setError('Por favor, insira um tópico.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    const result = await generatePostAction(topic);
    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGeneratedContent(result.data);
    }
  };
  
  const pickRandomTopic = () => {
    const randomTopic = philosophicalTopics[Math.floor(Math.random() * philosophicalTopics.length)];
    setTopic(randomTopic);
  };

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>1. Gerar com IA</CardTitle>
          <CardDescription>Insira um tópico filosófico para gerar um rascunho de post.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="ex: A natureza do livre arbítrio"
              disabled={isLoading}
              className="flex-grow"
            />
            <Button variant="outline" onClick={pickRandomTopic} disabled={isLoading} className='w-full sm:w-auto'>
              Estou com sorte
            </Button>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading || !topic}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Gerar Post
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>2. Revise e Salve</CardTitle>
            <CardDescription>Edite o conteúdo gerado e salve seu novo post.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createFormAction} className="space-y-6">
              <div className='space-y-2'>
                <Label htmlFor="title" className="text-base">Título</Label>
                <Input id="title" name="title" defaultValue={generatedContent.title} className="text-lg h-11" />
                {createState.errors?.title && <p className="mt-1 text-sm text-destructive">{createState.errors.title[0]}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor="content" className="text-base">Conteúdo</Label>
                <Textarea id="content" name="content" defaultValue={generatedContent.content} className="mt-2" rows={20} />
                {createState.errors?.content && <p className="mt-1 text-sm text-destructive">{createState.errors.content[0]}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor="tags" className="text-base">Tags</Label>
                <Input id="tags" name="tags" placeholder="ex: ética, tecnologia, mente" />
                <p className="mt-1 text-sm text-muted-foreground">
                  Tags separadas por vírgula.
                </p>
                {createState.errors?.tags && <p className="mt-1 text-sm text-destructive">{createState.errors.tags[0]}</p>}
              </div>

              {createState.errors?._form && <p className="text-sm text-destructive">{createState.errors._form[0]}</p>}
              
              <SubmitButton pendingText="Salvando Post...">Salvar Post</SubmitButton>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
