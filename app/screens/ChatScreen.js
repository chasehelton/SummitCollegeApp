import React, {useLayoutEffect, useEffect, useState} from 'react';
import {StyleSheet, Image, View, Text, FlatList, TouchableOpacity, Alert, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Icon} from 'react-native-elements';


import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import {summitBlue} from '../assets/colors';

export default function ChatScreen({route, navigation, props}) {

  // TODO:
  // 1. make a function that scrolls to the bottom on submit - won't work :(
  // 3. curve the bottom right corner if you sent it
  // 4. curve the bottom left corner if you did not send it
  // 5. try and do the gradient
  // 6. try and stretch/fill images that are weird sizes (like the fish)
  // 7. implement the image sending functionality

  //navigation.setOptions({tabBarVisible: false});


  const [formValue, setFormValue] = useState('');
  const [testMessage, setTestMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  var {headerText, roomObject, roomRef} = route.params;

  //const [headerText, setHeaderText] = useState(header);

  const [roomMembers, setRoomMembers] = useState(roomObject.data.memberObjects);

  const [sendMessageText, onChangeText] = useState('Send a message...');

  const messsageListRef = React.useRef(null);

  const sendMessage = async () => {
    console.log('Room reference: ' + roomObject.ref);
    const res = await roomObject.ref.collection('messages')
      .add({
        msg: sendMessageText,
        createdAt: /*admin.*/firestore.Timestamp.fromDate(new Date()),
        uid: auth().currentUser.uid,

      });
    console.log('Added document with ID: ', res.id);

    onChangeText('Send a message...');
    Keyboard.dismiss(); // will this work?

    // SCROLLING DOES NOT WORK
    //messageListRef.scrollToEnd({animated: true});
    //this.refs['messageList'].scrollToEnd({animated: true});
    //messageListRef.scrollToEnd({animated: true});
  };

  const focusTextInput = () => {
    if (sendMessageText == 'Send a message...')
      onChangeText('');
  };

  // CONSIDER USING FIREBASE HOOKS: https://github.com/csfrequency/react-firebase-hooks/tree/048dcb4553e7aecab5b8bf2a586d4349bb28998f/firestore

  useLayoutEffect(() => {
    async function getMessages() {
      console.log("Selected room id: " + roomObject.ref.id);
      const query = await firestore()
        .collection('rooms')
        //.doc('C08P2GCtlOrcKDTYjdQD')
        .doc(roomObject.ref.id)
        .collection('messages')
        .orderBy('createdAt');
        //.get();
      const messagesObserver = query.onSnapshot(querySnapshot => {
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
      });
    }
    getMessages();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.leftHeaderButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" type="feather" color='black' size={35} />
        </TouchableOpacity>
        <Text style={styles.title}>{headerText}</Text>
        <TouchableOpacity
          style={styles.rightHeaderButton}
          >
          <Image style={styles.groupPicture} source={{uri: roomObject.data.photoURL}} />
        </TouchableOpacity>

      </View>


      <View style={styles.nonHeader}>

        <FlatList
          ref={messsageListRef}
          initialScrollIndex={0}
          style={styles.userList}
          data={messages}
          renderItem={({item, index}) => (
            <ChatMessage message={item.data}
              nextMessage={messages[index + 1]} previousMessage={messages[index - 1]}
              key={item.id} members={roomMembers} />

          )}
          keyExtractor={(item) => item.id.toString()}
        />

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.multimediaButton}
            >
            <Icon name="image" type="feather" color={summitBlue} size={30} />
          </TouchableOpacity>

          <TextInput
            style={styles.chatInput}
            onChangeText={text => onChangeText(text)}
            value={sendMessageText}
            //clearTextOnFocus={true}
            multiline={true}
            onFocus={focusTextInput}
          />

          <TouchableOpacity
            onPress={() =>
              sendMessage()
            }
            style={styles.sendButton}>

            <Icon name="send" type="feather" color={summitBlue} size={30} />
          </TouchableOpacity>

        </View>

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
  },
  headerContainer: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  title: {
    flex: 4,
    marginTop: 35, // was 45; need to adjust for iOS somehow
    marginBottom: 35, // was 25
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  nonHeader: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
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

  bottomBar: {
    //height: 50,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInput: {
    flex: 4,
    //height: 40,
    //borderColor: 'gray',
    //borderWidth: 1,
    fontFamily: 'OpenSans-Bold',
    color: summitBlue,
    textAlignVertical: 'top',
  },
  multimediaButton: {
    flex: 1,
  },
  sendButton: {
    flex: 1,
    //height: 50,
    //borderColor: 'blue',
    //borderWidth: 1,
  },
  groupPicture: {
    height: 35,
    width: 35,
    borderRadius: 5,
  },

});
