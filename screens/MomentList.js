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
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';

import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

export default class MomentList extends React.Component {

    static navigationOptions = {
        title: ({state}) => `${state.params.name}`,
        header: ({navigate, state}) => {
            let right = (
                <Button
                    title='Photos'
                    onPress={() => navigate('PhotoTabs', {groupId: state.params.groupId, name: state.params.name})}
                />
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

    _renderMomentListItem(data) {
        console.log('Hello');
        return (
            <TouchableHighlight style={styles.container}
                onPress={() => {this.props.navigation.navigate('Moment', {
                    groupId: this.props.navigation.state.params.groupId, 
                    name: this.props.navigation.state.params.name,
                    momentId: data._id,
                    title: data.title,
                })}}
                >
                <View>
                { data.thumbnail &&
                    <Image
                        style={{width: 100, height: 100}}
                        source={{uri: data.thumbnail.urls[0]}}
                    />
                }
                    <Text style={styles.title}>
                        {`${data.title}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _openChat(groupId, name) {
        this.props.navigation.navigate('Chat', {groupId, name});
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
});