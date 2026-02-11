import fs from 'fs/promises';
import path from 'path';
import type { Post, Comment } from '@/types';

type Db = {
  posts: Post[];
  comments: Comment[];
};

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

async function readDb(): Promise<Db> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return a default structure
    return { posts: [], comments: [] };
  }
}

async function writeDb(data: Db): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getPosts(): Promise<Post[]> {
  const db = await readDb();
  return db.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const db = await readDb();
  return db.posts.find(p => p.id === id);
}

export async function createPost(postData: Omit<Post, 'id' | 'date'>): Promise<Post> {
  const db = await readDb();
  const newPost: Post = {
    ...postData,
    id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toISOString(),
  };
  db.posts.push(newPost);
  await writeDb(db);
  return newPost;
}

export async function updatePost(id: string, postData: Partial<Omit<Post, 'id'>>): Promise<Post | undefined> {
  const db = await readDb();
  const postIndex = db.posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return undefined;
  }
  const updatedPost = { ...db.posts[postIndex], ...postData };
  db.posts[postIndex] = updatedPost;
  await writeDb(db);
  return updatedPost;
}

export async function deletePostAndComments(id: string): Promise<void> {
  const db = await readDb();
  db.posts = db.posts.filter(p => p.id !== id);
  db.comments = db.comments.filter(c => c.postId !== id);
  await writeDb(db);
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const db = await readDb();
  return db.comments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createCommentInDb(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  const db = await readDb();
  const newComment: Comment = {
    ...commentData,
    id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    date: new Date().toISOString(),
  };
  db.comments.push(newComment);
  await writeDb(db);
  return newComment;
}
