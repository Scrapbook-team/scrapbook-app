import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    Modal,
    ListView,
    TextInput,
} from 'react-native';

import { pickImage } from '../utilities/ImageUtils';
import { Ionicons } from '@exponent/vector-icons';
import Layout from '../constants/Layout';
import UserCell from './UserCell';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

export default class FindUser extends React.Component {

    constructor(props) {
        super(props);

        const contacts = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const searchContacts = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = { 
            contactSearch: false,
            contacts: contacts.cloneWithRows([]),
            searchContacts: searchContacts.cloneWithRows([]),
        };
    }

    componentDidMount() {
        this.getContacts();
    }

    getContacts() {
        ScrapbookApi.getContacts(this.props.token, this.props.userId)
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

        ScrapbookApi.findContacts(this.props.token, query)
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


    render() { return (
        <View>
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
                            contentContainerStyle={{maxHeight: 0.5 * Layout.height}}
                            renderRow={(user) => (
                                <TouchableOpacity
                                    onPress={() => this.props.selectUser(user)}
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
                        onPress={() => this.props.selectUser(user)}
                    >
                        <UserCell {...user} />
                    </TouchableOpacity>
                )}
            />
        </View>
    )}
}


FindUser.propTypes = {
    token: React.PropTypes.string.isRequired,
    userId: React.PropTypes.string.isRequired,
    selectUser: React.PropTypes.func.isRequired,
};
