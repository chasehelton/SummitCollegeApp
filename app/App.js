import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AnnouncementsScreen from './screens/AnnouncementsScreen';
import EventsScreen from './screens/EventsScreen';
import HomeScreen from './screens/HomeScreen';
import CommunityScreen from './screens/CommunityScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';

const Tab = createBottomTabNavigator();
const Auth = createStackNavigator();

export default function App() {
  const [currentUser, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <>
      {isLoading && <SplashScreen />}
      {!isLoading && (
        <NavigationContainer>
          {currentUser && (
            <Tab.Navigator
              screenOptions={({route}) => ({
                // tabBarIcon: ({focused, color, size}) => {
                //   let iconName;
                //   if (route.name === 'Home') {
                //     iconName = focused
                //       ? 'ios-information-circle'
                //       : 'ios-information-circle-outline';
                //   } else if (route.name === 'Settings') {
                //     iconName = focused ? 'ios-list-box' : 'ios-list';
                //   }
                //   // You can return any component that you like here!
                //   return <Ionicons name={iconName} size={size} color={color} />;
                // },
              })}
              tabBarOptions={{
                labelStyle: {fontSize: 13},
                activeTintColor: '#00a8ff',
                inactiveTintColor: 'gray',
              }}>
              <Tab.Screen name="Home" component={HomeScreen} />
              {/* <Tab.Screen name="Announcements" component={AnnouncementsScreen} />
              <Tab.Screen name="Events" component={EventsScreen} />
              <Tab.Screen name="Community" component={CommunityScreen} /> */}
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          )}
          {!currentUser && (
            <Auth.Navigator screenOptions={{headerShown: false}}>
              <Auth.Screen name="Sign Up" component={SignUpScreen} />
              <Auth.Screen name="Login" component={LoginScreen} />
            </Auth.Navigator>
          )}
        </NavigationContainer>
      )}
    </>
  );
}
