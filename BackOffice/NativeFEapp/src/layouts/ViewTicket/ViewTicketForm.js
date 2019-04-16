import React, { Component } from "react";
import Meteor,{ createContainer } from "react-native-meteor";

import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, BackHandler, Image, Alert, BackAndroid, findNodeHandle, DrawerLayoutAndroid, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Header, Card, Button, Avatar, Icon, SearchBar, CheckBox } from "react-native-elements";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { TextField } from 'react-native-material-textfield';
import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';
import { robotoWeights } from 'react-native-typography';
import { Dropdown } from 'react-native-material-dropdown';
import ValidationComponent from 'react-native-form-validator';
import Moment from 'moment';
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';


import Loading from '../../components/Loading/Loading.js';

// import CheckBox from 'react-native-check-box';

import PropTypes from "prop-types";
import RadioButton from "radio-button-react-native";
import ToggleSwitch from 'toggle-switch-react-native';
import Modal from "react-native-modal";
import SideMenu from "react-native-side-menu";
import RNExitApp from "react-native-exit-app";
import FlipToggle from 'react-native-flip-toggle-button';
import Video from "react-native-video";
import RenderVideo from './RenderVideo.js';

import styles from "./styles.js";
import Menu from "../../components/Menu/Menu.js";
import HeaderDy from "../../components/HeaderDy/HeaderDy.js";
import ViewCustomerTable from "../../components/tableComponent/ViewCustomerTable.js";
import ViewCustomerModal from "../../components/modalComponent/ViewCustomerModal.js";

import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';



class ViewTicketFormInfo extends ValidationComponent {
  constructor(props) {
    super(props);
    let name = "";
    if (this.props.userName) name = "Welcome " + this.props.userName;
    this.state = {
      name              : name,
      isOpen            : false,
      selectedItem      : "About",
      customerIdModal   : '',
      isModalVisible    : false,
      isModalVisibleOne : false,
      inputFocusColor   : '#54Aff3',
      Remark            : '',
      value             : 0,
      "fontSize"        : 14,
      "userUpload"      : {},
      "status"          : '',
      "remark"          : '',
      "images"          : [],
      "videos"          : [],
      "imgData"         : [],
      
    };
    this.openDrawer  = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle      = this.toggle.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    if(this.props.tickets.submitedDoc){
      // console.log("inside submitedDoc.........");
      // console.log("submitedDoc ==== ",nextProps.tickets.submitedDoc);
      // console.log("checkObjs ==== ",nextProps.checkObjs);
      // console.log("imgData ==== ",nextProps.imgData);    
      this.setState({
          remark        : nextProps.tickets.submitedDoc.documents.remark,
          status        : nextProps.tickets.submitedDoc.documents.status,
          checkObjs     : nextProps.checkObjs,
          imgData       : nextProps.imgData,
      });

     // if( this.props.tickets.submitedDoc.documents.checkLists && this.props.tickets.submitedDoc.documents.checkLists.length>0){
     //    var chkListLen = this.props.tickets.submitedDoc.documents.checkLists.length;
     //    // console.log('chkListLen: ',chkListLen);
     //    for(var chkCount = 0 ; chkCount < chkListLen ; chkCount++){
     //      chkStatus = this.props.tickets.submitedDoc.documents.checkLists[chkCount].status;
          
     //      var result = ( chkStatus === 'true' || chkStatus === true ) ;
     //      this.setState({
     //                      [chkCount]  : result,
     //                  });
     //    }
     // }// EOF checkbox dynamic fields

      if(nextProps.tickets.submitedDoc && nextProps.checkObjs && nextProps.checkObjs.length>0){
        var checkObjs = nextProps.checkObjs;
        var chkListLen = nextProps.checkObjs.length;
        for(var i=0; i<chkListLen; i++){
          var id = checkObjs[i].id;
          var incorrect = (checkObjs[i].correctVal=="Incorrect") ? true : false;

          // console.log("id--------",id);
          this.setState({
            [id+'-Remark'] : (incorrect) ? checkObjs[i].remarkVal : '',
            [id+'-Toggle'] : (incorrect) ? false : true,
          });
        }
      }

      if( nextProps.tickets && nextProps.tickets.submitedDoc && nextProps.tickets.submitedDoc.documents && nextProps.tickets.submitedDoc.documents.textLists && nextProps.tickets.submitedDoc.documents.textLists.length>0){
        var txtListLen = nextProps.tickets.submitedDoc.documents.textLists.length;
        // console.log('txtListLen: ',txtListLen);
        for(var txtCount = 0 ; txtCount < txtListLen ; txtCount++){
          // console.log("txtCount-txt = ",txtCount+'-txt');
          // console.log("value = ",nextProps.tickets.submitedDoc.documents.textLists[txtCount].value);
          this.setState
          ({
            [txtCount+'-txt']  : nextProps.tickets.submitedDoc.documents.textLists[txtCount].value,
          });
        }
      }// EOF checkbox dynamic fields

      // if(nextProps.FETempData && nextProps.checkObjs.length > 0){
      //   for(var k=0;k<nextProps.checkObjs.length;k++){
      //     var getToggleVal = nextProps.checkObjs[k].correctValTemp == 'Correct' ? true : false;
      //     var getRemarkVal = nextProps.checkObjs[k].remarkValTemp;
      //     this.setState({
      //         [nextProps.checkObjs[k].id+'-Toggle']    : getToggleVal,
      //         [nextProps.checkObjs[k].id+'-Remark']    : getRemarkVal,
      //     },()=>{
      //             console.log('this.state: ',this.state);
      //           });          
      //   } // EOF k loop
      // } // temp data


    }else{

      this.setState({
          checkObjs  : nextProps.checkObjs, 
          imgData    : nextProps.imgData,
      });

      if(nextProps.FETempData && nextProps.checkObjs.length > 0){
        for(var k=0;k<nextProps.checkObjs.length;k++){
          var getToggleVal = nextProps.checkObjs[k].correctValTemp == 'Correct' ? true : false;
          var getRemarkVal = nextProps.checkObjs[k].remarkValTemp? nextProps.checkObjs[k].remarkValTemp : '';
          this.setState({
              [nextProps.checkObjs[k].id+'-Toggle']    : getToggleVal,
              [nextProps.checkObjs[k].id+'-Remark']    : getRemarkVal,
              [nextProps.checkObjs[k].id+'-Remark-error']    : '',

          },()=>{
                  // console.log('this.state: ',this.state);
                });          
        } // EOF k loop
      } // temp data

      if(nextProps.FETempData){
        this.setState({
            remark    : nextProps.FETempData.remark, 
            status    : nextProps.FETempData.status,
        });        
      }

      if(nextProps.textObjs){
        nextProps.textObjs.map((elem,pos,arr)=>{
          this.setState({
            [elem.id]: '',
            [elem.id+'-error']: '',
          });
        });
      }


    }

  }

