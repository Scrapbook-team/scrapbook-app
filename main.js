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

import GroupList from './screens/GroupList';
import Login from './screens/Login';
import { MainDrawer } from './components/MainDrawer';

const ScrapbookApp = StackNavigator({
    Home: { screen: MainDrawer },
    Login: {screen: Login },
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
