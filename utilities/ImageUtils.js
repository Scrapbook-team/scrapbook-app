import Exponent, {
  ImagePicker,
} from 'exponent';

export async function pickImage (callback) {

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        aspect: [4,3]
    });

    callback(pickerResult);
}

export function takePhoto() {
    console.log('Take photo');
}

