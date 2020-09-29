import React, {useState, useLayoutEffect} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import Header from '../components/Header';
import Announcement from '../components/Announcement';

export default function AnnouncementsScreen({navigation}) {
  const [announcements, setAnnouncements] = useState([]);
  const [noAnnouncements, setNoAnnouncements] = useState(false);

  useLayoutEffect(() => {
    let mounted = true;
    if (mounted) {
      async function getAnnouncements() {
        const querySnapshot = await firestore()
          .collection('announcements')
          .get();
        if (
          querySnapshot === null ||
          querySnapshot.size === 0 ||
          querySnapshot.empty
        ) {
          setNoAnnouncements(true);
          return null;
        }

        try {
          const tempAnnouncements = [];
          var count = 0;
          querySnapshot.forEach((doc) => {
            tempAnnouncements.push({
              data: doc.data(),
              id: count,
              ref: doc.ref,
            });
            count++;
          });
          setAnnouncements(tempAnnouncements);
        } catch (error) {
          Alert.alert('Error', 'Error retrieving announcements');
        }
      }
      getAnnouncements();
    }
    return () => (mounted = false);
  }, []);
  return (
    <View style={styles.container}>
      <Header title={'Announcements'} backButton={false} />
      {!noAnnouncements && (
        <FlatList
          style={styles.announcementsList}
          data={announcements.sort((a, b) => {
            let date1 = new Date(a.data.timestamp);
            let date2 = new Date(b.data.timestamp);
            return date1.getTime() - date2.getTime();
          })}
          renderItem={({item, index}) => (
            <TouchableOpacity>
              <Announcement
                title={item.data.title}
                timestamp={item.data.timestamp}
                key={index}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {noAnnouncements && (
        <Text style={styles.noAnnouncementsText}>No announcements found.</Text>
      )}
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
  announcementList: {
    height: '100%',
    padding: 10,
    backgroundColor: '#eee',
  },
  noAnnouncementText: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 24,
  },
});
