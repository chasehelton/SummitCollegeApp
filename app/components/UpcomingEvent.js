/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

import {summitBlue} from '../assets/colors';

export default function UpcomingEvent({navigation, title}) {
  return (
    [
      <View style={styles.infoContainer} key="eventTitleView">
        <Text style={styles.eventText}>{title}</Text>
      </View>,
      <Icon
        key="eventArrowIcon"
        name="keyboard-arrow-right"
        type="material"
        color='#eee'
        style={{marginLeft: 10}}
        size={35}
      />,
    ]
  );
}

const styles = StyleSheet.create({
  eventContainer: {
      paddingVertical: 5,
      height: 40
    },
  itemContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      shadowOffset: {height: 5, width: 5},
      shadowOpacity: 0.15,
      shadowRadius: 5,
      backgroundColor: '#fff',
      elevation: 2,
      paddingHorizontal: 20,

      borderRadius: 8,

    },
  eventText: {
      fontSize: 16,
    },
  infoContainer: {
      textAlign: 'left',
      width: 275,
    },
});
