/* eslint-disable curly */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Header from '../components/Header';
import {summitBlue} from '../assets/colors';
import {Icon} from 'react-native-elements';
import AppContext from '../components/AppContext.js';

export default function AnnouncementScreen({route, navigation}) {
  const {announcement} = route.params;
  const context = React.useContext(AppContext);
  const formatDates = (startDate, endDate) => {
    var startMonth = getMonth(startDate);
    var endMonth = getMonth(endDate);
    var startDay = getDay(startDate);
    var endDay = getDay(endDate);
    var date =  startMonth + ' ' + startDay;

    if (startMonth == endMonth) {
      if (startDay == endDay) return date;
      else return date + '-' + endDay;
    }
    else {
      return date + '-' + endMonth + ' ' + endDay;
    }
  };

  const getMonth = (date) => {
    let month = '';
    let m = new Date(date).getMonth() + 1;
    if (m === 1) month = 'January';
    else if (m === 2) month = 'February';
    else if (m === 3) month = 'March';
    else if (m === 4) month = 'April';
    else if (m === 5) month = 'May';
    else if (m === 6) month = 'June';
    else if (m === 7) month = 'July';
    else if (m === 8) month = 'August';
    else if (m === 9) month = 'September';
    else if (m === 10) month = 'October';
    else if (m === 11) month = 'November';
    else if (m === 12) month = 'December';
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
      <Header
        title={'Announcements'}
        navigation={navigation}
        backButton={true}
      />
      <Text style={styles.subheader}>{'ANNOUNCEMENT'}</Text>
      <View style={styles.announcementContainer}>
        <Text style={styles.announcementTitle}>{announcement.data.title}</Text>
        <View style={styles.infoContainer} key="descriptionView">
          <Icon
            name="edit"
            type="feather"
            color={summitBlue}
            style={styles.announcementIcon}
            size={35}
          />
          <Text style={styles.announcementText}>{announcement.data.body}</Text>
        </View>
        
      </View>
      <View styles={styles.empty}></View>
    </>
  );
}

const styles = StyleSheet.create({
  announcementContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 15,
    marginHorizontal: 20,
    shadowOffset: {height: 5, width: 5},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 8,
  },
  subheader: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: summitBlue,
    marginTop: 30,
    letterSpacing: 0.5,
    marginLeft: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  announcementText: {
    fontSize: 16,
    //fontWeight: '300',
    fontFamily: 'OpenSans-Regular',
    color: 'black',
    flex: 5,
    //borderWidth: 2,
    paddingLeft: 20,
    textAlignVertical: 'center',
  },
  announcementIcon: {
    flex: 1,
  },
  nonDescRow: {
    height: 35,
  },
  empty: {
    flex: 1,
  },
  infoContainer: {
    //textAlign: 'left',
    //width: 250,
    width: '100%',
    minHeight: 35,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    //paddingVertical: 50,
  },
  announcementTitle: {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 5,
    fontFamily: 'OpenSans-Bold',
  },
});
