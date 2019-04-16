import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  BackHandler,
  Image,
  Alert,
  BackAndroid,
  findNodeHandle,
  DrawerLayoutAndroid,
  Modal,
  TouchableHighlight,
  Dimensions
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Header,
  Card,
  Button,
  Avatar,
  Icon,
  SearchBar
} from "react-native-elements";
import Meteor, { createContainer } from "react-native-meteor";
import SideMenu from "react-native-side-menu";
import RNExitApp from "react-native-exit-app";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from "react-native-table-component";
import { robotoWeights } from 'react-native-typography';
// import Modal from "react-native-modal";
import { TextField } from 'react-native-material-textfield';
import Pdf from 'react-native-pdf';
import Moment from 'moment';

const window = Dimensions.get('window');
import styles from "./styles.js";
import Menu from "../../components/Menu/Menu.js";
import HeaderDy from "../../components/HeaderDy/HeaderDy.js";

import Loading from '../../components/Loading/Loading.js';
import SubmitedInformation from './SubmitedInformation.js';
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';

class ViewTicket extends React.Component {
  constructor(props) {
    super(props);
    let name = "";
    if (this.props.userName) name = "Welcome " + this.props.userName;

    this.state = {
      name              : name,
      isOpen            : false,
      selectedItem      : "About",
      inputFocusColor   : '#f7ac57',
      Remark            : '',
      modalVisible      : false,
      isEdit            : false,
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    // console.log("inside componentDidMount....");
    // BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }
  componentWillUnmount() {
    // console.log("inside componentWillUnmount....");
    // BackHandler.removeEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }
  androidBackHandler() {
    // console.log("BackHandler state = ",this.props.navigation.state.routeName);
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
      isOpen: false,
      selectedItem: item
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

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  displayAttachments =()=>{
    var data = [];
    var verificationDocuments = this.props.verificationDocument;
    if(verificationDocuments){
       verificationDocuments.map((item,i)=>{

        var fileName = "https://s3.ap-south-1.amazonaws.com/assureidportal/ProofDocuments/"+item.proofOfDocument.split('original/')[1]+'.'+item.fileExt;
        data.push(
                  <View key={i} style={{paddingHorizontal:10,paddingVertical:10}}>
                    <TouchableHighlight
                      onPress={() => {
                        this.setModalVisible(true);
                    }}>
                    {item.fileExt == 'pdf' ? 
                      <Image
                        onPress={() => {this.setModalVisible(true);}}
                        style={{ width: 50, height: 50, borderRadius: 15}}
                        resizeMode="stretch"
                        source={require("../../images/pdf-icon.png")}
                      />
                    :
                      <Image
                        onPress={() => {this.setModalVisible(true);}}
                        style={{ width: 50, height: 50, borderRadius: 15}}
                        resizeMode="stretch"
                        source={require("../../images/imgIcon.png")}
                      />
                    }
                    </TouchableHighlight>
                    <Modal
                      animationType="slide"
                      transparent={false}
                      visible={this.state.modalVisible}
                      onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                      }}>
                      <View>
                        <View>
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
                        {item.fileExt == 'pdf' ? 

                          <View style = {[styles.lineStyle,{height: window.height, width: window.width}]}>
                              <Pdf
                                  // source={source}
                                  source={{uri:fileName}}
                                  onLoadComplete={(numberOfPages,filePath)=>{
                                      console.log(`number of pages: ${numberOfPages}`);
                                  }}
                                  onPageChanged={(page,numberOfPages)=>{
                                      console.log(`current page: ${page}`);
                                  }}
                                  onError={(error)=>{
                                      console.log('error: ',error);
                                  }}
                                  style={styles.pdf}
                                  fitWidth={true}/>
                          </View>

                          :

                          <Image
                            onPress={() => {this.setModalVisible(true);}}
                            style={{ height: window.height, width: window.width}}
                            resizeMode="stretch"
                            source={{uri:fileName}}
                          />
                        }
                        </View>
                      </View>
                    </Modal>
                  </View>
                  )
        })       
    }

    return data;    
  }

  showData(viewTicketData){
    switch(viewTicketData.verificationType){
      case "currentAddress":
          return(
            <View style={{flex: 1, flexDirection: "row"}}>
              <View style={{flex:.5,paddingVertical:15}}>
              <Text style={{fontWeight: 'bold'}}>Current Address</Text>
              </View>
              <View style={{flex:.5,paddingVertical:15}}>
                <Text style={{flexWrap:'wrap'}}>{viewTicketData.verificationData.tempLine1}{viewTicketData.verificationData.tempLine2}, {viewTicketData.verificationData.tempLine3}, {viewTicketData.verificationData.tempLandmark}, {viewTicketData.verificationData.tempCity}, {viewTicketData.verificationData.tempState}, {viewTicketData.verificationData.tempCountry}, {viewTicketData.verificationData.tempPincode} </Text>
              </View>
          </View>
          );
      break;

      case "permanentAddress":
        return(
          <View style={{flex: 1, flexDirection: "row"}}>
            <View style={{flex:.5,paddingVertical:15}}>
            <Text style={{fontWeight: 'bold'}}>Permanent Address</Text>
            </View>
            <View style={{flex:.5,paddingVertical:15,flexDirection:'row'}}>
              <Icon size={18} name='map-pin' type='feather' color='#ccc' />
              <Text style={{flexWrap:'wrap',paddingHorizontal:5}}>
              {viewTicketData.verificationData.line1 ? viewTicketData.verificationData.line1 : ''},&nbsp;{viewTicketData.verificationData.line2 ? viewTicketData.verificationData.line2 : ''},&nbsp;
              {viewTicketData.verificationData.line3 ? viewTicketData.verificationData.line3 : ''},&nbsp;{viewTicketData.verificationData.landmark ? viewTicketData.verificationData.landmark : ''},&nbsp;
              {viewTicketData.verificationData.city ? viewTicketData.verificationData.city+',' : ''}&nbsp;{viewTicketData.verificationData.state ? viewTicketData.verificationData.state+',' : ''}&nbsp;
              </Text>              

              <View>
                <Text>            
                  {viewTicketData.verificationData.Country ? viewTicketData.verificationData.Country+',' : ''}&nbsp;{viewTicketData.verificationData.pincode ? viewTicketData.verificationData.pincode : ''},
                </Text>              
              </View>                       
              <View>
                <Text>
                  {/* Residing From :{viewTicketData.verificationData.residingFrom} Residing Till :{viewTicketData.verificationData.residingTo} */}
                  Residing From :{Moment(viewTicketData.verificationData.residingFrom).format("DD MMM YYYY")} Residing Till :{Moment(viewTicketData.verificationData.residingTo).format("DD MMM YYYY")}
                  
              </Text>
              
              </View>            
            </View>
          </View>
        );
      break;

      case "employement":
        return(
          <View style={{flex: 1, flexDirection: "row"}}>
            <View style={{flex:.5, flexDirection: "row",paddingVertical:15}}>
            <Text style={{fontWeight: 'bold'}}>Employement Details</Text>
            </View>
            <View style={{flex:.5, paddingVertical:15}}>
            <View>
              <Text>

                Employer : {viewTicketData.verificationData.nameOfEmployer ? viewTicketData.verificationData.nameOfEmployer : "-"},
                Address : {viewTicketData.verificationData.employerAddress ? viewTicketData.verificationData.employerAddress: "-"}
            </Text>
            </View>
            <View>
              <Text>
                Contact No. :&nbsp; {viewTicketData.verificationData.contactNo ? viewTicketData.verificationData.contactNo : "-"}.
                Employee Id :&nbsp; {viewTicketData.verificationData.employeeCode ? viewTicketData.verificationData.employeeCode : "-"}
            </Text>
            </View>
            <View>
              <Text>
                Designation :&nbsp; {viewTicketData.verificationData.designation ? viewTicketData.verificationData.designation :"-"},{"\n"}
                Department : &nbsp;{viewTicketData.verificationData.department ? viewTicketData.verificationData.department :"-"},{"\n"}
                Employment From : &nbsp;{viewTicketData.verificationData.employmentFrom ? viewTicketData.verificationData.employmentFrom: "-"},
                Employment To : &nbsp;{viewTicketData.verificationData.employmentTo ? viewTicketData.verificationData.employmentTo : "-"},
                Type Of Employement : &nbsp;{viewTicketData.verificationData.typeOfEmployement? viewTicketData.verificationData.typeOfEmployement : "-"},{"\n"} 
                Duties : &nbsp;{viewTicketData.verificationData.dutiesAndResponsibilites? viewTicketData.verificationData.dutiesAndResponsibilites :"-"}{"\n"}
                Reporting Manager : &nbsp;{viewTicketData.verificationData.reportingManagerNm ? viewTicketData.verificationData.reportingManagerNm : " - "},{"\n"}
                Previous Designation : &nbsp;{viewTicketData.verificationData.prevDesignation ? viewTicketData.verificationData.prevDesignation : "-"}{"\n"}
            </Text>
            </View>
            </View>            
            </View>
          
        );
      break;

      case 'certificates' :
        return(
          <View style={{flex: 1, flexDirection: "row"}}>
            <View style={{flex:.5,paddingVertical:15}}>
             <Text style={{fontWeight: 'bold'}}>Certificates  Details</Text>
            </View>
            <View style={{flex:.5,paddingVertical:15}}>     
              <View>
              <Text style={{flexWrap:'wrap'}}>
                  {viewTicketData.verificationData.certificateName ? viewTicketData.verificationData.certificateName : " "},&nbsp;{viewTicketData.verificationData.issuedBy ? viewTicketData.verificationData.issuedBy : ""}
              </Text>
              </View>
              <View>
                <Text>
                  Valid From - {viewTicketData.verificationData.certificatedOn ? viewTicketData.verificationData.certificatedOn : ""},
                  Valid Till - {viewTicketData.verificationData.validTill ? viewTicketData.verificationData.validTill : ""}
                </Text>
              </View>
            
            </View>            
          </View>
          
        );
      break;
      case 'education' :
      return(
        <View style={{flex: 1, flexDirection: "row"}}>
          <View style={{flex:.5,paddingVertical:15}}>
          <Text style={{fontWeight: 'bold'}}>Education Details</Text>
          </View>
          <View style={{flex:.5,paddingVertical:15}}>
          <View >
            
            <Text>
              {viewTicketData.verificationData.educationLevel ? viewTicketData.verificationData.educationLevel : ""},&nbsp;
              {viewTicketData.verificationData.educationQualification ? viewTicketData.verificationData.educationQualification:""}&nbsp;
         
              {viewTicketData.verificationData.specialization ? viewTicketData.verificationData.specialization: ""},&nbsp;
              {viewTicketData.verificationData.grades ? viewTicketData.verificationData.grades: ""}&nbsp;
         
              {viewTicketData.verificationData.educationMode}{ viewTicketData.verificationData.educationMode ? "," : ""}&nbsp;{"\n"}
              {viewTicketData.verificationData.dateAttendedTo}{ viewTicketData.verificationData.dateAttendedTo ? "," : ""}&nbsp;
              College Address -{viewTicketData.verificationData.collegeName}{ viewTicketData.verificationData.collegeName ? "," : ""}&nbsp;
              {viewTicketData.verificationData.university}{ viewTicketData.verificationData.university ? "," : ""}&nbsp;
              {viewTicketData.verificationData.collegeAddress} {"\n"}
              Roll No-{viewTicketData.verificationData.rollNo}
          </Text>
          </View>
          </View>            
          </View>
        
      );
    break;
    }
  }
  render() {

    var userData  = Meteor.user().profile;
    // console.log('view ticket:',userData);
    const { navigate, goBack, state } = this.props.navigation;
    if(this.props.viewTicketUserData){
      var userViewTicketData = this.props.viewTicketUserData;
      // console.log(this.props.viewTicketUserData,'this.props.viewTicketUserData');
    }

    var viewTicketData =this.props.viewTicketData;

    const menu = <Menu navigate={navigate} userName={this.props.userName} />;
    var navigationView = (
      <ScrollView
        style={{ backgroundColor: "#fbae16" }}
        createContainerstyle={{ flex: 1, backgroundColor: "#fbae16" }}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{ borderBottomWidth: 1, padding: 10, borderColor: "#fff" }}
        >
          <View
            style={{
              maxHeight: 30,
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >
            <TouchableOpacity onPress={this.closeDrawer}>
              <View>
                <Icon size={25} name="close" type="evilicon" color="#000" />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                flex: 1,
                lineHeight: 30,
                fontSize: 30,
                color: "#fff"
              }}
            >
              NOTIFICATION
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 20,
              paddingTop: 10
            }}
          >
            Newly Added
          </Text>
        </View>
      </ScrollView>
    );
  var navigationView = <NotificationCommon closeDrawer={this.closeDrawer} notificationData={this.props.notificationData} navigation={this.props.navigation}/>
    
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={(_drawer) => this.drawer = _drawer}
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
            
