import React from 'react';
import {Stylesheet, Text, View} from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings!</Text>
    </View>
  );
}

const styles = Stylesheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
