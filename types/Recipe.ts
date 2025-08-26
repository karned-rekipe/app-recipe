export interface Recipe {
  id: string;
  name: string;
  type: 'entrée' | 'plat' | 'dessert';
  difficulty: 1 | 2 | 3; // Changé de 1-5 à 1-3 (toques)
  totalTime: number; // temps en minutes
  country: string;
  countryFlag: string; // emoji du drapeau
  image?: string; // URL ou chemin de l'image miniature
}
