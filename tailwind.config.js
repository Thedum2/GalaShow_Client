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
                'slide-in-left': {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
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
                // 메인 프로필 선택 팝업
                'popup-in': {
                    '0%': { transform: 'translateY(16px) scale(0.94)', opacity: '0' },
                    '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'spotlight-in': {
                    '0%': { transform: 'scale(0.55)', opacity: '0' },
                    '60%': { transform: 'scale(1.08)', opacity: '1' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'crown-drop': {
                    '0%': { transform: 'translate(-50%, -48px) rotate(-18deg)', opacity: '0' },
                    '60%': { transform: 'translate(-50%, 4px) rotate(6deg)', opacity: '1' },
                    '100%': { transform: 'translate(-50%, 0) rotate(0deg)', opacity: '1' },
                },
                'glow-ring': {
                    '0%': { transform: 'scale(0.9)', opacity: '0.8' },
                    '100%': { transform: 'scale(1.6)', opacity: '0' },
                },
                'rise-in': {
                    '0%': { transform: 'translateY(12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'page-in': {
                    '0%': { transform: 'scale(0.98)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                // 참가자 카드 등장·퇴장
                'participant-in': {
                    '0%': { transform: 'translateY(10px) scale(0.9)', opacity: '0', borderColor: '#facc15', boxShadow: '0 0 0 rgba(250,204,21,0)' },
                    '55%': { transform: 'translateY(0) scale(1.03)', opacity: '1', borderColor: '#facc15', boxShadow: '0 0 14px rgba(250,204,21,0.6)' },
                    '100%': { transform: 'translateY(0) scale(1)', opacity: '1', borderColor: '#ffffff', boxShadow: '0 0 0 rgba(250,204,21,0)' },
                },
                'participant-out': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(0.85)', opacity: '0' },
                },
                // 게임 시작 카운트다운 숫자
                'count-pop': {
                    '0%': { transform: 'scale(1.9)', opacity: '0' },
                    '35%': { transform: 'scale(0.92)', opacity: '1' },
                    '55%': { transform: 'scale(1.04)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'count-ring': {
                    '0%': { transform: 'scale(0.8)', opacity: '0.9' },
                    '100%': { transform: 'scale(1.5)', opacity: '0' },
                },
            },
            animation: {
                'slide-in': 'slide-in 0.3s ease-out',
                'slide-in-left': 'slide-in-left 0.4s ease-out',
                'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
                'slide-down': 'slide-down 0.2s ease-out',
                'slide-up-out': 'slide-up-out 0.3s ease-in forwards',
                'popup-in': 'popup-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                'fade-in': 'fade-in 0.3s ease-out',
                'spotlight-in': 'spotlight-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
                'crown-drop': 'crown-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both',
                'glow-ring': 'glow-ring 1.2s ease-out 0.3s infinite',
                'rise-in': 'rise-in 0.45s ease-out 0.55s both',
                'page-in': 'page-in 0.5s ease-out both',
                'participant-in': 'participant-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
                'participant-out': 'participant-out 0.25s ease-in forwards',
                'count-pop': 'count-pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
                'count-ring': 'count-ring 0.9s ease-out both',
            },
        },
    },
    plugins: [],
}