import { getPostById, getCommentsByPostId } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CommentSection from '@/components/comment-section';
import PostActions from '@/components/PostActions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  
  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostId(params.id);
  const paragraphs = post.content.split('\n').filter(p => p.trim() !== '');

  return (
    <>
      <div className="container max-w-4xl px-4 py-8 mx-auto sm:py-12 animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <header className="mb-8">
          <p className="text-base font-semibold text-primary">
            {post.tags.join(' / ')}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight font-headline md:text-5xl text-foreground">
            {post.title}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">{post.subtitle}</p>
          <div className="flex items-center gap-4 mt-6 py-3 text-sm border-t border-b border-border/50 text-muted-foreground">
            <span>Por <strong>{post.author}</strong></span>
            <time dateTime={post.date}>
              {format(new Date(post.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </time>
          </div>
        </header>

        <article>
          <div className="relative w-full h-64 my-8 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              data-ai-hint={post.imageHint}
            />
          </div>

          <div className="mx-auto space-y-6 text-lg leading-relaxed max-w-prose text-foreground/80">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <PostActions postId={post.id} />
        </article>

        <CommentSection postId={post.id} comments={comments} />
      </div>

      <div className="fixed bottom-8 right-8 z-50">
          <Button asChild size="icon" className="w-14 h-14 rounded-full shadow-lg animate-float">
              <Link href="/">
                  <ArrowLeft className="w-6 h-6" />
                  <span className="sr-only">Voltar para a página inicial</span>
              </Link>
          </Button>
      </div>
    </>
  );
}
