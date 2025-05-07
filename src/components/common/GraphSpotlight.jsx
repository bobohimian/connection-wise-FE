import React, { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { Search, X } from "lucide-react"

export const GraphSpotlight = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef(null)
  const [portalContainer, setPortalContainer] = useState(null)
  const [lastSpaceTime, setLastSpaceTime] = useState(0)

  // Create portal container on mount
  useEffect(() => {
    const div = document.createElement("div")
    div.style.position = "fixed"
    div.style.top = "0"
    div.style.left = "0"
    div.style.width = "100%"
    div.style.height = "100%"
    div.style.zIndex = "9999"
    div.style.pointerEvents = isOpen ? "auto" : "none"
    document.body.appendChild(div)
    setPortalContainer(div)

    return () => {
      document.body.removeChild(div)
    }
  }, [isOpen])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Double space detection
      if (e.key === " " && !isOpen) {
        const now = Date.now()
        if (now - lastSpaceTime < 500) {
          // 500ms threshold for double-click
          e.preventDefault()
          setIsOpen(true)
          setLastSpaceTime(0)
        } else {
          setLastSpaceTime(now)
        }
      }

      // Close on escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
        setQuery("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, lastSpaceTime])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit ? onSubmit(query) : console.error("onSubmit is not defined")
      // setQuery("")
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery("")
  }

  if (!portalContainer || !isOpen) return null

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[30vh] p-4 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="relative flex flex-col">
          <div className="flex items-center px-4 py-3 ">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="生成关系图..."
              className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-400"
              autoComplete="off"
              autoFocus
            />
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {query && (
            <div className="relative p-4 text-sm text-gray-500 border-t border-gray-30">
              按回车键生成关系图
            </div>
          )}
        </form>
      </div>
    </div>,
    portalContainer,
  )
}