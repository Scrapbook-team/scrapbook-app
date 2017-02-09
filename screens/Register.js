import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage,
} from 'react-native';

import * as Forms from 'tcomb-form-native';
import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

const Registration = Forms.struct({
    email: Forms.String,
    password: Forms.String,
    firstName: Forms.String,
    lastName: Forms.String,
});
const Form = Forms.form.Form;

export default class Register extends React.Component {

    static navigationOptions = {
        title: 'Register',
        drawer: () => ({
            label: 'Register',
        }),
    }

    constructor(props) {
        super(props);
        this.state = {registration: {}};
    }

    componentDidMount() {

    }

    registerUser = () => {
        Keyboard.dismiss();
        reg = this.state.registration;
        if(reg){
            ScrapbookApi.register(reg.email, reg.password, reg.firstName, reg.lastName)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                user = r;
                Promise.all([
                    AsyncStorage.setItem('Scrapbook:UserToken', user.token),
                    AsyncStorage.setItem('Scrapbook:UserId', user.id)
                ]).then(this.props.navigation.navigate('Home'));
            })
            .catch(e => console.log(e));
        }
    }

    render() {
        return (
            <KeyboardAvoidingView
              behavior={'padding'}
              style={styles.container}>
              <Text style={styles.title} >
                  Scrapbook
              </Text>
              <Form
                ref="form"
                value={this.state.registration}
                onChange={registration => {this.setState({registration})}}
                type ={Registration}/>
              <Button
                  onPress={this.registerUser}
                  title="Register"
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
    title:{
      textAlign: 'center',
      fontSize: 24,
      flex: 1,
      justifyContent: 'center',
    },
    textField: {
        height: 40,
    }
});
