import { theme } from '../constants/theme';
import { LegacyRecipe } from '../types/Recipe';

export const getTypeBadgeColor = (type: LegacyRecipe['type']): string => {
  switch (type) {
    case 'entrée':
      return theme.colors.badge.entrée;
    case 'plat':
      return theme.colors.badge.plat;
    case 'dessert':
      return theme.colors.badge.dessert;
    default:
      return theme.colors.badge.default;
  }
};

export const getDifficultyStars = (difficulty: LegacyRecipe['difficulty']): string => {
  return '👨‍🍳'.repeat(difficulty);
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h${remainingMinutes}min`;
};
