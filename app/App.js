import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import mountain from './assets/mountain.jpeg';

function App() {
  return (
    <View style={styles.container}>
      <ImageBackground source={mountain} style={styles.image}>
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
  text: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 300,
  },
});

export default App;
