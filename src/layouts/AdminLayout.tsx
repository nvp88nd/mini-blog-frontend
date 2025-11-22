import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../provider/AuthContext";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                    } flex flex-col`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <Link to="/admin" className="flex items-center space-x-2">
                                <i className="ri-fire-fill text-3xl text-blue-500"></i>
                                <span className="text-xl font-bold">Admin</span>
                            </Link>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-800 rounded-lg transition"
                        >
                            <i className={`ri-${sidebarOpen ? 'arrow-left' : 'arrow-right'}-s-line text-xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition ${isActive
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-800"
                            }`
                        }
                    >
                        <i className="ri-dashboard-line text-xl"></i>
                        {sidebarOpen && <span>Dashboard</span>}
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition ${isActive
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-800"
                            }`
                        }
                    >
                        <i className="ri-user-line text-xl"></i>
                        {sidebarOpen && <span>Người dùng</span>}
                    </NavLink>

                    <NavLink
                        to="/admin/posts"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition ${isActive
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-800"
                            }`
                        }
                    >
                        <i className="ri-article-line text-xl"></i>
                        {sidebarOpen && <span>Bài viết</span>}
                    </NavLink>

                    <Link
                        to="/"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        <i className="ri-home-line text-xl"></i>
                        {sidebarOpen && <span>Về trang chủ</span>}
                    </Link>
                </nav>

                {/* User Menu */}
                <div className="p-4 border-t border-gray-700">
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center space-x-3 w-full p-2 hover:bg-gray-800 rounded-lg transition"
                        >
                            <img
                                src={user?.avatar_url}
                                alt={user?.username}
                                className="w-10 h-10 rounded-full"
                            />
                            {sidebarOpen && (
                                <div className="flex-1 text-left">
                                    <p className="font-semibold">{user?.username}</p>
                                    <p className="text-sm text-gray-400">Admin</p>
                                </div>
                            )}
                        </button>

                        {userMenuOpen && (
                            <div className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 rounded-lg shadow-lg py-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition flex items-center space-x-2"
                                >
                                    <i className="ri-logout-box-line"></i>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}