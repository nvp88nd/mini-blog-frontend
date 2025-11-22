import { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthContext";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";
import toast from "react-hot-toast";

interface Post {
    id: number;
    title?: string;
    content: string;
    created_at: string;
    like_count: number;
    comment_count: number;
    user: {
        username: string;
        avatar_url: string;
    };
    images?: any[];
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { token } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axiosClient.get("/admin/posts", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: number) => {
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        );

        if (!confirmed) return;

        try {
            await axiosClient.delete(`/admin/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Đã xóa bài viết thành công");
            fetchPosts();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Không thể xóa bài viết");
        }
    };

    const filteredPosts = posts.filter((post) =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý bài viết</h1>
                <p className="text-gray-600 mt-1">
                    Tổng số: {posts.length} bài viết
                </p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm theo nội dung hoặc tác giả..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-600"
                    />
                </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <img
                                    src={post.user.avatar_url}
                                    alt={post.user.username}
                                    className="w-12 h-12 rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {post.user.username}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {dayjs(post.created_at).format("DD/MM/YYYY HH:mm")}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition bg-gray-200"
                                title="Xóa bài viết"
                            >
                                <i className="ri-delete-bin-line text-xl"></i>
                            </button>
                        </div>

                        {post.title && <h4 className="font-semibold text-gray-900">{post.title}</h4>}
                        <p className="text-gray-800 mb-4 whitespace-pre-line">
                            {post.content}
                        </p>

                        {/* Images */}
                        {post.images && post.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {post.images.slice(0, 3).map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.url}
                                        alt=""
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ))}
                                {post.images.length > 3 && (
                                    <div className="relative">
                                        <img
                                            src={post.images[3].url}
                                            alt=""
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xl font-bold">
                                                +{post.images.length - 3}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center space-x-6 text-sm text-gray-600 border-t pt-4">
                            <span className="flex items-center">
                                <i className="ri-thumb-up-line mr-2"></i>
                                {post.like_count} lượt thích
                            </span>
                            <span className="flex items-center">
                                <i className="ri-chat-3-line mr-2"></i>
                                {post.comment_count} bình luận
                            </span>
                        </div>
                    </div>
                ))}

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
                        Không tìm thấy bài viết nào
                    </div>
                )}
            </div>
        </div>
    );
}