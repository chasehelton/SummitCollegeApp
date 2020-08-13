import React from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';

// define constants for actions
const ACTION_BAN = 0;
const ACTION_CHANGE_TYPE = 1;
const ACTION_MAKE_LEADER = 2;
const ACTION_MAKE_STAFF = 3;
const ACTION_MAKE_DIRECTOR = 4;

const getUsersByEmail = async (email) => {
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

const updateUser = async (email, action, value) => {
  try {
    console.log("Email: " + email);
    const querySnapshot = await getUsersByEmail(email.trim());

    if (querySnapshot != null) {
      querySnapshot.forEach(function(doc) {

        switch (action) {
          case ACTION_BAN:
            doc.ref.update({
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
            doc.ref.update({
              type: value
            })
            .then(function() {
              Alert.alert('User successfully updated to ' + value + '!');
            })
            .catch(function(error) {
              console.log("Error: " + error);
              Alert.alert("Error updating document: ", error);
            });
            break;
          default:
            console.log("Invalid action provided: " + action);
            // what error to display to the user? probably none
        }
      });
    }
  } catch (error) {
    Alert.alert('Error', 'Some bad error here: ' + error);
  }
};

export default function AdminScreen() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Admin Page!{"\n"}</Text>

      <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} />
      <Text>{"\n"}</Text>

      <Button title="Add staff by email" onPress={() => updateUser(email, ACTION_CHANGE_TYPE, 'staff')} />
      <Text>{"\n"}</Text>

      <Button title="Ban user by email" onPress={() => updateUser(email, ACTION_BAN, true)} />
      <Text>{"\n"}</Text>

      <Button title="Add director by email" onPress={() => updateUser(email, ACTION_CHANGE_TYPE, 'director')} />
    </ScrollView>
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
  }
});
