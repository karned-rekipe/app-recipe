export interface RecipeFilters {
  types: string[];
  difficulties: number[];
  countries: string[];
}

export const getInitialFilters = (): RecipeFilters => ({
  types: [],
  difficulties: [],
  countries: [],
});

export const hasActiveFilters = (filters: RecipeFilters): boolean => {
  return filters.types.length > 0 || filters.difficulties.length > 0 || filters.countries.length > 0;
};
