import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthGuard } from '../components/auth/AuthGuard';
import React, { useEffect } from 'react';
import Head from 'expo-router/head';

export default function RootLayout() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffb300" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rekipe" />
      </Head>
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
    </>
  );
}
