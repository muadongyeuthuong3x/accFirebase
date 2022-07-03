import {
    View,
    StyleSheet,
    TextInput,
    SafeAreaView,
    Image,
    FlatList,
    Text,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { Dimensions  } from 'react-native';
import database from '@react-native-firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React , {useRef ,useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Utils from './Utils';
import { firebase, getDownloadURL } from '@react-native-firebase/storage';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
  } from 'react-native-webrtc';

const ItemChat = ({ route, navigation }) => {

    const data = route.params;
    console.log(data)
    const {idInformationFriend ,roomId } = data
    const [message, setMessage] = React.useState('');
    const [allChat, setAllChat] = React.useState('');
    const [urlBe, setUrlBE] = React.useState('');
    const [informationUserm  , setInformationUser] = React.useState('')
    const urlImageFirebase = async (data) => {
        const url = firebase.storage().ref(data)
        const datas = await getDownloadURL(url)
        return datas
        //  return  datas
    }

    const getInformationUser = ()=>{
        database()
             .ref(`/users/${data.idFriend}`)
             .on('value', snapshot => {
               setInformationUser(snapshot.val())
             });
         }
        React.useEffect(() => {
             getInformationUser()
         }, []);
         

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.paddingChat}>
                {(item.to !== data.idFriend) ? (


                    <View style={styles.friendChat}>
                        <Image
                            style={styles.imgChat}
                            source={{
                                uri: informationUserm.avatar
                            }}
                        />{
                            item.msgType === 'text' ?

                                <Text style={styles.textChat}>{item.message}</Text> :
                                <Image
                                    style={styles.imgSend}
                                    source={{uri: item.message !=="" ? item.message : undefined }}

                                />
                        }
                    </View>
                ) : (
                    <View style={styles.rightUser}>
                        {
                            item.msgType === 'text' ?

                                <Text style={styles.meChat}>{item.message}</Text> :
                                <Image
                                    style={styles.imgSendYou}
                                    source={{uri: item.message !=="" ? item.message : undefined }}
                                />}
                    </View>)}
            </View>
        )
    }
    const onChangeTextMessenger = (e) => {
        setMessage(e)
    }

    const sendMessenger = () => {
        const msgData = {
            roomId: data.idRoom,
            message: message,
            from: data.idYou,
            to: data.idFriend,
            sendTime: moment().format(),
            msgType: 'text'
        }

        const newReference = database()
            .ref('/messages/' + data.idRoom)
            .push();

        msgData.id = newReference.key;
        newReference.set(msgData).then(() => {
            const chatListupdate = {
                lastMsg: message,
                sendTime: msgData.sendTime,
            }
            database()
                .ref('/chatlist/' + data?.idFriend + '/' + data?.idYou)
                .update(chatListupdate)
                .then(() => console.log('Data updated.'));

            database()
                .ref('/chatlist/' + data?.idYou + '/' + data?.idFriend)
                .update(chatListupdate)
                .then(() => console.log('Data updated.'));

            setMessage('')

        }).catch(err => {
            console.log("error")
        })
    }

    React.useEffect(() => {
        const onChildAdd = database()
            .ref('/messages/' + data.idRoom)
            .on('child_added', snapshot => {
                setAllChat((state) => [snapshot.val(), ...state]);
            });
        // Stop listening for updates when no longer required
        return () => database().ref('/messages' + data.idRoom).off('child_added', onChildAdd);
    }, [data.idRoom]);
    const [urlImage, setImagePicker] = React.useState('')
    const imageUpload = async () => {
        let options = {
            mediaType: 'photo',
            quality: 1,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        let reference = ''
        let nameTime = ''
        let urlImagesss = ''
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
                urlImagesss = response.assets[0].uri
                const urlName = response.assets[0].uri.substring(response.assets[0].uri.lastIndexOf('/') + 1)
                nameTime = new Date().getTime() + urlName
                reference = firebase.storage().ref(nameTime)

            }
        })
        await reference.putFile(urlImagesss);
        const refsss = firebase.storage().ref(nameTime);
        console.log(refsss)
        let msgData = '';
        const dataImage = await refsss.getDownloadURL()
            .then(url => { 
                msgData = {
                    roomId: data.idRoom,
                    message: url,
                    from: data.idYou,
                    to: data.idFriend,
                    sendTime: moment().format(),
                    msgType: 'image'
                }
            
            })
            .catch(e => { console.log(e); })

        // const msgData = {
        //     roomId: data.idRoom,
        //     message: urlBe,
        //     from: data.idYou,
        //     to: data.idFriend,
        //     sendTime: moment().format(),
        //     msgType: 'image'
        // }

        const newReference = database()
            .ref('/messages/' + data.idRoom)
            .push();
        msgData.id = newReference.key;
        msgData.id = newReference.key;
        newReference.set(msgData).then(() => {
            const chatListupdate = {
                lastMsg: message,
                sendTime: msgData.sendTime,
                msgType: 'image'
            }
            database()
                .ref('/chatlist/' + data?.idFriend + '/' + data?.idYou)
                .update(chatListupdate)
                .then(() => console.log('Data updated.'));

            database()
                .ref('/chatlist/' + data?.idYou + '/' + data?.idFriend)
                .update(chatListupdate)
                .then(() => console.log('Data updated.'));

            setMessage('')

        }).catch(err => {
            console.log("error")
        })

    }

    //// start code call
    //    const [remte]
    const pc = useRef();
    React.useEffect(() => {
        const cRef = firestore().collection('meet').doc(data.idRoom);

        const subscribe = cRef.onSnapshot(snapshot => {
            const data = snapshot.data()

            // On answer start the call

            if (pc.current && !pc.current.remoteDescription && data && data.answer) {
                pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            }

            // if there is offer chatId set the getting call flag

            if (data && data.offer && !connecting.current) {
                setGettingCall(true)
            }
        })

        const subscribeDelete = firestore().collection('callee').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type == 'removed') {
                    hangup()
                }
            })
        })
        return () => {
            subscribe();
            subscribeDelete();
        }
    }, [])

    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
   
    const [localStream, setLocalStream] = useState()
    const [remoteStream, setRemoteStream] = useState()
    const [gettingCall, setGettingCall] = useState(false)
    const connecting = useRef(false)
    const setUpRtc = async () => {
        pc.current = new RTCPeerConnection(configuration);
        const stream = await Utils.getStream()
        if (stream) {
            setLocalStream(stream)
            pc.current.addStream(stream)
        }
        // Get the remote stream once it is avaiable
        pc.current.onaddstream = (e) => {
            setRemoteStream(e.stream)
        }



    }


    const collectIceCandidates = async (cRef, localName, remoteName) => {
        const candidateCollection = cRef.collection(localName)
        if (pc.current) {
            // on new ICE candidate add it to firebase
            pc.current.onicecandidate = (e) => {
                if (e.candidate) {
                    candidateCollection.add(e.candidate)
                }
            }
        }


        // get the  ICE candidate added to firebase and update the local PC

        cRef.collection(remoteName).onSnapshot(onResult => {
            onResult.docChanges().forEach(change => {
                if (change.type == 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current?.addIceCandidate(candidate)
                }
            })
        });
    }


    const join = async () => {
        setGettingCall(false)
        connecting.current = true;
        const cRef = firestore().collection('meet').doc(data.idRoom);
        const offer = (await cRef.get()).data()?.offer;


        if (offer) {

            await setUpRtc()

            // Exchange the ICE candidates
            //Check the parameter , Its reversed .Since the joining part is callee
            collectIceCandidates(cRef, 'callee', 'caller')
            if (pc.current) {
                pc.current.setRemoteDescription(new RTCSessionDescription(offer))

                // create the answer for the call
                //Update the document with answer

                const answer = await pc.current.createAnswer();
                pc.current.setLocalDescription(answer)
                const cWithAnswer = {
                    answer: {
                        type: answer.type,
                        sdp: answer.sdp
                    }
                };
                cRef.update(cWithAnswer)
            }
        }
    }

    const hangup = async () => {
        connecting.current = false;
        streamCleanUp();
        setGettingCall(false)
        firestoreCleanUp();
        if (pc.current) {
            pc.current.close()
        }
    }

    // helper function 


    const streamCleanUp = async () => {
        if (localStream) {
            localStream.getTracks().forEach(e => e.stop());
            localStream.release()
        }

        setLocalStream(null);
        setRemoteStream(null);
    }

    const firestoreCleanUp = async () => {
        const cRef = firestore().collection('meet').doc(data.idRoom);
        if (cRef) {
            const calleeCandidate = await cRef.collection('callee').get();
            calleeCandidate.forEach(async (candidate) => {
                await candidate.ref.delete();
            })
            const callerCandidate = await cRef.collection('caller').get();
            callerCandidate.forEach(async (candidate) => {
                await candidate.ref.delete();
            })
            cRef.delete();
        }
    }


    ////End call Video


    const navigaetCallVideo = async () => {
        connecting.current = true
        await setUpRtc()
        //  Document for the call
        const cRef = firestore().collection('meet').doc(data.idRoom);
        // Exchange the ICE candidates between the caller and calle
        collectIceCandidates(cRef, 'caller', 'callee')

        // create the offer for the call
        //Store the offer under the document
        if (pc.current) {
            const offer = await pc.current.createOffer();
            pc.current.setLocalDescription(offer)
            const cWithOffer = {
                offer: {
                    type: offer.type,
                    sdp: offer.sdp
                }
            }

            cRef.set(cWithOffer)
        }

    }


    if (gettingCall === true) {
        return <View style={styles.grButton}>
            <View style={styles.butonEndCall1}>
                <FontAwesome name="phone" style={styles.iconEndCall1} size={20} onPress={hangup} />
            </View>
            <View>
            </View>
            <View style={styles.buttonCall}>
                <FontAwesome name="phone" style={styles.iconJoinCall1} size={20} onPress={join} />
            </View>
        </View>
    }

    if (localStream && !remoteStream) {
        return (
            <View style={styles.videoMeSTart}>
                <RTCView streamURL={localStream?.toURL()} objectFit={"cover"} style={styles.localCall} />
                <View style={styles.butonEndCall}>
                    <FontAwesome name="phone" style={styles.iconEndCall} size={20} onPress={hangup} />
                </View>
            </View>
        )
    }
    if (localStream && remoteStream) {
        return (
            <View style={styles.container}>
                <RTCView streamURL={remoteStream?.toURL()} objectFit={"cover"} style={styles.videoYou} />
                <RTCView streamURL={localStream?.toURL()} objectFit={"cover"} style={styles.videoMe} />
                <View style={styles.grButton}>
                    <View style={styles.butonEndCall11}>
                        <FontAwesome name="phone" style={styles.iconEndCall11} size={20} onPress={hangup} />
                    </View>
                    {/* <View style={styles.buttonCall}>
                        <FontAwesome name="phone" style={styles.iconJoinCall1} size={20} onPress={join} />
                    </View> */}
                </View> 
            </View>
        )
    }
    return (

        <View style={styles.messengerChat}>
            <View style={styles.header}>
                <View style={styles.iconAvatar}>
                    <FontAwesome name="arrow-left" style={styles.arrowleft} size={20} />
                    <View style={styles.avatarTextName}>
                        <Image
                            style={styles.tinyLogo}
                            source={{
                                uri: informationUserm?.avatar
                            }}
                        />
                        <View style={styles.contentAvatar}>
                            <Text style={styles.name}>{informationUserm?.name}</Text>
                            <Text style={styles.timeOnline}>Hoat dong 45p</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.callVideo}>
                    <FontAwesome name="phone" style={styles.arrowleft} size={20} />
                    <Icon name="video" style={styles.arrowleft} size={20} onPress={navigaetCallVideo} />
                </View>
            </View>

            <FlatList
                style={styles.chatBottom}
                showsVerticalScrollIndicator={false}
                data={allChat}
                inverted
                renderItem={renderItem}
                keyExtractor={item => item.uid}
            />

            <View style={styles.viewInputChat}>
                <KeyboardAvoidingView style={styles.formChat}>
                    <TouchableOpacity onPress={imageUpload}>
                        <Icon
                            name="image"
                            style={styles.iconImage}
                            size={25}
                            onPress={imageUpload}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn ..."
                        accessible={false}
                        value={message}
                        onChangeText={onChangeTextMessenger}
                    />
                    <View>
                        <TouchableOpacity onPress={() => sendMessenger()}>
                            <Icon
                                onPress={() => sendMessenger()}
                                name="paper-plane"
                                style={styles.iconSend}
                                size={20}
                            />

                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>

            {/* buttonChat */}
        </View>

    );
};

