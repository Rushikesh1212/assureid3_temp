import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, Keyboard} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import DatePicker from 'react-native-datepicker';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Dropdown } from 'react-native-material-dropdown';
import { RNS3 } from 'react-native-aws3';
import CheckBox from 'react-native-check-box';
import Moment from 'moment';
import ValidationComponent from 'react-native-form-validator';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';


class CurrentAddressForm extends ValidationComponent {
  constructor(props){
    super(props);

    this.state ={
      isOpen            : false,
      selectedItem      : 'About',
      inputFocusColor   : '#00b8FF',
      fontSize          : 15,
      currLine1         : '',
      currLine2         : '',
      currLine3         : '',
      currLandmark      : '',
      currCity          : '',
      currState         : '',
      currCounrty       : '',
      currPincode       : '',
      currResidingFrom  : '',
      currResidingTo    : '',
      currShowRadio     : true,
      currentProofType  : '',
      sameAsPermanent : false,
      data : {
        currLine1         : '',
        currLine2         : '',
        currLine3         : '',
        currLandmark      : '',
        currCity          : '',
        currState         : '',
        currCounrty       : '',
        currPincode       : '',
        currResidingFrom  : '',
        currResidingTo    : '',
        currShowRadio     : true,
        currentProofType  : '',
      },
      currLine1Error       : '',
      currLandmarkError    : '',
      currCityError        : '',
      currStateError       : '',
      currCounrtyError     : '',
      currPincodeError     : '',
      currResidingFromError: '',
      test:'',
    };


  }

  componentWillReceiveProps(nextProps){
    
    // 
    if(nextProps.addressValues){
      // 
      this.setState({
        data              : nextProps.addressValues,
        currLine1         : nextProps.addressValues.currLine1,
        currLine2         : nextProps.addressValues.currLine2,
        currLine3         : nextProps.addressValues.currLine3,
        currLandmark      : nextProps.addressValues.currLandmark,
        currCity          : nextProps.addressValues.currCity,
        currState         : nextProps.addressValues.currState,
        currCounrty       : nextProps.addressValues.currCounrty,
        currPincode       : nextProps.addressValues.currPincode,
        currResidingFrom  : nextProps.addressValues.currResidingFrom,
        currResidingTo    : nextProps.addressValues.currResidingTo,
        currShowRadio     : nextProps.addressValues.currShowRadio,
        currentProofType  : nextProps.addressValues.currentProofType,
      });

      var imagePath  = nextProps.addressValues.proofOfDocument;
      var splitImage = imagePath.split(":");
      if(splitImage[0] == "http"){
        nextProps.addressValues.proofOfDocument = "https:"+splitImage[1];
      }else{
        nextProps.addressValues.proofOfDocument = nextProps.addressValues.proofOfDocument;
      }

      
    }
  }



