import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPosts } from '@/lib/data';
import PostCard from '@/components/post-card';
import { Suspense } from 'react';

export default async function HomePage({ searchParams }: { searchParams?: { query?: string; }; }) {
  const allPosts = await getPosts();
  const query = searchParams?.query?.toLowerCase() || '';

  const filteredPosts = allPosts.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.subtitle.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  );

  return (
    <div>
      <section className="relative w-full py-20 text-center text-white md:py-32 lg:py-40 animate-fade-in">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://picsum.photos/seed/philosophy-hero/1920/1080"
            alt="Fundo filosófico abstrato"
            fill
            className="object-cover"
            priority
            data-ai-hint="abstract philosophy"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container relative z-10 max-w-4xl px-4 mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 font-headline lg:text-6xl">
            Explore as Profundezas do Pensamento
          </h1>
          <p className="mt-6 text-lg text-gray-300 md:text-xl">
            "A Anomia" é o seu espaço para reflexão filosófica. Mergulhe em ensaios que desafiam o senso comum e exploram as grandes questões da vida, da ética à existência, em um mundo em constante mudança.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="#blog">
                Ler o Blog <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-secondary sm:py-28 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="container max-w-4xl px-4 mx-auto">
            <div className="p-8 text-center bg-background rounded-xl">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">O que é Anomia?</h2>
                <p className="max-w-2xl mx-auto mt-6 text-lg leading-relaxed text-muted-foreground">
                    O termo, popularizado pelo sociólogo Émile Durkheim, descreve um estado de ausência de normas sociais, onde os laços que unem os indivíduos à sociedade se enfraquecem. Em nosso blog, usamos a "anomia" como ponto de partida para questionar as normas, explorar vazios morais e buscar novos sentidos em um mundo complexo.
                </p>
            </div>
        </div>
      </section>

      <section id="blog" className="container px-4 py-16 mx-auto max-w-7xl sm:py-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold tracking-tight font-headline">
                    Últimas Publicações
                </h2>
            </div>
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
        </section>
    </div>
  );
}
