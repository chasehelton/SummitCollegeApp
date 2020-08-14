import React, {useState, useEffect} from 'react';
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
  const [school, setSchool] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  useEffect(() => {
    if (first && last && email && password && school && gradYear) {
      setIsReadyToSubmit(true);
    } else {
      setIsReadyToSubmit(false);
    }
  }, [first, last, email, password, school, gradYear]);

  const handleSignUp = () => {
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
  };

  const createUserData = async () => {
    await firestore()
      .collection('users')
      .add({
        first,
        last,
        email,
        school,
        gradYear,
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
            <Text style={styles.title}>Summit College</Text>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.createText}>Create your account</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="First Name"
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
              placeholder="Password"
              onChangeText={(val) => setPassword(val)}
              autoCapitalize="none"
              secureTextEntry
              style={styles.textInput}
            />
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                style={styles.schoolPicker}
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
                style={styles.gradPicker}
                selectedValue={gradYear}
                onValueChange={(itemValue) => setGradYear(itemValue)}>
                <Picker.Item label="Graduation Year" value="" />
                <Picker.Item label="2020" value="2020" />
                <Picker.Item label="2021" value="2021" />
                <Picker.Item label="2022" value="2022" />
                <Picker.Item label="2023" value="2023" />
                <Picker.Item label="2024" value="2024" />
                {/* Eventually we should add a function that calculates the next 5 years from the current year */}
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
    fontSize: 24,
    color: summitBlue,
    alignSelf: 'center',
    marginTop: 25,
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 0,
    display: 'flex',
    // flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolPicker: {
    width: 150,
    height: 100,
    marginHorizontal: 10,
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
  },
  gradPicker: {
    width: 150,
    height: 100,
    marginHorizontal: 10,
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
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
    fontSize: 44,
    fontWeight: '300',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  textInput: {
    width: 350,
    height: 40,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    fontSize: 18,
    marginVertical: 5,
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
  },
  loginButton: {
    color: 'black',
    fontWeight: '700',
  },
});
