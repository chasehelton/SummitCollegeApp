import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import mountain from '../assets/mountain.jpeg';
import logo from '../assets/logo.png';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={mountain} style={styles.image}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.text}>Summit College</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  text: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 350,
  },
});
