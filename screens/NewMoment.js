import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
  Image,
} from 'react-native';
import Exponent, {
  ImagePicker,
} from 'exponent';
import {
    NavigationActions
} from 'react-navigation';

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

import ImageUpdater from '../components/ImageUpdater';

export default class NewMoment extends React.Component {

    static navigationOptions = {
        title: 'New Moment',
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '', 
            uploaded: false,
            imageUrl: '',
            photo: '',
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
                    });
                }
            });

    }

    createMoment = () => {
        console.log(this.state.title);
        console.log("hell");
        ScrapbookApi.newMoment(this.state.token, this.props.navigation.state.params.groupId, this.state.title, this.state.photo, this.state.caption)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                moment = r;

                console.log("Hi");
                this.navigateToMoment(moment._id, moment.title);
            })
            .catch(e => console.log(e));
    }

    navigateToMoment = (momentId, title) => {
        const {params} = this.props.navigation.state;
        const resetAction = NavigationActions.reset({
            index: 2,
            actions: [
                NavigationActions.navigate({ routeName: 'GroupList' }),
                NavigationActions.navigate({ routeName: 'MomentList', params: { groupId: params.groupId, name: params.name }}),
                NavigationActions.navigate({ routeName: 'Moment', params: {groupId: params.groupId, name: params.name, momentId: momentId, title: title}}),
            ]
        });

        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={'padding'}
                style={styles.container}>
                <TextInput
                    style={styles.textField}
                    placeholder="Title"
                    onChangeText={(title) => this.setState({title})}
                />
                <ImageUpdater
                    handleImagePicked={this._handleImagePicked}
                    url={this.state.imageUrl}
                />
                { this.state.uploaded &&
                    <TextInput
                        style={styles.textField}
                        placeholder="Caption"
                        onChangeText={(caption) => this.setState({caption})}
                    />
                }
                <Button
                    onPress={this.createMoment}
                    title="Create Moment"
                    color="#841584"
                />
            </KeyboardAvoidingView>
        );
    }
    
    _handleImagePicked = async (pickerResult) => {
        let uploadResponse, uploadResult;
        const {params} = this.props.navigation.state;

        try {
            this.setState({uploading: true});

            if (!pickerResult.cancelled) {
                uploadResponse = await ScrapbookApi.addPhoto(this.state.token, pickerResult.uri, params.groupId);
                uploadResult = await uploadResponse.json();
                this.setState({photo: uploadResult._id, imageUrl: uploadResult.urls[0], uploaded: true});
                console.log(this.state.photo); 
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




}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
    },
    textField: {
        height: 40,
    }
});
