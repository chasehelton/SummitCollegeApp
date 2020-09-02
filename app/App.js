/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
//import Icon from 'react-native-ionicons';
import {Icon} from 'react-native-elements';
import {StyleSheet, Image} from 'react-native';

import AdminScreen from './screens/AdminStack';
import EventsScreen from './screens/EventsScreen';
import CommunityScreen from './screens/CommunityScreen';
import HomeScreen from './screens/HomeScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import SettingsScreen from './screens/SettingsScreen';

import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SplashScreen from './screens/SplashScreen';

const Tab = createBottomTabNavigator();
const Auth = createStackNavigator();

export default function App() {
  const [currentUser, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const images = {
    eventsImage: require('./assets/Icon-feather-calendar.png'),
    communityImage: require('./assets/Icon-feather-users.png'),
    homeImage: require('./assets/Icon-feather-home.png'),
    resourcesImage: require('./assets/Icon-feather-folder.png'),
    settingsImage: require('./assets/Icon-feather-settings.png'),
  };

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    auth().onAuthStateChanged((user) => {
      if (isMounted) {
        if (user) {
          setIsLoading(true);
          setUser(user);
          setIsLoading(false);

          if (user.email === 'scappadmin@summitrdu.com') {
            setIsAdmin(true);
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
            <Tab.Navigator initialRouteName="Home"
              screenOptions={({route}) => ({
                 tabBarIcon: ({focused, color, size}) => {
                   let iconName;
                   if (route.name === 'Events') {
                     iconName = images.eventsImage;
                   }
                   else if (route.name === 'Community') {
                     iconName = images.communityImage;
                   }

                   else if (route.name === 'Home') {
                     iconName = images.homeImage;
                   }
                   else if (route.name === 'Resources') {
                     iconName = images.resourcesImage;
                   }
                   else if (route.name === 'Settings') {
                     iconName = images.settingsImage;
                   }
                   // You can return any component that you like here!
                   //return <Icon name={iconName} type='material' size={size} color={color} />;
                   return <Image source={iconName} style={styles.iconTest}/>
                 },
              })}
              tabBarOptions={{
                labelStyle: {fontSize: 13},
                activeTintColor: '#00a8ff',
                inactiveTintColor: 'gray',
                showLabel: false,
              }}>
              {isAdmin && (
                <>
                  <Tab.Screen name="Admin" component={AdminScreen} />
                  <Tab.Screen name="Settings" component={SettingsScreen} />
                </>
              )}
              {!isAdmin && (
                <>
                  <Tab.Screen name="Events" component={EventsScreen} />
                  <Tab.Screen name="Community" component={CommunityScreen} />
                  <Tab.Screen name="Home" component={HomeScreen} />
                  <Tab.Screen name="Resources" component={ResourcesScreen} />
                  <Tab.Screen name="Settings" component={SettingsScreen} />
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

const styles = StyleSheet.create({
  iconTest: {
    width: 25,
    height: 25,
  }

});