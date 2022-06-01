import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { signIn } from './../firebase/firebase'
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import SimpleToast from 'react-native-simple-toast';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState("cuong@gmail.com");
    const [password, setPassword] = useState('123456');
    const [secure, setSecure] = useState(true);


    const onClickPressLogin = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                navigation.navigate('ListUser', {
                    data: res.user
                });
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    SimpleToast.show("Invalid Email Id!");
                }

                if (error.code === 'auth/invalid-email') {
                    SimpleToast.show("Invalid Password Id!");
                }

                console.error(error);
            });
    }


    // const onClickPressLogin = async () => {
    //     if (email == '' || password == '') {
    //         Toast.show('Can nhap du email va password');
    //         return false;
    //     }

    //     // create user
    //     auth()
    //         .createUserWithEmailAndPassword(email, password)
    //         .then((res) => {
    //             const { email, uid } = res.user
    //             const data = {
    //                 email,
    //                 uid,
    //                 name: "Thu heo quay",
    //                 word: "Tester",
    //                 birday: "26/01/1999",
    //                 avatar: "https://scontent.fhan5-9.fna.fbcdn.net/v/t39.30808-1/281596605_1018527299059547_2699710644885802828_n.jpg?stp=dst-jpg_p320x320&_nc_cat=109&ccb=1-7&_nc_sid=7206a8&_nc_ohc=eBQa_tqCEL0AX_0sYo9&_nc_ht=scontent.fhan5-9.fna&oh=00_AT8oPXZUYO7QtX7RvygRJZWcDKLcvmxG9145qSetpMdEKA&oe=628B2C9D"
    //             }
    //             database()
    //                 .ref('/users/' + data.uid)
    //                 .set(data)
    //                 .then(() => console.log("tao oke"));
    //             firestore().collection('users').add(data)
    //         })
    //         .catch(error => {
    //             if (error.code === 'auth/email-already-in-use') {
    //                 console.log('That email address is already in use!');
    //             }

    //             if (error.code === 'auth/invalid-email') {
    //                 console.log('That email address is invalid!');
    //             }

    //             console.error(error);
    //         });
    // }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#009387" barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>App Chat KMA </Text>
            </View>

            <Animatable.View
                animation="fadeInUp"
                style={[
                    styles.footer,
                ]}>
                <Text style={[styles.text_footer,]}>Email </Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="user"
                        style={styles.iconUser}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Email"
                        placeholderTextColor="green"
                        style={[
                            styles.textInput,
                        ]}
                        autoCapitalize="none"
                        onChangeText={val => setEmail(val)}
                    />
                </View>

                <Text style={[styles.text_footer]}>
                    Password
                </Text>
                <View style={styles.action}>
                    <FontAwesome
                        name="lock"
                        style={styles.iconUser}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="green"
                        style={[
                            styles.textInput,
                        ]}
                        autoCapitalize="none"
                        secureTextEntry={secure}
                        onChangeText={val => setPassword(val)}
                    />
                    <TouchableOpacity >
                        {secure ? (
                            <FontAwesome name="eye" style={styles.securystyle} size={20} />
                        ) : (
                            <FontAwesome
                                name="eye-slash"
                                style={styles.securystyle}
                                size={20}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {/* button login  */}
                <View style={styles.button}>
                    <TouchableOpacity style={styles.signIn} onPress={onClickPressLogin}>
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
                                Sign In
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>


            </Animatable.View>
        </View>
    );
};
export default SignInScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009385',
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
        marginTop: 10,
        padding: 1,
    },
    action: {
        flexDirection: 'row',
        marginTop: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'red',
    },
    textInput: {
        flex: 1,
        paddingLeft: 13,
    },
    iconUser: {
        marginTop: 12,
    },
    securystyle: {
        marginTop: 12,
    },
    button: {
        marginTop: 50,
    },
    buttonRegister: {
        marginTop: 20,
    },
    signIn: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
    },
    textSign: {
        color: 'red',
    },
    registerstyle: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
    },
});