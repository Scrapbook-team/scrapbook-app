import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper'
import PhotoView from 'react-native-photo-view'
import { StackNavigator } from 'react-navigation';
const { width, height } = Dimensions.get('window')

var styles = {
  wrapper: {
    backgroundColor: '#000',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    width,
    flex: 1
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  thumbWrap: {
    marginTop: 100,
    borderWidth: 5,
    borderColor: '#000',
    flexDirection: 'row'
  },
  thumb: {
    width: 50,
    height: 50
  }
}

const renderPagination = (index, total, context) => {
  return (
    <View style={{
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      top: 25,
      left: 0,
      right: 0
    }}>
      <View style={{
        borderRadius: 7,
        backgroundColor: 'rgba(255,255,255,.15)',
        padding: 3,
        paddingHorizontal: 7
      }}>
        <Text style={{
          color: '#fff',
          fontSize: 14
        }}>{index + 1} / {total}</Text>
      </View>
    </View>
  )
}

const Viewer = props => <Swiper index={props.index} style={styles.wrapper} renderPagination={renderPagination}>
  {
    props.imgList.map((item, i) => <View key={i} style={styles.slide}>
      <TouchableWithoutFeedback>
        <Image
          source={{uri: item.urls[0]}}
          style={styles.photo} />
      </TouchableWithoutFeedback>
    </View>)
  }
</Swiper>

export default class PhotoSwipe extends Component {

    static navigationOptions = {
        title: 'Photos',
    };

  constructor (props) {
    super(props)
    this.state = {
      imgList: [
        'https://avatars3.githubusercontent.com/u/533360?v=3&s=466',
        'https://assets-cdn.github.com/images/modules/site/business-hero.jpg',
        'https://placeholdit.imgix.net/~text?txtsize=29&txt=350%C3%971150&w=350&h=1150'
      ],
      showViewer: true,
      showIndex: 0
    }
  }

    render () {
        const { params } = this.props.navigation.state;
        console.log(this.props.navigation);
        
        return (
            <View style={{position: 'relative'}}>
                {this.state.showViewer && <Viewer
                index={params.index}
                imgList={params.photos} />}
            </View>
        )
    }
}
