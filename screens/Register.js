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

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';
import ApiUtils from '../utilities/ApiUtils';


export default class Register extends React.Component {

    static navigationOptions = {
        title: 'Scrapbook',
        drawer: () => ({
            label: 'Register',
        }),
    }

    constructor(props) {
        super(props);
        this.state = {email: '', password: '', firstName: '', lastName: ''};
    }

    componentDidMount() {

    }

    registerUser = () => {
        ScrapbookApi.register(this.state.email, this.state.password, this.state.firstName, this.state.lastName)
            .then(ApiUtils.checkStatus)
            .then((r) => {
                return r.json();
            })
            .then((r) => {
                user = r;
                console.log(user);
                this.setState({user});
                AsyncStorage.setItem('Scrapbook:UserToken', user.token);
                AsyncStorage.setItem('Scrapbook:UserId', user.id);
                this.props.navigation.navigate('Home');
            })
            .catch(e => console.log(e));
    }

    render() {
        return (
            <KeyboardAvoidingView
              behavior={'padding'}
              style={styles.container}>
              <Text>
                  Scrapbook
              </Text>
              <TextInput
                  style={styles.textField}
                  placeholder="Email"
                  onChangeText={(email) => this.setState({email})}
              />
              <TextInput
                  style={styles.textField}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(password) => this.setState({password})}
              />
              <TextInput
                  style={styles.textField}
                  placeholder="First Name"
                  onChangeText={(firstName) => this.setState({firstName})}
              />
              <TextInput
                  style={styles.textField}
                  placeholder="Last Name"
                  onChangeText={(lastName) => this.setState({lastName})}
              />
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
    textField: {
        height: 40,
    }
});
