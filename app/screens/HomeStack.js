import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import DirectoryScreen from './DirectoryScreen';
import PersonScreen from './PersonScreen';
import ReadingPlanScreen from './ReadingPlanScreen';

const HomeNavStack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <HomeNavStack.Navigator screenOptions={{headerShown: false}}>
      <HomeNavStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeNavStack.Screen name="Directory" component={DirectoryScreen} />
      <HomeNavStack.Screen name="Person" component={PersonScreen} />
      <HomeNavStack.Screen name="ReadingPlan" component={ReadingPlanScreen} />
    </HomeNavStack.Navigator>
  );
}
