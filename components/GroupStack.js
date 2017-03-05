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


export const GroupStack = StackNavigator({
    GroupList: {
        screen: GroupList,
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
    },
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
