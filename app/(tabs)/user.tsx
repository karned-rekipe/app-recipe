import { SafeAreaView, StyleSheet, View, Text, Alert } from "react-native";
import { AuthButton } from "../../components/auth/AuthButton";
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.welcome}>Bonjour {user?.username || 'Utilisateur'} !</Text>
          <Text style={styles.subtitle}>Informations du profil à venir...</Text>
        </View>

        <View style={styles.actions}>
          <AuthButton 
            title="Se déconnecter"
            onPress={handleLogout}
            variant="secondary"
          />
        </View>
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
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    paddingBottom: 20,
  },
});
