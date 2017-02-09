import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  ListView,
} from 'react-native';
import SettingsList from 'react-native-settings-list';

export default class Settings extends React.Component {

    static navigationOptions = {
        title: 'Settings',
        drawer: () => ({
            label: 'Settings',
        }),
    }


    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.container}>
                <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                    <SettingsList.Item
                        hasNavArrow={false}
                        title='Sign Out'
                        onPress={this.logout}/>
                </SettingsList>
            </View>
        );
    }

    logout = () => {
        this.props.navigation.navigate('Login');
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
