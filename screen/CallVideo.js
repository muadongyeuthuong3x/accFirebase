
import * as React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef()
const CallVideo = ({ navigate }) => {
    const navigation = useNavigation();
    const [idLogin, setIdLogin] = React.useState(0)
    const [dataCall, setDataCall] = React.useState('')
    const getIdUser = async () => {
      const id = await AsyncStorage.getItem("idUser")
      setIdLogin(id)
    }
    React.useEffect(() => {
      getIdUser()
    }, [])
    const getRoomId = () => {
      console.log(idLogin)
      database()
        .ref(`/roomId/${idLogin}`)
        .on('value', snapshot => {
          console.log(dataCall[0])
          if (snapshot.val() != null) {
            setDataCall(Object.values(snapshot.val()))
            setcallSucces(true)
          }else{
            setcallSucces(false)
          }
        });
    }
    React.useEffect(() => {
      getRoomId()
    }, [idLogin])
  
  
     const [callSucces , setcallSucces] = React.useState(false)
    const firestoreCleanUp = async () => {
      const cRef = firestore().collection('meet').doc(dataCall[1]);
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
        await database().ref(`/roomId/${idLogin}`).remove();
        setDataCall()
      }
    }
    const navigateCallVideo = async () => {
      console.log(navigationRef.isReady())
        const data = {
          idRoom: dataCall[1],

          imageYou :dataCall[0],
          idRoom : dataCall[1],
          idFriend : dataCall[2],
          idYou:dataCall[3],
        }
        console.log(data)
        navigation.navigate("ItemChat", data);
        setcallSucces(false)
    }
    if (!!dataCall && callSucces === true) {
        return(
  <View>
    <Image
      style={styles.tinyLogo}
      source={{
        uri: dataCall[0]
      }}
    />
    <View style={styles.grButton}>
      <View style={styles.butonEndCall1}>
        <FontAwesome name="phone" style={styles.iconEndCall1} size={20} onPress={firestoreCleanUp} />
      </View>
      <View>
      </View>
      <View style={styles.buttonCall}>
        <FontAwesome name="phone" style={styles.iconJoinCall1} size={20} onPress={navigateCallVideo} />
      </View>
    </View>
  </View>
  )
    }
     return (
        <View>

        </View>
     )


}

export default CallVideo;

const styles = StyleSheet.create({
    tinyLogo: {
      width: "100%",
      height: "100%",
      backgroundColor: "black"
    },
    chatBottom: {
      marginBottom: 60
    }, iconUser: {
      position: 'absolute',
      top: 0,
      left: '50%',
      color: 'black'
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
      zIndex: 10,
      elevation: 20,
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
      zIndex: 20,
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
    iconEndCall11: {
      color: 'white',
  
      fontSize: 30,
      justifyContent: 'center',
      alignItems: 'center',
      left: -16,
      top: 35,
      transform: [{ rotate: '135deg' }],
    }
  })
  