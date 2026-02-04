import type { Post, Comment } from '@/types';
import { format } from 'date-fns';

// In-memory store
let posts: Post[] = [
  {
    id: '1',
    title: 'The Illusion of Obviousness',
    content: `Why do some ideas feel so self-evident? We navigate our lives guided by a set of "obvious" truths—common sense notions that help us make decisions quickly. But have you ever stopped to question where this obviousness comes from? When we say something is obvious, are we stating a fact about the world, or are we revealing more about our own perspectives and cultural conditioning?\n\nThe philosopher René Descartes built his entire system on the search for an indubitable, obvious truth. He found it in "I think, therefore I am." For him, the act of doubting itself was proof of his own existence. This became his foundational, obvious starting point. But most of our daily "obvious" truths are not so rigorously tested. They are inherited, absorbed from our environment. What is obvious to someone in one culture might be absurd to someone in another.\n\nThis is where philosophy becomes a powerful tool. It encourages us to peel back the layers of the self-evident. Think about the "obvious" idea that success means wealth and a career. Is it truly? Or is it a narrative we've been sold? Philosophers like Albert Camus might argue that the only truly obvious thing is the absurdity of our existence in a meaningless universe, and our task is to find our own meaning in spite of it. So, the next time you find yourself nodding along to an "obvious" point, pause. Ask yourself: obvious to whom? And why? What are you not seeing?`,
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-28T10:00:00Z',
    tags: ['Epistemology', 'Truth', 'Common Sense'],
    imageUrl: 'https://picsum.photos/seed/post1/1200/800',
    imageHint: 'abstract light',
  },
  {
    id: '2',
    title: 'Your Digital Self: More Real Than You Think?',
    content: `We curate our digital lives with meticulous care. The photos we post, the opinions we share, the profiles we build—they form a digital persona. But is this persona just a mask, or is it becoming a more authentic version of ourselves? In an age dominated by social media, the line between our "real" self and our online self is blurring into non-existence. Are we performing for an audience, or are we genuinely expressing who we are?\n\nJean-Paul Sartre, an existentialist, famously said, "existence precedes essence." This means we are not born with a fixed nature; we create ourselves through our actions and choices. In the digital realm, every post, like, and share is a choice that defines our online essence. This curated self isn't necessarily fake; it's a constructed self, just as our offline self is. The difference is the scale and the permanence. Our digital footprints are vast and, often, indelible.\n\nThis raises critical questions about authenticity. Is it possible to be authentic online when algorithms reward certain types of behavior over others? We are nudged towards outrage, positivity, or whatever generates the most engagement. Michel Foucault's ideas about power and discipline are surprisingly relevant here. He argued that power isn't just a top-down force; it's a network of relations that shapes our behavior. Social media platforms are a modern-day Panopticon, a prison where we are constantly aware of being watched, and so we discipline ourselves to conform. So, is your digital self a product of your freedom, or a testament to your conformity?`,
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-25T14:30:00Z',
    tags: ['Existentialism', 'Technology', 'Social Media'],
    imageUrl: 'https://picsum.photos/seed/post2/1200/800',
    imageHint: 'social media',
  },
];

let comments: Comment[] = [
    { id: '1', postId: '1', author: 'Sophia', content: 'This really made me think about my own assumptions. Great post!', date: '2024-07-28T12:00:00Z' },
    { id: '2', postId: '1', author: 'David', content: 'I disagree. Some things are just universally obvious, like 2+2=4.', date: '2024-07-28T13:00:00Z' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulating API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getPosts(): Promise<Post[]> {
  await delay(100);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostById(id: string): Promise<Post | undefined> {
  await delay(100);
  return posts.find(p => p.id === id);
}

export async function createPost(postData: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>): Promise<Post> {
  await delay(500);
  const newPost: Post = {
    ...postData,
    id: generateId(),
    date: new Date().toISOString(),
    author: 'Alexandre P.', // Hardcoded for now
    authorImage: 'https://picsum.photos/seed/author1/40/40',
  };
  posts.unshift(newPost);
  return newPost;
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<Post | undefined> {
  await delay(500);
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return undefined;
  posts[postIndex] = { ...posts[postIndex], ...postData };
  return posts[postIndex];
}

export async function deletePost(id: string): Promise<void> {
  await delay(500);
  posts = posts.filter(p => p.id !== id);
  comments = comments.filter(c => c.postId !== id);
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  await delay(100);
  return comments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function createComment(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  await delay(300);
  const newComment: Comment = {
    ...commentData,
    id: generateId(),
    date: new Date().toISOString(),
  };
  comments.push(newComment);
  return newComment;
}
