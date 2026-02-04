import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Post } from '@/types';
import { format } from 'date-fns';

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="block h-full group">
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out border-2 shadow-md group-hover:shadow-xl group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={post.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
            ))}
          </div>
          <CardTitle className="mb-2 text-xl leading-tight font-headline">
            {post.title}
          </CardTitle>
          <p className="flex-grow text-sm text-muted-foreground">
            {post.content.substring(0, 100)}...
          </p>
        </CardContent>
        <CardFooter className="flex items-center gap-4 p-6 pt-0">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.authorImage} alt={post.author} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{post.author}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
