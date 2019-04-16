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


class PermanentAddressForm extends ValidationComponent {
  constructor(props){
    super(props);

    if(this.props.addressValues){
      // console.log("permanentAddress values ==== ",this.props.addressValues);
      var imagePath  = this.props.addressValues.proofOfDocument;
      var splitImage = imagePath.split(":");
      if(splitImage[0] == "http"){
        this.props.addressValues.proofOfDocument = "https:"+splitImage[1];
      }else{
        this.props.addressValues.proofOfDocument = this.props.addressValues.proofOfDocument;
      }  
      if(this.props.addressValues.residingTo == 'Present'){
        var showRadio       = true;
        var permResidingTo  = '';
      }else{
        var showRadio       = false;
        var permResidingTo  = this.props.addressValues.residingTo;
      }

      var stateObj = {
        'permanentAddressId' : this.props.addressValues.permanentAddressId,
        'permLine1'          : this.props.addressValues.line1,
        'permLine2'          : this.props.addressValues.line2,
        'permLine3'          : this.props.addressValues.line3,
        'permLandmark'       : this.props.addressValues.landmark, 
        'permCity'           : this.props.addressValues.city,
        'permState'          : this.props.addressValues.state, 
        'permCountry'        : this.props.addressValues.country,
        'permPincode'        : this.props.addressValues.pincode,
        'permResidingFrom'   : this.props.addressValues.residingFrom,  
        'permResidingTo'     : permResidingTo,
        'permShowRadio'      : showRadio,
        'permanentProofType' : this.props.addressValues.proofType,
        'editStatus'         : this.props.addressValues.editStatus,
        'permLine1Error'     : '',
        'permLandmarkError'  : '',
        'permCountryError'   : '',
        'permStateError'     : '',
        'permCityError'      : '',
        'permPincodeError'   : '',
        'permResidingFromError': '',
      };
    }
    else{
      var stateObj = {
        permLine1         : '',
        permLine2         : '',
        permLine3         : '',
        permLandmark      : '',
        permCity          : '',
        permState         : '',
        permCountry       : 'India',
        permPincode       : '',
        permResidingFrom  : '',
        permResidingTo    : '',
        permShowRadio     : true,
        permanentProofType: '', 
        sameAsPermanent   : false,  
        'permLine1Error'     : '',
        'permLandmarkError'  : '',
        'permCountryError'   : '',
        'permStateError'     : '',
        'permCityError'      : '',
        'permPincodeError'   : '',
        'permResidingFromError': '',
      }
    }

    stateObj.inputFocusColor = '#00b8FF';
    stateObj.fontSize        = 15;
    this.state = stateObj;
  }

