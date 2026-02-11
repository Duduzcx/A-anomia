import { getPostById } from "@/lib/data";
import { notFound } from "next/navigation";
import EditPostLoader from "@/components/edit-post-loader";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container max-w-4xl px-4 py-12 mx-auto">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline">Editar Post</h1>
        <p className="text-muted-foreground">
          Refine o conteúdo do seu post, atualize as tags e salve suas alterações.
        </p>
      </div>
      <EditPostLoader post={post} />
    </div>
  );
}
