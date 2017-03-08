import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';


export default (member) => (
    <View style={styles.membersListItem} >
        <Text style={styles.membersListText}>
            {`${member.firstName + ' ' + member.lastName}`}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    membersListItem: {
        height: 24,
        borderRadius: 12,
        marginRight: 4,
        marginBottom: 4,
        backgroundColor: 'grey',
    },
    membersListText: {
        color: 'white',
        marginHorizontal: 12,
    },
});
