import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';
import ScrapbookApi from '../api/ScrapbookApi';

export default class LoginScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
    }

    static route = {
        navigationBar: {
            visible: false,
        },
    } 

    loginUser = () => {
        console.log("login user");
        ScrapbookApi.login(this.state.email, this.state.password);
    }

    render() {
        return (
            <View style={styles.container}>
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
              <Button
                  onPress={this.loginUser}
                  title="Login"
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
    textField: {
        height: 40,
    }
});
