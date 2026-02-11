import CreatePostLoader from '@/components/create-post-loader';

export default function NewPostPage() {
  return (
    <div className="container max-w-4xl px-4 py-12 mx-auto">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline">Criar um Novo Post</h1>
        <p className="text-muted-foreground">
          Escreva um novo artigo para o blog preenchendo os campos abaixo.
        </p>
      </div>
      <CreatePostLoader />
    </div>
  );
}
