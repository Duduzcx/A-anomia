export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorImage: string;
  date: string;
  tags: string[];
  imageUrl: string;
  imageHint: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}
