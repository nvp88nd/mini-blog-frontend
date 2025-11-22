import { useState } from "react";
import ImageGalleryModal from "../Gallery/ImageGalleryModal";

interface PostImage {
    id: number;
    url: string;
}

export default function PostImages({ images }: { images: PostImage[] }) {
    const [showGallery, setShowGallery] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        setShowGallery(true);
    };

    if (!images || images.length === 0) return null;

    const count = images.length;

    return (
        <div className="mt-3">
            {/* 1 ảnh: full width */}
            {count === 1 && (
                <img
                    src={images[0].url}
                    alt=""
                    className="w-full object-cover max-h-[600px]"
                    onClick={() => handleImageClick(0)}
                />
            )}

            {/* 2 ảnh: 1 trên 1 dưới */}
            {count === 2 && (
                <div className="flex flex-col gap-1">
                    {images.map((img, index) => (
                        <img
                            key={img.id}
                            src={img.url}
                            alt=""
                            className="w-full h-[200px] sm:h-[350px] object-cover"
                            onClick={() => handleImageClick(index)}
                        />
                    ))}
                </div>
            )}

            {/* 3 ảnh trở lên: 1 ảnh to, 2 ảnh nhỏ dưới */}
            {count >= 3 && (
                <div className="flex flex-col gap-1">
                    {/* Ảnh to phía trên */}
                    <img
                        src={images[0].url}
                        alt=""
                        className="w-full h-[250px] sm:h-[400px] object-cover"
                        onClick={() => handleImageClick(0)}
                    />

                    {/* Hàng dưới: 2 ảnh (hoặc nhiều hơn, hiển thị +N nếu dư) */}
                    <div className="grid grid-cols-2 gap-1">
                        {images.slice(1, 3).map((img, index) => (
                            <div key={img.id} className="relative" onClick={() => handleImageClick(index + 1)}>
                                <img
                                    src={img.url}
                                    alt=""
                                    className="w-full h-[150px] sm:h-[250px] object-cover"
                                />
                                {/* Nếu là ảnh thứ 2 (index === 1) và còn dư → overlay */}
                                {index === 1 && count > 3 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white text-2xl font-semibold">
                                            +{count - 3}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showGallery && (
                <ImageGalleryModal
                    images={images}
                    initialIndex={selectedIndex}
                    onClose={() => setShowGallery(false)}
                />
            )}
        </div>
    )
}
