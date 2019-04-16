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


class OurServices extends React.Component {
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
    
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
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
      selectedItem: item,
  });

  handleLogout(){
    
    Meteor.logout();
    Actions.LogIn();
  }
  openDrawer(){
    // 
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

  linkToServiceInfo = (id) =>{
    this.props.navigate('ServiceInfo',{id:id});
  }

  linkToPackageInfo = (id) =>{
    this.props.navigate('PackageInfo',{id:id});
  }

  render(){

    if(this.props.loading){
      if(this.props.services.length>0){

        return(
          <View style={{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
          {
            this.props.services.map((services, index)=>{
              return(
                <View key={index} style={{width:'33%',justifyContent:'center',padding:10}}>
                  <TouchableOpacity onPress={()=>this.linkToServiceInfo(services._id)}>
                    <View style={{alignItems:'center'}}>
                      <Image style={styles.servicesProfileimg} source={{uri:services.image}}
                      resizeMode="stretch"/>
                    </View>
                    <Text style={styles.textValue}>{services.serviceName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          }
          {
            this.props.packages.map((packages, index)=>{
              return(
                <View key={index} style={{width:'33%',justifyContent:'center',padding:10}}>
                  <TouchableOpacity onPress={()=>this.linkToPackageInfo(packages._id)}>
                    <View style={{alignItems:'center'}}>
                      <Image style={styles.servicesProfileimg} source={{uri:packages.image}}
                      resizeMode="stretch"/>
                    
                    </View>
                    <Text style={styles.textValue}>{packages.packageName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          }
          {(this.props.showLess) && (this.props.totalServices>6)  
          ?
            <View style={{width:'100%',alignItems:'center',marginBottom:10}}>
              <TouchableOpacity onPress={()=>this.props.navigate('OurServicesBlock')}>
                <Text style={{textDecorationLine:'underline',fontSize:12}}>View All</Text>
              </TouchableOpacity>
            </View>
          :
            null
          }    
          </View>          
        );
      }else{
        
        return(
          <View style={{flex:1,alignItems:'center'}}>
            <Text>No Service Available!</Text>
          </View>
        );
      
      } 
    }else{
      return(<Loading />);
    }
    
  }
}



export default createContainer((props) => {
    const postHandle1   = Meteor.subscribe('userData',Meteor.userId());
    const postHandle2   = Meteor.subscribe('userprofile',Meteor.userId());
    const postHandle3   = Meteor.subscribe("services");
    const postHandle4   = Meteor.subscribe("packages");
    const orderHandle   = Meteor.subscribe("allOrders");
    const loading1      = postHandle1.ready();
    const loading2      = postHandle1.ready();
    const loading3      = postHandle3.ready();
    const loading4      = postHandle4.ready();
    const loading       = loading1 && loading2 && loading3 && loading4 && orderHandle.ready();

    var _id = Meteor.userId();
    const usersDetails   = Meteor.collection('users').findOne({"_id":_id})||{};
    const userprofileObj = Meteor.collection('userProfile').findOne({'userId': _id}) || {} ;

    var services     = Meteor.collection('services').find({"serviceFor" :'user'})||[];
    var serviceCount = services.length;
    if(services.length > 0){
      services.map((service,index)=>{
          var imagePath = service.image;
          var splitPath = imagePath.split(':');
            if(splitPath[0] == 'http'){
              services[index].image = 'https:'+splitPath[1];
            }  
      })
    }
    
    if(props.showLess){
      var services     = services.slice(0,6);
    }
    var packages      = Meteor.collection('packages').find({"packageStatus": "Active"}) || [];
    var packageCount  = packages.length;
    if(packages.length >0){
      packages.map((packageData,index)=>{
        var imagePath = packageData.image;
        
        var splitPath = imagePath.split(':');
          if(splitPath[0] == 'http'){
            packages[index].image = 'https:'+splitPath[1];
          }  
        
      })
    }
    var totalServices = serviceCount + packageCount;
    return {
      loading,
      usersDetails,
      userprofileObj,
      services,
      packages,
      totalServices,
    };

}, OurServices);