  componentDidMount() {
    // console.log('componentDidMount ViewTicketFormInfo');
    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }
  componentWillUnmount() {
    // console.log('componentDidMount componentWillUnmount');
    // BackHandler.removeEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }
  androidBackHandler() {
    // console.log(this.props.navigation.state.routeName);
    // if (this.props.navigation.state.routeName != "ServiceList") {
    //   this.props.navigation.goBack(null);
    //   return true;
    // }
    // return false;
  }
  toggle() {
    // console.log("is open " + this.state.isOpen);
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
      isOpen       : false,
      selectedItem : item
    });

  handleLogout() {
    // console.log("Logout function!");
    Meteor.logout();
  }
  openDrawer() {
    // console.log("opening drawer!");
    this.drawer.openDrawer();
  }
  closeDrawer() {
    // console.log("opening drawer!");
    this.drawer.closeDrawer();
  }

  handleOnPress(value) {
    this.setState({ value });
  }

  getRole(role) {
      return role != "backofficestaff";
  }

  validInput = () =>{
    var valid = true;
    var validateObj = {};
    var validateStates = [];

    var checkObjs = this.state.checkObjs;
    var textObjs = this.props.textObjs;

    // console.log("checkObjs = ",checkObjs);
    // console.log("textObjs = ",textObjs);

    checkObjs.map((elem,pos,arr)=>{
      var toggleValue = this.state[elem.id+"-Toggle"];
      var remarkState = elem.id+"-Remark";
      // var remarkState = this.state[elem.id+"-Remark"];
      // console.log("checkObjs pos = ",pos);
      // console.log("checkObjs.id = ",elem.id);
      // console.log("checkObjs toggle state = ",toggleValue);
      // console.log("checkObjs remark state = ",remarkState);
      if((toggleValue=="Incorrect") || (toggleValue==false)){
        validateObj[remarkState] = {required: true};
        validateStates.push(remarkState);
      }else{
        // console.log("set error empty of ",remarkState);
        this.setState({[remarkState+'-error']:''});
      }
    });
    textObjs.map((elem,pos,arr)=>{
      var textState = elem.id;
      // var textState = this.state[elem.id];
      // console.log("textObjs pos = ",pos);
      // console.log("textObjs.id = ",elem.id);
      // console.log("textObjs state = ",textState);
      validateObj[textState]= {required: true};
      validateStates.push(textState);
    });

    // console.log("validateObj ====> ",validateObj);
    // console.log("validateStates ====> ",validateStates);
    this.validate(validateObj);

    validateStates.map((elem,pos,arr)=>{
      // console.log("validate state ------- ",elem);
      if(this.isFieldInError(elem)){
        var error = this.getErrorsInField(elem);
        this.setState({
          [elem+'-error'] : error,
        });
        valid = false;
      }else{
        this.setState({
          [elem+'-error'] : '',
        }); 
      }
    });

    return valid;
  }

