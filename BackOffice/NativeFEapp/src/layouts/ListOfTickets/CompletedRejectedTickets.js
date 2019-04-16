import React,{Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';

import PropTypes      from 'prop-types';
import SideMenu       from 'react-native-side-menu';
import RNExitApp      from 'react-native-exit-app';
import Modal          from "react-native-modal";
import Moment         from 'react-moment';

import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View,  BackHandler, Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid,Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, SearchBar  } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';


import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import styles from './styles.js';
import Menu   from '../../components/Menu/Menu.js';
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';
var moment = require('moment');
class CompletedRejectedTickets extends React.Component {
  constructor(props){
    super(props);
    let name = "";
    if (this.props.userName) name = "Welcome " + this.props.userName;
    this.state = {
      name              : name,
      isOpen: false,
      selectedItem: "About",
      inputFocusColor   : '#f7ac57',
    };
    this.openDrawer   = this.openDrawer.bind(this);
    this.closeDrawer  = this.closeDrawer.bind(this);
    this.toggle       = this.toggle.bind(this);
  }

  componentDidMount() {
    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }
  componentWillUnmount() {
    // BackHandler.removeEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }
  androidBackHandler(){
    // if(this.props.navigation.state.routeName != 'ServiceList'){
    //   this.props.navigation.goBack(null);
    //   return true;
    // }
    // return false;
  }
  toggle() {
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
      selectedItem: item
    });

  handleLogout(){
    Meteor.logout();
  }
  openDrawer(){
    this.drawer.openDrawer();
  }
  closeDrawer(){
    this.drawer.closeDrawer();
  }

  displayTicket(){

  var completedTickets = [];
  var { ticketData, user } = this.props;
  
  if(user){
    // console.log('user: ',user);
    roleArr          = ['field expert'];
    var role         = roleArr.find((obj)=> { return obj != 'backofficestaff' });

    //Get all the Tickets
          
    // alltickets = ticketData;
    if(ticketData){
      //find last status of the Tickets if Review pass i.e. completed the push into the array 
      
      for(i=0;i< ticketData.length; i++){
        var ticketElementsData = ticketData[i].ticketElement;

        if(ticketElementsData[ticketElementsData.length - 1].roleStatus == 'VerificationPass'){
            ticketData[i].status = 'Re-Submit Info' ;
            ticketData[i].bgClassName = '#f0ad4e';
            completedTickets.push(ticketData[i]);
        }

      }  // EOF i loop

    }    
  }

  // console.log('ticketData: ',ticketData);

    return(
      this.props.CompletedTicketList.length > 0 ?
      this.props.CompletedTicketList.map((item,i)=>
        <TouchableOpacity key={i} onPress={()=>this.props.navigation.navigate('ViewTicket',{ticketid:item._id})}>
          <Card containerStyle={[styles.newCard]}>
            <View style={[styles.cardHeader,{backgroundColor:item.bgClassName}]}>
              <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                <View style={{flex:.5}}>
                  <Text>Tickets#</Text>
                </View>
                <View style={{flex:.5}}>
                  <Text>{item.ticketNumber}</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                <View style={{flex:.5}}>
                  <Text>Service Name</Text>
                </View>
                <View style={{ flex:.5}}>
                  <Text>{item.serviceName}</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',flex:1,paddingHorizontal:10,paddingVertical:5}}>
                <View style={{flex:.5}}>
                  <Text>TAT (Date)</Text>
                </View>
                <View style={{flex:.5}}>
                  <Text>{moment(item.tatDate).format("DD-MM-YYYY")}</Text>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: "#ccc",paddingVertical: 10,alignItems: "center",justifyContent:'center'}}>
              <Text style={{color:"#000"}}>
                {item.userName}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>       
      )
      :
      <View>
        <Text>
           Oops!!!! There Are No Tickets To Display
        </Text>
      </View>
    );

  }


  render(){

    const { navigate,goBack } = this.props.navigation;

    const menu = <Menu navigate={navigate} userName={this.props.userName}/>;
    var navigationView = <NotificationCommon closeDrawer={this.closeDrawer} notificationData={this.props.notificationData} navigation={this.props.navigation}/>
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={_drawer => (this.drawer = _drawer)}
        drawerPosition={DrawerLayoutAndroid.positions.Right}
        renderNavigationView={() => navigationView}
      >
        <SideMenu
          disableGestures={true}
          openMenuOffset={300}
          menu={menu}
          isOpen={this.state.isOpen}
          onChange={isOpen => this.updateMenuState(isOpen)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFF",
              borderWidth: 0,
              padding: 0
            }}
          >
            <ScrollView
              createContainerStyle={{
                marginBottom: 25,
                borderWidth: 0,
                margin: 0
              }}
            >
              {/* <Header
                centerComponent={{ text: "AssureID", style: { color: "#fff" } }}
                leftComponent={
                  <TouchableOpacity onPress={this.toggle}>
                    <Icon
                      containerStyle={{paddingHorizontal:10,paddingVertical:5}}
                      size={25}
                      name="bars"
                      type="font-awesome"
                      color="#fff"
                    />
                  </TouchableOpacity>
                }
                outerContainerStyles={{
                  borderBottomWidth: 0,
                  backgroundColor: "#367fa9",
                  height: 60,
                  paddingTop: 0,
                  margin: 0
                }}
                innerContainerStyles={{ marginTop: 0, paddingTop: 0 }}
                rightComponent={
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "flex-end",
                      minHeight: 20,
                      minWidth: 20
                    }}
                  >
                    <TouchableOpacity onPress={this.openDrawer}>
                      <Icon
                        name="bell-outline"
                        type="material-community"
                        size={30}
                        color="#fff"
                        style={styles.bellIcon}
                      />
                      <Text style={styles.notificationText}>9</Text>
                    </TouchableOpacity>
                  </View>
                }
              /> */}
            
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

            <HeaderDy headerTitle="Esclated Tickets" goBack={goBack} />
              <View style={{ padding: 10 }}>
                { this.displayTicket()}
              </View>
            </ScrollView>
          </View>
        </SideMenu>
      </DrawerLayoutAndroid>
    );
  }
}

