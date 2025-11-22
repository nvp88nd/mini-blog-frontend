import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../provider/AuthContext";

export default function EditPost() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState("");
    const { user, token } = useAuth();
    const navigate = useNavigate();

    if (!user || !token) {
        navigate("/login");
        return null;
    }

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setFetchLoading(true);
            const response = await axiosClient.get(`/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const post = Array.isArray(response.data) ? response.data[0] : response.data;

            // Kiểm tra quyền sở hữu
            if (post.user.id !== user?.id) {
                setError("Bạn không có quyền chỉnh sửa bài viết này.");
                setTimeout(() => navigate("/"), 2000);
                return;
            }

            setTitle(post.title || "");
            setContent(post.content || "");
            setExistingImages(post.images || []);
        } catch (error: any) {
            setError(error.response?.data?.error || error.response?.data?.message || "Không thể tải bài viết. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalImages = existingImages.length - imagesToDelete.length + newImages.length + files.length;
        if (totalImages > 10) {
            setError("Bạn chỉ có thể có tối đa 10 ảnh.");
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

        const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
        setNewImages((prev) => [...prev, ...validFiles]);
        setNewPreviews((prev) => [...prev, ...newPreviewUrls]);
    };

    const removeExistingImage = (imageId: number) => {
        setImagesToDelete((prev) => [...prev, imageId]);
    };

    const restoreExistingImage = (imageId: number) => {
        setImagesToDelete((prev) => prev.filter((id) => id !== imageId));
    };

    const removeNewImage = (index: number) => {
        const updatedImages = newImages.filter((_, i) => i !== index);
        const updatedPreviews = newPreviews.filter((_, i) => i !== index);
        URL.revokeObjectURL(newPreviews[index]);
        setNewImages(updatedImages);
        setNewPreviews(updatedPreviews);
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
            // Xóa các ảnh đã đánh dấu
            for (const imageId of imagesToDelete) {
                await axiosClient.delete(`/posts/images/${imageId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Cập nhật bài viết
            const formData = new FormData();
            formData.append("userId", user.id);
            formData.append("title", title.trim());
            formData.append("content", content.trim());

            newImages.forEach((file) => {
                formData.append("images", file);
            });

            const response = await axiosClient.post(`/posts/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                navigate(`/`);
            }
        } catch (error: any) {
            setError(error.response?.data?.error || error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
                    <p className="mt-3 text-gray-600">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 sm:py-4 sm:px-4 py-2">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white sm:rounded shadow-lg p-4">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-4 text-gray-600 hover:text-gray-800 bg-gray-200 p-2 rounded-lg"
                        >
                            <i className="ri-arrow-left-line text-2xl"></i>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài viết</h1>
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-800"
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

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh hiện tại
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {existingImages.map((image) => {
                                        const isMarkedForDelete = imagesToDelete.includes(image.id);
                                        return (
                                            <div key={image.id} className="relative group">
                                                <img
                                                    src={image.url}
                                                    alt={`existing-${image.id}`}
                                                    className={`w-full h-48 object-cover rounded-lg border ${isMarkedForDelete ? "opacity-30" : ""
                                                        }`}
                                                />
                                                {isMarkedForDelete ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => restoreExistingImage(image.id)}
                                                        className="absolute top-2 right-2 z-20 bg-green-500 text-white p-1.5 rounded-full transition"
                                                    >
                                                        <i className="ri-restart-line"></i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(image.id)}
                                                        className="absolute top-2 right-2 z-20 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <i className="ri-close-line"></i>
                                                    </button>
                                                )}
                                                {isMarkedForDelete && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                                                            Sẽ xóa
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* New Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thêm ảnh mới (tối đa 10 ảnh, mỗi ảnh tối đa 5MB)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                            />
                            <div className="text-sm text-gray-500 mt-1">
                                Tổng số ảnh: {existingImages.length - imagesToDelete.length + newImages.length}/10
                            </div>
                        </div>

                        {/* New Image Previews */}
                        {newPreviews.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh mới thêm
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {newPreviews.map((src, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={src}
                                                alt={`new-preview-${index}`}
                                                className="w-full h-48 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <i className="ri-close-line"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
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
                                        Đang cập nhật...
                                    </span>
                                ) : (
                                    "Cập nhật bài viết"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}