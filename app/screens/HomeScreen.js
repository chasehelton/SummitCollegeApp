import React, {useLayoutEffect, useEffect, useState} from 'react';
import {StyleSheet,
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {Icon} from 'react-native-elements';
import {summitBlue} from '../assets/colors';
import Header from '../components/Header';

export default function HomeScreen() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [noUpcomingEvents, setNoUpcomingEvents] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useLayoutEffect(() => {
    async function getUpcomingEvents() {
      // TODO: make sure only the upcoming ones display
      const querySnapshot = await firestore().collection('events')
        /*where('startDate','>=', new Date())*/.orderBy('startDate').limit(2).get();
      if (
        querySnapshot === null ||
        querySnapshot.size === 0 ||
        querySnapshot.empty
      ) {
        setNoUpcomingEvents(true);
        console.log("No upcoming events!");
        return null;
      }

      try {
        const tempUpcomingEvents = [];
        var count = 0;
        querySnapshot.forEach((doc) => {
          tempUpcomingEvents.push({
            data: doc.data(),
            id: count,
            ref: doc.ref,
          });
          count++;
        });
        console.log("Count of upcoming events: " + count);
        setUpcomingEvents(tempUpcomingEvents);
      } catch (error) {
        Alert.alert('Error', 'Error retrieving upcoming events');
        console.log("Error: " + error);
      }
    }


    if (!isLoaded) {
      getUpcomingEvents();
      setIsLoaded(true);
      /*setState({isLoaded: true}, function() {
        getUpcomingEvents();
        console.log("Set isLoaded to true");
              console.log("It is now: " + isLoaded);
      });*/

    }
  }, [upcomingEvents, isLoaded]);

  return (
    <View style={styles.container}>
      <Header title={'Home'} backButton={false} />
      <ScrollView style={styles.bodyContainer}>

        <View style={styles.reading}>
          <Text style={styles.subheader}>{"TODAY'S READING"}</Text>
          <TouchableOpacity
            style={[styles.itemContainer, styles.readingPlanContainer]}
            onPress={() =>
              navigation.navigate('Admin', {
                screen: 'Directory',
                params: {
                  header: 'Students',
                  userType: TYPE_STUDENT,
                },
              })
            }
          >
            <View style={styles.infoContainer}>
              <Text style={styles.readingPlanText}>{"1 Thessalonians 1"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.events}>
          <Text style={styles.subheader}>{"UPCOMING EVENTS"}</Text>

          {!noUpcomingEvents && (
            <FlatList
              style={styles.upcomingEventsList}
              data={upcomingEvents.sort((a, b) => {
                let date1 = new Date(a.data.timestamp);
                let date2 = new Date(b.data.timestamp);
                return date1.getTime() - date2.getTime();
              })}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={[styles.itemContainer, styles.eventsContainer]}
                  onPress={() =>
                    navigation.navigate('Admin', {
                      screen: 'Directory',
                      params: {
                        header: 'Students',
                        userType: TYPE_STUDENT,
                      },
                    })
                  }
                >
                  <View style={styles.infoContainer}>
                    <Text style={styles.eventText}>{item.data.title}</Text>
                  </View>
                  <Icon
                    name="keyboard-arrow-right"
                    type="material"
                    color='#eee'
                    style={{marginLeft: 10}}
                    size={35}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
          {noUpcomingEvents && <Text style={styles.noUpcomingEventsText}>No upcoming events found.</Text>}


        </View>

        <View style={styles.podcast}>
        </View>
      </ScrollView>
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
  bodyContainer: {

  },
  title: {
    fontSize: 48,
  },
  subheader: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: summitBlue,
    marginTop: 30,
  },
  whiteButton: {

  },
  infoContainer: {
    textAlign: 'left',
    width: 275,
  },
  readingPlanText: {
    fontSize: 20,
  },
  eventText: {
    fontSize: 16,
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: {height: 5, width: 5},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
    paddingHorizontal: 20,

    borderRadius: 8,

  },
  readingPlanContainer: {
    paddingVertical: 20,
    height: 70,
  },
  eventContainer: {
    paddingVertical: 20,
    height: 60
  },
  upcomingEventsList: {
    height: '100%',
    backgroundColor: '#eee',
  },
  noUpcomingEventsText: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 24,
  },
});
