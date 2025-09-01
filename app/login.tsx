/**
 * Écran de connexion principal avec image de fond
 */

import React from 'react';
import { 
  StyleSheet, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LoginForm } from '../components/auth/LoginForm';
import { LoginBackground } from '../components/LoginBackground';

export default function LoginScreen() {
  const handleLoginSuccess = () => {
    // La navigation sera gérée automatiquement par le contexte d'authentification
    console.log('Connexion réussie');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LoginBackground>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </LoginBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
