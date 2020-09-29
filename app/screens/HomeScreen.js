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
import axios from 'axios';

import {Icon} from 'react-native-elements';
import {summitBlue} from '../assets/colors';
import Header from '../components/Header';
import UpcomingEvent from '../components/UpcomingEvent';

import AsyncStorage from '@react-native-community/async-storage';

export default function HomeScreen({navigation}) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [noUpcomingEvents, setNoUpcomingEvents] = useState(false);

  const [readingPlan, setReadingPlan] = useState(null);
  const [noReadingPlan, setNoReadingPlan] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  const [memorizationText, setMemorizationText] = React.useState('');

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
    if (noReadingPlan) Alert.alert('There is no reading plan');
    else
    navigation.navigate('Home', {
      screen: 'ReadingPlan',
      params: {
        header: 'Reading Plan',
        readingPlanObject: readingPlan,
        memText: memorizationText,
      },
    });

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
        // first check to see if the api key exists locally
        var esvKeyValue = await AsyncStorage.getItem('@esvKey');
        if (esvKeyValue == null) {
          console.log("ESV Key not found, now retrieve from database");
          console.log("Storing data for api key");
          const keyDoc = await firestore()
            .collection('apiKeys').doc('esv_key').get();
          if (!keyDoc.exists) {
            console.log('ESV key does not exist in firestore');
          }
          else {
            try {
              console.log('ESV key: ' + keyDoc.data().key);
              await AsyncStorage.setItem('@esvKey', keyDoc.data().key);
              esvKeyValue = keyDoc.data().key;
            } catch (e) {
              // saving error
              console.log("Error trying to save esv key: " + e);
            }
          }
        }
        else console.log("ESV Key was found!");
        console.log("Esv Key Value is now: " + esvKeyValue);

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
            getMemorizationText(doc.data(), esvKeyValue);
          });
        } catch (error) {
          Alert.alert('Error', 'Error retrieving reading plan');
          console.log('Error: ' + error);
        }
      }

      async function getMemorizationText(data, key) {
        let passageText = data.memorization.replace(/ /g, '+');
        console.log("Passage text: " + passageText);
        await axios
          .get('https://api.esv.org/v3/passage/text/?q=' + passageText,
            {
              headers: {
                'Authorization': key
              },
              params: {
                include_passage_references: false,
                include_verse_numbers: false,
                include_first_verse_numbers: false,
                include_footnotes: false,
                include_headings: false,
              }
            }
          )
          .then((response) => {
            console.log(response.data)
            console.log(response.data.passages[0]);
            setMemorizationText(response.data.passages[0].trim());
          })
          .catch((error) => {
            console.log('Error: ' + error);
            setMemorizationText('error!');
          });
      }

      if (!isLoaded) {
        setIsLoaded(true);
        getUpcomingEvents();
        getReadingPlan();

      }
    }
    return () => (mounted = false);
  }, [upcomingEvents, readingPlan, memorizationText, isLoaded]);

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
            onPress={() => selectReadingPlan()
            }
          >
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
    fontFamily: 'OpenSans-SemiBold',
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
    fontFamily: 'OpenSans-Bold',
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
