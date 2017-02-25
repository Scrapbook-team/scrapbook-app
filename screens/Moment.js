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

import { Ionicons } from '@exponent/vector-icons';
import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';
import dateutil from 'dateutil';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export default class Moment extends React.Component {

    static navigationOptions = {
        title: ({state}) => `${state.params.name}`,
        header: ({navigate, state}) => {
            let right = (
                <TouchableHighlight
                    style={{marginRight: 12}}
                    onPress={() => navigate('Chat', {groupId: state.params.groupId, name: state.params.name, momentId: state.params.momentId, title: state.params.title})}
                    >
                    <Ionicons name="ios-chatbubbles-outline" size={40} />                   
                </TouchableHighlight>
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
                blocks[0] = {
                    title: moment.title,
                    date: dateutil.format(new Date(moment.createdDate), 'F jS, Y'),
                };

                for (var i = 0; i < moment.photos.length; i++) {
                    blocks[moment.photos[i].position + 1] = moment.photos[i];
                }
                for (var i = 0; i < moment.notes.length; i++) {
                    blocks[moment.notes[i].position + 1] = moment.notes[i];
                }
                

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(blocks),
                    loaded: true,
                });
            })
            .catch(e => console.log(e));
    }

    _renderMomentListItem(data) {
        const title = data.hasOwnProperty('title');
        const photo = data.hasOwnProperty('photo');
        const text = data.hasOwnProperty('text');
        return (
            <View>
            { title &&
                <View style={styles.titleBlock}>
                    <Text style={styles.title}>
                        {`${data.title}`}
                    </Text>
                    <Text style={styles.date}>
                        {`${data.date}`}
                    </Text>
                </View>
            }
            { photo &&
                <View>
                    <Image
                        style={styles.momentImage}
                        source={{uri: data.photo.urls[0]}}
                        resizeMode={'cover'}
                    />
                    <Text style={styles.caption}>
                        {`${data.caption}`}
                    </Text>
                </View>
            }
            { text &&
                <View>
                    <Text style={styles.noteText}>
                        {`\u201c${data.text}\u201d`}
                    </Text>
                    <Text style={styles.noteAuthor}>
                        {`-${data.user.firstName}`}
                    </Text>
                </View>
            }
            </View>
        );
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
        backgroundColor: '#faebd7',
        flex: 1,
    },
    titleBlock: {
        paddingHorizontal: 12,
        flexWrap: 'nowrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 32,
        textAlign: 'left',
    },
    date: {
        fontSize: 12,
        textAlign: 'right',
    },
    momentImage: {
        width: width,
        height: 500,
    },
    caption: {
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#2f4f4f',
    },
    noteText: {
        paddingHorizontal: 12,
        fontSize: 24,
    },
    noteAuthor: {
        paddingHorizontal: 12,
        fontSize: 16,
        textAlign: 'right',
    },
});
