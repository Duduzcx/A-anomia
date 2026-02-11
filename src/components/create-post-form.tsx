'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createPostAction } from '@/app/actions';
import { SubmitButton } from './submit-button';
import { Button } from './ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { generatePostAction } from '@/app/ai-actions';

export default function CreatePostForm() {
  const [createState, createFormAction] = useActionState(createPostAction, { errors: {} });
  
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    const result = await generatePostAction(topic);
    setIsGenerating(false);
    if (result.error) {
      setGenerateError(result.error);
    } else if (result.data) {
      setTitle(result.data.title);
      setSubtitle(result.data.subtitle);
      setContent(result.data.content);
    }
  };

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gerar Post com IA</CardTitle>
          <CardDescription>
            Insira um tema filosófico e deixe a IA criar um rascunho para você.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Tema para a IA</Label>
            <Input id="topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: A natureza do tempo" />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating || !topic}>
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar com IA
              </>
            )}
          </Button>
          {generateError && <p className="mt-2 text-sm text-destructive">{generateError}</p>}
        </CardContent>
      </Card>

      <form action={createFormAction} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Escreva e Publique seu Post</CardTitle>
            <CardDescription>Preencha os campos abaixo para criar um novo artigo para o blog.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
              <div className='space-y-2'>
                <Label htmlFor="title" className="text-base">Título</Label>
                <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg h-11" />
                {createState.errors?.title && <p className="mt-1 text-sm text-destructive">{createState.errors.title[0]}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor="subtitle" className="text-base">Subtítulo</Label>
                <Input id="subtitle" name="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                {createState.errors?.subtitle && <p className="mt-1 text-sm text-destructive">{createState.errors.subtitle[0]}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor="content" className="text-base">Conteúdo</Label>
                <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} className="mt-2" rows={20} />
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
