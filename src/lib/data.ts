import type { Post, Comment } from '@/types';
import fs from 'fs/promises';
import path from 'path';

// This is a simple file-based database.
// In a real-world application, you would use a proper database.

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

async function readDb(): Promise<{ posts: Post[], comments: Comment[] }> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        // If the file doesn't exist or there's an error, return initial structure
        if (error.code === 'ENOENT') {
            const initialData = {
              posts: [],
              comments: []
            };
            await writeDb(initialData);
            return initialData;
        }
        console.error("Error reading database file:", error);
        return { posts: [], comments: [] };
    }
}

async function writeDb(data: { posts: Post[], comments: Comment[] }): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export async function getPosts(): Promise<Post[]> {
  const { posts } = await readDb();
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const { posts } = await readDb();
  return posts.find(p => p.id === id);
}

export async function createPost(postData: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>): Promise<Post> {
  const db = await readDb();
  const newPost: Post = {
    ...postData,
    id: generateId(),
    date: new Date().toISOString(),
    author: 'Klebsu', // Hardcoded for now
    authorImage: 'https://picsum.photos/seed/authorKlebsu/40/40',
  };
  db.posts.unshift(newPost);
  await writeDb(db);
  return newPost;
}

export async function updatePost(id: string, postData: Partial<Omit<Post, 'id'>>): Promise<Post | undefined> {
  const db = await readDb();
  const postIndex = db.posts.findIndex(p => p.id === id);
  if (postIndex === -1) return undefined;
  
  const updatedPost = { ...db.posts[postIndex], ...postData };
  db.posts[postIndex] = updatedPost;
  await writeDb(db);
  return updatedPost;
}

export async function deletePost(id: string): Promise<void> {
  const db = await readDb();
  const initialPostCount = db.posts.length;
  db.posts = db.posts.filter(p => p.id !== id);
  
  if (db.posts.length < initialPostCount) {
      db.comments = db.comments.filter(c => c.postId !== id);
      await writeDb(db);
  }
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const { comments } = await readDb();
  return comments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createComment(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  const db = await readDb();
  const newComment: Comment = {
    ...commentData,
    id: generateId(),
    date: new Date().toISOString(),
  };
  db.comments.push(newComment);
  await writeDb(db);
  return newComment;
}
