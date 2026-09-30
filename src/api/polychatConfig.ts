// polychat-bridge/server 중계 핸들러 주소. Client가 자기 출처의 /polychat에 직접 띄운다
// (개발 서버는 vite.config.js에서 내장). 다른 곳에 띄웠다면 VITE_POLYCHAT_API_URL로 지정한다.
export const POLYCHAT_API_BASE_URL = import.meta.env.VITE_POLYCHAT_API_URL?.trim().replace(/\/+$/, '') || '/polychat';
export const CHZZK_API_BASE_URL = `${POLYCHAT_API_BASE_URL}/chzzk`;
export const SOOP_API_BASE_URL = `${POLYCHAT_API_BASE_URL}/soop`;
export const YOUTUBE_API_BASE_URL = `${POLYCHAT_API_BASE_URL}/youtube`;
export const YOUTUBE_STREAM_URL = `${YOUTUBE_API_BASE_URL}/chat/stream`;
// CHZZK·YouTube OAuth 콜백. 공급자 콘솔에 현재 origin의 이 경로를 등록해야 한다.
export const OAUTH_CALLBACK_PATH = '/callback';
