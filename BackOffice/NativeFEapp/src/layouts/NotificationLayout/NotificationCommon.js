import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class NotificationCommon extends React.Component {

  render(){
    return(
      <ScrollView style={{backgroundColor: '#33b5e5'}} createContainerstyle={{flex: 1,backgroundColor: '#33b5e5'}}>
        <View style={{borderBottomWidth: 1, padding:10, borderColor: '#fff'}}>
          <View style={{maxHeight: 30, flexDirection:'row', justifyContent: 'flex-start'}} >
            <TouchableOpacity onPress={this.props.closeDrawer} >
              <View>
                <Icon size={25} name='close' type='evilicon' color='#000' />
              </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center',flex: 1, lineHeight: 30, fontSize: 30, color: '#fff'}}>
              NOTIFICATION
            </Text>
          </View>
        </View>
        <View>
          <ShowNotification navigation={this.props.navigation} notificationData={this.props.notificationData}/>
        </View>
      </ScrollView>
    );
  }
}

export default createContainer((props) => {
  const postHandle       = Meteor.subscribe('userNotification');
  const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"type":"notification",'status':"unread"}) || [];

  var result = {
    notificationData: notificationData,
  }

  return result;

},NotificationCommon);

