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
import IdentityInformation from'../ViewProfile/IdentityInformation.js';
import Skills from'../ViewProfile/Skills.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';


// var detailData = [];

class PackageRequiredData extends React.Component {
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
    var serviceArray = [];
    var serviceDetailsObj ={};  
    var detailData = this.state.detailData;
    for(i = 0 ; i < detailData.length; i++){ 
        var type = detailData[i].split(':');
        if( type[0] == 'Permanent Address ' || type[0] == 'Current Address '){
          if ( type[0] == 'Permanent Address ') {
            for(j = 0 ; j < this.props.userprofile.permanentAddress.length ; j++){
              if (parseInt(type[1]) == this.props.userprofile.permanentAddress[j].permanentAddressId) {
                var tempdata = this.props.userprofile.permanentAddress[j];
                tempdata.verificationType = "permanentAddress";
                tempdata.verificationId = parseInt(type[1]);
                tempdata.serviceRequired = 'AddressForm';
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
                  tempdata.serviceRequired = 'AddressForm';
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
                  tempdata.serviceRequired = 'WorkForm';
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
                  tempdata.serviceRequired = 'EducationForm';
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
                tempdata.serviceRequired = "CertificatesForm";
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
            "serviceRequired"   : "StatutoryForm"
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
            "serviceRequired"   : "StatutoryForm" 
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
            "serviceRequired"   : "StatutoryForm"            
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
            "serviceRequired"   : "StatutoryForm"            
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
            "serviceRequired"   : "StatutoryForm"            
          }
          data.push(tempdata);
          identityCount ++;
        }
      }//EOF Details Data
     
      
      
      if(data && detailData.length > 0){
        var dataCount = 0;
        //Check proof for document is submited or not
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
        
        var alertMsg = '';

        var addressAvailable = false;
        if(this.props.userprofile.permanentAddress){
          if(this.props.userprofile.permanentAddress.length > 0){
            addressAvailable = true;
          }
        }
        if(this.props.userprofile.currentAddress){
          if(this.props.userprofile.currentAddress.length > 0){
            addressAvailable = true;
          }
        }
        if(!addressAvailable){
          // Alert.alert("","Please Add Your Address for Invoice!");
          alertMsg += 'Please Add Your Address for Invoice';
        }
        //If proof of document available and also address is available
        if (data.length == dataCount && addressAvailable){  
          var paramsId         = this.props.paramsId
          var splitId          = paramsId.split('-');
          var id               = splitId[0];
          var orderId          = splitId[2];
          var getUser          = Meteor.user();
          var userId           = getUser._id;
          var userName         = getUser.profile.firstname+' '+getUser.profile.lastname;
          
          if(orderId){
            Meteor.call("updateOrderVerification",orderId,data,(error,result)=>{
              if(error){
                
              }else if(result){
                // swal({title:'Order Updated'});
                // *Get Order number from order table 
                
                var OrderDetails     = Meteor.collection('order').findOne({'_id':orderId});
                
                if(OrderDetails){
                  var orderNo   = OrderDetails.orderNo;
                  var orderDate = OrderDetails.createdAt;
                  if(OrderDetails.companyDetails && OrderDetails.paymentBy == 'Company'){
                    //Update only order if order is paid by company
                    /**when company paid for candidate Generate ticket and land on myorder page*/

                    var verificationDataLength = OrderDetails.candidateDetails.map((q)=>{ 
                      if(q.candidateId == Meteor.userId())
                        { return q.verificationData.length;}  
                    });

                    if(verificationDataLength){
                      var matchCandidateIndex = OrderDetails.candidateDetails.findIndex(x=> x.candidateId == Meteor.userId());  
                      if(matchCandidateIndex >= 0){
                        var verificationData = verificationDataLength.filter(verificationDataLength => verificationDataLength > 0);
                        if(verificationData){
                          var actualVerificationDataLen =  verificationData[0];
                          if(actualVerificationDataLen){
                            var index = actualVerificationDataLen - 1;
                            ticketGeneration(OrderDetails,index,matchCandidateIndex);
                          }
                        }
                      }
                    }//EOF verificationDataLength

                    this.props.navigation.navigate('MyOrder');
                  }else{
                    if(this.props.userprofile.permanentAddress.length > 0 || this.props.userprofile.currentAddress.length > 0){
                      var billingDetails = {
                        address  : this.props.userprofile.permanentAddress[0].line1 +","+ this.props.userprofile.permanentAddress[0].line2+","+ this.props.userprofile.permanentAddress[0].line3+","+ this.props.userprofile.permanentAddress[0].landmark,
                        city     : this.props.userprofile.permanentAddress[0].city,
                        state    : this.props.userprofile.permanentAddress[0].state,
                        country  : this.props.userprofile.permanentAddress[0].country,
                        pincode  : this.props.userprofile.permanentAddress[0].pincode,
                      }

                      //Invoice Generation
                      var tax  = [];
                      var taxAmountArray = [];
                      var companyData = Meteor.collection('companySetting').findOne({"companyId": 1}); 
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

                        if(companyData.taxSettings){
                          for (var i = 0; i < companyData.taxSettings.length; i++) {
                            if (companyData.taxSettings[i].effectiveTo ) {
                              if (currentDate <= companyData.taxSettings[i].effectiveTo && currentDate >= companyData.taxSettings[i].effectiveFrom) {
                                 tax.push( companyData.taxSettings[i]);
                              }
                            }else if (currentDate >= companyData.taxSettings[i].effectiveFrom) {
                               tax.push( companyData.taxSettings[i]);
                            }
                          }
                        }//EOF companyData.taxSettings

                        var taxAmount  = 0;
                        var actualAmount = 0;

                        if(this.props.orderDetails){
                          var serviceDetails = this.props.orderDetails.packageDetails.servicesIncluded;
                          
                          if(serviceDetails.length > 0){
                            var actualAmount = 0;
                            for(var j=0;j< serviceDetails.length;j++){
                              var totalQty = 0;
                              if(serviceDetails[j].serviceRequired == 'AddressForm'){
                                totalQty = addressCount;
                              }else if(serviceDetails[j].serviceRequired == 'WorkForm'){
                                totalQty = employmentCount;
                              }else if(serviceDetails[j].serviceRequired == 'EducationForm'){
                                totalQty = academicsCount + professionalCount;
                              }else if(serviceDetails[j].serviceRequired == 'SkillsCertificate'){
                                totalQty = certificatesCount;                
                              }else if(serviceDetails[j].serviceRequired == "StatutoryForm"){
                                totalQty = identityCount;
                              }else{
                                total = 0;
                              }
                              serviceDetailsObj = {
                                "serviceId"     : serviceDetails[j].serviceId,
                                "serviceName"   : serviceDetails[j].serviceName,
                                "serviceRate"   : serviceDetails[j].serviceRate,
                                "totalQty"      : totalQty,                    
                              }
                              serviceArray.push(serviceDetailsObj);
                              var serviceRate       = serviceDetails[j].serviceRate;
                              var individualAmount  = parseFloat(serviceRate) * totalQty;
                              actualAmount      = actualAmount+individualAmount;
                            }//EOF j
                            
                            /**Apply dscount on actual ammount */
                            
                            
                            var discountValue =  (this.props.orderDetails.packageDetails.packageDiscount/100)*actualAmount;  
                            
                            var reducedPrice = actualAmount-discountValue;
                            if (tax.length > 0) {
                              for (var i = 0; i < tax.length; i++) {
                                var taxPrice      = parseFloat(tax[i].applicableTax);
                                var taxAmt        = (parseFloat(taxPrice) / 100) *  parseFloat(reducedPrice);
                                taxAmount         = taxAmount + taxAmt;
                                taxDetails        = {
                                                        'taxName'         : tax[i].taxType,
                                                        'taxRate'         : tax[i].applicableTax,
                                                        'calculatedAmount': taxAmt
                                                    }
                                taxAmountArray.push(taxDetails);
                              }//EOF tax.length
                            }else{
                              var actualAmount  = parseFloat(serviceRate) * totalQty;
                            }
                            var totalAmount     = parseFloat(taxAmount) + parseFloat(reducedPrice);
                          }//EOF serviceDetails.length
                        }//EOF this.props.orderDetails
                      }//EOF companyData

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
                        packageDetails    : {

                                              packageId         : this.props.orderDetails.packageDetails.packageId,
                                              packageName       : this.props.orderDetails.packageDetails.packageName,
                                              packageDiscount   : this.props.orderDetails.packageDetails.packageDiscount,
                                              serviceDetails    : serviceArray,
                                            },
                        billingDetails       : billingDetails,  
                        companyReference     : this.props.userprofile.companyReferences,                  
                        tax                  : tax,
                        taxAmount            : taxAmountArray,
                        packageDiscountValue : discountValue,
                        actualAmount         : actualAmount,
                        reducedActualAmount  : reducedPrice,
                        totalAmount          : totalAmount,
                        paymentStatus     : 'unpaid'

                      }//EOF invoice
                      
                      Meteor.call("insertInvoice",invoiceData,(err,res)=>{
                        if (error) {
                          
                        }else{
                          var invoiceId = res;
                          
                          
                          Meteor.call('updateInvoiceDetailsInOrder',orderId,invoiceId,(error,result)=>{
                          });

                        this.props.navigation.navigate('Invoice',{Id:invoiceId});
                          
                          // var path = "/ServiceInvoice/"+invoiceId;
                          // browserHistory.replace(path);
                        }
                      });

                    }

                  }

                }//EOF OrderDetails
  
              }
            })
          }
        }// if data.length and addressavailable
        else{
          Alert.alert('',alertMsg);
        }
      }//if data
      else{
        Alert.alert('','Please add information and then select one'); 
      }//else 
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

