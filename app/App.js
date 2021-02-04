import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {Icon} from 'react-native-elements';
import {Image, View, Alert} from 'react-native';

// Included to prevent warnings from displaying, comment out for debugging
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Sending...']);

import AdminScreen from './screens/AdminStack';
import EventsStackScreen from './screens/EventsStack';
import EventsScreen from './screens/EventsScreen';
import EventScreen from './screens/EventScreen';
import CommunityStackScreen from './screens/CommunityStack';
import CommunityScreen from './screens/CommunityScreen';
import HomeStackScreen from './screens/HomeStack';
import ResourcesScreen from './screens/ResourcesScreen';
import SettingsScreen from './screens/SettingsScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';

import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SplashScreen from './screens/SplashScreen';
import {summitBlue} from './assets/colors';
import AppContext from './components/AppContext.js';
import axios from 'axios';

const Tab = createBottomTabNavigator();
const Auth = createStackNavigator();


import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [currentUser, setUser] = useState({}); // Auth object
  const [userDoc, setUserDoc] = useState({});
  const [signInNeeded, setSignInNeeded] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialPage, setInitialPage] = useState('Home');

  const [announcements, setAnnouncements] = useState(null);
  const [noAnnouncements, setNoAnnouncements] = useState(false);

  const [readingPlan, setReadingPlan] = useState(null);
  const [noReadingPlan, setNoReadingPlan] = useState(false);
  const [readingPlanAttempted, setReadingPlanAttempted] = useState(false);

  const [memorizationText, setMemorizationText] = React.useState('');

  const [podcastState, setPodcastState] = useState(
    {
      podcastTitle: "",
      podcastDescription: "",
      podcastDate: "",
      podcastImageUrl: "https://via.placeholder.com/300",
    }
  );

  const images = {
    eventsImage: require('./assets/Icon-feather-calendar.png'),
    communityImage: require('./assets/Icon-feather-users.png'),
    homeImage: require('./assets/Icon-feather-home.png'),
    resourcesImage: require('./assets/Icon-feather-folder.png'),
    settingsImage: require('./assets/Icon-feather-settings.png'),
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

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    global.homeLoads = 0;
      console.log('Homeloads in App.js: ' + global.homeLoads);
    //if (isMounted) storeData();

    async function getAnnouncements() {
      const announcementsQuery = await firestore()
        .collection('announcements');
        //.get();

      const announcementsObserver = announcementsQuery.onSnapshot(announcementsSnapshot => {
        if (announcementsSnapshot === null ||
            announcementsSnapshot.size === 0 ||
            announcementsSnapshot.empty) {
          setNoAnnouncements(true);
          global.homeLoads++;
          return null;
        }

        try {
          const tempAnnouncements = [];
          var count = 0;
          announcementsSnapshot.forEach((doc) => {
            tempAnnouncements.push({
              data: doc.data(),
              id: count,
              ref: doc.ref,
            });
            count++;
          });
          setAnnouncements(tempAnnouncements);
          global.homeLoads++;
        } catch (error) {
          Alert.alert('Error', 'Error retrieving announcements');
          console.log('Error retrieving announcements: ' + error);
        }
      });

      return () => announcementsObserver();
    }

    async function getReadingPlan() {
      // first check to see if the api key exists locally
      var esvKeyValue;
      const keyDocQuery = await firestore()
        .collection('apiKeys')
        .doc('esv_key');
        //.get();
      const keyDocObserver = keyDocQuery.onSnapshot(keyDocSnapshot => {
        if (!keyDocSnapshot.exists) {
          console.log('ESV key does not exist in firestore');
        } else {
          try {
            console.log('ESV key: ' + keyDocSnapshot.data().key);
            esvKeyValue = keyDocSnapshot.data().key;
            var source = keyDocSnapshot.metadata.fromCache ? "local cache" : "server";
            console.log("ESV key data came from " + source);
          } catch (e) {
            // saving error
            console.log('Error trying to retrieve esv key: ' + e);
          }
        }
      });

      console.log('ESV Key Value is: ' + esvKeyValue);

      // read the reading plan from firestore
      const readingPlanQuery = await firestore()
        .collection('readingPlan')
        .where('date', '==', formatDate(new Date()));
        //.get();

      const readingPlanObserver = readingPlanQuery.onSnapshot(readingPlanSnapshot => {
        var source = readingPlanSnapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Reading plan data came from " + source);
        setReadingPlanAttempted(true);
        if (readingPlanSnapshot === null ||
          readingPlanSnapshot.size === 0 ||
          readingPlanSnapshot.empty) {
          setNoReadingPlan(true);
          console.log('No reading plan!');
          return null;
        }

        if (readingPlanSnapshot.size > 1) {
          console.log('Too many reading plan entries for this day.');
        }

        try {
          readingPlanSnapshot.forEach((doc) => {
            console.log('Setting the reading plan!');
            setReadingPlan({
              data: doc.data(),
              id: formatDate(new Date()),
            });
            getMemorizationText(doc.data(), esvKeyValue);
          });
        } catch (error) {
          Alert.alert('Error', 'Error retrieving reading plan');
          console.log('Error retrieving reading plan: ' + error);
        }
      });

      return () => {readingPlanObserver(); keyDocObserver();}
    }

    async function getPodcastData() {
      const cheerio = require("cheerio");
      const axios = require("axios");
      const podcastUrl = 'https://anchor.fm/summitcollege';
      await axios.get(podcastUrl).then((response) => {
        const che = cheerio.load(response.data);
        // This isn't the actual way to get the title, it was just easier to test with this.
        var podTitle = che("div.styles__episodeHeading___29q7v").first().text();
        var podDescription = che("div.styles__episodeDescription___C3oZg").first().text();
        var podDateFull = che("div.styles__episodeCreated___1zP5p").first().text();
        var podDate = podDateFull.match(/[a-zA-Z]+ \d+/g);
        console.log(podDate);
        console.log('podTitle in method: ' + podTitle);
        var podImageUrl = che("a.styles__episodeImage___tMifW").find('img').attr('src');
        console.log("Image URL: " + podImageUrl);

        setPodcastState({
                                  podcastTitle: podTitle,
                                  podcastDescription: podDescription,
                                  podcastDate: podDate,
                                  podcastImageUrl: podImageUrl,
                                }

        );

      }).catch((error) => {
        console.log("Error getting podcast data: " + error);
      });
    }

    async function getMemorizationText(data, key) {
      let passageText = data.memorization.replace(/ /g, '+');
      console.log('Passage text: ' + passageText);
      await axios
        .get('https://api.esv.org/v3/passage/text/?q=' + passageText, {
          headers: {
            Authorization: key,
          },
          params: {
            include_passage_references: false,
            include_verse_numbers: false,
            include_first_verse_numbers: false,
            include_footnotes: false,
            include_headings: false,
          },
        })
        .then((response) => {
          console.log(response.data);
          console.log(response.data.passages[0]);
          setMemorizationText(response.data.passages[0].trim());
        })
        .catch((error) => {
          console.log('Error getting memorization text: ' + error);
          setMemorizationText('error!');
        });
    }

    async function getUserObject(uid) {
      console.log('My uid is: ' + uid + 'END');
      const userSnapshot = await firestore()
        .collection('users')
        //.where('displayName', '==', 'Richard Marshall')
        .where('uid', '==', uid)
        .get();

      if (userSnapshot.empty) console.log('Empty snapshot!');
      else {
        userSnapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          setUserDoc(doc.data());
          //should only be one so return
          return;
        });
      }
      /*if (!userObj.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', userObj.data());
        setUserDoc(userObj.data());
      }*/

    }

    async function getNecessaryData(user) {
      getPodcastData();
      setUser(user);
      getUserObject(user.uid);

      getReadingPlan();
      getAnnouncements();

      if (user.email === 'scappadmin@summitrdu.com') {
        setIsAdmin(true);
        setInitialPage('Admin');
      } else {
        setIsAdmin(false);
        setInitialPage('Home');
      }
      setSignInNeeded(false);

    }


    auth().onAuthStateChanged((user) => {
      if (isMounted) {
        if (user) {
          //setIsLoading(true);
          getNecessaryData(user);
          //setUser(user);
          //setIsLoading(false);


        } else {
          console.log('User is null!');
          setUser(null);
          setSignInNeeded(true);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
      if (!isMounted && signInNeeded) {
        console.log('Already loaded once but need to do it cuz of new sign in?');
        console.log('RELOADING');
        DevSettings.reload();
        getNecessaryData();
      }
    });
    return () => (isMounted = false); // use effect cleanup to set flag false, if unmounted
  }, []);

  const getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';

    if (routeName === 'ChatScreen') {
      return false;
    }

    return true;
  }

  return (
    <>
      <AppContext.Provider value = {{ readingPlan: readingPlan, announcements: announcements,
        noAnnouncements: noAnnouncements, noReadingPlan: noReadingPlan, podcastState: podcastState,
        memorizationText: memorizationText, userDoc: userDoc}}>
      {((podcastState.podcastTitle == '' || !readingPlanAttempted
        || !announcements) && !signInNeeded) && <SplashScreen />}
      {((podcastState.podcastTitle != '' && readingPlanAttempted
               && announcements) || (signInNeeded && !readingPlanAttempted)) && (
        <NavigationContainer>
          {currentUser && (
            <Tab.Navigator
              initialRouteName={initialPage}
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;
                  let img;
                  if (route.name === 'Events') {
                    iconName = 'event';
                    img = images.eventsImage;
                  } else if (route.name === 'Community') {
                    iconName = 'group';
                    img = images.communityImage;
                  } else if (route.name === 'Home') {
                    iconName = 'home';
                    img = images.homeImage;
                  } else if (route.name === 'Resources') {
                    iconName = 'folder-open';
                    img = images.resourcesImage;
                  } else if (route.name === 'Settings') {
                    iconName = 'settings';
                    img = images.settingsImage;
                  } else if (route.name === 'Announcements') {
                    iconName = 'feedback';
                    return (
                      <View style={{height: 35, width: 35}}>
                        <Icon
                          name="feedback"
                          type="material"
                          size={35}
                          color={color}
                        />
                      </View>
                    );
                  } else if (route.name === 'Admin') {
                    return (
                      <View style={{height: 35, width: 35}}>
                        <Icon
                          name="supervisor-account"
                          type="material"
                          size={35}
                          color={color}
                        />
                      </View>
                    );
                  }
                  // You can return any component that you like here!
                  return (
                    <View style={{height: 35, width: 35}}>
                      <Image source={img} />
                    </View>
                  );
                  /*return (
                    <Icon
                      name={iconName}
                      type="material"
                      size={35}
                      color={color}
                    />

                  );*/
                  //return <Image source={iconName} style={{ height: 35 }} />;
                  //return <Image source={img} style={{ height: 35 }} />;
                },
              })}
              tabBarOptions={{
                labelStyle: {},
                activeTintColor: summitBlue,
                inactiveTintColor: 'gray',
                showLabel: false,
                style: {
                  backgroundColor: 'white',
                  paddingLeft: 30,
                  paddingRight: 30,
                  height: 80,
                },
              }}>
              {isAdmin && (
                <>
                  <Tab.Screen name="Admin" component={AdminScreen} />
                  <Tab.Screen name="Settings" component={SettingsScreen} />
                </>
              )}
              {!isAdmin && (
                <>
                  <Tab.Screen name="Events" component={EventsStackScreen} />
                  <Tab.Screen
                    name="Community"
                    component={CommunityStackScreen}
                    options={({ route }) => ({
                            tabBarVisible: getTabBarVisibility(route)
                          })}
                  />
                  <Tab.Screen name="Home" component={HomeStackScreen}/>
                  <Tab.Screen name="Resources" component={ResourcesScreen} />
                  <Tab.Screen name="Settings" component={SettingsScreen} />
                  {/*<Tab.Screen
                    name="Announcements"
                    component={AnnouncementsScreen}
                  />*/}
                </>
              )}
            </Tab.Navigator>
          )}
          {!currentUser && (
            <Auth.Navigator screenOptions={{headerShown: false}}>
              <Auth.Screen name="Sign Up" component={SignUpScreen} />
              <Auth.Screen name="Login" component={LoginScreen} />
              <Auth.Screen
                name="Forgot Password"
                component={ForgotPasswordScreen}
              />
            </Auth.Navigator>
          )}
        </NavigationContainer>
      )}
      </AppContext.Provider>
    </>
  );
}
