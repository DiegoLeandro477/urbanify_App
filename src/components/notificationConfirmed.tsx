// ConfirmDeleteModal.js
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, Animated } from 'react-native';
import { Colors, font, Class } from '../styles/globalVariable';


const NotificationConfirmed = () => {
  return (
    <View style={styles.modal}>
      <Image source={require('../../assets/icons/Featured icon.png')} style={styles.icon} />
      <Text style={[font.font_1.m_b, Class.c12, styles.text]}>Obrigado por reportar!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0,90,0, .3)',
    marginHorizontal: 'auto',
    borderRadius: 30,
    padding: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    position: 'relative'
  },
  icon: {
    backgroundColor: Colors.cors.c12,
    borderRadius: 50,
    position: 'relative',
    left: -10, 
    height: 64,
    width: 64,
  },
  text: {
    textShadowColor: Colors.cors.c0, // Cor da sombra
    textShadowOffset: { width: 1, height: 1 }, // Posição da sombra
    textShadowRadius: 1, // Intensidade de desfocagem
  },
});

export default NotificationConfirmed;
