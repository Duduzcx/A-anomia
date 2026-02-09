import { getPostById, getCommentsByPostId } from '@/lib/data';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import CommentSection from '@/components/comment-section';
import PostActions from '@/components/PostActions';

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  
  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostId(params.id);

  return (
    <article className="container max-w-4xl py-8 mx-auto sm:py-12">
      <div className="mb-8 space-y-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-headline md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.authorImage} alt={post.author} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{post.author}</span>
          </div>
          <span>&middot;</span>
          <time dateTime={post.date}>
            {format(new Date(post.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </time>
        </div>
      </div>

      <div className="relative w-full h-64 mb-12 md:h-96 rounded-2xl overflow-hidden shadow-lg">
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

      <div className="mx-auto space-y-6 text-lg leading-relaxed max-w-prose text-foreground/90">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && <p key={index}>{paragraph}</p>
        ))}
      </div>

      <PostActions postId={post.id} />

      <CommentSection postId={post.id} comments={comments} />
    </article>
  );
}
