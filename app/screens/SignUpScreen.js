import React, {useState, useEffect} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import logo from '../assets/logo.png';
import {summitBlue} from '../assets/colors';

export default function SignUpScreen({navigation}) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  useEffect(() => {
    if (first && last && email && password) {
      setIsReadyToSubmit(true);
    }
  }, [first, last, email, password]);

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Summit College</Text>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.createText}>Create your account</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="First Name"
          onChangeText={(val) => setFirst(val)}
          autoCapitalize="none"
          style={styles.textInput}
        />
        <TextInput
          placeholder="Last Name"
          onChangeText={(val) => setLast(val)}
          autoCapitalize="none"
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
      </View>
      {/* Conditionally render a gray button when the text fields aren't entered and a blue button once they are all met */}
      {!isReadyToSubmit && (
        <TouchableOpacity style={styles.createAccountButton}>
          <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButton}>LOGIN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  headerContainer: {
    display: 'flex',
  },
  createText: {
    fontSize: 24,
    color: summitBlue,
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
