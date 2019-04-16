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
import Modal from "react-native-modal";
import Moment from 'moment';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import BasicInformation from '../ViewProfile/BasicInformation.js';
import AddressInformation from '../ViewProfile/AddressInformation.js';
import AcademicsInformation from '../ViewProfile/AcademicsInformation.js';
import ExperienceInformation from '../ViewProfile/ExperienceInformation.js';
import CertificationInformation from'../ViewProfile/CertificationInformation.js';
import Skills from'../ViewProfile/Skills.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';
import IdentityInformation from '../ViewProfile/IdentityInformation.js';



// var detailData = [];

class RequiredInformation extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state={
      name            : name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#f7ac57',
      detailData      : [],
      // "subscription" : {
      //   "services"       : Meteor.subscribe("services"),
      //   "companyData"    : Meteor.subscribe("companyData"),
      // }
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    // this.handleView = this.handleView.bind(this);
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
    
    if (this.props.navigation.state.routeName != "ServiceList") {
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

  // addDataToArray = (data) => {
  //   
  //   if(!detailData.includes(data)){
  //     detailData.push(data);
  //   }else{
  //     var index = detailData.indexOf(data);
  //     
  //     detailData.splice(index, 1);
  //   }
  //   // 
  // }

  addDataToArray = (data) => {
    
    var detailDataArr = this.state.detailData;
    // 
    // 

    if(!detailDataArr.includes(data)){
      detailDataArr.push(data);
    }else{
      var index = detailDataArr.indexOf(data);
      
      detailDataArr.splice(index, 1);
    }
    this.setState({detailData:detailDataArr});
    // 
  }

  purchaseClick = () => {
    var data              = [];
    var addressCount      = 0;
    var employmentCount   = 0;  
    var academicsCount    = 0;
    var certificatesCount = 0;
    var professionalCount = 0;
    var identityCount     = 0;


    var detailData = this.state.detailData;
    

    // 
    for(i = 0 ; i < detailData.length; i++){ 
        var type = detailData[i].split(':');
        
        // 
        // 
        if( type[0] == 'Permanent Address ' || type[0] == 'Current Address '){
          if ( type[0] == 'Permanent Address ') {
            for(j = 0 ; j < this.props.userprofile.permanentAddress.length ; j++){
              if (parseInt(type[1]) == this.props.userprofile.permanentAddress[j].permanentAddressId) {
                var tempdata = this.props.userprofile.permanentAddress[j];
                tempdata.verificationType = "permanentAddress";
                tempdata.verificationId = parseInt(type[1]);
                if(tempdata.residingTo == 'Present'){
                  tempdata.residingTo = Moment(new Date()).format("MM/DD/YYYY");
                }
                data.push(tempdata);
              }  
            }
            // var tempdata = this.props.userprofile.permanentAddress[parseInt(type[1])];
          }
          if ( type[0] == 'Current Address ') {
            for(k = 0 ; k < this.props.userprofile.currentAddress.length ; k++){
             if (parseInt(type[1]) == this.props.userprofile.currentAddress[k].currentAddressId) {
                  var tempdata = this.props.userprofile.currentAddress[k];
                  tempdata.verificationType = "currentAddress";
                  tempdata.verificationId = parseInt(type[1]);
                  if(tempdata.tempresidingTo == 'Present'){
                    tempdata.tempresidingTo = Moment(new Date()).format("MM/DD/YYYY");
                  }
                  data.push(tempdata);
              }
            }
            // var tempdata = this.props.userprofile.currentAddress[parseInt(type[1])];
             
          }
          addressCount ++;
        }else if(type[0] == 'Employment '){
          for(l = 0 ; l < this.props.userprofile.employement.length ; l++){
            // 
            if (parseInt(type[1]) == this.props.userprofile.employement[l].employementId) {
                var tempdata = this.props.userprofile.employement[l];
                 tempdata.verificationType = "employement";
                  tempdata.verificationId = parseInt(type[1]);
                  if(tempdata.employmentTo == 'Present'){
                    tempdata.employmentTo = Moment(new Date()).format("MM/DD/YYYY");
                  }
                  data.push(tempdata);
            }
          }
          // var tempdata = this.props.userprofile.employement[parseInt(type[1])];
          employmentCount++; 
        }else if(type[0] == 'Academics '){
          for(m = 0 ; m < this.props.userprofile.education.length ; m++){
             if (parseInt(type[1]) == this.props.userprofile.education[m].educationId) {
                  var tempdata = this.props.userprofile.education[m];
                   tempdata.verificationType = "education";
                  tempdata.verificationId = parseInt(type[1]);
                  data.push(tempdata);
              }
          }
          // var tempdata = this.props.userprofile.education[parseInt(type[1])];
          // data.push(this.props.userprofile.employement[parseInt(type[1])]);
          academicsCount++
        }else if(type[0] == 'Certificate Details '){
          for(n = 0 ; n < this.props.userprofile.certificates.length ; n++){
           if (parseInt(type[1]) == this.props.userprofile.certificates[n].certificateId) {
                var tempdata = this.props.userprofile.certificates[n];
                tempdata.verificationType = "certificates";
                tempdata.verificationId = parseInt(type[1]);
                data.push(tempdata);
            }
          }
           // var tempdata = this.props.userprofile.certificates[parseInt(type[1])];
          certificatesCount++;
        }else if(type[0] == 'Professionals Academics '){
          for(o = 0 ; o < this.props.userprofile.professionalEducation.length ; o++){
           if (parseInt(type[1]) == this.props.userprofile.professionalEducation[o].professionalEducationId) {
                var tempdata = this.props.userprofile.professionalEducation[o];
                 tempdata.verificationType = "professionalEducation";
                  tempdata.verificationId = parseInt(type[1]);
                  data.push(tempdata);
            }
          }
          // var tempdata = this.props.userprofile.professionalEducation[parseInt(type[1])]; 
          professionalCount++
        }else if(type[0] == 'Aadhar Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.adharCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.aadhar1,
            "fileExt"           : this.props.userprofile.identity.aadhar1ext,
            "fileName"          : this.props.userprofile.identity.aadhar1name,
            "img2"              : this.props.userprofile.identity.aadhar2,
            "proofOfDocument2"  : this.props.userprofile.identity.aadhar2ext,
            "fileName2"         : this.props.userprofile.identity.aadhar2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Pan Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.panCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.pan1,
            "fileExt"           : this.props.userprofile.identity.pan1ext,
            "fileName"          : this.props.userprofile.identity.pan1name,
            "img2"              : this.props.userprofile.identity.pan2,
            "proofOfDocument2"  : this.props.userprofile.identity.pan2ext,
            "fileName2"         : this.props.userprofile.identity.pan2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
            "serviceRequired"   : "StatutoryForm"
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Driving License '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.drivingCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.driving1,
            "fileExt"           : this.props.userprofile.identity.driving1ext,
            "fileName"          : this.props.userprofile.identity.driving1name,
            "img2"              : this.props.userprofile.identity.driving2,
            "proofOfDocument2"  : this.props.userprofile.identity.driving2ext,
            "fileName2"         : this.props.userprofile.identity.driving2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Voting Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.votingCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.voting1,
            "fileExt"           : this.props.userprofile.identity.voting1ext,
            "fileName"          : this.props.userprofile.identity.voting1name,
            "img2"              : this.props.userprofile.identity.voting2,
            "proofOfDocument2"  : this.props.userprofile.identity.voting2ext,
            "fileName2"         : this.props.userprofile.identity.voting2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Ration Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.rationCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.ration1,
            "fileExt"           : this.props.userprofile.identity.ration1ext,
            "fileName"          : this.props.userprofile.identity.ration1name,
            "img2"              : this.props.userprofile.identity.ration2,
            "proofOfDocument2"  : this.props.userprofile.identity.ration2ext,
            "fileName2"         : this.props.userprofile.identity.ration2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Passport '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.passportNo,
            "proofOfDocument"   : this.props.userprofile.identity.passport1,
            "fileExt"           : this.props.userprofile.identity.passport1ext,
            "fileName"          : this.props.userprofile.identity.passport1name,
            "img2"              : this.props.userprofile.identity.passport2,
            "proofOfDocument2"  : this.props.userprofile.identity.passport2ext,
            "fileName2"         : this.props.userprofile.identity.passport2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
          }
          data.push(tempdata);
          identityCount ++;
        }
      }
      
    

      var services         = this.props.services;
      var serviceId        = services._id;
      var serviceName      = services.serviceName;
      var serviceRate      = parseFloat(services.serviceRate);
      var serviceDayNumbers = services.serviceDayNumbers;
      var serviceDuration  = services.serviceDuration;
      var serviceDate      = services.createdAt;
      var serviceImage     = services.image;
      var getUser          = Meteor.user();
      var userId           = getUser._id;
      var userName         = getUser.profile.firstname+' '+getUser.profile.lastname;

      /* Get Order number from order table */
      var orderDetails     = this.props.orderDetails;
      if(orderDetails){
        var orderId     = orderDetails._id;
        var orderNo     = orderDetails.orderNo;
        var orderDate   = orderDetails.createdAt;
      }

      //Invoice Generation
      var tax  = [];
      var taxAmountArray = [];
      // var companyData      = Meteor.collection("companySetting").findOne({"companyId": 1}); 
      var companyData = this.props.companyData;
      // 
      if (companyData) {
        var companyName         = companyData.companyName;
        var companyAddressFeild = companyData.companyLocationsInfo[0];
        var companyAddress      = companyAddressFeild.companyAddress;
        var companyCity         = companyAddressFeild.companyCity;
        var companyCountry      = companyAddressFeild.companyCountry;
        var companyPincode      = companyAddressFeild.companyPincode;
        var companyState        = companyAddressFeild.companyState;
        var newDate             = new Date();
        var currentDate         = Moment(newDate).format("YYYY-MM-DD");
        if (companyData.taxSettings) {
          for (var i = 0; i < companyData.taxSettings.length; i++) {
            if (companyData.taxSettings[i].effectiveTo) {
              // 
              if ((currentDate >= companyData.taxSettings[i].effectiveFrom) && (currentDate <= companyData.taxSettings[i].effectiveTo)) {
                // 
                tax.push( companyData.taxSettings[i]);
              }
            }else if (currentDate >= companyData.taxSettings[i].effectiveFrom) {
              // 
              tax.push( companyData.taxSettings[i]);
            }
          }
        }
        var taxAmount  = 0;
        if (tax.length > 0) {
          for (var i = 0; i < tax.length; i++) {
            var taxPrice      = parseFloat(tax[i].applicableTax);
            var actualAmount  = parseFloat(serviceRate) * parseFloat(data.length);
            var taxAmt        = (parseFloat(taxPrice) / 100) *  parseFloat(actualAmount);
            taxAmount         = taxAmount + taxAmt;
            taxDetails        = {
                                  'taxName'         : tax[i].taxType,
                                  'taxRate'         : tax[i].applicableTax,
                                  'calculatedAmount': taxAmt
                                }
            taxAmountArray.push(taxDetails);
            // tax[i].taxAmount          = taxAmt;
            // 
          }
        }else{
          var actualAmount    = parseFloat(serviceRate) * parseFloat(data.length);
        }
        
        var totalAmount       = parseFloat(taxAmount) + parseFloat(actualAmount);
      }

      var assureId  = this.props.userprofile.assureId;

      var invoiceData = {
        assureId          : assureId,
        companyName       : companyName,
        orderId           : orderId,
        orderNo           : orderNo,
        orderDate         : orderDate,
        userDetails       : {
                              userId    : userId,
                              userName  : userName,
                            },
        companyAddress    : {
                              companyAddress    : companyAddress,
                              companyCity       : companyCity,
                              companyState      : companyState ,
                              companyCountry    : companyCountry ,
                              companyPincode    : companyPincode,
                            },
        serviceDetails    : {
                              serviceId         : serviceId,
                              serviceName       : serviceName,
                              serviceRate       : serviceRate,
                              // serviceDayNumbers : serviceDayNumbers,
                              // serviceDuration   : serviceDuration,
                              // serviceDate       : serviceDate,
                              // serviceImage      : serviceImage,
                              // serviceImgFileExt : serviceImgFileExt,
                              totalQty          : addressCount+employmentCount+academicsCount+certificatesCount+professionalCount+identityCount,
  
                            },
        tax               : tax,
        taxAmount         : taxAmountArray,
        actualAmount      : actualAmount,
        totalAmount       : totalAmount,
        receiptId         : "",
        paymentStatus     : 'unpaid'
      }

      if (detailData.length > 0) {
        var dataCount = 0;
        var alertMsg = '';

        var addressAvailable  = false;
        var permAddrAvailable = currAddrAvailable = false;

        if(this.props.userprofile.permanentAddress){
          if(this.props.userprofile.permanentAddress.length > 0){
            addressAvailable = true;
            permAddrAvailable = true;
          }
        }
        if(this.props.userprofile.currentAddress){
          if(this.props.userprofile.currentAddress.length > 0){
            addressAvailable = true;
            currAddrAvailable = true;
          }
        }
        if(!addressAvailable){
          // Alert.alert("","Please Add Your Address for Invoice!");
          alertMsg += 'Please Add Your Address for Invoice';
        }

        for (var i = 0; i < data.length; i++) {
          if (data[i].proofOfDocument == ''){
            if (data[i].verificationType == "permanentAddress") {
              var typeOfVerification = "Permanent Address";
            }else if (data[i].verificationType == "currentAddress") {
               var typeOfVerification = "Current Address";
            }else if (data[i].verificationType == "education") {
               var typeOfVerification = "Academics";
            }else if (data[i].verificationType == "certificates") {
               var typeOfVerification = "Certificate";
            }else if (data[i].verificationType == "employement") {
               var typeOfVerification = "Employement";
            }else if (data[i].verificationType == "professionalEducation") {
               var typeOfVerification = "Professionals Academics";
            }
            alertMsg += '\n\n'+'Please add Proof of Document in'+' '+typeOfVerification;
            // Alert.alert("","Please add Proof of Document in"+' '+typeOfVerification+'\n\n'+addrMsg);
            
          }else{
            dataCount ++;
          }
        }

        if (data.length == dataCount && addressAvailable) {  
          
          
          if(permAddrAvailable){
            var addressDetails = this.props.userprofile.permanentAddress[0];
          }else{
            var addressDetails = this.props.userprofile.currentAddress[0];
          }
          
          var billingDetails = {
            address  : addressDetails.line1 +","+ addressDetails.line2+","+ addressDetails.line3+","+ addressDetails.landmark,
            city     : addressDetails.city,
            state    : addressDetails.state,
            country  : addressDetails.country,
            pincode  : addressDetails.pincode,
          }

          
          var selectedArr ={};
          var requestPool = Meteor.collection('requestPool').find({});
          
          if(requestPool){
            for (var i = 0; i < requestPool.length; i++) {
              if(requestPool[i].companyOrderId){
                var companyOrder = Meteor.collection('companyOrder').findOne({'_id':requestPool[i].companyOrderId}) || {};

                if(companyOrder.orderDetails){
                  if(companyOrder.orderDetails.length > 0){
                    for (var j = 0; j < companyOrder.orderDetails.length; j++) {
                      var userProfile = Meteor.collection('userProfile').findOne({'assureId':companyOrder.orderDetails[j].assureId,'userId':Meteor.userId()}) || {};
                      var companyProfile  = Meteor.collection('companyProfile').findOne({'companyAssureID':requestPool[i].companyAssureId}) || {};
                      if(companyProfile){
                        var companyName = companyProfile.companyName;
                      }else{
                        // var companyName = userProfile.firstName + ' ' + userProfile.lastName;
                        var companyName = '';
                      }

                      if(companyOrder.orderDetails[j].userId == Meteor.userId() && companyOrder.serviceId == this.props.services._id ){
                        // selectedArr.push({
                        //   "_id"        : requestPool[i]._id,
                        //   "tatDate"    : requestPool[i].tatDate._d,
                        //   "paidBy"     : requestPool[i].paidBy,
                        // });
                        selectedArr._id = requestPool[i]._id;
                        selectedArr.tatDate = requestPool[i].tatDate._d;
                        selectedArr.paidBy = requestPool[i].paidBy;
                      }
                    }// for j
                  }// if length>0
                }// orderDetails
              }// if companyOrderId
            }// for i
          }// if requestPool

          var self = this;
          invoiceData.billingDetails = billingDetails;
          if(selectedArr){
            invoiceData.companyReference = this.props.userprofile.companyReferences;
            invoiceData.requestPoolId = selectedArr._id;

            if(selectedArr.paidBy == "Company"){
              Meteor.call("insertCompanyInvoice",invoiceData,(error,result)=>{
                if (error) {
                  
                }else{
                // swal("Done","Temporary Invoice Genrated!"); 
                // var path = "/myOrders";
                // browserHistory.replace(path);
                  this.props.navigation.navigate('MyOrder');
                }
              });
            }else{
              Meteor.call("updateOrderVerification",orderId,data,(error,result)=>{
                if(result == 1){
                    Meteor.call("insertInvoice",invoiceData,function(err,res){
                      if (error) {
                        
                      }else{
                        // swal("Done","Temporary Invoice Genrated!"); 
                        
                        var invoiceId = res;
                        Meteor.call('updateInvoiceDetailsInOrder',orderId,invoiceId,(error,result)=>{
                          if(result == 1){
                            // Session.set('showInvoice','');
                            // var path = "/ServiceInvoice/"+invoiceId;
                            // browserHistory.replace(path);
                            
                            self.props.navigation.navigate('Invoice',{Id:invoiceId});
                          }
                          
                        });
                      
                      }
                    });
                }
               });
            }

          }//if selectedArr

          // Meteor.call("insertInvoice",invoiceData,(error,result)=>{
          //    if (error) {
          //     
          //    }else{
          //     // swal("Done","Temporary Invoice Genrated!"); 
          //     // Session.set('showInvoice','');
          //     // var path = "/ServiceInvoice/"+result;
          //     // browserHistory.replace(path);
          //     this.props.navigation.navigate('Invoice',{Id:result});
          //     
          //    }
          // });

        }// if dataCount
        else{
          Alert.alert('',alertMsg);
        }
        
      }//if data
      else
      {
        Alert.alert('','Please add information and then select one'); 
      }//else 
  }

