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
import DirectoryScreen from './DirectoryScreen';
import PersonScreen from './PersonScreen';
import {summitBlue} from '../assets/colors';

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
  if (querySnapshot == null) {
    console.log('Snapshot is null');
  }

  return querySnapshot;
};

const AdminStack = createStackNavigator();

export default function AdminHomeScreen({navigation, route}) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Admin</Text>
        <Text style={styles.text}>Who are you looking for?{'\n'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Students',
                userType: TYPE_STUDENT,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Students</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Student Leaders',
                userType: TYPE_LEADER,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Student Leaders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Staff',
                userType: TYPE_STAFF,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Staff</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Directors',
                userType: TYPE_DIRECTOR,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Directors</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    width: 200,
  },
  headerContainer: {
    backgroundColor: '#eee',
  },
  header: {
    marginTop: 50,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    marginVertical: 25,
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    color: summitBlue,
  },
  blueButton: {
    backgroundColor: '#3ab5e6',
    marginVertical: 15,
    padding: 30,
    width: '80%',
    borderRadius: 8,
    elevation: 2, // Android
    shadowColor: 'rgba(0,0,0, .3)', // IOS
    shadowOffset: {height: 4, width: 4}, // IOS
    shadowOpacity: 0.2, // IOS
    shadowRadius: 0.5, //IOS
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
  },
});
