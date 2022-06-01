
// import {
//     View,
//     StyleSheet,
//     TextInput,
//     SafeAreaView,
//     Image,
//     FlatList,
//     Text,
//     KeyboardAvoidingView,
//     Keyboard
// } from 'react-native';
// import { Dimensions } from 'react-native';
// import database from '@react-native-firebase/database';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import React from 'react';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import moment from 'moment';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { firebase, getDownloadURL } from '@react-native-firebase/storage';



// const uploadImage = ({imageUpload}) => {
  
//     const imageUpload = async () => {
//         let options = {
//             mediaType: 'photo',
//             quality: 1,
//             storageOptions: {
//                 skipBackup: true,
//                 path: 'images'
//             }
//         }
//         let reference = ''
//         let nameTime = ''
//         await launchImageLibrary(options, response => {
//             if (response.didCancel) {
//                 console.log("canel image selection")
//             } else if (response.errorCode === 'others') {
//                 console.log('permission nit satidfield')
//             } else if (response.errorCode === 'permission') {
//                 console.log('permission nit satidfield')
//             } else if (response.assets[0].fileSize > 2097152) {
//                 console.log("max file")
//             } else {
//                 setImagePicker(response.assets[0].uri)
//                 const urlName = response.assets[0].uri.substring(response.assets[0].uri.lastIndexOf('/') + 1)
//                 nameTime = new Date().getTime() + urlName
//                 reference = firebase.storage().ref(nameTime)

//             }
//         })

//         await reference.putFile(urlImage);
//         const refsss = firebase.storage().ref(nameTime);
//         let msgData = '';
//         const dataImage = await refsss.getDownloadURL()
//             .then(url => { 
//                 msgData = {
//                     roomId: data.idRoom,
//                     message: url,
//                     from: data.idYou,
//                     to: data.idFriend,
//                     sendTime: moment().format(),
//                     msgType: 'image'
//                 }
            
//             })
//             .catch(e => { console.log(e); })
//         const newReference = database()
//             .ref('/messages/' + data.idRoom)
//             .push();
//         msgData.id = newReference.key;
//         msgData.id = newReference.key;
//         newReference.set(msgData).then(() => {
//             const chatListupdate = {
//                 lastMsg: message,
//                 sendTime: msgData.sendTime,
//                 msgType: 'image'
//             }
//             database()
//                 .ref('/chatlist/' + data?.idFriend + '/' + data?.idYou)
//                 .update(chatListupdate)
//                 .then(() => console.log('Data updated.'));

//             database()
//                 .ref('/chatlist/' + data?.idYou + '/' + data?.idFriend)
//                 .update(chatListupdate)
//                 .then(() => console.log('Data updated.'));

//             setMessage('')

//         }).catch(err => {
//             console.log("error")
//         })

//     }

//   return (
//     <Icon
//     name="image"
//     style={styles.iconImage}
//     size={25}
//     onPress={imageUpload}
// />
//   )

// }

// export default uploadImage;

// const styles = StyleSheet.create({
//     arrowleft: {
//         color: "#8BB451",
//         paddingTop: 15,
//         paddingLeft: 10,
//         paddingRight: 10
//     },
//     header: {
//         borderBottomColor: "#D8D8D8",
//         borderBottomWidth: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 5

//     },
//     imgChat: {
//         width: 50,
//         height: 50,
//         borderRadius: 25
//     },
//     iconAvatar: {
//         flexDirection: 'row'
//     },
//     tinyLogo: {
//         width: 40,
//         height: 40,
//         borderRadius: 20
//     },
//     name: {
//         fontWeight: "900",
//         fontSize: 17,
//         color: 'black'
//     },
//     timeOnline: {
//         fontSize: 10,
//         fontWeight: '400',
//         color: 'black'
//     },
//     avatarTextName: {
//         flexDirection: 'row'
//     },
//     contentAvatar: {
//         marginLeft: 10
//     },
//     callVideo: {
//         flexDirection: 'row',
//         paddingRight: 20
//     },
//     formChat: {

//         paddingHorizontal: 20,
//         elevation: 5,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 7,
//         justifyContent: 'space-evenly'
//     },
//     imgSend: {
//         width: 100,
//         height: 100
//     },
//     imgSendYou: {
//         width: 100,
//         height: 100,
//     },
//     rightUser: {
//         justifyContent: "flex-end",
//         alignItems: "flex-end"
//     },
//     paddingChat: {
//         paddingHorizontal: 10
//     },
//     textChat: {
//         fontSize: 20,
//         fontWeight: "600",
//         color: "black",
//         backgroundColor: "#E4E6EB",
//         padding: 20,
//         borderRadius: 40,
//         marginBottom: 10,
//         marginTop: 10,
//         maxWidth: 150
//     },
//     meChat: {
//         fontSize: 20,
//         fontWeight: "600",
//         color: "white",
//         backgroundColor: '#2982f7',
//         padding: 10,
//         borderRadius: 40,
//         marginBottom: 10,
//         marginTop: 10
//     },
//     friendChat: {
//         maxWidth: 3 * (Dimensions.get('window').width) / 4,
//         flexDirection: 'row'
//     },
//     rightUser: {
//         marginLeft: 1 * (Dimensions.get('window').width) / 4,
//         width: 3 * (Dimensions.get('window').width) / 4 - 20,
//         alignItems: "flex-end"
//     },
//     input: {
//         backgroundColor: "#e9eaeb",
//         borderRadius: 50,
//         paddingLeft: 20,
//         height: 50,
//         color: "black",
//         width: (Dimensions.get('window').width) - 80,

//     },
//     iconSend: {
//         color: "#8BB451",
//         marginTop: 2,
//         marginLeft: 10,
//         padding: 10
//     },
//     iconImage: {
//         color: "#8BB451",
//         marginTop: 10,
//         marginRight: 10
//     },
//     viewInputChat: {
//         position: "absolute",
//         bottom: 0,
//         flex: 1,
//         backgroundColor: "#ffff"

//     },
//     messengerChat: {
//         flex: 1
//     },
//     chatBottom: {
//         marginBottom: 60
//     }

// })
