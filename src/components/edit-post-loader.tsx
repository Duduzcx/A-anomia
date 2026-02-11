'use client';

import dynamic from 'next/dynamic';
import type { Post } from '@/types';

const EditPostForm = dynamic(() => import('@/components/edit-post-form'), {
  ssr: false,
  loading: () => (
    <div className="w-full text-center p-8">
      <p>Carregando editor...</p>
    </div>
  ),
});

export default function EditPostLoader({ post }: { post: Post }) {
  return <EditPostForm post={post} />;
}
