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
  Component,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';

const searchIcon = 'search';

// define constants for users
const TYPE_STUDENT = 1;
const TYPE_LEADER = 2;
const TYPE_STAFF = 3;
const TYPE_DIRECTOR = 4;
const TYPE_ALL = 5;

const Item = ({title, index, photoURL}) => (
  <>
  <View style={styles.photoContainer} key="photoView">
    <Image source = {{uri: photoURL}}
        style = {styles.userPicture} />
  </View>
  <View style={{ flex: 6, }}>
    <Text key={index} style={styles.itemText}>
      {title}
    </Text>
  </View>
  </>
);

export default function DirectoryScreen({route, navigation}) {
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const {userType, header, isAdmin} = route.params;

  useLayoutEffect(() => {
    async function getUsers() {
      var searchType = '';
      if (userType === TYPE_STUDENT) searchType = 'student';
      else if (userType === TYPE_LEADER) searchType = 'studentLeader';
      else if (userType === TYPE_STAFF) searchType = 'staff';
      else if (userType === TYPE_DIRECTOR) searchType = 'director';
      //else if (userType === TYPE_ALL) searchType

      console.log('Search type: ' + searchType);
      var userSearchQuery = null;
      if (userType === TYPE_ALL)
        userSearchQuery = await firestore().collection('users').orderBy('firstName');
      else userSearchQuery = await firestore()
        .collection('users')
        .where('type', '==', searchType)
        .orderBy('firstName');
        //.get();


      const userSearchObserver = userSearchQuery.onSnapshot(userSearchSnapshot => {
        if (userSearchSnapshot.empty) {
          Alert.alert('Some error here for empty snapshot');
          return null;
        }

        console.log('Result size: ' + userSearchSnapshot.size);

        if (userSearchSnapshot.size === 0) {
          Alert.alert('No users found'); // with the email: ' + email);
          return null;
        }
        if (userSearchSnapshot == null) console.log('Snapshot is null');

        try {
          const tempUsers = [];
          var count = 0;
          userSearchSnapshot.forEach(function (doc) {
            tempUsers.push({
              data: doc.data(),
              id: count,
              ref: doc.ref,
            });
            count++;
          });
          console.log('Count: ' + count);
          console.log('Actual-set user length: ' + tempUsers.length);
          setUsers(tempUsers);
        } catch (error) {
          Alert.alert('Error', 'Some bad error here: ' + error);
        }
      });

      return () => userSearchObserver();
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
    console.log('Number of users: ' + users.length);
    navigation.navigate(isAdmin ? 'Admin' : 'Community', {
      screen: 'Person',
      params: {
        header: header,
        person: users[index],
        isAdmin: isAdmin,
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

  const checkPhotoURL = (url) => {
    if (url == null || url == '') {
      return 'https://www.pngitem.com/pimgs/m/517-5177724_vector-transparent-stock-icon-svg-profile-user-profile.png';
    }
    else return url;
  };

  return (
    <View contentContainerstyle={styles.container}>
      <View style={[styles.headerContainer, isAdmin ? styles.grayBackground : styles.whiteBackground]}>
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

      <View style={[styles.searchContainer, isAdmin ? styles.grayBackground : styles.whiteBackground]}>
        <View style={styles.searchIconBox}>
          <Icon
            name={searchIcon}
            type="feather"
            color="black"
            style={styles.searchIcon}
          />
        </View>


        <TextInput
          style={[styles.searchInput, isAdmin ? styles.whiteBackground : styles.grayBackground]}
          placeholder="Search"
          autoCorrect={false}
          onChangeText={(text) => searchFilterFunc(text)}
        />
      </View>

      <FlatList
        style={[styles.userList, isAdmin ? styles.whiteBackground : styles.grayBackground]}
        data={searchUsers}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={[styles.item, isAdmin ? styles.grayBackground : styles.whiteBackground]}
            onPress={() => selectPerson(item.id.toString())}>
            <Item title={item.data.displayName} key={index}
              photoURL=
              {checkPhotoURL(item.data.photoURL)}
              />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'white',
  },
  grayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  whiteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  grayBackground: {
    backgroundColor: '#eee',
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  backButton: {
    marginTop: 35,
    flex: 1,
  },
  userList: {
    height: '100%',
    //backgroundColor: 'white',
  },
  title: {
    flex: 4,
    marginTop: 35,
    //marginBottom: 25,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  empty: {
    flex: 1,
  },
  searchIconBox: {
    flex: 1,
    //marginVertical: 25,
  },
  searchIcon: {
    //marginRight: 10,
    backgroundColor: '#eee',
    //paddingLeft: 30,
    paddingTop: 13.8,
    paddingBottom: 13.8,
    //flex: 1,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  searchContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    //backgroundColor: '#eee',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  searchInput: {
    //backgroundColor: 'white',
    width: 325,
    padding: 12,
    paddingLeft: 0,
    //borderRadius: 8,
    borderBottomEndRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    marginVertical: 25,
    fontFamily: 'OpenSans-Regular',
    flex: 7,

  },

  item: {
    //backgroundColor: '#eee',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    width: '90%',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    fontFamily: 'OpenSans-SemiBold',
    //paddingLeft: 20,
  },
  photoContainer: {
    flex: 1,
    //paddingLeft: 20,
    //paddingRight: 15,
  },
  userPicture: {
    width: 25,
    height: 25,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
