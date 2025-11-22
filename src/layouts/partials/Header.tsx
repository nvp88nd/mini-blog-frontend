import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../provider/AuthContext";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
        setUserMenuOpen(false);
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <i className="ri-fire-fill text-3xl text-blue-600"></i>
                    <span className="text-2xl font-bold text-gray-800">MiniBlog</span>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex space-x-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600 text-gray-600"
                        }
                    >
                        <i className="ri-home-line text-xl mr-1"></i>
                        Trang chủ
                    </NavLink>

                    {user ? (
                        <NavLink
                            to="/create"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600 text-gray-600"
                            }
                        >
                            <i className="ri-article-line text-xl mr-1"></i>
                            Viết bài
                        </NavLink>
                    ) : null}
                </nav>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-2 hover:bg-gray-100 rounded-full border border-gray-400 p-1 transition bg-white"
                            >
                                <img
                                    src={user.avatar_url}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full border border-gray-200"
                                />
                                <i className="ri-arrow-down-s-line text-gray-600"></i>
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="font-semibold text-gray-800">{user.username}</p>
                                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to={`/profile/${user.id}`}
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <i className="ri-user-line mr-2"></i>
                                        Trang cá nhân
                                    </Link>
                                    {isAdmin && (
                                        <Link
                                            to={`/admin`}
                                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <i className="ri-dashboard-line mr-2"></i>
                                            Quản lý
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 bg-white"
                                    >
                                        <i className="ri-logout-box-line mr-2"></i>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Đăng nhập
                            </Link>
                            {/* <Link
                                to="/register"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Đăng ký
                            </Link> */}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl px-4 py-1"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <i className="ri-menu-line"></i>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t px-4 py-2 space-y-2">
                    <NavLink to="/" className="block text-gray-700 hover:text-blue-600">
                        <i className="ri-home-line text-xl mr-2"></i>
                        Trang chủ
                    </NavLink>

                    {user && (
                        <NavLink
                            to="/create"
                            className="block text-gray-700 hover:text-blue-600"
                        >
                        <i className="ri-article-line text-xl mr-2"></i>
                            Viết bài
                        </NavLink>
                    )}
                </div>
            )}
        </header>
    );
}