            {/* <Header
              centerComponent={{ text: "ASSUREID", style: { color: "#fff",fontWeight:'bold'} }}
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

            <HeaderDy headerTitle={this.props.viewTicketData.serviceName +" / "+ this.props.viewTicketData.ticketNumber} goBack={goBack} />
              {this.props.loading && this.props.assignedByName
              ?
              <ScrollView
                createContainerStyle={{
                  marginBottom: 25,
                  borderWidth: 0,
                  margin: 0
                }}
              >

                <View style={styles.formContainer}>
                  {this.props.isEdit
                  ?
                    <View style={[{alignItems:'flex-end',justifyContent:'flex-end',backgroundColor:'transparent',padding:0},styles.formInputView]}>
                      <TouchableOpacity onPress={()=>this.props.navigation.navigate('ViewTicketForm',{ticket:this.props.ticketid})}>
                        <Icon name="edit" type="font-awesome" size={25}  color="#33b5e5"/>
                      </TouchableOpacity>
                    </View>
                  :
                    null
                  }
                  <View style = {styles.formInputView}>
                    <View style= {{flex:1,flexDirection:'row',}}>
                      <View  style= {{flex:.5}}>
                        <Text style={{fontWeight: 'bold'}}>Assigned By</Text>
                      </View>
                      <View  style= {{flex:.5,flexDirection:'row',}}>
                        <Icon size={18} name='user-o' type='font-awesome' color='#ccc' />
                        <Text style={{flexWrap:'wrap',paddingHorizontal:5}} >{this.props.assignedByName}</Text>
                      </View>
                    </View> 
                  </View>
                   <View style = {styles.formInputView}>
                    <View style= {{flex:1,flexDirection:'row',}}>
                      <View  style= {{flex:.5,}}>
                        <Text style={{fontWeight: 'bold'}}>Assigned Date</Text>
                      </View>
                      <View  style= {{flex:.5,flexDirection:'row'}}>
                        <Icon size={18} name='calendar' type='font-awesome' color='#ccc' />
                        <Text style={{flexWrap:'wrap',paddingHorizontal:5}} >{this.props.viewTicketData.assignedDate}</Text>
                      </View>
                    </View> 
                  </View>
                  <View style = {styles.lineStyle} />
                  <View style={styles.formInputView}>
                    <View>
                      <Text style={{fontWeight: 'bold'}}>Profile</Text>
                    </View>
                  </View>
                  <View style={{flex:1,flexDirection:'row',paddingVertical:10}}>
                    <View style={{ flex:.5,marginLeft:15}}>
                     {this.props.viewTicketData &&  this.props.viewTicketData.userProfileLink
                      ?
                        <Avatar
                          width={80}
                          height={80}
                          rounded
                          source={{ uri : this.props.viewTicketData.userProfileLink }}
                          avatarStyle={{borderWidth:1,borderColor:'#000'}}
                          containerStyle={{marginBottom:5}}
                        />
                      :
                          <Avatar
                            width={90}
                            height={90}
                            rounded
                            source={require('../../images/userIcon.jpg')}
                            activeOpacity={0.7}
                          />  
                      }
                    </View>
                    { this.props.viewTicketData?
                      <View style= {{flex:.5,marginRight:15}}>
                        <View style= {{flex:1,flexDirection:'row'}}>
                          <Icon size={18} name='user-o' type='font-awesome' color='#ccc' />
                          <Text style= {{paddingHorizontal:5}}>{viewTicketData.firstName} </Text>
                          <Text>{viewTicketData.lastName}</Text>
                        </View>
                        <View style= {{flex:1,flexDirection:'row'}}>
                          <Icon size={18} name='gender-male-female' type='material-community' color='#ccc' />
                          <Text style= {{flex:.4,flexDirection:'row',paddingHorizontal:5}}>{viewTicketData.gender}</Text>
                          {viewTicketData.age <= 0  || viewTicketData.age == NaN ? null : <Text style= {{flex:.5,flexDirection:'row'}}>, {viewTicketData.age} Years</Text>}
                        </View>
                        <View style= {{flex:1,flexDirection:'row'}}>
                          <Icon size={18} name='map-pin' type='feather' color='#ccc' />
                          <Text style= {{paddingHorizontal:5}}>{viewTicketData.serviceName}</Text>
                        </View>
                      </View>
                    :<Loading />}
                  </View>
                  <View style = {styles.lineStyle} />

                  {this.props.viewTicketData?
                    <View style = {styles.formInputView}>
                      {this.showData(this.props.viewTicketData)}
                    
                      {/* <View style={{flex:.5,paddingVertical:15}}>
                        <Text style={{fontWeight: 'bold'}}>Permanent Address</Text>
                      </View>
                      <View style={{flex:.5,paddingVertical:15}}>
                        <Text style={{flexWrap:'wrap'}}>{viewTicketData.verificationData.line1}{viewTicketData.verificationData.line2}, {viewTicketData.verificationData.line3}, {viewTicketData.verificationData.landmark}, {viewTicketData.verificationData.city}, {viewTicketData.verificationData.state}, {viewTicketData.verificationData.country}, {viewTicketData.verificationData.pincode} </Text>
                      </View> */}
                    </View>
                  :<Loading />}
                  <View style = {styles.lineStyle} />
                  <View style={styles.formInputView}>
                    <View>
                      <Text style={{fontWeight: 'bold'}}>Reference Attachments</Text>
                    </View>
                  </View>
                  <View style={styles.referenceContainer}>
                    
                        { this.displayAttachments()}
                        
                    
                  </View>
                    
                  <View>
                  {
                    this.props.buttonVal == "Back" ? 
                    <SubmitedInformationContainer  ticket={this.props.ticketid} />
                    :
                    <View></View>
                  }
                  </View>
              </View>
             
              {
                this.props.buttonVal == "Start" ? 
                  <View style={{ alignItems: "center",paddingVertical:15}}>
                    <Button
                      onPress={()=> this.props.navigation.navigate('ViewTicketForm',{'ticket': this.props.ticketid})}
                      buttonStyle={styles.buttonLarge}
                      title="Start"
                    />
                  </View>
                :
                
                  <View style={{ alignItems: "center",paddingVertical:15,}}>
                      <Button  
                       onPress={()=> this.props.navigation.goBack(null)}
                        buttonStyle={styles.buttonLarge}
                        title="Back" style={{color:"#fff"}}
                      />
                  </View>
              }
                
              
            </ScrollView>
            :
              <Loading />
            }
          </View>
        </SideMenu>
      </DrawerLayoutAndroid>
    );
  }
}

