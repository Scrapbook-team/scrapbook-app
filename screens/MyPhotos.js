import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ListView,
  Image,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

export default class MyPhotos extends React.Component {

    static navigationOptions = {
        title: 'My Photos',
    }


    constructor() {
        super();

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows([{urls: ['https://scrapbook-testing.s3.amazonaws.com/148644327903://scrapbook-testing.s3.amazonaws.com/1486443279039']}]),
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
                            this.getPhotos();
                    });
                }
            });
    }

    /*
     * Get photos for a user.
     */
    getPhotos() {
        ScrapbookApi.getUserPhotos(this.state.token, this.state.userId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                photos = r;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(photos),
                    photos,
                });
            })
            .catch(e => console.log(e));
    }

    _renderPhotoListItem(data, sectionId, rowId) {
        return (
            <TouchableHighlight style={styles.thumbnail}
                onPress={() => {this.props.navigation.navigate('PhotoSwipe', {photos: this.state.photos, index: rowId})}}
                >
                <Image
                    style={{width: 100, height: 100}}
                    source={{uri: data.urls[0]}}
                />
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView contentContainerStyle={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderPhotoListItem.bind(this)}
                />
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    thumbnail: {
        backgroundColor: '#CCC',
        margin: 2,
        width: 70,
        height: 70,
    }
});
