
import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import { NavigationActions } from "react-navigation";

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';


class ServiceInfo extends React.Component {
  constructor(props){
    super(props);
    
    this.state={
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#f7ac57',
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    // this.LinkRequiredInformation = this.LinkRequiredInformation.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.androidBackHandler.bind(this)
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.androidBackHandler.bind(this)
    );
  }
  androidBackHandler() {
    console.log(this.props.navigation.state.routeName);
    if (this.props.navigation.state.routeName != "ServiceList") {
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
  getImg = () =>{
    var img = this.props.services.image;
    if(img == "/images/assureid/noImage.png"){
      var src = require('../../images/assureid/noImage.png');
    }else{
      src = {uri: this.props.services.image};
    }
    return(<Image style={styles.profileimg} source={src}/>)
  }

  // LinkRequiredInformation = () =>{
  //   var id = this.props.services._id + "-" +this.props.services.serviceName;
  //   this.props.navigation.navigate('RequiredInformation',{id:id});
  // }

  handleContinue = () => {
    var serviceDetail = this.props.services;

    var userId    = Meteor.userId();
    var userData  = Meteor.user();

    var orderObj = Meteor.collection('order').findOne({}, {sort: { orderNo : -1}});
    
    if(orderObj){
      var orderNo = orderObj.orderNo + 1;
    }else{
      var orderNo = 1;
    }


    // console.log("orderDetails = ",orderObj);
    // console.log("Meteor user = ", Meteor.user());
    var orderDetails = {
      "orderNo" : orderNo,
      "userId"  : userId,
      "serviceDetails":{
        "serviceId"              : serviceDetail._id,
        "serviceName"            : serviceDetail.serviceName,
        "serviceCompletionDays"  : serviceDetail.serviceDayNumbers,
        "serviceImage"           : serviceDetail.image,
        "serviceFileExt"         : serviceDetail.fileExt,
        "serviceRate"            : serviceDetail.serviceRate
      },
      "candidateDetails" : [{
        "candidateId"            : userData._id,
        "candidateAssureID"      : userData.profile.assureId,
        "candidateFirstName"     : userData.profile.firstname,
        "candidateLastName"      : userData.profile.lastname,
        "candidateEmail"         : userData.emails[0].address,
        "candidateMobile"        : userData.profile.mobNumber,
        "candidateAadharCard"    : userData.profile.aadharCard,
        "candidateAmountPaid"    : "",
        "candidatepaymentStatus" : "",
        "candidateVerificationStatus": "Incomplete",

      }],
      "createdAt"   : new Date(),
      "orderStatus" : "Incomplete",
      
      
    }//End of orderDetails
    // console.log("orderDetails = ",orderDetails);

    Meteor.call("insertNewOrder",orderDetails,(error,result)=>{
      if(result){
        var orderId = result;
        var id   =  serviceDetail._id + "-" + serviceDetail.serviceName + "-" + orderId;
        this.props.navigation.navigate('RequiredInformation',{id:id});
         // var path = "/ServiceRequiredData/"+id;
         // browserHistory.replace(path);
      }
    });
    // this.props.navigation.navigate('RequiredInformation',{id:this.props.services._id + "-" +this.props.services.serviceName});
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
      // <DrawerLayoutAndroid
      //  drawerWidth={300}
      //   ref={(_drawer) => this.drawer = _drawer}
      //  drawerPosition={DrawerLayoutAndroid.positions.Right}
      //  renderNavigationView={() => navigationView}>
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

              <HeaderDy headerTitle={this.props.services.serviceName} goBack={goBack}/>
              {this.props.loading
              ?
              <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>
                <View>
                	<View style={{alignItems:'center',padding:10}}>
	                	<View style={{alignItems:'center',borderWidth:1,borderColor:'#00b8ff',borderRadius:2,padding:10}}>
                        {this.getImg()}
	                  </View>
                    </View>
                      <View style={styles.contentBox}>
                       	<View style={{padding:5,flex:1}}>
                      		<Text>Rate : {this.props.services.serviceRate}</Text>
                      	</View>
                      	<View style={{padding:5,flex:1}}>
                      		<Text style={{flex:1}}>Expected Completion : {this.props.services.serviceDayNumbers} {this.props.services.serviceDuration}</Text>
                      	</View>
                      	<View style={{padding:5,flex:1}}>
                      		<Text style={{flex:1}}>{this.props.services.servicesDescription}</Text>
                      	</View>
                      	
                      </View>
                	<View style={{marginBottom:10}}>
		                <Button
		                    textStyle   = {{textAlign:'center'}}
		                    title       = "Continue"
		                    buttonStyle = {styles.continueBtn}
                        onPress     = {this.handleContinue}
		                />
		              </View>
                </View>

              </ScrollView>
              :
                <Loading />
              }
            </View>
          </SideMenu>
        </Drawer>
          // </DrawerLayoutAndroid>
    );
  }
}
export default createContainer((props) => {

  const { state } = props.navigation;
  var _id         = state.params.id;

  const postHandle  = Meteor.subscribe('singleServices',_id);
  const orderHandle = Meteor.subscribe('allOrders');
  const services    = Meteor.collection('services').findOne({"_id":_id});
  console.log('services: ', services);
  const loading     = postHandle.ready() && orderHandle.ready();
  
  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  if(services){
    var imagePath = services.image;
    var splitPath = imagePath.split(':');
      if(splitPath[0] == 'http'){
        services.image = 'https:'+splitPath[1];
      }  
  }
  
  return {
      loading,
      services,
      notificationCount
  };

}, ServiceInfo);
