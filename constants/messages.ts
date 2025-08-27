export const messages = {
  errors: {
    recipeNotFound: 'Recette non trouvée',
  },
  actions: {
    back: 'Retour',
    close: 'Fermer',
  },
  empty: {
    noRecipes: 'Aucune recette disponible',
    noSearchResults: 'Aucune recette ne correspond à vos critères',
  },
  placeholders: {
    ingredients: 'Les ingrédients seront ajoutés prochainement...',
    utensils: 'Les ustensiles seront ajoutés prochainement...',
    instructions: 'Les instructions de préparation seront ajoutées prochainement...',
  },
  sections: {
    ingredients: 'Ingrédients',
    utensils: 'Ustensiles',
    instructions: 'Instructions',
  },
} as const;
