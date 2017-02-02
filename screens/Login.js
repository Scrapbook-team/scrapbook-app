import React from 'react';
import {
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


export default class Login extends React.Component {
    
    static navigationOptions = {
        title: 'Scrapbook',
        drawer: () => ({
            label: 'Logout',
        }),
    }

    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
    }
    
    componentDidMount() {
        AsyncStorage.removeItem('Scrapbook:UserToken');
        AsyncStorage.removeItem('Scrapbook:UserId');
    }

    loginUser = () => {
        ScrapbookApi.login(this.state.email, this.state.password)
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