export default ItemChat;

const styles = StyleSheet.create({
    arrowleft: {
        color: "#2982f7",
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10
    },


    videoCall: {
        position: 'relative',
        backgroundColor: 'red',
        with: '100%',
        height: '100%',
        zIndex: 1
    },
    header: {
        borderBottomColor: "#D8D8D8",
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5

    },
    imgChat: {
        width: 45,
        height: 45,
        borderRadius: 25
    },
    iconAvatar: {
        flexDirection: 'row'
    },
    tinyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    name: {
        fontWeight: "900",
        fontSize: 19,
        color: 'black'
    },
    timeOnline: {
        fontSize: 10,
        fontWeight: '400',
        color: 'black'
    },
    avatarTextName: {
        flexDirection: 'row'
    },
    contentAvatar: {
        marginLeft: 10
    },
    callVideo: {
        flexDirection: 'row',
        paddingRight: 20
    },
    formChat: {

        paddingHorizontal: 20,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
        justifyContent: 'space-evenly'
    },
    imgSend: {
        width: 120,
        height: 120,
        marginLeft: 10,
        marginBottom: 5,
        borderRadius: 10
    },
    imgSendYou: {
        width: 120,
        height: 120,
        marginBottom: 10,
        borderRadius: 10,
        marginRight: 10
    },
    rightUser: {
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    paddingChat: {
        paddingHorizontal: 10
    },
    textChat: {
        fontSize: 19,
        fontWeight: "600",
        color: "black",
        backgroundColor: "#E4E6EB",
        padding: 10,
        borderRadius: 40,
        marginBottom: 10,
        marginLeft: 10,
        maxWidth: 150
    },
    meChat: {
        fontSize: 19,
        fontWeight: "600",
        color: "white",
        backgroundColor: '#2982f7',
        padding: 10,
        borderRadius: 40,
        marginBottom: 10,
        marginTop: 10,
        marginRight: 10
    },
    friendChat: {
        maxWidth: 3 * (Dimensions.get('window').width) / 4,
        flexDirection: 'row'
    },
    rightUser: {
        marginLeft: 1 * (Dimensions.get('window').width) / 4,
        width: 3 * (Dimensions.get('window').width) / 4 - 20,
        alignItems: "flex-end"
    },
    input: {
        backgroundColor: "#e9eaeb",
        borderRadius: 50,
        paddingLeft: 20,
        height: 45,
        color: "black",
        width: (Dimensions.get('window').width) - 120,

    },
    iconSend: {
        color: "#2982f7",
        marginTop: 2,
        marginLeft: 10,
        padding: 10
    },
    iconImage: {
        color: "#2982f7",
        marginTop: 10,
        marginRight: 10
    },
    viewInputChat: {
        position: "absolute",
        bottom: 0,
        flex: 1,
        backgroundColor: "#ffff"

    },
    messengerChat: {
        flex: 1
    },
    chatBottom: {
        marginBottom: 60
    }, iconUser: {
        position: 'absolute',
        top: 0,
        left: '50%',
        color: 'red'
    },
    videoYou: {
        position: 'relative',
        top: 0,
        left: 0,
        width: "100%",
        height: "50%",
        zIndex: 1,
        elevation: 10,

    },
    videoMe: {
        position: 'relative',
        left: 0,
        width: "100%",
        height: "50%",
        elevation: 10,
        zIndex: 10,

    },
    videoMeSTart: {
        position: 'relative',
        width: "100%",
        height: '100%',
    },
    localCall: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    butonEndCall: {
        position: 'absolute',
        top: 500,
        left: '45%',
        backgroundColor: 'red',
        width: 70,
        height: 70,
        zIndex:10,
        elevation:20,
        borderRadius: 35,

    },
    iconEndCall: {
        color: 'white',
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        left: -16,
        top: 35,
        transform: [{ rotate: '135deg' }],
    },
    iconJoinCall: {
        color: 'white',
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        left: -16,
        top: 35,
        transform: [{ rotate: '135deg' }],
    },
    grButton: {
        display: 'flex',
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex:20,
        elevation: 5,

    },
    iconEndCall1: {
        color: 'white',
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        left: -16,
        top: 35,
        transform: [{ rotate: '135deg' }],
    },
    iconJoinCall1: {
        color: 'white',
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        top: -5,
        transform: [{ rotate: '270deg' }],
    },
    buttonCall: {
        position: 'absolute',
        top: 500,
        left: 300,
        backgroundColor: 'green',
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    butonEndCall1: {
        position: 'relative',
        top: 500,
        left: '60%',
        backgroundColor: 'red',
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    butonEndCall11: {
        position: 'relative',
        top: 500,
        left: 160,
        backgroundColor: 'red',
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    iconEndCall11:{
        color: 'white',
        
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        left: -16,
        top: 35,
        transform: [{ rotate: '135deg' }],
    }
})
