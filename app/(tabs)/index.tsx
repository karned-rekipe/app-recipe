import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from "react-native";
import RecipeList from "../../components/RecipeList";
import { sampleRecipes } from "../../data/sampleRecipes";
import { Recipe } from "../../types/Recipe";
import { UserHeader } from "../../components/auth/UserHeader";

export default function RecipeListScreen() {
  const handleRecipePress = (recipe: Recipe) => {
    // Navigation vers l'écran de détail avec l'ID de la recette
    router.push(`/recipe-details?id=${recipe.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <UserHeader />
      <View style={styles.content}>
        <RecipeList 
          recipes={sampleRecipes}
          onRecipePress={handleRecipePress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
});
