import React, { Component } from "react";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import { Text, View, Image, Modal, Alert, TouchableHighlight, TouchableOpacity, Dimensions} from "react-native";
import styles from "./styles.js";
import { Icon } from "react-native-elements";
var moment = require('moment');
// import Moment from 'moment';

class ShowNotificationChild extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notificationData : []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        notificationData : nextProps.notificationData,
    });    
  }

  handleRead = (id,event) =>{
    // this.props.navigation.navigate('MyOrder');
    // console.log("inside handleRead.............");
    Meteor.call('markNotificationAsRead',id);
    if(event=="Order Placed" || event=="Payment Complete"){
      this.props.navigation.navigate('MyOrder');
    }
  }

  render() {
    return(
          <View style={{paddingHorizontal:0,paddingVertical:0}}>
            { this.state.notificationData ?
              this.state.notificationData.map((data,index)=>{
                return(
                  <View key={index}>
                    <TouchableHighlight onPress={_=>this.handleRead(data._id,data.event)}>
                    
                    <View style={data.status=="read"? {flex:1, flexDirection: 'column', paddingVertical:10,backgroundColor:'#fff',borderColor:'#00b8ff',borderWidth:0} : {flex:1, flexDirection: 'column', paddingVertical:10,backgroundColor:'#eee',borderColor:'#00b8ff',borderWidth:0}}>
                      <View style={{flex:1,paddingHorizontal:10}}>
                        <Text style={{color:'#000'}}>{data.notifBody}</Text>
                      </View>
                      <View style={{flex:1, flexDirection: 'row',justifyContent:'flex-end',alignItems:'flex-end',paddingRight:15}}>
                        <View style={{}}><Icon size={20} name='clock' type='evilicon' color='#999'/></View>
                        <View style={{}}><Text style={{color:'#999'}}>{moment(new Date(data.date).toISOString()).fromNow()}</Text></View>
                      </View>
                    </View>
                    </TouchableHighlight>
                    <View style={styles.separationLine}></View>
                  </View>
                );
              })
            :
             <View><Text></Text></View>
            }
          </View>
    );
  }
}


ShowNotification = createContainer( (props) => {

      const postHandle       = Meteor.subscribe('userNotification');
      const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId()},{sort: {date: -1}}) || [];

      var result =  {
          notificationData : notificationData,
      };
      // console.log('result:',result);
      // var date = new Date();
      // var test = date.toISOString();

      // var date = new Date("Mon Jun 11 2018 12:26:22 GMT+0530 (IST)");
      // var test = date.toISOString();
      // console.log("test date .... ",moment(test).fromNow());
      return result;
}, ShowNotificationChild);
export default ShowNotification;