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
        <Suspense fallback={<div>Carregando...</div>}>
          {filteredPosts.length > 0 ? (
             <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-muted-foreground">
              <h2 className="text-2xl font-semibold">Nenhum post encontrado</h2>
              <p className="mt-2">Tente um termo de busca diferente ou volte mais tarde.</p>
            </div>
          )}
        </Suspense>
      </div>
      <AdminLogin />
    </>
  );
}
