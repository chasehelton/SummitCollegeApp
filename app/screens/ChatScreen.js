import React, {useLayoutEffect, useEffect, useState} from 'react';
import {StyleSheet, Modal, Image, View, Text, FlatList, TouchableOpacity, Alert, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {Icon} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import {summitBlue} from '../assets/colors';

export default function ChatScreen({route, navigation, props}) {

  // TODO:
  // 1. make a function that scrolls to the bottom on submit - won't work :(
  // 3. curve the bottom right corner if you sent it
  // 4. curve the bottom left corner if you did not send it
  // 6. try and stretch/fill images that are weird sizes (like the fish)
  // 7. implement the image sending functionality

  //navigation.setOptions({tabBarVisible: false});

  // Functions to write:
  // 1. View members in a list with their names/pictures
  // 2. Set the group as muted or unmuted (default unmuted) - asyncstorage?
  // 3. Like a message? - complicated haha
  //    list of who has liked the message in the DB
  //    and just display the number of people who have liked it (how though...? designs...)
  // 4. Leave a group
  // 5. Creator of the group designated as admin (admin attribute in table?)
  //


  const [formValue, setFormValue] = useState('');
  const [testMessage, setTestMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = React.useState(null);

  var {headerText, roomObject, roomRef} = route.params;

  //const [headerText, setHeaderText] = useState(header);

  const [roomMembers, setRoomMembers] = useState(roomObject.data.memberObjects);

  const [sendMessageText, onChangeText] = useState('Send a message...');

  const [modalVisible, setModalVisible] = useState(false);

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

    // update the room's lastUpdated

    onChangeText('Send a message...');
    //Keyboard.dismiss(); // will this work?
    await roomObject.ref.update({
      createdAt: firestore.Timestamp.fromDate(new Date()),
      // consider changing to FieldValue.serverTimestamp() b/c of timezone differences?
    });

    // SCROLLING DOES NOT WORK
    //messageListRef.scrollToEnd({animated: true});
    //this.refs['messageList'].scrollToEnd({animated: true});
    //messageListRef.scrollToEnd({animated: true});
  };

  const selectImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        //maxHeight: 200,
        //maxWidth: 200,
      },
      (response) => {
        console.log('Did user cancel?: ' + response.didCancel);
        console.log('Response error message: ' + response.errorMessage);
        if (!response.didCancel) {

          console.log('Response uri: ' + response.uri);
          setResponse(response);
          setModalVisible(true);
        }

      },
    );
  };

  const sendImageMessage = async () => {
    const reference = storage().ref('/chat_pictures/' + response.fileName);
    await reference.putFile(response.uri);
    const url = await reference.getDownloadURL();

    const res = await roomObject.ref.collection('messages')
      .add({
        img: url,
        createdAt: /*admin.*/firestore.Timestamp.fromDate(new Date()),
        uid: auth().currentUser.uid,

      });
    console.log('Added document with ID: ', res.id);

    // update the room's lastUpdated

    onChangeText('Send a message...');
    //Keyboard.dismiss(); // will this work?
    await roomObject.ref.update({
      createdAt: firestore.Timestamp.fromDate(new Date()),
      // consider changing to FieldValue.serverTimestamp() b/c of timezone differences?
    });
    setModalVisible(false);

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
        {messages.length == 0 && (
          <Text style={styles.noMessages}>{'No messages yet!'}</Text>
        )}

        <FlatList
          ref={messsageListRef}
          initialScrollIndex={0}
          style={styles.messagesList}
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
            onPress={() =>
              selectImage()
            }
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            console.log('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{'Image:'}</Text>

              {response != null && (
                <Image source={{uri: response.uri}} style={styles.newImage} />
              )}

              <TouchableOpacity
                style={styles.changePictureButton}
                onPress={() => selectPicture()}
              >
                <Text style={styles.modalText}>{'Change Picture'}</Text>
              </TouchableOpacity>

              <View style={styles.bottomRowModal}>

                  <TouchableOpacity
                    style={[styles.modalButton,
                      styles.sendImageButton]}
                    onPress={() => sendImageMessage()}
                  >
                    <Text style={styles.modalButtonText}>{'Send Image'}</Text>
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
    marginTop: 20,
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
  noMessages: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',

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
  sendImageButton: {
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
  newImage: {
    width: 200,
    height: 200,
    marginHorizontal: 50,
  },

});
