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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import uuid from 'react-native-uuid';
const ListUser = ({ route, navigation }) => {
  const data = route.params.data;
  const [search, setSearch] = React.useState();
  const [listUser, setlistUser] = React.useState([]);
  const [you, setYou] = React.useState('');
  let dataPush = []
  const getAllUser = async () => {
    //  await firestore()
    //     .collection('users')
    //     .get()
    //     .then(querySnapshot => {
    //       querySnapshot.forEach(snapshot => {
    //         let item = snapshot.data();
    //         if(data.email !== item.email){
    //           dataPush.push(item);
    //         }else {
    //           setYou(item)
    //         }    
    //     })
    //     setlistUser(dataPush)
    //     });
    database()
      .ref('users/')
      .once('value')
      .then(snapshot => {
        setlistUser(
          Object.values(snapshot.val()).filter(it => it.uid != data.uid),
        );
        // setallUserBackup(
        //   Object.values(snapshot.val()).filter(it => it.id != userData.id),
        // );
      });


  // });
};
useEffect(() => {
  getAllUser()

}, []);

const navigateItemChat = (item) => {
  database()
    .ref('/chatlist/' + data.uid + '/' + item.uid)
    .once('value')
    .then(snapshot => {
      if (snapshot.val() == null) {
        let roomId = uuid.v4();
        const { avatar, uid, name } = item
        const dataMessenger = {
          roomId,
          idInformationYou: data.uid,
          idInformationFriend: item.uid,
          lastMsg: 'Xin chao ban',
        }

        const dataMessengerSend = {
          roomId,
          idInformationYou: item.uid,
          idInformationFriend: data.uid,
          lastMsg: 'Xin chao ban',

        }

        // const dataMessengerSendN = {
        //   roomId,
        //   idInformationYou: data.uid,
        //   idInformationFriend: item.uid,
        //   lastMsg: '',
        // }
        // firestore().collection('chatlist').add(dataMessengerSend)
        // firestore().collection('chatlist').add(dataMessengerSendN)
        database()
          .ref('/chatlist/' + uid + '/' + data.uid)
          .update(dataMessengerSend)
          .then(() => console.log('Data updated.'));



        database()
          .ref('/chatlist/' + data.uid + '/' + uid)
          .update(dataMessenger)
          .then(() => console.log('Data updated.'));
        navigation.navigate('ItemChat', dataMessenger);
      } else {
        navigation.navigate('ItemChat', snapshot.val());
      }
    });
};

const renderItem = ({ item, index }) => {
  return (
    <View key={index} style={styles.itemchat}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: `${item.avatar}`
        }}
      />
      <View style={styles.itemchatRight}>
        <View><Text style={styles.name}> {item?.name}</Text></View>

        <View style={styles.contentnd}>
          <Text style={styles.xemtt}> Xem thông tin </Text>
          <TouchableOpacity onPress={() => navigateItemChat(item)}>
            <Text style={styles.chat}> Chat </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
      data={listUser}
      renderItem={renderItem}
      keyExtractor={item => item.uid}
    />
  </View>
);
};
export default ListUser;
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
    alignItems: 'center',
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
    zIndex: 10,
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
  xemtt: {
    color: 'green'
  },
  contentnd: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  chat: {
    color: 'blue'
  }
});