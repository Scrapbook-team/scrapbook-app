import { DrawerNavigator } from 'react-navigation';
import GroupList from '../screens/GroupList';

export const MainDrawer = DrawerNavigator({
    GroupList: {
        screen: GroupList,
    },
});
