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
        title: 'Scrapbook'
    }

    constructor(props) {
        super(props);
        this.state = {group: {}};
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
                this.props.navigation.navigate('Chat', {id: r._id,name: r.name});
            })
            .catch(e => console.log(e));
        }
    }

    render() {
        return (
            <KeyboardAvoidingView
              behavior={'padding'}
              style={styles.container}>
              <Form
                ref="form"
                value={this.state.group}
                onChange={group => {this.setState({group})}}
                type ={Group}/>
              <Button
                  onPress={this.newGroup}
                  title="Create Group"
                  color="#841584"
              />
          </KeyboardAvoidingView>
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
