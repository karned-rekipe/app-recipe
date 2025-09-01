# Guide d'usage des composants de métadonnées

## 🎯 Composants disponibles

### Atomiques (usage granulaire)
```jsx
import { TypeBadge, DifficultyStars, TimeDisplay } from '../components';

// Badge de type avec variants
<TypeBadge type="entrée" variant="default" />    // Style détail
<TypeBadge type="plat" variant="compact" />      // Style carte

// Étoiles de difficulté avec tailles
<DifficultyStars difficulty={2} size="small" />   // 12px
<DifficultyStars difficulty={3} size="medium" />  // 14px  
<DifficultyStars difficulty={1} size="large" />   // 16px

// Affichage du temps avec formats
<TimeDisplay minutes={45} variant="default" />    // "45 minutes"
<TimeDisplay minutes={90} variant="compact" />    // "1h30min"
```

### Composé (usage complet)
```jsx
import { RecipeMetadata } from '../components';

// Dans une carte de liste
<RecipeMetadata 
  recipe={recipe} 
  variant="card"      // Styles compacts
  layout="vertical"   // Type dessus, durée/difficulté dessous
/>

// Dans une page de détail
<RecipeMetadata 
  recipe={recipe} 
  variant="detail"     // Styles étendus
  layout="horizontal"  // Type à gauche, infos à droite
/>
```

## 📱 Exemples concrets d'usage

### Écran de liste
```jsx
function RecipeList({ recipes }) {
  return (
    <FlatList
      data={recipes}
      renderItem={({ item }) => (
        <RecipeCard recipe={item} onPress={() => navigate('details', item.id)} />
      )}
    />
  );
}

// RecipeCard utilise automatiquement :
// <RecipeMetadata recipe={recipe} variant="card" layout="vertical" />
```

### Écran de détail  
```jsx
function RecipeDetailsScreen() {
  const recipe = useRecipe(id);
  
  return (
    <ScrollView>
      <RecipeHeader image={recipe.image} />
      
      {/* Utilise automatiquement les mêmes composants que la liste ! */}
      <RecipeDetails recipe={recipe} />
      
      <RecipeTitle name={recipe.name} countryFlag={recipe.countryFlag} />
      {/* ... */}
    </ScrollView>
  );
}

// RecipeDetails utilise automatiquement :
// <RecipeMetadata recipe={recipe} variant="detail" layout="horizontal" />
```

### Usage personnalisé
```jsx
function CustomRecipeCard({ recipe, showDetailed = false }) {
  return (
    <View>
      <Text>{recipe.name}</Text>
      
      {/* Affichage conditionnel avec même composant */}
      <RecipeMetadata 
        recipe={recipe} 
        variant={showDetailed ? "detail" : "card"}
        layout={showDetailed ? "vertical" : "horizontal"}
      />
    </View>
  );
}
```

### Nouveaux écrans facilités
```jsx
function RecipeSearchResults({ recipes }) {
  return (
    <View>
      {recipes.map(recipe => (
        <View key={recipe.id} style={styles.searchResult}>
          <Text>{recipe.name}</Text>
          
          {/* Réutilisation immédiate ! */}
          <RecipeMetadata recipe={recipe} variant="card" layout="horizontal" />
        </View>
      ))}
    </View>
  );
}

function RecipeFavorites({ recipes }) {
  return (
    <View>
      {recipes.map(recipe => (
        <View key={recipe.id}>
          <Text>{recipe.name} ❤️</Text>
          
          {/* Usage granulaire si besoin spécifique */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TypeBadge type={recipe.type} variant="compact" />
            <TimeDisplay minutes={recipe.totalTime} variant="compact" size="small" />
          </View>
        </View>
      ))}
    </View>
  );
}
```

## 🎨 Customisation avancée

### Nouveaux variants facilement ajoutables
```jsx
// Dans TypeBadge.tsx - ajouter un nouveau variant
export const TypeBadge = ({ type, variant = 'default' }) => {
  // Ajouter le nouveau variant
  if (variant === 'outlined') {
    return (
      <View style={[styles.outlinedBadge, { borderColor: getTypeColor(type) }]}>
        <Text style={[styles.outlinedText, { color: getTypeColor(type) }]}>
          {type}
        </Text>
      </View>
    );
  }
  // ... reste du code
};

// Usage immédiat partout
<TypeBadge type="dessert" variant="outlined" />
```

### Nouveaux layouts pour RecipeMetadata
```jsx
// Ajouter dans RecipeMetadata.tsx
if (layout === 'grid') {
  return (
    <View style={styles.gridContainer}>
      <TypeBadge type={recipe.type} variant={badgeVariant} />
      <DifficultyStars difficulty={recipe.difficulty} size={size} />
      <TimeDisplay minutes={recipe.totalTime} variant={timeVariant} size={size} />
    </View>
  );
}
```

## 🔧 Maintenance simplifiée

### Un seul endroit pour changer les styles
```jsx
// Dans TypeBadge.tsx - changement global
const getTypeColor = (recipeType) => {
  switch (recipeType) {
    case 'entrée':
      return '#2E7D32'; // ✅ Nouveau vert plus foncé
    // ...
  }
};

// ✅ TOUS les usages sont automatiquement mis à jour :
// - RecipeCard
// - RecipeDetails  
// - Futurs composants
```

### Tests centralisés et simples
```jsx
describe('RecipeMetadata', () => {
  const mockRecipe = {
    type: 'plat',
    difficulty: 2,
    totalTime: 45
  };

  it('affiche le bon variant pour les cartes', () => {
    render(<RecipeMetadata recipe={mockRecipe} variant="card" />);
    // Test de l'orchestration
  });

  it('affiche le bon layout horizontal', () => {
    render(<RecipeMetadata recipe={mockRecipe} layout="horizontal" />);
    // Test du layout
  });
});

// Tests granulaires séparés
describe('TypeBadge', () => {
  it('affiche le variant compact', () => {
    render(<TypeBadge type="entrée" variant="compact" />);
    // Test focalisé sur un seul aspect  
  });
});
```

Cette architecture modulaire permet un développement **rapide**, **cohérent** et **maintenable** ! 🚀
