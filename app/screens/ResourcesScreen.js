import React from 'react';
import {StyleSheet, View} from 'react-native';

import Header from '../components/Header';

export default function ResourcesScreen() {
  return (
    <View style={styles.container}>
      <Header title={'Resources'} backButton={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 48,
  },
});
