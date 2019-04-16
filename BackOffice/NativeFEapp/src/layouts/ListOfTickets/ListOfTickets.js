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
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';


import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import styles from './styles.js';
import Menu   from '../../components/Menu/Menu.js';
var moment = require('moment');
class ListOfTickets extends React.Component {
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

  var { ticketData, user } = this.props;
  
  if(user){
    // console.log('user: ',user);
    roleArr          = ['field expert'];
    var role         = roleArr.find((obj)=> { return obj != 'backofficestaff' });

    //Get all the Tickets
          
    // alltickets = ticketData;
    if(ticketData){
      //find last status of the Tickets
      
      for(i=0;i< ticketData.length; i++){
        var ticketElementsData = ticketData[i].ticketElement;
        // console.log(i,' = ',ticketElementsData);
        // console.log('----------------------');
        switch(role){
          case 'field expert' : 
            switch (ticketElementsData[ticketElementsData.length - 1].roleStatus) {
              case 'FEAllocated':
                ticketData[i].status = 'New' ;  
                ticketData[i].bgClassName = '#f0ad4e';    
                // ticketData[i].bgClassName = 'btn-warning';    
                break;
              case 'ProofResubmitted' :
                ticketData[i].status = 'New-Reallocated' ;  
                ticketData[i].bgClassName = '#f0ad4e';    
                break;
              case 'ReviewPass' :
                ticketData[i].status = 'Completed' ;
                ticketData[i].bgClassName = '#00a65a';
                break;
              default:
                ticketData[i].status = 'In Process' ;
                ticketData[i].bgClassName = '#337ab7';
                break;
            }
            break;
          case 'ba' :
            switch (ticketElementsData[ticketElementsData.length - 1].roleStatus) {
              case 'BAAllocated':
                ticketData[i].status = 'New' ;      
                ticketData[i].bgClassName = '#f0ad4e';
                break;
              case 'ProofResubmitted' :
                ticketData[i].status = 'New-Reallocated' ;  
                ticketData[i].bgClassName = '#f0ad4e';    
                break;
              case 'ReviewPass' :
                ticketData[i].status = 'Completed' ;
                ticketData[i].bgClassName = '#00a65a';
                break;
              default:
                ticketData[i].status = 'In Process' ;
                ticketData[i].bgClassName = '#337ab7';
                break;
            }
            break;
          default : 
            ticketData[i].status = 'In Process' ;
            ticketData[i].bgClassName = '#337ab7';
            break;
        }
      }  // EOF i loop

    }    
  }

  // console.log('ticketData: ',ticketData);

    return(
      ticketData.map((item,i)=>
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
            <View style={{ flex: 1,flexDirection: "row", backgroundColor: "#ddd"}}>
              <View style={{flex:.5,paddingVertical: 10,}}>
                <Text style={{ paddingHorizontal:10 }}>
                  {item.username}
                </Text>
              </View>
              <View style={{flex:.34,paddingVertical: 10,paddingHorizontal: 15}}>
              </View>
            </View>
          </Card>
        </TouchableOpacity>       
      )
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
            <HeaderDy headerTitle="LIST OF TICKETS" goBack={goBack} />
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

  const handle     = Meteor.subscribe('allTickets');
  const handle1    = Meteor.subscribe('currentUserfunction');
  const loading    = handle.ready();
  const postHandle       = Meteor.subscribe('userNotification');

  var _id          = Meteor.userId();
  const user       = Meteor.collection('users').findOne({"_id":_id});
  var alltickets   =  Meteor.collection('ticketMaster').find({});
  const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"type":"notification",'status':"unread"}) || [];

  var result = {
    ticketData : alltickets ,
    loading    : loading,
    user       : user,
    notificationData :notificationData
  };


  // console.log(JSON.stringify(result,null,4));

  return result;

}, ListOfTickets);
