import GeneratePostForm from "@/components/generate-post-form";

export default function NewPostPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline">Criar um Novo Post</h1>
        <p className="text-muted-foreground">
          Comece gerando um post com IA, depois refine e salve.
        </p>
      </div>
      <GeneratePostForm />
    </div>
  );
}
