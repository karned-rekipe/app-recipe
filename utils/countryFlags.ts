/**
 * Utilitaire pour obtenir les drapeaux de pays
 */

// Mapping des pays avec leurs codes et drapeaux
const countryFlags: Record<string, { name: string; flag: string }> = {
  // Europe
  'France': { name: 'France', flag: '🇫🇷' },
  'Italie': { name: 'Italie', flag: '🇮🇹' },
  'Espagne': { name: 'Espagne', flag: '🇪🇸' },
  'Allemagne': { name: 'Allemagne', flag: '🇩🇪' },
  'Grèce': { name: 'Grèce', flag: '🇬🇷' },
  'Royaume-Uni': { name: 'Royaume-Uni', flag: '🇬🇧' },
  'Portugal': { name: 'Portugal', flag: '🇵🇹' },
  'Belgique': { name: 'Belgique', flag: '🇧🇪' },
  'Suisse': { name: 'Suisse', flag: '🇨🇭' },
  'Autriche': { name: 'Autriche', flag: '🇦🇹' },
  
  // Asie
  'Japon': { name: 'Japon', flag: '🇯🇵' },
  'Chine': { name: 'Chine', flag: '🇨🇳' },
  'Inde': { name: 'Inde', flag: '🇮🇳' },
  'Thaïlande': { name: 'Thaïlande', flag: '🇹🇭' },
  'Vietnam': { name: 'Vietnam', flag: '🇻🇳' },
  'Corée du Sud': { name: 'Corée du Sud', flag: '🇰🇷' },
  'Liban': { name: 'Liban', flag: '🇱🇧' },
  'Turquie': { name: 'Turquie', flag: '🇹🇷' },
  
  // Amériques
  'États-Unis': { name: 'États-Unis', flag: '🇺🇸' },
  'Mexique': { name: 'Mexique', flag: '🇲🇽' },
  'Brésil': { name: 'Brésil', flag: '🇧🇷' },
  'Argentine': { name: 'Argentine', flag: '🇦🇷' },
  'Pérou': { name: 'Pérou', flag: '🇵🇪' },
  'Canada': { name: 'Canada', flag: '🇨🇦' },
  
  // Afrique
  'Maroc': { name: 'Maroc', flag: '🇲🇦' },
  'Tunisie': { name: 'Tunisie', flag: '🇹🇳' },
  'Algérie': { name: 'Algérie', flag: '🇩🇿' },
  'Égypte': { name: 'Égypte', flag: '🇪🇬' },
  'Éthiopie': { name: 'Éthiopie', flag: '🇪🇹' },
  
  // Océanie
  'Australie': { name: 'Australie', flag: '🇦🇺' },
};

/**
 * Obtient le drapeau et le nom formaté d'un pays
 * @param country - Le nom du pays
 * @returns Un objet contenant le nom et le drapeau du pays
 */
export const getCountryInfo = (country: string | null): { name: string; flag: string } | null => {
  if (!country) return null;
  
  // Recherche exacte
  const exactMatch = countryFlags[country];
  if (exactMatch) return exactMatch;
  
  // Recherche insensible à la casse
  const lowerCountry = country.toLowerCase();
  const foundEntry = Object.entries(countryFlags).find(
    ([key]) => key.toLowerCase() === lowerCountry
  );
  
  if (foundEntry) return foundEntry[1];
  
  // Si aucun drapeau trouvé, retourner le nom avec un drapeau générique
  return { name: country, flag: '🏳️' };
};

/**
 * Formate l'affichage d'un pays avec son drapeau
 * @param country - Le nom du pays
 * @returns Une chaîne formatée avec le drapeau et le nom du pays
 */
export const formatCountryWithFlag = (country: string | null): string => {
  const countryInfo = getCountryInfo(country);
  if (!countryInfo) return '';
  
  return `${countryInfo.flag} ${countryInfo.name}`;
};

/**
 * Obtient la liste de tous les pays disponibles
 * @returns Un tableau des noms de pays
 */
export const getAllCountries = (): string[] => {
  return Object.keys(countryFlags);
};
