import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ListView,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';
import Exponent, {
  Notifications,
} from 'exponent';
import {
    NavigationActions,
} from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';


export default class GroupList extends React.Component {

    static navigationOptions = {
        title: 'Scrapbook',
        drawer: () => ({
            label: 'Groups',
        }),
    }


    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows([]),
            loaded: false,
        };
    }

    componentWillMount() {
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = (notification) => {

        if (notification.origin === 'selected' || notification.origin === 'received') {
            if (notification.data.momentId) {

                const data = notification.data;
                const resetAction = NavigationActions.reset({
                    index: 2,
                    actions: [
                        NavigationActions.navigate({ routeName: 'GroupList' }),
                        NavigationActions.navigate({ routeName: 'MomentList', params: { groupId: data.groupId, name: data.name }}),
                        NavigationActions.navigate({ routeName: 'Moment', params: {groupId: data.groupId, name: data.name, momentId: data.momentId, title: data.title}}),
                    ]
                });

                this.props.navigation.dispatch(resetAction);
            }
        }
    };

    componentDidMount() {
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (!token) {
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({token});
                    console.log(this.state.token);

                    AsyncStorage.getItem('Scrapbook:UserId')
                        .then(userId => {
                            this.setState({userId});
                            console.log(this.state.userId);
                            this.getGroups();
                    });
                }
            });
    }


    /*
     * Get groups for a user.
     */
    getGroups() {
        ScrapbookApi.getGroups(this.state.token, this.state.userId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                groups = r;
                console.log(groups);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(groups),
                    loaded: true,
                });
            })
            .catch(e => console.log(e));
    }

    _renderGroupListItem(data) {
        return (
            <TouchableHighlight style={styles.container}
                //onPress={() => navigation.navigate('Chat', {id: this.props.id, name: this.props.name})}
                onPress={this._openChat.bind(this, data._id, data.name)}
                >
                <View>
                    <Text style={styles.name}>
                        {`${data.name}`}
                    </Text>
                    <Text style={styles.description}>
                        {`${data.description}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _openChat(groupId, name) {
        this.props.navigation.navigate('MomentList', {groupId, name});
    }


    render() {
        const loaded = this.state.loaded;
        return (
            <View style={styles.container}>
            { loaded &&
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderGroupListItem.bind(this)}
                />
            }
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
});
