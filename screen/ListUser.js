import {
  View,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  Pressable
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
  const [ttView , setttView ] = React.useState({
    name : '',
    birday: '',
    word : '',
    avatar: ''
  })
  const [modalVisible, setModalVisible] = useState(false);
  let dataPush = []
  const getAllUser = async () => {
    database()
      .ref('users/')
      .once('value')
      .then(snapshot => {
        console.log(snapshot.val())
        setlistUser(
          Object.values(snapshot.val()).filter(it => it.uid != data.uid),
        );
      });

  };
  useEffect(() => {
    getAllUser()

  }, []);
  
  const getInformationView = (uid) =>{
    setModalVisible(!modalVisible)
    database()
    .ref(`/users/${uid}`)
    .once('value', snapshot => {
        const data = snapshot.val()
        setttView({
            name: data.name,
            avatar: data.avatar,
            birday:data.birday,
            word: data.word,
        })
    });
  }
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
          database()
            .ref('/chatlist/' + uid + '/' + data.uid)
            .update(dataMessengerSend)
            .then(() => console.log('Data updated.'));



          database()
            .ref('/chatlist/' + data.uid + '/' + uid)
            .update(dataMessenger)
            .then(() => console.log('Data updated.'));
          const dataSend = {
            idYou: data?.uid,
            idFriend: uid,
            idRoom: roomId
          }
          navigation.navigate('ItemChat', dataSend);
        } else {
          const dataRes = snapshot.val()
          const dataSend = {
            idYou: dataRes.idInformationYou,
            idFriend: dataRes.idInformationFriend,
            idRoom: dataRes.roomId
          }
          navigation.navigate('ItemChat', dataSend);
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
            <TouchableOpacity onPress={()=>getInformationView(item?.uid)}>
              <Text style={styles.xemtt}> Xem thông tin </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateItemChat(item)}>
              <Text style={styles.chat}> Chat </Text>
            </TouchableOpacity>
          </View>
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
           <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View> 
            <Image
                            style={styles.imgChat}
                            source={{
                                uri:ttView.avatar
                            }}
                        />

            <TextInput
                        placeholder="Tên của bạn "
                        placeholderTextColor="green"
                        value={ttView.name}
                        style={[
                            styles.textInput,
                        ]}
             
                    />

<TextInput
                        placeholder="Ngày sinh "
                        placeholderTextColor="green"
                        value={ttView.birday}
                        style={[
                            styles.textInput,
                        ]}
             
                    />

<TextInput
                        placeholder="Công việc"
                        placeholderTextColor="green"
                        value={ttView.word}
                        style={[
                            styles.textInput,
                        ]}
             
                    />

            </View>
        

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Đóng thông tin</Text>
            </Pressable>

       </View>
       </View>

        </Modal>
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: (Dimensions.get('window').width) - 50,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    marginTop: 20,
    backgroundColor: "#2196F3",
   
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  textInput:{
    borderBottomColor: "#F194FF",
    borderBottomWidth: 1,
    width : (Dimensions.get('window').width) - 100,
  
  },
  imgChat:{
    width:100,
    height:100,
    borderRadius: 50
  }
});