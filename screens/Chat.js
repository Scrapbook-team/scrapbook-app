import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  View,
  AsyncStorage,
  Keyboard,
  Image,
} from 'react-native';
import Exponent, {
  ImagePicker,
} from 'exponent';
import {
    NavigationActions,
} from 'react-navigation';

import CameraRollPicker from 'react-native-camera-roll-picker';
import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import { Ionicons } from '@exponent/vector-icons';
import ApiUtils from '../utilities/ApiUtils';
import FixedKeyboardAvoidingView from '../components/FixedKeyboardAvoidingView';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

export default class Chat extends React.Component {

    static navigationOptions = {
        title: ({state}) => `${state.params.title}`,
    };

    navigateToMoment = () => {
        const {params} = this.props.navigation.state;
        const resetAction = NavigationActions.reset({
            index: 2,
            actions: [
                NavigationActions.navigate({ routeName: 'GroupList' }),
                NavigationActions.navigate({ routeName: 'MomentList', params: { groupId: params.groupId, name: params.name }}),
                NavigationActions.navigate({ routeName: 'Moment', params: {groupId: params.groupId, name: params.name, momentId: params.momentId, title: params.title}}),
            ]
        });

        this.props.navigation.dispatch(resetAction);
    }

    constructor(props){
        super(props);
        this.state = {messages: [], groupId: '', name: '', momentId: '', showCameraRoll: false, photos: [], moment: {}, currentSlide: 0};
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({groupId: params.groupId, momentId: params.momentId, title: params.title});
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                if (!token) this.props.navigation.navigate('Login');
                this.setState({token});
                this.getMessages(0);
                this.getMoments();
                this.startSlideshow();

                AsyncStorage.getItem('Scrapbook:UserId')
                    .then(userId => {
                        this.setState({userId});
                });
            });
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({showCameraRoll: false})
    }

    getMoments = () => {
        ScrapbookApi.getMoment(this.state.token, this.state.momentId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                r.urls = {};
                r.photos.forEach((p)=>{
                    r.urls[p.photo._id] = p.photo.urls[0];
                });
                r.photos = r.photos.map((p)=>{return {caption: p.caption, position: p.position, photo: p.photo._id}});
                r.notes = r.notes.map((p)=>{return {text: p.text, position: p.position, user: p.user._id}});
                this.setState({moment:r});
            }
        );
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
                    if(msg.photo){
                        newMsg.photoId = msg.photo._id;
                        newMsg.image = msg.photo.urls[0];
                    }

                    messages.push(newMsg);
                }
                this.setState({messages})
            })
            .catch(e => console.log(e));
    }

    startSlideshow = () => {
        this.setInterval(() => {
            this.setState({currentSlide: (this.state.currentSlide + 1)%this.state.moment.photos.length});
        }, 5000)
    }

    sendMessage = (text) => {
        ScrapbookApi.sendMessage(this.state.token, this.state.momentId, text)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                this.getMessages(0);
            })
            .catch(e => console.log(e));
    }

    sendMessageAndPhoto = (text, photoId) => {
        ScrapbookApi.sendMessage(this.state.token, this.state.momentId, text, photoId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                this.getMessages(0);
            })
            .catch(e => console.log(e));
    }

    addMessageToMoment = (props) => {
        console.log('addingmsg' + JSON.stringify(this.state.moment));
        let photos = this.state.moment.photos;
        let notes = this.state.moment.notes;
        if(props.currentMessage.image){
            newPhoto = {photo: props.currentMessage.photoId, caption: (props.currentMessage.text || ''), position: this.state.moment.size};
            photos = this.state.moment.photos.concat(newPhoto);
        } else {
            newNote = {text: props.currentMessage.text, user: props.currentMessage.user._id, position: this.state.moment.size};
            notes = this.state.moment.notes.concat(newNote);
        }
        ScrapbookApi.updateMoment(this.state.token, this.state.momentId, photos, notes)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                this.getMoment();
            })
            .catch(e => console.log(e));
    }

    setPhoto = (photos) => {
        this.setState({photos});
    }

    onSend = (messages=[]) => {
        for (message of messages){
            if(this.state.photos.length > 0){
                ScrapbookApi.addPhoto(this.state.token, this.state.photos[0].uri, this.state.groupId, this.state.photos[0].type.split('/')[1])
                    .then(ApiUtils.checkStatus)
                    .then((r) => {return r.json()})
                    .then((r) => {
                        this.sendMessageAndPhoto(message.text, r._id)
                    });
                this.setState({photos:[], showCameraRoll: false});
            } else {
                this.sendMessage(message.text);
            }
        }
    }

    renderActionButton = () => {
        return (
            <TouchableOpacity
                style={styles.actionContainer}
                onPress={()=> {Keyboard.dismiss(); this.setState({showCameraRoll: !this.state.showCameraRoll})}} >
                <Ionicons
                    name={this.state.showCameraRoll ? 'ios-close-circle-outline' : 'ios-add-circle-outline'}
                    size={36}/>
            </TouchableOpacity>
        );
    }

    renderBubble = (props) => {
        if (props.currentMessage.image) {
            return <Bubble {...props}
                wrapperStyle = {{left: {alignSelf: 'stretch'}, right: {alignSelf: 'stretch'}}}
                imageStyle = {{flex:1, width: null, height: 400, margin: 0}}
                onLongPress = {()=>this.addMessageToMoment(props)}
                lightboxProps = {{onLongPress: ()=>this.addMessageToMoment(props)}}
                />
        }
        return <Bubble {...props}
            onLongPress = {()=>this.addMessageToMoment(props)}
            />
    }

    renderSendButton = (props) => {
        if(props.text || this.state.photos.length > 0) {
            return (
                <TouchableOpacity
                    style={styles.sendContainer}
                    onPress={() => {
                        props.onSend({text: (props.text ? props.text.trim() : '')}, true);
                    }}
                    accessibilityTraits="button" >
                    <Ionicons
                        name='ios-send-outline'
                        size={36}/>
                </TouchableOpacity>
            );
        }
        return <View/>;
    }

    renderChat = () => {
        let chat = <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            loadEarlier={true}
            renderActions={this.renderActionButton}
            renderSend={this.renderSendButton}
            renderBubble={this.renderBubble}
            renderTime={()=>{}}
            user={{
                _id: this.state.userId,
            }}
        />;
        if(this.state.moment.photos && this.state.moment.photos.length>0) {
            console.log("moment phoy"+this.state.moment.photos[0].photo);
            chat = (
                <Image
                    source={{uri: this.state.moment.urls[this.state.moment.photos[this.state.currentSlide].photo]}}
                    style={styles.backgroundImage}>
                    <View style = {styles.backgroundContainer}>
                        {chat}
                    </View>
                </Image>);
        } else {
            chat = <View>{chat}</View>;
        }
        return chat;
    }

    render() {
        return (
            <FixedKeyboardAvoidingView behavior={'padding'} style={{flex:1}}>
                { this.renderChat() }
                { this.state.showCameraRoll &&
                    <View style={{flex: 1}}>
                        <CameraRollPicker
                            maximum={1}
                            selected={this.state.selected}
                            imagesPerRow={4}
                            callback={this.setPhoto}
                        />
                    </View>
                }
            </FixedKeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    actionContainer: {
        width: 36,
        height: 36,
        marginLeft: 10,
        marginBottom: 5,
    },
    sendContainer: {
        width: 36,
        height: 36,
        marginLeft: 10,
        marginBottom: 5,
        justifyContent: 'flex-end',
    },
    backgroundContainer : {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.3)',
    },
    backgroundImage : {
        flex: 1,
        resizeMode: 'cover',
    },
});

reactMixin.onClass(Chat, TimerMixin);
