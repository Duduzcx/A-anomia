'use client';

import { useActionState, useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { updatePostAction } from '@/app/actions';
import type { Post } from '@/types';
import { SubmitButton } from './submit-button';
import { generateImageAction } from '@/app/ai-actions';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import Image from 'next/image';

type EditPostFormProps = {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [imageHint, setImageHint] = useState(post.imageHint);
  const [tags, setTags] = useState(post.tags.join(', '));

  const updatePostActionWithId = updatePostAction.bind(null, post.id);
  const [updateState, formAction] = useActionState(updatePostActionWithId, { errors: {} });

  // New state for AI image generator
  const [isGenerating, startTransition] = useTransition();
  const [imagePrompt, setImagePrompt] = useState(post.imageHint || '');
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerateImage = () => {
    setGenerationError(null);
    startTransition(async () => {
      if (!imagePrompt) {
        setGenerationError('Por favor, descreva a imagem que você deseja criar.');
        return;
      }
      const result = await generateImageAction(imagePrompt);
      if (result.error) {
        setGenerationError(result.error);
      } else if (result.data?.imageUrl) {
        setImageUrl(result.data.imageUrl);
        setImageHint(imagePrompt);
      }
    });
  };

  return (
    <div className="mt-8 space-y-8">
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 />
            Gerador de Imagem com IA
          </CardTitle>
          <CardDescription>
            Não consegue encontrar uma imagem? Descreva o que você quer e deixe a IA criar uma nova.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imagePrompt">Descrição da Imagem</Label>
            <div className="flex gap-2">
              <Input
                id="imagePrompt"
                name="imagePrompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Ex: um astronauta meditando em marte"
                disabled={isGenerating}
              />
              <Button type="button" onClick={handleGenerateImage} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Gerar Nova Imagem'
                )}
              </Button>
            </div>
            {generationError && <p className="mt-2 text-sm text-destructive">{generationError}</p>}
          </div>
          {isGenerating && (
             <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg border-border bg-background/50">
                <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary" />
                <p className="text-muted-foreground">Criando sua imagem... Isso pode levar um minuto.</p>
            </div>
          )}
          {imageUrl && !isGenerating && (
            <div className="space-y-2">
              <Label>Prévia da Imagem</Label>
              <div className="relative w-full overflow-hidden border rounded-lg aspect-video border-border">
                <Image src={imageUrl} alt="Imagem do post" fill className="object-cover" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Post</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form action={formAction} className="space-y-6">
            <div className='space-y-2'>
              <Label htmlFor="title" className="text-base">Título</Label>
              <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg h-11" />
              {updateState.errors?.title && <p className="mt-1 text-sm text-destructive">{updateState.errors.title[0]}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor="subtitle" className="text-base">Subtítulo</Label>
              <Input id="subtitle" name="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              {updateState.errors?.subtitle && <p className="mt-1 text-sm text-destructive">{updateState.errors.subtitle[0]}</p>}
            </div>

            <div className='space-y-2'>
              <div className="flex items-center justify-between">
                <Label htmlFor="content" className="text-base">Conteúdo</Label>
              </div>
              <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} className="mt-2" rows={20} />
              {updateState.errors?.content && <p className="mt-1 text-sm text-destructive">{updateState.errors.content[0]}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor="imageUrl" className="text-base">URL da Imagem</Label>
              <Input id="imageUrl" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <p className="mt-1 text-sm text-muted-foreground">
                Use o gerador de IA acima ou cole uma URL aqui. Se o campo ficar vazio, uma imagem aleatória será usada.
              </p>
              {updateState.errors?.imageUrl && <p className="mt-1 text-sm text-destructive">{updateState.errors.imageUrl[0]}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor="imageHint" className="text-base">Dica para Imagem (IA)</Label>
              <Input id="imageHint" name="imageHint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} />
              {updateState.errors?.imageHint && <p className="mt-1 text-sm text-destructive">{updateState.errors.imageHint[0]}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor="tags" className="text-base">Tags</Label>
              <Input id="tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ex: ética, tecnologia, mente" />
              <p className="mt-1 text-sm text-muted-foreground">
                Tags separadas por vírgula.
              </p>
              {updateState.errors?.tags && <p className="mt-1 text-sm text-destructive">{updateState.errors.tags[0]}</p>}
            </div>
            
            {updateState.errors?._form && <p className="text-sm text-destructive">{updateState.errors._form[0]}</p>}

            <SubmitButton pendingText="Salvando Alterações...">Salvar Alterações</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
