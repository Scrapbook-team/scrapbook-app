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
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import {
    NavigationActions,
} from 'react-navigation';

import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@exponent/vector-icons';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';
import dateutil from 'dateutil';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class MomentList extends React.Component {

    static navigationOptions = {
        title: ({state}) => `${state.params.name}`,
        header: ({navigate, state}) => {
            let right = (
                <View style={{flexDirection: 'row'}}>
                    <TouchableHighlight
                        onPress={() => navigate('NewMoment', {groupId: state.params.groupId, name: state.params.name})}
                        style={{marginRight: 12}}
                        >
                        <Ionicons name="ios-add" size={48} />                   
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => navigate('GroupSettings', {groupId: state.params.groupId, name: state.params.name})}
                        style={{marginRight: 12}}
                        >
                        <Ionicons name="ios-settings-outline" size={40} />                   
                    </TouchableHighlight>
                </View>
            );

            return {right};
        }
    };

    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows([]),
            loaded: false,
            settingsVisible: false,
        };
    }

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
                            this.getMoments();
                    });
                }
            });
    }


    /*
     * Get moments for a group.
     */
    getMoments() {
        ScrapbookApi.getMoments(this.state.token, this.props.navigation.state.params.groupId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                moments = r;
                console.log(moments);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(moments),
                    loaded: true,
                });
            })
            .catch(e => console.log(e));
    }

    navigateToChat = (momentId, title) => {
        const {params} = this.props.navigation.state;
        const resetAction = NavigationActions.reset({
            index: 3,
            actions: [
                NavigationActions.navigate({ routeName: 'GroupList' }),
                NavigationActions.navigate({ routeName: 'MomentList', params: { groupId: params.groupId, name: params.name }}),
                NavigationActions.navigate({ routeName: 'Moment', params: {groupId: params.groupId, name: params.name, momentId: momentId, title: title}}),
                NavigationActions.navigate({ routeName: 'Chat', params: {groupId: params.groupId, name: params.name, momentId: momentId, title: title}}),
            ]
        });

        this.props.navigation.dispatch(resetAction);
    }

    _renderMomentListItem(data) {
            return (
                 <View>
                    <TouchableHighlight style={styles.container}
                        onPress={() => {this.props.navigation.navigate('Moment', {
                            groupId: this.props.navigation.state.params.groupId, 
                            name: this.props.navigation.state.params.name,
                            momentId: data._id,
                            title: data.title,
                        })}}
                        >
                        <View style={styles.thumbnails}>
                        { data.photos[0] &&
                            <Image
                                style={{width: width/3, height: width/3}}
                                source={{uri: data.photos[0].photo.urls[0]}}
                            />
                        }
                        { data.photos[1] &&
                            <Image
                                style={{width: width/3, height: width/3}}
                                source={{uri: data.photos[1].photo.urls[0]}}
                            />
                        }
                        { data.photos[2] &&
                            <Image
                                style={{width: width/3, height: width/3}}
                                source={{uri: data.photos[2].photo.urls[0]}}
                            />
                        }
                        </View>
                    </TouchableHighlight>
                    <View style={styles.momentBar}>
                        <View>
                            <Text style={styles.title}>
                                {`${data.title}`}
                            </Text>
                            <Text style={styles.date}>
                                {`${dateutil.format(new Date(data.createdDate), 'F jS, Y')}`}
                            </Text>
                        </View>
                        <View style={styles.momentButtons}>
                            <TouchableHighlight
                                style={{marginRight: 12}}
                                onPress={() => ScrapbookApi.sendMemory(this.state.token, data._id)}
                                >
                                <Ionicons name="ios-send-outline" size={44} />                   
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={{marginRight: 12}}
                                onPress={() => this.navigateToChat(data._id, data.title)}
                                >
                                <Ionicons name="ios-chatbubbles-outline" size={40} />                   
                            </TouchableHighlight>
                            <TouchableHighlight>
                                <Ionicons name="ios-more-outline" size={40} />                   
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
        );
    }

    render() {
        const loaded = this.state.loaded;
        if (loaded) console.log('Loaded');
        return (
            <View style={styles.container}>
            { loaded &&
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderMomentListItem.bind(this)}
                    enableEmptySections={true}
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
    thumbnails: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#eee',
    },
    title: {
        fontSize: 20,
        marginLeft: 12,
    },
    date: {
        fontSize: 12,
        marginLeft: 12,
    },
    momentBar: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    momentButtons: {
        flexDirection: 'row',
        marginRight: 20,
    },
});
