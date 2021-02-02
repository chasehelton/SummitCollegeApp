/* eslint-disable curly */
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
import talley from '../assets/Talley.jpg';
import pod from '../assets/sc_podcast_logo.jpg';
import UpcomingEvent from '../components/UpcomingEvent';
import Announcement from '../components/Announcement';

import { LogBox } from 'react-native';

import AppContext from '../components/AppContext.js';


global.Buffer = global.Buffer || require('buffer').Buffer;


export default function HomeScreen({route, navigation}) {

  const [isLoaded, setIsLoaded] = useState(false);

  const context = React.useContext(AppContext);

  const displayShortDate = (dateText) => {
    if (dateText == null || dateText == '') return;
    var numberPattern = /\d+/g;
    console.log("Date text: " + dateText.toString());

    return dateText.toString().substring(0, 3).toUpperCase()
      + ' ' + dateText.toString().match( numberPattern )[0];
  };


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
    console.log(context.readingPlan);
    if (context.noReadingPlan) Alert.alert('There is no reading plan');
    else
      navigation.navigate('Home', {
        screen: 'ReadingPlan',
        params: {
          header: 'Reading Plan',
          readingPlanObject: context.readingPlan,
          memText: context.memorizationText,
        },
      });
  };

  const selectUpcomingEvent = (e) => {
    console.log('Selecting this upcoming event: ' + e);
    navigation.navigate('Events', {
      screen: 'Event',
      params: {
        header: 'Events',
        event: e,
      },
    });
  };

  const selectAnnouncement = (param) => {
    console.log('Announcement clicked, index: ' + param);
    navigation.navigate('Home', {
      screen: 'Announcement',
      params: {
        announcement: context.announcements[param],
      },
    });
  };

  const handlePlayButton = () => {
    console.log('Start playing podcast somehow');
  };

  useLayoutEffect(() => {

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    console.log('i fire once');

  }, []);

  return (

    <View style={styles.container}>
      {/*<Header title={'Home'} backButton={false} />*/}

      <Image source={talley} style={styles.talley} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
        }}>
        <Text style={styles.welcomeText}>Hey, NC State Summit College!</Text>
      </View>

      <ScrollView style={styles.bodyContainer}>
        <View style={styles.reading}>
          <Text style={styles.subheader}>{"TODAY'S READING"}</Text>
          <TouchableOpacity
            style={[styles.itemContainer, styles.readingPlanContainer]}
            onPress={selectReadingPlan}>
            <View style={styles.infoContainer}>
              {!context.noReadingPlan && context.readingPlan && (
                <Text style={styles.readingPlanText}>
                  {context.readingPlan.data.reading}
                </Text>

              )}
              {context.noReadingPlan && (
                <Text style={styles.readingPlanText}>
                  No reading plan found.
                </Text>
              )}
            </View>
            <Icon
              name="chevron-right"
              type="feather"
              color={summitBlue}
              style={{flex: 1, borderWidth: 0, }}
              size={35}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.announcements}>
          <Text style={styles.subheader}>{'ANNOUNCEMENTS'}</Text>

          {!context.noAnnouncements && (
            <FlatList
              style={styles.announcementsList}
              data={context.announcements.sort((a, b) => {
                let date1 = new Date(a.data.timestamp);
                let date2 = new Date(b.data.timestamp);
                return date1.getTime() - date2.getTime();
              })}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={styles.announcementContainer}
                  onPress={() => selectAnnouncement(index)}
                >
                  <Announcement
                    title={item.data.title}
                    timestamp={item.data.timestamp}
                    key={index}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
          {context.noAnnouncements && (
            <Text style={styles.noAnnouncementsText}>
              No announcements found.
            </Text>
          )}
        </View>

        <View style={styles.podcast}>
          <Text style={styles.subheader}>{'PODCAST'}</Text>
          <TouchableOpacity
            style={[styles.itemContainer, styles.podcastContainer]}
            >
            <View style={styles.topHalfContainer}>
              <View style={styles.podcastImageContainer}>
                <Image

                  source={{ uri: context.podcastState.podcastImageUrl }}
                  style={styles.podcastImage}
                  resizeMode='contain'
                />
              </View>
              <View style={{flex: .65, /*flexDirection: 'column',
                                                          alignItems: 'flex-start',*/}}>
                <View style={{borderWidth: 0}}>
                  <Text style={styles.podcastDateText}>{displayShortDate(context.podcastState.podcastDate)}</Text>
                </View>
                <View style={{borderWidth: 0}}>
                  <Text numberOfLines={2} style={styles.podcastTitle}>{context.podcastState.podcastTitle}</Text>
                </View>
                <View style={{borderWidth: 0}}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={handlePlayButton}>
                    <Text style={styles.playButtonText}>PLAY</Text>
                  </TouchableOpacity>
                </View>


              </View>
            </View>
            <View style={styles.bottomHalfContainer}>
              <Text style={styles.podcastText} numberOfLines={4} >{context.podcastState.podcastDescription}</Text>
            </View>
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
  talley: {
    width: '100%',
    height: '25%',
  },
  bodyContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
  },
  subheader: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: summitBlue,
    marginTop: 30,
    letterSpacing: 0.5,
  },
  whiteButton: {},
  infoContainer: {
    textAlign: 'left',
    width: 275, //250?
    //borderWidth: 1,
    flex: 5,
  },
  readingPlanText: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
  },
  eventText: {
    fontSize: 16,
  },
  itemContainer: {
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

  announcementList: {
    backgroundColor: '#eee',
    //padding: 10,
  },
  noAnnouncementsText: {
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
    width: '70%',
  },
  topHalfContainer: {
    height: 125,
    //borderWidth: 1,
    borderColor: 'red',
    flexDirection:"row",
    alignItems:'flex-start',
    justifyContent:'flex-start',
  },
  bottomHalfContainer: {
    marginTop: 10,
    //borderWidth: 1, borderColor: 'yellow',
  },
  podcastContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'column',
    marginBottom: 20,
    /*flexDirection:"row",
    alignItems:'flex-start',
    justifyContent:'flex-start',*/
  },
  podcastImageContainer: {
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'black',
    overflow: 'hidden',
    flex: .35,
  },
  podcastImage: {
    height: '100%',
  },

  podcastTitle: {
    paddingTop: 5,
    fontFamily: 'OpenSans-SemiBold',
    //fontWeight: 'bold',
    width: '100%',
    marginLeft: 0,
    textAlign: 'left',
    textAlignVertical: 'top',
    color: 'black',
    fontSize: 20,
  },
  podcastDateText: {
    marginTop: 7,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
  },
  podcastText: {
    //width: '100%',
    fontFamily: 'OpenSans-Regular',
  },
  playButtonText: {
    color: 'white',
    fontWeight: '800',
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: summitBlue,
    paddingVertical: 5,
    borderRadius: 8,
    width: '45%',
    marginTop: 2,
  },
  announcementContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    //shadowOffset: {height: 5, width: 5},
    //shadowOpacity: 0.15,
    //shadowRadius: 5,
    backgroundColor: '#fff',
    //elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 8,
    height: 70,
  },
});
