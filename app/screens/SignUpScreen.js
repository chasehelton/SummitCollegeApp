import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function SignUpScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text>{'\n'}</Text>
      <Text>{'\n'}</Text>
      <Text style={styles.textFields}>{'Insert Text fields here\n'}</Text>
      <Text>{'\n'}</Text>
      <Text>{'\n'}</Text>
      <Text>Already have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.login}>Login Here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
  },
  textFields: {
    color: '#ddd',
  },
  login: {
    color: 'blue',
  },
});
