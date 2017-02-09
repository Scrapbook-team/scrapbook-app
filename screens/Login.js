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
import update from 'react-addons-update';
import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';

const Credential = Forms.struct({
    email: Forms.String,
    password: Forms.String,
});
const options = {
  fields: {
    password: {
      password: true,
      secureTextEntry: true
    }
  }
};
const Form = Forms.form.Form;

export default class Login extends React.Component {

    static navigationOptions = {
        header: {
            visible: false,
        },
    }

    constructor(props) {
        super(props);
        this.state = {showInvalid: false, credential: {}};
    }

    componentDidMount() {
        AsyncStorage.removeItem('Scrapbook:UserToken');
        AsyncStorage.removeItem('Scrapbook:UserId');
    }

    loginUser = () => {
        Keyboard.dismiss();
        if(this.state.credential){
            ScrapbookApi.login(this.state.credential.email, this.state.credential.password)
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
            .catch(e => {
                this.setState({credential: update(this.state.credential, {password: {$set: ''}}), showInvalid: true});
            });
        }
    }

    register = () => {
        this.props.navigation.navigate('Register');
    }

    render() {
        return (
            <KeyboardAvoidingView
              behavior={'padding'}
              style={styles.container}>
              <View style={styles.titleCont}>
                  <Text style={styles.title} >
                      Scrapbook
                  </Text>
              </View>
              <View style={styles.form}>
                  <Form
                    ref="form"
                    value={this.state.credential}
                    onChange={credential => {this.setState({credential})}}
                    type ={Credential}
                    options={options} />
                  <Button
                      onPress={this.loginUser}
                      title="LOGIN"
                      color="#841584"
                  />
                  {this.state.showInvalid && this.renderInvalid()}
              </View>
              <View style={styles.newAccountCont}>
                  <Button
                      onPress={this.register}
                      title="CREATE NEW SCRAPBOOK ACCOUNT"
                      color="#841584"
                  />
              </View>
          </KeyboardAvoidingView>
        );
    }

    renderInvalid = () => {
        console.log("render invalid");
        if(this.state.showInvalid){
            return (
                <Text style={styles.invalidLogin}>
                    Invalid email or password
                </Text>
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
    },
    titleCont: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: 24,
    },
    newAccountCont: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    invalidLogin: {
        color: 'crimson',
    },
});
