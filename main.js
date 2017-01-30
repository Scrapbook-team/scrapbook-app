import Exponent from 'exponent';
import React from 'react';
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';



class AppContainer extends React.Component {


    componentDidMount() {
        console.log('yolo');
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (token) {
                    console.log(token);
                }
                else {
                    console.log(this.state.initialRoute);
                    this.props.navigator.push(Router.getRoute('login'));
                }
            });
    }

    render() {
        return (
            <NavigationProvider router={Router}>
                <StackNavigation initialRoute={Router.getRoute('groupList')} />
            </NavigationProvider>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

Exponent.registerRootComponent(AppContainer);
