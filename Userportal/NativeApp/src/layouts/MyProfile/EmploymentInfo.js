import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import DatePicker from 'react-native-datepicker';
import ValidationComponent from 'react-native-form-validator';

import { Dropdown } from 'react-native-material-dropdown';
import { RNS3 } from 'react-native-aws3';


import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import ProfileNavigation from './ProfileNavigation.js';
import MyProfile from './MyProfile.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';


class EmploymentInfo extends ValidationComponent {
  constructor(props){
    super(props);
    // let name ="";
    // if(this.props.userName)
    //   name = "Welcome " + this.props.userName;
    
    // console.log("inside constructor");
    if(this.props.empDetails){
      
      // console.log("state empDetails ==== ",this.props.empDetails);
      var imagePath  = this.props.empDetails.proofOfDocument;
      var splitImage = imagePath.split(":");
      if(splitImage[0] == "http"){
        this.props.empDetails.proofOfDocument = "https:"+splitImage[1];
      }else{
        this.props.empDetails.proofOfDocument = this.props.empDetails.proofOfDocument;
      }

      if(this.props.empDetails.employmentTo == 'Present'){
        var showRadio     = true;
        var employmentTo  = '';
      }else{
        var showRadio     = false;
        var employmentTo  = this.props.empDetails.employmentTo;
      }
      // console.log("this.props.empDetails.proofOfDocument :"+this.props.empDetails.proofOfDocument);
      var stateObj = {
        "employementId"            : this.props.empDetails.employementId,
        "nameOfEmployer"           : this.props.empDetails.nameOfEmployer,
        "employerAddress"          : this.props.empDetails.employerAddress,
        "employerCity"             : this.props.empDetails.employerCity,
        "employerState"            : this.props.empDetails.employerState,
        "contactNo"                : this.props.empDetails.contactNo,
        "employeeCode"             : this.props.empDetails.employeeCode,
        "designation"              : this.props.empDetails.designation,
        "department"               : this.props.empDetails.department,
        "employmentFrom"           : this.props.empDetails.employmentFrom,
        "employmentTo"             : employmentTo,
        "lastSalaryDrawn"          : this.props.empDetails.lastSalaryDrawn,
        "typeOfEmployement"        : this.props.empDetails.typeOfEmployement, 
        "detailOfAgency"           : this.props.empDetails.detailOfAgency,
        "reasonOfLeaving"          : this.props.empDetails.reasonOfLeaving,
        "dutiesAndResponsibilites" : this.props.empDetails.dutiesAndResponsibilites,
        "reportingManagerNm"       : this.props.empDetails.reportingManagerNm,
        "reportManagerDesgn"       : this.props.empDetails.prevDesignation,
        "reportManagerContact"     : this.props.empDetails.contactDetails,
        "employmentProofType"      : this.props.empDetails.proofType,
        "editStatus"               : this.props.empDetails.editStatus,
        "showRadio"                : showRadio,
        nameOfEmployerError        : '',
        employerCityError          : '',
        employerStateError         : '',
        designationError           : '',
        departmentError            : '',
        employmentFromError        : '',
        lastSalaryDrawnError       : '',
        contactNoError             : '',
        reportingManagerNmError    : '',
        reportManagerDesgnError    : '',
        reportManagerContactError  : '',     
      };
      
    }else{
      var stateObj = {
        nameOfEmployer            : '',
        employerAddress           : '',
        employerCity              : '',
        employerState             : '',
        contactNo                 : '',
        employeeCode              : '',
        designation               : '',
        department                : '',
        employmentFrom            : '',
        employmentTo              : '',
        lastSalaryDrawn           : '',
        typeOfEmployement         : '',
        detailOfAgency            : '',
        reasonOfLeaving           : '',
        dutiesAndResponsibilites  : '',
        reportingManagerNm        : '',
        showRadio                 : true,
        reportManagerDesgn        : '',
        reportManagerContact      : '',
        employmentProofType       : '', 
        nameOfEmployerError        : '',
        employerCityError          : '',
        employerStateError         : '',
        designationError           : '',
        departmentError            : '',
        employmentFromError        : '',
        lastSalaryDrawnError       : '',
        contactNoError             : '',
        reportingManagerNmError    : '',
        reportManagerDesgnError    : '',
        reportManagerContactError  : '',       
      };
    }
    stateObj.isOpen           = false;
    stateObj.inputFocusColor  = '#00b8FF';
    stateObj.fontSize         = 14;

    this.state = stateObj;
    
    this.openDrawer  = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle      = this.toggle.bind(this);
    this.handleView  = this.handleView.bind(this);
  }

