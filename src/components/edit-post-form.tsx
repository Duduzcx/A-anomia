'use client';

import { useActionState, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { updatePostAction, refinePostAction } from '@/app/actions';
import { Loader2, Sparkles } from 'lucide-react';
import type { Post } from '@/types';
import { SubmitButton } from './submit-button';

export default function EditPostForm({ post }: { post: Post }) {
  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [imageHint, setImageHint] = useState(post.imageHint);
  const [tags, setTags] = useState(post.tags.join(', '));
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const updatePostActionWithId = updatePostAction.bind(null, post.id);
  const [updateState, formAction] = useActionState(updatePostActionWithId, { errors: {} });

  const handleRefine = async () => {
    setIsRefining(true);
    setRefineError(null);
    const result = await refinePostAction(title, content);
    setIsRefining(false);
    if (result.error) {
      setRefineError(result.error);
    } else if (result.data) {
      setTitle(result.data.refinedTitle);
      setContent(result.data.refinedContent);
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
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
              <Button type="button" variant="outline" size="sm" onClick={handleRefine} disabled={isRefining}>
                {isRefining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Refinando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Refinar com IA
                  </>
                )}
              </Button>
            </div>
            {refineError && <p className="mt-1 text-sm text-destructive">{refineError}</p>}
            <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} className="mt-2" rows={20} />
            {updateState.errors?.content && <p className="mt-1 text-sm text-destructive">{updateState.errors.content[0]}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="imageUrl" className="text-base">URL da Imagem</Label>
            <Input id="imageUrl" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
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
  );
}
