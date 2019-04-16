import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid, Dimensions, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import DatePicker from 'react-native-datepicker';
import { RNS3 } from 'react-native-aws3';
import { Picker } from 'react-native-picker-dropdown';
import Drawer from 'react-native-drawer';
import ValidationComponent from 'react-native-form-validator';

import HeaderDy from '../../components/HeaderDy/HeaderDy.js';

import { Dropdown } from 'react-native-material-dropdown';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import ProfileNavigation from './ProfileNavigation.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class BasicForm extends ValidationComponent {
  constructor(props){
    super(props);
    let name = "";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state = {
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      fontSize        : 14,
      effectiveDate   : '',

      firstName       : '',
      lastName        : '',
      fatherFirstName : '',
      fatherLastName  : '',
      motherFirstName : '',
      motherLastName  : '',
      spouseFirstName : '',
      spouseLastName  : '',
      gender          : '',
      dateOfBirth     : '',
      mobileNo        : '',
      altMobileNo     : '',
      emailId         : '',
      altEmailId      : '',
      typeOfProof     : '',
      firstNameError  : '',
      lastNameError   : '',
      fatherFirstNameError: '',
      fatherLastNameError:'',
      motherFirstNameError: '',
      motherLastNameError: '',
      spouseFirstNameError: '',
      spouseLastNameError: '',
      altMobileNoError: [],
      altEmailIdError: [],
    };
    this.openDrawer  = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle      = this.toggle.bind(this);
    // this.handleView  = this.handleView.bind(this);
    this.browseFile  = this.browseFile.bind(this);

    this.handleSave  = this.handleSave.bind(this);
  }

  componentWillReceiveProps(nextProps){
    console.log("inside basic componentWillReceiveProps.... loading => ",this.props.loading);

    if(nextProps.loading){
      if(nextProps.userProfileData){
        this.setState({
          firstName       : nextProps.userProfileData.firstName,
          lastName        : nextProps.userProfileData.lastName,
          fatherFirstName : nextProps.userProfileData.fatherFirstName,
          fatherLastName  : nextProps.userProfileData.fatherLastName,
          motherFirstName : nextProps.userProfileData.motherFirstName,
          motherLastName  : nextProps.userProfileData.motherLastName,
          spouseFirstName : nextProps.userProfileData.spouseFirstName,
          spouseLastName  : nextProps.userProfileData.spouseLastName,
          gender          : nextProps.userProfileData.gender,
          typeOfProof     : nextProps.userProfileData.proofType,
          dateOfBirth     : nextProps.userProfileData.dateOfBirth,
          mobileNo        : nextProps.userProfileData.mobileNo,
          altMobileNo     : nextProps.userProfileData.altMobileNo,
          emailId         : nextProps.userProfileData.emailId,
          altEmailId      : nextProps.userProfileData.altEmailId,
        });
      }
    }
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler(){
    console.log('androidBackHandler: ',this.props.navigation );
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
  }

  toggle() {
    console.log('is open ' + this.state.isOpen);
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
    console.log('Logout function!');
    Meteor.logout();
    Actions.LogIn();
  }
  openDrawer(){
    console.log('opening drawer!');
          this.drawer.openDrawer();
  }
  closeDrawer(){
    console.log('opening drawer!');
          this.drawer.closeDrawer();
  }

  browseFile(event){
    event.preventDefault();
    var id = Meteor.userId();
    var s3Data = this.props.s3Data;

    DocumentPicker.show({ filetype : [DocumentPickerUtil.images()]},(error,res) => {
      if(res){
                          // Android
                          // console.log("Result:: ",res);
                          var fileName = id+'_'+Date.now()+'_'+res.fileName;
                          // var fileName = id+'_'+res.fileName;
                          var fileExt = fileName.split('.').pop();  

                          var file = {
                            uri   : res.uri,
                            name  : fileName,
                            type  : res.type,
                          }
                          
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
                            
                            var fileLocation = response.body.postResponse.location;
                            var fileDetails = {
                              fileName      : fileName,
                              fileExt       : fileExt,
                              fileLocation  : fileLocation,
                            }
                            // console.log("fileDetails = ",fileDetails);

                            Meteor.call("insertBasicProofDoc",fileDetails,(error,result) =>{
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


  handleSave = () => {
    Keyboard.dismiss();

    var userId = Meteor.userId();
    var proofDocumentLink = '';

    var formValues = {
      'userId'          : userId,
      'firstName'       : this.state.firstName,
      'lastName'        : this.state.lastName,
      'fatherFirstName' : this.state.fatherFirstName,
      'fatherLastName'  : this.state.fatherLastName,
      'motherFirstName' : this.state.motherFirstName,
      'motherLastName'  : this.state.motherLastName,
      'spouseFirstName' : this.state.spouseFirstName,
      'spouseLastName'  : this.state.spouseLastName,
      'gender'          : this.state.gender,
      'dateOfBirth'     : this.state.dateOfBirth,
      'mobileNo'        : this.state.mobileNo,
      'altMobileNo'     : this.state.altMobileNo,
      'emailId'         : this.state.emailId,
      'altEmailId'      : this.state.altEmailId,
      "proofType"       : this.state.typeOfProof,

    }

    // console.log("basic formValues = ",formValues);
    
    if(this.validInput()){
      Meteor.call("updateBasicData",userId,formValues,proofDocumentLink,(error,result) =>{
        if(error){
          console.log(error.reason);
          Alert.alert(
            'Error',
          )
        }else{
          // console.log("form submitted....");
          Alert.alert(
            '','Basic Information has been saved!'
          )
          // this.props.navigate('StatutoryForm');
        }
      });  
    }
    
  }

  removeFile = () => {
    Meteor.call("removeBasicProof",(error,result) =>{
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

  closeControlPanel = () => {
    this._drawer.close()
  }
  openControlPanel = () => {
    this._drawer.open()
  }

  validInput = () => {
    var valid = true;

    this.validate({
      firstName: {required: true,letters:true},
      lastName: {required:true,letters:true},
      fatherFirstName: {lettersOrEmpty:true},
      fatherLastName: {lettersOrEmpty:true},
      motherFirstName: {lettersOrEmpty:true},
      motherLastName: {lettersOrEmpty:true},
      spouseFirstName: {lettersOrEmpty:true},
      spouseLastName: {lettersOrEmpty:true},
      altMobileNo: {mobileNo:true},
      altEmailId: {email:true},
    });

    if(this.isFieldInError("firstName")){
      let firstNameError = this.getErrorsInField('firstName');
      this.setState({firstNameError});
      valid = false;
    }else{
      this.setState({firstNameError:''});
    }
    if(this.isFieldInError("lastName")){
      let lastNameError = this.getErrorsInField('lastName');
      this.setState({lastNameError});
      valid = false;
    }else{
      this.setState({lastNameError:''});
    }
    if(this.isFieldInError("fatherFirstName")){
      let fatherFirstNameError = this.getErrorsInField('fatherFirstName');
      this.setState({fatherFirstNameError});
      valid = false;
    }else{
      this.setState({fatherFirstNameError:''});
    }
    if(this.isFieldInError("fatherLastName")){
      let fatherLastNameError = this.getErrorsInField('fatherLastName');
      this.setState({fatherLastNameError});
      valid = false;
    }else{
      this.setState({fatherLastNameError:''});
    }
    if(this.isFieldInError("motherFirstName")){
      let motherFirstNameError = this.getErrorsInField('motherFirstName');
      this.setState({motherFirstNameError});
      valid = false;
    }else{
      this.setState({motherFirstNameError:''});
    }
    if(this.isFieldInError("motherLastName")){
      let motherLastNameError = this.getErrorsInField('motherLastName');
      this.setState({motherLastNameError});
      valid = false;
    }else{
      this.setState({motherLastNameError:''});
    }
    if(this.isFieldInError("spouseFirstName")){
      let spouseFirstNameError = this.getErrorsInField('spouseFirstName');
      this.setState({spouseFirstNameError});
      valid = false;
    }else{
      this.setState({spouseFirstNameError:''});
    }
    if(this.isFieldInError("spouseLastName")){
      let spouseLastNameError = this.getErrorsInField('spouseLastName');
      this.setState({spouseLastNameError});
      valid = false;
    }else{
      this.setState({spouseLastNameError:''});
    }
    if(this.isFieldInError("altMobileNo")){
      let altMobileNoError = this.getErrorsInField('altMobileNo');
      this.setState({altMobileNoError});
      valid = false;
    }else{
      this.setState({altMobileNoError:''});
    }
    if(this.isFieldInError("altEmailId")){
      let altEmailIdError = this.getErrorsInField('altEmailId');
      this.setState({altEmailIdError});
      valid = false;
    }else{
      this.setState({altEmailIdError:''});
    }

    if(this.state.mobileNo == this.state.altMobileNo){
      // console.log("same mobile number ..............");
      let altMobileNoError = this.state.altMobileNoError;
      altMobileNoError.push('Enter different mobile number.');
      this.setState({altMobileNoError});
      valid = false;
    }

    if(this.state.emailId == this.state.altEmailId){
      // console.log("same mobile number ..............");
      let altEmailIdError = this.state.altEmailIdError;
      altEmailIdError.push('Enter different email id.');
      this.setState({altEmailIdError});
      valid = false;
    }

    return valid;
  }

  render(){
    var {userData}     = this.props;
    const {navigate}   = this.props.navigation;

    const DeviceWidth = Dimensions.get('window').width;

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

    var gender = {
      'Female':0, 'Male':1, 'Other':2,
    }

    var proofType = [{
      value : 'Birth Certificate',
    },{
      value : 'Aadhar Card',
    },{
      value : 'School Leaving Certificate',
    }];
    
    // if(this.props.loading){
    return(
      <Drawer
        ref={(ref) => this._drawer = ref}
        content={navigationView}
        // openDrawerOffset={(viewport) => viewport.width - 300}
        side="right"
        >
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
         <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>
            {/*<ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>*/}

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
        <ProfileNavigation prevCount={0} nextCount={6} formName={"Basic"} iconName={"user"} 
          prevLink={""} nextLink={"StatutoryForm"} navigate={this.props.navigation.navigate} />

        <View style={styles.titleContainer}>
          <Text style={styles.heading}>BASIC INFORMATION</Text>
          <View style={styles.headingLine}>
          </View>
        </View>
        {this.props.loading ?
          this.props.userProfileData ?
        <View style={styles.formContainer}>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = 'First Name *'
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
                onChangeText          = {(firstName) => this.setState({firstName})}
                value                 = {this.state.firstName}
                error                 = {this.state.firstNameError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = 'Last Name *'
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

                onChangeText          = {(lastName) => this.setState({lastName})}
                value                 = {this.state.lastName}
                error                 = {this.state.lastNameError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Father's First Name"
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

                onChangeText          = {(fatherFirstName) => this.setState({fatherFirstName})}
                value                 = {this.state.fatherFirstName}
                error                 = {this.state.fatherFirstNameError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "Father's Last Name"
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

                onChangeText          = {(fatherLastName) => this.setState({fatherLastName})}
                value                 = {this.state.fatherLastName}
                error                 = {this.state.fatherLastNameError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Mother's First Name"
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

                onChangeText          = {(motherFirstName) => this.setState({motherFirstName})}
                value                 = {this.state.motherFirstName}
                error                 = {this.state.motherFirstNameError[0]}

              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "Mother's Maiden Name"
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

                onChangeText          = {(motherLastName) => this.setState({motherLastName})}
                value                 = {this.state.motherLastName}
                error                 = {this.state.motherLastNameError[0]}

              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Spouse's First Name"
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

                onChangeText          = {(spouseFirstName) => this.setState({spouseFirstName})}
                value                 = {this.state.spouseFirstName}
                error                 = {this.state.spouseFirstNameError[0]}

              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "Spouse's Last Name"
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

                onChangeText          = {(spouseLastName) => this.setState({spouseLastName})}
                value                 = {this.state.spouseLastName}
                error                 = {this.state.spouseLastNameError[0]}

              />
            </View>
          </View>

          <View style={[styles.inputWrapper]}>

            <View style={{flex:0.3,backgroundColor:'#fff',justifyContent:'center'}}>
              <Text>Gender</Text>
            </View>

            <RadioGroup
              size={20}
              color='#00b8FF'
              thickness={2}
              selectedIndex = {gender[this.state.gender]}
              style={{flex:0.7,flexDirection:'row',justifyContent:"space-around",backgroundColor:'#fff'}}
              onSelect = {(index,value) => this.setState({'gender':value})}
            >
              <RadioButton style={{paddingHorizontal:0}} value={'Female'}>
                <Text>Female</Text>
              </RadioButton>
        
              <RadioButton style={{paddingHorizontal:0}} value={'Male'} >
                <Text>Male</Text>
              </RadioButton>

              <RadioButton style={{paddingHorizontal:0}} value={'Other'}>
                <Text>Other</Text>
              </RadioButton>
            </RadioGroup>

          </View>
          
          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              
              <Text >Basic Proof Type</Text>
              <Dropdown
                label                 = ''
                data                  = {proofType}
                inputContainerStyle   = {styles.dropdownInput}
                labelHeight           = {9}
                onChangeText          = {(typeOfProof) => this.setState({typeOfProof})}
                value                 = {this.state.typeOfProof}
              />
              
            </View>

          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>

              <Text >Date of Birth</Text>
              <DatePicker
                style                 = {{borderWidth:1,borderColor: '#aaa',width:'100%'}}
                mode                  = "date"
                placeholder           = "Select Date"
                format                = "L"
                minDate               = "01-01-1960"
                confirmBtnText        = "Confirm"
                cancelBtnText         = "Cancel"
                customStyles          = {{
                                         dateInput: {
                                          borderWidth: 0
                                         }
                                        }}
                date                  = {this.state.dateOfBirth}
                onDateChange          = {(date) => {this.setState({dateOfBirth: date})}}

              />
            </View>

            <View style={styles.formInputView}>
              <Text >Proof of Date of Birth</Text>
              {this.props.userProfileData.proofOfDocument 
              ?
                <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                  <Image
                      resizeMode="stretch"
                      source={{uri: this.props.userProfileData.proofOfDocument}} 
                      style={{ width:'100%', height: 120, zIndex:-1 }}
                  />
                  <Icon 
                    name           = "close" 
                    type           = "font-awesome"
                    containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                    onPress        = {this.removeFile}
                  />   
                </View>
              :
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonBrowse}
                    onPress     = {this.browseFile.bind(this)}
                  />
              }
            </View>

          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Phone No. *"
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

                onChangeText          = {(mobileNo) => this.setState({mobileNo})}
                value                 = {this.state.mobileNo}
                editable              = {false}

              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "Alternate Phone No."
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

                onChangeText          = {(altMobileNo) => this.setState({altMobileNo})}
                value                 = {this.state.altMobileNo}
                error                 = {this.state.altMobileNoError[0]}
                keyboardType="phone-pad"

              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = "Email Id *"
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

                onChangeText          = {(emailId) => this.setState({emailId})}
                value                 = {this.state.emailId}
                editable              = {false}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = "Alternate Email Id"
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

                onChangeText          = {(altEmailId) => this.setState({altEmailId})}
                value                 = {this.state.altEmailId}
                error                 = {this.state.altEmailIdError[0]}
              />
            </View>
          </View>

          <View style={{width:'100%',alignItems:'center'}}>
            <View style={styles.formInputView}>
              <Button
                textStyle   = {{textAlign:'center'}}
                title       = "Save"
                buttonStyle = {styles.buttonSubmit}
                onPress     = {this.handleSave}
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
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('StatutoryForm')}>
                <Text style={{textDecorationLine:'underline'}}>Go Next</Text>
                <Icon name="chevrons-right" type="feather" color="#aaa" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
          :           
            <Loading />
        :
          <Loading />
        }
      </ScrollView>
      </View>
      </SideMenu>
      </Drawer>
    );
    // } else {
    //   return(<Loading />);
    // }
  }
}

export default createContainer((props) => {

  var userId            = Meteor.userId();
  const postHandle      = Meteor.subscribe('userprofile',userId);
  const loading         = postHandle.ready();
  // console.log("createContainer loading => ",loading);
  const userProfileData = Meteor.collection('userProfile').findOne({'userId':userId}) || {};

  const postHandle1     = Meteor.subscribe('projectSettingsPublish');
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  return{
    userProfileData,
    loading,
    s3Data,
    notificationCount
  }

}, BasicForm);

BasicForm.defaultProps = {
  messages: {
    en: {
      numbers: 'This field must be a number.',
      email: 'Enter a valid email address',
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      mobileNo: 'Enter a valid mobile number.',
      lettersOrEmpty: 'It should only contain letters.',
    }
  },

  rules: {
    numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$|^$/,
    required: /\S+/,
    letters: /^[a-zA-Z ]+$/,
    lettersOrEmpty: /^[a-zA-Z ]+$|^$/,
    mobileNo: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
  },
}