  submit(event) {
    event.preventDefault();
    Keyboard.dismiss();

    if(this.validInput()){

    var checkLists = [];
    var images     = [];


    //Get Values for all the text field
    var textLists = [];

    var status       = this.state.status;
    // console.log("status ========== ",status);
    var actualStatus = '';
    if(status){
       actualStatus = status.split('-');
    }
  
    // var subStatus   = this.state.subStatus;
    for(var i=0; i<this.props.imgData.length;i++){
      images.push({
                    'userId'    : Meteor.userId(),
                    'imageLink' : this.props.imgData[i].imgs,
                    'createdAt' : new Date(),                  
                });
    }// EOF i loop


    var videos      = this.state.videos;


    if(this.props.tickets && this.props.tickets.submitedDoc && this.props.tickets.submitedDoc.documents){

      //Get values for all the check box
      var chkListCount = this.state.checkObjs;
      for(var i=0; i<chkListCount.length;i++){
        var chkListElement = this.state.checkObjs[i];

        if(this.state[chkListElement.id+'-Toggle']){
          var toggleVal = this.state[chkListElement.id+'-Toggle'];
        }else{
          var toggleVal = this.props.tickets.submitedDoc.documents.checkLists[i].correctVal;
        }

        if(this.state[chkListElement.id+'-Remark']){
          var remkVal = this.state[chkListElement.id+'-Remark'];
        }else{
          var remkVal = this.props.tickets.submitedDoc.documents.checkLists[i].remarkVal;
        }

        if(toggleVal == "Correct"){
          var remkVal = '';
        }

        chkListElement.correctVal = toggleVal;
        chkListElement.remarkVal  = remkVal;
        checkLists[i]             = chkListElement;

      } // EOF i loop

      for(var j=0; j<this.props.tickets.submitedDoc.documents.textLists.length;j++){
        var dataChk    = {};
        dataChk.task   = this.props.textObjs[j].task;
        if(this.refs[this.props.textObjs[j].id].value()){
          dataChk.value  = this.refs[this.props.textObjs[j].id].value();
        }else{
          dataChk.value  = '';
        }
        textLists.push(dataChk);
      } // EOF j loop 

      // console.log("actualStatus =========== ",actualStatus);
      if(actualStatus && actualStatus[0] == 'Completed'){    
        var roleStatus  = "ProofResubmitted";
        var msg         = "Resubmitted Verification Information";
      }else{
        var roleStatus  = "ProofResubmitted-Pending";
        var msg         = "Resubmitted Verification Information";
      }

    }else{

      //Get values for all the check box
      for(var i=0; i<this.props.checkObjs.length;i++){
        // console.log('this.state[this.props.checkObjs[i].id+"-Toggle"]: ',this.state[this.props.checkObjs[i].id+"-Toggle"]);
        if(this.state[this.props.checkObjs[i].id+"-Toggle"] == 'Correct'){
          var chkBoxToggleVal = this.state[this.props.checkObjs[i].id+"-Toggle"];
          var chkBoxRemarkVal = '';
        }else{
          var chkBoxToggleVal = 'Incorrect';
          var chkBoxRemarkVal = this.state[this.props.checkObjs[i].id+"-Remark"];
        }

        // if(this.state[this.props.checkObjs[i].id+"-Remark"]){
        //   var chkBoxRemarkVal = this.state[this.props.checkObjs[i].id+"-Remark"];
        // }else{
        //   var chkBoxRemarkVal = '';
        // }

        var dataChk = {
                    "titleVal"   : this.props.checkObjs[i].task,
                    "textVal"    : this.props.checkObjs[i].relatedFields,
                    "correctVal" : chkBoxToggleVal,
                    "remarkVal"  : chkBoxRemarkVal,
                };

        checkLists.push(dataChk);

      } // EOF i loop

      // console.log('checkLists:::::: ',checkLists);
      for(var j=0; j<this.props.textObjs.length;j++){
        var dataChk    = {};
        dataChk.task   = this.props.textObjs[j].task;
        if(this.refs[this.props.textObjs[j].id].value()){
          dataChk.value  = this.refs[this.props.textObjs[j].id].value();
        }else{
          dataChk.value  = '';
        }
        textLists.push(dataChk);
      } // EOF j loop 

      if(actualStatus[0] == 'Completed'){    
        var roleStatus  = "ProofSubmit";
        var msg         = "Submitted Verification Information";
      }else{
        var roleStatus  = "ProofSubmit-Pending";
        var msg         = "Submitted Verification Information";
      }
    
    }//EOF else

    var remark      = this.state.remark;

    var documents = {

        checkLists : checkLists,
        textLists  : textLists,
        status     : status,
        // subStatus  : subStatus,
        images     : images,
        videos     : videos,
        remark     : remark,
    }
        
    // console.log('documents: ',documents);

    if (this.props.tickets) {
        if (this.props.tickets.ticketElement) {
            if (this.props.tickets.ticketElement.length > 0) {
                var ticketElements    = this.props.tickets.ticketElement;
                var teamMemberDetails = ticketElements.find((obj)=> { return obj.roleStatus == 'FEAllocated' });
                // console.log('teamMemberDetails ',teamMemberDetails);
            }
        }

        var role = this.props.userData.roles.find(this.getRole);
        if(role){

            var insertData = {
                "userId"              : Meteor.userId(),
                "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
                "allocatedToUserid"   : teamMemberDetails.userId,
                "allocatedToUserName" : teamMemberDetails.userName,
                "role"                : role,
                "roleStatus"          : roleStatus,
                "msg"                 : msg,
                "submitedDoc"         : documents,
                "createdAt"           : new Date(),
            }
            // console.log('insertData: ',insertData);
            // console.log("ticketid = ",this.props.tickets._id);

            this.props.navigation.navigate("ViewTicketNextForm",{ticket : this.props.tickets._id,insertData:insertData});    

              // Meteor.call('genericUpdateTicketMasterElement', this.props.tickets._id, insertData, (error,result)=>{
              //     if (error) {
              //       console.log(error.reason);
              //     }else{
              //       // console.log("Inserted Successfully!");
              //       this.props.navigation.navigate('ViewSubmittedTicket', { ticket: this.props.tickets._id });
              //     }
              // });

        }

    }

    }//if validInput

  }


  delImg(event, id){
    // console.log('click id: ' ,id);
    Meteor.call('delTempFEImage', id, (error, result)=>{
      if(error){
        Alert.alert(error.reason);
      }else{
        Alert.alert('Successfully deleted Image.');
      }
    });
  }

  displayAttachments(){
    var data = [];
    var verificationDocuments = this.state.imgData;
    if(verificationDocuments && verificationDocuments.length>0){
       verificationDocuments.map((item, index)=>{
        var fileName = item.imgs;
        // console.log('fileName:',fileName);
        data.push(
                  <View key={index} style={{ flex:0.3 }} removeClippedSubviews={true}>
                    <View key={'viewWrapper-'+index} style={{ flex:0.2, alignItems:'center', justifyContent:'center' }}>
                      <Image  
                      key        = {'imgRemote-'+index}
                      style      = {{ width:40, height:40, resizeMode: 'stretch' }}                    
                      resizeMode = "stretch"
                      source     = {{ uri : fileName }}              
                      />
                      <TouchableOpacity onPress={(e) =>this.delImg(e, item._id)}><Text>Remove</Text></TouchableOpacity>
                    </View>
                    
                  </View>
                  );
        })       
    }

    return data;    
  }

