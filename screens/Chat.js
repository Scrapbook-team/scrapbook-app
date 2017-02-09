import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
} from 'react-native';
import Exponent, {
  ImagePicker,
} from 'exponent';

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';


export default class Chat extends React.Component {
    
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

    componentDidMount() {
        const { state } = this.props.navigation;
        const { params } = state.routes[state.index];

        this.setState({groupId: params.groupId, name: params.name});

        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (!token) this.props.navigation.navigate('Login');
                this.setState({token});
                console.log(this.state.token);

                AsyncStorage.getItem('Scrapbook:UserId')
                    .then(userId => {
                        this.setState({userId});
                        console.log(this.state.userId);
                        this.getMessages(0);
                });
            });
    }


    getMessages(page) {
        ScrapbookApi.getMessages(this.state.token, this.state.groupId, page)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                console.log(r);
            })
            .catch(e => console.log(e));
    }

    render() {
        return (
            <View style={styles.container}>
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
        );
    }

    _pickImage = async () => {
        const {state} = this.props.navigation;

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [4,3]
        });
        console.log(this.props);
        this._handleImagePicked(this.state.token, pickerResult);
    }

    _handleImagePicked = async (token, pickerResult) => {
        let uploadResponse, uploadResult;

        try {
            this.setState({uploading: true});

            if (!pickerResult.cancelled) {
                //console.log(this.props.navigation.state.params.id);
                uploadResponse = await ScrapbookApi.addPhoto(token, pickerResult.uri, this.state.groupId, this.state.userId, "Name", "caption");
                uploadResult = await uploadResponse.json();
                this.setState({image: uploadResult.location});
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
    },
});
