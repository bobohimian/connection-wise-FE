import  { useState, useEffect, useRef } from 'react';

/**
 * LazyImage组件 - 实现图片懒加载功能
 * 
 * @param {string} src - 图片URL
 * @param {string} alt - 图片alt文本
 * @param {React.Component} placeholder - 图片加载前的占位符
 * @param {string} className - 应用于图片的CSS类名
 * @param {Object} imgProps - 传递给img标签的其他属性
 */
const LOAD_SATTUS = {
  INITIAL: 'init',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};
const LazyImage = ({
  src,
  alt = '',
  placeholder = 'placeholder',
  className = '',
  ...imgProps
}) => {

  const [loadStatus, setLoadStatus] = useState(LOAD_SATTUS.INITIAL);
  const imgRef = useRef(null);
  const retryRef = useRef({
    count: 0,
    delay: [500, 1000, 2000],
    maxCount: 3,
  });
  const timerIdRef = useRef(null);

  // 使用Intersection Observer API检测图片是否进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 当图片进入视口时
        if (entries[0].isIntersecting) {
          timerIdRef.current = setTimeout(() => {
            if (entries[0].isIntersecting) {
              setLoadStatus(LOAD_SATTUS.LOADING);
              // 图片已进入视口，取消观察
              observer.disconnect();
            }
          }, 500);
        }
        else {
          clearTimeout(timerIdRef.current);
        }
      },
      {
        // 图片只要有一部分进入视口就触发加载
        // threshold: 1,
        // 提前加载视口外的图片（视口向外扩展100px）
        rootMargin: '100px',
      },
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
    setLoadStatus(LOAD_SATTUS.LOADED);
  };

  // 图片加载失败处理函数
  const handleImageError = (img) => {
    const retry = retryRef.current;
    if (retry.count < retry.maxCount) {
      setTimeout(() => {
        retry.count++;
        const url = img.src;
        img.src = url;
      }, retry.delay[retry.count]);
    } else {
      setLoadStatus(LOAD_SATTUS.FAILED);
    }
  };

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {/* 初始状态 */}
      {loadStatus === LOAD_SATTUS.INITIAL && (
        <div className="absolute inset-0 flex items-center justify-center ">
          {placeholder}
        </div>
      )}
      {/* 加载中 */}
      {loadStatus === LOAD_SATTUS.LOADING && (
        <div className="absolute inset-0 flex items-center justify-center ">
          <div className="h-10 w-10 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 加载失败 */}
      {loadStatus === LOAD_SATTUS.FAILED && (
        <div className="absolute inset-0 flex items-center justify-center ">
          <span className="text-gray-400">图片加载失败</span>
        </div>
      )}

      {/* 图片 */}
      {(loadStatus === LOAD_SATTUS.LOADING || loadStatus === LOAD_SATTUS.LOADED) && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${loadStatus === LOAD_SATTUS.LOADED ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleImageLoaded}
          onError={(e) => handleImageError(e.target)}
          {...imgProps}
        />
      )}
    </div>
  );
};
export default LazyImage;