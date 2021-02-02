import React, {useLayoutEffect, useEffect, useState} from 'react';
import {StyleSheet, Image, View, Text, FlatList, TouchableOpacity, Alert, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';

export default function CommunityScreen() {

  const [formValue, setFormValue] = useState('');
  const [testMessage, setTestMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  const [sendMessageText, onChangeText] = useState('Useless Placeholder');

  const sendMessage = async () => {
    const res = await firestore()
      .collection('rooms')
      .doc('C08P2GCtlOrcKDTYjdQD')
      .collection('messages')
      .add({
        msg: sendMessageText,
        createdAt: /*admin.*/firestore.Timestamp.fromDate(new Date()),
        uid: auth().currentUser.uid,

      });
    console.log('Added document with ID: ', res.id);
  };

  // CONSIDER USING FIREBASE HOOKS: https://github.com/csfrequency/react-firebase-hooks/tree/048dcb4553e7aecab5b8bf2a586d4349bb28998f/firestore

  useLayoutEffect(() => {
    async function getMessages() {
      const query = await firestore()
        .collection('rooms')
        .doc('C08P2GCtlOrcKDTYjdQD')
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


      /*const querySnapshot = await firestore()
        .collection('rooms')
        .doc('C08P2GCtlOrcKDTYjdQD')
        .collection('messages')
        .orderBy('createdAt')
        //.doc('xFAadox0fgogTEmUUBxj')
        .get();
      if (querySnapshot.empty) {
        Alert.alert('Empty snapshot - no messages were found for this room');
        return null;
      }
      console.log('Result size: ' + querySnapshot.size);

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
      }*/

      /*else {
        console.log('Message data: ' + doc.data());
        console.log('Try to get msg: ' + doc.data().msg);
        //setTestMessage({data: doc.data()});
        setMessages([{data: doc.data()}]);
      }*/
    }
    getMessages();
  }, []);

  const getUser = (uid) => {
    // go through the users list?? if that exists?
    var photoURL = '';
    return photoURL;
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
      <Header title={'Community'} backButton={false} />
      <View style={styles.nonHeader}>

        <FlatList
          style={styles.userList}
          data={messages}
          renderItem={({item, index}) => (
            <>
            <View style={styles.chatPersonImageContainer}>
              <Image
                source={{ uri: getUser(item.data.uid) }}
                style={styles.chatPersonImage}
                resizeMode='contain'/>
            </View>
            <View style={{marginVertical: 5, }}>
              <Text>Author</Text>
              <TouchableOpacity

                style={[styles.messageContainer, item.data.uid === auth().currentUser.uid ? styles.sentContainer : styles.receivedContainer]}
                >
                <ChatMessage message={item.data} key={item.id} />
              </TouchableOpacity>
            </View>
            </>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => onChangeText(text)}
          value={sendMessageText}
        />

        <TouchableOpacity
          onPress={() =>
            sendMessage()
          }
          style={{ height: 50, borderColor: 'blue', borderWidth: 1, marginTop: 70 }}>
          <Text style={styles.buttonText}>Send Message!</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 48,
  },
  nonHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    //shadowOffset: {height: 5, width: 5},
    //shadowOpacity: 0.15,
    //shadowRadius: 5,
    backgroundColor: '#fff',
    //elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 8,
  },
  sentContainer: {
    backgroundColor: 'white',
  },
  receivedContainer: {
    backgroundColor: '#3d8ccc',
  },
  chatPersonImageContainer: {
    marginRight: 10,
    borderRadius: 20,
    //borderWidth: 0.5,
    //borderColor: 'black',
    overflow: 'hidden',
    flex: .35,
  },
  chatPersonImage: {
    height: '100%',
  },
});