  handleView(){
    Actions.ViewCustomer();
  }
  componentDidMount(){
    // console.log("In componentDidMount..............................");
    // console.log("businessData => ",this.props.businessData);
    // console.log("loading => ",this.props.loading);
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler(){
    // console.log(this.props.navigation.state.routeName );
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
  }
  toggle() {
    // console.log('is open ' + this.state.isOpen);
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
    // console.log('Logout function!');
    Meteor.logout();
    Actions.LogIn();
  }
  openDrawer(){
    // console.log('opening drawer!');
          this.drawer.openDrawer();
  }
  closeDrawer(){
    // console.log('opening drawer!');
          this.drawer.closeDrawer();
  }
  closeControlPanel = () => {
    this._drawer.close()
  }
  openControlPanel = () => {
    this._drawer.open()
  }

  
  handleProceed = () => {
    Keyboard.dismiss();

    var id   = Meteor.userId();

    if(this.props.empProofObj.imageLink){
      var imgLink   = this.props.empProofObj.imageLink;
      var fileName  = this.props.empProofObj.name;
      var fileExt   = this.props.empProofObj.ext;
      var imgId     = this.props.empProofObj._id;
    }else{
      var imgLink   = '';
      var fileName  = '';
      var fileExt   = '';
    }
    
    var employementObj = Meteor.collection('userProfile').findOne({}, {sort: {'employement.employementId': -1}});
      // console.log("addressObj",addressObj);
    if(employementObj){
      if (employementObj.employement) {
         if (employementObj.employement.length > 0 ) {
          // var lastelem    = _.last(employementObj.employement);
          var lastelem = employementObj.employement[employementObj.employement.length-1];
          var employementId =  parseInt(lastelem.employementId) + 1;
        }else{
         var employementId=  1;
        }
      }
      else{
        var employementId=  1;
      }
    }

    if(this.state.employmentTo){
      var employmentTo = this.state.employmentTo;
    }else{
      var employmentTo = "Present";
    }

    var formValues = {
      "employementId"            : employementId,
      'nameOfEmployer'           : this.state.nameOfEmployer,
      'employerAddress'          : this.state.employerAddress,
      "employerCity"             : this.state.employerCity,
      "employerState"            : this.state.employerState,
      'contactNo'                : this.state.contactNo,
      'employeeCode'             : this.state.employeeCode,
      'designation'              : this.state.designation,
      'department'               : this.state.department,
      "employmentFrom"           : this.state.employmentFrom,
      "employmentTo"             : employmentTo,
      "lastSalaryDrawn"          : this.state.lastSalaryDrawn,
      "typeOfEmployement"        : this.state.typeOfEmployement,
      'detailOfAgency'           : this.state.detailOfAgency,
      'reasonOfLeaving'          : this.state.reasonOfLeaving,
      'dutiesAndResponsibilites' : this.state.dutiesAndResponsibilites,
      'reportingManagerNm'       : this.state.reportingManagerNm,
      'prevDesignation'          : this.state.reportManagerDesgn,
      'contactDetails'           : this.state.reportManagerContact,
      "proofType"                : this.state.employmentProofType,
      "proofOfDocument"          : imgLink,
      "fileName"                 : fileName,
      "fileExt"                  : fileExt,
      "verifiedStatus"           : "Not Verified",
      "editStatus"               : "Open",
    }

    // console.log("employement = ",formValues);

    if(this.validInput()){
      Meteor.call('insertEmployement', id, formValues, (error,result) =>{
        if(error){
          Alert.alert(
            'Error',
          );
        }else{
          Alert.alert(
            '','Employment details inserted successfully!',
          );

          this.state.nameOfEmployer = '';
          this.state.employerAddress = '';
          this.state.employerCity = '';
          this.state.employerState = '';
          this.state.contactNo = '';
          this.state.employeeCode = '';
          this.state.designation = '';
          this.state.department = '';
          this.state.employmentFrom = '';
          this.state.showRadio = '';
          this.state.employmentTo = '';
          this.state.lastSalaryDrawn = '';
          this.state.typeOfEmployement = '';
          this.state.detailOfAgency = '';
          this.state.reasonOfLeaving = '';
          this.state.dutiesAndResponsibilites = '';
          this.state.reportingManagerNm = '';
          this.state.reportManagerDesgn = '';
          this.state.reportManagerContact = '';
          this.state.employmentProofType = '';

          if(this.props.goBack){
            this.props.navigation.goBack(null);
          }
          // this.props.navigation.navigate('CertificateForm');
        }
      });
      if(imgId != ''){
        Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
          if (error) {
           console.log(error.reason);
          }else{  
          }
        });   
      }
    }
  }

  handleEdit = () => {
    Keyboard.dismiss();

    var id   = Meteor.userId();
    var index = this.props.index;
    var employementId = this.state.employementId;
    var editstatus    = this.state.editStatus;

    // console.log("endit employementId = ",employementId);
    
    if(this.props.empDetails){
      if(this.props.empDetails.proofOfDocument){
        var imgLink = this.props.empDetails.proofOfDocument;
        var fileName = this.props.empDetails.fileName;
        var fileExt = this.props.empDetails.fileExt;
      }else if(this.props.editEmpProofObj.imageLink){
        var imgLink = this.props.editEmpProofObj.imageLink;
        var fileName = this.props.editEmpProofObj.name;
        var fileExt = this.props.editEmpProofObj.ext;
        var imgId = this.props.editEmpProofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.empProofObj.imageLink){
      var imgLink = this.props.empProofObj.imageLink;
      var fileName = this.props.empProofObj.name;
      var fileExt = this.props.empProofObj.ext;
      var imgId = this.props.empProofObj._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }
    
    // var employementObj = Meteor.collection('userProfile').findOne({}, {sort: {'employement.employementId': -1}});

    if(this.state.employmentTo){
      var employmentTo = this.state.employmentTo;
    }else{
      var employmentTo = "Present";
    }

    var formValues = {
      "employementId"            : parseInt(employementId),
      'nameOfEmployer'           : this.state.nameOfEmployer,
      'employerAddress'          : this.state.employerAddress,
      "employerCity"             : this.state.employerCity,
      "employerState"            : this.state.employerState,
      'contactNo'                : this.state.contactNo,
      'employeeCode'             : this.state.employeeCode,
      'designation'              : this.state.designation,
      'department'               : this.state.department,
      "employmentFrom"           : this.state.employmentFrom,
      "employmentTo"             : employmentTo,
      "lastSalaryDrawn"          : this.state.lastSalaryDrawn,
      "typeOfEmployement"        : this.state.typeOfEmployement,
      'detailOfAgency'           : this.state.detailOfAgency,
      'reasonOfLeaving'          : this.state.reasonOfLeaving,
      'dutiesAndResponsibilites' : this.state.dutiesAndResponsibilites,
      'reportingManagerNm'       : this.state.reportingManagerNm,
      'prevDesignation'          : this.state.reportManagerDesgn,
      'contactDetails'           : this.state.reportManagerContact,
      "proofType"                : this.state.employmentProofType,
      "proofOfDocument"          : imgLink,
      "fileName"                 : fileName,
      "fileExt"                  : fileExt,
      "verifiedStatus"           : "Not Verified",
      "editStatus"               : "Open",
    }

    // console.log("employement = ",formValues);

    if(this.validInput()){
      Meteor.call('updateEmployement', id, formValues, index ,(error,result) =>{
        if(error){
          Alert.alert(
            'Error',
          );
        }else{
          Alert.alert(
            '','Employment details updated successfully!',
          );
          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             console.log(error.reason);
            }else{  
            }
          });
          if (editstatus == "Reopen") {
            Meteor.call('updateTicketAfterReopen',id,"employement",employementId,formValues); 
          }

          this.state.nameOfEmployer = '';
          this.state.employerAddress = '';
          this.state.employerCity = '';
          this.state.employerState = '';
          this.state.contactNo = '';
          this.state.employeeCode = '';
          this.state.designation = '';
          this.state.department = '';
          this.state.employmentFrom = '';
          this.state.showRadio = '';
          this.state.employmentTo = '';
          this.state.lastSalaryDrawn = '';
          this.state.typeOfEmployement = '';
          this.state.detailOfAgency = '';
          this.state.reasonOfLeaving = '';
          this.state.dutiesAndResponsibilites = '';
          this.state.reportingManagerNm = '';
          this.state.reportManagerDesgn = '';
          this.state.reportManagerContact = '';
          this.state.employmentProofType = '';

          this.props.navigation.goBack(null);      
        }
      });  
    }
    
    // if(imgId != ''){
    //   Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
    //     if (error) {
    //      console.log(error.reason);
    //     }else{  
    //     }
    //   });   
    // } 
  }

  uploadProofDocs(proofSubtype){
    console.log("proofSubtype = ",proofSubtype);
    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;
    var prooftype = "employement";

    DocumentPicker.show({ filetype : [DocumentPickerUtil.images()]},(error,res) => {
      if(res){
                          // Android
                          // console.log("Result:: ",res);
                          // var fileName = userId+'_'+Date.now()+'_'+res.fileName;
                          var fileName = userId+'_'+res.fileName;
                          var fileExt = fileName.split('.').pop();  

                          var file = {
                            uri   : res.uri,
                            name  : fileName,
                            type  : res.type,
                          }
                          
                          // console.log("file obj => ",file);
                          
                          const options = {
                            keyPrefix           : "uploads/",
                            bucket              : s3Data.bucket,
                            region              : s3Data.region,
                            accessKey           : s3Data.key,
                            secretKey           : s3Data.secret,
                          }

                          RNS3.put(file, options).then((response) => {
                            // console.log("------------response---------------");
                            // console.log('response: ',response);
                            if (response.status !== 201)
                              throw new Error("Failed to upload image to S3");
                            // console.log("=========  response.body  ==================");
                            // console.log(response.body);
                            // console.log("---------  response.body  ------------------");
                            
                            var fileLink = response.body.postResponse.location;
                            var fileDetails = {
                              name          : fileName,
                              ext           : fileExt,
                              link          : fileLink,
                            }
                            // console.log("fileDetails = ",fileDetails);

                            Meteor.call("insertEmpTempProofDocs",userId,fileDetails,prooftype,proofSubtype,(error,result) =>{
                              if(error){
                                console.log(error.reason);
                                Alert.alert(
                                  'Error',
                                )
                              }else{
                                console.log("File details saved.");
                              }
                            });
                            /**
                             * {
                             *   postResponse: {
                             *     bucket: "your-bucket",
                             *     etag : "9f620878e06d28774406017480a59fd4",
                             *     key: "uploads/image.png",
                             *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
                             *   }
                             * }
                             */
                          }).catch((error) => console.log("Handled Exceptions image ",error));
        }
                        });      
  }

  removeProofDocs(imageLink,subtype,fileName='',fileExt='',index=''){
    console.log("imageLink = ",imageLink);
    console.log("subtype = ",subtype);
    console.log("fileName = ",fileName);
    console.log("fileExt = ",fileExt);
    console.log("index = ",index);

    console.log("empProofObj = ",this.props.empProofObj);
    console.log("editEmpProofObj = ",this.props.editEmpProofObj);
    console.log("editEmpProofObj length = ",Object.keys(this.props.editEmpProofObj).length);

    if(Object.keys(this.props.empProofObj).length > 0){
      console.log("inside if 1");
      Meteor.call("removeTempProofDocs",imageLink,(error,result) =>{
        if(error){
          console.log(error.reason);
          Alert.alert(
            'Error',
          )
        }else{
          console.log("File details removed.");
        }
      });  
    } else if(Object.keys(this.props.editEmpProofObj).length > 0){
      console.log("inside if 2");
      Meteor.call("removeTempProofDocs",imageLink,(error,result) =>{
        if(error){
          console.log(error.reason);
          Alert.alert(
            'Error',
          )
        }else{
          console.log("File details removed.");
        }
      });
    }
    else{
      console.log("inside else");

      Meteor.call("removeTempDocProofs",imageLink,fileName,fileExt,index,subtype,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{
          console.log("File details removed.");
          this.props.empDetails.proofOfDocument='';
          this.props.empDetails.fileName='';
          this.props.empDetails.fileExt='';
        }
      });

    }  
  }

  residingToChange = (value) =>{
    console.log("value = ",value);
    if(value == 'toggleToDate'){
      this.setState({
        showRadio     : !this.state.showRadio,
        employmentTo  : ''
      });
    }
  }

  validInput = () => {
    var valid = true;

    this.validate({
      nameOfEmployer: {required: true},
      employerCity: {required: true},
      employerState: {required: true},
      designation: {letters: true},
      department: {letters: true},
      employmentFrom: {required: true},
      lastSalaryDrawn: {numbers: true},
      contactNo: {contactNo: true},
      reportingManagerNm: {letters: true},
      reportManagerDesgn: {letters: true},
      reportManagerContact: {contactDetails: true},
    });

    if(this.isFieldInError("nameOfEmployer")){
      let nameOfEmployerError = this.getErrorsInField('nameOfEmployer');
      this.setState({nameOfEmployerError});
      valid = false;
    }else{
      this.setState({nameOfEmployerError:''});
    }

    if(this.isFieldInError("employerCity")){
      let employerCityError = this.getErrorsInField('employerCity');
      this.setState({employerCityError});
      valid = false;
    }else{
      this.setState({employerCityError:''});
    }

    if(this.isFieldInError("employerState")){
      let employerStateError = this.getErrorsInField('employerState');
      this.setState({employerStateError});
      valid = false;
    }else{
      this.setState({employerStateError:''});
    }

    if(this.isFieldInError("designation")){
      let designationError = this.getErrorsInField('designation');
      this.setState({designationError});
      valid = false;
    }else{
      this.setState({designationError:''});
    }

    if(this.isFieldInError("department")){
      let departmentError = this.getErrorsInField('department');
      this.setState({departmentError});
      valid = false;
    }else{
      this.setState({departmentError:''});
    }

    if(this.isFieldInError("employmentFrom")){
      let employmentFromError = this.getErrorsInField('employmentFrom');
      this.setState({employmentFromError});
      valid = false;
    }else{
      this.setState({employmentFromError:''});
    }

    if(this.isFieldInError("lastSalaryDrawn")){
      let lastSalaryDrawnError = this.getErrorsInField('lastSalaryDrawn');
      this.setState({lastSalaryDrawnError});
      valid = false;
    }else{
      this.setState({lastSalaryDrawnError:''});
    }

    if(this.isFieldInError("contactNo")){
      let contactNoError = this.getErrorsInField('contactNo');
      this.setState({contactNoError});
      valid = false;
    }else{
      this.setState({contactNoError:''});
    }

    if(this.isFieldInError("reportingManagerNm")){
      let reportingManagerNmError = this.getErrorsInField('reportingManagerNm');
      this.setState({reportingManagerNmError});
      valid = false;
    }else{
      this.setState({reportingManagerNmError:''});
    }

    if(this.isFieldInError("reportManagerDesgn")){
      let reportManagerDesgnError = this.getErrorsInField('reportManagerDesgn');
      this.setState({reportManagerDesgnError});
      valid = false;
    }else{
      this.setState({reportManagerDesgnError:''});
    }

    if(this.isFieldInError("reportManagerContact")){
      let reportManagerContactError = this.getErrorsInField('reportManagerContact');
      this.setState({reportManagerContactError});
      valid = false;
    }else{
      this.setState({reportManagerContactError:''});
    }

    return valid;

  }
  render(){

    // console.log("inside render ................... ");
    // console.log("render empDetails = ",this.props.empDetails);
    // console.log("render proofOfDocument = ",this.props.empDetails.proofOfDocument);

    const {navigate,goBack}   = this.props.navigation;
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

    let selectData = [{
      value: 'Offer Letter',
    }, {
      value: 'Experience Letter',
    }, {
      value: 'Appointement Letter',
    }];

    let employementType = [{
      value: 'Permanent',
    }, {
      value: 'Temporary',
    }, {
      value: 'Contractual',
    }];

    return(

      <Drawer
        ref={(ref) => this._drawer = ref}
        content={navigationView}
        // openDrawerOffset={(viewport) => viewport.width - 300}
        side="right"
        >
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
         
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

            <HeaderDy headerTitle="Profile" goBack={goBack}/>

      <ScrollView style={{"flex":1}} keyboardShouldPersistTaps="always">
      <ProfileNavigation prevCount={4} nextCount={2} formName={"Employment"} iconName={"briefcase"} 
      prevLink={"AcademicForm"} nextLink={"CertificateForm"} navigate={this.props.navigation.navigate} />

        <View style={styles.titleContainer}>
          <Text style={styles.heading}>EMPLOYMENT INFORMATION</Text>
          <View style={styles.headingLine}>
          </View>          
        </View>
        
        <View style={styles.formContainer}>

          {/*<Text style={styles.heading}>EMPLOYMENT INFORMATION</Text>
          <View style={styles.headingLine}>
          </View>*/}
        
          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Company Name *'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}

                value                 = {this.state.nameOfEmployer}
                onChangeText          = {(nameOfEmployer) => this.setState({nameOfEmployer})}
                error                 = {this.state.nameOfEmployerError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Company Address'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.employerAddress}
                onChangeText          = {(employerAddress) => this.setState({employerAddress})}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "City *"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.employerCity}
                onChangeText          = {(employerCity) => this.setState({employerCity})}
                error                 = {this.state.employerCityError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "State *"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize} 
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.employerState}
                onChangeText          = {(employerState) => this.setState({employerState})}
                error                 = {this.state.employerStateError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Company Contact No"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.contactNo}
                onChangeText          = {(contactNo) => this.setState({contactNo})}
                error                 = {this.state.contactNoError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "Employee Code / ID"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize} 
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.employeeCode}
                onChangeText          = {(employeeCode) => this.setState({employeeCode})}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Designation"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.designation}
                onChangeText          = {(designation) => this.setState({designation})}
                error                 = {this.state.designationError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "Department"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.department}
                onChangeText          = {(department) => this.setState({department})}
                error                 = {this.state.departmentError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={{fontWeight:'bold'}}>Employment Period</Text>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <Text style={this.state.employmentFromError?{color:'rgb(213, 0, 0)'}:{}}>From *</Text>
              <DatePicker
                style                 = {{borderWidth:1,borderColor: 'gray',width:'100%'}}
                date                  = {this.state.employmentFrom}
                mode                  = "date"
                placeholder           = "From"

                format                = "L"
                minDate               = "01-01-1960"

                confirmBtnText        = "Confirm"
                cancelBtnText         = "Cancel"
                customStyles          = {{
                                         dateInput: {
                                          borderWidth: 0
                                         }
                                        }}

                onDateChange          = {(date) => {this.setState({employmentFrom: date})}}

              />
              {this.state.employmentFromError?
                <View style={{paddingTop:5}}>
                  <Text style={styles.errorText}>{this.state.employmentFromError[0]}</Text>
                </View>
              :
                null
              }
            </View>


              {this.state.showRadio 
              ?
                <View style={styles.formInputView}>
                <Text>To</Text>
                <RadioGroup
                  size={20}
                  color='#00b8FF'
                  thickness={2}
                  selectedIndex={0}
                  style={{flex:0.7,flexDirection:'column',justifyContent:"space-around",backgroundColor:'#fff'}}
                  onSelect = {(index, value) => this.residingToChange(value)}
                >
                  <RadioButton style={{paddingVertical:5, paddingHorizontal:0, padding:0}} value={'present'} >
                    <Text>Still working here</Text>
                  </RadioButton>
           
                  <RadioButton style={{paddingHorizontal:0, padding:0}} value={'toggleToDate'}>
                    <Text>Select to date</Text>
                  </RadioButton>
    
                </RadioGroup>
                </View>

              :
                <View style={styles.formInputView}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text>To</Text>
                  <Icon 
                    name           = "angle-double-right" 
                    type           = "font-awesome"
                    containerStyle = {{alignSelf:'flex-end'}}
                    color          = "#000"
                    size           = {22}
                    onPress        = {()=>this.residingToChange('toggleToDate')}
                    underlayColor  = {'transparent'}
                  />                  
                </View>
                <DatePicker
                  style                 = {{borderWidth:1,borderColor: 'gray',width:'100%'}}
                  date                  = {this.state.employmentTo}
                  mode                  = "date"
                  placeholder           = "From"
                  format                = "L"
                  minDate               = "01-01-1960"
                  confirmBtnText        = "Confirm"
                  cancelBtnText         = "Cancel"
                  customStyles          = {{
                                           dateInput: {
                                            borderWidth: 0
                                           }
                                          }}

                  onDateChange          = {(date) => {this.setState({employmentTo: date})}}
                />
                </View>
              }
              
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Last Salary Drawn"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'

                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.lastSalaryDrawn}
                onChangeText          = {(lastSalaryDrawn) => this.setState({lastSalaryDrawn})}
                error                 = {this.state.lastSalaryDrawnError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <Text>Type of Employment</Text>
              <Dropdown
                label                 = ''
                data                  = {employementType}
                inputContainerStyle   = {styles.dropdownInput}
                // inputContainerPadding = {0}
                labelHeight           = {9}
                onChangeText          = {(typeOfEmployement) => this.setState({typeOfEmployement})}
                value                 = {this.state.typeOfEmployement}
              /> 
            </View>

          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Details of Agency[If deployed from another Agency]'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.detailOfAgency}
                onChangeText          = {(detailOfAgency) => this.setState({detailOfAgency})}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Reason Of Leaving'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.reasonOfLeaving}
                onChangeText          = {(reasonOfLeaving) => this.setState({reasonOfLeaving})}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Duties & Responsibilities'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.dutiesAndResponsibilites}
                onChangeText          = {(dutiesAndResponsibilites) => this.setState({dutiesAndResponsibilites})}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Reporting Manager Name'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.reportingManagerNm}
                onChangeText          = {(reportingManagerNm) => this.setState({reportingManagerNm})}
                error                 = {this.state.reportingManagerNmError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Reporting Manager Designation'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.reportManagerDesgn}
                onChangeText          = {(reportManagerDesgn) => this.setState({reportManagerDesgn})}
                error                 = {this.state.reportManagerDesgnError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Reporting Manager Contact No'
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                value                 = {this.state.reportManagerContact}
                onChangeText          = {(reportManagerContact) => this.setState({reportManagerContact})}
                error                 = {this.state.reportManagerContactError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <Text>Employment Proof Type</Text>
              <Dropdown
                label                 = ''
                data                  = {selectData}
                inputContainerStyle   = {styles.dropdownInput}
                // inputContainerPadding = {0}
                labelHeight           = {9}
                onChangeText          = {(employmentProofType) => this.setState({employmentProofType})}
                value                 = {this.state.employmentProofType}
              />      
            </View>

            <View style={styles.formInputView}>
              <Text>Proof of Employment</Text>

              {!this.props.empProofObj.imageLink && !this.props.empDetails 
              ?
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonBrowse}
                  onPress     = {()=>this.uploadProofDocs("employementDetails")}
                />
              :
                this.props.empDetails 
                ?
                  this.props.empDetails.proofOfDocument 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.empDetails.proofOfDocument}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        // onPress        = {()=>this.removeProofDocs(this.props.empDetails.proofOfDocument)}
                        onPress        = {()=>this.removeProofDocs(this.props.empDetails.proofOfDocument,"editEmployementDetails",this.props.empDetails.fileName,this.props.empDetails.fileExt,this.props.index)}
                      />   
                    </View>
                  :
                    this.props.editEmpProofObj.imageLink 
                    ?
                      <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                        <Image
                            resizeMode="stretch"
                            source={{uri: this.props.editEmpProofObj.imageLink}} 
                            style={{ width:'100%', height: 120, zIndex:-1 }}
                        />
                        <Icon 
                          name           = "close" 
                          type           = "font-awesome"
                          containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                          // onPress        = {()=>this.removeProofDocs(this.props.editEmpProofObj._id)}
                          onPress        = {()=>this.removeProofDocs(this.props.editEmpProofObj._id,"editEmployementDetails")}
                        />   
                      </View>
                    :
                      <Button
                        textStyle   = {{textAlign:'center'}}
                        title       = "Browse"
                        buttonStyle = {styles.buttonBrowse}
                        onPress     = {()=>this.uploadProofDocs("editEmployementDetails")}
                      />
                :
                  this.props.empProofObj.imageLink 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.empProofObj.imageLink}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.empProofObj._id,"employementDetails")}
                      />   
                    </View>
                  :
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonBrowse}
                      onPress     = {()=>this.uploadProofDocs("employementDetails")}
                    />
              }
              
            </View>
          </View>

          <View style={{width:'100%',alignItems:'center'}}>
            <View style={styles.formInputView}>
              <Button
                textStyle   = {{textAlign:'center'}}
                title       = "Save"
                buttonStyle = {styles.buttonSubmit}
                onPress     = {this.props.empDetails ? this.handleEdit : this.handleProceed}
              />
            </View>
          </View>

          <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('ViewProfile')}>
                <Icon name="chevrons-left" type="feather" color="#aaa" />
                <Text style={{textDecorationLine:'underline'}}>Go to Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={{flex:0.5,alignItems:'flex-end'}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('CertificateForm')}>
                <Text style={{textDecorationLine:'underline'}}>Go Next</Text>
                <Icon name="chevrons-right" type="feather" color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>
          
        </View>

      </ScrollView>
    
      </SideMenu>
       </Drawer>
    );
  }
}

