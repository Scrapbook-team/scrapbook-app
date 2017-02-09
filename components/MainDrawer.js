import { DrawerNavigator } from 'react-navigation';
import { GroupStack } from './GroupStack';
import Settings from '../screens/Settings';
import Login from '../screens/Login';

export const MainDrawer = DrawerNavigator({
    GroupStack: {
        screen: GroupStack,
    },
    Settings: {
        screen: Settings,
    },
});
