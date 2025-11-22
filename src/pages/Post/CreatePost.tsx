import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../provider/AuthContext";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user, token } = useAuth();
    const navigate = useNavigate();

    if (!user || !token) {
        navigate("/login");
        return null;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (images.length + files.length > 10) {
            setError("Bạn chỉ có thể tải lên tối đa 10 ảnh.");
            return;
        }

        const validFiles = files.filter((file) => {
            if (file.size > 5 * 1024 * 1024) {
                setError(`Ảnh ${file.name} vượt quá kích thước 5MB.`);
                return false;
            }
            return true;
        });

        setError("");

        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

        setImages((prev) => [...prev, ...validFiles]);
        setPreviews((prev) => [...prev, ...newPreviews]);
    }

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);
        URL.revokeObjectURL(previews[index]);
        setImages(updatedImages);
        setPreviews(updatedPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!content.trim()) {
            setError("Nội dung bài viết không được để trống.");
            return;
        }
        setLoading(true);

        try {
            const dataForm = new FormData();
            dataForm.append("userId", user.id);
            dataForm.append("title", title.trim());
            dataForm.append("content", content.trim());
            images.forEach((file) => {
                dataForm.append("images", file);
            });

            const response = await axiosClient.post("/posts", dataForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                navigate("/");
            }
        } catch (error: any) {
            setError(error.response?.data?.error || error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 sm:py-4 sm:px-4 py-2">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white sm:rounded shadow-lg p-4">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate("/")}
                            className="mr-4 text-gray-600 hover:text-gray-800 bg-gray-200"
                        >
                            <i className="ri-arrow-left-line text-2xl"></i>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Tạo bài viết mới</h1>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề (tùy chọn)
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition  bg-white text-gray-800"
                                placeholder="Nhập tiêu đề..."
                                maxLength={200}
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none bg-white text-gray-800"
                                placeholder="Bạn đang nghĩ gì?"
                                rows={6}
                                required
                            />
                            <div className="text-sm text-gray-500 mt-1">
                                {content.length} ký tự
                            </div>
                        </div>

                        {/* Image upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình ảnh (tối đa 10 ảnh, mỗi ảnh tối đa 5MB)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                            />
                        </div>

                        {/* Image Preview */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={src}
                                            alt={`preview-${index}`}
                                            className="w-full h-48 object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <i className="ri-close-line"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition bg-white"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !content.trim() || error !== ""}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                                        Đang đăng...
                                    </span>
                                ) : (
                                    "Đăng bài"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}