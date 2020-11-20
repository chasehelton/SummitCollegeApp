import React, {useLayoutEffect, useEffect, useState} from 'react';
import {Image, StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, TextInput} from 'react-native';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {summitBlue} from '../assets/colors';

import storage from '@react-native-firebase/storage';

import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import ChatGroupPreview from '../components/ChatGroupPreview';

import * as Constants from '../constants/userTypeConstants';

export default function CommunityScreen({navigation}) {

  const [rooms, setRooms] = useState([]);




  useLayoutEffect(() => {
    async function getRooms() {
      // Create a reference with an initial file path and name
      //var storage = firebase.storage();


      const roomsQuery = await firestore()
        .collection('rooms')
        .orderBy('lastUpdated');
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

            tempRooms.push({
              data: doc.data(),
              id: count,
              ref: doc.ref,
            });
            count++;


          });
          console.log('Count: ' + count);
          console.log('Actual-set rooms length: ' + tempRooms.length);
          setRooms(tempRooms);

        } catch (error) {
          Alert.alert('Error', 'Some bad error here: ' + error);
        }
      }, err => {
        console.log('Encountered error: ' + err);
      });

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
          <Icon name="list" type="material" color={summitBlue} size={35} />
        </TouchableOpacity>
        <Text style={styles.title}>{'Community'}</Text>
        <TouchableOpacity
          style={styles.rightHeaderButton}
          onPress={() => navigation.navigate('Community', {
                           screen: 'Directory',
                           params: {
                             header: 'Community',
                             userType: Constants.TYPE_STUDENT,
                             isAdmin: false,
                           },
                         })}>
          <Icon name="create" type="material" color={summitBlue} size={35} />
        </TouchableOpacity>

      </View>

      <View style={styles.nonHeader}>
        {/*<Text style={styles.comingSoonText}>Coming Soon.</Text>
        <Text style={styles.comingSoonSubtext}>The Community feature will arrive by Christmas.</Text>*/}

        <FlatList
          style={styles.roomList}
          data={rooms}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.roomContainer}
              >
              <ChatGroupPreview name={item.data.name}
               lastUpdated={displayTime(item.data.lastUpdated.toDate())}
               photoURL={item.data.photoURL}
               lastMessage={'This is a preview of the last message!'}
               read={false}
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
  title: {
    fontSize: 48,
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
  },
  leftHeaderButton: {
    marginTop: 45,
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'flex-start',
  },
  rightHeaderButton: {
    marginTop: 45,
    flex: 1,
    //justifyContent: 'flex-end',
    //alignItems: 'flex-end',
  },
  title: {
    flex: 4,
    marginTop: 45,
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
