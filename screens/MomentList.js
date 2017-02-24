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
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@exponent/vector-icons';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class MomentList extends React.Component {

    static navigationOptions = {
        title: ({state}) => `${state.params.name}`,
        header: ({navigate, state}) => {
            let right = (
                <View>
                    <Button
                        title='New Moment'
                        onPress={() => navigate('NewMoment', {groupId: state.params.groupId, name: state.params.name})}
                    />
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
                    <Text style={styles.title}>
                        {`${data.title}`}
                    </Text>
                    <View style={styles.momentButtons}>
                        <TouchableHighlight
                            onPress={() => ScrapbookApi.sendMemory(this.state.token, data._id)}
                            >
                            <Ionicons name="ios-send-outline" size={40} />                   
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
    },
    title: {
        fontSize: 24,
        marginLeft: 12,
    },
    momentBar: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    momentButtons: {
        flexDirection: 'row',
        marginRight: 12,
    },
});
