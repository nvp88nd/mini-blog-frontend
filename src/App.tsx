import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./provider/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/Auth/Login";
import type React from "react";
import RegisterPage from "./pages/Auth/Register";
import CreatePost from "./pages/Post/CreatePost";
import Profile from "./pages/User/Profile";
import EditPost from "./pages/Post/EditPost";
import { Toaster } from "react-hot-toast";
import DetailPost from "./pages/Post/DetailPost";
import EditProfile from "./pages/User/EditProfile";
import ScrollToTop from "./components/ScrollToTop";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import Posts from "./pages/Admin/Posts";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}

function Forbidden() {
  return <h1>403 – Bạn không có quyền truy cập trang này</h1>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/403"
        element={
          <Forbidden />
        }
      />

      <Route path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/create"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreatePost />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/posts/:id/edit"
        element={
          <ProtectedRoute>
            <MainLayout>
              < EditPost />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/profile/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/posts/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DetailPost />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route path="/admin/posts"
        element={
          <AdminRoute>
            <AdminLayout>
              <Posts />
            </AdminLayout>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" />
        <ScrollToTop />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
