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
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';
import Accordion from 'react-native-collapsible/Accordion';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';
import Collapsible from 'react-native-collapsible';

import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import ProfileNavigation from './ProfileNavigation.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import EducationForm from './EducationForm.js';
import ProfessionalEduForm from './ProfessionalEduForm.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class AcademicForm extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state={
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      fontSize        : 15,
      effectiveDate   : '',

      expand          :true,
      educationLevel  : '',
      educationQualification : '',
      specialization  : '',
      grades          : '',
      educationMode   : '',
      dateAttendedFrom : '',
      dateAttendedTo   : '',
      university       : '',
      collegeName      : '',
      collegeAddress   : '',
      rollNo           : '',
      isCollapsed      : false,
        
      professionalQualification : '',
      dateOfQualification       : '',
      registrationNo            : '',
      qualifyingBodyNm          : '',
      professionalRollNo        : '',      

      "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }

    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  componentWillReceiveProps(nextProps){
    console.log("inside Academic componentWillReceiveProps.... loading => ",this.props.loading);
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

  openDrawer(){
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

  handleCollapse = () => {
    this.setState({
      'isCollapsed' : !this.state.isCollapsed,
    });
  }

  render(){

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

    eduProofType = [{
      value: 'Certificate',
    }, {
      value: 'Provisional Degree',
    }, {
      value: 'Degree',
    }, {
      value: 'Marksheet',
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

      <ScrollView keyboardShouldPersistTaps="always">
      <ProfileNavigation prevCount={3} nextCount={3} formName={"Academic"} iconName={"graduation-cap"} 
      prevLink={"AddressForm"} nextLink={"EmploymentInfo"} navigate={this.props.navigation.navigate} />

        <View style={styles.titleContainer}>
          <Text style={styles.heading}>ACADEMIC INFORMATION</Text>
          <View style={styles.headingLine}>
          </View>          
        </View>

          {this.props.academicsDetails
          ?
            this.props.addressType == "Basic"
            ?
              <View style={styles.formContainer}>
                <EducationForm 
                  navigation={this.props.navigation}
                  academicsValues={this.props.academicsDetails}
                  index={this.props.index}
                />
              </View> 
            :
                <ProfessionalEduForm 
                  navigation={this.props.navigation}
                  professionalAcademicsValues={this.props.academicsDetails}
                  index={this.props.index}
                />
          :
            <View style={styles.formContainer}>
              <EducationForm 
                navigation={this.props.navigation}
                goBack={this.props.goBack}
              />
              <View style={{flexDirection:'row'}}>
                <View style={{flex:0.5}}>
                  <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('ViewProfile')}>
                    <Icon name="chevrons-left" type="feather" color="#aaa" />
                    <Text style={{textDecorationLine:'underline'}}>Go to Profile</Text>
                  </TouchableOpacity>
                </View>

                <View style={{flex:0.5,alignItems:'flex-end'}}>
                  <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('EmploymentInfo')}>
                    <Text style={{textDecorationLine:'underline'}}>Go Next</Text>
                    <Icon name="chevrons-right" type="feather" color="#aaa" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.assignBreak}></View>
            
              <TouchableOpacity onPress={this.handleCollapse} style={styles.collapseHeader}>
                <Text>Professional Qualification Information [Only in the case of IIT, CA, ICWAI, CS, MBBS etc]</Text>         
                <Icon size={20} name='chevron-thin-down' type='entypo' color='#000' />
              </TouchableOpacity>

              <Collapsible collapsed={!this.state.isCollapsed}>
                <ProfessionalEduForm 
                  navigation={this.props.navigation}
                  goBack={this.props.goBack}
                />
              </Collapsible>
            </View>
          }
          
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
  const basicProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"education","proofSubtype": 'basicEducation'})|| {};
  const editBasicProofObj= Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"education","proofSubtype": 'editBasicEducation'})|| {};

  const { state } = props.navigation;

  if(state.params){
    if(state.params.academicsDetails){
      var academicsDetails = state.params.academicsDetails;
      if(academicsDetails){
        var imagePath = academicsDetails.proofOfDocument;
        var splitPath = imagePath.split(':');
        if(splitPath[0] == 'http'){
          academicsDetails.proofOfDocument = "https:"+splitPath[1];
        }else{
          academicsDetails.proofOfDocument = academicsDetails.proofOfDocument;           
        }
      }

      var index = state.params.index;
      var addressType = state.params.addressType;
      // var profileId = state.params.profileId;
    }
    if(state.params.goBack){
      var goBack = state.params.goBack;
    }
  }

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  
  if(academicsDetails){
    var imagePath = academicsDetails.proofOfDocument;
    var splitImage = imagePath.split(":");
    if(splitImage[0] == "http"){
      academicsDetails.proofOfDocument = "https:"+splitImage[1];
    }
  }
  
  
  return{
    userProfileData,
    loading,
    s3Data,
    basicProofObj,
    editBasicProofObj,
    academicsDetails,
    index,
    addressType,
    goBack,
    notificationCount
  }

}, AcademicForm);