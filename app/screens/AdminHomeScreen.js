import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {summitBlue} from '../assets/colors';

// define constants for users
const TYPE_STUDENT = 1;
const TYPE_LEADER = 2;
const TYPE_STAFF = 3;
const TYPE_DIRECTOR = 4;

export default function AdminHomeScreen({navigation, route}) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Admin</Text>
        <Text style={styles.text}>Who are you looking for?{'\n'}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Students',
                userType: TYPE_STUDENT,
                isAdmin: true,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Students</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Student Leaders',
                userType: TYPE_LEADER,
                isAdmin: true,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Student Leaders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Staff',
                userType: TYPE_STAFF,
                isAdmin: true,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Staff</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Admin', {
              screen: 'Directory',
              params: {
                header: 'Directors',
                userType: TYPE_DIRECTOR,
                isAdmin: true,
              },
            })
          }
          style={styles.blueButton}>
          <Text style={styles.buttonText}>Directors</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    width: 200,
  },
  headerContainer: {
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  header: {
    marginTop: 50,
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  text: {
    marginVertical: 25,
    fontSize: 20,
    fontWeight: '600',
    alignSelf: 'center',
    color: summitBlue,
    fontFamily: 'OpenSans-SemiBold',
  },
  blueButton: {
    backgroundColor: '#3ab5e6',
    marginVertical: 15,
    padding: 30,
    width: '80%',
    borderRadius: 8,
    elevation: 2, // Android
    shadowColor: 'rgba(0,0,0, .3)', // IOS
    shadowOffset: {height: 4, width: 4}, // IOS
    shadowOpacity: 0.2, // IOS
    shadowRadius: 0.5, //IOS
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
  },
});
