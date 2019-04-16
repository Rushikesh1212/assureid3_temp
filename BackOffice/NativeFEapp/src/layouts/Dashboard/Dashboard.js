import React, { Component } from "react";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import { StyleSheet,Text,View,TextInput,BackHandler,TouchableOpacity, ScrollView, DrawerLayoutAndroid, Image,Alert} from "react-native";
import { Header, Button, Icon,Avatar} from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { robotoWeights } from 'react-native-typography';
import SideMenu from 'react-native-side-menu';
import PropTypes from "prop-types";

import styles from "./styles.js";
import Menu from '../../components/Menu/Menu.js';
import Moment from 'react-moment';
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';

var moment = require('moment');

class Dashboard extends React.Component {


  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;

    this.state = {
      name         : name,
      isOpen       : false,
      selectedItem : 'About',
      userData     : Meteor.user().profile,
    };

    this.openDrawer  = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle      = this.toggle.bind(this);
  }
  componentDidMount(){
    
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler= ()=>{
  //   // 
  //   if(this.props.navigation.state.routeName != 'ServiceList'){
  //     this.props.navigation.goBack(null);
  //     return true;
  //   }
  //   return true;

  Alert.alert(
    'Exit App',
    'Exiting the application?', [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
    }, {
        text: 'OK',
        onPress: () => BackHandler.exitApp()
    }, ], {
        cancelable: false
    }
  )
 return true;
  }
  toggle() {
    // 
    let isOpen = !this.state.isOpen;
      this.setState({
        isOpen
      });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
  });

  handleLogout(){
    Meteor.logout();
    Actions.LogIn();
  }
  openDrawer(){
    this.drawer.openDrawer();
  }
  closeDrawer(){
    this.drawer.closeDrawer();
  }

  render(){

    const { navigate,goBack } = this.props.navigation;
    const menu = <Menu navigate={navigate} />;
    
    var navigationView = <NotificationCommon closeDrawer={this.closeDrawer} notificationData={this.props.notificationData} navigation={this.props.navigation}/>

    return(
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={(_drawer) => this.drawer = _drawer}
        drawerPosition={DrawerLayoutAndroid.positions.Right}
        renderNavigationView={() => navigationView}>
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
          <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>
            <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>
              <Header
                centerComponent={{ text: "ASSUREID", style: { color: '#fff',fontWeight:'bold' } }}
                leftComponent={
                  <TouchableOpacity  onPress={this.toggle} >
                    <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                  </TouchableOpacity>
                }
                outerContainerStyles={{borderBottomWidth:0, backgroundColor: '#367fa9',height:60,paddingTop:0,margin:0}}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                rightComponent={
                  <View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                    <TouchableOpacity onPress={this.openDrawer}>
                      <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                      <Text style={styles.notificationText}>{this.props.notificationData.length}</Text>
                    </TouchableOpacity>
                  </View>
                    }
              />
              <View style={{backgroundColor:'#fff',height:175,borderBottomWidth:1,borderColor:'#f2f2f2', shadowOffset: {
                width: 0,
                height: 3
                },
                elevation:3,
                shadowRadius: 5,
                shadowOpacity: 2.0}}>
                <View style={{flex:1,flexDirection:'row',padding:10}}>
                  <View style={{flex:0.4}}>
                    { this.state.userData.userProfile ?
                      <Avatar
                       width={90}
                       height={90}
                       rounded
                       source={{uri:this.state.userData.userProfile}}
                       activeOpacity={0.7}
                      /> 
                    : 
                      <Avatar
                       width={90}
                       height={90}
                       rounded
                       source={require("../../images/Vinod.png")}
                       activeOpacity={0.7}
                      /> 
                    }
                  </View> 
                  <View style={{flex:0.7,flexDirection:'row',marginTop:10}}>
                    <View style={{flex:.3}}>


                       <View style={{flexDirection:'row', flex:1}}>

                      </View>
                    </View>

                  </View>
                </View>
                <View style={{padding:10,marginBottom:10}}>
                  <Text style={[(robotoWeights.bold),{fontSize:18,color:'#3c8dbc',textAlign:'left',paddingVertical:2}]}>Hello {this.state.userData ? this.state.userData.firstname : 'User'} {this.state.userData ? this.state.userData.lastname : null},</Text>
                  <Text style={[(robotoWeights.regular),{fontSize:15,color:'#666666',textAlign:'left',}]}>You have {this.props.user ? this.props.user.count : 0} Tickets Pending</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',flex:1,marginTop:5}}>
                <View style={{flex:.5}}>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('NewTickets')}>
                    <View style={{flex:.5,paddingHorizontal:10,paddingVertical:10}}>   
                      <View style={{flex:.5, backgroundColor:'#33b5e5',}}>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333',textAlign:'center',paddingVertical:15}]}>New</Text>
                          <Image
                            style={{ width:45, height:45, marginVertical: 2,alignSelf:"center" }}
                            source={require("../../images/New_40px_X_40px.png")}
                          />
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#fff',textAlign:'center',paddingVertical:15}]}>{this.props.newCount>0 ? this.props.newCount : 0}&nbsp;{this.props.sinceDate !=undefined ? "Since "+ this.props.sinceDate  :" "}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex:.5}}>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('AllocatedTickets')}>
                    <View style={{flex:.5,paddingHorizontal:10,paddingVertical:10}}>
                      <View style={{flex:.5, backgroundColor:'#00c851',}}>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333',textAlign:'center',paddingVertical:15}]}>Allocated</Text>
                           <Image
                          style={{ width:45, height:45, marginVertical: 2,alignSelf:"center" }}
                          source={require("../../images/Allocated_40px_X_40px.png")}
                        />
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#fff',textAlign:'center',paddingVertical:15}]}>{this.props.allAllocatedTicketCount > 0 ? this.props.allAllocatedTicketCount : 0 } &nbsp; {this.props.allocatedSince !=undefined ? "Since "+ this.props.allocatedSince  :" "}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection:'row', flex:1}}>
                <View style={{flex:.5}}>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('CompletedRejectedTickets')}>
                    <View style={{flex:.5,paddingHorizontal:10,marginBottom:15}}>
                      <View style={{flex:.5, backgroundColor:'#ff4444',paddingHorizontal:10,}}>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333',textAlign:'center',paddingVertical:15}]}>Esclated</Text>
                           <Image
                          style={{ width:45, height:45, marginVertical: 2,alignSelf:"center"}}
                          source={require("../../images/Esclated_40px_X_40px.png")}
                        />
                         <Text style={[(robotoWeights.bold),{fontSize:15,color:'#fff',textAlign:'center',paddingVertical:15}]}>0</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex:.5}}>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('ReopenedTickets')}>
                    <View style={{flex:.5,paddingHorizontal:10}}>
                      <View style={{flex:.5, backgroundColor:'#33b5e5',paddingHorizontal:10,}}>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333',textAlign:'center',paddingVertical:15}]}>Re-Open</Text>
                           <Image
                          style={{ width:45, height:45, marginVertical:2,alignSelf:"center"}}
                          source={require("../../images/Re-Open_40px_X_40px.png")}
                        />
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#fff',textAlign:'center',paddingVertical:15}]}>{this.props.reopenCount > 0 ? this.props.reopenCount : 0 } &nbsp;{this.props.reopenSinceDate !=undefined ? "Since "+ this.props.reopenSinceDate  :" "}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ alignItems: "center", marginTop: 0}}>
                <Button
                  // onPress={this.handleSignIn}
                  buttonStyle={styles.buttonLarge}
                  title= { this.props.completedCount>0 ? "Completed Tickets "+ this.props.completedCount : "Completed Tickets "+ 0}
                  titleStyle={{fontWeight: "800"}}
                />
              </View>
            </ScrollView>
          </View>
        </SideMenu>
      </DrawerLayoutAndroid>
    );
  }
}

