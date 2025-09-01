import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthGuard } from '../components/auth/AuthGuard';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="recipe-details" 
            options={{ 
              headerShown: false,
              presentation: 'modal' // Pour une transition plus fluide
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </AuthGuard>
    </AuthProvider>
  );
}
