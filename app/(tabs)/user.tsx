import { SafeAreaView, StyleSheet, View, Text, Alert, ScrollView } from "react-native";
import { AuthButton } from "../../components/auth/AuthButton";
import { LicenseInfo } from "../../components/LicenseInfo";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";

export default function UserScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/login");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
          <Text style={styles.welcome}>Bonjour {user?.username || 'Utilisateur'} !</Text>
        </View>
        
        <View style={styles.licenseSection}>
          <LicenseInfo />
        </View>

        <View style={styles.actions}>
          <AuthButton 
            title="Se déconnecter"
            onPress={handleLogout}
            variant="secondary"
          />
        </View>
      </ScrollView>
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  licenseSection: {
    flex: 1,
    marginBottom: 24,
  },
  actions: {
    paddingTop: 20,
  },
});
