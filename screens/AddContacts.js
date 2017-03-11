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
  ListView,
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

import FindUser from '../components/FindUser';
import MemberPill from '../components/MemberPill';

export default class AddContacts extends React.Component {

    static navigationOptions = {
        title: 'New Moment',
    }

    constructor(props) {
        super(props);


        const contacts = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            loaded: false,
            contactData: [], 
            contacts: contacts.cloneWithRows([]),
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
                            this.setState({loaded: true});
                    });
                }
            });

    }

    _selectContact(contact) {
        console.log(this.state.contactData);
        console.log("hell;;;o");
        ScrapbookApi.addContact(this.state.token, this.state.userId, contact._id)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                console.log("hello");
                var data = this.state.contactData;
                data.push(contact);


                this.setState({
                    contactData: data,
                    contacts: this.state.contacts.cloneWithRows(data),
                });
            })
            .catch(e => console.log(e));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text> Add Contacts </Text>
                { this.state.contactData.length !== 0 &&
                    <ListView
                        dataSource={this.state.contacts}
                        renderRow={(contact) => (
                            <MemberPill {...contact} />
                        )}
                        contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                    />
                }
                { this.state.loaded &&
                    <FindUser
                        token={this.state.token}
                        userId={this.state.userId}
                        selectUser={this._selectContact.bind(this)}
                    />
                }
                <Button
                    onPress={() => this.props.navigation.navigate('Home')}
                    title="Next"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    textField: {
        height: 40,
    }
});
