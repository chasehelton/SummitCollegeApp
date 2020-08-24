import React, {useState} from 'react';
import {
  Alert,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  StyleSheet,
} from 'react-native';
import {summitBlue} from '../assets/colors';
import auth from '@react-native-firebase/auth';

export default function ForgotPasswordScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');

  const handleSubmit = () => {
    // No checks for 'valid' email
    if (email && email2 && email === email2) {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert('Email Sent!');
          setEmail('');
          setEmail2('');
          navigation.navigate('Login');
        });
    } else if (!email || !email2) {
      Alert.alert('Please fill in both input fields.');
    } else {
      Alert.alert('Emails do not match.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Reset Password</Text>
        <Text style={styles.subText}>
          Enter your email below, and we will send you a link to reset your
          password.
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            onChangeText={(val) => setEmail(val)}
            autoCapitalize="none"
            style={styles.textInput}
          />
          <TextInput
            placeholder="Confirm Email"
            onChangeText={(val) => setEmail2(val)}
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmit()}>
          <Text style={styles.submitButtonText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 44,
    marginTop: 50,
    fontWeight: '300',
  },
  subText: {
    color: summitBlue,
    fontSize: 16,
    width: 300,
    textAlign: 'center',
    marginVertical: 25,
  },
  inputContainer: {
    display: 'flex',
  },
  textInput: {
    width: 350,
    height: 40,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    fontSize: 18,
    marginVertical: 5,
  },
  submitButton: {
    marginVertical: 25,
    backgroundColor: summitBlue,
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '800',
  },
});
