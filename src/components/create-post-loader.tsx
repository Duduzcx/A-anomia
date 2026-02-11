'use client';

import dynamic from 'next/dynamic';

const CreatePostForm = dynamic(() => import('@/components/create-post-form'), {
  ssr: false,
  loading: () => (
    <div className="w-full text-center p-8">
      <p>Carregando formulário...</p>
    </div>
  ),
});

export default function CreatePostLoader() {
  return <CreatePostForm />;
}
