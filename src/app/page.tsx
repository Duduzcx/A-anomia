import { getPosts } from '@/lib/data';
import PostCard from '@/components/post-card';
import { Suspense } from 'react';
import AdminLogin from '@/components/AdminLogin';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home({ searchParams }: { searchParams?: { query?: string; }; }) {
  const allPosts = await getPosts();
  const query = searchParams?.query?.toLowerCase() || '';

  const filteredPosts = allPosts.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.content.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  );

  const mainPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1, 3);
  const otherPosts = filteredPosts.slice(3);

  return (
    <>
      <div className="container py-8 mx-auto max-w-7xl sm:py-12">
        <Suspense fallback={<div>Carregando...</div>}>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Post */}
              {mainPost && (
                <div className="lg:col-span-2">
                    <Link href={`/posts/${mainPost.id}`} className="block group">
                      <div className="relative w-full mb-4 aspect-video">
                        <Image
                          src={mainPost.imageUrl}
                          alt={mainPost.title}
                          fill
                          className="object-cover rounded-lg"
                          priority
                          sizes="(max-width: 768px) 100vw, 832px"
                        />
                      </div>
                      <p className="text-sm font-bold text-primary">{mainPost.tags[0]}</p>
                      <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary/90 font-headline md:text-4xl">
                        {mainPost.title}
                      </h2>
                      <p className="mt-4 text-lg text-muted-foreground">
                        {mainPost.content.substring(0, 150)}...
                      </p>
                    </Link>
                </div>
              )}
              
              {/* Secondary Posts */}
              <div className="flex flex-col gap-8">
                {secondaryPosts.map(post => (
                  <Link href={`/posts/${post.id}`} key={post.id} className="block pb-4 border-b group border-border">
                     <p className="text-sm font-bold text-primary">{post.tags[0]}</p>
                     <h3 className="mt-1 text-xl font-bold leading-tight group-hover:text-primary/90 font-headline">
                       {post.title}
                     </h3>
                  </Link>
                ))}
              </div>

              {/* Other Posts Grid */}
              {otherPosts.length > 0 && (
                <div className="grid gap-x-8 gap-y-12 pt-8 border-t lg:col-span-3 md:grid-cols-2 lg:grid-cols-3 border-border">
                  {otherPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}

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
