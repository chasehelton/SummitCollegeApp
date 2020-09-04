import React from 'react';
import {StyleSheet, View} from 'react-native';

import Header from '../components/Header';

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Header title={'Events'} backButton={false} />
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
