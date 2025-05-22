import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage组件 - 实现图片懒加载功能
 * 
 * @param {string} src - 图片URL
 * @param {string} alt - 图片alt文本
 * @param {string} className - 应用于图片的CSS类名
 * @param {Object} imgProps - 传递给img标签的其他属性
 */
const LazyImage = ({
    src,
    alt = '',
    className = '',
    ...imgProps
}) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const retryRef = useRef({
        count: 0,
        delay: [500, 1000, 2000],
        maxCount: 3,
    });


    // 使用Intersection Observer API检测图片是否进入视口
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // 当图片进入视口时
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    // 图片已进入视口，取消观察
                    observer.disconnect();
                }
            },
            {
                // 图片只要有一部分进入视口就触发加载
                threshold: 1,
                // 提前加载视口外的图片（视口向外扩展100px）
                // rootMargin: '100px',
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        // 组件卸载时清理observer
        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    // 图片加载成功处理函数
    const handleImageLoaded = () => {
        setIsLoaded(true);
    };

    // 图片加载失败处理函数
    const handleImageError = (img) => {
        console.log('image load error');
        console.log(img);
        const retry = retryRef.current;
        if (retry.count < retry.maxCount) {
            setTimeout(() => {
                retry.count++;
                img.src = img.src
                console.log('retry load image');
            }, retry.delay[retry.count]);
        } else {
            setHasError(true);
            setIsLoaded(true); // 即使加载失败也标记为已加载，以移除占位符}
        };
    }
    return (
        <div className={`relative ${className}`} ref={imgRef}>
            {/* 显示占位符，直到图片加载完成 */}
            {!isLoaded  && (
                <div className="absolute inset-0 flex items-center justify-center ">
                    <div className="h-10 w-10 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* 图片加载错误时显示的内容 */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center ">
                    <span className="text-gray-400">图片加载失败</span>
                </div>
            )}

            {/* 只有当图片进入视口时才加载图片 */}
            {isInView && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    onLoad={handleImageLoaded}
                    onError={(e) => handleImageError(e.target)}
                    {...imgProps}

                    data-retry-count={0}
                    data-retry-delay={500}
                    data-max-retries={3}
                />
            )}
        </div>
    )
};
export default LazyImage;