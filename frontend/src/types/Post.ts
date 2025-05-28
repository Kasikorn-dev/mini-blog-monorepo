// src/types/Post.ts
export interface Post {
  _id: string; // MongoDB's default ID
  title: string;
  content: string;
  createdAt: string; // Assuming ISO string date
  updatedAt?: string; // Optional, if your backend adds this
}

export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}
