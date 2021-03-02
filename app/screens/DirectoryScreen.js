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
  Pressable,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
import CheckBox from '@react-native-community/checkbox';
import {summitBlue} from '../assets/colors';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import AppContext from '../components/AppContext.js';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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
  const {userType, header, isAdmin, fromCommunity} = route.params;

  const [checkBoxStateArray, setCheckBoxStateArray] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  //const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const [selectedFlag, setSelectedFlag] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupPicLink, setNewGroupPicLink] = useState('https://pbs.twimg.com/profile_images/607638188052480000/wlFtAOhB.png');
  const [response, setResponse] = React.useState(null);

  const context = React.useContext(AppContext);

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
          const tempCheckboxes = [];
          var count = 0;
          userSearchSnapshot.forEach(function (doc) {
            // if this is me, don't add?
            if (doc.id != auth().currentUser.uid) {
              tempUsers.push({
                data: doc.data(),
                id: count,
                ref: doc.ref,
                checked: false,
              });
              count++;
              tempCheckboxes.push(false);
            }
            else {
              console.log('Found the existing user in the users DB');
            }
          });
          console.log('Count: ' + count);
          console.log('Actual-set user length: ' + tempUsers.length);
          setUsers(tempUsers);
          setCheckBoxStateArray(tempCheckboxes);
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

  const selectPerson = (index, item) => {
    // if coming from community screen... you should select them as part of a multi-check list
    if (fromCommunity) {
      // toggle the "checkbox" somehow
      updateCheckBoxStateArray(index);
      //item.checked = !item.checked;
      //users[index].checked = !users[index].checked;
      //console.log('Now checked: ' + item.checked);
      var index = selectedUsers.indexOf(item);
      console.log('Index: ' + index);
      var tempSelectedUsers = selectedUsers;
      if (index == -1)
        tempSelectedUsers.push(item);
      else tempSelectedUsers.splice(index, 1);
      setSelectedUsers(tempSelectedUsers);
      setSelectedFlag(!selectedFlag);
      //setSelectedId(null);
      // update searchUsers somehow?
    }
    // if not, then coming from Admin probably sooo navigate to Person screen
    else {
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
    }
  };

  const updateCheckBoxStateArray = (index) => {
    var tempArray = checkBoxStateArray;
    tempArray[index] = !tempArray[index];
    console.log('Is now selected?: ' + tempArray[index]);
    setCheckBoxStateArray(tempArray);
    console.log('Test value: ' + checkBoxStateArray[index]);
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

  // TODO: add this as a button at the top of the page that only appears if fromCommunity is true!
  const createNewChat = async () => {

    if (newGroupName == '' || newGroupName == 'Group Name')
      return;

    console.log('Creating new chat');

    // if no users selected, don't do anything?

    // create new chat between logged in user and the selected persons
    // first, get uid's of all
    var userArray = [];
    userArray.push(auth().currentUser.uid);
    for (var i = 0; i < selectedUsers.length; i++) {
      userArray.push(selectedUsers[i].data.uid);
      console.log('Adding selected user id: ' + selectedUsers[i].data.uid);
    }

    // add this picture to the Firebase Storage
    // Create a root reference
    const reference = storage().ref('/group_pictures/' + response.fileName);

    // uploads file
    await reference.putFile(response.uri);
    const url = await reference.getDownloadURL();

    // create a new room with lastUpdated, name, photoURL, and add both uid's to the members array
    const roomObj = {
      lastUpdated: firestore.Timestamp.fromDate(new Date()),
      name: newGroupName,
      photoURL: url, //'https://pbs.twimg.com/profile_images/607638188052480000/wlFtAOhB.png',
      members: userArray,
      admin: auth().currentUser.uid,
    };
    const newRoom = await firestore().collection('rooms').add(roomObj);
    context.userDoc.rooms.push(newRoom.id);

    console.log('Added new room with ID: ', newRoom.id);

    // save the new room's id and add this id to each user's rooms array
    for (var i = 0; i < userArray.length; i++) {
      firestore().collection('users').doc(userArray[i])
        .update({
          rooms: /*admin.*/firestore.FieldValue.arrayUnion(newRoom.id)
        });
    }
    setModalVisible(false);


    // now navigate to that room?
    // for now, navigate back to the community page and see what happens
    navigation.pop(1);
    console.log('SEE IF THIS GETS RAN ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  };

  const selectPicture = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (response) => {
        console.log('Did user cancel?: ' + response.didCancel);
        console.log('Response error message: ' + response.errorMessage);
        if (!response.didCancel) {

          console.log('Response uri: ' + response.uri);
          setResponse(response);
        }

      },
    );
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
        {!fromCommunity && (
          <Text style={styles.empty} />
        )}
        {fromCommunity && selectedUsers.length == 0 && (
          <TouchableOpacity
            style={styles.rightHeaderButton}
            >
            <Icon name="plus" type="feather" size={35} />
          </TouchableOpacity>
        )}
        {fromCommunity && selectedUsers.length > 0 && (
          <TouchableOpacity
            style={styles.rightHeaderButton}
            onPress={() => setModalVisible(true)}>
            <Icon name="plus" type="feather" size={35} color={summitBlue} />
          </TouchableOpacity>
        )}
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
      {/*<CheckBox
                         disabled={false}
                         value={checkBoxStateArray[index]}
                         onValueChange={(newValue) => updateCheckBoxStateArray(index, newValue)}
                       />*/}

      <FlatList
        style={[styles.userList, isAdmin ? styles.whiteBackground : styles.grayBackground]}
        data={searchUsers}
        extraData={selectedFlag}
        renderItem={({item, index}) => (
          <TouchableOpacity
                style={[styles.item, selectedUsers.indexOf(item) != -1 ? styles.blueBackground : styles.whiteBackground]}
                onPress={() => selectPerson(item.id.toString(), item)}>

                <Item title={item.data.displayName} key={index}
                  photoURL=
                  {checkPhotoURL(item.data.photoURL)}
                  />
              </TouchableOpacity>
            )


        }
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
          console.log('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{'Type in the group name:'}</Text>

            <TextInput
              style={[styles.groupNameInput, styles.grayBackground]}
              placeholder="Group Name"
              autoCorrect={false}
              onChangeText={(text) => setNewGroupName(text)}
            />

            {response == null && (
              <Image source={{uri: newGroupPicLink}} style={styles.newGroupPic} />
            )}
            {response != null && (
              <Image source={{uri: response.uri}} style={styles.newGroupPic} />
            )}

            <TouchableOpacity
              style={styles.changePictureButton}
              onPress={() => selectPicture()}
            >
              <Text style={styles.modalText}>{'Change Group Picture'}</Text>
            </TouchableOpacity>

            <View style={styles.bottomRowModal}>

                <TouchableOpacity
                  style={[styles.modalButton,
                    newGroupName != '' && newGroupName != 'Group Name' ? styles.createGroupButton
                      : styles.createGroupButtonDisabled]}
                  onPress={() => createNewChat()}
                >
                  <Text style={styles.modalButtonText}>{'Create Group'}</Text>
                </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>{'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  blueBackground: {
    backgroundColor: summitBlue,
  },
  backButton: {
    marginTop: 35,
    flex: 1,
  },
  rightHeaderButton: {
    marginTop: 35,
    flex: 1,
    //justifyContent: 'flex-end',
    //alignItems: 'flex-end',
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
  noEffect: {
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,

  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
  },
  bottomRowModal: {
    flexDirection: 'row',
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 10,
  },
  createGroupButtonDisabled: {
    backgroundColor: 'gray',
  },
  createGroupButton: {
    backgroundColor: summitBlue,
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'OpenSans-Regular',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: 'OpenSans-Bold',
  },
  groupNameInput: {
    //backgroundColor: 'white',
    width: 325,
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,

    //borderBottomEndRadius: 8,
    //borderBottomRightRadius: 8,
    //
    borderTopRightRadius: 8,
    marginVertical: 25,
    fontFamily: 'OpenSans-Regular',
  },
  changePictureButton: {
    marginVertical: 30,
  },
  newGroupPic: {
    width: 75,
    height: 75,
    marginHorizontal: 50,
  }
});
