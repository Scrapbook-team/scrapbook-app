import { StackNavigator } from 'react-navigation';
import GroupList from '../screens/GroupList';
import MomentList from '../screens/MomentList';
import Moment from '../screens/Moment';
import NewMoment from '../screens/NewMoment';
import Chat from '../screens/Chat';
import GroupSettings from '../screens/GroupSettings';
import Settings from '../screens/Settings';
import { PhotoTabs } from './PhotoTabs';
import NewGroup from '../screens/NewGroup';

>>>>>>> 98d2c1365fcf7e5e7fe68db09766edc3417196ca

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
    NewGroup: {
        screen: NewGroup,
    },
    MomentList: {
        screen: MomentList,
    },
    Moment: {
        screen: Moment,
    },
    NewMoment: {
        screen: NewMoment,
    }
    Chat: {
        screen: Chat,
    },
    GroupSettings: {
        screen: GroupSettings,
    },
    Settings: {
        screen: Settings,
    },
}, {
    initialRouteName: 'GroupList',
    headerMode: 'screen',   
});
