import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';
import { Card, CardContent } from './ui/card';

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out border-border group bg-secondary hover:-translate-y-2">
      <Link href={`/posts/${post.id}`} className="flex flex-col h-full">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={post.imageHint}
          />
        </div>
        <CardContent className="flex flex-col flex-grow p-4">
          {post.tags && post.tags.length > 0 && <p className="text-sm font-semibold text-primary">{post.tags.join(' / ')}</p>}
          <h3 className="mt-2 text-lg font-bold leading-tight transition-colors text-foreground group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {post.subtitle}
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80">
            {post.content.substring(0, 80)}...
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
