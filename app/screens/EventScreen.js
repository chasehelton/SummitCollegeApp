/* eslint-disable curly */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Header from '../components/Header';
import {summitBlue} from '../assets/colors';

export default function EventScreen({route, navigation}) {
  const {event} = route.params;
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
      <Header title={'Events'} navigation={navigation} backButton={true} />
      <View style={styles.eventContainer}>
        <View style={styles.headerInfo}>
          <View style={styles.dateContainer} key="dateView">
            <Text style={styles.monthText}>
              {getMonth(event.data.startDate)}
            </Text>
            <Text style={styles.dayText}>{getDay(event.data.startDate)}</Text>
          </View>
          <View style={styles.infoContainer} key="infoView">
            <Text style={styles.eventTitle}>{event.data.title}</Text>
            <Text style={styles.eventDesc}>
              {convertTime(event.data.time)} | {event.data.previewText.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{event.data.description}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginHorizontal: 15,
    shadowOffset: {height: 5, width: 5},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 13,
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
    marginBottom: 5,
  },
  eventDesc: {
    fontSize: 18,
    color: summitBlue,
  },
  description: {
    marginTop: 15,
    textAlign: 'left',
    fontSize: 16,
    padding: 12,
    marginLeft: -10,
  },
});
