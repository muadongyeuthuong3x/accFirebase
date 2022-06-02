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
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/storage';
import React from 'react';

const Profile = ({ route }) => {
    const [urlImage, setImagePicker] = React.useState('')
    const data = route.params.data;
    const [urlFirebase, seturlFirebase] = React.useState({
        name: '',
        url: '',
        birday:'',
        email: '',
        word: '',
        uid: ''
    })
    React.useEffect(() => {
        database()
            .ref(`/users/${data.uid}`)
            .on('value', snapshot => {
                const data = snapshot.val()
                seturlFirebase({
                    name: data.name,
                    url: data.avatar,
                    birday:data.birday,
                    email: data.email,
                    word: data.word,
                    uid: data.uid
                })
            });
        console.log(urlFirebase)
    }, [data.uid]);
    const [imageSource, setImageSource] = React.useState('')
    const imageUpload = async () => {
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
                seturlFirebase({ ...urlFirebase, url: response.assets[0].uri })
            }
        })
    }

    const sendProfile = async () => {
        const urlName = (urlFirebase.url).substring((urlFirebase.url).lastIndexOf('/') + 1)
        nameTime = new Date().getTime() + urlName
        reference = firebase.storage().ref(nameTime)
        await reference.putFile(urlFirebase.url);
        const refsss = firebase.storage().ref(nameTime);
        const dataImage = await refsss.getDownloadURL()
        const sendData  = {
            ...urlFirebase,
            avatar : dataImage
        }
        database()
            .ref(`/users/${data.uid}`)
            .set(sendData)
    }
    const onChangeName = (e) => {
        seturlFirebase({ ...urlFirebase, name: e })
    }
    return (
        <View style={styles.container}>
            <Text style={styles.colorAvatar}>Avatar cá nhân </Text>
            <TouchableOpacity onPress={imageUpload}>
                <Image
                    style={styles.tinyLogo}
                    source={{
                        uri: urlFirebase.url
                    }}
                />
            </TouchableOpacity>
            <View style={styles.blockName}>
                <Text style={styles.colorText}>Tên của bạn </Text>
                <TextInput
                    placeholder="Name"
                    placeholderTextColor="green"
                    value={urlFirebase.name}
                    style={[
                        styles.textInput,
                    ]}
                    autoCapitalize="none"
                    onChangeText={onChangeName}
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
                            Sửa thông tin
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
        marginTop: 150,
        

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