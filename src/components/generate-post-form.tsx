'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createPostAction, generatePostAction } from '@/app/actions';
import { Loader2, Wand2 } from 'lucide-react';
import { SubmitButton } from './submit-button';

const philosophicalTopics = [
  "Ethics in everyday life",
  "Politics and power",
  "Knowledge and truth",
  "Philosophy of modern life",
  "Existentialism",
  "Morality on social media",
  "Freedom, choice, and responsibility",
  "Philosophy and technology",
  "The nature of consciousness",
  "The meaning of life"
];

export default function GeneratePostForm() {
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState<{ title: string; content: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createState, createFormAction] = useFormState(createPostAction, { errors: {} });

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    const result = await generatePostAction(topic);
    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setGeneratedContent(result.data);
    }
  };
  
  const pickRandomTopic = () => {
    const randomTopic = philosophicalTopics[Math.floor(Math.random() * philosophicalTopics.length)];
    setTopic(randomTopic);
  };

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>1. Generate with AI</CardTitle>
          <CardDescription>Enter a philosophical topic to generate a blog post draft.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The nature of free will"
              disabled={isLoading}
              className="flex-grow"
            />
            <Button variant="outline" onClick={pickRandomTopic} disabled={isLoading} className='w-full sm:w-auto'>
              I'm feeling lucky
            </Button>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading || !topic}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Post
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>2. Review and Save</CardTitle>
            <CardDescription>Edit the generated content and save your new post.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createFormAction} className="space-y-6">
              <div className='space-y-2'>
                <Label htmlFor="title" className="text-base">Title</Label>
                <Input id="title" name="title" defaultValue={generatedContent.title} className="text-lg h-11" />
                {createState.errors?.title && <p className="mt-1 text-sm text-destructive">{createState.errors.title[0]}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor="content" className="text-base">Content</Label>
                <Textarea id="content" name="content" defaultValue={generatedContent.content} className="mt-2" rows={20} />
                {createState.errors?.content && <p className="mt-1 text-sm text-destructive">{createState.errors.content[0]}</p>}
              </div>
              <div className='space-y-2'>
                <Label htmlFor="tags" className="text-base">Tags</Label>
                <Input id="tags" name="tags" placeholder="e.g., ethics, technology, mind" />
                <p className="mt-1 text-sm text-muted-foreground">
                  Comma-separated tags.
                </p>
                {createState.errors?.tags && <p className="mt-1 text-sm text-destructive">{createState.errors.tags[0]}</p>}
              </div>

              {createState.errors?._form && <p className="text-sm text-destructive">{createState.errors._form[0]}</p>}
              
              <SubmitButton pendingText="Saving Post...">Save Post</SubmitButton>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
