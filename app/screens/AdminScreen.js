import React from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

// define constants for actions
const ACTION_BAN = 0;
const ACTION_CHANGE_TYPE = 1;
const ACTION_MAKE_LEADER = 2;
const ACTION_MAKE_STAFF = 3;
const ACTION_MAKE_DIRECTOR = 4;

// define constants for users
const TYPE_STUDENT = 1;
const TYPE_LEADER = 2;
const TYPE_STAFF = 3;
const TYPE_DIRECTOR = 4;

const getUsersByEmail = async (email) => {
  const querySnapshot = await firestore()
    .collection('users')
    .where('email', '==', email)
    .get();
  if (querySnapshot.empty) {
    Alert.alert('Some error here for empty snapshot');
    return null;
  }

  console.log('Result size: ' + querySnapshot.size);

  if (querySnapshot.size == 0) {
    Alert.alert('No users found with the email: ' + email);
    return null;
  } else if (querySnapshot.size != 1) {
    Alert.alert('More than 1 user found with the email: ' + email);
    return null;
  }
  if (querySnapshot == null) console.log('Snapshot is null');

  return querySnapshot;
};

export default function AdminScreen({navigation}) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <>
      <Text style={styles.header}>Who are you looking for?{'\n'}</Text>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Directory', {
              userType: TYPE_STUDENT,
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Students</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Directory', {
              userType: TYPE_LEADER,
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Student Leaders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Directory', {
              userType: TYPE_STAFF,
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Staff</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Directory', {
              userType: TYPE_DIRECTOR,
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Directors</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

/*<TextInput style={styles.input} onChangeText={(text) => setEmail(text)} />
      <Text>{"\n"}</Text>

      <Button title="Add staff by email" onPress={() => updateUser(email, ACTION_CHANGE_TYPE, 'staff')} />
      <Text>{"\n"}</Text>

      <Button title="Ban user by email" onPress={() => updateUser(email, ACTION_BAN, true)} />
      <Text>{"\n"}</Text>

      <Button title="Add director by email" onPress={() => updateUser(email, ACTION_CHANGE_TYPE, 'director')} />*/

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
  header: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'center',
  },
  blueButton: {
    backgroundColor: '#3ab5e6',
    marginVertical: 25,
    padding: 15,
    width: 200,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});
