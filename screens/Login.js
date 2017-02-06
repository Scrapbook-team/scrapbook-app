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
            .then((r) => {
                console.log(r.status);
                if(r.status >= 200 && r.status < 300) {
                    r.json().then((user) => {
                        console.log(user.token);
    //                        this.setState({user});
                        Promise.all([
                            AsyncStorage.setItem('Scrapbook:UserToken', user.token),
                            AsyncStorage.setItem('Scrapbook:UserId', user.id)
                        ]).then(this.props.navigation.navigate('Home'));
                    })
                } else {
                    console.log("setting stuff")
                    this.setState({credential: update(this.state.credential, {password: {$set: ''}}), showInvalid: true});
                }
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
              <Text style={styles.title} >
                  Scrapbook
              </Text>
              <View>
                  <Form
                    ref="form"
                    value={this.state.credential}
                    onChange={credential => {this.setState({credential})}}
                    type ={Credential}/>
                  <Button
                      onPress={this.loginUser}
                      title="LOGIN"
                      color="#841584"
                  />
                  {this.state.showInvalid && this.renderInvalid()}
              </View>
              <Button
                  style={styles.newAccount}
                  onPress={this.register}
                  title="CREATE NEW SCRAPBOOK ACCOUNT"
                  color="#841584"
              />
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
        justifyContent: 'space-around',
    },
    title:{
      textAlign: 'center',
      fontSize: 24,
    },
    textField: {
        height: 40,
    },
    newAccount: {
        marginTop: 10,
    },
    invalidLogin: {
        color: 'crimson',
    },
});
