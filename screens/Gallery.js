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


export default class Gallery extends React.Component {
    
    static navigationOptions = {
        title: 'Gallery',
        tabBar: {
            label: 'Gallery',
        },
    }
    
    render() {
        return (
            <View style={styles.container}>
              <Text>
                 Gallery
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
