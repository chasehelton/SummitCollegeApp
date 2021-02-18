/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {summitBlue} from '../assets/colors';

export default function ChatGroupPreview({name, lastUpdated, photoURL, lastMessage, read}) {
  console.log('Read in preview: ' + read);

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
    timeValue += minutes < 10 ? ':0' + minutes : ':' + minutes;
    timeValue += hours >= 12 ? ' PM' : ' AM';
    return timeValue;
  };

  return (
    <>
      <View style={styles.photoContainer} key="photoView">
        <Image source = {{uri: photoURL}}
            style = {styles.roomPicture} />
      </View>
      <View style={styles.infoContainer} key="infoView">
        {read && (<Text numberOfLines={1} style={styles.groupName}>{name}</Text>)}
        {!read && (<Text numberOfLines={1} style={styles.groupNameUnread}>{name}</Text>)}
        <Text numberOfLines={1} style={styles.groupText}>
          {lastMessage}
        </Text>
      </View>

      <View style={styles.timeContainer} key="timeView">
        {!read && (
                <Icon
                  key="iconView"
                  name="stop-circle"
                  type="material"
                  color={summitBlue}
                  style={{marginRight: 5, paddingBottom: 3,}}
                  size={14}
                />
              )}
        <Text style={styles.lastUpdatedText}>{lastUpdated}</Text>
      </View>
      {/**/}
    </>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 15,
  },
  roomPicture: {
    width: 50,
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',

  },
  timeContainer: {
    //alignItems: 'center',
    //marginRight: 13,
    paddingTop: 5,
    flexDirection: "row",
    alignItems:'flex-end',
    justifyContent:'flex-end',
    flex: 2,
    //borderWidth: 0.5,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    paddingTop: 5,
  },
  groupNameUnread: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    paddingTop: 5,
  },
  groupText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: 'darkgray',
  },
  infoContainer: {
    textAlign: 'left',

    paddingRight: 15,
    flex: 5,
    //borderWidth: 0.5,
    //width: 250,
  },
  lastUpdatedText: {
    textAlign: 'right',
    fontFamily: 'OpenSans-Regular',

    fontSize: 14,
    color: 'darkgray',
    //paddingTop: 5,
    paddingRight: 25,

  },
});
