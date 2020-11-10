import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import logo from '../assets/logo.png';
import {summitBlue} from '../assets/colors';

export default function SignUpScreen({navigation}) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [gender, setGender] = useState('');
  const [school, setSchool] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [years, setYears] = useState([]);

  useLayoutEffect(() => {
    // For-loop saving the next X amount of years for the graduation year picker
    const upcomingYears = () => {
      let date = new Date().getFullYear();
      let theseYears = [];
      for (let i = 0; i < 7; i++) {
        let year = date + i;
        let stringYear = year.toString();
        theseYears[i] = stringYear;
      }
      return theseYears;
    };
    setYears(upcomingYears);
  }, []);

  useEffect(() => {
    if (first && last && email && password && confirmationPassword && school && gradYear) {
      setIsReadyToSubmit(true);
    } else {
      setIsReadyToSubmit(false);
    }
  }, [first, last, email, password, confirmationPassword, school, gradYear]);

  const handleSignUp = () => {
    if (password != confirmationPassword) {
      // tell the user the password is not correct
      Alert.alert('Your passwords must match.');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        await createUserData().then(
          console.log('User account created & signed in!'),
        );
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Sorry, this email address is already in use.');
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Sorry, this is an invalid email address.');
          console.log('That email address is invalid!');
        }
        console.error(error);
      });

  // TODO: also add user to the database!!!

  };

  const createUserData = async () => {
    await firestore()
      .collection('users')
      .add({
        firstName: first,
        lastName: last,
        email: email,
        school: school,
        gradYear: gradYear,
        type: 'student',
        banned: false,
        displayName: first + ' ' + last,
      })
      .then(console.log('Success'))
      .catch((error) => console.log(error));
  };

  // HANDLE ERRORS

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Summit College</Text>
            <Text style={styles.createText}>Create your account</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="First Name"
              placeholderStyle={styles.textInput}
              onChangeText={(val) => setFirst(val)}
              autoCapitalize="words"
              style={styles.textInput}
            />
            <TextInput
              placeholder="Last Name"
              onChangeText={(val) => setLast(val)}
              autoCapitalize="words"
              style={styles.textInput}
            />
            <TextInput
              placeholder="Email"
              onChangeText={(val) => setEmail(val)}
              autoCapitalize="none"
              style={styles.textInput}
            />
            <TextInput
              placeholder="Create Password"
              onChangeText={(val) => setPassword(val)}
              autoCapitalize="none"
              secureTextEntry
              style={styles.textInput}
            />
            <TextInput
              placeholder="Confirm Password"
              onChangeText={(val) => setConfirmationPassword(val)}
              autoCapitalize="none"
              secureTextEntry
              style={styles.textInput}
            />
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                style={styles.pickerStyle}
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}>
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
              <Picker
                mode="dropdown"
                style={styles.pickerStyle}
                selectedValue={school}
                onValueChange={(itemValue) => setSchool(itemValue)}>
                <Picker.Item label="School" value="" />
                <Picker.Item label="NCSU" value="NCSU" />
                <Picker.Item label="UNC" value="UNC" />
                <Picker.Item label="NCCU" value="NCCU" />
                <Picker.Item label="Meredith" value="Meredith" />
              </Picker>
              <Picker
                mode="dropdown"
                style={styles.pickerStyle}
                selectedValue={gradYear}
                onValueChange={(itemValue) => setGradYear(itemValue)}>
                <Picker.Item label="Year" value="" />
                {years.map((year, index) => (
                  <Picker.Item key={index} label={year} value={year} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {/* Conditionally render a gray button when the text fields aren't entered and a blue button once they are all met */}
            {!isReadyToSubmit && (
              <TouchableOpacity style={styles.createAccountButton}>
                <Text style={styles.createAccountButtonText}>
                  CREATE ACCOUNT
                </Text>
              </TouchableOpacity>
            )}
            {isReadyToSubmit && (
              <TouchableOpacity
                style={styles.createAccountButtonActive}
                onPress={() => handleSignUp()}>
                <Text style={styles.createAccountButtonTextActive}>
                  CREATE ACCOUNT
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.loginButtonTouchable}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButton}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  createText: {
    fontSize: 14,
    color: summitBlue,
    alignSelf: 'center',
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  inputContainer: {
    marginTop: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pickerStyle: {
    height: 100,
    flex: 1,
    //marginHorizontal: 10,
    transform: [{scaleX: 0.9}, {scaleY: 0.9}],
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  loginButtonTouchable: {
    marginTop: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    marginVertical: 15,
    fontFamily: 'OpenSans-Regular',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  textInput: {
    width: 350,
    //height: 40,
    borderBottomColor: '#9F9F9F',
    color: '#9F9F9F',
    borderBottomWidth: 1,
    fontSize: 14,
    //marginVertical: 5,
    fontFamily: 'OpenSans-Light',
    textAlignVertical: 'bottom',
    paddingTop: 25,
  },
  createAccountButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 8,
  },
  createAccountButtonText: {
    color: 'white',
    fontWeight: '800',
    fontFamily: 'OpenSans-Bold',
  },
  createAccountButtonActive: {
    backgroundColor: summitBlue,
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 8,
  },
  createAccountButtonTextActive: {
    color: 'white',
    fontWeight: '800',
    fontFamily: 'OpenSans-Bold',
  },
  loginButton: {
    color: 'black',
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
  },
});