  displayAttachmentsTest(){
    var data = [];
    var imgs = [];
    var verificationDocuments = this.state.imgData;
    if(verificationDocuments && verificationDocuments.length>0){
       verificationDocuments.map((item, index)=>{
          var fileName = item.imgs;
          imgs.push(fileName);
          data.push(
                  <View key={index} style={{ flex:0.3 }} removeClippedSubviews={true}>
                    <View key={'viewWrapper-'+index} style={{ flex:0.2, alignItems:'center', justifyContent:'center' }}>
                      <CachedImage key={'cache-'+index} source={{uri: fileName}} style={{width: 40, height: 40}}/>
                      <TouchableOpacity onPress={(e) =>this.delImg(e, item._id)}><Text>Remove</Text></TouchableOpacity>
                    </View>
                  </View>
            
            );
        })  

       // console.log('imgs: ',imgs);
        return(

            <ImageCacheProvider
                urlsToPreload={imgs}
                onPreloadComplete={() => console.log('hey there')}>
                <View style={{ flex:1, flexDirection:'row'}}>
                {data}
                </View>
            </ImageCacheProvider>
          );   

    }   
        

    


    // return data;    
  }

  goToCamera =(event)=>{

    let checkLists     = [];
    var textLists      = [];
    if(this.props.tickets.submitedDoc && this.props.tickets.submitedDoc.documents){

      //Get values for all the check box
      var chkListCount = this.state.checkObjs;
      for(var i=0; i<chkListCount.length;i++){
        var chkListElement = this.state.checkObjs[i];

        if(this.state[chkListElement.id+'-Toggle']){
          var toggleVal = this.state[chkListElement.id+'-Toggle'];
        }else{
          var toggleVal = this.props.tickets.submitedDoc.documents.checkLists[i].correctVal;
        }

        if(this.state[chkListElement.id+'-Remark']){
          var remkVal = this.state[chkListElement.id+'-Remark'];
        }else{
          var remkVal = this.props.tickets.submitedDoc.documents.checkLists[i].remarkVal;
        }

        chkListElement.correctVal = toggleVal;
        chkListElement.remarkVal  = remkVal;
        checkLists[i]             = chkListElement;

      } // EOF i loop

      for(var j=0; j<this.props.tickets.submitedDoc.documents.textLists.length;j++){
        var dataChk    = {};
        dataChk.task   = this.props.textObjs[j].task;
        if(this.refs[this.props.textObjs[j].id].value()){
          dataChk.value  = this.refs[this.props.textObjs[j].id].value();
        }else{
          dataChk.value  = '';
        }
        textLists.push(dataChk);
      } // EOF j loop 
    }else{

      //Get values for all the check box
      for(var i=0; i<this.props.checkObjs.length;i++){

        if(this.state[this.props.checkObjs[i].id+"-Toggle"] == 'Correct'){
          var chkBoxToggleVal = this.state[this.props.checkObjs[i].id+"-Toggle"];
        }else{
          var chkBoxToggleVal = 'Incorrect';
        }

        if(this.state[this.props.checkObjs[i].id+"-Remark"]){
          var chkBoxRemarkVal = this.state[this.props.checkObjs[i].id+"-Remark"];
        }else{
          var chkBoxRemarkVal = '';
        }

        var dataChk = {
                    "checkListFrom" : 'Database',
                    "titleVal"   : this.props.checkObjs[i].task,
                    "correctVal" : chkBoxToggleVal,
                    "remarkVal"  : chkBoxRemarkVal,
                };

        checkLists.push(dataChk);

      } // EOF i loop

      for(var j=0; j<this.props.textObjs.length;j++){
        var dataChk    = {};
        dataChk.task   = this.props.textObjs[j].task;
        console.log("this.props.textObjs[j]===== ",this.props.textObjs[j]);
        console.log("this.props.textObjs[j].id === ",this.props.textObjs[j].id);
        if(this.refs[this.props.textObjs[j].id].value()){
          dataChk.value  = this.refs[this.props.textObjs[j].id].value();
          dataChk.checkListFrom = 'UserUpload';
        }else{
          dataChk.value  = '';
        }
        checkLists.push(dataChk);
      } // EOF j loop    
    }//EOF else

    // console.log('textLists: ',textLists);
    // console.log('checkLists: ',checkLists);
    var formValues = {
                        ticketId   : this.props.ticket,
                        textLists  : textLists,
                        checkLists : checkLists,
                        status     : this.state.status ? this.state.status : '',
                        remark     : this.state.remark ? this.state.remark : '',
                      }
    Meteor.call('saveFEDataTemp', formValues, (err, res)=>{

    });


    var ImagePicker = require('react-native-image-picker');
    var options = {
      quality       : 1,
      mediaType     : "photo",
      cameraType    : "back",
      allowsEditing : true,
      noData        : true,
      maxWidth      : 8000, 
      maxHeight     : 8000,
    };
    
    ImagePicker.showImagePicker((response) => {
      // response.data='';
      // console.log('response: ', response);
      console.log('response latitude: ', response.latitude);
      console.log('response longitude: ', response.longitude);
      if (response.didCancel) {
        console.log('response.didCancel: ', response.didCancel);
      }
      else if (response.error) {
        console.log('response.error: ', response.error);
      }
      else if (response.customButton) {
        console.log('response.customButton: ', response.customButton);
      }
      else {
        let source = response.uri;
        this.props.navigation.navigate('MapDisplay',{ ticket : this.props.ticket, latitude : response.latitude, longitude : response.longitude, imgLink : 'file://'+response.path });
        // console.log('source1: ', response.uri);
        // let source = response.path;
        // console.log('source: ', source);
        // this.setState({
        //   avatarSource: source,
        //   updatedProfilePic: source,
        //   responseS3: response,
        // });
      }
    });
    // this.props.navigation.navigate('Camera',{ ticket : this.props.ticket });
  }

    // goToCamera =(event)=>{

    //   var ImagePicker = require('react-native-image-picker');
    //   var options = {
    //     quality       : 1,
    //     mediaType     : "photo",
    //     cameraType    : "back",
    //     allowsEditing : true,
    //     noData        : true,
    //     maxWidth      : 8000, 
    //     maxHeight     : 8000,
    //   };

    //   // Open Image Library:
    //   ImagePicker.launchImageLibrary(options, (response)  => {

    //     console.log('response: ',response);
    //     // Same code as in above section!
    //   });      
    // }

