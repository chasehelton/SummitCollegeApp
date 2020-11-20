import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

export default function Header({navigation, title, backButton, isAdmin}) {
  return (
    <View style={[styles.headerContainer, isAdmin ? styles.grayBackground : styles.whiteBackground]}>
      {backButton && (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="keyboard-arrow-left" type="material" size={35} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.empty} />
        </>
      )}
      {!backButton && (
        <>
          <Text style={styles.empty} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.empty} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
  },

  backButton: {
    marginTop: 45,
    flex: 1,
    //justifyContent: 'flex-start',
    //alignItems: 'flex-start',
  },
  title: {
    flex: 4,
    marginTop: 45,
    marginBottom: 25,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
  },
  empty: {
    flex: 1,
  },
});
