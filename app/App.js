/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
//import Icon from 'react-native-ionicons';

import AdminScreen from './screens/AdminStack';
import HomeScreen from './screens/HomeScreen';
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
              screenOptions={({route}) => ({
                // tabBarIcon: ({focused, color, size}) => {
                //   let iconName;
                //   if (route.name === 'Home') {
                //     iconName = focused
                //       ? 'ios-add'
                //       : 'ios-information-circle-outline';
                //   } else if (route.name === 'Settings') {
                //     iconName = focused ? 'ios-list-box' : 'ios-list';
                //   }
                //   // You can return any component that you like here!
                //   return <Icon name={iconName} size={size} color={color} />;
                // },
              })}
              tabBarOptions={{
                labelStyle: {fontSize: 13},
                activeTintColor: '#00a8ff',
                inactiveTintColor: 'gray',
              }}>
              {isAdmin && (
                <>
                  <Tab.Screen name="Admin" component={AdminScreen} />
                  <Tab.Screen name="Settings" component={SettingsScreen} />
                </>
              )}
              {!isAdmin && (
                <>
                  <Tab.Screen name="Home" component={HomeScreen} />
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
