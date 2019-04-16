import React, { Component } from "react";
import Meteor, {createContainer} from 'react-native-meteor';
import { View, Text } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { TouchableOpacity,ScrollView, BackAndroid, StyleSheet, BackHandler, Alert, Image } from 'react-native';
import { Header,Button,Icon } from 'react-native-elements';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import SideMenu from 'react-native-side-menu';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Dropdown } from 'react-native-material-dropdown';
import { RNS3 } from 'react-native-aws3';

import Menu from '../../components/Menu/Menu.js';
import styles from './styles.js';
import ProfileNavigation from './ProfileNavigation.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import PermanentAddressForm from './PermanentAddressForm.js';
import CurrentAddressForm from './CurrentAddressForm.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class AddressForm extends React.Component{

  constructor(props){
    super(props);
    if(this.props.addressDetails){
      var finalImage="";
      var imagePath  = this.props.addressDetails.proofOfDocument;
      var splitImage = imagePath.split(":");
      if(splitImage[0] == "http"){
         finalImage = "https:"+splitImage[1];
      }else{
         finalImage = this.props.addressDetails.proofOfDocument;
      }
      

      if(this.props.addressDetails.tempresidingTo == 'Present'){
        var showRadio       = true;
        var tempresidingTo  = '';
      }else{
        var showRadio       = false;
        var tempresidingTo  = this.props.addressDetails.tempresidingTo;
      }
      var currAddrValues = {
        currentAddressId  : this.props.addressDetails.currentAddressId,
        currLine1         : this.props.addressDetails.tempLine1,
        currLine2         : this.props.addressDetails.tempLine2,
        currLine3         : this.props.addressDetails.tempLine3,
        currLandmark      : this.props.addressDetails.tempLandmark,
        currCity          : this.props.addressDetails.tempCity,
        currState         : this.props.addressDetails.tempState,
        currCounrty       : this.props.addressDetails.tempCountry,
        currPincode       : this.props.addressDetails.tempPincode,
        currResidingFrom  : this.props.addressDetails.tempresidingFrom,
        currResidingTo    : tempresidingTo,
        currShowRadio     : showRadio,
        currentProofType  : this.props.addressDetails.proofType,
        proofOfDocument   : finalImage,
        fileName          : this.props.addressDetails.fileName,
        fileExt           : this.props.addressDetails.fileExt,
        verifiedStatus    : this.props.addressDetails.verifiedStatus,
        editStatus        : this.props.addressDetails.editStatus,
      }
    }else{
      var currAddrValues = {
        currLine1         : '',
        currLine2         : '',
        currLine3         : '',
        currLandmark      : '',
        currCity          : '',
        currState         : '',
        currCounrty       : 'India',
        currPincode       : '',
        currResidingFrom  : '',
        currResidingTo    : '',
        currShowRadio     : true,
        currentProofType  : '',
      }
    }
    this.state={
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      fontSize        : 15,
      effectiveDate   : '',
      currAddrValues  : currAddrValues,
    };
    this.toggle = this.toggle.bind(this);
    this.setCurrentAddrValues = this.setCurrentAddrValues.bind(this);
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

  handleClick = () =>{
    this.setState({
      'sameAsPermanent' : !this.state.sameAsPermanent,
    });
  }

  closeControlPanel = () => {
    this._drawer.close()
  }
  openControlPanel = () => {
    this._drawer.open()
  }

  residingToChange = (value,stateName) =>{
    // 
    if(value == 'toggleToDate'){
      this.setState({
        [stateName]     : !this.state[stateName],
      });
    }
  }

  setCurrentAddrValues = (values) => {
    // 
    this.setState({
      currAddrValues : values,
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

    AddrProofType = [{
      value : 'Aadhar Card',
    },{
      value : 'Driving License',
    },{
      value : 'Pancard',
    },{
      value : 'Passport',
    },{
      value : 'Voting Card',
    },{
      value : 'Ration Card',
    },{
      value : 'Electric Bill',
    }];

    return (
    
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
      <ProfileNavigation prevCount={2} nextCount={4} formName={"Address"} iconName={"map-marker"} 
       prevLink={"StatutoryForm"} nextLink={"AcademicForm"} navigate={this.props.navigation.navigate} />

        {/*<View style={{flex:1, backgroundColor:'#bbb',alignItems:'center',padding:20}}>
          <Text>Basic Form</Text>
        </View>*/}

        <View style={styles.titleContainer}>
          <Text style={styles.heading}>ADDRESS INFORMATION</Text>
          <View style={styles.headingLine}>
          </View>          
        </View>

        <View style={{paddingBottom:10,backgroundColor:'#fff'}}> 

        {this.props.addressDetails 
        ?
          this.props.addressType == 'Current'
          ?
            <CurrentAddressForm  
              navigation={this.props.navigation}
              residingToChange={this.residingToChange}
              addressValues={this.state.currAddrValues}
              index={this.props.index}
              profileId={this.props.profileId}
            /> 
          :
            <PermanentAddressForm  
              navigation={this.props.navigation}
              residingToChange={this.residingToChange}
              setValues={this.setCurrentAddrValues}
              index={this.props.index}
              addressValues={this.props.addressDetails}
              profileId={this.props.profileId}
            />   
        :
          <View>
          <PermanentAddressForm  
            navigation={this.props.navigation}
            residingToChange={this.residingToChange}
            setValues={this.setCurrentAddrValues}
            goBack={this.props.goBack}
          />

          <CurrentAddressForm  
            navigation={this.props.navigation}
            residingToChange={this.residingToChange}
            addressValues={this.state.currAddrValues}
            goBack={this.props.goBack}
          />
          </View>
        }

          <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('ViewProfile')}>
                <Icon name="chevrons-left" type="feather" color="#aaa" />
                <Text style={{textDecorationLine:'underline'}}>Go to Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={{flex:0.5,alignItems:'flex-end'}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('AcademicForm')}>
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

  // var userId            = Meteor.userId();
  // const postHandle      = Meteor.subscribe('userprofile',userId);
  // const loading         = postHandle.ready();
  // const userProfileData = Meteor.collection('userProfile').findOne({'userId':userId}) || {};
  // 

  // const postHandle1     = Meteor.subscribe('projectSettingsPublish');
  // const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  // const postHandle2     = Meteor.subscribe('TempProofDocs',userId);
  // const imgLoading      = postHandle2.ready();
  // const permProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
  // const currProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};

  const { state } = props.navigation;

  if(state.params){
    if(state.params.addressDetails){
      var addressDetails = state.params.addressDetails;
      
      var imagePath  = addressDetails.proofOfDocument;
      var splitImage = imagePath.split(":");
      if(splitImage[0] == "http"){
        addressDetails.proofOfDocument = "https:"+splitImage[1];
      }
      
      var index = state.params.index;
      var addressType = state.params.addressType;
      var profileId = state.params.profileId;
    }
    if(state.params.goBack){
      var goBack = state.params.goBack;
    }
  }

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;

  return{
    goBack,
    addressDetails,
    index,
    addressType,
    profileId,
    notificationCount
  }

}, AddressForm);
