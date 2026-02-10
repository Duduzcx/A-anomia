import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <section className="relative w-full py-20 text-center text-white md:py-32 lg:py-40">
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
        <div className="container relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 font-headline lg:text-6xl">
            Explore as Profundezas do Pensamento
          </h1>
          <p className="mt-6 text-lg text-gray-300 md:text-xl">
            "A Anomia" é o seu espaço para reflexão filosófica. Mergulhe em ensaios que desafiam o senso comum e exploram as grandes questões da vida, da ética à existência, em um mundo em constante mudança.
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href="/blog">
                Ler o Blog <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-background sm:py-24">
        <div className="container max-w-5xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">O que é Anomia?</h2>
                <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
                    O termo, popularizado pelo sociólogo Émile Durkheim, descreve um estado de ausência de normas sociais, onde os laços que unem os indivíduos à sociedade se enfraquecem. Em nosso blog, usamos a "anomia" como ponto de partida para questionar as normas, explorar vazios morais e buscar novos sentidos em um mundo complexo.
                </p>
            </div>
        </div>
      </section>
    </>
  );
}
