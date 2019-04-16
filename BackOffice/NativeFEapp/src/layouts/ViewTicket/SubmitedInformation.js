import React, { Component } from "react";
import Meteor,{ createContainer } from "react-native-meteor";

import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, BackHandler, Image, Alert, BackAndroid, findNodeHandle, DrawerLayoutAndroid , TouchableHighlight, Modal} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Header, Card, Button, Avatar, Icon, SearchBar, CheckBox } from "react-native-elements";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";
import { TextField } from 'react-native-material-textfield';
import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit';
// import CheckBox from 'react-native-check-box';

import PropTypes from "prop-types";
import RadioButton from "radio-button-react-native";
import ToggleSwitch from 'toggle-switch-react-native';
// import Modal from "react-native-modal";
import SideMenu from "react-native-side-menu";
import RNExitApp from "react-native-exit-app";
import Moment from 'moment';



import styles from "./styles.js";
import Menu from "../../components/Menu/Menu.js";
import HeaderDy from "../../components/HeaderDy/HeaderDy.js";
// import ViewCustomerTable from "../../components/tableComponent/ViewCustomerTable.js";
// import ViewCustomerModal from "../../components/modalComponent/ViewCustomerModal.js";
import { Dropdown } from 'react-native-material-dropdown';
import RenderVideo from './RenderVideo.js';

