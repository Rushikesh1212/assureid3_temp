import React, { Component } from "react";
import PropTypes from "prop-types";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Button, Icon } from "react-native-elements";
import {Alert} from 'react-native';

import { TextField } from "react-native-material-textfield";

import styles from "./styles.js";

export default class SubmitOTPForm extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      mobileOtp: "",
      emailOtp: "",
      error: null,
      mobOtpError:null,
      emailOtpError:null,
    };
  }
  componentWillMount() {
    this.mounted = true;
    console.log("mounted login form");
  }
  componentDidMount() {}
  componentWillUnmount() {
    this.mounted = false;
    console.log("unmounting login form");
  }
  handleError = (state,error) => {
    // if (this.mounted) {
    //   this.setState({ error });
    // }
    console.log("state = ",state," error = ",error);
    if (this.mounted) {
      this.setState({[state] : error });
    }
  };
  validInput = () => {
    const { mobileOtp, emailOtp } = this.state;
    let valid = true;
    if(mobileOtp.length === 0) {
      this.handleError("mobOtpError","Mobile OTP field cannot be empty.");
      valid = false;
    }
    else if(mobileOtp != this.props.mobileotp){
      this.handleError("mobOtpError","Invalid Mobile OTP Entered.");
      valid = false;
    }
    // else if (valid) {
    //   this.handleError(null);
    // }
    if(emailOtp.length === 0) {
      this.handleError("emailOtpError","Email OTP field cannot be empty.");
      valid = false;
    }
    else if(emailOtp != this.props.emailotp){
      this.handleError("emailOtpError","Invalid Email OTP Entered.");
      valid = false;
    }
    return valid;
  };
  
  verifySignupOTP = () => {
    const {
      userId,
      firstName,
      lastName,
      email,
      password,
      mobileNumber,
      mobileotp,
      emailotp,
      navigate,
    } = this.props;
    // let OTP = signUpOTP;
    var inputEmailOtp = this.state.emailOtp;
    var inputMobOtp   = this.state.mobileOtp;

    if (this.validInput()) {

      console.log("input valid....");
      console.log("inputEmailOtp = ",inputEmailOtp," emailotp = ",emailotp);
      console.log("inputMobOtp = ",inputMobOtp," mobileotp = ",mobileotp);

      // if((mobileotp === inputMobOtp) && (emailotp === inputEmailOtp)){
      //   console.log("otp matched....");
      // }else{
      //   console.log("otp not matched....");
      // }
      
    // if(mobileotp == inputMobOtp && emailotp == inputEmailOtp){
      Meteor.call('createUserByAdminSetEmailToTrue',userId, (error,result)=>{
        if(error){
          console.log(error.reason);
        }else{

        // console.log("email: ",email);
        // console.log("password: ",passwordVar);  

          Meteor.loginWithPassword(email, password, (error) => {
            if (error) {
              console.log('error: ',error);
            } else {
              console.log("User Logged in....");
              navigate('MyProfile');
            }
          }); 
        }//else
      });// Meteor.call

      Meteor.call('updateOTP', userId , mobileotp, emailotp , function(error,result){
        if(error){
          Alert.alert(error);
        }else{
          // var adminData   = Meteor.collection('users').findOne({'roles' : "admin"});
          // var userData    = Meteor.collection('users').findOne({"_id" : userId});
          // // console.log(userData);
          // if (adminData) {
          //   var adminId  = adminData._id;
          // }
          // // console.log("adminId",adminId);
          // if (userData) {
          //   if (userData.profile) {
          //     var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
          //     var mobNumber   = userData.profile.mobNumber;
          //   }
          // }
          // // console.log("mobNumber",mobNumber);
          // var newDate     = new Date();

          // var msgvariable = {                       
          //                   '[username]' : firstLastNm,
          //                   '[date]'     : moment(newDate).format("DD/MM/YYYY"),
          //                  };
          // // Format for send Email //
          // var emailObj = {
          //     from         : adminId,
          //     to           : newID,
          //     templateName : 'New Registration',
          //     variables    : msgvariable,
          // }
          // // sendMailNotification(inputObj);
          
          // // Format for sending SMS //
          // var smsObj = {
          //     to           : newID,
          //     templateName : 'New Registration',
          //     number       : mobNumber,
          //     variables    : msgvariable,
          // }
          // console.log("smsObj",smsObj);
          // // sendSMS(smsObj);

          // // Format for sending notification //
          // var notifictaionObj = {
          //   to           : newID,
          //   templateName : 'New Registration',
          //   variables    : msgvariable,
          // }
          // // sendInAppNotification(notifictaionObj);
          // Meteor.call('sendNotifications',emailObj,smsObj,notifictaionObj,(error,result)=>{
          //   if(error){
          //     console.log(error.reason);
          //   }else{
          //     console.log("sent notifications");
          //   }
          // });
          console.log("userId = ",userId);
          Meteor.call('sendUserNotifications',userId,'New Registration',(error,result)=>{
            if(error){
              console.log(error.reason);
            }else{
              console.log("sent notifications");
            }
          });

        }
      });

    // } //if
    // else{
    //   Alert.alert('','Either email OTP or mobile OTP is incorrect');
    // }
      // hack because react-native-meteor doesn't login right away after sign in
      // let role = "";
      // if (value == 0) {
      //   role = "vendor";
      // } else {
      //   role = "user";
      // }
      // Meteor.call("add-Role", role, err => {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log("Success user role added");
      //   }
      // });

      

      // navigate("LogIn");
    } // if validInput
  }

  verifyNewPasswordOTP = () =>{
    const {
      userId,
      email,
      mobileotp,
      emailotp,
      navigate,
    } = this.props;
    // let OTP = signUpOTP;

    var inputEmailOtp = this.state.emailOtp;
    var inputMobOtp   = this.state.mobileOtp;

    if (this.validInput()) {
      // var userData = Meteor.collection('users').findOne({"username":username});
      // if(userData){
      //   var userId = userData._id;
      // }

      Meteor.call('updateOTP', userId , mobileotp, emailotp , (error,result) =>{
        if(error){
          Alert.alert(error);
        }else{
          console.log("ResetPassword now....");
          navigate('ResetPassword',{userId});
        }
      });


    }
  } 

  handleReSendOTP = () => {
    // const { inputOTP } = this.state;
    // const { navigate, propParamOTP,propParamUsername } = this.props;
    //
    //  let OTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 99999;
    //  Meteor.call('userExists', username, (err, res) => {
    //   if (err) {
    //     console.log(err.reason);
    //   }
    //   if (res == true) {
    //     console.log('user found!');
    //     console.log(OTP);
    //     Meteor.call('sendSMSMsg', username, 'Your OTP for pamtap app is ' + OTP, (err) => {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         Meteor.call('updateOTP', username, OTP, (err) => {
    //           if (err) {
    //             console.log(err);
    //           } else {
    //             console.log('otp ', OTP);
    //             // Actions.SubmitOTP({"username": username, "propOTP": OTP});
    //             navigate('ReceivedOTP',{propParamOTP:OTP});
    //           }
    //         });
    //       }
    //     });
    //   } else {
    //     // Actions.SignUp({'username': username});
    //     navigate('SignUp');
    //   }
    // });
  };
  render() {
    console.log();
    return (
      <View style={styles.formContainer}>
        <View style={{marginVertical:10}}>
          {/*<Text
            style={{
              color: "#aaa",
              fontSize: 16,
              marginHorizontal: 15,
              textAlign: "center",
              paddingBottom: 25
            }}
          >
            Enter your Registered Mobile Number to receive OTP to reset password
          </Text>*/}
          <Text style={styles.headingText}>We have sent you an OTP</Text>
          <Text style={styles.headingText}>to your registered email Id and mobile no.</Text>
          <Text style={styles.headingText}>Enter your OTP below.</Text>
        </View>
        <View style={styles.formInputView}>
          <TextField
            label="6 digits OTP sent on email Id *"
            onChangeText={emailOtp => this.setState({ emailOtp })}
            lineWidth={1}
            tintColor="#00b8FF"
            inputContainerPadding={4}
            labelHeight={16}
            keyboardType="phone-pad"
          />
        </View>
        {this.state.emailOtpError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.emailOtpError}</Text>
          </View>
        ) : null}

        <View style={styles.formInputView}>
          <TextField
            label="4 digits OTP sent on mobile no. *"
            onChangeText={mobileOtp => this.setState({ mobileOtp })}
            lineWidth={1}
            tintColor="#00b8FF"
            inputContainerPadding={4}
            labelHeight={16}
            keyboardType="phone-pad"
          />
        </View>
        {this.state.mobOtpError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.mobOtpError}</Text>
          </View>
        ) : null}

        <View
          style={{
            alignItems: "center",
            marginTop: 30,
            marginBottom: 20
          }}
        >
        {this.props.otpFor == "newPassword" ?
          <Button
            onPress     = {this.verifyNewPasswordOTP}
            buttonStyle = {styles.buttonLarge}
            title       = "VERIFY"
          />
        :
          <Button
            onPress     = {this.verifySignupOTP}
            buttonStyle = {styles.buttonLarge}
            title       = "VERIFY"
          />
        }
        </View>

        <View
          style={{
            flexDirection: "row",
            marginRight: 75
          }}
        >
          <Text
            style={{
              color: "#aaa",
              fontSize: 16
            }}
          >
            {" "}
            Not received yet?{" "}
          </Text>
          <TouchableOpacity
            style={{
              borderBottomColor: "#00b8FF",
              borderStyle: "dashed",
              borderBottomWidth: 1
            }}
          >
            <Text
              style={{
                textAlign: "right",
                fontSize: 16,
                color: "#00b8FF"
              }}
            >
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


