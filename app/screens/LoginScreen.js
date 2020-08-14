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
import auth from '@react-native-firebase/auth';
import logo from '../assets/logo.png';
import {summitBlue} from '../assets/colors';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  useEffect(() => {
    if (email && password) {
      setIsReadyToSubmit(true);
    } else {
      setIsReadyToSubmit(false);
    }
  }, [email, password]);

  const handleLogIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      //await Firebase.firestore().collection('users').doc(`${email}`).get().catch();
    } catch (error) {
      Alert.alert('Error', 'Invalid username or password. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Summit College</Text>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.loginText}>Login to your account</Text>
          </View>
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
          </View>
          <View style={styles.buttonContainer}>
            {!isReadyToSubmit && (
              <TouchableOpacity style={styles.createAccountButton}>
                <Text style={styles.createAccountButtonText}>LOGIN</Text>
              </TouchableOpacity>
            )}
            {isReadyToSubmit && (
              <TouchableOpacity
                style={styles.createAccountButtonActive}
                onPress={() => handleLogIn()}>
                <Text style={styles.createAccountButtonTextActive}>LOGIN</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.loginButtonTouchable}
              onPress={() => navigation.navigate('Sign Up')}>
              <Text style={styles.loginButton}>SIGN UP</Text>
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
  loginText: {
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
