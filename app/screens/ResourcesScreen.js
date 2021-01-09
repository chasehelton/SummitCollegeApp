import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Header from '../components/Header';
import cheerio from 'cheerio';
import axios from 'axios';

const podcastUrl = 'https://anchor.fm/summitcollege';
// const getData = async () => {
//   let podcastTitle = 'before';
//   await axios
//     .get(podcastUrl)
//     .then((response) => {
//       const che = cheerio.load(response.data);
//       console.log(che);
//       podcastTitle = che('div.app').find('a').text();
//     })
//     .catch((error) => {
//       podcastTitle = 'error!';
//     });
//   return podcastTitle;
// };

export default function ResourcesScreen() {
  //onsole.log(getData());
  return (
    <View style={styles.container}>
      <Header title={'Resources'} backButton={false} />
      <View style={styles.nonHeader}>
        <Text style={styles.comingSoonText}>Resources Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 48,
  },
  nonHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 20,
  },
  comingSoonSubtext: {
    fontSize: 12,
  },
});
