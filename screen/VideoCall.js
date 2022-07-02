import React, { useRef, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { View, Text, StyleSheet } from 'react-native';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Utils from './Utils';
const VideoCall = () => {

    const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
    const pc = useRef();
    const [localStream, setLocalStream] = useState()
    const [remoteStream, setRemoteStream] = useState()
    const [gettingCall, setGettingCall] = useState(true)
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
        //  Document for the call
        const cRef = firestore().collection('meet').doc('chatId');

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
            console.log(onResult)
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
        const cRef = firestore().collection('meet').doc('chatId');
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
        const cRef = firestore().collection('meet').doc('chatId');
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

    React.useEffect(() => {
        setUpRtc()
    }, []);

    if(gettingCall){
        return <View>
            <TouchableOpacity onPress={join}>
             <FontAwesome
                                name="eye-slash"
                                style={styles.securystyle}
                                size={20}
                            />
                            </TouchableOpacity>
        </View>
    }

    if (localStream && !remoteStream) {
        return (
            <View style={styles.container}>
                    <RTCView streamURL={localStream?.toURL()} objectFit={"cover"} style={styles.videoMe} />
                    <View style={styles.butonEndCall}>
                        <Text>call</Text>
                    <FontAwesome
                        name="lock"
                        style={styles.iconUser}
                        size={20}
                    />
                    </View>
            </View>
        )
    }
    if (localStream && remoteStream) {
        return (
            <View style={styles.container}>
                    <RTCView streamURL={localStream?.toURL()} objectFit={"cover"} style={styles.videoMe} />
                    <RTCView streamURL={remoteStream?.toURL()} objectFit={"cover"} style={styles.videoYou} />
                    <View style={styles.butonEndCall}>
                    <FontAwesome
                        name="lock"
                        style={styles.iconUser}
                        size={20}
                    />
                     <FontAwesome
                        name="lock"
                        style={styles.iconUser}
                        size={100}
                    />
                    </View>
            </View>
        )
    }
    return (
        <View>

        </View>
    )
}

export default VideoCall;


const styles = StyleSheet.create({

    container: {
    },
    videoMe: {
        position: 'relative',
        with: 100,
        height: 200,
        left: '50%',
        right: '10%',
        marginRight: 30,
        top: 50,
        elevation: 10,
        zIndex: 10,
        borderRadius: 10
    },

    videoCall: {
        position: 'relative',
        backgroundColor: 'red',
        with: '100%',
        height: '100%',
        zIndex: 1
    },
    iconUser:{
        position:'absolute',
        top: 300,
        left:'50%',
        color:'red'
    },
    videoYou:{
        position: 'relative',
        with: '100%',
        height: '100%',
        zIndex: 1,
    }
    
})