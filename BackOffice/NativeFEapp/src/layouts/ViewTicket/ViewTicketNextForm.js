import React, { Component } from "react";
import Meteor,{ createContainer } from "react-native-meteor";

import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, BackHandler, Image, Alert, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from "react-native";
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
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';

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
      // Remark            : '',
      value             : 0,
      "fontSize"        : 14,
      "userUpload"      : {},
      "status"          : '',
      "remark"          : '',
      "images"          : [],
      "videos"          : [],
      "imgData"         : [],
      "remarkError"     : '',
      "statusError"     : '',
      "imageError"      : '',
    };
    this.openDrawer  = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle      = this.toggle.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    console.log("inside componentWillReceiveProps.........");
    // console.log("this.props.tickets.submitedDoc ======= ",this.props.tickets.submitedDoc);
    if(this.props.tickets.submitedDoc){
      
      // var status;

      if(nextProps.FETempData && nextProps.FETempData.videos){
        console.log("inside FETempData..........");
        var status = (nextProps.FETempData.status) ? nextProps.FETempData.status : '' ;
        var videos = (nextProps.FETempData.videos) ? nextProps.FETempData.videos : [];
        // var uploadedVideo = nextProps.FETempData.videos;
      }else{
        console.log("inside else nextProps..........");
        var status = nextProps.tickets.submitedDoc.documents.status;
        var videos = nextProps.videos;
        // var uploadedVideo = this.state.videos 
      }

      // console.log("videos = ",videos);
      // // var uploadedVideo = this.state.videos;
      // console.log("uploadedVideo = ",uploadedVideo);
      // var previousVideo = uploadedVideo.length>0 ? [] : this.props.videos ;
      // console.log("previousVideo = ",previousVideo);   

      this.setState({
          // remark        : nextProps.tickets.submitedDoc.documents.remark,
          status        : status,
          checkObjs     : nextProps.checkObjs,
          imgData       : nextProps.imgData,
          // videos        : [...uploadedVideo,...previousVideo],
          videos        : videos,
      });

    }else{

      this.setState({
          checkObjs  : nextProps.checkObjs, 
          imgData    : nextProps.imgData,
      });

      if(nextProps.FETempData && nextProps.checkObjs.length > 0){
        for(var k=0;k<nextProps.checkObjs.length;k++){
          var getToggleVal = nextProps.checkObjs[k].correctValTemp == 'Correct' ? true : false;
          var getRemarkVal = nextProps.checkObjs[k].remarkValTemp;
          this.setState({
              [nextProps.checkObjs[k].id+'-Toggle']    : getToggleVal,
              [nextProps.checkObjs[k].id+'-Remark']    : getRemarkVal,
          },()=>{
                  // console.log('this.state: ',this.state);
                });          
        } // EOF k loop
      } // temp data

      if(nextProps.FETempData){
        // console.log("inside nextProps.FETempData");
        this.setState({
            remark    : (nextProps.FETempData.remark) ? nextProps.FETempData.remark : '', 
            status    : (nextProps.FETempData.status) ? nextProps.FETempData.status: '',
            videos    : (nextProps.FETempData.videos) ? nextProps.FETempData.videos: [],  
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
    // console.log("inside validInput");
    var valid = true;
    var imageData = this.state.imgData;
    // console.log("documents length = ",imageData.length);
    this.validate({
      remark: {required: true},
      status: {required: true},
    });

    // console.log("status = ",this.state.status);
    // console.log("remark = ",this.state.remark);

    if(this.isFieldInError("remark")){
      // console.log("inside remark");
      let remarkError = this.getErrorsInField('remark');
      this.setState({remarkError});
      valid = false;
    }else{
      this.setState({remarkError:''});
    }
    if(this.isFieldInError("status")){
      // console.log("inside status");
      let statusError = this.getErrorsInField('status');
      this.setState({statusError});
      valid = false;
    }else{
      this.setState({statusError:''});
    }

    if(imageData.length == 0){
      this.setState({imageError: 'Upload Proof'});
    }

    return valid;
  }

  submit(event) {
    event.preventDefault();

    if(this.validInput()){

    var checkLists = [];
    var images     = [];
    var remark     = [];


    //Get Values for all the text field
    var textLists = [];

    var status       = this.state.status;
    // console.log("status ========== ",status);

    var actualStatus = '';
    if(status){
       actualStatus = status.split('-');
    }
  
    // var subStatus   = this.state.subStatus;
    // console.log("imgData -------------- ",this.props.imgData);
    for(var i=0; i<this.props.imgData.length;i++){
      images.push({
                    'userId'    : Meteor.userId(),
                    'imageLink' : this.props.imgData[i].imgs,
                    'createdAt' : new Date(),                  
                });
    }// EOF i loop


    var videos      = this.state.videos;


    if(this.props.tickets && this.props.tickets.submitedDoc && this.props.tickets.submitedDoc.documents){

      console.log("this.props.tickets.submitedDoc.documents.remark = ",this.props.tickets.submitedDoc.documents.remark);
      this.props.tickets.submitedDoc.documents.remark.map((elem)=>{
        // remark.push(elem);
        remark.push({"dataRemark":elem.dataRemark,"createdAt": new Date()});
      });
      //Get values for all the check box
      // var chkListCount = this.state.checkObjs;
      // for(var i=0; i<chkListCount.length;i++){
      //   var chkListElement = this.state.checkObjs[i];

      //   if(this.state[chkListElement.id+'-Toggle']){
      //     var toggleVal = this.state[chkListElement.id+'-Toggle'];
      //   }else{
      //     var toggleVal = this.props.tickets.submitedDoc.documents.checkLists[i].correctVal;
      //   }

      //   if(this.state[chkListElement.id+'-Remark']){
      //     var remkVal = this.state[chkListElement.id+'-Remark'];
      //   }else{
      //     var remkVal = this.props.tickets.submitedDoc.documents.checkLists[i].remarkVal;
      //   }

      //   chkListElement.correctVal = toggleVal;
      //   chkListElement.remarkVal  = remkVal;
      //   checkLists[i]             = chkListElement;

      // } // EOF i loop

      // for(var j=0; j<this.props.tickets.submitedDoc.documents.textLists.length;j++){
      //   var dataChk    = {};
      //   dataChk.task   = this.props.textObjs[j].task;
      //   if(this.refs[this.props.textObjs[j].id].value()){
      //     dataChk.value  = this.refs[this.props.textObjs[j].id].value();
      //   }else{
      //     dataChk.value  = '';
      //   }
      //   textLists.push(dataChk);
      // } // EOF j loop 

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
      // for(var i=0; i<this.props.checkObjs.length;i++){
      //   // console.log('this.state[this.props.checkObjs[i].id+"-Toggle"]: ',this.state[this.props.checkObjs[i].id+"-Toggle"]);
      //   // if(this.state[this.props.checkObjs[i].id+"-Toggle"] == 'Correct'){
      //   //   var chkBoxToggleVal = this.state[this.props.checkObjs[i].id+"-Toggle"];
      //   // }else{
      //   //   var chkBoxToggleVal = 'Incorrect';
      //   // }

      //   // if(this.state[this.props.checkObjs[i].id+"-Remark"]){
      //   //   var chkBoxRemarkVal = this.state[this.props.checkObjs[i].id+"-Remark"];
      //   // }else{
      //   //   var chkBoxRemarkVal = '';
      //   // }

      //   var dataChk = {
      //               "titleVal"   : this.props.checkObjs[i].task,
      //               "textVal"    : this.props.checkObjs[i].relatedFields,
      //               "correctVal" : chkBoxToggleVal,
      //               "remarkVal"  : chkBoxRemarkVal,
      //           };

      //   checkLists.push(dataChk);

      // } // EOF i loop

      // console.log('checkLists: ',checkLists);
      // for(var j=0; j<this.props.textObjs.length;j++){
      //   var dataChk    = {};
      //   dataChk.task   = this.props.textObjs[j].task;
      //   if(this.refs[this.props.textObjs[j].id].value()){
      //     dataChk.value  = this.refs[this.props.textObjs[j].id].value();
      //   }else{
      //     dataChk.value  = '';
      //   }
      //   textLists.push(dataChk);
      // } // EOF j loop 

      // console.log("actualStatus =========== ",actualStatus);

      if(actualStatus[0] == 'Completed'){    
        var roleStatus  = "ProofSubmit";
        var msg         = "Submitted Verification Information";
      }else{
        var roleStatus  = "ProofSubmit-Pending";
        var msg         = "Submitted Verification Information";
      }
    
    }//EOF else

    // var remark      = this.state.remark;
    remark.push({'dataRemark':this.state.remark,'createdAt': new Date()});
    // var documents = {

    //     checkLists : checkLists,
    //     textLists  : textLists,
    //     status     : status,
    //     // subStatus  : subStatus,
    //     images     : images,
    //     videos     : videos,
    //     remark     : remark,
    // }

    var insertData = this.props.insertData;
    // console.log("submit insertData ====> ",insertData);
    insertData.submitedDoc.images = images;
    insertData.submitedDoc.videos = videos;
    insertData.submitedDoc.status = status;
    insertData.submitedDoc.remark = remark;
    insertData.roleStatus = roleStatus;
        
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

            // var insertData = {
            //     "userId"              : Meteor.userId(),
            //     "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
            //     "allocatedToUserid"   : teamMemberDetails.userId,
            //     "allocatedToUserName" : teamMemberDetails.userName,
            //     "role"                : role,
            //     "roleStatus"          : roleStatus,
            //     "msg"                 : msg,
            //     "submitedDoc"         : documents,
            //     "createdAt"           : new Date(),
            // }
            console.log('insertData submit ====> ',insertData);    

            Meteor.call('genericUpdateTicketMasterElement', this.props.tickets._id, insertData, (error,result)=>{
                if (error) {
                  console.log(error.reason);
                }else{
                  // console.log("Inserted Successfully!");
                  this.props.navigation.navigate('ViewSubmittedTicket', { ticket: this.props.tickets._id });
                }
            });

        }

    }

    }// if validInput
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

  delTempImg = (index) =>{
    var imgData = this.state.imgData;
    // console.log("imgData = ",imgData);

    // var filteredData = imgData.filter((elem)=>{
    //   return elem.index != index;
    // });
    // console.log("filteredData = ",filteredData);
    // this.setState({imgData:filteredData});
    Meteor.call('delFEDocImage',this.props.ticket ,index, (error, result)=>{
      if(error){
        Alert.alert(error.reason);
      }else{
        Alert.alert('Image deleted Successfully!');
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
                      <TouchableOpacity ><Text>Remove</Text></TouchableOpacity>
                    </View>
                    
                  </View>
                  );
        })  
        // onPress={(e) =>this.delImg(e, item._id)}     
    }

    return data;    
  }

  displayAttachmentsTest(){
    var data = [];
    var imgs = [];
    var verificationDocuments = this.state.imgData;
    // console.log("documents = ",verificationDocuments);

    if(verificationDocuments && verificationDocuments.length>0){
       verificationDocuments.map((item, index)=>{
          // console.log("imageData----------------------> ",item);
          // var fileName = (item.imgs) ? item.imgs : item.imageLink;
          var fileName = item.imgs;
          imgs.push(fileName);
          data.push(
            <View key={index} style={{ flex:0.3 }} removeClippedSubviews={true}>
              <View key={'viewWrapper-'+index} style={{ flex:0.2, alignItems:'center', justifyContent:'center' }}>
                <CachedImage key={'cache-'+index} source={{uri: fileName}} style={{width: 40, height: 40}}/>
                <TouchableOpacity onPress={(e) =>(item._id) ? this.delImg(e, item._id) : this.delTempImg(item.index)}>
                  <Text>Remove</Text>
                </TouchableOpacity>
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
    console.log("Inside goTOCamera");
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

      // for(var j=0; j<this.props.tickets.submitedDoc.documents.textLists.length;j++){
      //   var dataChk    = {};
      //   dataChk.task   = this.props.textObjs[j].task;
      //   if(this.refs[this.props.textObjs[j].id].value()){
      //     dataChk.value  = this.refs[this.props.textObjs[j].id].value();
      //   }else{
      //     dataChk.value  = '';
      //   }
      //   textLists.push(dataChk);
      // } // EOF j loop 
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

      // for(var j=0; j<this.props.textObjs.length;j++){
      //   var dataChk    = {};
      //   dataChk.task   = this.props.textObjs[j].task;
      //   console.log("this.props.textObjs[j]===== ",this.props.textObjs[j]);
      //   console.log("this.props.textObjs[j].id === ",this.props.textObjs[j].id);
      //   if(this.refs[this.props.textObjs[j].id].value()){
      //     dataChk.value  = this.refs[this.props.textObjs[j].id].value();
      //     dataChk.checkListFrom = 'UserUpload';
      //   }else{
      //     dataChk.value  = '';
      //   }
      //   checkLists.push(dataChk);
      // } // EOF j loop    
    }//EOF else

    // console.log('textLists: ',textLists);
    // console.log('checkLists: ',checkLists);
    var formValues = {
                        ticketId   : this.props.ticket,
                        textLists  : textLists,
                        checkLists : checkLists,
                        videos     : this.state.videos,
                        status     : this.state.status ? this.state.status : '',
                        remark     : this.state.remark ? this.state.remark : '',
                      }
    console.log("formValues = ",formValues);
    Meteor.call('saveFEDataTemp', formValues, (err, res)=>{

    });


    var ImagePicker = require('react-native-image-picker');
    console.log('ImagePicker: ', ImagePicker);
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
        this.props.navigation.navigate('MapDisplay',{ ticket : this.props.ticket, latitude : response.latitude, longitude : response.longitude, imgLink : 'file://'+response.path, insertData:this.props.insertData });
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

  uploadVideo(event){
    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;
    var timeStamp = new Date().getTime();
    DocumentPicker.show({ filetype : [DocumentPickerUtil.allFiles()]},(error,res) => {
      if(res){
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
      }
                        });    
  }

  delVideo = () =>{
    // console.log("delVideo........");
    this.setState({videos:[]});
    Alert.alert('','Video deleted Successfully!');
  }

  render() {
    
    // console.log('render video state');
    // console.log(this.state.videos);
    // console.log('---------------------');
    const { navigate, goBack, state } = this.props.navigation;

    let status = [{
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
            >


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
                <View style={styles.formContainer}>
                  <View>
                    <Text style={[(robotoWeights.bold),{fontSize:15,color:'#33b5e5',alignSelf:'center'}]}>Submitted Information</Text>
                  </View>
               
                    {/*<View style={styles.formInputView}>
                      <View>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333'}]}>Verified Information</Text>
                      </View>
                    </View>*/}

                  <View style = {styles.lineStyle} >
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
                             {/*this.displayAttachments()*/}
                             {this.displayAttachmentsTest()}
                          </View>
                        </View>
                      </View>
                    </View>
                    {this.state.imageError
                    ?
                      <Text style={{color:'rgb(213, 0, 0)'}}>{this.state.imageError}</Text>
                    :
                      null
                    }
                  </View>

                  <View style = {styles.lineStyle} >
                  <View style={styles.formInputView}>
                    <View>
                      <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333'}]}>Upload Video</Text>
                    </View>
                  </View>
                  <View style={styles.videoContainer}>
                    {/*<View style = {styles.formInputView}> */}
                      <View style={{flex:1}}>
                        {/*<View style={{flexDirection:'row',bottom:50}}>
                          <View style={{}}>*/}
                          {this.state.videos.length == 0
                          ?
                            <View style={{justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Icon name="videocam" type="MaterialIcons" size={65} color="#aaa" onPress = {this.uploadVideo.bind(this)} />
                            </View>
                          :
                            null
                          }
                          <View style={{flex:1}}>
                            {/*console.log("Videos ==== ",this.state.videos)*/}
                            { this.state.videos.length > 0 ?
                              <View>
                              {this.state.videos.map((videoData,index)=>{
                                return(<RenderVideo key={index} videoData={videoData} delVideo={this.delVideo.bind(this)}/>);
                              }) }
                              </View>
                              :
                              <View><Text></Text></View>
                            }
                          </View>
                          {/*</View>
                        </View>*/}
                      </View>
                    {/*</View>*/}
                  </View>
                  </View>

                  <View style = {styles.lineStyle} >
                    {/*<View style={styles.formInputView}>
                      <View>
                        <Text style={[(robotoWeights.bold),{fontSize:15,color:'#333333'}]}>Remark</Text>
                      </View>
                    </View>*/}
                    <Text style={[(robotoWeights.bold),(this.state.remarkError?{color:'rgb(213, 0, 0)'}:{color:'#333333'}),{fontSize:15,marginTop:10}]}>Remark</Text>

                    <View style={styles.formInputViews}>
                      <TextField
                        label                 = ''
                        lineWidth             = {0}
                        tintColor             = {this.state.inputFocusColor}
                        inputContainerPadding = {4}
                        labelHeight           = {16}
                        keyboardType          = 'default'
                        inputContainerStyle   = {{height:200,paddingTop:5,paddingBottom:5}}
                        style                 = {{borderWidth:1,borderColor:'#aaa',height: 190,}}
                        // labelTextStyle        = {styles.labelText}
                        activeLineWidth       = {0}
                        fontSize              = {this.state.fontSize}
                        labelFontSize         = {this.state.fontSize}
                        multiline             = {true}
                        // numberOfLines         = {4}
                        ref                   = 'remark'
                        value                 = {this.state.remark}
                        onChangeText          = {(value) => { 
                                                              this.setState({remark:value});
                                                            }
                                                }
                        error                 = {this.state.remarkError[0]}

                      />
                    </View>
                  </View>

                  <View style = {styles.lineStyle} >
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
                        error                 = {this.state.statusError[0]}

                      /> 
                    </View>
                  </View>


              <View style={{ alignItems: "center",marginTop:40}}>
                <Button
                  buttonStyle={styles.buttonLarge}
                  title="SAVE"
                  onPress={this.submit.bind(this)}
                />
              </View>

              </View>



            </ScrollView>
          </View>
        </SideMenu>
      </DrawerLayoutAndroid>
    );
  }
}


ViewTicketNextForm = createContainer( (props) => {

    // console.log('ticket: ',props.navigation.state.params.ticket);
    const ticket       = props.navigation.state.params.ticket;
    const insertData   = props.navigation.state.params.insertData;
    // console.log("insertData ======== ",insertData);

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
    const loading3    = !postHandle3.ready();
    let checkObjs     = [];
    var textObjs      = [];
    var checkListObjs = [];
    var checkListFrom = '';
    var videos        = [];

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

          if(tickets.submitedDoc.documents.images){
            // console.log("images ====== ",tickets.submitedDoc.documents.images);
            let images = tickets.submitedDoc.documents.images;
            videos = tickets.submitedDoc.documents.videos;
            // imgData = images.map(x => ({...x}));
            images.map((elem,pos) =>{
              // imgData.push(elem);
              if(elem){
                var obj = {
                  index     : pos,
                  userId    : elem.userId,
                  imgs      : elem.imageLink,
                  createdAt : elem.createdAt,
                };
                imgData.push(obj);  
              }
            });

            // console.log("container videos = ",videos);
            // imgData = tickets.submitedDoc.documents.images;
          }
          

          // console.log('checkObjs: ',checkObjs);
          // console.log('textObjs: ',textObjs);
          // console.log('imgData::::::::: ',imgData);

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
                      //     console.log('requiredData ==',requiredData);
                      //     console.log('requiredData value ==',requiredData.value);
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
       
      
      // console.log("textObjs 2 ==> ",textObjs);

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
          insertData   : insertData,
          videos       : videos,
          notificationData :notificationData

      };

      // console.log("checkObjs = ",checkObjs);

    // getCache();

      // console.log("result",result);
      // console.log("userData",userData);
      return result;

}, ViewTicketFormInfo);
export default ViewTicketNextForm;

ViewTicketNextForm.defaultProps = {
  messages: {
    en: {
      required: 'This field is required.',
    }
  },
  rules: {
    required: /\S+/,
  },
}