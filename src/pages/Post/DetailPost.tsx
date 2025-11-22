import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../provider/AuthContext";
import PostImages from "../../components/Post/PostImages";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";
import CommentList from "../../components/Comment/CommentList";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("vi");

interface User {
    id: string;
    username: string;
    avatar_url: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: User;
}

interface Image {
    id: number;
    url: string;
    order: number;
}

interface Post {
    id: number;
    title?: string;
    content: string;
    images?: Image[];
    created_at: string;
    like_count: number;
    comment_count: number;
    user: User;
    comments?: Comment[];
}

export default function DetailPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await axiosClient.get(`/posts/${id}`);
            const postData = Array.isArray(response.data) ? response.data[0] : response.data;
            setPost(postData);
        } catch (error: any) {
            setError("Không thể tải bài viết.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !user || !token) return;

        setSubmitting(true);
        try {
            await axiosClient.post("/comments", {
                post_id: id,
                author_id: user.id,
                content: comment.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComment("");
            fetchPost();
        } catch (error: any) {
            setError("Không thể gửi bình luận.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
                    <p className="text-gray-600">{error || "Bài viết không tồn tại"}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    const timeAgo = dayjs.utc(post.created_at).local().fromNow();

    return (
        <div className="min-h-screen bg-gray-100 sm:py-4 py-2">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition px-4 bg-white"
                >
                    <i className="ri-arrow-left-line text-xl mr-2"></i>
                    Quay lại
                </button>

                {/* Post Content */}
                <div className="bg-white sm:rounded-lg shadow-lg p-4 sm:p-6 mb-2 sm:mb-4">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <img
                            src={post.user.avatar_url}
                            alt={post.user.username}
                            className="w-12 h-12 rounded-full mr-3 cursor-pointer"
                            onClick={() => navigate(`/profile/${post.user.id}`)}
                        />
                        <div>
                            <h3
                                className="font-semibold text-gray-800 cursor-pointer hover:underline"
                                onClick={() => navigate(`/profile/${post.user.id}`)}
                            >
                                {post.user.username}
                            </h3>
                            <p className="text-sm text-gray-500">{timeAgo}</p>
                        </div>
                    </div>

                    {/* Title */}
                    {post.title && (
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
                    )}

                    {/* Content */}
                    <p className="text-gray-700 whitespace-pre-line mb-4">{post.content}</p>

                    {/* Images */}
                    <PostImages images={post.images || []} />

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t text-gray-600 text-sm">
                        <div className="flex items-center">
                            <i className="ri-thumb-up-line mr-2"></i>
                            <span>{post.like_count} lượt thích</span>
                        </div>
                        <div className="flex items-center">
                            <i className="ri-chat-3-line mr-2"></i>
                            <span>{post.comment_count} bình luận</span>
                        </div>
                    </div>

                    <hr className="my-3" />

                    {/* Actions */}
                    <div className="flex justify-around text-gray-600 font-medium">
                        <button
                            onClick={() => setLiked(!liked)}
                            className={`flex items-center space-x-2 p-2 rounded-lg w-1/2 justify-center transition bg-white ${liked ? "text-blue-600 bg-blue-50" : "hover:bg-gray-100"
                                }`}
                        >
                            <i className={`ri-thumb-up-line ${liked && "ri-thumb-up-fill"}`} />
                            <span>Thích</span>
                        </button>
                        <button className="flex items-center space-x-2 p-2 rounded-lg w-1/2 justify-center bg-white hover:bg-gray-100 transition">
                            <i className="ri-chat-3-line" />
                            <span>Bình luận</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white sm:rounded-lg shadow-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                        Bình luận ({post.comment_count})
                    </h2>

                    {/* Comment Form */}
                    {user ? (
                        <form onSubmit={handleSubmitComment} className="mb-6">
                            <div className="flex gap-3">
                                <img
                                    src={user.avatar_url}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white text-gray-800"
                                        placeholder="Viết bình luận..."
                                        rows={2}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!comment.trim() || submitting}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center">
                                                <i className="ri-loader-4-line animate-spin mr-2"></i>
                                                Đang gửi...
                                            </span>
                                        ) : (
                                            "Gửi"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-6 text-center py-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 mb-3">Đăng nhập để bình luận</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    )}

                    {/* Comments List */}
                    <CommentList postId={post.id} />
                    {/* <div className="space-y-4">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <i className="ri-chat-3-line text-5xl text-gray-300 mb-3"></i>
                                <p className="text-gray-500">
                                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                                </p>
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    );
}