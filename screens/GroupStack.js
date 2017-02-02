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

import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';
import Chat from './Chat';
import Photos from './Photos';



class GroupList extends React.Component {
    
    static navigationOptions = {
        title: 'Scrapbook',
        drawer: () => ({
            label: 'Groups',
        }),
    }
    

    constructor() {
        super();

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows([{name:'', descriptinon: ''}]),
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (!token) this.props.navigation.navigate('Login');
                this.setState({token});
                console.log(this.state.token);

                AsyncStorage.getItem('Scrapbook:UserId')
                    .then(userId => {
                        this.setState({userId});
                        console.log(this.state.userId);
                        this.getGroups();
                });
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
                    dataSource: this.state.dataSource.cloneWithRows(groups)
                });
                console.log('Hello!');
                console.log('Groups: ' + newData);
            })
            .catch(e => console.log(e));
    }

    _renderGroupListItem(data) {
        return ( 
            <TouchableHighlight style={styles.container}
                //onPress={() => navigation.navigate('Chat', {id: this.props.id, name: this.props.name})}
                onPress={this._openChat.bind(this, data.id, data.name)}
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

    _openChat(id, name) {
        this.props.navigation.navigate('Chat', {id, name});
    }


    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderGroupListItem.bind(this)}
                />
            </View>
        );
    }

    
}

const GroupStack = StackNavigator({
    GroupList: {
        screen: GroupList,
        navigationOptions: {
            title: 'Scrapbook',
            drawer: () => ({
                label: 'Groups',
            }),
        }
    },
    Chat: {
        screen: Chat,
    },
    Photos: {
        screen: Photos,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default GroupStack;
