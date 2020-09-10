/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

import {summitBlue} from '../assets/colors';

export default function Event({navigation, startDate, title, previewText}) {
  const getMonth = (date) => {
    let month = '';
    let m = new Date(date).getMonth() + 1;
    if (m === 1) month = 'JAN';
    else if (m === 2) month = 'FEB';
    else if (m === 3) month = 'MAR';
    else if (m === 4) month = 'APR';
    else if (m === 5) month = 'MAY';
    else if (m === 6) month = 'JUN';
    else if (m === 7) month = 'JUL';
    else if (m === 8) month = 'AUG';
    else if (m === 9) month = 'SEP';
    else if (m === 10) month = 'OCT';
    else if (m === 11) month = 'NOV';
    else if (m === 12) month = 'DEC';
    return month;
  };

  const getDay = (date) => {
    let d = new Date(date).getDate() + 1;
    return d;
  };

  return (
    <TouchableOpacity style={styles.eventContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.monthText}>{getMonth(startDate)}</Text>
        <Text style={styles.dayText}>{getDay(startDate)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventDesc}>{previewText}</Text>
      </View>
      <Icon
        name="keyboard-arrow-right"
        type="material"
        color={summitBlue}
        style={{marginLeft: 10}}
        size={35}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderColor: summitBlue,
    borderWidth: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 8,
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 13,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'darkgray',
  },
  dayText: {
    fontSize: 30,
    fontWeight: '300',
    color: 'darkgray',
  },
  infoContainer: {
    textAlign: 'left',
    width: 250,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  eventDesc: {
    fontSize: 14,
  },
});