  saveCurrentAddr = () =>{
    Keyboard.dismiss();

    var userId = Meteor.userId();
    
    if(this.props.currProofObj){
      if(this.props.currProofObj.proofSubtype == 'currentAddress'){
        var fileLink  = this.props.currProofObj.imageLink;
        var fileName  = this.props.currProofObj.name;
        var fileExt   = this.props.currProofObj.ext;
        var imgId     = this.props.currProofObj._id;
      }else{
        var fileLink  = '';
        var fileName  = '';
        var fileExt   = '';
      }
    } else{
      var fileLink  = '';
      var fileName  = '';
      var fileExt   = '';
    }

    var currResidingTo = this.state.data.currShowRadio ? 'Present' : this.state.data.currResidingTo;

    var addressObj = Meteor.collection('userProfile').findOne({}, {sort: {'currentAddress.currentAddressId': -1}});
    if(addressObj){
      if (addressObj.currentAddress) {
        if (addressObj.currentAddress.length > 0) {
           // var lastelem           = _.last(addressObj.permanentAddress);
          var lastelem = addressObj.currentAddress[addressObj.currentAddress.length-1];
          var currentAddressId =  parseInt(lastelem.currentAddressId) + 1;
        }else{
          var currentAddressId =  1;
        }
      }
      else{
        var currentAddressId =  1;
      }
    }

    var formValues = {
      'currentAddressId'  : currentAddressId,
      'tempLine1'         : this.state.data.currLine1,
      'tempLine2'         : this.state.data.currLine2,
      'tempLine3'         : this.state.data.currLine3,
      'tempLandmark'      : this.state.data.currLandmark,
      'tempCity'          : this.state.data.currCity,
      'tempState'         : this.state.data.currState,
      'tempCountry'       : this.state.data.currCounrty,
      'tempPincode'       : this.state.data.currPincode,
      'tempresidingFrom'  : this.state.data.currResidingFrom,
      'tempresidingTo'    : currResidingTo,
      'proofType'         : this.state.data.currentProofType,
      "createdAt"         : new Date(),
      "proofOfDocument"   : fileLink,
      "fileName"          : fileName,
      "fileExt"           : fileExt,
      "verifiedStatus"    : "Not Verified",
      "editStatus"        : "Open"
    }

    

    if(this.validInput()){
      Meteor.call("insertTemporaryAddress",userId,formValues,(error,result) =>{
        if(error){
          
          Alert.alert(
            'Error',
          )
        }else{
          
          Alert.alert(
            '','Current Address details have been saved!',
          );
          this.state.data.currLine1 = '';
          this.state.data.currLine2 = '';
          this.state.data.currLine3 = '';
          this.state.data.currLandmark = '';
          this.state.data.currCounrty = 'India';
          this.state.data.currState = '';
          this.state.data.currCity = '';
          this.state.data.currPincode = '';
          this.state.data.currResidingFrom = '';
          this.state.data.currResidingTo = '';
          this.state.data.currShowRadio = true;
          this.state.data.currentProofType = '';

          // if(this.props.goBack){
          //   this.props.navigation.goBack(null);
          // }
          // this.props.navigation.navigate('AcademicForm');
        }
      });
      if(imgId != ''){
        Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
          if (error) {
           
          }else{  
          }
        });   
      }
    }
    
  }

  editCurrentAddr = () =>{
    Keyboard.dismiss();
    
    var id                = this.props.profileId;
    var index             = this.props.index;
    var currentAddressId  = this.props.addressValues.currentAddressId;
    var editstatus        = this.props.addressValues.editStatus;
    var userId            = Meteor.userId();


    if(this.props.addressValues){
      if(this.props.addressValues.proofOfDocument){
        var imgLink = this.props.addressValues.proofOfDocument;
        var fileName = this.props.addressValues.fileName;
        var fileExt = this.props.addressValues.fileExt;
      }else if(this.props.editCurrProofObj.imageLink){
        
        var imgLink = this.props.editCurrProofObj.imageLink;
        var fileName = this.props.editCurrProofObj.name;
        var fileExt = this.props.editCurrProofObj.ext;
        var imgId = this.props.editCurrProofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.currProofObj.imageLink){
      var imgLink = this.props.currProofObj.imageLink;
      var fileName = this.props.currProofObj.name;
      var fileExt = this.props.currProofObj.ext;
      var imgId = this.props.currProofObj._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }

    var currResidingTo = this.state.data.currShowRadio ? 'Present' : this.state.data.currResidingTo;

    var formValues = {
      "currentAddressId"   : parseInt(currentAddressId),
      "tempLine1"          : this.state.data.currLine1,
      "tempLine2"          : this.state.data.currLine2,
      "tempLine3"          : this.state.data.currLine3,
      "tempLandmark"       : this.state.data.currLandmark,
      "tempCity"           : this.state.data.currCity,
      "tempState"          : this.state.data.currState,
      "tempCountry"        : this.state.data.currCounrty,
      "tempPincode"        : this.state.data.currPincode,
      "tempresidingFrom"   : this.state.data.currResidingFrom,
      "tempresidingTo"     : currResidingTo,
      "proofType"          : this.state.data.currentProofType,
      "createdAt"          : new Date(),
      "proofOfDocument"    : imgLink,
      "fileName"           : fileName,
      "fileExt"            : fileExt,
      "verifiedStatus"     : "Not Verified",
      "editStatus"         : "Open",
    };

    
    
    

    if(this.validInput()){
      Meteor.call('editCurrentAddress',id,currentAddressId,formValues, (error,result) =>{
        if(error){
          
        }else{
          Alert.alert(
            '','Address details updated successfully!',
          );

          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             
            }else{  
            }
          }); 
          if (editstatus == "Reopen") {
             Meteor.call('updateTicketAfterReopen',userId,"currentAddress",currentAddressId,selectedAddress); 
          }

          this.state.data.currLine1 = '';
          this.state.data.currLine2 = '';
          this.state.data.currLine3 = '';
          this.state.data.currLandmark = '';
          this.state.data.currCounrty = 'India';
          this.state.data.currState = '';
          this.state.data.currCity = '';
          this.state.data.currPincode = '';
          this.state.data.currResidingFrom = '';
          this.state.data.currResidingTo = '';
          this.state.data.currShowRadio = true;
          this.state.data.currentProofType = '';

          this.props.navigation.goBack(null);      
        }
      });
    }
  } 

  removeProofDocs(imageLink,subtype,fileName='',fileExt='',index=-1){
    if(index >= 0){
      Meteor.call("removeTempDocProofs",imageLink,fileName,fileExt,index,subtype,(error, result)=>{
        if (error) {
         
        }else{
          
          this.props.addressValues.proofOfDocument='';
          this.props.addressValues.fileName='';
          this.props.addressValues.fileExt='';
        }
      });
    }else{
      Meteor.call("removeTempProofDocs",imageLink,(error,result) =>{
        if(error){
          
          Alert.alert(
            'Error',
          )
        }else{
          
        }
      });
    }
  }

  uploadProofDocs(proofSubtype){
    
    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;
    var prooftype = "address";

    DocumentPicker.show({ filetype : [DocumentPickerUtil.images()]},(error,res) => {
       if(res){
            // Android
            // 
            // var fileName = userId+'_'+Date.now()+'_'+res.fileName;
            var fileName = userId+'_'+res.fileName;
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
              if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
                var fileLink = response.body.postResponse.location;
                var fileDetails = {
                  name          : fileName,
                  ext           : fileExt,
                  link          : fileLink,
                }
                            
                Meteor.call("insertAddressTempProofDocs",userId,fileDetails,prooftype,proofSubtype,(error,result) =>{
                  if(error){
                    
                    Alert.alert(
                      'Error',
                    )
                  }else{
                    
                  }
                });
            }).catch((error) => console.log("Handled Exceptions image ",error));
        }
    });
                          
  }

  residingToChange = (value,stateName) =>{
    
    if(value == 'toggleToDate'){
      // this.setState({
      //   data.currShowRadio : !this.state.data.currShowRadio,
      // });
      this.state.data.currShowRadio = !this.state.data.currShowRadio;
      this.setState({});
    }
  }

  handleClick = () =>{
    this.setState({
      'sameAsPermanent' : !this.state.sameAsPermanent,
    });
  }

  validInput = () => {
    var valid = true;

    if(this.state.data.currLine1 == ''){
      this.setState({currLine1Error: ['This field is required.']});
      valid = false;
    }else{
      this.setState({currLine1Error: ''});
    }

    if(this.state.data.currLandmark == ''){
      this.setState({currLandmarkError: ['This field is required.']});
      valid = false;
    }else{
      this.setState({currLandmarkError: ''});
    }

    if(this.state.data.currCity.match(/^[a-zA-Z ]+$|^$/)){
      this.setState({currCityError: ''});
    }else{
      this.setState({currCityError: ['It should only contain letters.']});
      valid = false;
    }

    if(this.state.data.currState.match(/^[a-zA-Z ]+$|^$/)){
      this.setState({currStateError: ''});
    }else{
      this.setState({currStateError: ['It should only contain letters.']});
      valid = false;
    }    

    if(this.state.data.currCounrty.match(/^[a-zA-Z ]+$|^$/)){
      this.setState({currCounrtyError: ''});
    }else{
      this.setState({currCounrtyError: ['It should only contain letters.']});
      valid = false;
    }

    if(this.state.data.currPincode == ''){
      this.setState({currPincodeError: ['This field is required.']});
      valid = false;
    }else if(this.state.data.currPincode.match(/^[1-9][0-9]{5}$|^$/)){
      this.setState({currPincodeError: ''});
    }else{
      this.setState({currPincodeError: ['Enter a valid pincode.']});
      valid = false;
    }

    if(this.state.data.currResidingFrom == ''){
      this.setState({currResidingFromError: ['This field is required.']});
      valid = false;
    }else{
      this.setState({currResidingFromError: ''});
    }

    return valid;
  }

  render(){

    return(
      <View style={{backgroundColor:'#fff',width:'100%',alignItems: 'center',justifyContent: 'center',paddingHorizontal:10}}>
        
        {this.props.index ?
          <Text style={{fontWeight:'bold'}}>Current Address</Text>
        :
          null
        }
          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Line1 *'
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
                onChangeText          = {(currLine1) => {
                                                            this.state.data.currLine1 = currLine1;
                                                        }
                                        }
                value                 = {this.state.data.currLine1}
                error                 = {this.state.currLine1Error[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Line2'
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
                onChangeText          = {(currLine2) => {
                                                            this.state.data.currLine2 = currLine2;
                                                        }
                                        }
                value                 = {this.state.data.currLine2}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Line3'
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
                onChangeText          = {(currLine3) => {
                                                            this.state.data.currLine3 = currLine3;
                                                        }
                                        }
                value                 = {this.state.data.currLine3}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Landmark *'
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
                onChangeText          = {(currLandmark) => {
                                                            this.state.data.currLandmark = currLandmark;
                                                        }
                                        }
                value                 = {this.state.data.currLandmark}
                error                 = {this.state.currLandmarkError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "Country"
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
                onChangeText          = {(currCounrty) => {
                                                            this.state.data.currCounrty = currCounrty;
                                                        }
                                        }
                value                 = {this.state.data.currCounrty}
                error                 = {this.state.currCounrtyError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "State"
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
                onChangeText          = {(currState) => {
                                                            this.state.data.currState = currState;
                                                        }
                                        }
                value                 = {this.state.data.currState}
                error                 = {this.state.currStateError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <TextField
                label                 = "City"
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
                onChangeText          = {(currCity) => {
                                                            this.state.data.currCity = currCity;
                                                        }
                                        }
                value                 = {this.state.data.currCity}
                error                 = {this.state.currCityError[0]}
              />
            </View>

            <View style={styles.formInputView}>
              <TextField
                label                 = "Pincode *"
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
                onChangeText          = {(currPincode) => {
                                                            this.state.data.currPincode = currPincode;
                                                        }
                                        }
                value                 = {this.state.data.currPincode}
                error                 = {this.state.currPincodeError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <Text style={this.state.currResidingFromError?{color:'rgb(213, 0, 0)'}:{}}>Residing From *</Text>
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
                  onDateChange          = {(date) => 
                                            {
                                              
                                              this.state.data.currResidingFrom = date;
                                              this.setState({});
                                            }
                                          }
                  date                  = {this.state.data.currResidingFrom}
                />
                {this.state.currResidingFromError?
                  <View style={{paddingTop:5}}>
                    <Text style={styles.errorText}>{this.state.currResidingFromError[0]}</Text>
                  </View>
                :
                  null
                }
            </View>

            {this.state.data.currShowRadio
            ?
              <View style={styles.formInputView}>
                <Text>Residing To</Text>
                <RadioGroup
                  size={20}
                  color='#00b8FF'
                  thickness={2}
                  selectedIndex={0}
                  style={{flex:0.7,flexDirection:'column',justifyContent:"space-around",backgroundColor:'#fff'}}
                  onSelect = {(index, value) => this.residingToChange(value,'currShowRadio')}
                >
                  <RadioButton style={{paddingVertical:5, paddingHorizontal:0, padding:0}} value={'present'} >
                    <Text>Still living here</Text>
                  </RadioButton>
           
                  <RadioButton style={{paddingHorizontal:0, padding:0}} value={'toggleToDate'}>
                    <Text>Select to date</Text>
                  </RadioButton>
    
                </RadioGroup>
              </View>
            :
              <View style={styles.formInputView}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text>Residing To</Text>
                  <Icon 
                    name           = "angle-double-right" 
                    type           = "font-awesome"
                    containerStyle = {{alignSelf:'flex-end'}}
                    color          = "#000"
                    size           = {22}
                    onPress        = {()=>this.residingToChange('toggleToDate','currShowRadio')}
                    underlayColor  = {'transparent'}
                  />                  
                </View>
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
                  date                  = {this.state.data.currResidingTo}
                  onDateChange          = {(currResidingTo) => 
                                            {
                                              this.state.data.currResidingTo = currResidingTo;
                                              this.setState({});
                                            }
                                          }
                />
              </View>
            }

            
          </View>
          
          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <Text>Address Proof Type</Text>
              <Dropdown
                label                 = ''
                data                  = {AddrProofType}
                inputContainerStyle   = {styles.dropdownInput}
                inputContainerPadding = {0}
                labelHeight           = {16}
                onChangeText          = {(currentProofType) => 
                                          {
                                            this.state.data.currentProofType = currentProofType;
                                          }
                                        }
                value                 = {this.state.data.currentProofType}
              />
            </View>

            <View style={styles.formInputView}>
              <Text>Proof of Address</Text>
              {!this.props.currProofObj.imageLink && !this.props.index 
              ?
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonBrowse}
                  onPress     = {()=>this.uploadProofDocs("currentAddress")}
                />
              :
                this.props.index 
                ?
                  this.props.addressValues.proofOfDocument 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.addressValues.proofOfDocument}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.addressValues.proofOfDocument,"editCurrentAddress",this.props.addressValues.fileName,this.props.addressValues.fileExt,this.props.index)}
                      />   
                    </View>
                  :
                    this.props.editCurrProofObj.imageLink 
                    ?
                      <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                        <Image
                            resizeMode="stretch"
                            source={{uri: this.props.editCurrProofObj.imageLink}} 
                            style={{ width:'100%', height: 120, zIndex:-1 }}
                        />
                        <Icon 
                          name           = "close" 
                          type           = "font-awesome"
                          containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                          onPress        = {()=>this.removeProofDocs(this.props.editCurrProofObj._id,"editCurrentAddress")}
                        />   
                      </View>
                    :
                      <Button
                        textStyle   = {{textAlign:'center'}}
                        title       = "Browse"
                        buttonStyle = {styles.buttonBrowse}
                        onPress     = {()=>this.uploadProofDocs("editCurrentAddress")}
                      />
                :
                  this.props.currProofObj.imageLink 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.currProofObj.imageLink}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.currProofObj._id,"editCurrentAddress")}
                      />   
                    </View>
                  :
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonBrowse}
                      onPress     = {()=>this.uploadProofDocs("currentAddress")}
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
                onPress     = {this.props.index ? this.editCurrentAddr : this.saveCurrentAddr}
              />
            </View>
          </View>  

      </View>      
    );
  }
}
export default createContainer((props) => {
  var userId            = Meteor.userId();
  const postHandle      = Meteor.subscribe('userprofile',userId);
  const loading         = postHandle.ready();
  const userProfileData = Meteor.collection('userProfile').findOne({'userId':userId}) || {};

  const postHandle1     = Meteor.subscribe('projectSettingsPublish');
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  const postHandle2     = Meteor.subscribe('TempProofDocs',userId);
  const imgLoading      = postHandle2.ready();
  const permProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
  const currProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
  const editCurrProofObj= Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'editCurrentAddress'})|| {};

  const { state } = props.navigation;

  return{
    userProfileData,
    loading,
    s3Data,
    permProofObj,
    currProofObj,
    editCurrProofObj,
  }
}, CurrentAddressForm);


// CurrentAddressForm.defaultProps = {
//   messages: {
//     en: {
//       required: 'This field is required.',
//       letters: 'It should only contain letters.',
//       pincode: 'Enter a valid pincode.'
//     }
//   },

//   rules: {
//     required: /\S+/,
//     letters: /^[a-zA-Z ]+$|^$/,
//     pincode: /^[1-9][0-9]{5}$|^$/,
//   },
// }