  render(){

    // 

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

                <HeaderDy headerTitle="Required Information" goBack={goBack}/>
              
              <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}
                keyboardShouldPersistTaps="handled"
              >

                { this.props.totaLoading ?
                <View style={{padding:10}}>
                	{ this.props.services.serviceRequired == "ProfileForms" ?
                    <View>
                      <BasicInformation  userprofile={this.props.userprofile} navigate={this.props.navigation}/>
                    </View>
                    :
                    null
                  }
                  <View style={styles.borderBottom}></View>

                  { this.props.services.serviceRequired == "AddressForm" ?
                    <View>
                      <AddressInformation 
                        profileId={this.props.userprofile._id} 
                        permanentAddress={this.props.userprofile.permanentAddress} 
                        currentAddress={this.props.userprofile.currentAddress} 
                        checkboxRequired={true} 
                        navigate={this.props.navigation} 
                        addDataToParent={this.addDataToArray.bind(this)}
                      />
                    </View>
                    :
                    null
                  }
                  <View style={styles.borderBottom}></View>

                  { this.props.services.serviceRequired == "WorkForm" ?
                      <View>
                        <ExperienceInformation 
                          key={this.props.userprofile._id + '-employement'} 
                          employeeData={this.props.userprofile.employement} 
                          checkboxRequired={true} 
                          navigate={this.props.navigation} 
                          addDataToParent={this.addDataToArray.bind(this)}
                        />       
                       </View>
                      :
                    null
                  }

                  <View style={styles.borderBottom}></View>

                { this.props.services.serviceRequired == "EducationForm" ?
                      <View>
                        <AcademicsInformation 
                          key={this.props.userprofile._id + '-academics'} 
                          academicsData={this.props.userprofile.education} 
                          professionalData={this.props.userprofile.professionalEducation} 
                          checkboxRequired={true} 
                          navigate={this.props.navigation} 
                          addDataToParent={this.addDataToArray.bind(this)}
                        />       
                      </View>
                      :
                    null
                  }

                  { this.props.services.serviceRequired == "StatutoryForm" ?

                        <View>
                            <IdentityInformation 
                              key={this.props.userprofile._id + '-identity'} 
                              userData={this.props.userprofile} 
                              serviceDetails ={this.props.services}
                              checkboxRequired={true}
                              navigate={this.props.navigation}
                              addDataToParent={this.addDataToArray.bind(this)}
                            />       
                        </View>
                    :
                    null
                  } 

                  <View style={styles.borderBottom}></View>

                  { this.props.services.serviceRequired == "SkillsCertificate" ?
                    <View>
                      <Skills 
                        userId={this.props.userprofile.userId} 
                        skillData={this.props.userprofile.skills} 
                        checkboxRequired={true} 
                        navigate={this.props.navigation} 
                      />
                     <View>
                        <CertificationInformation 
                          key={this.props.userprofile._id + '-certificate'} 
                          certificateData={this.props.userprofile.certificates} 
                          checkboxRequired={true} 
                          navigate={this.props.navigation} 
                          addDataToParent={this.addDataToArray.bind(this)}
                        />
                      </View>
                    </View>
                    :
                    null
                  }

                </View>

                :
                  <Loading />
                } 
                <View
                    style={{
                      alignItems: "center",
                      marginBottom: 20
                    }}
                  >
                    <Button
                      onPress={this.purchaseClick}
                      buttonStyle={styles.buttonLarge}
                      title="Purchase"
                    />
                </View>   
                    
