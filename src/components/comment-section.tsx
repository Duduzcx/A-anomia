'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createCommentAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Comment } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SubmitButton } from './submit-button';

type CommentSectionProps = {
  postId: string;
  comments: Comment[];
};

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [state, formAction] = useActionState(createCommentAction.bind(null, postId), { errors: {}, success: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="pt-12 mt-12 border-t">
      <h2 className="mb-8 text-3xl font-bold font-headline">Participe da Conversa</h2>

      <Card className="mb-8 bg-card">
        <CardHeader>
          <CardTitle>Deixe um comentário</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className='space-y-2'>
              <Input name="author" placeholder="Seu Nome" aria-label="Seu Nome" />
              {state.errors?.author && <p className="text-sm text-destructive">{state.errors.author[0]}</p>}
            </div>

            <div className='space-y-2'>
              <Textarea name="content" placeholder="Quais são seus pensamentos?" aria-label="Seu comentário" rows={4} />
              {state.errors?.content && <p className="text-sm text-destructive">{state.errors.content[0]}</p>}
            </div>
            
            {state.errors?._form && <p className="text-sm text-destructive">{state.errors._form[0]}</p>}
            
            <SubmitButton pendingText='Publicando...'>Publicar Comentário</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold font-headline">
          {comments.length} {comments.length === 1 ? 'Comentário' : 'Comentários'}
        </h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {isClient
                      ? formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: ptBR })
                      : '...'}
                  </p>
                </div>
                <p className="mt-1 text-foreground/90">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted-foreground">Seja o primeiro a comentar.</p>
        )}
      </div>
    </div>
  );
}
