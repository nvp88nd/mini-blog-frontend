import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import CommentItem from "./CommentItem";
import { useAuth } from "../../provider/AuthContext";
import toast from "react-hot-toast";

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: string;
        username: string;
        avatar_url?: string;
    };
}

interface CommentListProps {
    postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/comments/post/${postId}`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !token) return;

        setSubmitting(true);
        try {
            const response = await axiosClient.post(
                "/comments",
                {
                    postId,
                    content: newComment.trim()
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments([...comments, response.data]);
            setNewComment("");
            toast.success("Đã thêm bình luận!");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Không thể thêm bình luận.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

        try {
            await axiosClient.delete(`/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(comments.filter(c => c.id !== commentId));
            toast.success("Đã xóa bình luận!");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Không thể xóa bình luận.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <i className="ri-loader-4-line animate-spin text-2xl text-gray-500"></i>
            </div>
        );
    }

    return (
        <div className="mt-3">
            {/* Comment form */}
            {user && (
                <form onSubmit={handleSubmitComment} className="mb-4 mx-2">
                    <div className="flex space-x-3">
                        <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-8 h-8 rounded-full border border-gray-300"
                        />
                        <div className="flex-1">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận..."
                                className="w-full px-3 py-2 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                disabled={submitting}
                            />
                            {newComment.trim() && (
                                <div className="flex justify-end mt-2 space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewComment("")}
                                        className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition bg-white"
                                        disabled={submitting}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || !newComment.trim()}
                                        className="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? "Đang gửi..." : "Gửi"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            )}

            {/* Comments list */}
            {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">
                    Chưa có bình luận nào.
                </p>
            ) : (
                <div className="space-y-2">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={user?.id}
                            onDelete={handleDeleteComment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}