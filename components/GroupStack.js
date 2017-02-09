import { StackNavigator } from 'react-navigation';
import GroupList from '../screens/GroupList';
import Chat from '../screens/Chat';
import { PhotoTabs } from './PhotoTabs';
import NewGroup from '../screens/NewGroup';


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
    Chat: {
        screen: Chat,
    },
    PhotoTabs: {
        screen: PhotoTabs,
    },
});
