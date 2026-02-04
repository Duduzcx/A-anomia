import GeneratePostForm from "@/components/generate-post-form";

export default function NewPostPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold font-headline">Create a New Post</h1>
        <p className="text-muted-foreground">
          Start by generating a post with AI, then refine and save it.
        </p>
      </div>
      <GeneratePostForm />
    </div>
  );
}
