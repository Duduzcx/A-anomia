'use client';

import { useActionState, useState } from 'react';
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

export default function CreatePostForm() {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState<{ title: string; subtitle: string; content: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [createState, createFormAction] = useActionState(createPostAction, { errors: {} });

  const handleGenerate = async () => {
    if (!topic) {
      setGenerateError('Por favor, insira um tópico.');
      return;
    }
    setIsGenerating(true);
    setGenerateError(null);
    const result = await generatePostAction(topic);
    setIsGenerating(false);
    if (result.error) {
      setGenerateError(result.error);
    } else if (result.data) {
      setGeneratedContent(result.data);
    }
  };
  
  const pickRandomTopic = () => {
    const randomTopic = philosophicalTopics[Math.floor(Math.random() * philosophicalTopics.length)];
    setTopic(randomTopic);
  };

  return (
    <div className="mt-8 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
       <form action={createFormAction} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Gerar com IA (Opcional)</CardTitle>
            <CardDescription>Insira um tópico filosófico para gerar um rascunho de post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="ex: A natureza do livre arbítrio"
                disabled={isGenerating}
                className="flex-grow"
              />
              <Button type="button" variant="outline" onClick={pickRandomTopic} disabled={isGenerating} className='w-full sm:w-auto'>
                Estou com sorte
              </Button>
            </div>
            <Button type="button" onClick={handleGenerate} disabled={isGenerating || !topic}>
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Gerar Rascunho
                </>
              )}
            </Button>
            {generateError && <p className="text-sm text-destructive">{generateError}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Escreva e Publique seu Post</CardTitle>
            <CardDescription>Edite o conteúdo gerado ou escreva do zero, preencha os campos e publique.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
              <div className='space-y-2'>
                <Label htmlFor="title" className="text-base">Título</Label>
                <Input id="title" name="title" defaultValue={generatedContent?.title ?? ''} className="text-lg h-11" key={generatedContent?.title} />
                {createState.errors?.title && <p className="mt-1 text-sm text-destructive">{createState.errors.title[0]}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor="subtitle" className="text-base">Subtítulo</Label>
                <Input id="subtitle" name="subtitle" defaultValue={generatedContent?.subtitle ?? ''} key={generatedContent?.subtitle} />
                {createState.errors?.subtitle && <p className="mt-1 text-sm text-destructive">{createState.errors.subtitle[0]}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor="content" className="text-base">Conteúdo</Label>
                <Textarea id="content" name="content" defaultValue={generatedContent?.content ?? ''} className="mt-2" rows={20} key={generatedContent?.content}/>
                {createState.errors?.content && <p className="mt-1 text-sm text-destructive">{createState.errors.content[0]}</p>}
              </div>
              
              <div className='space-y-2'>
                <Label htmlFor="imageUrl" className="text-base">URL da Imagem</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="https://picsum.photos/seed/..." />
                {createState.errors?.imageUrl && <p className="mt-1 text-sm text-destructive">{createState.errors.imageUrl[0]}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor="imageHint" className="text-base">Dica para Imagem (IA)</Label>
                <Input id="imageHint" name="imageHint" placeholder="ex: filosofia abstrata" />
                <p className="mt-1 text-sm text-muted-foreground">
                  Duas ou três palavras para busca de imagens.
                </p>
                {createState.errors?.imageHint && <p className="mt-1 text-sm text-destructive">{createState.errors.imageHint[0]}</p>}
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
