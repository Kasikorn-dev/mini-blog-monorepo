// src/pages/posts/index.tsx
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import React Query hooks
import api from "@/utils/api";
import { Post, CreatePostDto } from "@/types/Post";

const PostsPage = () => {
  const queryClient = useQueryClient(); // Get the query client instance
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // -------------------------
  // READ: Fetch Posts using useQuery
  // -------------------------
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"], // Unique key for this query
    queryFn: async () => {
      const response = await api.get<Post[]>("/posts");
      return response.data;
    },
  });

  // -------------------------
  // CREATE: Create Post using useMutation
  // -------------------------
  const createPostMutation = useMutation({
    mutationFn: async (newPostData: CreatePostDto) => {
      const response = await api.post<Post>("/posts", newPostData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch after a successful creation
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPostTitle("");
      setNewPostContent("");
    },
    onError: (err) => {
      console.error("Error creating post:", err);
      alert("Failed to create post: " + (err as any).message);
    },
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }
    createPostMutation.mutate({ title: newPostTitle, content: newPostContent });
  };

  // -------------------------
  // DELETE: Delete Post using useMutation
  // -------------------------
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch after a successful deletion
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      console.error("Error deleting post:", err);
      alert("Failed to delete post: " + (err as any).message);
    },
  });

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-4">Loading posts...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-500">
        Error: {error?.message || "Unknown error"}
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog Posts</h1>

      {/* Create New Post Form */}
      <div className="mb-8 p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
        <form onSubmit={handleCreatePost}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              required
              disabled={createPostMutation.isPending}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Content:
            </label>
            <textarea
              id="content"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={5}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              disabled={createPostMutation.isPending}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "Creating..." : "Create Post"}
          </button>
          {createPostMutation.isError && (
            <p className="text-red-500 mt-2">
              Error: {(createPostMutation.error as any).message}
            </p>
          )}
        </form>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No posts found.
          </p>
        ) : (
          posts?.map((post) => (
            <div
              key={post._id}
              className="border p-5 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-700">
                <Link href={`/posts/${post._id}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-3 line-clamp-3">{post.content}</p>
              <p className="text-sm text-gray-500 mb-4">
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                <Link
                  href={`/posts/${post._id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded"
                  disabled={deletePostMutation.isPending}
                >
                  {deletePostMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostsPage;
