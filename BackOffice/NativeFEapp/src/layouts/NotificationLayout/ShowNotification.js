import React, { Component } from "react";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import { Text, View, Image, Modal, Alert, TouchableHighlight, TouchableOpacity, Dimensions} from "react-native";
import styles from "./styles.js";
import { Icon } from "react-native-elements";

var moment = require('moment');

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

  viewDetails(ticket,id){
    Meteor.call('updateNotification',id,(err,res)=>{
        if(res){
          this.props.navigation.navigate('ViewTicket', { ticketid: ticket} )
          
        }
    });
  }

  render(){
    console.log("this.state.notificationData :",this.state.notificationData);
    return(
          <View style={{paddingHorizontal:10,paddingVertical:10}}>
                  { this.state.notificationData ?
                    this.state.notificationData.map((data,index)=>{
                      return(
                              // <TouchableOpacity key={index} onPress={()=>this.props.navigation.navigate('ViewTicket', { ticketid: data.ticketId} )} >
                              <TouchableOpacity key={index} onPress={()=>this.viewDetails(data.ticketId,data._id)} >
                                <View style={{flex:1, flexDirection: 'column', borderBottomColor:'#000', paddingVertical:10}}>
                                <View style={{flex:1}}><Text>{data.notifBody}</Text></View>
                                <View style={{flex:1, flexDirection: 'row'}}>
                                  <View style={{flex:0.1}}><Icon size={25} name='clock' type='evilicon' color='#ddd'/></View>
                                  <View style={{flex:0.4}}><Text style={{color:'#ddd'}}>{moment(data.date).startOf('hour').fromNow()}</Text></View>
                                </View>
                                </View>
                              </TouchableOpacity>   
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

      const notificationData = props.notificationData || [];
      console.log('notificationData: ', notificationData);

      if(notificationData){
        for(var k=0;k<notificationData.length;k++){
          var notificationId = notificationData[k]._id;
        }
      }

      var result =  {
          notificationData : notificationData,
      };
      console.log('result:',result);
      return result;

}, ShowNotificationChild);
export default ShowNotification;