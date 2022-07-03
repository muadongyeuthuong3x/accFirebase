
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import SignInScreen from "./screen/Login"
import TabBottom from "./navigate/tabBottom"
import ItemChat from "./screen/ItemChat"
import { Provider } from 'react-redux';
import database from '@react-native-firebase/database';
import Profile from "./screen/Profile"
import { store } from './tookit/store';
import { firebase } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CallVideo from './screen/CallVideo';
import VideoCall from './screen/VideoCall';
import {
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {navigationRef} from './navigate/navigation'
import '@react-native-firebase/firestore';
const Stack = createNativeStackNavigator();
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBZkh8nkvgcv6HUWCftIJPkuSZANMvlVLU",
    authDomain: "tathuheo.firebaseapp.com",
    databaseURL: "https://tathuheo-default-rtdb.firebaseio.com",
    projectId: "tathuheo",
    storageBucket: "tathuheo.appspot.com",
    messagingSenderId: "65211879809",
    appId: "1:277423826521:android:baf9811bf6ad9c4cd9f348",
    measurementId: "277423826521"
  })
}
firebase.app().firestore()



export default function App() {
  return (
      <NavigationContainer >
        <Stack.Navigator screenOptions={{ headerShown: false }} >
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <React.Fragment>
            <Stack.Screen name="ListUser" component={TabBottom} />
            <Stack.Screen name="ItemChat" component={ItemChat} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Video" component={VideoCall} />
          </React.Fragment>
        </Stack.Navigator>
         <CallVideo />
      </NavigationContainer>
  );
}


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