export default createContainer((props) => {
  var _id          = Meteor.userId();
  const handle     = Meteor.subscribe('allocatedTickets', _id);
  const handle1    = Meteor.subscribe('currentUserfunction');
  const ticketHandle    = Meteor.subscribe('allTickets');
  const userHandle  = Meteor.subscribe('userData',_id);  
  var newCount = 0;
  var allAllocatedTicketCount = 0;
  var reopenCount = 0;
  var completedCount = 0;
  const loading    = handle.ready() && userHandle.ready() && ticketHandle.ready();
  const user       = Meteor.collection('users').findOne({"_id":_id});
  var allNewTickets   = Meteor.collection('ticketMaster').find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}});
  var alltickets   =  Meteor.collection('ticketMaster').find({ticketElement: { $elemMatch: { "roleStatus" : "FEAllocated", "allocatedToUserid" : _id }}});
 
  if(user){
    var roleArr = user.roles;
    if(roleArr){
    var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
    
    }
    /**Allocated ticket Count and date*/

    var allAllocatedTicket   =  Meteor.collection('ticketMaster').find({ticketElement: { $elemMatch: { "roleStatus" : "FEAllocated", "allocatedToUserid" : _id }}});
    
    var allAllocatedTicketCount   = allAllocatedTicket.length;
    
    if(allAllocatedTicket.length > 0){
      var allocatedSince  =  moment(allAllocatedTicket[0].createdAt).format('MMM Do YY');
  
    }

    for(i=0;i<allNewTickets.length; i++){

      const ticketHolderHandle  = Meteor.subscribe('userData',allNewTickets[i].userId);
      const userTicketHolder    = Meteor.collection('users').findOne({"_id":allNewTickets[i].userId});

      if(userTicketHolder){
        var ticketElements = allNewTickets[i].ticketElement; 
        allNewTickets[i].ticketHolderImg  = "https://s3.ap-south-1.amazonaws.com/assureidportal/UserImage/"+userTicketHolder.profile.userProfile.split('original/')[1]+'.'+userTicketHolder.profile.userFileExt;
        allNewTickets[i].ticketHolderName = userTicketHolder.profile.firstname+' '+userTicketHolder.profile.lastname;
        // allNewTickets[i].serviceImage     = "https://s3.ap-south-1.amazonaws.com/assureidportal/ServiceImage/"+F3HEuDRcBAfmZ76qJ+".jpg";
        // 
        // 
        switch(role){

          case 'field expert':
              if(ticketElements[ticketElements.length-1].roleStatus == "FEAllocated"){
               newCount++;
               var sinceDate = moment(allNewTickets[0].createdAt).format('MMM Do YY');
              }
              if(ticketElements[ticketElements.length-1].roleStatus == "VerificationFail"){
                reopenCount++;
                var reopenSinceDate = moment(allNewTickets[0].createdAt).format('MMM Do YY');
               }
               if(ticketElements[ticketElements.length-1].roleStatus == "TicketClosed"){
                completedCount++;
               }
               
              

          break;

          case 'business Associate':
          if(ticketElements[ticketElements.length-1].roleStatus == "BAAllocated"){
            newCount++;
          }
          break;
        }//EOF switch     
           
      }


    }//EOF i   
   

  }//EOF if

      const postHandle       = Meteor.subscribe('userNotification');
      const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"type":"notification",'status':"unread"}) || [];
      
  var result = {
    ticketData : allNewTickets ,
    loading    : loading,
    user       : user,
    newCount   : newCount,
    sinceDate  : sinceDate,    
    allAllocatedTicketCount : allAllocatedTicketCount,
    allocatedSince  : allocatedSince,
    reopenCount     : reopenCount,
    reopenSinceDate : reopenSinceDate,
    completedCount  : completedCount,
    notificationData: notificationData,
  };

  return result;

},Dashboard);
