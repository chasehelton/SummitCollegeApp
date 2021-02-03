/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {summitBlue} from '../assets/colors';

import auth from '@react-native-firebase/auth';

export default function ChatMessage({message, nextMessage, members}) {

  const formatTimestamp = (timestamp) => {
    var month = getMonth(timestamp);
    var day = getDay(timestamp);
    var time = getTime(timestamp);
    var date =  month + ' ' + day;

    return date + ', ' + time;
  };

  const getMonth = (date) => {
    let month = '';
    let m = new Date(date).getMonth() + 1;
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

  const getDay = (date) => {
    let d = new Date(date).getDate();
    return d;
  };

  const getTime = (date) => {
    var newDate = new Date(date);
    var timeString = newDate.toTimeString().substr(0,6);
    var timeArray = timeString.split(':');
    var hours = Number(timeArray[0]);
    var minutes = Number(timeArray[1]);
    var timeValue;
    if (hours > 0 && hours <= 12) timeValue = '' + hours;
    else if (hours > 12) timeValue = '' + (hours - 12);
    else if (hours === 0) timeValue = '12';
    timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes;
    timeValue += hours >= 12 ? 'pm' : 'am';
    return timeValue;
  };

  const text = message.msg; // check firebase?

  const uid = message.uid;
  message.formattedTimestamp = formatTimestamp(new Date(message.createdAt.toDate()));
  message.dateObject = new Date(message.createdAt.toDate());


  const isThisSender = message.uid === auth().currentUser.uid;

  const [sendingUser, setSendingUser] = React.useState({});

  React.useLayoutEffect(() => {
    async function getUser() {
      // go through the users list?? if that exists?

      for (var i = 0; i < members.length; i++) {
        if (members[i].data.uid == uid) {
          setSendingUser(members[i].data);
          //console.log('Returning this URL for the user: ' + members[i].data.photoURL);
          return;
        }
      }
    }

    getUser();

  }, []);

  const shouldDisplayTime = () => {
    // if not the same user
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('Checking if should display for message at ' + message.formattedTimestamp);
    if (nextMessage == null) {
      console.log('Yes, no next message');
      return true;
    }

    if (message.uid != nextMessage.data.uid) {
      console.log('Yes, next message is different user');
      return true;
    }
    nextMessage.dateObject = new Date(nextMessage.data.createdAt.toDate());

    // if the same day AND month, see if between 5 minutes
    if (
      (message.dateObject.getDate() == nextMessage.dateObject.getDate())
      && (message.dateObject.getMonth() == nextMessage.dateObject.getMonth())
      && (Math.abs(nextMessage.dateObject - message.dateObject) < 300000) //300000ms is 5 minutes
    ) {
      console.log('No, same day and within 5 minutes');
      return false;
    }
    console.log('No');
    return true;
  };

  //const messageStyle = uid === auth().currentUser.uid ? 'sent' : 'received';

  /*const getUserPhoto = (uid) => {
    // go through the users list?? if that exists?
    console.log('Members: ' + members);
    console.log('Searching for user with uid: ' + uid);

    console.log('Room members size: ' + members.length);

    for (var i = 0; i < members.length; i++) {
      console.log('This members uid: ' + members[i].data);
      if (members[i].data.uid == uid) {
        //setSendingUser(members[i].data);
        console.log('Returning this URL for the user: ' + members[i].data.photoURL);
        return members[i].data.photoURL;
      }
    }

    // if here, then no user was found... display stock photo?
    console.log('Returning stock photo');
    return 'https://www.pngitem.com/pimgs/m/517-5177724_vector-transparent-stock-icon-svg-profile-user-profile.png';

    //return roomObject.data.memberObjects[roomObject.data.memberObjects.indexOf(uid)].data.photoURL;
  };*/

  return (
    <>
      <View style={styles.rowContainer}>
        <View style={styles.chatPersonImageContainer}>
          {!isThisSender &&  (
            <Image
              source={{ uri: sendingUser.photoURL }}
              style={styles.chatPersonImage}
              resizeMode='contain'/>
            )
          }
        </View>
        <View style={styles.rightSide}>
          {!isThisSender && (
            <Text style={styles.authorStyle}>{sendingUser.displayName}</Text>
            )
          }
          <TouchableOpacity
            style={[styles.messageContainer, isThisSender ? styles.sentContainer : styles.receivedContainer]}>
            <Text style={[styles.chatText, isThisSender ? styles.sentChatText : styles.receivedChatText]}>{message.msg}</Text>
          </TouchableOpacity>

        </View>
      </View>
      {shouldDisplayTime(message.dateObject) && (<Text style={styles.messageDate}>{message.formattedTimestamp}</Text>)}
    </>


  );
}

const styles = StyleSheet.create({
  messageContainer: {

    //marginTop: 10,
    //shadowOffset: {height: 5, width: 5},
    //shadowOpacity: 0.15,
    //shadowRadius: 5,
    //backgroundColor: '#fff',
    //elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,


    borderRadius: 8,
    maxWidth: 300,
  },
  authorStyle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    fontWeight: '900',
    color: 'gray',
  },
  rowContainer: {
    flexDirection: 'row',
    //alignItems: 'flex-end',
    //justifyContent: 'flex-start',
    //borderWidth: 0.2,
    //borderColor: 'red',
    marginVertical: 5,
    marginRight: 30,
  },
  chatPersonImageContainer: {
    borderWidth: 0.5,
    borderColor: 'black',
    //flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center', //horizontal
    //paddingLeft: 40,
    width: 100,
  },
  chatPersonImage: {
    height: 40,
    width: 40,
    overflow: 'hidden',
    //borderWidth: 0.5,
    borderRadius: 250,
    borderColor: 'black',
  },
  chatText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
  },
  sentChatText: {
    color: 'white',
    textAlign: 'right',
  },
  receivedChatText: {
    color: 'black',
    textAlign: 'left',
  },
  rightSide: {
    //marginVertical: 5,
    //flex: 4,
    //borderWidth: 0.5,
    //borderColor: 'black',
    //display: 'flex',
    //flexDirection: 'row',
    //alignSelf: 'flex-end',
  },

  sentContainer: {
    backgroundColor: '#3d8ccc',

  },
  receivedContainer: {
    backgroundColor: 'white',
  },
  messageDate: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    textAlign: 'right',
    marginTop: 0,
    marginRight: 30,
    color: 'gray',
  },
});
