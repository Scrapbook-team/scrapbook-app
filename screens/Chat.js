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
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {

    static navigationOptions = {
        title: ({state}) => `${state.params.title}`,
        header: ({navigate, state}) => {
            let right = (
                <Button
                    title='Moment'
                    onPress={() => navigate('Moment', {
                        groupId: state.params.groupId, 
                        name: state.params.name, 
                        momentId: state.params.momentId, 
                        title: state.params.title
                    })}
                />
            );

            return {right};
        }
    };
    constructor(props){
        super(props);
        this.state = {messages: [], groupId: '', name: '', momentId: ''};
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;

        this.setState({momentId: params.momentId, title: params.title});

        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (!token) this.props.navigation.navigate('Login');
                this.setState({token});
                console.log("HERRO!");
                this.getMessages(0);

                AsyncStorage.getItem('Scrapbook:UserId')
                    .then(userId => {
                        this.setState({userId});
                });
            });
    }


    getMessages = (page) => {
        ScrapbookApi.getMessages(this.state.token, this.state.momentId, page)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                //Convert the messages from the API into GiftedChat format
                var messages = [];
                var unprocessedMsgs = r;
                for(var i = 0; i < unprocessedMsgs.length; i++){
                    var msg = unprocessedMsgs[i];

                    var newMsg = {
                        _id: msg._id,
                        text: msg.text,
                        createdAt: new Date(msg.createdAt),
                        user: {
                            _id: msg.user._id,
                            name: msg.user.firstName + ' ' + msg.user.lastName,
                        }
                    };

                    messages.push(newMsg);
                }
                this.setState({messages})
            })
            .catch(e => console.log(e));
    }

    sendMessage = (text) => {
        ScrapbookApi.sendMessage(this.state.token, this.state.momentId, text)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                console.log(r);
                this.getMessages(0);
            })
            .catch(e => console.log(e));
    }

    sendPhoto() {
        ScrapbookApi.sendMessage(this.state.token, this.state.groupId, text, this.state.userId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                this.getMessages(0);
            })
            .catch(e => console.log(e));
    }

    onSend = (messages=[]) => {
        for (message of messages){
            this.sendMessage(message.text);
        }
    }

    render() {
        return (
            <GiftedChat
              messages={this.state.messages}
              onSend={this.onSend}
              loadEarlier={true}
              user={{
                _id: this.state.userId,
              }}
            />
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