    uploadVideo(event){
      var userId = Meteor.userId();
      var s3Data = this.props.s3Data;
      var timeStamp = new Date().getTime();
      DocumentPicker.show({ filetype : [DocumentPickerUtil.allFiles()]},(error,res) => {
                          // Android
                          // console.log("Result:: ",res);
                          // var fileName = userId+'_'+Date.now()+'_'+res.fileName;
                          
                          // var fileName = userId+'_'+timeStamp+'_'+res.fileName;
                          var fileExt = res.fileName.split('.').pop();  
                          var fileName = timeStamp+'.'+fileExt;
                          // var fileExt = fileName.split('.').pop();  

                          var file = {
                            uri   : res.uri,
                            name  : fileName,
                            type  : res.type,
                          }
                          
                          // console.log("file obj => ",file);
                          
                          const options = {
                            keyPrefix           : "FEVideoUpload/",
                            bucket              : s3Data.bucket,
                            region              : s3Data.region,
                            accessKey           : s3Data.key,
                            secretKey           : s3Data.secret,
                          }

                          // console.log("options obj => ",options);

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
                              videoLink     : fileLink,
                              'createdAt'   : new Date(), 
                              'userId'      : Meteor.userId(),
                            };
                            // console.log("fileDetails = ",fileDetails);
                            // this.state.videos.push(fileDetails);
                            if(this.state.videos.length > 0){
                              var newArr = this.state.videos;
                              newArr.push(fileDetails);
                              this.setState(state => ({
                                videos: newArr, 
                              }));
                            }else{
                              this.setState(state => ({
                                videos: [ fileDetails ] 
                              }));                              
                            }


                          }).catch((error) => console.log("Handled Exceptions image ",error));

                          });    
    }

  render() {
    
    // console.log('render video state');
    // console.log(this.state.videos);
    // console.log('---------------------');
    const { navigate, goBack, state } = this.props.navigation;

    let status = [{
      value: '-- Select --',
    }, {
      value: 'Initiated',
    }, {
      value: 'WIP',
    }, {
      value: 'Insufficiency',
    }, {
      value: 'Insufficiency Cleared',
    }, {
      value: 'Completed-Clear',
    },{
      value: 'Completed-Minor Discrepancy',
    },{
      value: 'Completed-Major Discrepancy',
    },{
      value: 'Completed-Inaccessible',
    },{
      value: 'Completed-Unable to Verify',
    },{
      value: 'Completed-Cancelled',
    },{
      value: 'Completed-Case Drop',
    }];


    const menu = <Menu navigate={navigate} userName={this.props.userName} />;
    var navigationView = <NotificationCommon closeDrawer={this.closeDrawer} notificationData={this.props.notificationData} navigation={this.props.navigation}/>

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={_drawer => (this.drawer = _drawer)}
        drawerPosition={DrawerLayoutAndroid.positions.Right}
        renderNavigationView={() => navigationView}
      >
        <SideMenu
          disableGestures={true}
          openMenuOffset={300}
          menu={menu}
          isOpen={this.state.isOpen}
          onChange={isOpen => this.updateMenuState(isOpen)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFF",
              borderWidth: 0,
              padding: 0
            }}
          >
            <ScrollView
              createContainerStyle={{
                marginBottom: 90,
                borderWidth: 0,
                margin: 0
              }}
              keyboardShouldPersistTaps="always"
            >


              {/* <Header
                centerComponent={{ text: "ASSUREID", style: { color: "#fff",fontWeight:'bold' } }}
                leftComponent={
                  <TouchableOpacity onPress={this.toggle}>
                    <Icon
                      size={25}
                      name="bars"
                      type="font-awesome"
                      color="#fff"
                    />
                  </TouchableOpacity>
                }
                outerContainerStyles={{
                  borderBottomWidth: 0,
                  backgroundColor: "#367fa9",
                  height: 60,
                  paddingTop: 0,
                  margin: 0
                }}
                innerContainerStyles={{ marginTop: 0, paddingTop: 0 }}
                rightComponent={
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "flex-end",
                      minHeight: 20,
                      minWidth: 20
                    }}
                  >
                    <TouchableOpacity onPress={this.openDrawer}>
                      <Icon
                        name="bell-outline"
                        type="material-community"
                        size={30}
                        color="#fff"
                        style={styles.bellIcon}
                      />
                      <Text style={styles.notificationText}>9</Text>
                    </TouchableOpacity>
                  </View>
                }
              /> */}
              <Header
                centerComponent={{ text: "ASSUREID", style: { color: '#fff',fontWeight:'bold' } }}
                leftComponent={
                  <TouchableOpacity  onPress={this.toggle} >
                    <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                  </TouchableOpacity>
                }
                outerContainerStyles={{borderBottomWidth:0, backgroundColor: '#367fa9',height:60,paddingTop:0,margin:0}}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                rightComponent={
                  <View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                    <TouchableOpacity onPress={this.openDrawer}>
                      <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                      <Text style={styles.notificationText}>{this.props.notificationData.length}</Text>
                    </TouchableOpacity>
                  </View>
                    }
              />

              <HeaderDy headerTitle={this.props.tickets.serviceName +" / "+ this.props.tickets.ticketNumber} goBack={goBack} />
                {this.state.checkObjs && this.props.textObjs && this.props.loading3 ?
                <View style={styles.formContainer}>
                  <View>
                    <Text style={[(robotoWeights.bold),{fontSize:15,color:'#33b5e5',alignSelf:'center'}]}>Submitted Information</Text>
                  </View>
               
                    <View style={styles.formInputView}>
                      <View>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333'}]}>Verified Information</Text>
                      </View>
                    </View>

                  
                  <View style={{width:'100%',padding:10}}>
                  { this.state.checkObjs ?
                    this.state.checkObjs.map((checkListDefault,index)=>{
                      return(
                              <View key={index} style={{flex:1, flexDirection: 'row', borderBottomColor: '#ddd',borderBottomWidth:0,paddingVertical:5}}>

                                <View style={{flex:1}}>
                                  <View style={{flex:1}}>
                                    <Text style={{fontWeight:'bold'}}>{index+1}. {checkListDefault.task}</Text>
                                  </View>

                                <View>
                                { checkListDefault.relatedFields && 
                                  checkListDefault.relatedFields.length > 0 ? 

                                  checkListDefault.relatedFields.map((data, ind)=>{
                                      return data.dbField != "residingFrom" ?

                                        <Text key={ind}>{data.value},&nbsp;</Text>   
                                      :       
                                        <Text key={ind}>{Moment(data.value).format("DD MMM YYYY")}</Text>
                                        
                                        
                                     
                                 })


                                  :
                                  <View><Text></Text></View>
                                }
                                </View>

                                </View>

                                <View style={{flex:1}}>
                                  <View style={{flex:1}}>
                                    <Text>Incorrect/Correct</Text>
                                    {console.log("state value .... ",this.state[checkListDefault.id+'-Toggle'])}
                                    <ToggleSwitch
                                        isOn={ this.state[checkListDefault.id+'-Toggle'] ? true : false }
                                        onColor='#33b5e5'
                                        offColor='#ddd'
                                        label=''
                                        labelStyle={{color: 'black', fontWeight: '900', flex:1}}
                                        size='small'
                                        onToggle={ (isOn) => {
                                                                console.log('changed to : ', isOn);
                                                                if(isOn === true){
                                                                  this.setState({ [checkListDefault.id+'-Toggle'] : 'Correct' }, () => {
                                                                    // console.log('this.state : ', this.state);
                                                                  });
                                                                }else{
                                                                  this.setState({ [checkListDefault.id+'-Toggle'] : 'Incorrect' }, () => {
                                                                    // console.log('this.state : ', this.state);
                                                                  });
                                                                }         
                                                              } 
                                                  }
                                    />
                                  </View>
                                  <TextField
                                    label                 = {'Remark'}
                                    lineWidth             = {0}
                                    tintColor             = {this.state.inputFocusColor}
                                    inputContainerPadding = {4}
                                    labelHeight           = {16}
                                    keyboardType          = 'default'
                                    inputContainerStyle   = {{height:60}}
                                    style                 = {styles.inputTextNew}
                                    labelTextStyle        = {styles.labelTextNew}
                                    activeLineWidth       = {0}
                                    fontSize              = {this.state.fontSize}
                                    labelFontSize         = {this.state.fontSize}
                                    ref                   = {checkListDefault.id+'-Remark'}
                                    value                 = {this.state[checkListDefault.id+'-Remark']}
                                    onChangeText          = {(value) => { 
                                                                          this.setState({ [checkListDefault.id+'-Remark'] : value }, () => {
                                                                            // console.log('this.state : ', this.state);
                                                                          });
                                                                        }
                                                            }
                                    error                 = {(this.state[checkListDefault.id+'-Remark-error'])?this.state[checkListDefault.id+'-Remark-error'][0]:''}

                                  />
                                </View>
                                <View></View>
                              </View>
                      );
                    })

                  :
                   <Loading />
                  }
                  </View>


                <View style={{width:'100%',padding:10}}>
                {this.props.textObjs && this.props.loading3 ?
                  <View>
                  { this.props.textObjs.map((textListDefault,index)=>{
                    return(
                            <View style={styles.inputWrapper} key={index}>
                              <View style={styles.formInputView1}>
                                <TextField
                                  label                 = {textListDefault.task}
                                  lineWidth             = {0}
                                  tintColor             = {this.state.inputFocusColor}
                                  inputContainerPadding = {4}
                                  labelHeight           = {16}
                                  keyboardType          = 'default'
                                  inputContainerStyle   = {{height:60}}
                                  style                 = {styles.inputTextNew}
                                  labelTextStyle        = {styles.labelTextNew}
                                  activeLineWidth       = {0}
                                  fontSize              = {this.state.fontSize}
                                  labelFontSize         = {this.state.fontSize}
                                  ref                   = {textListDefault.id}
                                  value                 = {this.state[textListDefault.id]}
                                  onChangeText          = {(value) => { 
                                                                        this.setState({ [textListDefault.id] : value });
                                                                      }
                                                          }
                                  error                 = {(this.state[textListDefault.id+'-error'])?this.state[textListDefault.id+'-error'][0]:''}
                                />
                              </View>
                            </View>
                          );
                        })
                      }
                      </View>
                        :
                          <Loading />
                }
                </View>

                  {/*<View style = {styles.lineStyle} >
                    <View style={styles.formInputView}>
                      <View>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333'}]}>Upload Photos</Text>
                      </View>
                    </View>
                    <View style={styles.referenceContainer}>
                      <View style = {styles.formInputView}> 
                        <View style={{flex:1}}>
                          <View style={{flexDirection:'row',bottom:50}}>
                             <View style={{flex:0.2}}>
                              <TouchableOpacity  onPress={this.goToCamera.bind(this)} >
                                <Icon name="camera-enhance" type="MaterialIcons" size={55} color="#aaa"   />
                              </TouchableOpacity>
                             </View>
                             {this.displayAttachmentsTest()}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>*/}

                  {/*<View style = {styles.lineStyle} >
                  <View style={styles.formInputView}>
                    <View>
                      <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333'}]}>Upload Videos</Text>
                    </View>
                  </View>
                  <View style={styles.referenceContainer}>
                    <View style = {styles.formInputView}> 
                      <View style={{flex:1}}>
                        <View style={{flexDirection:'row',bottom:50}}>
                          <View style={{flex:0.2}}>
                          <Icon name="videocam" type="MaterialIcons" size={65} color="#aaa" onPress = {this.uploadVideo.bind(this)} />
                          <View>
                            { this.state.videos.length > 0 ?
                              <View>
                              {this.state.videos.map((videoData,index)=>{
                                return(<RenderVideo key={index} videoData={videoData}/>);
                              }) }
                              </View>
                              :
                              <View><Text></Text></View>
                            }
                          </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  </View>*/}

                  {/*<View style = {styles.lineStyle} >
                    <View style={styles.formInputView}>
                      <View>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333'}]}>Remark</Text>
                      </View>
                    </View>
                    <View style={styles.formInputViews}>
                      <TextField
                        label                 = ''
                        lineWidth             = {0}
                        tintColor             = {this.state.inputFocusColor}
                        inputContainerPadding = {4}
                        labelHeight           = {16}
                        keyboardType          = 'default'
                        inputContainerStyle   = {{height:200}}
                        style                 = {styles.inputText}
                        labelTextStyle        = {styles.labelText}
                        activeLineWidth       = {0}
                        fontSize              = {this.state.fontSize}
                        labelFontSize         = {this.state.fontSize}
                        multiline             = {true}
                        numberOfLines         = {4}
                        ref                   = 'remark'
                        value                 = {this.state.remark}
                        onChangeText          = {(value) => { 
                                                              this.setState({ 'remark' : value });
                                                            }
                                                }
                      />
                    </View>
                  </View>*/}

                  {/*<View style = {styles.lineStyle} >
                    <View style={[styles.formInputViews]}>
                      <Dropdown
                        label                 = 'Status'
                        data                  = {status}
                        inputContainerStyle   = {styles.dropdownStyle}
                        inputContainerPadding = {0}
                        labelHeight           = {16}
                        ref                   = 'status'
                        value                 = {this.state.status}
                        onChangeText          = {(status) => this.setState({status})}
                      /> 
                    </View>
                  </View>*/}


              <View style={{ alignItems: "center",marginTop:40}}>
                <Button
                  buttonStyle={styles.buttonLarge}
                  title="CONTINUE"
                  onPress={this.submit.bind(this)}
                />
              </View>

              </View>
              :
                <Loading />
              }



            </ScrollView>
          </View>
        </SideMenu>
      </DrawerLayoutAndroid>
    );
  }
}


