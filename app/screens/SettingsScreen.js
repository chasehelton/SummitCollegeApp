import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';

import Header from '../components/Header';

const handleLogOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Header title={'Settings'} backButton={false} />
      <TouchableOpacity style={styles.logout} onPress={() => handleLogOut()}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  logout: {
    width: '80%',
    alignItems: 'center',
    marginTop: 50,
    fontSize: 24,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
});
