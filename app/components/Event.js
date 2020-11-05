/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {summitBlue} from '../assets/colors';

export default function Event({time, startDate, title, previewText}) {
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

  const convertTime = (t) => {

    var timeArray = t.split(':');
    var hours = Number(timeArray[0]);
    var minutes = Number(timeArray[1]);
    console.log('Hours: ' + hours);
        console.log('Minutes: ' + minutes);
    var timeValue;
    if (hours > 0 && hours <= 12) timeValue = '' + hours;
    else if (hours > 12) timeValue = '' + (hours - 12);
    else if (hours === 0) timeValue = '12';
    if (minutes != 0) timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes;
    timeValue += hours >= 12 ? ' PM' : ' AM';
    return timeValue;
  };

  return (
    <>
      <View style={styles.dateContainer} key="dateView">
        <Text style={styles.monthText}>{getMonth(startDate)}</Text>
        <Text style={styles.dayText}>{getDay(startDate)}</Text>
      </View>
      <View style={styles.infoContainer} key="infoView">
        <Text style={styles.eventTitle}>{title}</Text>
        <Text style={styles.eventDesc} numberOfLines={1}>
          {convertTime(time)} | {previewText.toUpperCase()}
        </Text>
      </View>
      <Icon
        key="iconView"
        name="keyboard-arrow-right"
        type="material"
        color={summitBlue}
        style={{marginLeft: 10}}
        size={35}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    alignItems: 'center',
    marginRight: 13,
    marginVertical: 20,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '300',
    color: 'darkgray',
  },
  dayText: {
    fontSize: 40,
    fontWeight: '300',
    color: 'darkgray',
    marginTop: -10,
  },
  infoContainer: {
    textAlign: 'left',
    width: 250,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 22,

  },
  eventDesc: {
    fontSize: 18,
    color: summitBlue,
  },
});
