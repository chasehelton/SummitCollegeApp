/* eslint-disable react-native/no-inline-styles */
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import {Icon} from 'react-native-elements';
import {summitBlue} from '../assets/colors';
import Header from '../components/Header';
import UpcomingEvent from '../components/UpcomingEvent';

export default function HomeScreen({navigation}) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [noUpcomingEvents, setNoUpcomingEvents] = useState(false);

  const [readingPlan, setReadingPlan] = useState(null);
  const [noReadingPlan, setNoReadingPlan] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const selectReadingPlan = () => {
    console.log(readingPlan);
  };

  useLayoutEffect(() => {
    let mounted = true;
    if (mounted) {
      async function getUpcomingEvents() {
        // TODO: make sure only the upcoming ones display
        const querySnapshot = await firestore()
          .collection('events')
          .where('startDate', '>=', formatDate(new Date()))
          .orderBy('startDate')
          .limit(2)
          .get();
        if (
          querySnapshot === null ||
          querySnapshot.size === 0 ||
          querySnapshot.empty
        ) {
          setNoUpcomingEvents(true);
          console.log('No upcoming events!');
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
          console.log('Count of upcoming events: ' + count);
          setUpcomingEvents(tempUpcomingEvents);
        } catch (error) {
          Alert.alert('Error', 'Error retrieving upcoming events');
          console.log('Error: ' + error);
        }
      }

      async function getReadingPlan() {
        const querySnapshot = await firestore()
          .collection('readingPlan')
          .where('date', '==', formatDate(new Date()))
          .get();
        if (
          querySnapshot === null ||
          querySnapshot.size === 0 ||
          querySnapshot.empty
        ) {
          setNoReadingPlan(true);
          console.log('No reading plan!');
          return null;
        }

        if (querySnapshot.size > 1) {
          console.log('Too many reading plan entries for this day.');
        }

        try {
          querySnapshot.forEach((doc) => {
            console.log('Setting the reading plan!');
            setReadingPlan({
              data: doc.data(),
              id: formatDate(new Date()),
            });
          });
        } catch (error) {
          Alert.alert('Error', 'Error retrieving reading plan');
          console.log('Error: ' + error);
        }
      }

      if (!isLoaded) {
        setIsLoaded(true);
        getUpcomingEvents();
        getReadingPlan();

        /*setState({isLoaded: true}, function() {
          getUpcomingEvents();
          console.log("Set isLoaded to true");
                console.log("It is now: " + isLoaded);
        });*/
      }
    }
    return () => (mounted = false);
  }, [upcomingEvents, readingPlan, isLoaded]);

  return (
    <View style={styles.container}>
      {/*<Header title={'Home'} backButton={false} />*/}

      <Image
        source={require('../assets/Talley.jpg')}
        style={{width: '100%', height: '24%'}}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
        }}>
        <Text style={styles.welcomeText}>Hey, Summit College at NC State!</Text>
      </View>

      <ScrollView style={styles.bodyContainer}>
        <View style={styles.reading}>
          <Text style={styles.subheader}>{"TODAY'S READING"}</Text>
          <TouchableOpacity
            style={[styles.itemContainer, styles.readingPlanContainer]}
            onPress={() =>
              navigation.navigate('Home', {
                screen: 'ReadingPlan',
                params: {
                  header: 'Reading Plan',
                  readingPlanObject: readingPlan,
                },
              })
            }>
            <View style={styles.infoContainer}>
              {!noReadingPlan && readingPlan && (
                <Text style={styles.readingPlanText}>
                  {readingPlan.data.reading}
                </Text>
              )}
              {noReadingPlan && (
                <Text style={styles.readingPlanText}>
                  No reading plan found.
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.events}>
          <Text style={styles.subheader}>{'UPCOMING EVENTS'}</Text>

          {!noUpcomingEvents && upcomingEvents[0] && (
            <View>
              <UpcomingEvent title={upcomingEvents[0].data.title} />
              <UpcomingEvent title={upcomingEvents[1].data.title} />
            </View>
          )}
          {noUpcomingEvents && (
            <Text style={styles.noUpcomingEventsText}>
              No upcoming events found.
            </Text>
          )}
        </View>

        <View style={styles.podcast}>
          <Text style={styles.subheader}>{'PODCAST'}</Text>
          <TouchableOpacity
            style={[styles.itemContainer, styles.podcastContainer]}
            onPress={() =>
              navigation.navigate('Admin', {
                screen: 'Directory',
                params: {
                  header: 'Students',
                  // userType: TYPE_STUDENT,
                },
              })
            }>
            <Image
              source={require('../assets/sc_podcast_logo.jpg')}
              style={styles.podcastImage}
            />
            <Text style={styles.podcastTitle}>{'Love\n'}</Text>
            {/*<Text style={styles.podcastText}>{"On this episode"}</Text>*/}
            {/*ing from Charles Holmes, the HBCU Director for Summit College, and Sam Mendes, UNC Summit College staff member,
                about why the gospel points us to love our… neighbor that is culturally different than us and how practically to do that well."}</Text>*/}
          </TouchableOpacity>
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
  bodyContainer: {},
  title: {
    fontSize: 48,
  },
  subheader: {
    fontSize: 14,
    //fontFamily: 'OpenSans-SemiBold',
    color: summitBlue,
    marginTop: 30,
  },
  whiteButton: {},
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
    paddingVertical: 5,
    height: 40,
  },
  podcastContainer: {
    paddingVertical: 0,
    height: 150,
    paddingLeft: 0,
  },
  upcomingEventsList: {
    backgroundColor: '#eee',
  },
  noUpcomingEventsText: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 24,
  },
  welcomeText: {
    color: 'white',
    //fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 40,
  },
  podcastImage: {
    width: '40%',
    height: '100%',
  },
  podcastTitle: {
    alignItems: 'flex-start',
    paddingTop: 0,
    //fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    marginLeft: 0,
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  podcastText: {
    //width: '100%',
  },
});
