import { useState } from "react";
import PostImages from "./PostImages";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";
import { useAuth } from "../../provider/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("vi");

interface PostCardProps {
    post: Post;
    onPostDelete?: (postId: number) => void;
}

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

export default function PostCard({ post, onPostDelete }: PostCardProps) {
    const [liked, setLiked] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { user: currentUser, token } = useAuth();
    const timeAgo = dayjs.utc(post.created_at).local().fromNow();
    const navigate = useNavigate();

    const isOwnerPost = currentUser?.id === post.user.id;

    const handleEditPost = () => {
        navigate(`/posts/${post.id}/edit`);
    };

    const handleDeletePost = async () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.")
        if (!confirmed) return;

        setShowMenu(false);
        setIsDeleting(true);

        const loadingToast = toast.loading("Đang xóa bài viết...");

        try {
            const response = await axiosClient.delete(`/posts/${post.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                if (onPostDelete) {
                    onPostDelete(post.id);
                } else {
                    window.location.reload();
                }
                toast.success("Đã xóa bài viết thành công!", {
                    id: loadingToast
                });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Không thể xóa bài viết. Vui lòng thử lại.";
            toast.error(errorMessage, {
                id: loadingToast
            });
            setIsDeleting(false);
        }
    }

    return (
        <div className={`bg-white sm:rounded-md shadow mb-1 sm:mb-4 border border-gray-200 ${isDeleting ? "opacity-50 pointer-events-none" : ""
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between mt-2 mx-2">
                <div className="flex items-center mt-2 mx-2">
                    <img
                        src={post.user.avatar_url}
                        alt={post.user.username}
                        className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                        onClick={() => navigate(`/profile/${post.user.id}`)}
                    />
                    <div>
                        <h3 className="font-semibold text-gray-800 cursor-pointer hover:underline"
                            onClick={() => navigate(`/profile/${post.user.id}`)}>
                            {post.user.username}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {timeAgo} ·<i className="ri-earth-line ml-1"></i>
                        </p>
                    </div>
                </div>

                {isOwnerPost && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100 bg-white"
                            title="Tùy chọn bài viết"
                        >
                            <i className="ri-more-line text-lg"></i>
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-1">

                                <button
                                    onClick={handleEditPost}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition bg-white"
                                >
                                    <i className="ri-edit-2-line mr-2"></i> Chỉnh sửa
                                </button>

                                <button
                                    onClick={handleDeletePost}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition bg-white"
                                >
                                    <i className="ri-delete-bin-line mr-2"></i> Xóa
                                </button>
                            </div>
                        )}
                        {showMenu && (
                            <div
                                className="fixed inset-0 z-0"
                                onClick={() => setShowMenu(false)}
                            ></div>
                        )}
                    </div>
                )}
            </div>

            {isDeleting && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
                    <i className="ri-loader-4-line animate-spin text-3xl text-blue-600"></i>
                </div>
            )}

            {/* Nội dung */}
            <div className="mt-3 mx-3">
                {post.title && <h4 className="font-semibold text-gray-900">{post.title}</h4>}
                <p className="text-gray-700 mt-1 whitespace-pre-line">{post.content}</p>
            </div>

            {/* Ảnh */}
            <PostImages images={post.images || []} />

            {/* Like & Comment Summary */}
            <div className="flex justify-between text-sm text-gray-600 mt-2 mx-2">
                <span>{post.like_count} lượt thích</span>
                <span>{post.comment_count} bình luận</span>
            </div>

            <hr className="my-1" />

            {/* Actions */}
            <div className="flex justify-around text-gray-600 font-medium space-x-4 mb-1 mx-2">
                <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center space-x-2 p-2 rounded-lg w-1/2 justify-center transition bg-white ${liked ? "text-blue-600 bg-blue-50" : "hover:bg-gray-100"
                        }`}
                >
                    <i className={`ri-thumb-up-line ${liked && "ri-thumb-up-fill"}`} />
                    <span>Thích</span>
                </button>

                <button
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="flex items-center space-x-2 p-2 rounded-lg w-1/2 justify-center bg-white hover:bg-gray-100 transition">
                    <i className="ri-chat-3-line" />
                    <span>Bình luận</span>
                </button>
            </div>

            {/* <hr className="mb-2 mt-1" /> */}

            {/* Comment preview (nếu có) */}
            {/* <CommentItem comment={post.comments![0]} /> */}
        </div>
    );
}
