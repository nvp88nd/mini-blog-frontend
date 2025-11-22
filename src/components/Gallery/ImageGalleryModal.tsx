import { useState, useEffect } from "react";

interface Image {
    id: number;
    url: string;
}

interface ImageGalleryModalProps {
    images: Image[];
    initialIndex: number;
    onClose: () => void;
}

export default function ImageGalleryModal({ images, initialIndex, onClose }: ImageGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") handlePrevious();
            if (e.key === "ArrowRight") handleNext();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [currentIndex]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition p-2 bg-black bg-opacity-50 rounded-full"
            >
                <i className="ri-close-line text-3xl"></i>
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 z-10 text-white hover:text-gray-300 transition p-3 bg-black bg-opacity-50 rounded-full"
                >
                    <i className="ri-arrow-left-line text-3xl"></i>
                </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                    src={images[currentIndex].url}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 z-10 text-white hover:text-gray-300 transition p-3 bg-black bg-opacity-50 rounded-full"
                >
                    <i className="ri-arrow-right-line text-3xl"></i>
                </button>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 overflow-x-auto max-w-full px-4">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => setCurrentIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 p-0 transition ${index === currentIndex
                                ? "border-white"
                                : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <img
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Background Click to Close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            ></div>
        </div>
    );
}