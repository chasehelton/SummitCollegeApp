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
import {createStackNavigator} from '@react-navigation/stack';
import AdminHomeScreen from './AdminHomeScreen';
import DirectoryScreen from './DirectoryScreen';
import PersonScreen from './PersonScreen';

//import { NavigationContainer } from '@react-navigation/native';

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

const AdminStack = createStackNavigator();

export default function AdminScreen({navigation, route}) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} />
      <AdminStack.Screen name="Directory" component={DirectoryScreen} />
      <AdminStack.Screen name="Person" component={PersonScreen} />
    </AdminStack.Navigator>
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
  header: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'center',
  },
  blueButton: {
    backgroundColor: '#3ab5e6',
    marginVertical: 25,
    padding: 25,
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
