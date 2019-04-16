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


class LatestUpdates extends React.Component {
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

    if(this.props.loading && this.props.loading1){
      return(
        <View style={{flex:1}}>
        {this.props.statusArray.length > 0 ?
          this.props.statusArray.map((statusDetails, index)=>{
            return(
              <View key={index} style={{borderBottomWidth:1,borderBottomColor:'#ddd',width:'100%',flexDirection:'row',paddingVertical:5}}>
                <View style={{width:'18%',justifyContent:'center'}}>
                  {/* <Image style={{height:50,width:50}} source={require('../../images/view-4.png')}/> */}
                  <Icon name="user" type="font-awesome" color="#00b8ff" size={15}/>
                </View>
                <View style={{width:'82%',justifyContent:'center'}}>
                  <Text style={{fontSize:12}}>{statusDetails.msg}</Text>
                </View>
              </View>
            );
          })
          :
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text>No records found!</Text>
            </View>
            
          }
          {(this.props.showLess) && (this.props.total>4)  
          ?
            <View style={{width:'100%',alignItems:'center',marginBottom:10}}>
              <TouchableOpacity onPress={()=>this.props.navigate('LatestUpdatesBlock')}>
                <Text style={{textDecorationLine:'underline',fontSize:12}}>View All</Text>
              </TouchableOpacity>
            </View>
          :
            null
          }
        </View>
      );  
    }else{
      return(<Loading />);
    }
    
  }
}

export default createContainer((props) => {
  var _id          = Meteor.userId();
  const postHandle = Meteor.subscribe('userData',_id);
  const userData   = Meteor.collection("users").findOne({"_id" : _id})|| {};
  const loading    = postHandle.ready();

  const postHandle1 = Meteor.subscribe('userOrder',_id);
  const loading1    = postHandle1.ready();
  const OrderObj    = Meteor.collection("order").find({"userId" : _id}) || [];
  var statusArray = [];

  if(OrderObj){
    for(i=0; i<OrderObj.length; i++){
      if(OrderObj[i].orderStatus == "In Process"){
        // var tatDate = '2018-06-27';
        // var splitDate = OrderObj[i].tatDate.split("-");
        // var date = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
        // var icon = "fa-male";

        // var msg = "Your " + OrderObj[i].serviceName + " is in process. It will be verified by " + Moment(OrderObj[i].tatDate).format('Do MMMM, YYYY') + ".";
        // var linkName = "Learn More";
        // statusArray.push({msg,linkName});



        if(OrderObj[i].serviceDetails){
          var msg = "Your " + OrderObj[i].serviceDetails.serviceName + " is in process. It will be verified by " + Moment(OrderObj[i].tatDate).format('Do MMMM, YYYY') + ".";        
          var linkName = "Learn More";
          statusArray.push({msg,linkName});
          
       }else{
         var serviceLength = OrderObj[i].packageDetails.servicesIncluded.length;
         for(var j=0;j<serviceLength;j++){
           var msg = "Your " + OrderObj[i].packageDetails.servicesIncluded[j].serviceName + " is in process. It will be verified by " + Moment(OrderObj[i].tatDate).format('Do MMMM, YYYY') + ".";
           var linkName = "Learn More";
           
           statusArray.push({msg,linkName});
           
         }
       }
      }
    }
  }

  var total = statusArray.length;

  if(props.showLess){
    var statusArray = statusArray.slice(0,4);
  }

  return {
    loading,
    userData,
    statusArray,
    loading1,
    total
  };
}, LatestUpdates);

