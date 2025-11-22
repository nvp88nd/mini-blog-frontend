import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    value?: string;
}

export default function SearchBar({ onSearch, placeholder = "Tìm kiếm bài viết...", value = "" }: SearchBarProps) {
    const [query, setQuery] = useState(value);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    const handleClear = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-800"
                />
                <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition bg-white"
                    >
                        <i className="ri-close-circle-line text-xl"></i>
                    </button>
                )}
            </div>
        </form>
    );
}