// src/pages/posts/[id]/edit.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import React Query hooks
import api from "@/utils/api";
import { Post, UpdatePostDto } from "@/types/Post";

const EditPostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient(); // Get the query client instance

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // -------------------------
  // READ ONE: Fetch existing post data for editing
  // -------------------------
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id], // Query key to fetch specific post
    queryFn: async () => {
      if (!id) throw new Error("Post ID is not available");
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run query if ID exists
  });

  // Populate form fields when post data is loaded
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  // -------------------------
  // UPDATE: Update Post using useMutation
  // -------------------------
  const updatePostMutation = useMutation({
    mutationFn: async (updatedData: UpdatePostDto) => {
      if (!id) throw new Error("Post ID is not available for update");
      const response = await api.patch<Post>(`/posts/${id}`, updatedData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate specific post query and also the general posts list
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/posts/${id}`); // Go back to post detail page
    },
    onError: (err) => {
      console.error("Error updating post:", err);
      alert("Failed to update post: " + (err as any).message);
    },
  });

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title cannot be empty");
      return;
    }
    updatePostMutation.mutate({ title, content });
  };

  if (isLoading) return <div className="p-4">Loading post for editing...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-500">
        Error: {error?.message || "Unknown error"}
      </div>
    );
  if (!post && !isLoading)
    return <div className="p-4 text-gray-600">Post not found.</div>; // Handle case where post is null after loading

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Post</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleUpdatePost}>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={updatePostMutation.isPending}
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
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={updatePostMutation.isPending}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? "Updating..." : "Update Post"}
            </button>
            <Link
              href={`/posts/${id}`}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
