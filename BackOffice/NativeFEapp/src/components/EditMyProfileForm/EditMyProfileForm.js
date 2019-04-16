import React, {Component} from 'react';
import Meteor,{createContainer} from 'react-native-meteor';

import {Platform, ScrollView, StyleSheet, Text,TouchableOpacity, TextInput, View,  BackHandler, Alert,Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon,Avatar} from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';

import PropTypes from 'prop-types';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import ValidationComponent from "react-native-form-validator";

import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';

import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';

class EditMyProfileForm extends ValidationComponent {
  constructor(props){
    super(props);
    if(Meteor.user().emails[0].address){
      var email = Meteor.user().emails[0].address;
    }else{
      var email = '';
    }
    console.log("email = ",email);
    this.state={
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      firstname       : Meteor.user().profile.firstname,
      lastname        : Meteor.user().profile.lastname,
      mobNumber       : Meteor.user().profile.mobNumber,
      emailId         : email,
      firstNameError  : "",
      lastNameError   : "",
      emailError      : "",
      error           : null,
    
    };
    
  }
  // componentWillReceiveProps(nextProps){
  //   console.log("loading => ",nextProps.loading);
  //   if(nextProps.loading){
  //     if(nextProps.post){
  //       console.log("nextProps post => ",nextProps.post);
  //       this.setState({
  //         firstName   : nextProps.post.firstName,
  //         lastName    : nextProps.post.lastName,
  //         email       : nextProps.post.emailId,

  //       });
  //     }
  //   }
  // }

  handleError = error => {
    if (this.mounted) {
      this.setState({ error });
    }
  };

  validInput = () => {
    const {
      firstname,
      lastname,
      emailId,
    } = this.state;
    let valid = true;

      this.validate({
        firstname: {
          minlength: 3,
          maxlength: 12,
          required: true,
        },
        lastname: {
          minlength: 3,
          maxlength: 12,
          required: true,

        },
        emailId: { emailId: true, required: true }, 
      });

    if (this.isFieldInError("firstname")) {
      let firstNameError = this.getErrorsInField('firstname');
      console.log('firstNameError ',firstNameError);
      this.setState({ firstNameError });
      valid = false;
    }else{
      this.setState({firstNameError:""})
    }

    if (this.isFieldInError("lastname")) {
      this.setState({ lastNameError: this.getErrorsInField('lastname') });
      valid = false;
    }else{
      this.setState({lastNameError:""})
    }

    if (this.isFieldInError("emailId")) {
      this.setState({ emailError: this.getErrorsInField('emailId') });
      valid = false;
    }else{
      this.setState({emailError:""})
    }

    console.log(this.state.firstNameError);
   
    if (valid) {
      this.handleError(null);
    }
    console.log('valid : ',valid);
    console.log('error ',this.getErrorMessages('\n'));
    return valid;
  };

  updateProfile = () => {

    // console.log(this.state.firstName,'this.state.firstName');
    // console.log(this.state.lastName,'this.state.lastName');
    // console.log(this.state.emailId,'this.state.emailId');

    var formValues = {

      'firstname'   : this.state.firstname,
      'lastname'    : this.state.lastname,
      // 'email'       : this.state.emailId,
    }
    if(this.validInput()){
      // console.log(formValues,'formValues');
      Meteor.call('userCustom',formValues,(error,result) =>{
        if(error){
          Alert.alert(
            error.reason,
          )
        }else{
          Alert.alert(
            '','Profile Updated successfully!',
          );
          this.props.navigate('MyProfile');
        }
      });
    }
  };

