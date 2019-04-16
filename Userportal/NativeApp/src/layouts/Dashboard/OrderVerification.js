import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';

import ComingSoon from './ComingSoon.js';

class OrderVerification extends React.Component {
  constructor(props){
    super(props);
    let name ="";
   
    this.state={
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#f7ac57',
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  handleView(){
    Actions.ViewCustomer();
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler(){
    console.log('androidBackHandler: ',this.props.navigation );
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
  }
  toggle() {
    console.log('is open ' + this.state.isOpen);
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
    console.log('Logout function!');
    Meteor.logout();
    Actions.LogIn();
  }
  openDrawer(){
    // console.log('opening drawer!');
          this.drawer.openDrawer();
  }
  closeDrawer(){

    this.drawer.closeDrawer();
  }

  closeControlPanel = () => {
    this._drawer.close()
  }
  openControlPanel = () => {
    this._drawer.open()
  }

  render(){

    const {navigate}   = this.props.navigation;

    const { state,goBack }    = this.props.navigation;
    const menu         = <Menu navigate={navigate} userName={this.props.userName}/>;
    var navigationView = (
      <ScrollView style={styles.notifView} createContainerstyle={{flex: 1,backgroundColor: '#fbae16'}} keyboardShouldPersistTaps="always">
        <View style={{borderBottomWidth: 1, padding:10, borderColor: '#000'}}>
          <View style={{maxHeight: 30, flexDirection:'row', justifyContent: 'flex-start'}} >
            <TouchableOpacity onPress={this.closeControlPanel} >
              <View>
                <Icon size={25} name='close' type='evilicon' color='#000' />
              </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center',flex: 1, lineHeight: 30, fontSize: 30, color: '#000'}}>
              NOTIFICATION
            </Text>
          </View>
        </View>
        <View>
          <Text style={{textAlign:'center',fontWeight:'bold', fontSize: 20,paddingTop: 10}}>Newly Added</Text>
        </View>
      </ScrollView>
    );

    return(
     
      <Drawer
        ref={(ref) => this._drawer = ref}
        content={navigationView}
        openDrawerOffset={(viewport) => viewport.width - 300}
        side="right"
        >
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
         <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>
            <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>

              <Header
                centerComponent={{ text: "AssureID", style: { color: '#fff' } }}
                leftComponent={
                  <TouchableOpacity  onPress={this.toggle} >
                    <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                  </TouchableOpacity>
                }
                outerContainerStyles={styles.outerContent}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                rightComponent={<View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                        <TouchableOpacity onPress={this.openControlPanel}>
                            <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                            <Text style={styles.notificationText}>9</Text>
                      </TouchableOpacity>
                    </View>
                    }
                />      
                <HeaderDy headerTitle="Your Verification Report" goBack={goBack}/>

                <View style={{flex:1,flexDirection:'row',paddingTop:15}}>
                  <View style={{flex:.5,flexDirection:'row',paddingHorizontal:10}}>
                    <View style={{flex:.7}}>
                      <Text style={{fontWeight:'bold'}}>Order Number :</Text>
                    </View>
                    <View style={{flex:.3}}>
                      <Text>{orderDetails.orderNo}</Text>
                    </View>
                  </View>
                  <View style={{flex:.5,flexDirection:'row'}}>
                    <View style={{flex:.5}}>
                      <Text style={{fontWeight:'bold'}}>Order Date :</Text>
                    </View>
                    <View style={{flex:.5}}>
                      <Text>14/04/2018</Text>
                    </View>
                  </View>
                </View>
                <Card containerStyle={styles.cardOrder}>
                  <View style={styles.cardHeader}>
                    <View style={{flex:1,flexDirection:'row'}}>
                      <View style={{flex:1,paddingHorizontal:10,paddingVertical:10}}>
                        <Text style={{fontSize:16,fontWeight:'bold'}}>Permanent Address</Text>
                      </View>
                    </View>
                    <View style={{flex:1,paddingHorizontal:10,paddingBottom:10}}>
                      <Text style={{flexWrap:'wrap'}}>Flat No. 1104, G-1 Building, Jasminium Society, Magarpatta City,Hadapsar, , Pentagon P3,Pune, Maharashtra,  411013,</Text>
                    </View>
                    <View style={{flex:1, flexDirection:'row', paddingTop: 5,paddingBottom:15}}>
                      <View style={{paddingVertical:5,flex:.2}}>
                        <TouchableOpacity>
                          <Icon name="file-text-o" type="font-awesome" size={30}  color="#00b8ff"/>
                        </TouchableOpacity>
                      </View>
                      <View style={{flex:.8,flexDirection:'row'}}>
                        <View style={{flex:.5}}>
                          <Text style={{fontWeight:'bold'}}>Residing From :</Text>
                          <Text style={{fontWeight:'bold'}}>Residing Till :</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>05/06/2007</Text>
                          <Text>Present</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
               
                </ScrollView>
              </View>
            </SideMenu>
          </Drawer>
    );
  }
}

export default createContainer((props) => {
  const { state }   = props.navigation;
  Id                = state.params.Id;

  const postHandle    = Meteor.subscribe('singleOrder',_id);
  const ticketpostHandle  = Meteor.subscribe('allTickets');
  
  const orderDetails  = Meteor.collection('order').find({"_id": Id})||[];

  var approvedTicket = [];
  if (orderDetails) {
    if (orderDetails.ticket) {
      var ticket = orderDetails.ticket;
      for (var i = 0; i < ticket.length; i++) {
        if (ticket[i].status == "Approved") {
           var relocatedTicket = Meteor.collection('ticketMaster').find({"_id": ticket[i].ticketId})||[]; 
          approvedTicket.push(relocatedTicket);
        }
      }
    }
  }
  const loading       = !postHandle.ready() && !ticketpostHandle.ready();
  return {
      loading,
      orderDetails,
      approvedTicket
  };

}, OrderVerification);

