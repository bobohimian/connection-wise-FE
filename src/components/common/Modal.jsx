import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, _title, children, _footer }) {
  const modalRef = useRef(null);

  // 处理ESC键关闭模态窗口
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 处理焦点陷阱
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };

        window.addEventListener('keydown', handleTabKey);
        firstElement.focus();

        return () => {
          window.removeEventListener('keydown', handleTabKey);
        };
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* 模态窗口内容 */}
      <div
        ref={modalRef}
        className="relative  rounded-lg  w-full max-w-md mx-auto z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {children}
        {/* 关闭按钮 */}
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="关闭"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button> */}

        {/* 模态窗口标题 */}
        {/* <h2 id="modal-title" className="text-xl font-semibold mb-4">
          {title}
        </h2> */}

        {/* 模态窗口内容 */}
        {/* <div className="mb-6">{children}</div> */}

        {/* 模态窗口底部按钮 */}
        {/* {footer && <div className="flex justify-end gap-3">{footer}</div>} */}
      </div>
    </div>
  );
}