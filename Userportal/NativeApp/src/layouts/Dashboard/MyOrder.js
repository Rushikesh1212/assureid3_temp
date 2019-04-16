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
var moment = require('moment');

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';

import ComingSoon from './ComingSoon.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class MyOrder extends React.Component {
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
      <ScrollView style={styles.notifView} createContainerstyle={{flex: 1,backgroundColor: '#fbae16'}}>
        <View style={{borderBottomWidth: 1, padding:15, borderColor: '#fff',backgroundColor: '#0a8fc4'}}>
          <View style={{maxHeight: 30, flexDirection:'row', justifyContent: 'flex-start'}} >
            <TouchableOpacity onPress={this.closeControlPanel} >
              <View>
                <Icon size={25} name='close' type='evilicon' color='#fff' />
              </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center',flex: 1, lineHeight: 30, fontSize: 20, color: '#fff'}}>
              NOTIFICATIONS
            </Text>
          </View>
        </View>
        <View style={{flex:1}}>
          <ShowNotification navigation={this.props.navigation} />
        </View>
      </ScrollView>
    );

    return(
     
      <Drawer
        ref={(ref) => this._drawer = ref}
        content={navigationView}
        // openDrawerOffset={(viewport) => viewport.width - 300}
        side="right"
        >
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
         <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>

              <Header
                centerComponent={{ text: "AssureID", style: { color: '#fff' } }}
                leftComponent={
                  <TouchableOpacity  onPress={this.toggle} >
                    <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                  </TouchableOpacity>
                }
                outerContainerStyles={styles.outerContent}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                rightComponent={
                  <View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                    <TouchableOpacity onPress={this.openControlPanel}>
                      <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                      {this.props.notificationCount>0 ?
                        <Text style={styles.notificationText}>{this.props.notificationCount}</Text> 
                        : 
                          null
                      }
                    </TouchableOpacity>
                  </View>
                }
                />      
                <HeaderDy headerTitle="My Order" goBack={goBack}/>
              
              <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>

                { this.props.loading ?
                  this.props.orderDetails.length > 0 ?
                   this.props.orderDetails.map((orders, index)=>{
                    return(
                      <Card containerStyle={styles.cardOrder} key={index}>
                        <View style={styles.cardHeader}>
                          <View style={{flex:1,flexDirection:'row'}}>
                            <View style={{flex:.7,paddingHorizontal:10,paddingVertical:10}}>
                              <Text style={{fontSize:16,fontWeight:'bold'}}>{orders.serviceName}</Text>
                            </View>
                            <View style={{flex:.2,alignItems:'flex-end'}}>
                              <View style={{flexDirection:'row',paddingRight:5}}>
                                <View style={{alignItems:'flex-end',paddingRight:5,marginTop:5}}>
                                  {/*<TouchableOpacity onPress={()=>navigate('Invoice')}>*/}
                                  <TouchableOpacity onPress={()=> navigate('Invoice',{Id:orders.invoiceDetails.invoiceId})}>
                                    <Icon name="file-text-o" type="font-awesome" size={20}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                                  </TouchableOpacity>
                                </View>
                                {/*<View style={{alignItems:'flex-end',marginTop:5,paddingLeft:15}}>
                                                                  <TouchableOpacity onPress={()=>navigate('OrderVerification',{Id:orders._id})} >
                                                                    <Icon name="files-o" type="font-awesome" size={20}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                                                                  </TouchableOpacity>
                                                                </View>*/}
                              </View>
                            </View>
                          </View>
                          <View style={{flex:1, flexDirection:'row',paddingHorizontal:5, paddingTop: 5,paddingBottom:15}}>
                            <View style={{paddingVertical: 5,flex:.3}}>
                              <Image style={{width:50, height:50, borderRadius: 15 }} resizeMode="stretch"
                                source={{uri: orders.serviceImage}}/>
                            </View>
                            <View style={{flex:1,flexDirection:'row'}}>
                              <View style={{flex:.5}}>
                                <Text style={{fontWeight:'bold'}}>Order Price:</Text>
                                <Text style={{fontWeight:'bold'}}>Order Number:</Text>
                                <Text style={{fontWeight:'bold'}}>Date:</Text>
                                <Text style={{fontWeight:'bold'}}>Status:</Text>
                              </View>
                              <View style={{flex:.5}}>
                                <View style={{flexDirection:'row'}}>
                                  <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                                  <Text style={{fontWeight: 'bold'}}>{orders.totalAmount}</Text>
                                </View>
                                <Text>{orders.orderNo}</Text>
                                <Text>{moment(orders.createdAt).format("DD/MM/YYYY")}</Text>
                                <Text>{orders.orderStatus}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </Card>
                    );
                  })
                  :
                    <Text style={{textAlign:'center'}}>No Orders Found!</Text>
                  :
                    <Loading />
                }
                </ScrollView>
              </View>
            </SideMenu>
          </Drawer>
    );
  }
}

export default createContainer((props) => {
    
  const postHandle    = Meteor.subscribe('allOrders');
  const loading       = postHandle.ready();
  // const orderDetails  = Order.find({"userId": Meteor.userId()},{sort : {createdAt : -1}}).fetch()|| [];
  const orderDetails  = Meteor.collection('order').find({"userId": Meteor.userId()},{sort : {createdAt : -1}})||[];

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  return {
      loading,
      orderDetails,
      notificationCount
  };
}, MyOrder);
