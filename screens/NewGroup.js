import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
  Keyboard,
  ListView,
} from 'react-native';
import {
    NavigationActions
} from 'react-navigation';

import * as Forms from 'tcomb-form-native';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

import MemberPill from '../components/MemberPill';
import FindUser from '../components/FindUser';
import ImageUpdater from '../components/ImageUpdater';

const Group = Forms.struct({
    name: Forms.String,
    description: Forms.maybe(Forms.String),
});
const Form = Forms.form.Form;

export default class NewGroup extends React.Component {
    static navigationOptions = {
        title: 'New Group'
    }

    constructor(props) {
        super(props);

        const members = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            group: {},
            page: 0,
            members: members.cloneWithRows([]),
            memberData: [],
            profile: '',
            profileUrl: '',
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('Scrapbook:UserToken')
            .then(token => {
                this.setState({token});
            });

        AsyncStorage.getItem('Scrapbook:UserId')
            .then(userId => {
                this.setState({userId});
            });
    }

    navigateToGroup = (groupId, name) => {
        const resetAction = NavigationActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'GroupList' }),
                NavigationActions.navigate({ routeName: 'MomentList', params: { groupId: groupId, name: name }}),
            ]
        });

        this.props.navigation.dispatch(resetAction);
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

    addMember(user) {
        var data = this.state.memberData;
        //Check for duplicates at some point
        data.push(user);

        this.setState({
            members: this.state.members.cloneWithRows(data),
            memberData: data,
        });
    }

    _handleImagePicked = async (pickerResult) => {
        let uploadResponse, uploadResult;
        const {params} = this.props.navigation.state;

        try {
            this.setState({uploading: true});

            if (!pickerResult.cancelled) {
                uploadResponse = await ScrapbookApi.addPhoto(this.state.token, pickerResult.uri);
                uploadResult = await uploadResponse.json();
                this.setState({profile: uploadResult._id, profileUrl: uploadResult.urls[0]});
            }
        } catch(e) {
            console.log({e});
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({uploading: false});
        }
    }

    newGroup = () => {
        Keyboard.dismiss();
        group = this.state.group;

        
        if(group){

            let members = this.state.memberData.map((currentValue) => { return currentValue._id });
            members.push(this.state.userId);

            ScrapbookApi.newGroup(this.state.token, group.name, group.description, members, this.state.profile)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                this.navigateToGroup(r._id, r.name);
            })
            .catch(e => console.log(e));
        }
    }

    render() {
        console.log(this.state.page);
        const page = this.state.page;
        return (
            <View style={styles.container}>
                { this.state.page == 0 &&
                    <KeyboardAvoidingView
                      behavior={'padding'}
                      style={styles.container}>
                      <Form
                        ref="form"
                        value={this.state.group}
                        onChange={group => {this.setState({group})}}
                        type ={Group}/>
                      <Button
                          onPress={() => this.setState({page: 1})}
                          title="Next"
                          color="#841584"
                      />
                  </KeyboardAvoidingView>
                }
                { this.state.page == 1 &&
                    <View>
                        <ListView
                            dataSource={this.state.members}
                            renderRow={(member) => (
                                <MemberPill {...member} />
                            )}
                            contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                        />
                        <FindUser
                            token={this.state.token}
                            userId={this.state.userId}
                            selectUser={this.addMember.bind(this)}
                        />
                        <Button
                            onPress={() => this.setState({page: 0})}
                            title="Back"
                            color="#841584"
                        />
                        <Button
                            onPress={() => this.setState({page: 2})}
                            title="Next"
                            color="#841584"
                        />
                    </View>
                }
                { this.state.page == 2 &&
                    <View>
                        <Text> Set Group Photo </Text>
                        <ImageUpdater
                            handleImagePicked={this._handleImagePicked}
                            url={this.state.profileUrl}
                        />
                        <Button
                            onPress={() => this.setState({page: 1})}
                            title="Back"
                            color="#841584"
                        />
                        <Button
                            onPress={this.newGroup}
                            title="Create Group"
                            color="#841584"
                        />
                    </View>
                }
                <Button
                    onPress={() => this.props.navigation.navigate('GroupList')}
                    title="Cancel"
                    color="#841584"
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
        justifyContent: 'center',
    },
});
