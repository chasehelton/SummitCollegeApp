import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AdminHomeScreen from './AdminHomeScreen';
import DirectoryScreen from './DirectoryScreen';
import PersonScreen from './PersonScreen';

const AdminStack = createStackNavigator();

export default function AdminScreen() {
  return (
    <AdminStack.Navigator screenOptions={{headerShown: false}}>
      <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} />
      <AdminStack.Screen name="Directory" component={DirectoryScreen} />
      <AdminStack.Screen name="Person" component={PersonScreen} />
    </AdminStack.Navigator>
  );
}
