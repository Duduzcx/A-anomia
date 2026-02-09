import { getPosts } from '@/lib/data';
import PostCard from '@/components/post-card';
import { Suspense } from 'react';
import AdminLogin from '@/components/AdminLogin';

export default async function Home({ searchParams }: { searchParams?: { query?: string; }; }) {
  const allPosts = await getPosts();
  const query = searchParams?.query?.toLowerCase() || '';

  const filteredPosts = allPosts.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.content.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  );

  return (
    <>
      <div className="container py-8 mx-auto max-w-7xl sm:py-12">
        <div className="mb-8 text-center md:mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-center font-headline sm:text-5xl md:text-6xl">
            PhiloThoughts
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
            Exploring timeless questions in the modern world.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          {filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-muted-foreground">
              <h2 className="text-2xl font-semibold">No posts found</h2>
              <p className="mt-2">Try a different search term or check back later.</p>
            </div>
          )}
        </Suspense>
      </div>
      <AdminLogin />
    </>
  );
}
