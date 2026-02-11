import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center px-4">
      <h1 className="text-6xl font-bold font-headline text-primary md:text-9xl">404</h1>
      <h2 className="mt-4 text-2xl font-semibold md:text-4xl text-foreground">Página Não Encontrada</h2>
      <div className="max-w-2xl mx-auto mt-6">
        <p className="text-lg text-muted-foreground">
          Você se encontra em um espaço não normatizado. Na filosofia, a anomia representa um estado de ausência de regras, um colapso dos referenciais sociais.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
          Talvez este vazio não seja um erro, mas um convite à reflexão. O que você procura não está aqui... ou talvez a própria busca seja mais importante que o destino.
        </p>
      </div>
      <Button asChild className="mt-10" size="lg">
        <Link href="/">
          <ArrowLeft className="mr-2" />
          Voltar ao Início
        </Link>
      </Button>
    </div>
  );
}
