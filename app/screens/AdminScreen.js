import React from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

// define constants for actions
//const action_ban_staff = 0;
//const action_promote_student_staff = 1;
//const action_

// Admin can update the type status of a student user to be a staff.
const promoteStudentToStaffByEmail = (email) => {
  firestore()
    .collection('users')
    .where('email', '==', email)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size == 0) {
        Alert.alert('No users found with the email: ' + email);
      }
      else if (querySnapshot.size != 1) {
        Alert.alert('More than 1 user found with the email: ' + email);
      }
      else {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          doc.ref.update({
            type: "staff"
          })
          .then(function() {
            Alert.alert('User successfully updated to staff!');
          })
          .catch(function(error) {
            Alert.alert("Error updating document: ", error);
          });
        });
      }
    })
    .catch(function(error) {
      Alert.alert("Error with query: " + error);
    });
};

// Admin can update the banned status of a staff.
const banStaffMemberByEmail = (email, banFlag) => {
  firestore()
    .collection('users')
    .where('email', '==', email)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size == 0) {
        Alert.alert('No users found with the email: ' + email);
      }
      else if (querySnapshot.size != 1) {
        Alert.alert('More than 1 user found with the email: ' + email);
      }
      else {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots

          // check if this is a staff member
          if (doc.data().type != "staff") {
            Alert.alert("This user is not a staff member.");
          }
          else {
            doc.ref.update({
              banned: banFlag
            })
            .then(function() {
              if (banFlag)
                Alert.alert('User successfully banned.');
              else Alert.alert('User successfully unbanned');
            })
            .catch(function(error) {
              Alert.alert("Error updating document: ", error);
            });
          }
        });
      }
    })
    .catch(function(error) {
      Alert.alert("Error with query: " + error);
    });
};

// Admin can update the type status of a staff to be a director
const promoteStaffToDirector = (email) => {
  firestore()
    .collection('users')
    .where('email', '==', email)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size == 0) {
        Alert.alert('No users found with the email: ' + email);
      }
      else if (querySnapshot.size != 1) {
        Alert.alert('More than 1 user found with the email: ' + email);
      }
      else {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          doc.ref.update({
            type: "director"
          })
          .then(function() {
            Alert.alert('User successfully updated to director!');
          })
          .catch(function(error) {
            Alert.alert("Error updating document: ", error);
          });
        });
      }
    })
    .catch(function(error) {
      Alert.alert("Error with query: " + error);
    });
};

// Admin can update the banned status of a director
const banDirectorByEmail = (email, banFlag) => {
  firestore()
    .collection('users')
    .where('email', '==', email)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size == 0) {
        Alert.alert('No users found with the email: ' + email);
      }
      else if (querySnapshot.size != 1) {
        Alert.alert('More than 1 user found with the email: ' + email);
      }
      else {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots

          // check if this is a staff member
          if (doc.data().type != "director") {
            Alert.alert("This user is not a director.");
          }
          else {
            doc.ref.update({
              banned: banFlag
            })
            .then(function() {
              if (banFlag)
                Alert.alert('User successfully banned.');
              else Alert.alert('User successfully unbanned');
            })
            .catch(function(error) {
              Alert.alert("Error updating document: ", error);
            });
          }
        });
      }
    })
    .catch(function(error) {
      Alert.alert("Error with query: " + error);
    });
};


export default function AdminScreen() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  return (
    <View style={styles.container}>
      <Text>Admin Page!{"\n"}</Text>

      <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} />
      <Text>{"\n\n\n"}</Text>

      <Button title="Add staff by email" onPress={() => promoteStudentToStaffByEmail(email)} />
      <Text>{"\n\n\n"}</Text>

      <Button title="Ban staff by email" onPress={() => banStaffMemberByEmail(email, true)} />
      <Text>{"\n\n\n"}</Text>

      <Button title="Add director by email" onPress={() => promoteStaffToDirectorByEmail(email)} />
      <Text>{"\n\n\n"}</Text>

      <Button title="Ban staff by email" onPress={() => banDirectorByEmail(email, true)} />
      <Text>{"\n\n\n"}</Text>
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
  }
});
