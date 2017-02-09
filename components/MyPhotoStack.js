import { StackNavigator } from 'react-navigation';
import MyPhotos from '../screens/MyPhotos';
import PhotoSwipe from '../screens/PhotoSwipe';

const MyPhotoStack = StackNavigator({
    MyPhotos: {
        screen: MyPhotos,
    },
    PhotoSwipe: {
        screen: PhotoSwipe,
    },
});

export default MyPhotoStack;
