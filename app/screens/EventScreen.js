import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Header from '../components/Header';

export default function EventScreen({route, navigation}) {
  const {event} = route.params;
  return (
    <View>
      <Header navigation={navigation} backButton={true} />
      <Text>{event.data.title}</Text>
    </View>
  );
}
