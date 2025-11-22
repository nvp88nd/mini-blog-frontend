import { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthContext";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface Stats {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    recentPosts: any[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosClient.get("/admin/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Tổng quan hệ thống</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Người dùng</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                {stats?.totalUsers || 0}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <i className="ri-user-line text-3xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Bài viết</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                {stats?.totalPosts || 0}
                            </p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <i className="ri-article-line text-3xl text-green-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Bình luận</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                {stats?.totalComments || 0}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg">
                            <i className="ri-chat-3-line text-3xl text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Bài viết gần đây</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Người đăng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Nội dung
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Thời gian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Thống kê
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats?.recentPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={post.user.avatar_url}
                                                alt={post.user.username}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <span className="font-medium text-gray-800">{post.user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-800 line-clamp-2">
                                            {post.content}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {dayjs(post.created_at).fromNow()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-4 text-sm text-gray-600">
                                            <span>
                                                <i className="ri-thumb-up-line mr-1"></i>
                                                {post.like_count}
                                            </span>
                                            <span>
                                                <i className="ri-chat-3-line mr-1"></i>
                                                {post.comment_count}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}