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

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';


export default class NewMoment extends React.Component {

    static navigationOptions = {
        title: 'New Moment',
    }

    constructor(props) {
        super(props);
        this.state = {title: '', uploaded: false};
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
        ScrapbookApi.newMoment(this.state.token, this.props.navigation.state.params.groupId, this.state.title, this.state.photo._id, this.state.caption)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                moment = r;
                this.props.navigation.navigate('Moment',{
                    groupId: moment.groupId, 
                    name: this.props.navigation.state.params.name,
                    momentId: moment._id,
                    title: moment.title,
                });
            })
            .catch(e => console.log(e));
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
                { this.state.uploaded &&
                    <View>
                        <Image
                            style={{width: 200, height: 200}}
                            source={{uri: this.state.photo.urls[0]}}
                        />
                        <TextInput
                            style={styles.textField}
                            placeholder="Caption"
                            onChangeText={(caption) => this.setState({caption})}
                        />
                    </View>
                }
                { !this.state.uploaded &&
                <View>
                   <Button
                      onPress={this._pickImage}
                      title="Pick Image"
                      color="#841584"
                  />
                  <Button
                      onPress={this._takePhoto}
                      title="Take Photo"
                      color="#841584"
                  />
                </View>
                }
                <Button
                    onPress={this.createMoment}
                    title="Create Moment"
                    color="#841584"
                />
            </KeyboardAvoidingView>
        );
    }


    _pickImage = async () => {
        const {params} = this.props.navigation.state;

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [4,3]
        });
        console.log("Group");
        console.log(this.props.navigation.state.params);
        var groupId = this.props.navigation.state.params.groupId;
        this._handleImagePicked(this.state.token, pickerResult, groupId, this.state.userId);
    }

    _handleImagePicked = async (token, pickerResult, groupId, userId) => {
        let uploadResponse, uploadResult;

        try {
            this.setState({uploading: true});

            if (!pickerResult.cancelled) {
                uploadResponse = await ScrapbookApi.addPhoto(token, pickerResult.uri, groupId, userId, "Name", "caption");
                uploadResult = await uploadResponse.json();
                this.setState({photo: uploadResult, uploaded: true});
                console.log(this.state.image);
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

    _takePhoto() {
        console.log('Take photo');
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
