import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Post, Comment } from '@/types';

const POSTS_COLLECTION = 'posts';
const COMMENTS_COLLECTION = 'comments';

// Helper to convert Firestore post data to match app types
const postFromFirestore = (docSnap: { id: string; data: () => any; }): Post => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title || '',
    subtitle: data.subtitle || '',
    content: data.content || '',
    author: data.author || 'Anônimo',
    authorImage: data.authorImage || '',
    date: (data.date as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    tags: data.tags || [],
    imageUrl: data.imageUrl || '',
    imageHint: data.imageHint || '',
  };
};

// Helper to convert Firestore comment data to match app types
const commentFromFirestore = (docSnap: { id: string; data: () => any; }): Comment => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    postId: data.postId || '',
    author: data.author || 'Anônimo',
    content: data.content || '',
    date: (data.date as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
  };
};

export async function getPosts(): Promise<Post[]> {
  const postsCollection = collection(db, POSTS_COLLECTION);
  const q = query(postsCollection, orderBy('date', 'desc'));
  const postsSnapshot = await getDocs(q);
  return postsSnapshot.docs.map(postFromFirestore);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const postDocRef = doc(db, POSTS_COLLECTION, id);
  const postSnap = await getDoc(postDocRef);

  if (!postSnap.exists()) {
    return undefined;
  }
  return postFromFirestore(postSnap);
}

export async function createPost(postData: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>): Promise<Post> {
  const newPostData = {
    ...postData,
    date: new Date(),
    author: 'Klebsu', // Hardcoded for now
    authorImage: 'https://picsum.photos/seed/authorKlebsu/40/40',
  };
  
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPostData);

  return {
    ...newPostData,
    id: docRef.id,
    date: newPostData.date.toISOString(),
  };
}

export async function updatePost(id: string, postData: Partial<Omit<Post, 'id'>>): Promise<Post | undefined> {
  const postDocRef = doc(db, POSTS_COLLECTION, id);

  const dataToUpdate: { [key: string]: any } = { ...postData };
  if (dataToUpdate.date) {
    dataToUpdate.date = new Date(dataToUpdate.date);
  }

  await updateDoc(postDocRef, dataToUpdate);
  return await getPostById(id);
}

export async function deletePostAndComments(id: string): Promise<void> {
  const batch = writeBatch(db);
  
  const postDocRef = doc(db, POSTS_COLLECTION, id);
  batch.delete(postDocRef);
  
  const commentsQuery = query(collection(db, COMMENTS_COLLECTION), where('postId', '==', id));
  const commentsSnapshot = await getDocs(commentsQuery);
  
  commentsSnapshot.forEach(commentDoc => {
    batch.delete(commentDoc.ref);
  });
  
  await batch.commit();
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const q = query(collection(db, COMMENTS_COLLECTION), where('postId', '==', postId), orderBy('date', 'desc'));
  const commentsSnapshot = await getDocs(q);
  return commentsSnapshot.docs.map(commentFromFirestore);
}

export async function createCommentInDb(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  const newCommentData = {
    ...commentData,
    date: new Date(),
  };
  
  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), newCommentData);
  
  return {
    ...newCommentData,
    id: docRef.id,
    date: newCommentData.date.toISOString(),
  };
}