ViewTicketForm = createContainer( (props) => {

    // console.log('ticket: ',props.navigation.state.params.ticket);
    const ticket       = props.navigation.state.params.ticket;

    const postHandle6  = Meteor.subscribe('tempFEImgData' ,ticket, 'image');
    const loading6     = !postHandle6.ready();
    const imgData      = Meteor.collection('tempFEUploadData').find({ "ticketId"  : ticket, "type" : "image" })   || [];
    const FETempData   = Meteor.collection('tempFEUploadData').findOne({ "ticketId"  : ticket, "type" : "data" }) || {};
    // console.log('FETempData: ',FETempData);
    // const postHandle   = Meteor.subscribe('allTicketImages');
    // const postHandle1  = Meteor.subscribe('allTicketVideo');
    const postHandle2  = Meteor.subscribe('checklistFieldExpert');
    const postHandle3  = Meteor.subscribe('singleTicket',ticket);

    // const ticketImages = Meteor.collection("tempTicketImages").find({}) || []; 
    // const ticketVideo  = Meteor.collection("tempTicketVideo").find({}) || []; 
    const ticketImages = []; 
    const ticketVideo  = [];  
    // console.log("ticketImages",ticketImages);    
    // console.log("ticketVideo",ticketVideo);
    // const loading     = !postHandle.ready();
    // const loading1    = !postHandle1.ready();
    const loading3    = postHandle3.ready();
    let checkObjs     = [];
    var textObjs      = [];
    var checkListObjs = [];
    var checkListFrom = '';

    if (ticket) {
       var tickets =  Meteor.collection('ticketMaster').findOne({"_id" : ticket}) || {};
       
      if (tickets) {
          var verificationType = tickets.verificationType;
       // console.log("verificationType",verificationType);
         if (verificationType == "professionalEducation") {
               checkListFrom = "Academic Information";
         }else if (verificationType == "permanentAddress") {
               checkListFrom = "Address Information";
         }else if (verificationType == "currentAddress") {
               checkListFrom = "Address Information";
         }else if (verificationType == "employement") {
                checkListFrom = "Employment Information";
         }else if (verificationType == "education") {
                checkListFrom = "Academic Information";
         }else  if (verificationType == "certificates") {
                checkListFrom = "Skills And CertificationInformation";
         }
      

       if(tickets.submitedDoc && tickets.submitedDoc.documents){

          if(tickets.submitedDoc.documents.checkLists && tickets.submitedDoc.documents.checkLists.length > 0){
            checkObjs = tickets.submitedDoc.documents.checkLists;
            if (checkObjs.length > 0) {
                for (var i = 0; i < checkObjs.length; i++) {
                    checkObjs[i].id = i;
                    checkObjs[i].task = checkObjs[i].titleVal;
                    checkObjs[i].relatedFields = checkObjs[i].textVal;
                }
            }
          }

          if(tickets.submitedDoc.documents.textLists && tickets.submitedDoc.documents.textLists.length > 0){
            textObjs  = tickets.submitedDoc.documents.textLists;
            if (textObjs.length > 0) {
              for(var txt = 0 ; txt < textObjs.length ; txt++){
                textObjs[txt].task = textObjs[txt].task;
                textObjs[txt].id   = txt+'-txt';
              }
            }
          }

          if(imgData && tickets.submitedDoc.documents.images){
            imgData.concat(tickets.submitedDoc.documents.images);
          }
          

          // console.log('checkObjs: ',checkObjs);
          // console.log('textObjs: ',textObjs);
          // console.log('imgData: ',imgData);

          // console.log('checkObjs 0: ',checkObjs);
       }else{
          checkListObjs = Meteor.collection("checklistFieldExpert").find({"checkListFor" : checkListFrom}) || [];

          if (checkListObjs && checkListObjs.length > 0) {
            // console.log("checkListObjs ==> ",checkListObjs);
                  for (var i = 0; i < checkListObjs.length; i++) {
                      // console.log('before FETempData');
                      // if(FETempData && FETempData.checkLists && FETempData.checkLists.length > 0){
                      //   // console.log("inside if");
                      //   console.log("FETempData.checkLists = ",FETempData.checkLists);
                      //   console.log("FETempData.checkLists[i] = ",FETempData.checkLists[i]);
                      //   if (checkListObjs[i].checkListFrom == 'Database') {
                      //     checkListObjs[i].correctValTemp = FETempData.checkLists[i].correctVal;
                      //     checkListObjs[i].remarkValTemp  = FETempData.checkLists[i].remarkVal;
                      //   }else{
                      //     checkListObjs[i].value = FETempData.textLists[i].value;
                      //   }
                      // }
                      // console.log('after FETempData');

                      // if(FETempData && FETempData.checkLists && FETempData.checkLists.length > 0){
                      //   var data = FETempData.checkLists;
                      //   // var requiredData = data.find(function (obj) { return obj.checkListFrom == checkListObjs[i].checkListFrom &&  })
                      //   if(checkListObjs[i].checkListFrom == 'Database'){
                      //     var requiredData = data.find(function(obj){return obj.titleVal == checkListObjs[i].task});
                      //     if(requiredData){
                      //       checkListObjs[i].correctValTemp = requiredData.correctVal;
                      //       checkListObjs[i].remarkValTemp  = requiredData.remarkVal;  
                      //     }
                      //   }else{
                      //     var requiredData = data.find(function(obj){return obj.task == checkListObjs[i].task});
                      //     // console.log('requiredData ==',requiredData);
                      //     // console.log('requiredData value ==',requiredData.value);
                      //     if(requiredData){
                      //       checkListObjs[i].value = requiredData.value;
                      //     }
                      //     // checkListObjs[i].remarkValTemp  = requiredData.remarkVal;
                      //   }
                      //   var requiredData = data.find(
                      //       function(obj){
                      //         if (obj.checkListFrom == 'Database' ) {
                      //           checkListObjs[i].correctValTemp = FETempData.checkLists[i].correctVal;
                      //           checkListObjs[i].remarkValTemp  = FETempData.checkLists[i].remarkVal;
                      //         }else{

                      //         }  
                      //       }
                      //     );
                      // }

                      if(checkListObjs[i] && checkListObjs[i].relatedFields && checkListObjs[i].relatedFields.length > 0){
                        checkListObjs[i].id = checkListObjs[i]._id;
                        // console.log("inside if.........",checkListObjs[i].checkListFrom );
                        if(checkListObjs[i].checkListFrom == 'Database'){
                            if(checkListFrom == "Address Information"){
                                if(verificationType == "permanentAddress"){
                                    // console.log("inside 2nd if");
                                    for(var j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                                        // console.log(" i = ",i," j = ",j);
                                        // console.log("dbField = ",checkListObjs[i].relatedFields[j].dbField);
                                        checkListObjs[i].relatedFields[j].value = tickets.verificationData[checkListObjs[i].relatedFields[j].dbField];   
                                    }
                                }else{
                                    for(var j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                                        var tempVar = 'temp'+checkListObjs[i].relatedFields[j].dbField;
                                        checkListObjs[i].relatedFields[j].value = tickets.verificationData[tempVar];   
                                    }
                                }
                            }else{
                              
                                for(var j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                                    checkListObjs[i].relatedFields[j].value = checkListObjs[i].relatedFields[j].dbField + ':'+tickets.verificationData[checkListObjs[i].relatedFields[j].dbField];   
                                    

                                }
                            }
                            // console.log("checkListObjs[i] = ",checkListObjs[i]);
                            checkObjs.push(checkListObjs[i]); 
                        }else{
                          // console.log('text ',checkListObjs[i]);
                            // textObjs.push(checkListObjs[i]); 
                        }
                      }else{
                          // console.log('text ',checkListObjs[i]);
                            checkListObjs[i].id = checkListObjs[i]._id;
                            textObjs.push(checkListObjs[i]); 
                        }

                  }//EOF i loop

                  // console.log("checkObjs = ",checkObjs);
                  // console.log("textObjs = ",textObjs);
            
          }
          // console.log('checkObjs 1: ',checkObjs);
       }

      } // end of ticket object
        
    }
       
      
      // console.log("textObjs 1 ==> ",textObjs);
      console.log("checkObjs:",checkObjs);
      const postHandle4     = Meteor.subscribe('projectSettingsPublish');
      const s3Data          = Meteor.collection('projectSettings').findOne({"_id":  "1"}) || {};

      const postHandle5     = Meteor.subscribe('currentUserfunction');
      const userData        = Meteor.collection('users').findOne({ "_id": Meteor.userId() }) || {};
      const postHandle       = Meteor.subscribe('userNotification');
      const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"type":"notification",'status':"unread"}) || [];


      // console.log('imgData: ',imgData);
      var result =  {
          // loading      : loading,
          FETempData   : FETempData,
          ticketImages : ticketImages,
          ticketVideo  : ticketVideo,
          ticket       : ticket,
          tickets      : tickets,
          checkObjs    : checkObjs,
          textObjs     : textObjs,
          s3Data       : s3Data,
          userData     : userData,
          imgData      : imgData,
          loading6     : loading6,
          loading3     : loading3,
          notificationData :notificationData
      };

      // console.log("checkObjs = ",checkObjs);

    // getCache();

      // console.log("result",result);
      // console.log("userData",userData);
      return result;

}, ViewTicketFormInfo);
export default ViewTicketForm;

// async getCache(){
//     try{
//         console.log('set key');
//         await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
//     }
//     catch(e){
//         console.log('caught error', e);
//         // Handle exceptions
//     }

// }

ViewTicketForm.defaultProps = {
  messages: {
    en: {
      required: 'This field is required.',
    }
  },

  rules: {
    required: /\S+/,
  },
}