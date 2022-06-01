import {
    View,
    StyleSheet,
    TextInput,
    Image,
    FlatList,
    Text,
    TouchableOpacity
  } from 'react-native';
  import database from '@react-native-firebase/database';
  import firestore from '@react-native-firebase/firestore';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import RenderItem from './itemUserChat'
  import { Dimensions } from 'react-native';
  import moment from 'moment';
  import React, { useEffect, useState } from 'react';
  const ListUserChat = ({ route,  navigation }) => {
    const data = route.params.data;
    const [search, setSearch] = React.useState();
    const [chatList  , setchatList] = useState('')
    const getChatList = async ()=>{
        database()
    .ref('/chatlist/'+data?.uid)
    .on('value', snapshot => {
      if (snapshot.val() != null) {
        setchatList(Object.values(snapshot.val()))
      }
    });
  //  const datass =  firestore().collection('chatlist')
  //   console.log(datass)
    }
    useEffect(()=>{
     getChatList()
    },[]);
    const navigateItemChat = (itemChat)=>{
      const dataSend = {
        idYou:data?.uid,
        idFriend: itemChat.idInformationFriend,
        idRoom:itemChat.roomId
      }
     navigation.navigate('ItemChat' ,dataSend);
    }
   

    
    const renderItem = ({ item ,index }) => {
      return (
        <TouchableOpacity onPress={()=>navigateItemChat(item)} >
       <RenderItem  item ={item} navigation={navigation}/>
       </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputSearch}>
          <FontAwesome
            name="search"
            style={styles.iconSearch}
            size={20}
          />
          <TextInput
            style={styles.input}
            placeholder="Tìm kiếm thành viên"
            value={search}
          />
  
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={chatList}
          renderItem={renderItem}
          keyExtractor={item => item.uid}
        />
      </View>
    );
  };
  export default ListUserChat;
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
    itemChat:{
      color: '#009385',
      fontSize: 15,
      marginTop: 2,
      marginRight: 10
    }
  });