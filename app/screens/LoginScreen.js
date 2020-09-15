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
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Summit College</Text>
            <Text style={styles.loginText}>Login to your account</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholderStyle={styles.textInput}
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
            <TouchableOpacity
              style={styles.loginButtonTouchable}
              onPress={() => navigation.navigate('Forgot Password')}>
              <Text style={styles.blackTextButton}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            {!isReadyToSubmit && (
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>LOGIN</Text>
              </TouchableOpacity>
            )}
            {isReadyToSubmit && (
              <TouchableOpacity
                style={styles.loginButtonActive}
                onPress={() => handleLogIn()}>
                <Text style={styles.loginButtonTextActive}>LOGIN</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.loginButtonTouchable}
              onPress={() => navigation.navigate('Sign Up')}>
              <Text style={styles.blackTextButton}>CREATE AN ACCOUNT</Text>
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
    justifyContent: 'flex-start',
  },
  headerContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 20,
    color: summitBlue,
    alignSelf: 'center',
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  inputContainer: {
    marginVertical: 50,
    display: 'flex',
    // flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
  },
  loginButtonTouchable: {
    marginTop: 25,
  },
  title: {
    fontSize: 40,
    fontWeight: '300',
    marginVertical: 15,
    fontFamily: 'OpenSans-Regular',
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
    fontFamily: 'OpenSans-Regular',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '800',
    fontFamily: 'OpenSans-Bold',
  },
  loginButtonActive: {
    backgroundColor: summitBlue,
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 8,
  },
  loginButtonTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  blackTextButton: {
    color: 'black',
    fontWeight: '700',
    paddingHorizontal: 70,
    fontFamily: 'OpenSans-Bold',
  },
});
