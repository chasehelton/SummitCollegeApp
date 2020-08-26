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
  Image,
  LogBox
  } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import DropDownPicker from 'react-native-dropdown-picker';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);


// define constants for actions
const ACTION_BAN = 0;
const ACTION_CHANGE_TYPE = 1;
const ACTION_MAKE_LEADER = 2;
const ACTION_MAKE_STAFF = 3;
const ACTION_MAKE_DIRECTOR = 4;
const ACTION_MAKE_STUDENT = 5;

// define constants for users
const TYPE_STUDENT = 1;
const TYPE_LEADER = 2;
const TYPE_STAFF = 3;
const TYPE_DIRECTOR = 4;



export default function PersonScreen({ route, navigation }) {
  const [users, setUsers] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { person } = route.params;
  const [manageAccountVisible, setManageAccountVisible] = React.useState(false);
  const [manageArrow, setManageArrow] = React.useState('\u25BF'); // down is default


  const downArrow = '\u25BF';
  const upArrow = '\u25B5';

  const toggleManageAccount = () => {
    setManageAccountVisible(!manageAccountVisible);
    if (manageArrow == downArrow) {
      setManageArrow(upArrow);
    }
    else setManageArrow(downArrow);
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getUserByEmail = async (email) => {
    const querySnapshot = await firestore().collection('users').where('email', '==', email).get();
    if (querySnapshot.empty) {
      Alert.alert('Some error here for empty snapshot');
      return null;
    }

    console.log("Result size: " + querySnapshot.size);

    if (querySnapshot.size == 0) {
      Alert.alert('No users found with the email: ' + email);
      return null;
    }
    else if (querySnapshot.size != 1) {
      Alert.alert('More than 1 user found with the email: ' + email);
      return null;
    }
    if (querySnapshot == null) console.log("Snapshot is null");

    return querySnapshot;
  };

  const updateUser = async (user, action, value) => {
    try {
      console.log("Email: " + user.data.email);

      // first ask if they want to do it

      switch (action) {
        case ACTION_BAN:
          user.ref.update({
            banned: value
          })
          .then(function() {
            if (value)
              Alert.alert('User successfully banned.');
            else Alert.alert('User successfully unbanned.');
          })
          .catch(function(error) {
            Alert.alert("Error updating document: ", error);
          });
          break;
        case ACTION_CHANGE_TYPE:
          Alert.alert('', 'Are you sure you want to make this user a ' + value + '?',
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => user.ref.update({
                                                       type: value
                                                     })
                                                     .then(function() {
                                                       Alert.alert('User successfully updated to ' + value + '!');
                                                     })
                                                     .catch(function(error) {
                                                       console.log("Error: " + error);
                                                       Alert.alert("Error updating document: ", error);
                                                     }),
              }
            ],
            { cancelable: false });

          break;
        default:
          console.log("Invalid action provided: " + action);
          // what error to display to the user? probably none
      }
    } catch (error) {
      Alert.alert('Error', 'Some bad error here: ' + error);
    }
  };

  return (
    <View contentContainerStyle={styles.container}>
      <Text style={styles.header}>Students{"\n"}</Text>

      <Image source = {{uri: person.data.photoURL}}
         style={styles.profilePic}
      />

      <Text style={styles.personName}>{person.data.displayName}</Text>

      <Text style={styles.personInfo}>{capitalize(person.data.type)}</Text>
      <Text style={styles.personInfo}>Class of {person.data.gradYear}</Text>

      <TouchableOpacity
        onPress={() => toggleManageAccount()}
        style={styles.blueButton}>
        <Text style={styles.buttonText}>Manage Account {manageArrow}</Text>
      </TouchableOpacity>



      {manageAccountVisible && (<View>
      <TouchableOpacity
        onPress={() => updateUser(person, ACTION_CHANGE_TYPE, 'student')}
        style={[styles.whiteButton, { borderTopLeftRadius: -10,} ]}>
        <Text style={styles.blackButtonText}>Make Student</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => updateUser(person, ACTION_CHANGE_TYPE, 'studentLeader')}
        style={styles.whiteButton}>
        <Text style={styles.blackButtonText}>Make Student Leader</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => updateUser(person, ACTION_CHANGE_TYPE, 'staff')}
        style={styles.whiteButton}>
        <Text style={styles.blackButtonText}>Make Staff</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => updateUser(person, ACTION_CHANGE_TYPE, 'director')}
        style={[
          styles.whiteButton,
          { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, } ]}>
        <Text style={styles.blackButtonText}>Make Director</Text>
      </TouchableOpacity>

      </View>

      )
      }



    </View>
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
    height: '100%',
    flexDirection: 'column'
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePic: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 30
  },
  personName: {
    color: '#3ab5e6',
    fontSize: 32,
    alignSelf: 'center',
    marginBottom: 10
  },
  personInfo: {
    //color: '#3ab5e6',
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 5
  },
  infoPanel: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  managePanel: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueButton: {
    backgroundColor: '#3ab5e6',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  blackButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  whiteButton: {
    backgroundColor: '#fff',
    width: '80%',
    alignSelf: 'center',
    borderWidth: 1.1,
    borderColor: '#3939391A',
  },
  item: {
      backgroundColor: '#e6e6e6',
      padding: 20,
      marginVertical: 4,
      marginHorizontal: 16,
    },
    itemText: {
      fontSize: 12,
      color: 'black',
      fontWeight: 'bold'
    },
});
