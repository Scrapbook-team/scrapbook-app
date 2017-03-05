import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default (user) => (
    <View style={styles.profileWrapper}>
        { user.profile &&
            <Image
                source={{uri: user.profile.urls[0]}}
                style={styles.profile}
            />
        }
        { !user.profile &&
            <View style={styles.defaultProfile} />
        }
        <Text style={styles.profileName}>
            {`${user.firstName + ' ' + user.lastName}`}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    profileWrapper: {
        flexDirection: 'row',
        marginHorizontal: 12,
        marginTop: 12,
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    defaultProfile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'grey',
    },
    profileName: {
        fontSize: 16,
        marginLeft: 12,
        marginTop: 4,
    },
});