  savePermanentAddr = () =>{
    Keyboard.dismiss();

    var userId = Meteor.userId();

    if(this.props.permProofObj){
      if(this.props.permProofObj.proofSubtype == 'permanentAddress'){
        var fileLink  = this.props.permProofObj.imageLink;
        var fileName  = this.props.permProofObj.name;
        var fileExt   = this.props.permProofObj.ext;
        var imgId     = this.props.permProofObj._id;
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
    
    var permResidingTo = this.state.permShowRadio ? 'Present' : this.state.permResidingTo;

    var addressObj = Meteor.collection('userProfile').findOne({}, {sort: {'permanentAddress.permanentAddressId': -1}});
    if(addressObj){
      if (addressObj.permanentAddress) {
        if (addressObj.permanentAddress.length > 0) {
           // var lastelem           = _.last(addressObj.permanentAddress);
          var lastelem = addressObj.permanentAddress[addressObj.permanentAddress.length-1];
          var permanentAddressId =  parseInt(lastelem.permanentAddressId) + 1;
        }else{
          var permanentAddressId =  1;
        }
      }
      else{
        var permanentAddressId =  1;
      }
    }

    console.log("fileLink = ",fileLink);
    var formValues = {
      'permanentAddressId': permanentAddressId,
      'line1'             : this.state.permLine1,
      'line2'             : this.state.permLine2,
      'line3'             : this.state.permLine3,
      'landmark'          : this.state.permLandmark,
      'city'              : this.state.permCity,
      'state'             : this.state.permState,
      'country'           : this.state.permCountry,
      'pincode'           : this.state.permPincode,
      'residingFrom'      : this.state.permResidingFrom,
      'residingTo'        : permResidingTo,
      "createdAt"         : new Date(),
      'proofType'         : this.state.permanentProofType,
      "proofOfDocument"   : fileLink,
      "fileName"          : fileName,
      "fileExt"           : fileExt,
      "verifiedStatus"    : "Not Verified",
      "editStatus"        : "Open",
    }

    console.log("formValues = ",formValues);

    if(this.validInput()){
      Meteor.call("insertPermanantAddress",userId,formValues,(error,result) =>{
        if(error){
          console.log(error.reason);
          Alert.alert(
            'Error',
          )
        }else{
          console.log("form submitted....");
          Alert.alert(
            '','Permanent Address details have been saved!',
          );
          this.state.permLine1 = '';
          this.state.permLine2 = '';
          this.state.permLine3 = '';
          this.state.permLandmark = '';
          this.state.permCountry = 'India';
          this.state.permState = '';
          this.state.permCity = '';
          this.state.permPincode = '';
          this.state.permResidingFrom = '';
          this.state.permResidingTo = '';
          this.state.permShowRadio = true;
          this.state.permanentProofType = '';
          // if(this.props.goBack){
          //   this.props.navigation.goBack(null);
          // }
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

  editPermAddr = () =>{
    Keyboard.dismiss();
    
    var id                 = this.props.profileId;
    var index              = this.props.index;
    var permanentAddressId = this.props.addressValues.permanentAddressId;
    var editstatus         = this.props.addressValues.editStatus;
    var userId             = Meteor.userId();

    if(this.props.addressValues){
      if(this.props.addressValues.proofOfDocument){
        var imgLink = this.props.addressValues.proofOfDocument;
        var fileName = this.props.addressValues.fileName;
        var fileExt = this.props.addressValues.fileExt;
      }else if(this.props.editPermProofObj.imageLink){
        var imgLink = this.props.editPermProofObj.imageLink;
        var fileName = this.props.editPermProofObj.name;
        var fileExt = this.props.editPermProofObj.ext;
        var imgId = this.props.editPermProofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.permProofObj.imageLink){
      var imgLink = this.props.permProofObj.imageLink;
      var fileName = this.props.permProofObj.name;
      var fileExt = this.props.permProofObj.ext;
      var imgId = this.props.permProofObj._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }

    var permResidingTo = this.state.permShowRadio ? 'Present' : this.state.permResidingTo;

    var formValues = {
      "permanentAddressId": parseInt(permanentAddressId),
      "line1"             : this.state.permLine1,
      "line2"             : this.state.permLine2,
      "line3"             : this.state.permLine3,
      "landmark"          : this.state.permLandmark,
      "city"              : this.state.permCity, 
      "state"             : this.state.permState,
      "country"           : this.state.permCountry,
      "pincode"           : this.state.permPincode,
      "residingFrom"      : this.state.permResidingFrom,
      "residingTo"        : permResidingTo,
      "proofType"         : this.state.permanentProofType,
      "createdAt"         : new Date(),
      "proofOfDocument"   : imgLink,
      "fileName"          : fileName,
      "fileExt"           : fileExt,
      "verifiedStatus"    : "Not Verified",
      "editStatus"        : "Open",
    }

    if(this.validInput()){
      Meteor.call('editPermanantAddress',id,permanentAddressId,formValues, (error,result) => {
       if(error){
          console.log(error.reason);
        }else{
          Alert.alert(
            '','Address details updated successfully!',
          );
          
          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             console.log(error.reason);
            }else{  
            }
          }); 
          if (editstatus == "Reopen") {
            Meteor.call('updateTicketAfterReopen',userId,"permanentAddress",permanentAddressId,formValues); 
          }

          this.state.permLine1 = '';
          this.state.permLine2 = '';
          this.state.permLine3 = '';
          this.state.permLandmark = '';
          this.state.permCountry = 'India';
          this.state.permState = '';
          this.state.permCity = '';
          this.state.permPincode = '';
          this.state.permResidingFrom = '';
          this.state.permResidingTo = '';
          this.state.permShowRadio = true;
          this.state.permanentProofType = '';

          this.props.navigation.goBack(null);      
        }
      });
    }
  }

  removeProofDocs(imageLink,subtype,fileName='',fileExt='',index=-1){
    
    console.log("imageLink = ",imageLink);
    console.log("subtype = ",subtype);
    console.log("fileName = ",fileName);
    console.log("fileExt = ",fileExt);
    console.log("index = ",index);

    if(index >= 0){
      Meteor.call("removeTempDocProofs",imageLink,fileName,fileExt,index,subtype,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{
          console.log("File details1 removed.");
          this.props.addressValues.proofOfDocument='';
          this.props.addressValues.fileName='';
          this.props.addressValues.fileExt='';
        }
      });
    }else{
      Meteor.call("removeTempProofDocs",imageLink,(error,result) =>{
        if(error){
          console.log(error.reason);
          Alert.alert(
            'Error',
          )
        }else{
          console.log("File details2 removed.");
        }
      });
    }
  }

  uploadProofDocs(proofSubtype){
    console.log("proofSubtype = ",proofSubtype);
    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;
    var prooftype = "address";

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

                            Meteor.call("insertAddressTempProofDocs",userId,fileDetails,prooftype,proofSubtype,(error,result) =>{
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

  residingToChange = (value,stateName) =>{
    console.log("value = ",value);
    if(value == 'toggleToDate'){
      this.setState({
        [stateName]     : !this.state[stateName],
      });
    }
  }

  handleClick = () =>{
    console.log("handle click.......");
    console.log("sameAsPermanent = ",this.state.sameAsPermanent);
    
    if(!this.state.sameAsPermanent){
      console.log("inside if loop");
      var values = {
        currLine1       : this.state.permLine1,
        currLine2       : this.state.permLine2,
        currLine3       : this.state.permLine3,
        currLandmark    : this.state.permLandmark,
        currCity        : this.state.permCity,
        currState       : this.state.permState,
        currCounrty     : this.state.permCountry,
        currPincode     : this.state.permPincode,
        currResidingFrom: this.state.permResidingFrom,
        currResidingTo  : this.state.permResidingTo,
        currShowRadio   : this.state.permShowRadio,
        currentProofType: this.state.permanentProofType,
      }
      if(this.props.permProofObj){
        var imgLink = this.props.permProofObj.imageLink;
        var imgName = this.props.permProofObj.name;
        var imgExt = this.props.permProofObj.ext;
        Meteor.call("addCurrentAddressTempDocs",imgLink,imgName,imgExt,(error, result)=>{
          if (error) {
             console.log(error.reason);
          }else{
          }
        });
      }
      console.log("permanentAddress values ==== ",values);
      this.props.setValues(values);
    }else{
      var values = {
        currLine1       : '',
        currLine2       : '',
        currLine3       : '',
        currLandmark    : '',
        currCity        : '',
        currState       : '',
        currCounrty     : '',
        currPincode     : '',
        currResidingFrom: '',
        currResidingTo  : '',
        currShowRadio   : true,
        currentProofType: '',
      }
      var imgLink = this.props.currProofObj._id;
      Meteor.call("removeTempProofDocs",imgLink,(error, result)=>{
        if (error) {
          console.log(error.reason);
        }else{
          
        }
      });
      this.props.setValues(values);
    }

    this.setState({
      'sameAsPermanent' : !this.state.sameAsPermanent,
    });
  }

  validInput = () => {
    var valid = true;

    this.validate({
      permLine1: {required: true},
      permLandmark: {required: true},
      permCity: {letters: true},
      permState: {letters: true},
      permCountry: {letters: true},
      permPincode: {required: true, pincode: true},
      permResidingFrom: {required: true,},
    });

    if(this.isFieldInError("permLine1")){
      let permLine1Error = this.getErrorsInField('permLine1');
      this.setState({permLine1Error});
      valid = false;
    }else{
      this.setState({permLine1Error:''});
    }

    if(this.isFieldInError("permLandmark")){
      let permLandmarkError = this.getErrorsInField('permLandmark');
      this.setState({permLandmarkError});
      valid = false;
    }else{
      this.setState({permLandmarkError:''});
    }

    if(this.isFieldInError("permCity")){
      let permCityError = this.getErrorsInField('permCity');
      this.setState({permCityError});
      valid = false;
    }else{
      this.setState({permCityError:''});
    }

    if(this.isFieldInError("permState")){
      let permStateError = this.getErrorsInField('permState');
      this.setState({permStateError});
      valid = false;
    }else{
      this.setState({permStateError:''});
    }

    if(this.isFieldInError("permCountry")){
      let permCountryError = this.getErrorsInField('permCountry');
      this.setState({permCountryError});
      valid = false;
    }else{
      this.setState({permCountryError:''});
    }

    if(this.isFieldInError("permPincode")){
      let permPincodeError = this.getErrorsInField('permPincode');
      this.setState({permPincodeError});
      valid = false;
    }else{
      this.setState({permPincodeError:''});
    }

    if(this.isFieldInError("permResidingFrom")){
      let permResidingFromError = this.getErrorsInField('permResidingFrom');
      this.setState({permResidingFromError});
      valid = false;
    }else{
      this.setState({permResidingFromError:''});
    }

    return valid;

  }

  render(){

    return(
      <View style={{backgroundColor:'#fff',width:'100%',alignItems: 'center',justifyContent: 'center',paddingHorizontal:10}}>

        <Text style={{fontWeight:'bold'}}>Permanent Address</Text>
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
              onChangeText          = {(permLine1) => this.setState({permLine1})}
              value                 = {this.state.permLine1}
              error                 = {this.state.permLine1Error[0]}
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
              onChangeText          = {(permLine2) => this.setState({permLine2})}
              value                 = {this.state.permLine2}
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
              onChangeText          = {(permLine3) => this.setState({permLine3})}
              value                 = {this.state.permLine3}/>
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
                onChangeText          = {(permLandmark) => this.setState({permLandmark})}
                value                 = {this.state.permLandmark}
                error                 = {this.state.permLandmarkError[0]}
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
                onChangeText          = {(permCountry) => this.setState({permCountry})}
                value                 = {this.state.permCountry}
                error                 = {this.state.permCountryError[0]}
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
                onChangeText          = {(permState) => this.setState({permState})}
                value                 = {this.state.permState}
                error                 = {this.state.permStateError[0]}
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
                onChangeText          = {(permCity) => this.setState({permCity})}
                value                 = {this.state.permCity}
                error                 = {this.state.permCityError[0]}
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
                onChangeText          = {(permPincode) => this.setState({permPincode})}
                value                 = {this.state.permPincode}
                error                 = {this.state.permPincodeError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <Text style={this.state.permResidingFromError?{color:'rgb(213, 0, 0)'}:{}}>Residing From *</Text>
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
                  date                  = {this.state.permResidingFrom}
                  onDateChange          = {(date) => {this.setState({permResidingFrom: date})}}
                />
                {this.state.permResidingFromError?
                  <View style={{paddingTop:5}}>
                    <Text style={styles.errorText}>{this.state.permResidingFromError[0]}</Text>
                  </View>
                :
                  null
                }
            </View>

            {this.state.permShowRadio
            ? 
              <View style={styles.formInputView}>
                <Text>Residing To</Text>
                <RadioGroup
                  size={20}
                  color='#00b8FF'
                  thickness={2}
                  selectedIndex={0}
                  style={{flex:0.7,flexDirection:'column',justifyContent:"space-around",backgroundColor:'#fff'}}
                  onSelect = {(index, value) => this.residingToChange(value,'permShowRadio')}
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
                    onPress        = {()=>this.residingToChange('toggleToDate','permShowRadio')}
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
                  date                  = {this.state.permResidingTo}
                  onDateChange          = {(date) => {this.setState({permResidingTo: date})}}
                />
              </View>
            }

          </View>

          <View style={styles.inputWrapper} >
            <View style={styles.formInputView}>
              <Text >Address Proof Type</Text>
              <Dropdown
                label                 = ''
                data                  = {AddrProofType}
                inputContainerStyle   = {styles.dropdownInput}
                inputContainerPadding = {0}
                labelHeight           = {16}
                onChangeText          = {(permanentProofType) => this.setState({permanentProofType})}
                value                 = {this.state.permanentProofType}
              />
            </View>

            <View style={styles.formInputView}>
              <Text>Proof of Address</Text>
              {!this.props.permProofObj.imageLink && !this.props.addressValues 
              ?
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonBrowse}
                  onPress     = {()=>this.uploadProofDocs("permanentAddress")}
                />
              :
                this.props.addressValues 
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
                        onPress        = {()=>this.removeProofDocs(this.props.addressValues.proofOfDocument,"editPermanentAddress",this.props.addressValues.fileName,this.props.addressValues.fileExt,this.props.index)}
                      />   
                    </View>
                  :
                    this.props.editPermProofObj.imageLink 
                    ?
                      <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                        <Image
                            resizeMode="stretch"
                            source={{uri: this.props.editPermProofObj.imageLink}} 
                            style={{ width:'100%', height: 120, zIndex:-1 }}
                        />
                        <Icon 
                          name           = "close" 
                          type           = "font-awesome"
                          containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                          onPress        = {()=>this.removeProofDocs(this.props.editPermProofObj._id,"editPermanentAddress")}
                        />   
                      </View>
                    :
                      <Button
                        textStyle   = {{textAlign:'center'}}
                        title       = "Browse"
                        buttonStyle = {styles.buttonBrowse}
                        onPress     = {()=>this.uploadProofDocs("editPermanentAddress")}
                      />
                :
                  this.props.permProofObj.imageLink 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.permProofObj.imageLink}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.permProofObj._id,"editPermanentAddress")}
                      />   
                    </View>
                  :
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonBrowse}
                      onPress     = {()=>this.uploadProofDocs("permanentAddress")}
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
                onPress     = {this.props.addressValues ? this.editPermAddr : this.savePermanentAddr}
              />
            </View>
          </View>

        {this.props.addressValues ? null :
          <View style={styles.inputWrapper}>
            <Text style={styles.addressTitle} style={{fontWeight:'bold'}}>Current Address</Text>

            <CheckBox
              style           = {{flex:1}}
              rightText       = "Same as permanent address"
              rightTextStyle  = {{marginLeft:0}}
              checkBoxColor   = {this.state.inputFocusColor}
              isChecked       = {this.state.sameAsPermanent}
              onClick         = {this.handleClick}
            />
          </View>
        }

      </View>      
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

  const postHandle2     = Meteor.subscribe('TempProofDocs',userId);
  const imgLoading      = postHandle2.ready();
  const permProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
  const currProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
  const editPermProofObj= Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"address","proofSubtype": 'editPermanentAddress'})|| {};

  const { state } = props.navigation;

  // if(state.params){
  //   if(state.params.goBack){
  //     var goBack = state.params.goBack;
  //   }
  // }

  return{
    userProfileData,
    loading,
    s3Data,
    permProofObj,
    currProofObj,
    editPermProofObj,
  }
  


}, PermanentAddressForm);

PermanentAddressForm.defaultProps = {
  messages: {
    en: {
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      pincode: 'Enter a valid pincode.'
    }
  },

  rules: {
    required: /\S+/,
    letters: /^[a-zA-Z ]+$|^$/,
    pincode: /^[1-9][0-9]{5}$|^$/,
  },
}