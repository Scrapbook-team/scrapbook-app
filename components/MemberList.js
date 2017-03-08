import React from 'react';
import {
    StyleSheet,
    Text,
    ListView,
    View,
} from 'react-native';

import Layout from '../constants/Layout';

export default class MemberList extends React.Component {

    constructor(props) {
        super(props);

        const members = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = { members: members.cloneWithRows(this.props.members), };
    }

    _renderMemberListItem(data) {
        return (
            <View style={styles.membersListItem} >
                <Text style={styles.membersListText}>
                    {`${data.firstName + ' ' + data.lastName}`}
                </Text>
            </View>
        );
    }

    render() { return (
        <ListView
            dataSource={this.state.members}
            renderRow={this._renderMemberListItem.bind(this)}
            contentContainerStyle={styles.membersList}
        />
    )}
}


MemberList.propTypes = {
    members: React.PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
     membersList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
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