class SubmitedInformation extends React.Component {
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
      "subStatus"       : '',
      "remark"          : '',
      "images"          : [],
      "videos"          : [],
      modalVisible      : false,
      
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }
  componentWillUnmount() {
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  displayAttachments =()=>{
    var data = [];

    if(this.props.selectFEData && this.props.selectFEData.documents){
      var verificationDocuments = this.props.selectFEData.documents.images;
      console.log("documents =======> ",verificationDocuments);
      if(verificationDocuments){
         verificationDocuments.map((item, index)=>{
          if(item){

          var fileName = item.imageLink;
          // console.log('fileName:',fileName);
          data.push(
                    <View key={index} style={{ flex:0.3 }}>
                      <TouchableHighlight
                        onPress={() => {
                          this.setModalVisible(true);
                      }}>
                      <View style={{ flex:0.2, alignItems:'center', justifyContent:'center' }}>
                        <Image  
                        style      = {{ width:50, height:50}}                    
                        resizeMode = "stretch"             
                        source     = {{ uri : item.imageLink }} 
                        // source     = {require("../../images/imgIcon.png")}             
                        />
                      </View>
                       </TouchableHighlight>

{/*                    <Modal
                      animationType="slide"
                      transparent={false}
                      visible={this.state.modalVisible}
                      onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                      }}>
                      <View>
                        <View style={{flex:1}}>
                        <View style={{zIndex : 1, position : 'absolute',backgroundColor:'rgba(52, 52, 52, 0.6)'}}>
                          <TouchableOpacity>
                          <Button
                            large
                            title="Close"
                            onPress={() => {
                              this.setModalVisible(!this.state.modalVisible);
                            }}
                            buttonStyle={{ width : window.width, backgroundColor : 'transparent'}}
                            />  
                          </TouchableOpacity>  
                        </View>
                          <View style={{flex:1, height: window.height, width: window.width }}>
                            <Text>{item.imageLink}</Text>
                            <Image
                              onPress={() => {this.setModalVisible(true);}}
                              style={{ height: window.height, width: window.width}}
                              resizeMode="stretch"
                              source={{uri:"https://s3.ap-south-1.amazonaws.com/assureidportal/uploads/1523879666811.jpeg"}}
                            />
                          </View>
                        </View>
                      </View>
                    </Modal>*/}

                    </View>
                    );
            }
          })       
      }
    }

    return data;    
  }

  render() {

    return (        
        <View style={styles.formContainer}>
        <View>
            <Text style={{fontWeight: 'bold'}}>Submited Information</Text>
        </View>
<View style={styles.formInputView}>
              <View>
                <Text style={{fontWeight: 'bold'}}>Verified Information</Text>
              </View>
            </View>


                  <View style={{width:'100%',padding:10}}>
                  {this.props.selectFEData && this.props.selectFEData.documents ?
                    this.props.selectFEData.documents.checkLists.map((checkListDefault,index)=>{
                      return(
                              <View key={index} style={{flex:1, flexDirection: 'row', borderBottomColor: '#ddd',paddingVertical:5}}>

                                <View style={{flex:1}}>
                                  <View style={{flex:1}}>
                                    <Text style={{fontWeight:'bold'}}>{index+1}. {checkListDefault.titleVal}</Text>
                                  </View>

                                  { checkListDefault.textVal ? checkListDefault.textVal.map((data,ind)=>{
                                    // return(
                                    //   <View style={{flex:1}} key={ind}>
                                    //     <Text>{data.value}</Text>
                                    //   </View>
                                    // );
                                    return data.dbField != "residingFrom" ?

                                        <Text key={ind}>{data.value},&nbsp;</Text>   
                                      :       
                                        <Text key={ind}>{Moment(data.value).format("DD MM YYYY")}</Text>
                                    })  
                                  :
                                  <Text>Null</Text>
                                }
                                </View>

                                <View style={{flex:1}}>
                                  <View style={{flex:1}}>
                                    <Text style={{fontWeight:'bold'}}>Correct/Incorrect</Text>
                                    <Text style={{color:'#33b5e5',fontWeight:'bold'}}>{checkListDefault.correctVal}</Text>

                                    {/*<ToggleSwitch
                                                                            isOn = {checkListDefault.correctVal == 'Correct' ? true : false}
                                                                            onColor='#33b5e5'
                                                                            offColor='#ddd'
                                                                            label=''
                                                                            labelStyle={{color: 'black', fontWeight: '900', flex:1}}
                                                                            size='small'
                                                                            onToggle={ (isOn) => {console.log("isOn = ",isOn)}}
                                                                        />*/}

                                  </View>
                                  {checkListDefault.correctVal == "Incorrect"
                                  ? 
                                    <View style={{marginTop:5}}>
                                      <Text style={{fontWeight:'bold'}}>Remark :</Text>
                                      <Text>{checkListDefault.remarkVal}</Text>
                                    </View>
                                  :
                                    null
                                  }
                                {/*<TextField
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
                                                                  value                 = {checkListDefault.remarkVal}
                                                                />*/}
                                </View>
                              </View>
                      );
                    })
                  :
                  <View><Text></Text></View>
                  }
                  </View>
                <View style={[styles.lineStyle, {width:'100%',padding:10}]}>
                {this.props.selectFEData && this.props.selectFEData.documents ?
                  this.props.selectFEData.documents.textLists.map((textListDefault,index)=>{
                    return(
                            <View style={styles.lineStyle} key={index}>
                              <View style={styles.formInputView1}>
                                <View>
                                  <Text style={{fontWeight: 'bold'}}>{textListDefault.task}</Text>
                                </View>
                              </View>
                              <View style={styles.formInputView1}>
                                <Text>{textListDefault.value}</Text>
                              </View>
                            </View>
                          );
                        })
                        :
                       <View><Text></Text></View>
                }
                </View>

                  <View style = {styles.lineStyle} >
                  <View style={styles.formInputView}>
                    <View>
                      <Text style={{fontWeight: 'bold'}}>Uploaded Photos</Text>
                    </View>
                  </View>

                  <View style = {styles.formInputView}> 
                    <View style={{flex:1}}>
                      <View style={{flexDirection:'row'}}>
                        <View style={{flex:0.2}}>
                          <TouchableOpacity >
                            <Icon name="camera-enhance" type="MaterialIcons" size={50} color="#aaa"   />
                          </TouchableOpacity>
                        </View>

                        {this.displayAttachments()}


                      </View>
                    </View>
                  </View>
                  </View>

                  <View style = {styles.lineStyle} >

                  <View style={styles.formInputView}>
                    <View>
                      <Text style={{fontWeight: 'bold'}}>Uploaded Videos</Text>
                    </View>
                  </View>

                  <View style = {styles.formInputView}> 
                    <View style={{flex:1}}>
                      <View style={{flexDirection:'row'}}>
                        <Icon name="videocam" type="MaterialIcons" size={50} color="#aaa"/>

                        { this.props.selectFEData && 
                          this.props.selectFEData.documents && 
                          this.props.selectFEData.documents.videos.length > 0 ?
                          this.props.selectFEData.documents.videos.map((videoData,index)=>{
                            return(<RenderVideo key={index} videoData={videoData}/>);
                          })
                          :
                          <View><Text></Text></View>
                        }
                      </View>
                    </View>
                  </View>

                  </View>

                  <View style = {styles.lineStyle} >
                    <View style={styles.formInputView}>
                      <View>
                        <Text style={{fontWeight: 'bold'}}>Remark</Text>
                      </View>
                    </View>
                    <View style={styles.formInputViews}>
                      {/*<Text>
                      { this.props.selectFEData && this.props.selectFEData.documents ? this.props.selectFEData.documents.remark : ''}
                      </Text>*/}
                      {this.props.selectFEData && this.props.selectFEData.documents
                      ?
                        this.props.selectFEData.documents.remark.map((data,index)=>{
                          return(
                            <Text key={index}>{index+1}. {data.dataRemark} {Moment(data.createdAt).format("DD MM YYYY")}</Text>
                          );
                        })
                      :
                        null
                      }
                    </View>
                  </View>

                  <View style = {styles.lineStyle} >
                    <View style={styles.formInputView}>
                      <View>
                        <Text style={{fontWeight: 'bold'}}>Status</Text>
                      </View>
                    </View>
                    <View style={styles.formInputViews}>
                    <Text>{this.props.selectFEData && this.props.selectFEData.documents ? this.props.selectFEData.documents.status : ''}</Text>
 
                    </View>
                  </View>

              </View>

    );
  }
}


