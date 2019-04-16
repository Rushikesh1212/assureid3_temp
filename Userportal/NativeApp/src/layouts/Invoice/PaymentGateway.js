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
import Moment from 'moment';
import ShowNotification from '../NotificationLayout/ShowNotification.js';



class PaymentGateway extends React.Component {
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

  ticketGeneration = function(Orders,index,matchCandidateIndex){ 
    
    
    let self = this;
    var cnt = false;
    
    if(index >= 0){
      /**Generate ticket accroding to service details or package details */
      if(Orders.serviceDetails){
        var serviceId         = Orders.serviceDetails.serviceId;
        var serviceName       = Orders.serviceDetails.serviceName;
        var serviceDayNumbers = Orders.serviceDetails.serviceDayNumbers;
        var serviceImage      = Orders.serviceDetails.serviceImage;
        var serviceImgFileExt = Orders.serviceDetails.serviceImgFileExt;  
        cnt = true;              
      }else if(Orders.packageDetails){
        var serviceIndex = Orders.packageDetails.servicesIncluded.findIndex(x=> x.serviceRequired == Orders.candidateDetails[matchCandidateIndex].verificationData[index].serviceRequired);
        if(serviceIndex >= 0){
          var serviceId         = Orders.packageDetails.servicesIncluded[serviceIndex].serviceId;
          var serviceName       = Orders.packageDetails.servicesIncluded[serviceIndex].serviceName;
          var serviceDayNumbers = Orders.packageDetails.servicesIncluded[serviceIndex].serviceDayNumbers;
          var serviceImage      = Orders.packageDetails.servicesIncluded[serviceIndex].serviceImage;
          var serviceImgFileExt = Orders.packageDetails.servicesIncluded[serviceIndex].serviceImgFileExt;
          cnt = true;
        }
      }
      
      if(cnt){
        var newTicket = {
          "orderId"           : Orders._id,
          "orderNo"           : Orders.orderNo,
          "orderDate"         : Orders.createdAt,
          "assureId"          : Orders.candidateDetails[matchCandidateIndex].candidateAssureID,
          "serviceId"         : serviceId,
          "serviceName"       : serviceName,
          "serviceDayNumbers" : serviceDayNumbers,
          "serviceImage"      : serviceImage,
          "serviceImgFileExt" : serviceImgFileExt,
          "tatDate"           : Orders.tatDate,
          "userId"            : Orders.candidateDetails[matchCandidateIndex].candidateId,
          "userName"          : Orders.candidateDetails[matchCandidateIndex].candidateFirstName+" "+Orders.candidateDetails[matchCandidateIndex].candidateLastName,
          "verificationType"  : Orders.candidateDetails[matchCandidateIndex].verificationData[index].verificationType,
          "verificationId"    : Orders.candidateDetails[matchCandidateIndex].verificationData[index].verificationId,
          "verificationData"  : Orders.candidateDetails[matchCandidateIndex].verificationData[index],
          "matchCandidateIndex":matchCandidateIndex,
        };
        if(Orders.invoiceDetails){
          newTicket.invoiceId = Orders.invoiceDetails.invoiceId;
          newTicket.invoiceNo = Orders.invoiceDetails.invoiceNumber;
        }
        
        // self.ticketGeneration(Orders,index-1,matchCandidateIndex);
        Meteor.call('createTicket',newTicket,index,function (error,result) {
        if (error) {
              
        }else if(result){
          

          Meteor.call('sendUserNotifications',Meteor.userId(),'Payment Complete',(error,result)=>{
            if(error){
              
            }else{
              
            }
          });
          
          self.ticketGeneration(Orders,index-1,matchCandidateIndex);
          if (Orders.requestPoolId) {
            Meteor.call('updateCompanyOrderAfterTicket',Orders.requestPoolId,result);
          }
        }
      });
      }
     
    }else{
      return;
    }
  }

  confirmPayment = () =>{
    
    var orderId = this.props.orders._id;
    var orders  =  this.props.orders;
    let self = this;
    var tatDate; 
    
    Meteor.call('getOrderTatDate', orders.serviceDayNumbers, (error,result)=>{

      if(error){
        
      }else{
        tatDate = result;  
        Meteor.call('updateInvoice',orders.invoiceNo, (error,result)=>{
          if (error) {
          }else{
              Meteor.call('updateOrderStatus',orderId,tatDate, (error,result)=> {
              if (error) {
              }else{
                

                var verificationDataLength = orders.candidateDetails.map((q)=> { if(q.candidateId == Meteor.userId()){ return q.verificationData.length;}  });
                var matchCandidateIndex = orders.candidateDetails.findIndex(x=> x.candidateId == Meteor.userId());
                  // a.findIndex(x => x.prop2=="yutu");
                var verificationData = verificationDataLength.filter(verificationDataLength => verificationDataLength > 0);
                var actualVerificationDataLen =  verificationData[0];
                var index = actualVerificationDataLen - 1;
                                                  
                
                this.ticketGeneration(orders,index,matchCandidateIndex);
                // self.ticketGeneration(orders,0);
              }
            });        
          }
        });

        this.props.navigation.navigate('InvoiceReciept',{id:orderId});

      }

    });
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
                <HeaderDy headerTitle="Payment Gateway" goBack={goBack}/>
                
                {this.props.loading ?
                <View style={styles.formContainer}>
                  <View style={{flex:1,backgroundColor:'#bbb',paddingVertical:50,paddingHorizontal:20,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#fff',fontSize:20}}>
                      Payment Gateway will be
                    </Text>
                    <Text style={{color:'#fff',fontSize:20}}>
                      added soon!
                    </Text>
                  </View>

                  <View style={{flex:1,paddingVertical:20,alignItems:'center',justifyContent:'center'}}>
                    <Button  
                      textStyle={{textAlign:'center'}} 
                      buttonStyle={styles.button1}
                      onPress={this.confirmPayment} 
                      title="CONFIRM PAYMENT"
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
  
  const postHandle  = Meteor.subscribe('singleOrder',orderId);
  const orders      = Meteor.collection('order').findOne({'_id':orderId});
  const loading     = postHandle.ready();
   

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  
  return{
    loading,
    orders,
    notificationCount,
  };
}, PaymentGateway);

