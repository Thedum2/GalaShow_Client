import type { PlatformType } from "./types";

export type Viewer = { platform: PlatformType; nickname: string };

export const ALL_PLATFORMS: PlatformType[] = ["chzzk", "soop", "youtube"];

/** Client의 참가 명령어(JOIN_COMMANDS)와 같아야 한다. */
export const JOIN_COMMANDS = ["참여", "참가"];

/** 참가로 처리되면 안 되는 잡담(명령어 앞뒤에 다른 글자가 붙은 경우 포함) */
export const CHATTER = ["ㅋㅋㅋㅋ", "안녕하세요!", "오늘 뭐해요?", "참가할게요", "!참여", "참여요", "대박", "ㄱㄱ", "첫 방문이에요", "이거 어떻게 해요?"];

const PREFIXES = ["별빛", "고구마", "새벽", "치즈", "무지개", "두두", "갈라", "뉴비", "구름", "만두", "호랑", "달토끼", "밤하늘", "초코", "파도"];
const SUFFIXES = ["시청자", "광산", "냥", "왕", "감성", "팬", "러버", "요정", "대장", "짱", "킹", "봇"];

export const keyOf = (v: Viewer) => `${v.platform}:${v.nickname}`;

export const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

/** 겹치지 않는 가짜 시청자 count명. 플랫폼은 주어진 목록에서 번갈아 고른다. */
export function createViewers(count: number, platforms: PlatformType[]): Viewer[] {
    const pool = platforms.length ? platforms : ALL_PLATFORMS;
    const taken = new Set<string>();
    const viewers: Viewer[] = [];
    let attempts = 0;
    while (viewers.length < count) {
        attempts++;
        const base = `${randomItem(PREFIXES)}${randomItem(SUFFIXES)}${Math.floor(Math.random() * 1000)}`;
        // 조합이 부족하면 번호를 붙여 중복을 피한다.
        const nickname = attempts > count * 20 ? `${base}_${viewers.length}` : base;
        const viewer = { platform: pool[viewers.length % pool.length], nickname };
        if (taken.has(keyOf(viewer))) continue;
        taken.add(keyOf(viewer));
        viewers.push(viewer);
    }
    return viewers;
}
