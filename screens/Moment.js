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


export default class Moment extends React.Component {

    static navigationOptions = {
        title: ({state}) => `${state.params.name}`,
        header: ({navigate, state}) => {
            let right = (
                <Button
                    title='Chat'
                    onPress={() => navigate('Chat', {
                        groupId: state.params.groupId, 
                        name: state.params.name, 
                        momentId: state.params.momentId, 
                        title: state.params.title
                    })}
                />
            );

            return {right};
        }
    }


    constructor(props) {
        super(props);

        console.log("Props");
        console.log(props);

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

                    AsyncStorage.getItem('Scrapbook:UserId')
                        .then(userId => {
                            this.setState({userId});
                            this.getMoment();
                    });
                }
            });
    }


    /*
     * Get moment.
     */
    getMoment() {
        ScrapbookApi.getMoment(this.state.token, this.props.navigation.state.params.momentId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                moment = r;

                var blocks = [];
                for (var i = 0; i < moment.photos.length; i++) {
                    blocks[moment.photos[i].position] = moment.photos[i];
                }
                for (var i = 0; i < moment.notes.length; i++) {
                    blocks[moment.notes[i].position] = moment.notes[i];
                }
                

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(blocks),
                    loaded: true,
                });
            })
            .catch(e => console.log(e));
    }

    _renderMomentListItem(data) {
        const photo = data.hasOwnProperty('photo');
        const text = data.hasOwnProperty('text');
        return (
            <View>
            { photo &&
                <View>
                    <Image
                        style={{width: 100, height: 100}}
                        source={{uri: data.photo.urls[0]}}
                    />
                    <Text>
                        {`${data.caption}`}
                    </Text>
                </View>
            }
            { text &&
                <View>
                    <Text style={styles.name}>
                        {`${data.text}`}
                    </Text>
                </View>
            }
            </View>
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
                    renderRow={this._renderMomentListItem.bind(this)}
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
