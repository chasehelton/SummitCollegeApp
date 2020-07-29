import React from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Admin can update the type status of a student user to be a staff.
const addStaff = (name) => {
    firestore()
       .collection('users')
       .doc('chase')
       .update({
         type: "staff"
       })
       .then(function() {
         Alert.alert('User updated to staff!');
         })
       .catch(function(error) {
         // The user doesn't exist?
         Alert.alert("Error updating document: ", error);
       });
};

// Admin can update the banned status of a staff.

// Admin can update the type status of a staff to be a director

//Admin can update the banned status of a director



export default function AdminScreen() {
  const [name, setName] = React.useState('');
  return (
    <View style={styles.container}>
      <Text>Admin Page!</Text>
      <TextInput style={styles.input} onChangeText={(text) => setName(text)} />
            <Button title="Update staff" onPress={() => addStaff(name)} />
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
