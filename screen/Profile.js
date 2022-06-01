import {
    View,
    StyleSheet,
    TextInput,
    Image,
    Platform,
    Text,
    TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { utils } from '@react-native-firebase/app';
import { firebase } from '@react-native-firebase/storage';
import React  from 'react';

const Profile = () => {
    const [urlImage, setImagePicker] = React.useState('')
    const [imageSource, setImageSource] = React.useState('')
    // const storage = getStorage();
    const imageUpload = async () => {
        // ImagePicker.openCamera({
        //     width: 300,
        //     height: 400,
        //     cropping: true,
        //   }).then(image => {
        //     console.log(image);
        //   });
        let options = {
            mediaType: 'photo',
            quality: 1,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        await launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log("canel image selection")
            } else if (response.errorCode === 'others') {
                console.log('permission nit satidfield')
            } else if (response.errorCode === 'permission') {
                console.log('permission nit satidfield')
            } else if (response.assets[0].fileSize > 2097152) {
                console.log("max file")
            } else {
                console.log(response)
                setImagePicker(response.assets[0].uri)
                // setImageSource(response.assets[0])
            }
        })
    }

    const sendProfile = async () => {
        console.log("AAAA")
         const urlName = urlImage.substring(urlImage.lastIndexOf('/') + 1)
        // let reference = storage().ref(urlName);       
        const reference =  firebase.storage().ref(urlName)
        let task = await reference.putFile(urlImage);       
          console.log(task)

        // const imagesRef = ref(storage, 'images');
       
       
        // const uploadUri = Platform.OS === 'ios' ? urlImage.replace('file://', '') : urlImage
        // const spaceRef = ref(storage, urlName);
        // const reference =await  storage().ref(urlName).putFile(urlImage);
        // const metadata = {
        //     contentType: 'image/jpeg',
        //   };
        // uploadBytes(spaceRef , file, metadata);  

    }
    return (
        <View style={styles.container}>
            <Text style={styles.colorAvatar}>Avatar ca nhan</Text>
            <TouchableOpacity onPress={imageUpload}>
                <Image
                    style={styles.tinyLogo}
                    source={{
                        uri: urlImage
                    }}
                />
            </TouchableOpacity>
            <View style={styles.blockName}>
                <Text style={styles.colorText}>Ten dai dien</Text>
                <TextInput
                    placeholder="Name"
                    placeholderTextColor="green"
                    style={[
                        styles.textInput,
                    ]}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.button}>
                <TouchableOpacity style={styles.signIn} onPress={sendProfile}>
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}>
                        <Text
                            style={[
                                styles.textSign,
                                {
                                    color: '#fff',
                                },
                            ]}>
                            Update thong tin
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 200

    },
    tinyLogo: {
        height: 100,
        width: 100,
        marginTop: 10,
        borderRadius: 50
    },
    colorAvatar: {
        color: "#009385",
        fontSize: 20,
        fontWeight: "500"
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: "red",
        width: 200
    },
    blockName: {
        flexDirection: 'row'
    },
    colorText: {
        color: "#009385",
        fontSize: 20,
        marginRight: 20,
        marginTop: 22
    },
    signIn: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        width: 200,
        marginTop: 20
    },

})