import { DrawerNavigator } from 'react-navigation';
import GroupStack from '../screens/GroupStack';
import MyPhotoStack from './MyPhotoStack';
import Settings from '../screens/Settings';
import Login from '../screens/Login';

export const MainDrawer = DrawerNavigator({
    GroupStack: {
        screen: GroupStack,
    },
    MyPhotoStack: {
        screen: MyPhotoStack,
        navigationOptions: {
            title: 'My Photos',
            drawer: () => ({
                label: 'My Photos',
            }),
        },
    },
    Settings: {
        screen: Settings,
    },
});
