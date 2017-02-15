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
import { StackNavigator } from 'react-navigation';
import {
  FontAwesome,
} from '@exponent/vector-icons';

import Login from './screens/Login';
import Register from './screens/Register';
import { MainDrawer } from './components/MainDrawer';

const ScrapbookApp = StackNavigator({
    Home: { screen: MainDrawer },
    Login: {screen: Login },
    Register: {screen: Register },
},
{
    headerMode: 'none',
});

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

Exponent.registerRootComponent(ScrapbookApp);
