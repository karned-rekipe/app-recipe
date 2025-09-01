import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

interface LoginBackgroundProps {
  children: React.ReactNode;
}

export const LoginBackground: React.FC<LoginBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Image de fond - vous pouvez remplacer par votre image */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <View style={styles.overlay} />
        {children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