export default createContainer((props) => {

  var ticketId       = '';
  var assignedByName = '';
  var viewTicketUserData, handle1, loadingUser,verificationDocument = '';
  const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"type":"notification","status":"unread"}) || [];
  const { state } = props.navigation;
  console.log("state = ",state);

  if(state.params.ticketid){
    ticketId = state.params.ticketid;
  }
  var buttonVal = "";
  const handle             = Meteor.subscribe('singleTicket',ticketId);
  const viewTicketData     = Meteor.collection('ticketMaster').findOne({'_id':ticketId});
  // console.log('viewTicketData', viewTicketData);

  if(viewTicketData){
    handle1              = Meteor.subscribe('userprofile',viewTicketData.userId);
    viewTicketUserData   = Meteor.collection('userProfile').findOne({'userId': viewTicketData.userId});
    loadingUser          = handle1.ready() ; 
    verificationDocument = viewTicketData.verificationDocument;
  }
 
  if(viewTicketData && viewTicketUserData){
    viewTicketData.firstName   = viewTicketUserData.firstName;
    viewTicketData.lastName    = viewTicketUserData.lastName;
    viewTicketData.gender      = viewTicketUserData.gender;
    viewTicketData.dateOfBirth = viewTicketUserData.dateOfBirth;
    // if(viewTicketData.submitedDoc){
    //   viewTicketData.assignedDate= Moment(viewTicketData.submitedDoc.createdAt).format('Do MMMM YYYY'); 
    // }else{
    //   viewTicketData.assignedDate = '';
    // }
    // viewTicketData.userProfile = "https://s3.ap-south-1.amazonaws.com/assureidportal/UserImage/"+viewTicketUserData.userProfile.split('original/')[1]+'.'+viewTicketUserData.userFileExt;
    
    if(viewTicketUserData.userProfile){
      viewTicketData.userProfileLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/UserImage/"+viewTicketUserData.userProfile.split('original/')[1]+'.'+viewTicketUserData.userFileExt;
    }else{
      viewTicketData.userProfileLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/UserImage/C4pFJMNtZfJ79nmtR.png";
    }
    // console.log('viewTicketData.userProfile: ',viewTicketData.userProfile);
    var ticketElements    = viewTicketData.ticketElement;
    var FEDetails         = ticketElements.find((obj)=> { return obj.roleStatus == 'FEAllocated' });

    if(FEDetails){
      var handle2           = Meteor.subscribe('userData',FEDetails.userId);
      var assignedBy        = Meteor.collection('users').findOne({'_id': FEDetails.userId});
      viewTicketData.assignedDate= Moment(FEDetails.createdAt).format('Do MMMM YYYY'); 

      if(assignedBy){
        assignedByName = assignedBy.profile.firstname+' '+assignedBy.profile.lastname
      }
    }
    // console.log('FEDetails: ',FEDetails);
    var _id = Meteor.userId();
    const user       = Meteor.collection('users').findOne({"_id":_id});
    if(user){
        var roleArr = user.roles;
        if(roleArr){
          var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
        }
        switch(role){
            case 'field expert':
                  if(ticketElements[ticketElements.length-1].roleStatus == "FEAllocated" || ticketElements[ticketElements.length-1].roleStatus == "VerificationFail"){
                      var showStartButton = true;
                      buttonVal = "Start";
                  }else if(ticketElements[ticketElements.length-1].roleStatus != "FEAllocated"){
                      buttonVal = "Back"
                  }
            break;

            case 'business Associate':
                if(ticketElements[ticketElements.length-1].roleStatus == "BAAllocated" || ticketElements[ticketElements.length-1].roleStatus == "VerificationFail"){
                  var showStartButton = true;
                  buttonVal = "Start";                  
                }
            break;
      
        }
    }

    if(viewTicketUserData.dateOfBirth){
      var today     = new Date();    
      var birthDate = new Date(viewTicketUserData.dateOfBirth);    
      var age       = today.getFullYear() - birthDate.getFullYear();    
      var m         = today.getMonth() - birthDate.getMonth();    
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){age--;}    
      viewTicketData.age = age;  
    }else{
      viewTicketData.age = '';  
    }
  } 

  if(viewTicketData.submitedDoc){
    var status = viewTicketData.submitedDoc.documents.status;
    var actualStatus = status.split('-');
    var isEdit = (actualStatus && actualStatus[0] == 'Completed') ? false : true;
  }else{
    var isEdit = false;
  }
  
  const loading = handle.ready() && handle1.ready() ;

  var result = {
    viewTicketData       : viewTicketData ,
    verificationDocument : verificationDocument,
    // viewTicketUserData:viewTicketUserData ,
    handle               : handle,
    handle1              : handle1,
    loading              : loading,
    loadingUser          : loadingUser,
    assignedByName       : assignedByName,
    showStartButton      : showStartButton,
    buttonVal            : buttonVal,
    ticketid             : ticketId,
    isEdit               : isEdit,
    notificationData     : notificationData
  };

  // console.log(JSON.stringify(result,null,4));
  return result;

}, ViewTicket);