                </ScrollView>
              </View>
            </SideMenu>
             </Drawer>
          // </DrawerLayoutAndroid>
    );
  }
}
export default createContainer((props) => {

  const { state } = props.navigation;
  var paramsId    = state.params.id;
  var splitId  = paramsId.split('-');
  var _id      = splitId[0];
  var orderId  = splitId[2];
  
  // var id = Meteor.userId();
  const postHandle = Meteor.subscribe('singleServices',_id);
  const postHandle1 = Meteor.subscribe('userprofile',Meteor.userId());
  const loading  = postHandle.ready();
  const loading1 = postHandle1.ready();
  const services = Meteor.collection('services').findOne({"_id":_id});
  
  const userprofile  = Meteor.collection('userProfile').findOne({"userId" : Meteor.userId()});
  
  const postHandle2 = Meteor.subscribe('companyData');
  const loading2 = postHandle2.ready();
  const companyData = Meteor.collection("companySetting").findOne({"companyId": 1});

  const postHandle3 = Meteor.subscribe('requestPoolData');
  const loading3    = postHandle3.ready();
  
  // 
  if(userprofile){
    var count = 1;
  //   if(userprofile.permanentAddress){
  //     for(i = 0 ; i < userprofile.permanentAddress.length;i++){
  //       userprofile.permanentAddress[i].chkid = count;
  //       count++;
  //     }
  //   }
  //   if(userprofile.currentAddress){
  //     for(i = 0 ; i < userprofile.currentAddress.length;i++){
  //       userprofile.currentAddress[i].chkid = count;
  //       count++;
  //     }
  //   }
  //   if(userprofile.employement){
  //     for(i = 0 ; i < userprofile.employement.length;i++){
  //       userprofile.employement[i].chkid = count;
  //       count++;
  //     }
  //   }
  //   if(userprofile.education){
  //     for(i = 0 ; i < userprofile.education.length;i++){
  //       userprofile.education[i].chkid = count;
  //       count++;
  //     }
  //   }
  //   if(userprofile.professionalEducation){
  //     for(i = 0 ; i < userprofile.professionalEducation.length;i++){
  //       userprofile.professionalEducation[i].chkid = count;
  //       count++;
  //     }
  //   }
  //   if(userprofile.certificates){
  //     for(i = 0 ; i < userprofile.certificates.length;i++){
  //       userprofile.certificates[i].chkid = count;
  //       count++;
  //     }
  //   }
    if(userprofile.identity){
      if(userprofile.identity.adharCardNo){
        userprofile.identity.adharCardChkid = count;
        count++;
      }
      if(userprofile.identity.panCardNo){
        userprofile.identity.panCardChkid = count;
        count++;
      }
      if(userprofile.identity.drivingCardNo){
        userprofile.identity.drivingCardchkid = count;
        count++;
      }
      if(userprofile.identity.votingCardNo){
        userprofile.identity.votingCardchkid = count;
        count++;
      }
      if(userprofile.identity.rationCardNo){
        userprofile.identity.rationCardchkid = count;
        count++;
      }
      if(userprofile.identity.passportNo){
        userprofile.identity.passportchkid = count;
        count++;
      }
    }
    userprofile.chkcount = count;
  //   userprofile.chkcount = count;
  } 
  // 
  // if(_id){
    
    var totaLoading = loading && loading2 && loading3;
    var orderDetails = Meteor.collection('order').findOne({"_id":orderId});

    

    const notifPostHandle = Meteor.subscribe('userNotification');
    var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
    // 
    return {
        totaLoading,
        loading,
        loading1,
        services,
        userprofile,
        companyData,
        orderDetails,
        notificationCount
        // id
    };

}, RequiredInformation);
