import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {Icon} from 'react-native-elements';

// Included to prevent warnings from displaying, comment out for debugging
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Sending...']);

import AdminScreen from './screens/AdminStack';
import EventsStackScreen from './screens/EventsStack';
import EventsScreen from './screens/EventsScreen';
import EventScreen from './screens/EventScreen';
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

const Tab = createBottomTabNavigator();
const Auth = createStackNavigator();

import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [currentUser, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialPage, setInitialPage] = useState('Home');

  // const images = {
  //   eventsImage: require('./assets/Icon-feather-calendar.png'),
  //   communityImage: require('./assets/Icon-feather-users.png'),
  //   homeImage: require('./assets/Icon-feather-home.png'),
  //   resourcesImage: require('./assets/Icon-feather-folder.png'),
  //   settingsImage: require('./assets/Icon-feather-settings.png'),
  // };

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    //if (isMounted) storeData();
    auth().onAuthStateChanged((user) => {
      if (isMounted) {
        if (user) {
          setIsLoading(true);
          setUser(user);
          setIsLoading(false);

          if (user.email === 'scappadmin@summitrdu.com') {
            setIsAdmin(true);
            setInitialPage('Admin');
          } else {
            setIsAdmin(false);
            setInitialPage('Home');
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    });
    return () => (isMounted = false); // use effect cleanup to set flag false, if unmounted
  }, []);
  return (
    <>
      {isLoading && <SplashScreen />}
      {!isLoading && (
        <NavigationContainer>
          {currentUser && (
            <Tab.Navigator
              initialRouteName={initialPage}
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;
                  if (route.name === 'Events') {
                    iconName = 'event';
                  } else if (route.name === 'Community') {
                    iconName = 'group';
                  } else if (route.name === 'Home') {
                    iconName = 'home';
                  } else if (route.name === 'Resources') {
                    iconName = 'folder-open';
                  } else if (route.name === 'Settings') {
                    iconName = 'settings';
                  } else if (route.name === 'Announcements') {
                    iconName = 'feedback';
                  } else if (route.name === 'Admin') {
                    return (
                      <Icon
                        name="supervisor-account"
                        type="material"
                        size={35}
                        color={color}
                      />
                    );
                  }
                  // You can return any component that you like here!
                  return (
                    <Icon
                      name={iconName}
                      type="material"
                      size={35}
                      color={color}
                    />
                  );
                  //return <Image source={iconName} style={styles.iconTest} />;
                },
              })}
              tabBarOptions={{
                labelStyle: {},
                activeTintColor: summitBlue,
                inactiveTintColor: 'gray',
                showLabel: false,
                style: {
                  backgroundColor: 'white',
                  height: 100,
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
                  <Tab.Screen name="Community" component={CommunityScreen} />
                  <Tab.Screen name="Home" component={HomeStackScreen} />
                  <Tab.Screen name="Resources" component={ResourcesScreen} />
                  <Tab.Screen name="Settings" component={SettingsScreen} />
                  <Tab.Screen
                    name="Announcements"
                    component={AnnouncementsScreen}
                  />
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
    </>
  );
}
