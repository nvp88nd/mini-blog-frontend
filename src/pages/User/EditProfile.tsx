import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../provider/AuthContext";
import toast from "react-hot-toast";

export default function EditProfile() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        setUsername(user.username);
        setAvatarPreview(user.avatar_url);
        fetchUserProfile();
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            const response = await axiosClient.get(`/user/${user?.id}`);
            setBio(response.data.bio || "");
        } catch (error) {
            console.error("Không thể tải thông tin người dùng");
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Ảnh đại diện không được vượt quá 2MB.");
                return;
            }
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("Tên người dùng không được để trống.");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Đang cập nhật...");

        try {
            const formData = new FormData();
            formData.append("username", username.trim());
            formData.append("bio", bio.trim());
            if (avatar) {
                formData.append("avatar", avatar);
            }

            await axiosClient.post(`/user/${user?.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success("Cập nhật thông tin thành công!", { id: loadingToast });
            navigate(`/profile/${user?.id}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại.";
            toast.error(errorMessage, { id: loadingToast });
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen sm:bg-gray-100 sm:py-4 sm:px-4 py-2">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white sm:rounded shadow-lg p-6">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(`/profile/${user.id}`)}
                            className="mr-4 text-gray-600 hover:text-gray-800 bg-gray-200 p-2 rounded-lg"
                        >
                            <i className="ri-arrow-left-line text-2xl"></i>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa trang cá nhân</h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-32 h-32 rounded-full border-4 border-gray-200 mb-4"
                            />
                            <label className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <i className="ri-camera-line mr-2"></i>
                                Đổi ảnh đại diện
                            </label>
                            <p className="text-sm text-gray-500 mt-2">Tối đa 2MB</p>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên người dùng
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-800"
                                placeholder="Nhập tên người dùng"
                                required
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giới thiệu bản thân
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none bg-white text-gray-800"
                                placeholder="Viết vài dòng về bản thân..."
                                rows={4}
                                maxLength={500}
                            />
                            <div className="text-sm text-gray-500 mt-1">
                                {bio.length}/500 ký tự
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/profile/${user.id}`)}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition bg-white"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                                        Đang lưu...
                                    </span>
                                ) : (
                                    "Lưu thay đổi"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}