/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {summitBlue} from '../assets/colors';

import auth from '@react-native-firebase/auth';

export default function ChatMessage({message}) {
  /*const getMonth = (date) => {
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
    timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes;
    timeValue += hours >= 12 ? ' PM' : ' AM';
    return timeValue;
  };*/

  const text = message.msg; // check firebase?
  const uid = message.uid;

  const messageStyle = uid === auth().currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <View>
        <Text>{text} sent?: {messageStyle}</Text>
      </View>
      {/*<>
            <View style={styles.dateContainer} key="dateView">
              <Text style={styles.monthText}>{getMonth(startDate)}</Text>
              <Text style={styles.dayText}>{getDay(startDate)}</Text>
            </View>
            <View style={styles.infoContainer} key="infoView">
              <Text style={styles.eventTitle}>{title}</Text>
              <Text style={styles.eventDesc}>
                {convertTime(time)} | {previewText}
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
          </>*/}
    </>


  );
}

const styles = StyleSheet.create({
  eventContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowOffset: {height: 5, width: 5},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 8,
    height: 100,
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
    fontSize: 22,
  },
  eventDesc: {
    fontSize: 18,
    color: summitBlue,
  },
});