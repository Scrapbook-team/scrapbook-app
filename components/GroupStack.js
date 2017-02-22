import { StackNavigator } from 'react-navigation';
import GroupList from '../screens/GroupList';
import MomentList from '../screens/MomentList';
import Moment from '../screens/Moment';
import Chat from '../screens/Chat';
import { PhotoTabs } from './PhotoTabs';

export const GroupStack = StackNavigator({
    GroupList: {
        screen: GroupList,
        navigationOptions: {
            title: 'Scrapbook',
            drawer: () => ({
                label: 'Groups',
            }),
        }
    },
    MomentList: {
        screen: MomentList,
    },
    Moment: {
        screen: Moment,
    },
    Chat: {
        screen: Chat,
    },
    PhotoTabs: {
        screen: PhotoTabs,
    },
}, {
    initialRouteName: 'GroupList',
    headerMode: 'screen',   
});
