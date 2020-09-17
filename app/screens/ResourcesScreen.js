import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Header from '../components/Header';

export default function ResourcesScreen() {
  return (
    <View style={styles.container}>
      <Header title={'Resources'} backButton={false} />
      <View style={styles.nonHeader}>
        <Text style={styles.comingSoonText}>Coming Soon.</Text>
        <Text style={styles.comingSoonSubtext}>The Resources feature will arrive by Christmas.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 48,
  },
  nonHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 20,
  },
  comingSoonSubtext: {
    fontSize: 12,
  },
});
