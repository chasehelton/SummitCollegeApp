import React, {useLayoutEffect, useEffect, useState} from 'react';
import {Image, StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {summitBlue} from '../assets/colors';

import storage from '@react-native-firebase/storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import ChatGroupPreview from '../components/ChatGroupPreview';
import AppContext from '../components/AppContext.js';

import * as Constants from '../constants/userTypeConstants';

export default function CommunityScreen({navigation}) {

  const [rooms, setRooms] = useState([]);
  const readReceiptPrefix = '@roomReadRec-';

  const context = React.useContext(AppContext);

  const [selectedId, setSelectedId] = useState(null);

  useLayoutEffect(() => {
    async function getRooms() {
      // Create a reference with an initial file path and name
      //var storage = firebase.storage();

      let storageKeys = [];
      try {
        storageKeys = await AsyncStorage.getAllKeys();
        console.log('Storage keys: ' + storageKeys);
      } catch(e) {
        // read key error
        console.log('Error reading AsyncStorage keys: ' + e);
      }

      console.log('You are in this many rooms: ' + context.userDoc.rooms); // TODO : FROM HERE

      const roomsQuery = await firestore()
        .collection('rooms')
        // this MAY not work with more than 10 rooms....
        .where(firestore.FieldPath.documentId(), 'in', context.userDoc.rooms)
        //.orderBy('lastUpdated');
        //.get();
        //.doc('C08P2GCtlOrcKDTYjdQD')
        //.collection('messages')
        //.orderBy('createdAt');
        //.get();
      const roomsObserver = roomsQuery.onSnapshot(roomsSnapshot => {
        console.log('Received room snapshot of size ' + roomsSnapshot.size);
        try {
          const tempRooms = [];
          var count = 0;
          var storageRef = storage();
          roomsSnapshot.forEach(function (doc) {
            console.log('Room: ' + doc.data().name);
            console.log('Last updated: ' + doc.data().lastUpdated.toDate());
            // Create a reference from a Google Cloud Storage URI
            //var gsReference = storageRef.refFromURL(doc.data().photoURL);
            //var newURL = /*await*/ gsReference.getDownloadURL().then(function(url) {
            /*}).catch(function(error) {
              // Handle any errors
              console.log("Error getting download url: " + error);
            });*/
            console.log('Read?: ' + storageKeys.includes(readReceiptPrefix + doc.ref.id));

            tempRooms.push({
              data: doc.data(),
              id: count,
              ref: doc.ref,
              read: storageKeys.includes(readReceiptPrefix + doc.ref.id),
            });

            count++;


          });
          console.log('Count: ' + count);
          console.log('Actual-set rooms length: ' + tempRooms.length);

          // before setting the room, check AsyncStorage to see if each room has been read before or not...
          /*for (var i = 0; i < tempRooms.length; i++) {
            var path = readReceiptPrefix + tempRooms[i].ref.id;
            var readReceipt =  AsyncStorage.getItem(path);
            if (readReceipt) {
              tempRooms[i].read = true;
              console.log("Found one that was previously read!: " + readReceipt);
            }
          }*/

          setRooms(tempRooms);

        } catch (error) {
          Alert.alert('Error', 'Some bad error here: ' + error);
        }
      }, err => {
        console.log('Encountered error: ' + err);
      });

      return () => roomsObserver();

      /*const messagesObserver = query.onSnapshot(querySnapshot => {
        console.log('Received query snapshot of size ' + querySnapshot.size);
        try {
          const tempMessages = [];
          var count = 0;
          querySnapshot.forEach(function (doc) {
            console.log('Message: ' + doc.data().msg);
            tempMessages.push({
              data: doc.data(),
              id: count,
              ref: doc.ref,
            });
            count++;
          });
          console.log('Count: ' + count);
          console.log('Actual-set messages length: ' + tempMessages.length);
          setMessages(tempMessages);
        } catch (error) {
          Alert.alert('Error', 'Some bad error here: ' + error);
        }
      }, err => {
        console.log('Encountered error: ' + err);
      });*/
    }
    getRooms();
  }, []);

  const getMonth = (m) => {
    let month = '';
    //let m = new Date(date).getMonth() + 1;
    if (m === 1) month = 'Jan';
    else if (m === 2) month = 'Feb';
    else if (m === 3) month = 'Mar';
    else if (m === 4) month = 'Apr';
    else if (m === 5) month = 'May';
    else if (m === 6) month = 'Jun';
    else if (m === 7) month = 'Jul';
    else if (m === 8) month = 'Aug';
    else if (m === 9) month = 'Sep';
    else if (m === 10) month = 'Oct';
    else if (m === 11) month = 'Nov';
    else if (m === 12) month = 'Dec';
    return month;
  };

  // 'date' is a JS date object
  const displayTime = (date) => {
    var today = new Date();
    var sameYear = today.getFullYear() == date.getFullYear();
    var sameMonth = today.getMonth() == date.getMonth();
    var sameDayOfMonth = today.getDate() == date.getDate();
    if (sameYear && sameMonth && sameDayOfMonth) {
      // this is the same day!
      // so return the time like '11:05 AM'
      var timeValue;
      var hours = date.getHours();
      var minutes = date.getMinutes();
      if (hours > 0 && hours <= 12) timeValue = '' + hours;
      else if (hours > 12) timeValue = '' + (hours - 12);
      else if (hours === 0) timeValue = '12';
      timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes;
      timeValue += hours >= 12 ? ' PM' : ' AM';
      return timeValue;
    }
    else if (sameYear) {
      //so just display the Month and Day
      return getMonth(date.getMonth() + 1) + ' ' + date.getDate();
    }
    else {
      // display month day and year
      return getMonth(date.getMonth() + 1) + ' ' + date.getDate()
        + ', ' + date.getFullYear();
    }
  };

  const selectRoom = async (index) => {
    console.log('Room clicked, index: ' + index);
    const clickedRoom = rooms[index];

    // go ahead and get all the users associated with this room?

    console.log('First member of this room: ' + rooms[index].data.members[0]);
    console.log('All members: ' + rooms[index].data.members);

    const userSearchSnapshot = await firestore()
            .collection('users')
            .where(firestore.FieldPath.documentId(), 'in', rooms[index].data.members)
            //.orderBy('firstName')
            .get();

    if (userSearchSnapshot.empty) {
      Alert.alert('Empty snapshot');
      //return null;
    }

    console.log('Result size FROM USER SEARCH SNAPSHOT: ' + userSearchSnapshot.size);

    if (userSearchSnapshot.size === 0) {
      Alert.alert('No users found in this group'); // with the email: ' + email);
      //return null;
    }

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
    rooms[index].data.memberObjects = tempUsers;
    console.log('Member objects?: ' + rooms[index].data.memberObjects);

    var path = readReceiptPrefix + rooms[index].ref.id;
    var readReceipt = await AsyncStorage.getItem(path);
    if (!readReceipt) {
      console.log('This has not been read before...');
      await AsyncStorage.setItem(path, 'y');
      rooms[index].read = true;
      setSelectedId(rooms[index].id)
    }
    else {
      console.log('This has been read before!');
    }

    // now navigate
    console.log('Header text is: ' + rooms[index].data.name);
    navigation.navigate('Community', {
      screen: 'ChatScreen',
      params: {
        headerText: rooms[index].data.name,
        //userType: Constants.TYPE_ALL,
        roomObject: rooms[index],
        roomRef: rooms[index].ref,
      },
    });
  };

  /*const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL } = auth.currentUser;

    await someRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    // find a way to scroll into view
  }*/

  return (
    <View style={styles.container}>


      <View style={styles.headerContainer}>

        <TouchableOpacity
          style={styles.leftHeaderButton}
          onPress={() => navigation.goBack()}>
          <Icon name="list" type="feather" color={summitBlue} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>{'Community'}</Text>
        <TouchableOpacity
          style={styles.rightHeaderButton}
          onPress={() => navigation.navigate('Community', {
                           screen: 'Directory',
                           params: {
                             header: 'Community',
                             userType: Constants.TYPE_ALL,
                             isAdmin: false,
                           },
                         })}>
          <Icon name="edit" type="feather" color={summitBlue} size={30} />
        </TouchableOpacity>

      </View>

      <View style={styles.nonHeader}>
        {/*<Text style={styles.comingSoonText}>Coming Soon.</Text>
        <Text style={styles.comingSoonSubtext}>The Community feature will arrive by Christmas.</Text>*/}

        <FlatList
          style={styles.roomList}
          data={rooms}
          extraData={selectedId}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.roomContainer}
              onPress={() => selectRoom(index)}
              >
              <ChatGroupPreview name={item.data.name}
               lastUpdated={displayTime(item.data.lastUpdated.toDate())}
               photoURL={item.data.photoURL}
               lastMessage={'This is a preview of the last message!'}
               read={item.read}
               key={item.id} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    //alignItems: 'center',
    backgroundColor: '#eee',
    //width: '100%',
  },
  item: {
    //paddingHorizontal: 30,
  },
  roomList: {
    height: '100%',
    width: '100%',
    //padding: 10,
    backgroundColor: '#eee',
  },
  roomContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', // this is vertical
    justifyContent: 'center', // this is horizontal
    //marginTop: 20,
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    //shadowOffset: {height: 5, width: 5},
    //shadowOpacity: 0.1,
    //shadowRadius: 5,
    //backgroundColor: '#fff',
    //elevation: 2,
    //paddingHorizontal: 20,
    paddingVertical: 25,
    //borderRadius: 3,
    //height: 100,
    //marginBottom: 15,
  },
  nonHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 20,
  },
  comingSoonSubtext: {
    fontSize: 12,
  },
  headerContainer: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  leftHeaderButton: {
    marginTop: 35,
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightHeaderButton: {
    marginTop: 35,
    flex: 1,
    //justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  title: {
    flex: 4,
    marginTop: 35,
    marginBottom: 25,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  empty: {
    flex: 1,
  },
});
