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
} from 'react-native';
import {
    NavigationActions
} from 'react-navigation';

import * as Forms from 'tcomb-form-native';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

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
        this.state = {
            group: {},
            page: 0,
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

    newGroup = () => {
        Keyboard.dismiss();
        group = this.state.group;
        if(group){
            ScrapbookApi.newGroup(this.state.token, this.state.userId, group.name, group.description)
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
                        <Text> Page 2 </Text>
                        <Button
                            onPress={() => this.setState({page: 1})}
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
                        <Text> Page 3 </Text>
                        <Button
                            onPress={() => this.setState({page: 2})}
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
