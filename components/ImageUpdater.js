import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    Modal,
} from 'react-native';

import { pickImage } from '../utilities/ImageUtils';
import { Ionicons } from '@exponent/vector-icons';
import Layout from '../constants/Layout';

export default class ImageUpdater extends React.Component {

    constructor(props) {
        super(props);

        this.state = { openModal: false };
    }

    render() { return (
        <View>
            <Image
                source={{uri: this.props.url}}
                style={styles.image}
            />
            <Button
                onPress={() => this.setState({openModal: true})}
                title="Update Photo"
                color="#841584"
            />
            <Modal
                animationType={"slide"}
                visible={this.state.openModal}
                onRequestClose={() => this.setState({openModal: false})}                   
                transparent={true}
                style={styles.modal}
            >
                <View style={styles.popupWrapper} >
                    <View style={styles.popup} >
                        <Text style={styles.popupTitle} >
                            Update Photo
                        </Text>
                        <TouchableOpacity
                            onPress={() => pickImage(this.props.handleImagePicked)}
                        >
                            <View style={styles.option}>
                                <Ionicons name="ios-image-outline" size={40} />                   
                                <Text style={styles.optionText}>
                                    Pick Photo
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            //onPress={() => pickImage(this.props.handleImagePicked)}
                        >
                            <View style={styles.option}>
                                <Ionicons name="ios-camera-outline" size={40} />                   
                                <Text style={styles.optionText}>
                                    Take Photo
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setState({openModal: false})}
                        >
                            <View style={styles.option}>
                                <Ionicons name="ios-close-outline" size={40} />                   
                                <Text style={styles.optionText}>
                                    Cancel
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )}
}


ImageUpdater.propTypes = {
    handleImagePicked: React.PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    image: {
        width: Layout.window.width,
        height: 200,
    },
    popupWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000aa',
    },
    popup: {
        width: Layout.window.width / 2,
        borderRadius: 4,
        backgroundColor: 'white',
        paddingBottom: 20,
    },
    popupTitle: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 8,
    },
    option: {
        marginHorizontal: 24,
        flexDirection: 'row',
    },
    optionText: {
        marginTop: 8,
        marginLeft: 20,
        fontSize: 16,
    },
});
