import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ListView,
  Modal,
  AsyncStorage,
} from 'react-native';
import SettingsList from 'react-native-settings-list';
import ImageUpdater from '../components/ImageUpdater';
import { pickImage } from '../utilities/ImageUtils';

import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

export default class Settings extends React.Component {

    static navigationOptions = {
        title: 'Settings',
    }


    constructor(props) {
        super(props);

        this.state = {
            editProfile: false,
            profileUrl: '',
            loaded: false,
        };
    }

    componentDidMount() {
        console.log("HEY");
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (!token) {
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({token});

                    AsyncStorage.getItem('Scrapbook:UserId')
                        .then(userId => {
                            this.setState({userId});
                            this.getUser();
                    });
                }
            });
    }

    getUser() {
        const {params} = this.props.navigation.state;
        ScrapbookApi.getUser(this.state.token, this.state.userId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                var user = r;
                this.setState({
                    user,
                    loaded: true,
                });
                if (user.profile)
                    this.setState({profileUrl: user.profile.urls[0]});
            })
            .catch(e => console.log(e));
    }

    editUser(newValues) {
        const {params} = this.props.navigation.state;
        ScrapbookApi.editUser(this.state.token, this.state.userId, newValues)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                console.log('Yo YO YO');
                this.getUser();
            })
            .catch(e => console.log(e));

        this.setState({editing: false});
    }
    
    _handleImagePicked = async (pickerResult) => {
        let uploadResponse, uploadResult;
        const {params} = this.props.navigation.state;

        try {
            this.setState({uploading: true});

            if (!pickerResult.cancelled) {
                uploadResponse = await ScrapbookApi.addPhoto(this.state.token, pickerResult.uri, null);
                uploadResult = await uploadResponse.json();
                this.setState({newProfile: uploadResult._id, profileUrl: uploadResult.urls[0]});
                console.log(pickerResult.uri);
            }
        } catch(e) {
            //console.log({uploadResponse});
            //console.log({uploadResult});
            console.log({e});
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({uploading: false});
        }
    }

    logout = () => {
        this.props.navigation.navigate('Login');
    } 

    render() {
        return (
            <View style={styles.container}>
                {this.state.loaded &&
                    <Modal
                        animationType={"slide"}
                        visible={this.state.editProfile}
                        onRequestClose={() => this.setState({editProfile: false})}                   
                    >
                        <ImageUpdater
                            handleImagePicked={this._handleImagePicked}
                            url={this.state.profileUrl}
                        />
                        <Button
                            onPress={() => this.editUser({profile: this.state.newProfile})}
                            title='Save'
                        />
                    </Modal>
                }
                <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Edit Profile'
                        onPress={() => this.setState({editProfile: true})}
                    />
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Sign Out'
                        onPress={this.logout}/>
                </SettingsList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
