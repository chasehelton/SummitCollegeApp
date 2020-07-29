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

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      //await Firebase.firestore().collection('users').doc(`${email}`).get().catch();
    } catch (error) {
      Alert.alert('Error', 'Invalid username or password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
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
        <TouchableOpacity onPress={() => handleLogIn()}>
          <Text style={styles.button}>Log In</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
          <Text style={styles.button}>Sign Up Here</Text>
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
  signupContainer: {
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
