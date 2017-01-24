import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
} from 'react-native';

import { MonoText } from '../components/StyledText';

export default class LoginScreen extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {userName: '', password: ''};
    }

    static route = {
        navigationBar: {
            visible: false,
        },
    } 

    loginUser = () => {
        console.log("login user");
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
              />
              <TextInput
                  style={styles.textField}
                  placeholder="Password"
                  secureTextEntry={true}
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
