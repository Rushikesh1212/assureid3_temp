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


class EducationForm extends ValidationComponent {
  constructor(props){
    super(props);
    if(this.props.academicsValues){
        // console.log("academicsValues ====== ",this.props.academicsValues);
      var stateObj = {
        educationId             : this.props.academicsValues.educationId,
        educationLevel          : this.props.academicsValues.educationLevel,
        educationQualification  : this.props.academicsValues.educationQualification,
        specialization          : this.props.academicsValues.specialization,
        grades                  : this.props.academicsValues.grades,
        educationMode           : this.props.academicsValues.educationMode,
        dateAttendedFrom        : this.props.academicsValues.dateAttendedFrom,
        dateAttendedTo          : this.props.academicsValues.dateAttendedTo,
        university              : this.props.academicsValues.university,
        collegeName             : this.props.academicsValues.collegeName,
        collegeAddress          : this.props.academicsValues.collegeAddress,
        city                    : this.props.academicsValues.city,
        state                   : this.props.academicsValues.state,
        rollNo                  : this.props.academicsValues.rollNo,
        proofType               : this.props.academicsValues.proofType,
        editStatus              : this.props.academicsValues.editStatus,
        educationLevelError         : '',
        educationQualificationError : '',
        dateAttendedFromError       : '',
        dateAttendedToError         : '',
        universityError             : '',
        collegeNameError            : '',
        cityError                   : '',
        stateError                  : '',
      };
    }
    else{
      var stateObj = {
        educationLevel          : '',
        educationQualification  : '',
        specialization          : '',
        grades                  : '',
        educationMode           : '',
        dateAttendedFrom        : '',
        dateAttendedTo          : '',
        university              : '',
        collegeName             : '',
        collegeAddress          : '',
        city                    : '',
        state                   : '',
        rollNo                  : '',
        proofType               : '',
        educationLevelError         : '',
        educationQualificationError : '',
        dateAttendedFromError       : '',
        dateAttendedToError         : '',
        universityError             : '',
        collegeNameError            : '',
        cityError                   : '',
        stateError                  : '',
      }
    }

    stateObj.inputFocusColor = '#00b8FF';
    stateObj.fontSize        = 15;
    this.state = stateObj;

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
          this.props.academicsValues.proofOfDocument='';
          this.props.academicsValues.fileName='';
          this.props.academicsValues.fileExt='';
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

  addDetails = () => {
    Keyboard.dismiss();

    var id   = Meteor.userId();
    if(this.props.basicProofObj.imageLink){
      var imgLink   = this.props.basicProofObj.imageLink;
      var fileName  = this.props.basicProofObj.name;
      var fileExt   = this.props.basicProofObj.ext;
      var imgId     = this.props.basicProofObj._id;
    }else{
      var imgLink   = '';
      var fileName  = '';
      var fileExt   = ''; 
    }

    var educationObj = Meteor.collection('userProfile').findOne({}, {sort: {'education.educationId': -1}});
    console.log("educationObj = ",educationObj);

    if(educationObj){
     if (educationObj.education) {
        if (educationObj.education.length > 0 ) {
          // var lastelem    = _.last(educationObj.education);
          var lastelem = educationObj.education[educationObj.education.length-1];
          var educationId =  parseInt(lastelem.educationId) + 1;
        }else{
        var educationId =  1;
        }
      }else{
        var educationId =  1;
      }
    }

    var formValues = {
      "educationId"            : educationId,
      'educationLevel'         : this.state.educationLevel,
      'educationQualification' : this.state.educationQualification,
      'specialization'         : this.state.specialization,
      'grades'                 : this.state.grades,
      'educationMode'          : this.state.educationMode,
      'dateAttendedFrom'       : this.state.dateAttendedFrom,
      'dateAttendedTo'         : this.state.dateAttendedTo,
      'collegeName'            : this.state.collegeName,
      'university'             : this.state.university,
      'collegeAddress'         : this.state.collegeAddress,
      'city'                   : this.state.city,
      'State'                  : this.state.state,
      'rollNo'                 : this.state.rollNo,
      "proofType"              : this.state.proofType,
      "proofOfDocument"        : imgLink,
      "fileName"               : fileName,
      "fileExt"                : fileExt,
      "verifiedStatus"         : "Not Verified",
      "editStatus"             : "Open",
    }

    // console.log("formValues = ",formValues);
    
    if(this.validInput()){
      Meteor.call('insertEducation',id,formValues, (error,result) =>{
       if(error){
          console.log(error.reason);
        }else{
          Alert.alert(
            '','Education Details added successfully!',
          );
          if(this.props.goBack){
            this.props.navigation.goBack(null);
          }
          this.state.educationLevel = '';
          this.state.educationQualification = '';
          this.state.specialization = '';
          this.state.grades = '';
          this.state.educationMode = '';
          this.state.dateAttendedFrom = '';
          this.state.dateAttendedTo = '';
          this.state.university = '';
          this.state.collegeName = '';
          this.state.collegeAddress = '';
          this.state.city = '';
          this.state.state = '';
          this.state.rollNo = '';
          this.state.proofType = '';
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
    
    var id          = Meteor.userId();
    var index       = this.props.index;
    var educationId = this.state.educationId;
    var editstatus  = this.state.editStatus;

    if(this.props.academicsValues){
      if(this.props.academicsValues.proofOfDocument){
        var imgLink = this.props.academicsValues.proofOfDocument;
        var fileName = this.props.academicsValues.fileName;
        var fileExt = this.props.academicsValues.fileExt;
      }else if(this.props.editBasicProofObj.imageLink){
        var imgLink = this.props.editBasicProofObj.imageLink;
        var fileName = this.props.editBasicProofObj.name;
        var fileExt = this.props.editBasicProofObj.ext;
        var imgId = this.props.editBasicProofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.basicProofObj.imageLink){
      var imgLink = this.props.basicProofObj.imageLink;
      var fileName = this.props.basicProofObj.name;
      var fileExt = this.props.basicProofObj.ext;
      var imgId = this.props.basicProofObj._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }

    var formValues = {
      "educationId"               : parseInt(educationId),
      "educationLevel"            : this.state.educationLevel,
      "educationQualification"    : this.state.educationQualification,
      "specialization"            : this.state.specialization,
      "grades"                    : this.state.grades,
      "educationMode"             : this.state.educationMode,
      "dateAttendedFrom"          : this.state.dateAttendedFrom,
      "dateAttendedTo"            : this.state.dateAttendedTo,
      "collegeName"               : this.state.collegeName,
      "university"                : this.state.university,
      "collegeAddress"            : this.state.collegeAddress,
      "city"                      : this.state.city,
      "state"                     : this.state.state,
      "rollNo"                    : this.state.rollNo,
      "proofType"                 : this.state.proofType,
      "proofOfDocument"           : imgLink,
      "fileName"                  : fileName,
      "fileExt"                   : fileExt,
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open",
    }

    if(this.validInput()){
      Meteor.call('updateEducation',id,formValues,index, (error,result) => {
        if(error){
          console.log(error.reason);  
        }else{
          Alert.alert(
            '','Education details updated successfully!',
          );

          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             console.log(error.reason);
            }else{  
            }
          });

          if(editstatus == "Reopen") {
            Meteor.call('updateTicketAfterReopen',id,"education",educationId,formValues); 
          }

          this.state.educationLevel = '';
          this.state.educationQualification = '';
          this.state.specialization = '';
          this.state.grades = '';
          this.state.educationMode = '';
          this.state.dateAttendedFrom = '';
          this.state.dateAttendedTo = '';
          this.state.university = '';
          this.state.collegeName = '';
          this.state.collegeAddress = '';
          this.state.city = '';
          this.state.state = '';
          this.state.rollNo = '';
          this.state.proofType = '';

          this.props.navigation.goBack(null);     
        }
         
      });  
    }
  }

  validInput = () => {
    var valid = true;

    this.validate({
      educationLevel: {required: true},
      educationQualification: {required: true},
      dateAttendedFrom: {required: true},
      dateAttendedTo: {required: true},
      university: {required: true},
      collegeName: {required: true},
      city: {required: true,letters: true},
      state: {required: true,letters: true},
    });

    if(this.isFieldInError("educationLevel")){
      let educationLevelError = this.getErrorsInField('educationLevel');
      this.setState({educationLevelError});
      valid = false;
    }else{
      this.setState({educationLevelError:''});
    }

    if(this.isFieldInError("educationQualification")){
      let educationQualificationError = this.getErrorsInField('educationQualification');
      this.setState({educationQualificationError});
      valid = false;
    }else{
      this.setState({educationQualificationError:''});
    }

    if(this.isFieldInError("dateAttendedFrom")){
      let dateAttendedFromError = this.getErrorsInField('dateAttendedFrom');
      this.setState({dateAttendedFromError});
      valid = false;
    }else{
      this.setState({dateAttendedFromError:''});
    }

    if(this.isFieldInError("dateAttendedTo")){
      let dateAttendedToError = this.getErrorsInField('dateAttendedTo');
      this.setState({dateAttendedToError});
      valid = false;
    }else{
      this.setState({dateAttendedToError:''});
    }

    if(this.isFieldInError("university")){
      let universityError = this.getErrorsInField('university');
      this.setState({universityError});
      valid = false;
    }else{
      this.setState({universityError:''});
    }

    if(this.isFieldInError("collegeName")){
      let collegeNameError = this.getErrorsInField('collegeName');
      this.setState({collegeNameError});
      valid = false;
    }else{
      this.setState({collegeNameError:''});
    }

    if(this.isFieldInError("city")){
      let cityError = this.getErrorsInField('city');
      console.log("cityError = ",cityError);
      this.setState({cityError});
      valid = false;
    }else{
      this.setState({cityError:''});
    }

    if(this.isFieldInError("state")){
      let stateError = this.getErrorsInField('state');
      console.log("stateError = ",stateError);
      this.setState({stateError});
      valid = false;
    }else{
      this.setState({stateError:''});
    }

    return valid;

  }

  uploadProofDocs(proofSubtype){
    console.log("proofSubtype = ",proofSubtype);
    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;
    var prooftype = "education";

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

                            Meteor.call("insertEduTempProofDocs",userId,fileDetails,prooftype,proofSubtype,(error,result) =>{
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

  render(){
    let selectData = [{
      value: 'Post Graduation',
    }, {
      value: 'Graduation',
    }, {
      value: 'Diploma',
    }, {
      value: 'HSC',
    }, {
      value: 'SSC',
    }, {
      value: 'Graduation',
    }, {
      value: 'Below Matriculation',
    }, {
      value: 'Other',
    }];

    let mode = [{
      value: 'Full Time',
    }, {
      value: 'Part Time',
    }, {
      value: 'Distance',
    }];

    return(
      <View style={{backgroundColor:'#fff',width:'100%',alignItems: 'center',justifyContent: 'center'}}>
        
        <View style={styles.inputWrapper}>
          <View style={styles.fieldView}>
            <Text style={this.state.educationLevelError?{color:'rgb(213, 0, 0)'}:{}}>Qualification Level *</Text>
            <Dropdown
              label                 = ''
              data                  = {selectData}
              inputContainerStyle   = {styles.dropdownInput}
              labelHeight           = {9}
              onChangeText          = {(educationLevel) => this.setState({educationLevel})}
              value                 = {this.state.educationLevel}
              error                 = {this.state.educationLevelError[0]}
            />
          </View>

          <View style={styles.fieldView}>
            <TextField
              label                 = "Qualification *"
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
              value                 = {this.state.educationQualification}
              onChangeText          = {(educationQualification) => this.setState({educationQualification})}
              error                 = {this.state.educationQualificationError[0]}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
            <View style={styles.fieldView}>
              <TextField
                label                 = "Specialization"
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
                value                 = {this.state.specialization}
                onChangeText          = {(specialization) => this.setState({specialization})}

              />
            </View>

            <View style={styles.fieldView}>
              <TextField
                label                 = "Grades/Percentage"
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
                value                 = {this.state.grades}
                onChangeText          = {(grades) => this.setState({grades})}

              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.fieldView}>
              <Text>Mode</Text>
              <Dropdown
                label                 = ''
                data                  = {mode}
                inputContainerStyle   = {styles.dropdownInput}
                // inputContainerPadding = {0}
                labelHeight           = {9}
                onChangeText          = {(educationMode) => this.setState({educationMode})}
                value                 = {this.state.educationMode}
              />
            </View>
          </View>

          <Text style={{fontWeight:'bold'}}>Dates Attended (MM/YYYY)</Text>

          <View style={styles.inputWrapper}>
            <View style={styles.fieldView}>
              <Text style={this.state.dateAttendedFromError?{color:'rgb(213, 0, 0)'}:{}}>From *</Text>
              <DatePicker
                style                 = {{borderWidth:1,borderColor: '#aaa',width:'100%'}}
                date                  = {this.state.dateAttendedFrom}
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
                onDateChange          = {(date) => {this.setState({dateAttendedFrom: date})}}
              />
              {this.state.dateAttendedFromError?
                <View style={{paddingTop:5}}>
                  <Text style={styles.errorText}>{this.state.dateAttendedFromError[0]}</Text>
                </View>
              :
                null
              }
            </View>

            <View style={styles.fieldView}>
              <Text style={this.state.dateAttendedToError?{color:'rgb(213, 0, 0)'}:{}}>To *</Text>
              <DatePicker
                style                 = {{borderWidth:1,borderColor: '#aaa',width:'100%'}}

                date                  = {this.state.dateAttendedTo}

                mode                  = "date"
                placeholder           = "Select Date"
                format                = "L"
                minDate               = "01-01-1960"
                confirmBtnText        = "Confirm"
                cancelBtnText         = "Cancel"
                customStyles          = {{ 
                                          dateInput : { 
                                            borderWidth : 0
                                          }
                                        }}
                onDateChange          = {(date) => {this.setState({dateAttendedTo: date})}}
              />
              {this.state.dateAttendedToError?
                <View style={{paddingTop:5}}>
                  <Text style={styles.errorText}>{this.state.dateAttendedToError[0]}</Text>
                </View>
              :
                null
              }
            </View>
          </View>

           <View style={styles.inputWrapper}>
            <View style={styles.fieldView}>
              <TextField
                label                 = "University *"
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
                value                 = {this.state.university}
                onChangeText          = {(university) => this.setState({university})}
                error                 = {this.state.universityError[0]}
              />
            </View>

            <View style={styles.fieldView}>
              <TextField
                label                 = "College / Institute *"
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
                value                 = {this.state.collegeName}
                onChangeText          = {(collegeName) => this.setState({collegeName})}
                error                 = {this.state.collegeNameError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.fieldTextareaView}>
              <TextField
                label                 = "College Address"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:100}}
                style                 = {[styles.inputText, styles.textAreaHeight]}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                labelFontSize         = {this.state.fontSize}
                multiline             = {true}
                value                 = {this.state.collegeAddress}
                onChangeText          = {(collegeAddress) => this.setState({collegeAddress})}

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
                value                 = {this.state.city}
                onChangeText          = {(city) => this.setState({city})}
                error                 = {this.state.cityError[0]}
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
                value                 = {this.state.state}
                onChangeText          = {(state) => this.setState({state})}
                error                 = {this.state.stateError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.fieldTextareaView}>
              <TextField
                label                 = "Regn No. / Roll No. / Seat No"
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
                value                 = {this.state.rollNo}
                onChangeText          = {(rollNo) => this.setState({rollNo})}

              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              
              <Text>Education Proof Type</Text>
              <Dropdown
                label                 = ''
                data                  = {eduProofType}
                inputContainerStyle   = {styles.dropdownInput}
                labelHeight           = {9}
                onChangeText          = {(proofType) => this.setState({proofType})}
                value                 = {this.state.proofType}
              />
            </View>

            <View style={styles.formInputView}>
              <Text>Proof of Education</Text>

              {!this.props.basicProofObj.imageLink && !this.props.academicsValues 
              ?
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonBrowse}
                  onPress     = {()=>this.uploadProofDocs("basicEducation")}
                />
              : 
                this.props.academicsValues 
                ?
                  this.props.academicsValues.proofOfDocument 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.academicsValues.proofOfDocument}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.academicsValues.proofOfDocument,"editBasicEducation",this.props.academicsValues.fileName,this.props.academicsValues.fileExt,this.props.index)}
                      />   
                    </View>
                  :
                    this.props.editBasicProofObj.imageLink
                    ?
                      <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                        <Image
                            resizeMode="stretch"
                            source={{uri: this.props.editBasicProofObj.imageLink}} 
                            style={{ width:'100%', height: 120, zIndex:-1 }}
                        />
                        <Icon 
                          name           = "close" 
                          type           = "font-awesome"
                          containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                          onPress        = {()=>this.removeProofDocs(this.props.editBasicProofObj._id,"editBasicEducation")}
                        />   
                      </View>
                    :
                      <Button
                        textStyle   = {{textAlign:'center'}}
                        title       = "Browse"
                        buttonStyle = {styles.buttonBrowse}
                        onPress     = {()=>this.uploadProofDocs("editBasicEducation")}
                      />
                :
                  this.props.basicProofObj.imageLink
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.basicProofObj.imageLink}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.basicProofObj._id,"editBasicEducation")}
                      />   
                    </View>
                  :
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonBrowse}
                      onPress     = {()=>this.uploadProofDocs("basicEducation")}
                    />
              }
              
            </View>
          </View>

          <View style={styles.assignBreak}></View>

          <View style={{width:'100%',alignItems:'center'}}>
            <View style={styles.formInputView}>
              <Button
                textStyle   = {{textAlign:'center'}}
                title       = "Save"
                buttonStyle = {styles.buttonSubmit}
                onPress     = {this.props.academicsValues ? this.handleEdit :  this.addDetails}
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
  // console.log("userprofile = ",userProfileData);

  const postHandle1     = Meteor.subscribe('projectSettingsPublish');
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  const postHandle2      = Meteor.subscribe('TempProofDocs',userId);
  const imgLoading       = postHandle2.ready();
  const basicProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"education","proofSubtype": 'basicEducation'})|| {};
  const editBasicProofObj= Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"education","proofSubtype": 'editBasicEducation'})|| {};

  return{
    userProfileData,
    loading,
    s3Data,
    basicProofObj,
    editBasicProofObj,
  }
}, EducationForm);


EducationForm.defaultProps = {
  messages: {
    en: {
      required: 'This field is required.',
      letters: 'It should only contain letters.',
    }
  },

  rules: {
    required: /\S+/,
    letters: /^[a-zA-Z ]+$|^$/,
  },
}