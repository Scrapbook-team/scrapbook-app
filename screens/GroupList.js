import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
} from 'react-native';
import {
    StackNavigation,
    DrawerNavigation,
    DrawerNavigationItem,
} from '@exponent/ex-navigation';

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

import GroupDrawer from '../components/GroupDrawer';

export default class GroupList extends React.Component {
    
    static navigationOptions = {
        title: 'Scrapbook',
        drawer: () => ({
            label: 'Groups',
        }),
    }

    constructor() {
        super();
        console.log('Hi');
    }


    componentDidMount() {
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (token) {
                    console.log(token);
                }
                else {
                    navigate('Login');
                }
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text> Group List </Text>
            </View>
        );
    }

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});
