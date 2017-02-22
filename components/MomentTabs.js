import { Platform, Button } from 'react-native';
import React from 'react';
import { TabNavigator } from 'react-navigation';
import Moment from '../screens/Moment';
import Chat from '../screens/Chat';

export const MomentTabs = TabNavigator({
    Moment: {
        screen: Moment,
    },
    Chat: {
        screen: Chat,
    },
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        visible: false,
  },
});

