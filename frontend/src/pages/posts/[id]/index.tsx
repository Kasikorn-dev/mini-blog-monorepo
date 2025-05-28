// src/pages/posts/[id].tsx
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query"; // Import useQuery
import api from "@/utils/api";
import { Post } from "@/types/Post";

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // -------------------------
  // READ ONE: Fetch single Post using useQuery
  // -------------------------
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id], // Query key includes the ID for unique caching
    queryFn: async () => {
      if (!id) throw new Error("Post ID is not available"); // Ensure ID exists
      const response = await api.get<Post>(`/posts/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run query if ID is available
  });

  if (isLoading) return <div className="p-4">Loading post...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-500">
        Error: {error?.message || "Unknown error"}
      </div>
    );
  if (!post) return <div className="p-4 text-gray-600">Post not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-700 leading-relaxed mb-6">{post.content}</p>
        <p className="text-sm text-gray-500 mb-4">
          Created: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {post.updatedAt && (
          <p className="text-sm text-gray-500 mb-4">
            Last updated: {new Date(post.updatedAt).toLocaleDateString()}
          </p>
        )}

        <div className="flex space-x-4">
          <Link
            href={`/posts/${post._id}/edit`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </Link>
          <Link
            href="/posts"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
