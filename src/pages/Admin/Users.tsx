import { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthContext";
import axiosClient from "../../api/axiosClient";
import dayjs from "dayjs";
import toast from "react-hot-toast";

interface User {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { token, user: currentUser } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get("/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: string) => {
        if (userId === currentUser?.id) {
            toast.error("Bạn không thể thay đổi trạng thái của chính mình");
            return;
        }

        try {
            await axiosClient.patch(
                `/admin/users/${userId}/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Đã cập nhật trạng thái người dùng");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Không thể cập nhật trạng thái");
        }
    };

    const handleDeleteUser = async (userId: string, username: string) => {
        if (userId === currentUser?.id) {
            toast.error("Bạn không thể xóa tài khoản của chính mình");
            return;
        }

        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa người dùng "${username}"? Tất cả bài viết và dữ liệu liên quan sẽ bị xóa vĩnh viễn.`
        );

        if (!confirmed) return;

        try {
            await axiosClient.delete(`/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Đã xóa người dùng thành công");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Không thể xóa người dùng");
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
                <p className="text-gray-600 mt-1">
                    Tổng số: {users.length} người dùng
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
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-600"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Ngày tham gia
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={user.avatar_url}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <span className="font-medium text-gray-800">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {user.role === "admin" ? "Admin" : "User"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            disabled={user.id === currentUser?.id}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${user.is_active
                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                : "bg-red-100 text-red-800 hover:bg-red-200"
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {user.is_active ? "Hoạt động" : "Bị khóa"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {dayjs(user.created_at).format("DD/MM/YYYY")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                            disabled={user.id === currentUser?.id}
                                            className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200"
                                            title="Xóa người dùng"
                                        >
                                            <i className="ri-delete-bin-line text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Không tìm thấy người dùng nào
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}