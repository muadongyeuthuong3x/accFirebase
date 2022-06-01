import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListUser from '../screen/ListUser'
import { StyleSheet, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import ItemUserChat from '../Screen/ItemUserChat'
import  ListUserChat from '../screen/ListUserChat'
import Profile from "../screen/Profile"
const Tab = createBottomTabNavigator();

function TabBottom({ route, navigation}) {
  const { data } = route?.params;
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        keyboardHidesTabBar: true,
        tabBarHideOnKeyboard: true
      }}
      screenOptions={{
        showLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          // height: 60
        },
        headerShown: false
      }}
     
    >
      <Tab.Screen name="User"
        component={ListUser}
        initialParams={{data:data}}
        navigation={navigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.user}>
              <FontAwesome
                name="user"
                color={focused ?"#0969da":"#373c41c4"}
                size={20}
              />
            </View>
          )
        }}
      />

      <Tab.Screen name="UserChat"
        component={ ListUserChat}
        initialParams={{data:data}}
        navigation={navigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.user}>
              <FontAwesome
                name="user"
                color={focused ?"#0969da":"#373c41c4"}
                size={20}
              />
            </View>
          )
        }}   
      />
  
      <Tab.Screen name="setting" component={Profile} 
         options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.user}>
              <Icon
                name="user"
                color={focused ?"#0969da":"#373c41c4"}
                size={20}
              />
            </View>
          )
        }} />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
//   user: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     top:3,
//   },
//   textBottom:{
//     fontSize:20,
//     color:"#003153",
//     fontWeight:'500'
//   }
})

export default TabBottom;