                <HeaderDy headerTitle="Required Information" goBack={goBack}/>
              
              <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>

                { 
                  this.props.totaLoading && this.props.serviceDetails.length > 0 ?
                    this.props.serviceDetails.map((serviceData,index)=>{
                      return(
                          <View key ={index} style={{padding:10}}>
                            { serviceData.serviceRequired == "ProfileForms" ?
                              <View>
                                <BasicInformation  userprofile={this.props.userprofile} navigate={this.props.navigation}/>
                              </View>
                              :
                              null
                            }
                            <View style={styles.borderBottom}></View>

                            { serviceData.serviceRequired == "AddressForm" ?
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

                            { serviceData.serviceRequired == "WorkForm"  ?
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

                           { serviceData.serviceRequired  == "EducationForm" ?
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

                            { serviceData.serviceRequired == "StatutoryForm" ?
                                <View>
                                  <IdentityInformation 
                                    key={this.props.userprofile._id + '-identity'}  
                                    userData={this.props.userprofile}
                                    checkboxRequired={true}
                                    serviceDetails ={serviceData}
                                    navigate={this.props.navigation}
                                    addDataToParent={this.addDataToArray.bind(this)}
                                  />       
                                </View>
                                :
                              null
                            }

                            <View style={styles.borderBottom}></View>

                            { serviceData.serviceRequired  == "SkillsCertificate" ?
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
                      )
                    })

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
  var packageId    = splitId[0];  
  var _id          = splitId[2];
  
  
  // var id = Meteor.userId();
  const postHandle = Meteor.subscribe('singleServices',_id);
  const singleOrderHandle = Meteor.subscribe('singleOrder',_id);
  const postHandle1 = Meteor.subscribe('userprofile',Meteor.userId());
  const loading  = postHandle.ready();
  const loading1 = postHandle1.ready();
  const services = Meteor.collection('services').findOne({"_id":_id});
  const userprofile  = Meteor.collection('userProfile').findOne({"userId" : Meteor.userId()});
  
  
  const postHandle2 = Meteor.subscribe('companyData');
  const loading2 = postHandle2.ready();
  const companyData = Meteor.collection("companySetting").findOne({"companyId": 1});
  const orderDetails = Meteor.collection("order").findOne({"_id":_id});
  if(orderDetails){
    var serviceDetails = orderDetails.packageDetails.servicesIncluded;
    
  }
  // 
  // if(userprofile){
  //   var count = 1;
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
  //   userprofile.chkcount = count;
  // } 
  // 
  // if(_id){
    var totaLoading = loading && loading2;
    

    const notifPostHandle = Meteor.subscribe('userNotification');
    var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
    // 
    return {
        totaLoading,
        loading,
        loading1,
        userprofile,
        companyData,
        notificationCount,
        serviceDetails,
        orderDetails,
        paramsId
    };

}, PackageRequiredData);
