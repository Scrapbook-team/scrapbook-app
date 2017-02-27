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
import { Font } from 'exponent';
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
            fontLoaded: false,
        };
    }

    async loadFonts() {
        await Font.loadAsync({
            'ArchitectsDaughter': require('../assets/fonts/ArchitectsDaughter.ttf'),
            'Slabo': require('../assets/fonts/Slabo27px-Regular.ttf'),
        });

        this.setState({fontLoaded: true});
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

        this.loadFonts();
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

                blocks.push({footer: true});
                
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
        const footer = data.hasOwnProperty('footer');
        return (
            <View>
            { title && this.state.fontLoaded &&
                <View style={styles.titleBlock}>
                    <Text style={styles.title}>
                        {`${data.title}`}
                    </Text>
                    <Text style={styles.date}>
                        {`${data.date}`}
                    </Text>
                    <View style={{ backgroundColor: 'black', height: 1, marginTop: 4, marginBottom: 20}} />
                </View>
            }
            { photo &&
                <View>
                    <Image
                        style={styles.momentImage}
                        source={{uri: data.photo.urls[0]}}
                        resizeMode={'cover'}
                    />
                    { this.state.fontLoaded &&
                        <Text style={styles.caption}>
                            {`${data.caption}`}
                        </Text>
                    }
                </View>
            }
            { text && this.state.fontLoaded &&
                <View>
                    <Text style={styles.noteText}>
                        {`\u201c${data.text}\u201d`}
                    </Text>
                    <Text style={styles.noteAuthor}>
                        {`-${data.user.firstName}`}
                    </Text>
                </View>
            }
            { footer &&
                <View style={{ backgroundColor: 'black', height: 1, marginHorizontal: 12, marginTop: 12, marginBottom: 32}} />
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
    },
    title: {
        fontSize: 40,
        fontFamily: 'Slabo',
        textAlign: 'left',
    },
    date: {
        fontSize: 20,
        fontFamily: 'Slabo',
    },
    momentImage: {
        width: width,
        height: 500,
    },
    caption: {
        paddingHorizontal: 12,
        fontSize: 16,
        fontFamily: 'Slabo',
        color: '#2f4f4f',
        marginBottom: 8,
    },
    noteText: {
        paddingHorizontal: 12,
        fontSize: 24,
        fontFamily: 'ArchitectsDaughter',
    },
    noteAuthor: {
        paddingHorizontal: 12,
        fontSize: 20,
        fontFamily: 'Slabo',
        textAlign: 'right',
        marginBottom: 8,
    },
});