export default createContainer((props) => {

  var userId            = Meteor.userId();
  const postHandle      = Meteor.subscribe('userprofile',userId);
  const loading         = postHandle.ready();
  const userProfileData = Meteor.collection('userProfile').findOne({'userId':userId}) || {};
  // console.log("userprofile = ",userProfileData);

  const postHandle1     = Meteor.subscribe('projectSettingsPublish');
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  const postHandle2      = Meteor.subscribe('TempProofDocs',userId);
  const imgLoading       = postHandle2.ready();
  const empProofObj      = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"employement","proofSubtype": 'employementDetails'})|| {};
  const editEmpProofObj  = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"employement","proofSubtype": 'editEmployementDetails'})|| {};

  // console.log("container empProofObj = ",empProofObj);
  // console.log("container editEmpProofObj = ",editEmpProofObj);

  const { state } = props.navigation;
  // console.log("state---------- ",state);
  if(state.params){
    if(state.params.employmentDetails){
      var empDetails = state.params.employmentDetails;
      var index = state.params.index;       
    }
    if(state.params.goBack){
      var goBack = state.params.goBack;
    }
  }

  // console.log("inside createContainer.........");
  // console.log("empDetails = ",empDetails);
  // console.log("index = ",index);

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;

  return{
    userProfileData,
    loading,
    s3Data,
    empProofObj,
    editEmpProofObj,
    empDetails,
    index,
    goBack,
    notificationCount  
  }

}, EmploymentInfo);

EmploymentInfo.defaultProps = {
  messages: {
    en: {
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      numbers: 'Please enter numbers only.',
      contactNo: 'Enter a valid contact number'
    }
  },

  rules: {
    required: /\S+/,
    letters: /^[a-zA-Z ]+$|^$/,
    numbers: /^[0-9]*$|^$/,
    contactNo: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
    contactDetails: /^\+?\d+$|$/,
  },
}