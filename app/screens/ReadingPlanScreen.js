import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  LogBox,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Header from '../components/Header';
import {summitBlue} from '../assets/colors';
import axios from 'axios';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function ReadingPlanScreen({route, navigation}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  var {readingPlanObject, header} = route.params;
  var {memText, header} = route.params;

  const [userType, setUserType] = React.useState('');


  const nth = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  const months = ["January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October", "November", "December"];

  const printDate = () => {
    var tempDate = readingPlanObject.data.date;
    var dateArray = tempDate.split('-');
    var year = dateArray[0];
    var month = dateArray[1];
    var day = dateArray[2];

    return months[month - 1] + ' ' + parseInt(day) + nth(day) + ', ' + year;
  };

  return (
    <View contentContainerStyle={styles.container}>
      <Header navigation={navigation} title={header} backButton={true} />
      <View style={styles.dateStripe}>
                <Text style={styles.dateText}>{printDate()}</Text>
              </View>

      <View style={styles.body}>


        <Text style={styles.subheader}>{"READ"}</Text>
        <TouchableOpacity
          style={[styles.itemContainer, styles.readingPlanContainer]}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.readingPlanText}>{readingPlanObject.data.reading}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.subheader}>{"MEDITATE"}</Text>
        <TouchableOpacity
          style={[styles.itemContainer, styles.readingPlanContainer]}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.readingPlanText}>{readingPlanObject.data.meditation}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.subheader}>{"MEMORIZE"}</Text>
        <TouchableOpacity
          style={[styles.itemContainer, styles.readingPlanContainer]}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.readingPlanText}>{memText}</Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
  },
  headerContainer: {
    backgroundColor: '#eee',
    display: 'flex',
    flexDirection: 'row',
  },
  body: {
    backgroundColor: '#eee',
    height: '100%',
    paddingHorizontal: 25,
  },
  dateStripe: {
    backgroundColor: summitBlue,
    width: '100%',
    height: 60,
    justifyContent: 'center',
        alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
    marginTop: 30,
  },
  readingPlanText: {
    fontSize: 16,
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
  readingPlanContainer: {
    paddingVertical: 20,
    height: 70,
  },
  infoContainer: {
    textAlign: 'left',
    width: 275,
  },

  backButton: {
    marginTop: 37,
    marginStart: 15,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  userList: {
    height: '100%',
    backgroundColor: 'white',
  },
  title: {
    flex: 4,
    marginTop: 40,
    marginBottom: 25,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',

  },
  empty: {
    flex: 1,
  },
  profilePic: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 8,
  },
  personName: {
    color: '#3ab5e6',
    fontSize: 32,
    alignSelf: 'center',
    marginBottom: 10,
    fontFamily: 'OpenSans-Regular',
  },
});
