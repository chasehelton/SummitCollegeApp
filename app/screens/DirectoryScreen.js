/* eslint-disable curly */
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';

// define constants for users
const TYPE_STUDENT = 1;
const TYPE_LEADER = 2;
const TYPE_STAFF = 3;
const TYPE_DIRECTOR = 4;

const Item = ({title, index}) => (
  <Text key={index} style={styles.itemText}>
    {title}
  </Text>
);

export default function DirectoryScreen({route, navigation}) {
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const {userType, header} = route.params;

  useLayoutEffect(() => {
    async function getUsers() {
      var searchType = '';
      if (userType === TYPE_STUDENT) searchType = 'student';
      else if (userType === TYPE_LEADER) searchType = 'studentLeader';
      else if (userType === TYPE_STAFF) searchType = 'staff';
      else if (userType === TYPE_DIRECTOR) searchType = 'director';

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
        querySnapshot.forEach(function (doc) {
          tempUsers.push({
            data: doc.data(),
            id: doc.data().email,
            ref: doc.ref,
          });
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

  useEffect(() => {
    setSearchUsers(users);
  }, [users]);

  const selectPerson = (index) => {
    console.log('Person is selected, with index ' + index.toString());
    navigation.navigate('Admin', {
      screen: 'Person',
      params: {
        header: header,
        person: users[index],
      },
    });
  };

  const searchFilterFunc = (text) => {
    const newData = users.filter((item, i) => {
      const itemData = item.data.displayName.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSearchUsers(newData);
  };

  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="keyboard-arrow-left" type="material" size={35} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.title}>
          {header}
        </Text>
        <Text style={styles.empty} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          autoCorrect={false}
          onChangeText={(text) => searchFilterFunc(text)}
        />
      </View>
      <FlatList
        style={styles.userList}
        data={searchUsers}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => selectPerson(index)}>
            <Item title={item.data.displayName} key={index} />
          </TouchableOpacity>
        )}
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
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
  },
  backButton: {
    marginTop: 37,
    marginStart: 15,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userList: {
    height: '100%',
    backgroundColor: 'white',
  },
  title: {
    flex: 4,
    marginTop: 40,
    //marginBottom: 25,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  empty: {
    flex: 1,
  },

  searchContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  searchInput: {
    backgroundColor: 'white',
    width: 300,
    padding: 12,
    borderRadius: 8,
    marginVertical: 25,
  },

  item: {
    backgroundColor: '#eee',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    width: '90%',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
});
