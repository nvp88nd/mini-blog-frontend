import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../provider/AuthContext";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";

dayjs.extend(utc);
dayjs.locale("vi");
import axiosClient from "../../api/axiosClient";
import PostCard from "../../components/Post/PostCard";

interface User {
    id: string;
    email: string;
    username: string;
    avatar_url: string;
    bio?: string;
    created_at: string;
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
    author_id: string;
    user: User;
}

export default function Profile() {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"posts" | "about">("posts");

    const isOwnProfile = currentUser?.id === id;

    useEffect(() => {
        fetchProfile();
        fetchUserPosts();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const response = await axiosClient.get(`/user/${id}`);
            setProfileUser(response.data);
        } catch (error) {
            setError("Không thể tải thông tin người dùng.");
        }
    }

    const fetchUserPosts = async () => {
        try {
            const response = await axiosClient.get(`/posts/user/${id}`);
            setPosts(response.data);
        } catch (error) {
            setError("Không thể tải bài viết.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    if (error || !profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
                    <p className="text-gray-600">{error || "Người dùng không tồn tại"}</p>
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

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Cover Photo */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48"></div>

            {/* Profile Info */}
            <div className="max-w-4xl mx-auto sm:px-4 -mt-20">
                <div className="bg-white sm:rounded shadow-lg sm:p-6 p-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <img
                            src={profileUser.avatar_url}
                            alt={profileUser.username}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                        />

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">
                                {profileUser.username}
                            </h1>
                            <p className="text-gray-600 mb-2">{profileUser.email}</p>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start gap-6 mb-2">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">
                                        {posts.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Bài viết</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">
                                        {posts.reduce((sum, p) => sum + p.like_count, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Lượt thích</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-800">
                                        {posts.reduce((sum, p) => sum + p.comment_count, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Bình luận</div>
                                </div>
                            </div>

                            {/* Actions */}
                            {isOwnProfile && (
                                <button
                                    onClick={() => navigate("/settings")}
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                >
                                    <i className="ri-settings-3-line mr-2"></i>
                                    Chỉnh sửa trang cá nhân
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-t mt-4 pt-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab("posts")}
                                className={`py-2 px-4 font-semibold transition bg-gray-200 ${activeTab === "posts"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                <i className="ri-article-line mr-2"></i>
                                Bài viết
                            </button>
                            <button
                                onClick={() => setActiveTab("about")}
                                className={`py-2 px-4 font-semibold transition bg-gray-200 ${activeTab === "about"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                <i className="ri-information-line mr-2"></i>
                                Giới thiệu
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-2 sm:mt-4">
                    {activeTab === "posts" && (
                        <div className="max-w-2xl mx-auto">
                            {posts.length === 0 ? (
                                <div className="bg-white rounded shadow p-12 text-center">
                                    <i className="ri-article-line text-6xl text-gray-400 mb-4"></i>
                                    <p className="text-gray-600">Chưa có bài viết nào</p>
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => navigate("/create")}
                                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Tạo bài viết đầu tiên
                                        </button>
                                    )}
                                </div>
                            ) : (
                                posts.map((post) => <PostCard key={post.id} post={post} />)
                            )}
                        </div>
                    )}

                    {activeTab === "about" && (
                        <div className="bg-white sm:rounded shadow p-6 max-w-2xl mx-auto">
                            <h3 className="text-xl text-gray-800 font-bold mb-4">Thông tin</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <i className="ri-mail-line text-xl mr-3 text-gray-500"></i>
                                    {profileUser.email}
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <i className="ri-calendar-line text-xl mr-3 text-gray-500"></i>
                                    Tham gia {dayjs.utc(profileUser.created_at).local().format("DD/MM/YYYY")}
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Giới thiệu</h4>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {profileUser.bio && profileUser.bio.trim() !== ""
                                            ? profileUser.bio
                                            : "Người dùng chưa cập nhật giới thiệu."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}