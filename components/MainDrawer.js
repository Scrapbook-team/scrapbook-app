import { DrawerNavigator } from 'react-navigation';
import GroupStack from '../screens/GroupStack';
import Login from '../screens/Login';

export const MainDrawer = DrawerNavigator({
    GroupStack: {
        screen: GroupStack,
    },
    Login: {
        screen: Login,
    },
});
