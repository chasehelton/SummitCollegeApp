import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CommunityScreen from './CommunityScreen';
import DirectoryScreen from './DirectoryScreen';
import PersonScreen from './PersonScreen';

const CommunityNavStack = createStackNavigator();

export default function CommunityStackScreen() {
  return (
    <CommunityNavStack.Navigator screenOptions={{headerShown: false}}>
      <CommunityNavStack.Screen name="CommunityScreen" component={CommunityScreen} />
      <CommunityNavStack.Screen name="Directory" component={DirectoryScreen} />
      <CommunityNavStack.Screen name="Person" component={PersonScreen} />
    </CommunityNavStack.Navigator>
  );
}
