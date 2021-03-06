import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';


export default class Scrapbook extends React.Component {
     
    static navigationOptions = {
        title: 'Scrapbook',
        tabBar: {
            label: 'Scrapbook',
        },
    }

    render() {
        return (
            <View style={styles.container}>
              <Text>
                  Scrapbook
              </Text>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
});
