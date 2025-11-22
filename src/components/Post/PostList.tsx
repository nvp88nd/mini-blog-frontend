import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import PostCard from "./PostCard";
import SearchBar from "../Search/SearchBar";
import Pagination from "../Pagination/Pagination";

interface User {
    id: string;
    username: string;
    avatar_url: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: User;
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
    user: User;
    comments?: Comment[];
}

export default function PostList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch mỗi khi đổi page hoặc search
    useEffect(() => {
        fetchPosts(currentPage, searchQuery);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage, searchQuery]);

    const fetchPosts = async (page = 1, search = "") => {
        try {
            setLoading(true);

            const response = await axiosClient.get("/posts", {
                params: { page, limit: 10, search }
            });

            setPosts(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
            setCurrentPage(response.data.pagination.page);
            setTotalItems(response.data.pagination.total);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostDeleted = (postId: number) => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <i className="ri-loader-4-line animate-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-4 px-4 sm:px-0">
                <SearchBar onSearch={handleSearch} value={searchQuery} />
            </div>

            {searchQuery && (
                <div className="mb-4 px-4 sm:px-0">
                    <p className="text-gray-600 text-sm">
                        {posts.length > 0 ? (
                            <>
                                Tìm thấy <span className="font-semibold">{totalItems}</span> kết quả cho "{searchQuery}"
                            </>
                        ) : (
                            <>Không tìm thấy kết quả cho "{searchQuery}"</>
                        )}
                    </p>
                </div>
            )}

            {posts.length > 0 ? (
                <>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} onPostDelete={handlePostDeleted} />
                    ))}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            ) : (
                <div className="bg-white sm:rounded-lg shadow p-12 text-center">
                    <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-600">
                        {searchQuery ? "Không tìm thấy bài viết nào" : "Chưa có bài viết nào"}
                    </p>
                </div>
            )}
        </div>
    );
}
