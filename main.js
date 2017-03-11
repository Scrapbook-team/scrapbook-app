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
import AddContacts from './screens/AddContacts';
import { GroupStack } from './components/GroupStack';

const ScrapbookApp = StackNavigator({
    Home: { screen: GroupStack },
    Login: {screen: Login },
    Register: {screen: Register },
    AddContacts: {screen: AddContacts},
},
{
    headerMode: 'none',
});


Exponent.registerRootComponent(ScrapbookApp);
