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


export default class Chat extends React.Component {
    
    static navigationOptions = {
        title: ({state}) => `${state.params.name}`,
        header: ({navigate, state}) => {
            let right = (
                <Button
                    title='Photos'
                    onPress={() => navigate('PhotoTabs', {id: state.params.id, name: state.params.name})}
                />
            );

            return {right};
        }
    };


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