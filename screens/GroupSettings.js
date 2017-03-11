import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  ListView,
  Image,
  Dimensions,
} from 'react-native';
import {
    NavigationActions,
} from 'react-navigation';

import { StackNavigator } from 'react-navigation';
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@exponent/vector-icons';

import UserCell from '../components/UserCell';
import ImageUpdater from '../components/ImageUpdater';
import MemberPill from '../components/MemberPill';
import { pickImage } from '../utilities/ImageUtils';

import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

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
            membersList: [],
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
                    loaded: true,
                    members: this.state.members.cloneWithRows(group.members),
                    membersList: group.members,
                });
                if (group.profile)
                    this.setState({newProfile: group.profile._id, profileUrl: group.profile.urls[0]});
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

    _handleImagePicked = async (pickerResult) => {
        let uploadResponse, uploadResult;
        const {params} = this.props.navigation.state;

        try {
            this.setState({uploading: true});

            if (!pickerResult.cancelled) {
                uploadResponse = await ScrapbookApi.addPhoto(this.state.token, pickerResult.uri, params.groupId);
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
            <View style={styles.container} >
            { this.state.loaded &&
                <View>
                    <Image
                        source={{uri: this.state.profileUrl}}
                        style={{width, height: 200}}
                    >
                        <View style={{flexGrow: 1}} />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12}}>
                            <View>
                                <Text style={styles.groupName}>
                                    {this.state.group.name}
                                </Text>
                                <Text style={styles.description}>
                                    {this.state.group.description}
                                </Text>
                            </View>
                            <View>
                                <Button
                                    onPress={() => this.openEditGroup()}
                                    title='Edit Group Info'
                                />
                            </View>
                        </View>
                    </Image>
                </View>
            }
            { this.state.loaded &&
                <View>
                    <View style={styles.membersHeader} >
                        <Text style={{fontSize: 20}}>Members</Text>
                        <Button
                            onPress={() => this.setState({addPeople: true})}
                            title='Add People'
                        />
                    </View>
                    <ListView
                        dataSource={this.state.members}
                        renderRow={(user) => (
                            <UserCell {...user} />
                        )}
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
                    <ImageUpdater
                        handleImagePicked={this._handleImagePicked}
                        url={this.state.profileUrl}
                    />
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
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
                        <Text style={{fontSize: 20, marginTop: 12, marginLeft: 12}}> 
                            Add People 
                        </Text>
                        <Button
                            onPress={() => this.setState({addPeople: false})}
                            title='Done'
                        />
                    </View>
                    <ListView
                        dataSource={this.state.members}
                        renderRow={(member) => (
                            <MemberPill {...member} />
                        )}
                        contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                    />
                    <TextInput
                        onChangeText={(text) => this.findContacts(text)}
                        placeholder={'Find Contact'}
                        style={{height: 40, marginHorizontal: 12}}
                    />
                    { this.state.contactSearch &&
                        <View>
                            <Text style={{fontSize: 20}}>
                                Search Users
                            </Text>
                            { this.state.searchContacts.getRowCount() != 0 &&
                                <ListView
                                    dataSource={this.state.searchContacts}
                                    renderRow={(user) => (
                                        <TouchableOpacity
                                            onPress={() => this.addMember(user._id)}
                                        >
                                            <UserCell {...user} />
                                        </TouchableOpacity>
                                    )}
                                />
                            }
                            { this.state.searchContacts.getRowCount() == 0 &&
                                <Text>
                                    No users found
                                </Text>
                            }
                        </View>
                    }
                    <Text style={{fontSize: 20, marginLeft: 12}}>
                        My Contacts
                    </Text>
                    <ListView
                        dataSource={this.state.contacts}
                        renderRow={(user) => (
                            <TouchableOpacity
                                onPress={() => this.addMember(user._id)}
                            >
                                <UserCell {...user} />
                            </TouchableOpacity>
                        )}
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
    membersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginHorizontal: 12,
    },
    groupName: {
        fontSize: 20,
        color: 'white',
        textShadowOffset: {width: 1, height: 1}, 
        textShadowRadius: 1, 
        textShadowColor: 'black',
    },
    description: {
        fontSize: 16,
        color: 'white',
        marginBottom: 12,
        textShadowOffset: {width: 1, height: 1}, 
        textShadowRadius: 1, 
        textShadowColor: 'black',
    },
    membersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    membersListItem: {
        height: 24,
        borderRadius: 12,
        marginRight: 4,
        marginBottom: 4,
        backgroundColor: 'grey',
    },
    membersListText: {
        color: 'white',
        marginHorizontal: 12,
    },
});
