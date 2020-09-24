import React from 'react';
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

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function ReadingPlanScreen({route, navigation}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  var {readingPlanObject, header} = route.params;

  const [userType, setUserType] = React.useState('');

  /*React.useEffect(() => {
    async function setInitialType() {
      setUserType(person.data.type);
    }

    if (!isLoaded) {
      setInitialType();
      setIsLoaded(true);
    }
  }, [isLoaded, person, userType]);*/

  return (
    <View contentContainerStyle={styles.container}>
      <Header navigation={navigation} title={header} backButton={true} />

      <View style={styles.body}>
        <Text style={styles.subheader}>{"READ"}</Text>
        <TouchableOpacity
          style={[styles.itemContainer, styles.readingPlanContainer]}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.readingPlanText}>{readingPlanObject.data.reading}</Text>
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
    backgroundColor: 'white',
    height: '100%',
  },
  subheader: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: summitBlue,
    marginTop: 30,
  },
  readingPlanText: {
    fontSize: 20,
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
  personInfo: {
    //color: '#3ab5e6',
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 5,
    fontFamily: 'OpenSans-Regular',
  },
  infoPanel: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  managePanel: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueButton: {
    backgroundColor: '#3ab5e6',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 30,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold',
  },
  blackButtonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  whiteButton: {
    backgroundColor: '#fff',
    width: '85%',
    alignSelf: 'center',
    borderWidth: 1.3,
    borderColor: '#3939391A',
    paddingVertical: 8,
  },
});
