export const theme = {
  colors: {
    primary: '#007AFF',
    white: '#fff',
    black: '#000',
    text: {
      primary: '#333',
      secondary: '#666',
      placeholder: '#999',
    },
    background: {
      white: '#fff',
      overlay: 'rgba(0, 0, 0, 0.5)',
      overlayLight: 'rgba(255, 255, 255, 0.9)',
    },
    badge: {
      // Couleurs pour les badges de type
      entrée: '#4CAF50',
      plat: '#FF9800', 
      dessert: '#E91E63',
      default: '#757575',
    },
    shadow: {
      color: '#000',
      opacity: 0.25,
    },
    // Nouvelles couleurs pour l'authentification
    border: '#E1E1E1',
    error: '#FF3B30',
    success: '#34C759',
    textSecondary: '#666',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  borderRadius: {
    sm: 8,
    md: 20,
  },
  fontSize: {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 28,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: 'bold' as const,
  },
  shadow: {
    default: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
} as const;

export const layout = {
  recipeImageHeight: 250,
  noImageContainerHeight: 80,
  closeButtonSize: 24,
  closeButtonPadding: 8,
  closeButtonTop: 10,
  closeButtonRight: 10,
  flagSize: 32,
  iconSize: 20,
} as const;