// handleVerifyOTP = () => {
  //   const { inputOTP } = this.state;
  //   const {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     confirmPassword,
  //     signUpOTP,
  //     username,
  //     navigate,
  //     value
  //   } = this.props;
  //   let OTP = signUpOTP;
  //   console.log("outer firstname = ",this.props.firstName);


  //   var latestUsersDetails  = Meteor.collection('users').findOne({'profile.loginAs':'user'},{sort: {"createdAt":-1}});
  //     // console.log('latestUsersDetails:',latestUsersDetails);
  //     if(latestUsersDetails){
  //       if(latestUsersDetails.profile){
  //         if(latestUsersDetails.profile.assureId){
  //           var str = latestUsersDetails.profile.assureId;
  //         }else{
  //           var str = "IN-AAA-000000";
  //         }
  //       }
  //     }else{
  //       var str = "IN-AAA-000000";
  //     }

  //     var type = 'user';
  //     var splitStr = str.split('-');
  //     //splitStr[0] - Country Code
  //     //splitStr[1] - Character Code
  //     //splitStr[2] - Number
  //     //Number Logic
  //     // document.getElementById("demo").innerHTML = str;
  //     var firstChar = splitStr[1].substr(2,1);
  //     var middleChar = splitStr[1].substr(1,1);
  //     var lastChar = splitStr[1].substr(0,1);
  //     //Charcter Code Calculation
  //     //if DEG - then G - last E - middle D - first
  //     //var first2Char = splitStr[1].substr(1,1); /*second digit*/
       
  //     var number = parseInt(splitStr[2]);
  //     var last = number + 1;
  //     var last0 = '0';
  //     if(last > 0 && last < 11){
  //       last0 = '00000' + last;
  //       if(last == 10){last0 = '0000' + last;}
  //     }else if(last > 10 && last < 101){
  //       last0 = '0000' + last;
  //       if(last == 100){last0 = '000' + last;}
  //     }else if(last > 100 && last < 1001){
  //       last0 = '000' + last;
  //       if(last == 1000){last0 = '00' + last;}
  //     }else if(last > 1000 && last < 10001){
  //       last0 = '00' + last;
  //       if(last == 10000){last0 = '0' + last;}
  //     }else if(last > 10000 && last < 100001){
  //       last0 = last;
  //     }else if(last > 999999){
  //       last0 = '000000';         
  //       if(firstChar != 'Z'){
  //         var firstAscii = firstChar.charCodeAt();
  //         firstAscii = firstAscii + 1;
  //         firstChar = String.fromCharCode(firstAscii);
  //       }else{
  //         firstChar = 'A'; 
  //         if(middleChar != 'Z'){
  //           var middleAscii  = middleChar.charCodeAt();
  //           middleAscii  = middleAscii  + 1;
  //           middleChar = String.fromCharCode(middleAscii );
  //         }else{
  //           middleChar = 'A'; 
  //           if(type == 'user'){
  //             var lastAscii = lastChar.charCodeAt();
  //             if(lastChar == 'B'){
  //               lastAscii = lastAscii + 2;
  //             }else{
  //               lastAscii = lastAscii + 1;
  //             }
  //             lastChar = String.fromCharCode(lastAscii );
  //           }
  //         } 
  //       }
  //     }

      
  //     var newAssureID = splitStr[0] + '-' + lastChar+middleChar+firstChar + '-' + last0;

  //     console.log('newAssureID:',newAssureID);


  //   if (this.validInput()) {
  //     // console.log("firstname = ",firstname);
  //    // userId = Accounts.createUser(
  //    //    {
  //    //      username,
  //    //      email,
  //    //      password,
  //    //      profile: {
  //    //        firstName,
  //    //        lastName,
  //    //        OTP
  //    //      }
  //    //    },
  //    //    err => {
  //    //      if (err) {
  //    //        this.handleError(err.reason);
  //    //      } else {
  //    //        console.log("userCreated ");
  //    //      }
  //    //    }
  //    //  );

  //     var formValues = {
  //       'firstname'        : this.props.firstName,
  //       'lastname'         : this.props.lastName,
  //       'signupEmail'      : this.props.email,
  //       'mobNumber'        : this.props.username,
  //       'signupPassword'   : this.props.password,
  //       'assureId'         : newAssureID,
  //     }

  //     console.log("formValues = ",formValues);

  //     Meteor.call('userCreateAccount', formValues ,(error,result) => {
  //         if(error){
  //           Alert.alert(error.reason);
  //         }else{      
  //           var userId = result;
  //           console.log("newUserId ",userId);
  //           var basicformValues = {
  //             "userId"          : userId,
  //             "firstName"       : this.props.firstName,
  //             "lastName"        : this.props.lastName,
  //             "fatherFirstName" : '',
  //             "fatherLastName"  : '',
  //             "motherFirstName" : '',
  //             "motherLastName"  : '',
  //             "spouseFirstName" : '',
  //             "spouseLastName"  : '',
  //             "gender"          : 'female',
  //             "dateOfBirth"     : '',
  //             "mobileNo"        : this.props.username,
  //             "altMobileNo"     : '',
  //             "emailId"         : this.props.email,
  //             "altEmailId"      : '',
  //             'assureId'        : newAssureID,
  //             "proofType"       : '',
  //             "proofOfDocument" : '',
  //             "fileExt"         : '',
  //             "fileName"        : '',
  //           }

  //           Meteor.call("insertBasicData",basicformValues,'',(error,result) =>{
  //             if(error){
  //               console.log(error.reason);
  //               Alert.alert(
  //                 'Error',
  //               )
  //             }else{
  //               console.log("user details saved");
  //             }
  //           });

  //           Meteor.call('addOTP', userId , this.props.OTP, '', function(error,result){
  //             if(error){
  //               Alert.alert(error);
  //             }else{

  //             }
  //           });
            
  //           var Role  = "user";
  //           Meteor.call('addRoles', userId , Role, function(error,result){
  //             if(error){
  //               Alert.alert(error);
  //             }else{
  //               console.log("Success user role added");
  //             }
  //           }); // add role
  //         }
  //     });

  //     // hack because react-native-meteor doesn't login right away after sign in
  //     // let role = "";
  //     // if (value == 0) {
  //     //   role = "vendor";
  //     // } else {
  //     //   role = "user";
  //     // }
  //     // Meteor.call("add-Role", role, err => {
  //     //   if (err) {
  //     //     console.log(err);
  //     //   } else {
  //     //     console.log("Success user role added");
  //     //   }
  //     // });

      

  //     navigate("LogIn");
  //   }
  // }