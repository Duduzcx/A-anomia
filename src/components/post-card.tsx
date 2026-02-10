import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <div className="relative w-full h-40 mb-4">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-ai-hint={post.imageHint}
        />
      </div>
      <p className="text-sm font-bold text-primary">{post.tags[0]}</p>
      <h3 className="mt-1 text-xl font-bold leading-tight group-hover:text-primary/90 font-headline">
        {post.title}
      </h3>
    </Link>
  );
}
