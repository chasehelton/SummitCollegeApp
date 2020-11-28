/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

import {summitBlue} from '../assets/colors';

export default function Announcement({navigation, timestamp, title, body}) {
  const getMonth = (timestamp) => {
    let month = '';
    let m = new Date(timestamp.seconds * 1000).getMonth() + 1; // the +1 is necessary.
    if (m === 1) month = 'Jan';
    else if (m === 2) month = 'Feb';
    else if (m === 3) month = 'Mar';
    else if (m === 4) month = 'Apr';
    else if (m === 5) month = 'May';
    else if (m === 6) month = 'Jun';
    else if (m === 7) month = 'Jul';
    else if (m === 8) month = 'Aug';
    else if (m === 9) month = 'Sep';
    else if (m === 10) month = 'Oct';
    else if (m === 11) month = 'Nov';
    else if (m === 12) month = 'Dec';
    return month;
  };

  const getDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000).getDate();
  };

  const getHours = (timestamp) => {
    hours = new Date(timestamp.seconds * 1000).getHours();
    if (hours > 12) {
      hours -= 12;
    }
    return twoDigits(hours)
  };

  const getMinutes = (timestamp) => {
    return twoDigits(new Date(timestamp.seconds * 1000).getMinutes());
  };

  const getAMPM = (timestamp) => {
    hours = new Date(timestamp.seconds * 1000).getHours();
    if (hours >= 12 && hours < 24) {
      return "PM"
    }
    else {
      return "AM"
    }
  };

  const isToday = (timestamp) => {
    let today = new Date().toDateString();
    let announcementDate = new Date(timestamp.seconds * 1000).toDateString();
    return today == announcementDate;
  };

  const twoDigits = (num) => {
    if (num < 10) return "0" + num;
    else return num;
  }

  return (
    <TouchableOpacity style={styles.announcementContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.announcementTitle}>{title}</Text>
      </View>
      {isToday(timestamp)
        ? <View style={styles.dateContainer}>
          <Text style={styles.hourText}>{getHours(timestamp)}:{getMinutes(timestamp)}{getAMPM(timestamp)}</Text>
        </View>
        : <View style={styles.dateContainer}>
          <Text style={styles.monthText}>{getMonth(timestamp)} {getDate(timestamp)}</Text>
        </View>
      }
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
  announcementContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    //shadowOffset: {height: 5, width: 5},
    //shadowOpacity: 0.15,
    //shadowRadius: 5,
    backgroundColor: '#fff',
    //elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 8,
    height: 70,
  },
  dateContainer: {
    alignItems: 'center',
    marginLeft: 13,
  },
  monthText: {
    fontSize: 12,
    fontWeight: '300',
    color: 'darkgray',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '300',
    color: 'darkgray',
  },
  hourText: {
    fontSize: 12,
    fontWeight: '300',
    color: 'darkgray',
  },
  infoContainer: {
    textAlign: 'left',
    width: 250,
  },
  announcementTitle: {
    fontSize: 18,
  },
});