SubmitedInformationContainer = createContainer( (props) => {

    const ticket       = props.ticket;
    const postHandle   = Meteor.subscribe('allTicketImages');
    const postHandle1  = Meteor.subscribe('allTicketVideo');
    const postHandle2  = Meteor.subscribe('checklistFieldExpert');
    const postHandle3  = Meteor.subscribe('singleTicket',ticket);

    const ticketImages = Meteor.collection("tempTicketImages").find({}) || []; 
    const ticketVideo  = Meteor.collection("tempTicketVideo").find({}) || [];  
    // console.log("ticketImages",ticketImages);    
    // console.log("ticketVideo",ticketVideo);
    const loading     = !postHandle.ready();
    const loading1    = !postHandle1.ready();
    const loading3    = !postHandle3.ready();
    var checkObjs     = [];
    var textObjs      = [];
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
       }

      // var selectFEData = tickets.ticketElement.find(( obj ) =>{
      //   if( (obj.role === 'field expert') && (obj.roleStatus == "ProofSubmit" || obj.roleStatus == "ProofResubmitted") ) return obj;
      // });

      var selectFEData = tickets.submitedDoc;

      // console.log('selectFEData: ',selectFEData);

       // console.log('checkListFrom: ',checkListFrom);
       // var checkListObjs = Meteor.collection("checklistFieldExpert").find({"checkListFor" : checkListFrom}) || [];
       //  if (checkListObjs && checkListObjs.length > 0) {
       //     // console.log('checkListObjs: ',checkListObjs);
       //     for (var i = 0; i < checkListObjs.length; i++) {
       //        if(checkListObjs[i].checkListFrom == 'Database'){
       //            checkObjs.push({'id':checkListObjs[i]._id,'task':checkListObjs[i].task}); 
       //        }else{
       //            textObjs.push({'id':checkListObjs[i]._id,'task':checkListObjs[i].task}); 
       //        }
       //     }
       //  }

      if(selectFEData && selectFEData.documents && selectFEData.documents.checkLists){
        checkObjs = selectFEData.documents.checkLists;
        if (checkObjs.length > 0) {
            for (var i = 0; i < checkObjs.length; i++) {
                checkObjs[i].id = i;
                checkObjs[i].task = checkObjs[i].titleVal;
                checkObjs[i].relatedFields = checkObjs[i].textVal;
            }
        }
      }
        
    }
   
      // console.log("checkObjs",checkObjs);
      // console.log("textObjs",textObjs);

      // const postHandle4     = Meteor.subscribe('projectSettingsPublish');
      // const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"}) || {};

      const postHandle5     = Meteor.subscribe('currentUserfunction');
      const userData        = Meteor.collection('users').findOne({"_id": Meteor.userId() }) || {};

      var result =  {
          loading      : loading,
          loading1     : loading1,
          ticketImages : ticketImages,
          ticketVideo  : ticketVideo,
          ticket       : ticket,
          tickets      : tickets,
          checkObjs    : checkObjs,
          textObjs     : textObjs,
          // s3Data       : s3Data,
          userData     : userData,
          selectFEData : selectFEData,
      };

      // console.log("result",result);
      // console.log("userData",userData);
      return result;


}, SubmitedInformation);
export default SubmitedInformationContainer;