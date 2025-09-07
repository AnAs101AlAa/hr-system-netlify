import { useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";

interface LazyImageLoaderProps {
    src: string;
    alt: string;
    className?: string;
    width?: string | number;
    height?: string | number;
}

export default function LazyImageLoader({ 
    src, 
    alt, 
    className = "", 
    width = "100%", 
    height = "200px" 
}: LazyImageLoaderProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    return (
        <div 
            className={`relative overflow-hidden ${className}`}
            style={{ width, height }}
        >
            {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
                </div>
            )}

            {imageError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <HiOutlinePhotograph className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Failed to load</p>
                    </div>
                </div>
            )}

            <img
                src={src}
                alt={alt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}
