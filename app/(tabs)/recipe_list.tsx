import { Alert, SafeAreaView, StyleSheet } from "react-native";
import RecipeList from "../../components/RecipeList";
import { sampleRecipes } from "../../data/sampleRecipes";
import { Recipe } from "../../types/Recipe";

export default function RecipeListScreen() {
  const handleRecipePress = (recipe: Recipe) => {
    Alert.alert(
      recipe.name,
      `Recette ${recipe.type} de ${recipe.country}\nDifficulté: ${recipe.difficulty}/5\nTemps: ${recipe.totalTime} minutes`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RecipeList 
        recipes={sampleRecipes}
        onRecipePress={handleRecipePress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