  editProfileImage = (event) =>{

    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;

    DocumentPicker.show({ filetype : [DocumentPickerUtil.images()]},(error,res) => {
                          // Android
                          console.log("Result:: ",res);
                          // var fileName = userId+'_'+Date.now()+'_'+res.fileName;
                          var fileName = userId+'_'+res.fileName;
                          var fileExt = fileName.split('.').pop();  

                          var file = {
                            uri   : res.uri,
                            name  : fileName,
                            type  : res.type,
                          }
                          
                          console.log("file obj => ",file);
                          
                          const options = {
                            keyPrefix           : "uploads/",
                            bucket              : s3Data.bucket,
                            region              : s3Data.region,
                            accessKey           : s3Data.key,
                            secretKey           : s3Data.secret,
                          }

                          RNS3.put(file, options).then((response) => {
                            console.log("------------response---------------");
                            console.log('response: ',response);
                            if (response.status !== 201)
                              throw new Error("Failed to upload image to S3");
                            console.log("=========  response.body  ==================");
                            console.log(response.body);
                            console.log("---------  response.body  ------------------");
                            
                            var imageLink = response.body.postResponse.location;
                            
                            Meteor.call("addUserProfileImage",userId,imageLink,(error,result) =>{
                              if(error){
                                console.log(error.reason);
                                Alert.alert(
                                  'Error',
                                )
                              }else{
                                console.log("Image details saved.");
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

                        });    
  }
  render(){

    var userData = Meteor.user().profile;
 
    return(
        <View>
          <View style={styles.formContainer}>
            <View style={{ flex: 3, paddingTop: 15 }}>

             {userData.userProfile 
              ?
                <Avatar
                  width={80}
                  height={80}
                  rounded
                  source={{uri:userData.userProfile}}
                  avatarStyle={{borderWidth:1,borderColor:'#000'}}
                  containerStyle={{marginBottom:5}}
                />
              :
                  <Avatar
                    width={90}
                    height={90}
                    rounded
                    source={{
                      uri:
                        "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"
                    }}
                    activeOpacity={0.7}
                  />  
              }

              <View style={{zIndex : 1, position : 'absolute',bottom: 0}}><Icon name="camera" type="entypo" color="#54Aff3" onPress={this.editProfileImage.bind(this)}/></View>
            </View>
            <View style={styles.formInputView}>
              <TextField
                label                 = 'First Name'
                value                 = {this.state.firstname}
                onChangeText          = {(firstname) => this.setState({firstname})}
                lineWidth             = {1}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {4}
                labelHeight           = {16}
                keyboardType          = 'default'
                ref={input => (this.firstname = input)}
                onSubmitEditing={() => this.lastname.focus()}

              />
            </View>
            {this.state.firstNameError? (
              <View style={styles.error}>
                 <Text style={[styles.errorText,{textAlign:'left'}]} >{this.state.firstNameError}</Text>
              </View>
               ): null }
            <View style={styles.formInputView}>
              <TextField
                label                 = 'Last Name'
                value                 = {this.state.lastname}
                onChangeText          = {(lastname) => this.setState({lastname})}
                lineWidth             = {1}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {4}
                labelHeight           = {16}
                keyboardType          = 'default'
                ref={input => (this.lastname = input)}
                onSubmitEditing={() => this.email.focus()}
              />
            </View>
            {this.state.lastNameError ? (
              <View style={styles.error}>
                <Text style={styles.errorText}>{this.state.lastNameError}</Text>
              </View>
            ) : null}

            <View style={styles.formInputView}>
              <View>
                <Text style={{fontSize:12,color:'#aaa'}}>Email Id</Text>
              </View>
              <View>
                <Text style={{fontSize:15,color:'#000'}} >{this.state.emailId}</Text>
              </View>
            </View>

            <View style={styles.formInputView}>
              <View>
                <Text style={{fontSize:12,color:'#aaa'}}>Mobile Number</Text>
              </View>
              <View>
                <Text style={{fontSize:15,color:'#000'}} >{this.state.mobNumber}</Text>
              </View>
            </View>


            <View style={{
                alignItems: 'center',
                marginTop: 15
              }}>
              <Button onPress = {this.updateProfile.bind(this)}
              buttonStyle     = {styles.buttonLarge}
              title           = "UPDATE" />
            </View>

          </View>
    </View>
         
    );
  }
}


export default createContainer((props) => {

  const postHandle      = Meteor.subscribe('projectSettingsPublish');
  const loading         = postHandle.ready();
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  return{
    loading,
    s3Data,
  }

}, EditMyProfileForm);