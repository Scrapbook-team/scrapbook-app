import { Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Gallery from '../screens/Gallery';
import Albums from '../screens/Albums';
import Scrapbook from '../screens/Scrapbook';

export const PhotoTabs = TabNavigator({
    Gallery: {
        screen: Gallery,
    },
    Albums: {
        screen: Albums,
    },
    Scrapbook: {
        screen: Scrapbook,
    },
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: Platform.OS === 'ios' ? '#e91e63' : '#fff',
  },
});
