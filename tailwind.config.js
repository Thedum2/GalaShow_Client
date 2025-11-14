/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/flowbite/**/*.js",
    ],
    theme: {
        extend: {
            colors: {
                soop: '#0545B1',
                chzzk: '#03C75A',
                youtube: '#FF0000',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            keyframes: {
                'slide-in': {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'bounce-slow': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-up-out': {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(-120%)', opacity: '0' },
                },
            },
            animation: {
                'slide-in': 'slide-in 0.3s ease-out',
                'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
                'slide-down': 'slide-down 0.2s ease-out',
                'slide-up-out': 'slide-up-out 0.3s ease-in forwards',
            },
        },
    },
    plugins: [],
}