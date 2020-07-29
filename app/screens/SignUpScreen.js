import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
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
        <TouchableOpacity onPress={() => handleSignUp()}>
          <Text style={styles.button}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.loginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.button}>Login Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
    fontSize: 48,
  },
  textInput: {
    width: 200,
    height: 40,
    backgroundColor: '#ddd',
    padding: 12,
  },
  button: {
    color: 'blue',
  },
});
