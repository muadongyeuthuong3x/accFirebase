import React from 'react';
import { View , Text ,StyleSheet } from 'react-native';
import {MediaStream} from 'react-native-webrtc'
const VideoCall = () => {

    const servers = {
        iceServers: [
            {
                urls: [
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    };
    const pc = new RTCPeerConnection(servers);

    const localRef = useRef();
    const remoteRef = useRef();

    const setupSources = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });
        localRef.current.srcObject = localStream;
    
    }
    return (
        <View>
       <RTCView streamURL={streamURL} style={styles.videoMe} objectFit={'cover'}/>
        </View>
    );
}

export default VideoCall;


const styles = StyleSheet.create({
    videoMe: {
       position: 'absolute',
       with: '100%',
       height: '100%'    },

})