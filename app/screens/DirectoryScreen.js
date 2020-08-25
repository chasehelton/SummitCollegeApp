import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


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

const Item = ({title}) => (
  <TouchableOpacity style={styles.item}>
    <Text style={styles.itemText}>{title}</Text>
  </TouchableOpacity>
);

export default function DirectoryScreen({route, navigation}) {
  const [users, setUsers] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const {userType} = route.params;

  useEffect(() => {
    async function getUsers() {
      var searchType = '';
      if (userType === TYPE_STUDENT) searchType = 'student';
      else if (userType === TYPE_LEADER) searchType = 'studentLeader';
      else if (userType === TYPE_STAFF) searchType = 'staff';
      else if (userType === TYPE_LEADER) searchType = 'director';

      console.log('Search type: ' + searchType);
      const querySnapshot = await firestore()
        .collection('users')
        .where('type', '==', searchType)
        .get();
      if (querySnapshot.empty) {
        Alert.alert('Some error here for empty snapshot');
        return null;
      }

      console.log('Result size: ' + querySnapshot.size);

      if (querySnapshot.size === 0) {
        Alert.alert('No users found'); // with the email: ' + email);
        return null;
      }
      if (querySnapshot == null) console.log('Snapshot is null');

      try {
        const tempUsers = [];
        querySnapshot.forEach((doc) => {
          tempUsers.push({name: doc.data().displayName, id: doc.data().email});
        });
        console.log('Actual-set user length: ' + tempUsers.length);
        setUsers(tempUsers);
      } catch (error) {
        Alert.alert('Error', 'Some bad error here: ' + error);
      }
    }

    if (!isLoaded) {
      getUsers();
      setIsLoaded(true);
    }
  }, [users, isLoaded, userType]);

  return (
    <View contentContainerStyle={styles.container}>
      <Text style={styles.header}>Directory{'\n'}</Text>
      <FlatList
        data={users}
        renderItem={({item}) => <Item title={item.name} />}
        keyExtractor={(item) => item.id}
      />
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
  },
  header: {
    marginTop: 50,
    //flex: 1
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 24,
  },
  item: {
    backgroundColor: '#e6e6e6',
    padding: 20,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    width: '80%',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});
