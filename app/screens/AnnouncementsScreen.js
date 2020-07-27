import React from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const addUser = (name) => {
  firestore()
    .collection('users')
    .add({
      name: name,
      age: Math.random() * 10,
    })
    .then(() => {
      Alert.alert('User added!');
    });
};

export default function AnnouncementsScreen() {
  const [name, setName] = React.useState('');
  return (
    <View style={styles.container}>
      <Text>Announcements</Text>
      <TextInput style={styles.input} onChangeText={(text) => setName(text)} />
      <Button title="Add user" onPress={() => addUser(name)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    width: 200,
  },
});
