import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import EventsScreen from './EventsScreen';
import EventScreen from './EventScreen';

const EventsNavStack = createStackNavigator();

export default function EventsStackScreen() {
  return (
    <EventsNavStack.Navigator screenOptions={{headerShown: false}}>
      <EventsNavStack.Screen name="EventsScreen" component={EventsScreen} />
      <EventsNavStack.Screen name="Event" component={EventScreen} />
    </EventsNavStack.Navigator>
  );
}
