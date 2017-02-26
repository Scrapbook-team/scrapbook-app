import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
  TouchableHighlight,
  Modal,
  ListView,
  Image,
} from 'react-native';
import Exponent, {
  ImagePicker,
} from 'exponent';
import {
    NavigationActions,
} from 'react-navigation';

import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@exponent/vector-icons';

import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

export default class GroupSettings extends React.Component {

    static navigationOptions = {
        title: ({state}) => `Group Settings`,
    };

    constructor(props) {
        super(props);


        const members = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const contacts = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const searchContacts = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = { 
            loaded: false, 
            editing: false, 
            addPeople: false,
            contactSearch: false,
            profileUrl: '',
            members: members.cloneWithRows([]),
            contacts: contacts.cloneWithRows([]),
            searchContacts: searchContacts.cloneWithRows([]),
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
                            this.getGroup();
                            this.getContacts();
                    });
                }
            });
    }


    getGroup() {
        const {params} = this.props.navigation.state;
        ScrapbookApi.getGroup(this.state.token, params.groupId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                var group = r;
                console.log(group);
                this.setState({
                    group,
                    newName: group.name,
                    newDescription: group.description,
                    newProfile: group.profile._id,
                    loaded: true,
                    members: this.state.members.cloneWithRows(group.members),
                });
                if (group.profile)
                    this.setState({profileUrl: group.profile.urls[0]});
            })
            .catch(e => console.log(e));
    }

    
    editGroup(newValues) {
        const {params} = this.props.navigation.state;
        ScrapbookApi.editGroup(this.state.token, params.groupId, newValues)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                console.log('Yo YO YO');
                this.getGroup();
            })
            .catch(e => console.log(e));

        this.setState({editing: false});
    }

    getContacts() {
        ScrapbookApi.getContacts(this.state.token, this.state.userId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                var contacts = r;
                this.setState({
                    contacts: this.state.contacts.cloneWithRows(contacts.contacts),
                });
            })
            .catch(e => console.log(e));
    }

    findContacts(query) {
        if (query === '') {
            this.setState({contactSearch: false});
        } else {
            this.setState({contactSearch: true});
        }

        ScrapbookApi.findContacts(this.state.token, query)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                var contacts = r;
                this.setState({
                    searchContacts: this.state.searchContacts.cloneWithRows(contacts),
                });
            })
            .catch(e => console.log(e));
    }

    addMember(memberId) {
        ScrapbookApi.addMember(this.state.token, this.props.navigation.state.params.groupId, memberId)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                this.getGroup();
            })
            .catch(e => console.log(e));
    }
    
    _renderPersonListItem(data) {
        return (
            <View>
                <Text style={styles.name}>
                    {`${data.firstName + ' ' + data.lastName}`}
                </Text>
            </View>
        );
    }

    _renderAddPersonListItem(data) {
        return (
            <TouchableHighlight
                onPress={() => this.addMember(data._id)}
            >
                <Text>
                    {`${data.firstName + ' ' + data.lastName}`}
                </Text>
            </TouchableHighlight>
        );
    }

    _pickImage = async () => {
        const {params} = this.props.navigation.state;

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            aspect: [4,3]
        });
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
                this.setState({newProfile: uploadResult._id, profileUrl: uploadResult.urls[0]});
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
    

    openEditGroup() {
        this.setState({
            editing: true,
            newName: this.state.group.name,
            newDescription: this.state.group.description,
            newProfile: this.state.group.profile._id,
        });
    }

    closeEditGroup() {
        this.setState({
            editing: false,
            newName: '',
            newDescription: '',
            newProfile: '',
            profileUrl: this.state.group.profile.urls[0],
        });
    }

    render() {
        return (
            <View>
                <Button
                    onPress={() => this.openEditGroup()}
                    title='Edit Group Info'
                />
                <Button
                    onPress={() => this.setState({addPeople: true})}
                    title='Add People'
                />
            { this.state.loaded &&
                <View>
                    <Text>Members</Text>
                    <ListView
                        dataSource={this.state.members}
                        renderRow={this._renderPersonListItem.bind(this)}
                    />
                </View>
            }
            { this.state.loaded  &&
                <Modal
                    animationType={"slide"}
                    visible={this.state.editing}
                    onRequestClose={() => this.closeEditGroup()}                   
                    >
                    <Text> Edit Group Info </Text>
                    <TextInput
                        value={this.state.newName}
                        onChangeText={(text) => this.setState({newName: text})}
                    />
                    <TextInput
                        value={this.state.newDescription}
                        onChangeText={(text) => this.setState({newDescription: text})}
                    />
                    <Image
                        source={{uri: this.state.profileUrl}}
                        style={{width: 200, height: 200}}
                    />
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
                    <Button
                        onPress={() => this.editGroup({name: this.state.newName, description: this.state.newDescription, profile: this.state.newProfile})}
                        title='Save'
                    />
                </Modal>
            }
            { this.state.loaded &&
                <Modal
                    animationType={'slide'}
                    visible={this.state.addPeople}
                    onRequestClose={() => this.setState({addPeople: false})}
                    >
                    <Text>Members</Text>
                    <ListView
                        dataSource={this.state.members}
                        renderRow={this._renderPersonListItem.bind(this)}
                    />
                    <Text> Add People </Text>
                    <TextInput
                        onChangeText={(text) => this.findContacts(text)}
                    />
                    { this.state.contactSearch &&
                        <View>
                            <Text>Search Users</Text>
                            <ListView
                                dataSource={this.state.searchContacts}
                                renderRow={this._renderAddPersonListItem.bind(this)}
                            />
                        </View>
                    }
                    <Text>My Contacts</Text>
                    <ListView
                        dataSource={this.state.contacts}
                        renderRow={this._renderAddPersonListItem.bind(this)}
                    />
                </Modal>
            }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
});
