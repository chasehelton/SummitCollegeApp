import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Header from '../components/Header';
global.Buffer = global.Buffer || require('buffer').Buffer

export default function ResourcesScreen() {
  const cheerio = require("cheerio");
  const axios = require("axios");

  const podcastUrl = 'https://anchor.fm/summitcollege';


  function getPodcastTitle() {
    var podcastTitle = "before axios";

    // axios.get(<link>) returns a Promise, which either resolves (success callback)
    // or rejects (failure callback).
    // To get the resolve, use .then(). To get the reject, use .catch()
    // Check out these videos for more info:
    // Using axios / cheerio: https://www.youtube.com/watch?v=XX8Q_39mue4&t=325s
    // Javascript Promises: https://www.youtube.com/watch?v=DHvZLI7Db8E
    axios.get(podcastUrl).then((response) => {
        const $ = cheerio.load(response.data);
        // This isn't the actual way to get the title, it was just easier to test with this.
        podcastTitle = $("div.app").find("a").text();
      }).catch((error) => {
        podcastTitle = "error!";
      });

    // I am wondering if this function is returning before the axios.get() resolves.
    return podcastTitle;
  }

  async function axiosTest() {
      try {
        const {data:response} = axios.get(podcastUrl); //use data destructuring to get data from the promise object
        return response;
        return "shit";
      }

      catch (error) {
        console.log(error);
      }
    }

  function axiosTest2() {
    return axios.get(podcastUrl).then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      return response.data
    })
  }

  const toprint = axiosTest2()
    .then(data => {
      response.json({ message: 'Request received!', data })
    })
    .catch(err => console.log(err))

  return (
    <View style={styles.container}>
      <Header title={'Resources'} backButton={false} />
      <View style={styles.nonHeader}>
        <Text style={styles.comingSoonText}>Coming Soon.</Text>
        <Text style={styles.comingSoonSubtext}>The Resources feature will arrive by Christmas.</Text>
        <Text style={styles.comingSoonSubtext}>Podcast title: "{getPodcastTitle()}"</Text>
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
