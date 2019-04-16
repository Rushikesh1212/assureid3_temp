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


class ProfessionalEduForm extends ValidationComponent {
  constructor(props){
    super(props);
    if(this.props.professionalAcademicsValues){
      var stateObj = {
        professionalEducationId   : this.props.professionalAcademicsValues.professionalEducationId,
        professionalQualification : this.props.professionalAcademicsValues.professionalQualification,
        dateOfQualification       : this.props.professionalAcademicsValues.dateOfQualification,
        registrationNo            : this.props.professionalAcademicsValues.registrationNo,
        qualifyingBodyNm          : this.props.professionalAcademicsValues.qualifyingBodyNm,
        professionalRollNo        : this.props.professionalAcademicsValues.professionalRollNo,
        educationType             : this.props.professionalAcademicsValues.proofType,
        editStatus                : this.props.professionalAcademicsValues.editStatus,   
        professionalQualificationError: '',
        dateOfQualificationError      : '',
        registrationNoError           : '',
      };
    }
    else{
      var stateObj = {
        professionalQualification : '',
        dateOfQualification       : '',
        registrationNo            : '',
        qualifyingBodyNm          : '',
        professionalRollNo        : '',
        educationType             : '',
        professionalQualificationError: '',
        dateOfQualificationError      : '',
        registrationNoError           : '',
      }
    }

    stateObj.inputFocusColor  = '#00b8FF';
    stateObj.fontSize         = 15;
    this.state                = stateObj;
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
          this.props.professionalAcademicsValues.proofOfDocument='';
          this.props.professionalAcademicsValues.fileName='';
          this.props.professionalAcademicsValues.fileExt='';
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

  submitProfessionalInfo = () =>{
    Keyboard.dismiss();

    var id   = Meteor.userId();

    var educationObj = Meteor.collection('userProfile').findOne({}, {sort: {'professionalEducation.professionalEducationId': -1}});
    console.log("educationObj = ",educationObj);

    if(educationObj){
     if (educationObj.professionalEducation) {
        if (educationObj.professionalEducation.length > 0 ) {
          // var lastelem    = _.last(educationObj.education);
          var lastelem = educationObj.professionalEducation[educationObj.professionalEducation.length-1];
          var professionalEducationId =  parseInt(lastelem.professionalEducationId) + 1;
        }else{
        var professionalEducationId =  1;
        }
      }else{
        var professionalEducationId =  1;
      }
    }

    var formValues = {
      "professionalEducationId"   : professionalEducationId,
      "professionalQualification" : this.state.professionalQualification,
      "registrationNo"            : this.state.registrationNo,
      "dateOfQualification"       : this.state.dateOfQualification,
      "qualifyingBodyNm"          : this.state.qualifyingBodyNm,
      "professionalRollNo"        : this.state.professionalRollNo,
      "proofType"                 : this.state.educationType,
      "proofOfDocument"           : 'imgLink',
      "fileName"                  : 'fileName',
      "fileExt"                   : 'fileExt',
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open"   
    }

    // console.log("formValues = ",formValues);

    if(this.validInput()){
      Meteor.call('insertProfessionalEducation',id,formValues, (error,result) =>{
        if(error){
          console.log(error.reason);
        }else{
         Alert.alert(
            '','Professional Education Details added successfully!',
          );
          
          this.state.professionalQualification = '';
          this.state.dateOfQualification = '';
          this.state.registrationNo = '';
          this.state.qualifyingBodyNm = '';
          this.state.professionalRollNo = '';
          this.state.educationType = '';  


          if(this.props.goBack){
            this.props.navigation.goBack(null);
          }

          // this.props.navigation.navigate('EmploymentInfo');
        }
      });
    }
  }

  editProfessionalInfo = () =>{
    Keyboard.dismiss();

    var id                      = Meteor.userId();
    var index                   = this.props.index;
    var professionalEducationId = this.state.professionalEducationId;
    var editstatus              = this.state.editStatus;

    if(this.props.professionalAcademicsValues){
      if(this.props.professionalAcademicsValues.proofOfDocument){
        var imgLink = this.props.professionalAcademicsValues.proofOfDocument;
        var fileName = this.props.professionalAcademicsValues.fileName;
        var fileExt = this.props.professionalAcademicsValues.fileExt;
      }else if(this.props.editProfProofObj.imageLink){
        var imgLink = this.props.editProfProofObj.imageLink;
        var fileName = this.props.editProfProofObj.name;
        var fileExt = this.props.editProfProofObj.ext;
        var imgId = this.props.editProfProofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.profProofObj.imageLink){
      var imgLink = this.props.profProofObj.imageLink;
      var fileName = this.props.profProofObj.name;
      var fileExt = this.props.profProofObj.ext;
      var imgId = this.props.profProofObj._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }

    var formValues = {
      "professionalEducationId"   : parseInt(professionalEducationId),
      "professionalQualification" : this.state.professionalQualification,
      "registrationNo"            : this.state.registrationNo,
      "dateOfQualification"       : this.state.dateOfQualification,
      "qualifyingBodyNm"          : this.state.qualifyingBodyNm,
      "professionalRollNo"        : this.state.professionalRollNo,
      "proofType"                 : this.state.educationType,
      "proofOfDocument"           : imgLink,
      "fileName"                  : fileName,
      "fileExt"                   : fileExt,
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open"     
    }

    if(this.validInput()){
      Meteor.call('updateProfessionalEducation',id,formValues,index, (error,result) => {
        if(error){
          console.log(error.reason);
        }else{
          Alert.alert(
            '','Education details updated successfully!',
          );

          if (editstatus == "Reopen") {
            Meteor.call('updateTicketAfterReopen',id,"professionalEducation",professionalEducationId,formValues); 
          }           
          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             console.log(error.reason);
            }else{  
            }
          });

          this.state.professionalQualification = '';
          this.state.dateOfQualification = '';
          this.state.registrationNo = '';
          this.state.qualifyingBodyNm = '';
          this.state.professionalRollNo = '';
          this.state.educationType = '';  

          this.props.navigation.goBack(null);      
        }
      });
    }
  }

  validInput = () => {
    var valid = true;

    this.validate({
      professionalQualification: {required: true},
      dateOfQualification: {required: true},
      registrationNo: {required: true},
    });

    if(this.isFieldInError("professionalQualification")){
      let professionalQualificationError = this.getErrorsInField('professionalQualification');
      this.setState({professionalQualificationError});
      valid = false;
    }else{
      this.setState({professionalQualificationError:''});
    }

    if(this.isFieldInError("dateOfQualification")){
      let dateOfQualificationError = this.getErrorsInField('dateOfQualification');
      this.setState({dateOfQualificationError});
      valid = false;
    }else{
      this.setState({dateOfQualificationError:''});
    }

    if(this.isFieldInError("registrationNo")){
      let registrationNoError = this.getErrorsInField('registrationNo');
      this.setState({registrationNoError});
      valid = false;
    }else{
      this.setState({registrationNoError:''});
    }

    return valid;

  }

  render(){
    

    return(
      <ScrollView style={styles.content} keyboardShouldPersistTaps="always">

        <View style={styles.inputWrapper}>
          <View style={styles.fieldTextareaView}>
            <TextField
              label                 = "Qualification/Membership *"
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
              onChangeText          = {(professionalQualification) => this.setState({professionalQualification})}
              value                 = {this.state.professionalQualification}
              error                 = {this.state.professionalQualificationError[0]}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.fieldView}>
            <Text style={this.state.dateOfQualificationError?{color:'rgb(213, 0, 0)'}:{}}>Date of Qualification *</Text>
            <DatePicker 
                mode                  = "date"
                placeholder           = "Select Date"
                format                = "L"
                minDate               = "01-01-1960"
                confirmBtnText        = "Confirm"
                cancelBtnText         = "Cancel"
                style                 = { styles.dateStyle }
                customStyles          = {{ dateInput : { borderWidth : 0}}}
                date                  = {this.state.dateOfQualification}
                onDateChange          = {(date) => {this.setState({dateOfQualification: date})}}
            />
            {this.state.dateOfQualificationError?
              <View style={{paddingTop:5}}>
                <Text style={styles.errorText}>{this.state.dateOfQualificationError[0]}</Text>
              </View>
            :
              null
            }
          </View>

          <View style={styles.fieldView}>
            <TextField
              label                 = "Registration No. *"
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
              onChangeText          = {(registrationNo) => this.setState({registrationNo})}
              value                 = {this.state.registrationNo}
              error                 = {this.state.registrationNoError[0]}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.fieldTextareaView}>
            <TextField
              label                 = "Name of Qualifying Body"
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
              onChangeText          = {(qualifyingBodyNm) => this.setState({qualifyingBodyNm})}
              value                 = {this.state.qualifyingBodyNm}
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
              onChangeText          = {(professionalRollNo) => this.setState({professionalRollNo})}
              value                 = {this.state.professionalRollNo}
            />
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.formInputView1}>
            <Text>Education Proof Type</Text>
            <Dropdown
              label                 = ''
              data                  = {eduProofType}
              inputContainerStyle   = {styles.dropdownInput}
              labelHeight           = {9}
              onChangeText          = {(educationType) => this.setState({educationType})}
              value                 = {this.state.educationType}
            />
          </View>

        </View>

        <View style={styles.inputWrapper}>
          <Text>Proof of Professional Education</Text>
        </View>
        <View style={styles.textViewWrapper}>
          
          {!this.props.profProofObj.imageLink && !this.props.professionalAcademicsValues 
          ?
            <Button
              textStyle   = {{textAlign:'center'}}
              title       = "Browse"
              buttonStyle = {styles.buttonBrowse}
              onPress     = {()=>this.uploadProofDocs("professionalEducation")}
            />
          : 
            this.props.professionalAcademicsValues 
            ?
              this.props.professionalAcademicsValues.proofOfDocument 
              ?
                <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                  <Image
                      resizeMode="stretch"
                      source={{uri: this.props.professionalAcademicsValues.proofOfDocument}} 
                      style={{ width:'100%', height: 120, zIndex:-1 }}
                  />
                  <Icon 
                    name           = "close" 
                    type           = "font-awesome"
                    containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                    onPress        = {()=>this.removeProofDocs(this.props.professionalAcademicsValues.proofOfDocument,"editProfessionalEducation",this.props.professionalAcademicsValues.fileName,this.props.professionalAcademicsValues.fileExt,this.props.index)}
                  />   
                </View>
              :
                this.props.editProfProofObj.imageLink
                ?
                  <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                    <Image
                        resizeMode="stretch"
                        source={{uri: this.props.editProfProofObj.imageLink}} 
                        style={{ width:'100%', height: 120, zIndex:-1 }}
                    />
                    <Icon 
                      name           = "close" 
                      type           = "font-awesome"
                      containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                      onPress        = {()=>this.removeProofDocs(this.props.editProfProofObj._id,"editProfessionalEducation")}
                    />   
                  </View>
                :
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonBrowse}
                    onPress     = {()=>this.uploadProofDocs("editProfessionalEducation")}
                  />
            :
              this.props.profProofObj.imageLink
              ?
                <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                  <Image
                      resizeMode="stretch"
                      source={{uri: this.props.profProofObj.imageLink}} 
                      style={{ width:'100%', height: 120, zIndex:-1 }}
                  />
                  <Icon 
                    name           = "close" 
                    type           = "font-awesome"
                    containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                    onPress        = {()=>this.removeProofDocs(this.props.profProofObj._id,"editProfessionalEducation")}
                  />   
                </View>
              :
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonBrowse}
                  onPress     = {()=>this.uploadProofDocs("professionalEducation")}
                />
          }
        </View>

        <View style={styles.assignBreak}></View>
        
        <View style={{width:'100%',alignItems:'center'}}>
          <View style={styles.formInputView}>
            <Button
              textStyle   = {{textAlign:'center'}}
              title       = "Save"
              buttonStyle = {styles.buttonSubmit}
              onPress     = {this.props.professionalAcademicsValues ? this.editProfessionalInfo : this.submitProfessionalInfo}
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
            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('EmploymentInfo')}>
              <Text style={{textDecorationLine:'underline'}}>Go Next</Text>
              <Icon name="chevrons-right" type="feather" color="#aaa" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.assignBreak}></View>

      </ScrollView>       
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
  // const basicProofObj    = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"education","proofSubtype": 'basicEducation'})|| {};
  // const editBasicProofObj= Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"education","proofSubtype": 'editBasicEducation'})|| {};

  var profProofObj      = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":'education','proofSubtype':'professionalEducation'}) || {};
  var editProfProofObj  = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":'education','proofSubtype':'editProfessionalEducation'}) || {};
  
  return{
    userProfileData,
    loading,
    s3Data,
    profProofObj,
    editProfProofObj,
  }
}, ProfessionalEduForm);

ProfessionalEduForm.defaultProps = {
  messages: {
    en: {
      required: 'This field is required.',
    }
  },

  rules: {
    required: /\S+/,
  },
}