import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DemoStudentsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Students</Text>
        <TextInput placeholder="Search" style={styles.input} />
      </View>
      <ScrollView contentContainerStyle={styles.studentListContainer}>
        {/* FIND OUT WHY IT AUTOMATICALLY SCROLLS TO TOP */}
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Chase Helton</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Elise Harford</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Mara Harris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Chase Helton</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Elise Harford</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Mara Harris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Chase Helton</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Elise Harford</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Mara Harris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Chase Helton</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Elise Harford</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.studentContainer}>
          <Text style={styles.studentName}>Mara Harris</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    backgroundColor: '#ddd',
  },
  title: {
    fontSize: 24,
    padding: 10,
  },
  input: {
    width: '85%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  studentListContainer: {
    marginTop: 20,
    display: 'flex',
    width: '80%',
    height: '100%',
  },
  studentContainer: {
    backgroundColor: '#ddd',
    marginVertical: 10,
    padding: 10,
    width: '100%',
    borderRadius: 8,
    marginLeft: 25,
  },
  studentName: {
    fontSize: 18,
  },
});
