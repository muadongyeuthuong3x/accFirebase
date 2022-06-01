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
import { Dimensions } from 'react-native';
import database from '@react-native-firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React, { useEffect , useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { firebase, getDownloadURL } from '@react-native-firebase/storage';


const RenderItem = ({item}) => {
   
    const [informationUserm  , setInformationUser] = useState('')
    const getInformationUser = ()=>{
   database()
        .ref(`/users/${item.idInformationFriend}`)
        .on('value', snapshot => {
          setInformationUser(snapshot.val())
        });
    }
    useEffect(() => {
        getInformationUser()
    }, []);
    

    return (

        <View key={item.roomId}  style={styles.itemchat}>
         <Image
                    style={styles.tinyLogo}
                    source={{
                        uri: informationUserm.avatar
                    }}
                />
                <View style={styles.itemchatRight}>
                    <View><Text style={styles.name}> {informationUserm?.name}</Text></View>

                    <View style={styles.contentnd}>
                        {
                            item.type
                        }
                        <Text style={styles.itemChat}> { (item?.lastMsg).length >10 ?    (item?.lastMsg).slice(0, 10).concat("...") : item?.lastMsg}</Text>
                        <Text style={styles.timeChat}>{moment(item?.sendTime).format('MM/DD/YYYY HH:ss')}</Text>
                    </View>
                </View>
            
        </View>
       
    )
}
export default RenderItem;

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      color: "black",
      padding: 10,
      borderRadius: 20,
      backgroundColor: '#DCDCDC',
      borderColor: '#DCDCDC',
      position: "relative",
      alignContent: 'center',
      alignItems:'center',
      textAlign: 'center',
  
    },
    tinyLogo: {
      width: 80,
      height: 80,
      borderRadius: 40
    },
    container: {
      backgroundColor: "#F3F4F6",
      height: Dimensions.get('window').height
    },
    itemchat: {
      flexDirection: 'row',
      marginBottom: 10,
      backgroundColor: "#fff",
      padding: 10,
  
  
    },
    itemchatRight: {
      marginLeft: 10,
      marginTop: 10
    },
    iconSearch: {
      textAlign: 'center',
      position: 'absolute',
      padding: 10,
      zIndex:10,
      margin: 12,
    },
    name: {
      fontSize: 20,
      fontWeight: "700",
      color: '#05375a'
    },
    contentchat: {
      color: "black",
      fontSize: 15,
      marginTop: 2
    },
    contentnd: {
      flexDirection: "row",
      justifyContent: "space-around"
    },
    timeChat:{
     color: '#05375a',
     fontSize: 15,
     marginTop:3,
     marginLeft: 50
    },
    itemChat:{
      color: '#009385',
      fontSize: 15,
      marginTop: 2,
      marginRight: 10
    }
  });