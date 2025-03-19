import { useState, useEffect } from "react"
import { Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import { setTheme } from "@/store/slices/setting";

export default function ThemeToggle() {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.setting.theme)
    const isDarkMode = (theme == "dark");
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        console.log("isDarkMode", isDarkMode)
        const nextTheme = isDarkMode ? "light" : "dark";
        dispatch(setTheme(nextTheme));
    };

    return (
        <button
            onClick={toggleTheme}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
        >
            {isDarkMode ? (
                <Moon className="h-4 w-4 text-blue-500" />
            ) : (
                <Sun className="h-4 w-4 text-yellow-500" />
            )}
        </button>
    )
}