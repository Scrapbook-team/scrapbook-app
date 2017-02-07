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
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (!token) this.props.navigation.navigate('Login');
                this.setState({token});
                console.log(this.state.token);

                AsyncStorage.getItem('Scrapbook:UserId')
                    .then(userId => {
                        this.setState({userId});
                        console.log(this.state.userId);
                });
            });
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
        this._handleImagePicked(this.state.token, pickerResult, '58900ec01edf9819793f2402', this.state.userId);
    }

    _handleImagePicked = async (token, pickerResult, groupId, userId) => {
        let uploadResponse, uploadResult;

        try {
            this.setState({uploading: true});

            if (!pickerResult.cancelled) {
                //console.log(this.props.navigation.state.params.id);
                uploadResponse = await ScrapbookApi.addPhoto(token, pickerResult.uri, groupId, userId, "Name", "caption");
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
