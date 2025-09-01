/**
 * Composant de fond avec motif géométrique moderne
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, Polygon } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export function ModernBackground() {
  return (
    <View style={styles.container}>
      <Svg style={StyleSheet.absoluteFillObject} width={width} height={height}>
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#667eea" stopOpacity="1" />
            <Stop offset="50%" stopColor="#764ba2" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#f093fb" stopOpacity="0.6" />
          </LinearGradient>
          <LinearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.1)" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0.05)" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>
        
        {/* Fond principal */}
        <Path
          d={`M0,0 L${width},0 L${width},${height} L0,${height} Z`}
          fill="url(#grad1)"
        />
        
        {/* Formes géométriques décoratives */}
        <Circle
          cx={width * 0.15}
          cy={height * 0.2}
          r="60"
          fill="rgba(255,255,255,0.1)"
          opacity="0.6"
        />
        
        <Circle
          cx={width * 0.85}
          cy={height * 0.8}
          r="80"
          fill="rgba(255,255,255,0.05)"
          opacity="0.8"
        />
        
        <Polygon
          points={`${width * 0.9},${height * 0.1} ${width * 0.95},${height * 0.25} ${width * 0.85},${height * 0.25}`}
          fill="rgba(255,255,255,0.08)"
          opacity="0.7"
        />
        
        <Circle
          cx={width * 0.1}
          cy={height * 0.9}
          r="40"
          fill="rgba(255,255,255,0.06)"
          opacity="0.9"
        />
        
        {/* Overlay avec motif subtil */}
        <Path
          d={`M0,0 L${width},0 L${width},${height} L0,${height} Z`}
          fill="url(#grad2)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
