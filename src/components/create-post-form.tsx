'use client';

import { useFormState } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createPostAction } from '@/app/actions';
import { SubmitButton } from './submit-button';

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPostAction, { errors: {} });

  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-6">
          <div className='space-y-2'>
            <Label htmlFor="title" className="text-base">Título</Label>
            <Input id="title" name="title" className="text-lg h-11" />
            {state.errors?.title && <p className="mt-1 text-sm text-destructive">{state.errors.title[0]}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="subtitle" className="text-base">Subtítulo</Label>
            <Input id="subtitle" name="subtitle" />
            {state.errors?.subtitle && <p className="mt-1 text-sm text-destructive">{state.errors.subtitle[0]}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="content" className="text-base">Conteúdo (Reportagem)</Label>
            <Textarea id="content" name="content" className="mt-2" rows={20} />
            {state.errors?.content && <p className="mt-1 text-sm text-destructive">{state.errors.content[0]}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="imageUrl" className="text-base">URL da Imagem</Label>
            <Input id="imageUrl" name="imageUrl" placeholder="https://picsum.photos/seed/..." />
            {state.errors?.imageUrl && <p className="mt-1 text-sm text-destructive">{state.errors.imageUrl[0]}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="imageHint" className="text-base">Dica para Imagem (IA)</Label>
            <Input id="imageHint" name="imageHint" placeholder="ex: filosofia abstrata" />
            <p className="mt-1 text-sm text-muted-foreground">
              Duas ou três palavras para busca de imagens.
            </p>
            {state.errors?.imageHint && <p className="mt-1 text-sm text-destructive">{state.errors.imageHint[0]}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="tags" className="text-base">Tags</Label>
            <Input id="tags" name="tags" placeholder="ex: ética, tecnologia, mente" />
            <p className="mt-1 text-sm text-muted-foreground">
              Tags separadas por vírgula.
            </p>
            {state.errors?.tags && <p className="mt-1 text-sm text-destructive">{state.errors.tags[0]}</p>}
          </div>
          
          {state.errors?._form && <p className="text-sm text-destructive">{state.errors._form[0]}</p>}

          <SubmitButton pendingText="Publicando Post...">Publicar Post</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
