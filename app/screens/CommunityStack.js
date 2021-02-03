import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CommunityScreen from './CommunityScreen';
import DirectoryScreen from './DirectoryScreen';
import PersonScreen from './PersonScreen';
import ChatScreen from './ChatScreen';

const CommunityNavStack = createStackNavigator();

export default function CommunityStackScreen({route, navigation}) {

  return (
    <CommunityNavStack.Navigator screenOptions={{headerShown: false}}>
      <CommunityNavStack.Screen name="CommunityScreen" component={CommunityScreen} />
      <CommunityNavStack.Screen name="Directory" component={DirectoryScreen} />
      <CommunityNavStack.Screen name="Person" component={PersonScreen} />
      <CommunityNavStack.Screen name="ChatScreen" component={ChatScreen}
         />
    </CommunityNavStack.Navigator>
  );
}
