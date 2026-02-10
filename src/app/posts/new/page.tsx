import CreatePostForm from "@/components/create-post-form";
import GeneratePostForm from "@/components/generate-post-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewPostPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline">Criar um Novo Post</h1>
        <p className="text-muted-foreground">
          Escreva um artigo do zero ou gere um rascunho usando Inteligência Artificial.
        </p>
      </div>

      <Tabs defaultValue="scratch" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scratch">Escrever do Zero</TabsTrigger>
          <TabsTrigger value="ai">Gerar com IA</TabsTrigger>
        </TabsList>
        <TabsContent value="scratch">
          <CreatePostForm />
        </TabsContent>
        <TabsContent value="ai">
          <GeneratePostForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
