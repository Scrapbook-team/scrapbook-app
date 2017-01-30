import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

export default class GroupList extends React.Component {
    
    constructor(props) {
        super(props);
    }

    static route = {
        navigationBar: {
            visible: false,
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
        justifyContent: 'center',
    },
});
