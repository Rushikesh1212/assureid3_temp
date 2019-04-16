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
import Moment from 'moment';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';


class InvoiceReciept extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
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

    var {userData}     = this.props;
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
                <HeaderDy headerTitle="Invoice Reciept" goBack={goBack}/>
            
              <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>

                {this.props.loading ?
                <View style={styles.formContainer}>
                  <View style={{flexDirection:'row',flex:1}}>
                    <View style={{flex:1}}>
                      <Text style={{fontWeight: 'bold',color:'#000',fontSize:20}}>Thank You</Text>
                      <Text style={{color:'#000',flexWrap:'wrap',paddingVertical:10}}>Your Payment has been Successfully received with the following details.</Text>
                    </View>
                  </View>
                  <View style = {styles.lineStyle} />
                  <View style={{paddingVertical:15}}>
                    <Text style={{fontWeight: 'bold',color:'#000',fontSize:16}}>Transaction Status</Text>
                  </View>
                  <View style={{flexDirection:'row',flex:1,marginTop:15}}>
                    <View style={{flex:.5}}>
                      <Text style={{}}>Order Number</Text>
                      <Text>{this.props.order.orderNo}</Text>
                    </View>
                    <View style={{flex:.5}}>
                      <Text>Transaction ID</Text>
                      <Text> - </Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',flex:1,marginTop:15}}>
                    <View style={{flex:.5}}>
                      <Text style={{}}>{this.props.order.serviceDetails ? "Service Name" : "Package Name"}</Text>
                      <Text style={{fontWeight: 'bold'}}>{this.props.order.serviceDetails ? this.props.order.serviceDetails.serviceName : this.props.order.packageDetails.packageName}</Text>
                    </View>
                    <View style={{flex:.5}}>
                      <Text> {this.props.order.serviceDetails ? "Service Duration" : "Package Duration"}</Text>
                      <Text style={{fontWeight: 'bold'}}>{ this.props.order.serviceDetails ? this.props.order.serviceDetails.serviceDayNumbers : this.props.order.packageDetails.packageCompletionDays} {this.props.order.serviceDetails ? this.props.order.serviceDuration : ""}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',flex:1,marginTop:15}}>
                    <View style={{flex:.5}}>
                      <Text style={{}}>Total Amount</Text>
                      <View style={{flexDirection:'row'}}>
                        <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                        <Text style={{fontWeight: 'bold'}}>{(this.props.order.amountPaid).toFixed(2)}</Text>
                      </View>
                    </View>
                    <View style={{flex:.5}}>
                      <Text> Order Date</Text>
                      <Text style={{fontWeight: 'bold'}}>{Moment(this.props.order.createdAt).format("DD/MM/YYYY")}</Text>
                    </View>
                  </View>
                  <View style={{alignItems:'flex-end',paddingVertical:20}}>
                    <Button  
                      textStyle={{textAlign:'center'}} 
                      buttonStyle={styles.button} 
                      title="OK"
                      onPress={()=>this.props.navigation.navigate('MyOrder')}
                    />
                  </View>
                </View>
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
  const { state }   = props.navigation;
  orderId           = state.params.id;
  console.log("order id = ",orderId);
  const postHandle  = Meteor.subscribe('singleOrder',orderId);
  const order       = Meteor.collection('order').findOne({'_id':orderId});
  const loading     = postHandle.ready();

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;

  return{
    loading,
    order,
    notificationCount
  };
}, InvoiceReciept);