export default createContainer((props) => {

  //initialise
  var _id          = Meteor.userId();
  const handle     = Meteor.subscribe('allocatedTickets', _id);
  const handle1    = Meteor.subscribe('currentUserfunction');
  const postHandle = Meteor.subscribe('userNotification'); 
  const loading    = handle.ready();
  var CompletedTicketList = [];
  const user       = Meteor.collection('users').findOne({"_id":_id});
  const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"type":"notification",'status':"unread"}) || [];
  var alltickets   =  Meteor.collection('ticketMaster').find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}});

  if(user){
    var roleArr = user.roles;
    if(roleArr){
    var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
    }
    for(i=0;i< alltickets.length; i++){
      var ticketElements = alltickets[i].ticketElement; 
      
      switch(role){
        case 'field expert':
            if(ticketElements[ticketElements.length-1].roleStatus == "ReviewPass"){
              alltickets[i].status = 'Completed' ;
              alltickets[i].bgClassName = '#337ab7';
              CompletedTicketList.push(alltickets[i]);
            }
        break;

        case 'business Associate':
        if(ticketElements[ticketElements.length-1].roleStatus == "ReviewPass"){
          alltickets[i].status = 'Completed' ;
          alltickets[i].bgClassName = '#337ab7';
          CompletedTicketList.push(alltickets[i]);
        }
        break;
      }//EOF switch
    }//EOF i
  }//EOF if
  
  var result = {
    ticketData : alltickets ,
    loading    : loading,
    user       : user,
    CompletedTicketList :CompletedTicketList,
    notificationData : notificationData
  };


  // console.log(JSON.stringify(result,null,4));

  return result;

}, CompletedRejectedTickets);
