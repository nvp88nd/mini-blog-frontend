import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../provider/AuthContext";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {

            await register(email, username, password);
            navigate("/login");
        } catch (error: any) {
            setError(error.response?.data?.error || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white sm:bg-gray-100 flex items-center justify-center sm:px-4">
            <div className="max-w-md w-full bg-white sm:rounded-2xl sm:shadow-lg p-8">
                <div className="text-center mb-8">
                    <i className="ri-fire-fill text-5xl text-blue-600 mb-2"></i>
                    <h1 className="text-3xl font-bold text-gray-800">Đăng ký</h1>
                    <p className="text-gray-600 mt-2">Chào mừng bạn đến với Blog!</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên người dùng
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-800"
                            placeholder="YourUsername"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-800"
                            placeholder="Your@email.com"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-800"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center p-3 text-gray-500 hover:text-gray-700 transition bg-transparent"
                                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showPassword ? (
                                    <i className="ri-eye-off-line"></i>
                                ) : (
                                    <i className="ri-eye-line"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showCfPassword ? "text" : "password"}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-800"
                                placeholder="••••••••"
                                required
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCfPassword(!showCfPassword)}
                                className="absolute inset-y-0 right-0 flex items-center p-3 text-gray-500 hover:text-gray-700 transition bg-transparent"
                                title={showCfPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                                {showCfPassword ? (
                                    <i className="ri-eye-off-line"></i>
                                ) : (
                                    <i className="ri-eye-line"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <i className="ri-loader-4-line animate-spin mr-2"></i>
                                Đang đăng ký...
                            </span>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}