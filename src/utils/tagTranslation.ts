/**
 * 미니게임 태그를 한국어로 변환하는 유틸리티
 */

export interface TagTranslation {
  label: string;
  bgColor: string;
  textColor: string;
}

// Scale 태그 변환
const scaleTranslations: Record<string, TagTranslation> = {
  xl: { label: '초대규모', bgColor: '#7c3aed', textColor: '#ffffff' },
  large: { label: '대규모', bgColor: '#9333ea', textColor: '#ffffff' },
  medium: { label: '중규모', bgColor: '#a855f7', textColor: '#ffffff' },
  small: { label: '소규모', bgColor: '#c084fc', textColor: '#ffffff' },
  xs: { label: '초소규모', bgColor: '#d8b4fe', textColor: '#000000' },
};

// Difficulty 태그 변환
const difficultyTranslations: Record<string, TagTranslation> = {
  '1': { label: '매우 쉬움', bgColor: '#22c55e', textColor: '#ffffff' },
  '2': { label: '쉬움', bgColor: '#84cc16', textColor: '#ffffff' },
  '3': { label: '보통', bgColor: '#eab308', textColor: '#ffffff' },
  '4': { label: '어려움', bgColor: '#f97316', textColor: '#ffffff' },
  '5': { label: '매우 어려움', bgColor: '#ef4444', textColor: '#ffffff' },
};

// Round 태그 변환
const roundTranslations: Record<string, TagTranslation> = {
  '1-2': { label: '1-2라운드', bgColor: '#06b6d4', textColor: '#ffffff' },
  '3-4': { label: '3-4라운드', bgColor: '#0891b2', textColor: '#ffffff' },
  '5-6': { label: '5-6라운드', bgColor: '#0e7490', textColor: '#ffffff' },
  '7-8': { label: '7-8라운드', bgColor: '#155e75', textColor: '#ffffff' },
  '9+': { label: '9라운드 이상', bgColor: '#164e63', textColor: '#ffffff' },
};

// Type 태그 변환
const typeTranslations: Record<string, TagTranslation> = {
  simulation: { label: '시뮬레이션', bgColor: '#db2777', textColor: '#ffffff' },
  strategy: { label: '전략', bgColor: '#e11d48', textColor: '#ffffff' },
  choice: { label: '선택', bgColor: '#f59e0b', textColor: '#ffffff' },
  luck: { label: '운', bgColor: '#8b5cf6', textColor: '#ffffff' },
  coop: { label: '협동', bgColor: '#10b981', textColor: '#ffffff' },
  brain: { label: '두뇌', bgColor: '#3b82f6', textColor: '#ffffff' },
};

// Survival Rate 태그 변환
const survivalRateTranslations: Record<string, TagTranslation> = {
  very_high: { label: '생존율 매우 높음', bgColor: '#16a34a', textColor: '#ffffff' },
  high: { label: '생존율 높음', bgColor: '#22c55e', textColor: '#ffffff' },
  medium: { label: '생존율 보통', bgColor: '#facc15', textColor: '#000000' },
  low: { label: '생존율 낮음', bgColor: '#f97316', textColor: '#ffffff' },
  very_low: { label: '생존율 매우 낮음', bgColor: '#dc2626', textColor: '#ffffff' },
};

// Win Condition 태그 변환
const winConditionTranslations: Record<string, TagTranslation> = {
  first: { label: '1등 달성', bgColor: '#fbbf24', textColor: '#000000' },
  score: { label: '점수 달성', bgColor: '#60a5fa', textColor: '#ffffff' },
  rank: { label: '순위 달성', bgColor: '#34d399', textColor: '#000000' },
  goal: { label: '목표 달성', bgColor: '#a78bfa', textColor: '#ffffff' },
  accuracy: { label: '정확도 달성', bgColor: '#f472b6', textColor: '#ffffff' },
};

/**
 * 태그를 한국어로 변환
 */
export function translateTag(
  category: 'scale' | 'difficulty' | 'round' | 'type' | 'survivalRate' | 'winCondition',
  value: string
): TagTranslation | null {
  const translations: Record<string, Record<string, TagTranslation>> = {
    scale: scaleTranslations,
    difficulty: difficultyTranslations,
    round: roundTranslations,
    type: typeTranslations,
    survivalRate: survivalRateTranslations,
    winCondition: winConditionTranslations,
  };

  const categoryTranslations = translations[category];
  return categoryTranslations?.[value] || null;
}

/**
 * 태그 배열을 한국어로 변환
 */
export function translateTags(tags: {
  scale?: string[];
  difficulty?: string[];
  round?: string[];
  type?: string[];
  survivalRate?: string[];
  winCondition?: string[];
}): TagTranslation[] {
  const result: TagTranslation[] = [];

  // 각 카테고리별로 변환
  if (tags.scale) {
    tags.scale.forEach(value => {
      const translated = translateTag('scale', value);
      if (translated) result.push(translated);
    });
  }

  if (tags.difficulty) {
    tags.difficulty.forEach(value => {
      const translated = translateTag('difficulty', value);
      if (translated) result.push(translated);
    });
  }

  if (tags.round) {
    tags.round.forEach(value => {
      const translated = translateTag('round', value);
      if (translated) result.push(translated);
    });
  }

  if (tags.type) {
    tags.type.forEach(value => {
      const translated = translateTag('type', value);
      if (translated) result.push(translated);
    });
  }

  if (tags.survivalRate) {
    tags.survivalRate.forEach(value => {
      const translated = translateTag('survivalRate', value);
      if (translated) result.push(translated);
    });
  }

  if (tags.winCondition) {
    tags.winCondition.forEach(value => {
      const translated = translateTag('winCondition', value);
      if (translated) result.push(translated);
    });
  }

  return result;
}
