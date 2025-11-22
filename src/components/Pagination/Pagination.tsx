import { useState } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const [inputPage, setInputPage] = useState("");

    if (totalPages <= 1) return null;

    const pageNumbers = [
        currentPage - 1,
        currentPage,
        currentPage + 1
    ].filter(p => p >= 1 && p <= totalPages);

    const handleGo = () => {
        const page = Number(inputPage);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
        setInputPage("");
    };

    return (
        <div className="flex flex-col items-center gap-4 py-6">

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">

                {/* First */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
                               hover:bg-gray-50 disabled:opacity-50"
                >
                    Đầu
                </button>

                {/* Middle Buttons (n-1, n, n+1) */}
                {pageNumbers.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg border transition ${currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Last */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
                               hover:bg-gray-50 disabled:opacity-50"
                >
                    Cuối
                </button>
            </div>

            {/* Go to page */}
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                    placeholder="Trang"
                />
                <button
                    onClick={handleGo}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Đi đến
                </button>
            </div>
        </div>
    );
}
