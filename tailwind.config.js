/** @type {import('tailwindcss').Config} */

module.exports =  {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 不起作用
            backgroundImage:{
                'theme-breeze':'linear-gradient(to right, #38bdf8, #0891b2, #0ea5e9)',
                'theme-sunset':'linear-gradient(to right, #f87171, #fbbf24, #fcd34d)',
                'theme-dusk':'linear-gradient(to bottom, #15803d, #064e3b, #022c22)',
                'theme-dream':'linear-gradient(45deg, #581c87, #831843, #be123c)',
                'theme-haze':'linear-gradient(to right, #b45309, #ea580c, #f59e0b)'
            }
        },
    },
    plugins: [],
}