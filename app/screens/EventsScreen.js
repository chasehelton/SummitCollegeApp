import React, {useState, useLayoutEffect} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import Header from '../components/Header';
import Event from '../components/Event';

export default function EventsScreen({navigation}) {
  const [events, setEvents] = useState([]);
  const [noEvents, setNoEvents] = useState(false);

  useLayoutEffect(() => {
    async function getEvents() {
      const querySnapshot = await firestore().collection('events').get();
      if (querySnapshot.empty) {
        Alert.alert('Some error here for empty snapshot');
        return null;
      }
      if (querySnapshot.size === 0) {
        Alert.alert('No users found'); // with the email: ' + email);
        return null;
      }
      if (querySnapshot == null) {
        console.log('Snapshot is null');
      }
      try {
        const tempEvents = [];
        var count = 0;
        querySnapshot.forEach((doc) => {
          tempEvents.push({
            data: doc.data(),
            id: count,
            ref: doc.ref,
          });
          count++;
        });
        setEvents(tempEvents);
      } catch (error) {
        Alert.alert('Error', 'Some bad error here: ' + error);
      }
    }
    getEvents();
  }, []);
  return (
    <View style={styles.container}>
      <Header title={'Events'} backButton={false} />
      <FlatList
        style={styles.eventList}
        data={events.sort((a, b) => {
          let date1 = new Date(a.data.startDate);
          let date2 = new Date(b.data.startDate);
          return date1.getTime() - date2.getTime();
        })}
        renderItem={({item, index}) => (
          <TouchableOpacity>
            <Event
              title={item.data.title}
              previewText={item.data.previewText}
              startDate={item.data.startDate}
              key={index}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
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
  eventList: {
    height: '100%',
    padding: 10,
    backgroundColor: '#eee',
  },
});
