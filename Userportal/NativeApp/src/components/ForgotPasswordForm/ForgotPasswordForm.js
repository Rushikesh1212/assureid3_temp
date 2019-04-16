import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Meteor, { Accounts } from 'react-native-meteor';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import ValidationComponent from 'react-native-form-validator';

import styles from './styles.js';

export default class ForgotPasswordForm extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      // username: '',
      // usernameError:'',
      email: '',
      emailError:'',
      mobile:'',
      mobileError:'',
      error: null,
      "subscription" : { 
        user : Meteor.subscribe("userfunction"), 
      }
    };
    // this.state ={
      
    // }
  }
  componentWillMount() {
    this.mounted = true;
  }
  
  componentWillUnmount() {
    this.mounted = false;
  }
  handleError = (error) => {
    if (this.mounted) {
      this.setState({error});
    }
  }
  validInput = () => {
    const {email, mobile} = this.state;
    let valid = true;
    this.validate({
      email:{email:true,required:true},
      mobile:{numbers:true,minlength:9,maxlength:10,required:true}
    });
    if(this.isFieldInError('email')){
      let emailError = this.getErrorsInField('email');
      console.log(emailError);
      this.setState({emailError});
      valid = false;
    }else{
      this.setState({emailError:''});
    }

    if(this.isFieldInError('mobile')){
      let mobileError = this.getErrorsInField('mobile');
      console.log(mobileError);
      this.setState({mobileError});
      valid = false;
    }else{
      this.setState({mobileError:''});
    }

    return valid;
  }
  // handleSendOTP =()=>{
  //   const { username } = this.state;
  //   const { navigate } = this.props;
  //   if(this.validInput()){

  //      let OTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 99999;
  //      console.log('OTP ',OTP);
  //      Meteor.call('userExists', username, (err, res) => {
  //       if (err) {
  //         console.log(err.reason);
  //         this.setState({usernameError:err.reason});
  //       }
  //       if (res == true) {
  //         console.log('user found!');
  //         console.log(OTP);
  //         if(this.state.usernameError)
  //           this.setState({usernameError:""});
  //         Meteor.call('sendSMSMsg', username, 'Your OTP for pamtap app is ' + OTP, (err) => {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             Meteor.call('updateOTP', username, OTP, (err) => {
  //               if (err) {
  //                 console.log(err);
  //                 this.setState({usernameError:err.reason});
  //               } else {
  //                 console.log('otp ', OTP);
  //                 if(this.state.usernameError)
  //                   this.setState({usernameError:""});
  //                 // Actions.SubmitOTP({"username": username, "propOTP": OTP});
  //                 navigate('ReceivedOTP',{propParamOTP:OTP,propParamUsername:username});
  //               }
  //             });
  //           }
  //         });
  //       } else {
  //         // Actions.SignUp({'username': username});
  //         this.setState({usernameError:"User doesn't exist please sign up!"});
  //       }
  //     });
  //   }
  // }
  forgotpassword = () => {
    const { navigate }    = this.props;
    const {mobile, email} = this.state;
    const otpFor = "newPassword";
    
    if(this.validInput()){
      console.log("email = ",email," mobile = ",mobile);

      // var allUsers = Meteor.collection('users').find({});
      // console.log("allUsers = ",allUsers);

      var userOtp = Meteor.collection('users').findOne({"username":email});
      console.log("userOtp = ",userOtp);
      if(userOtp){
        var mobileotp = Math.floor(1000 + Math.random() * 9000);
        var emailotp  = Math.floor(100000 + Math.random() * 900000);
        // Session.set('mobotp',mobileotp);
        // Session.set('mailotp',emailotp);
        var userId = userOtp._id;
        // Session.set('newID',newID);

        Meteor.call('addOTP', userId , mobileotp, emailotp, function(error,result){
          if(error){
            Alert.alert(error.reason);
          }else{

          }
        });
       
        //Send OTP     
        var mobileotpStr = mobileotp.toString();
        var smsBody      = "Enter "+mobileotpStr+" to verify your account on ASSUREiD.";
        Meteor.call('SEND_SMS',mobile,smsBody,
        function(error,result){
          if(error){
            console.log(error.reason);
          }else{
            // console.log(result.content);
            console.log('Successfully sent the OTP to your mobile number');
          }
        });  
                              
        // SEND EMAIL VERIFICATION LINK
        Meteor.call('sendVerificationLinkToUser', userId, function(error,result){
          if(error){
            Alert.alert(error);
          }else{  
            console.log('Successfully sent the OTP to your email address.');                   
          } //end else
        }); // send verification mail ends
            
        var firstName = '',lastName = '',password = '',mobileNumber = '';
        navigate("SubmitOTP",{userId,firstName,lastName,email,password,mobileNumber,mobileotp,emailotp,otpFor});
        // $('.modalContent').removeClass('addModalHeight');
        // $('#ForgotBlock').hide();
        // $('#OtpBlock').show();
        // $('#OTPMobMail').addClass('newPassword'); 
      }else{
        Alert.alert('','Either email address or mobile number is incorrect');                   
      }  
    }// if validInput  

  }
  render() {
    // var allUsers = Meteor.collection('users').find({});
    // var allUsers = Meteor.collection('users').find();
    // console.log("render allUsers = ",allUsers);
    return (
    <View style={styles.setHeight}>
      <View style={styles.formContainer}>
        {/*<View>
          <Text style={{
              color: '#aaa',
              fontSize: 16,
              marginHorizontal:15,
              textAlign:'center',
              paddingBottom:25
            }}>Enter your Registered Mobile Number to receive OTP to reset password</Text>
        </View>*/}
        <View style={styles.formInputView}>
          <TextField
            label                 = 'Email Id *'
            onChangeText          = {(email) => this.setState({email})}
            lineWidth             = {1}
            tintColor             = "#00b8FF"
            inputContainerPadding = {4}
            labelHeight           = {16}
            keyboardType          = 'default'
          />
        </View>
        {this.state.emailError? (
          <View style={styles.error}>
             <Text style={[styles.errorText,{textAlign:'left'}]} >{this.state.emailError}</Text>
          </View>
           ): null }

        <View style={styles.formInputView}>
          <TextField
            label                 = 'Mobile Number *'
            onChangeText          = {(mobile) => this.setState({mobile})}
            lineWidth             = {1}
            tintColor             = "#00b8FF"
            inputContainerPadding = {4}
            labelHeight           = {16}
            keyboardType          = 'phone-pad'
          />
        </View>
        {this.state.mobileError? (
          <View style={styles.error}>
             <Text style={[styles.errorText,{textAlign:'left'}]} >{this.state.mobileError}</Text>
          </View>
           ): null }

        <View style={{
                      alignItems: 'center',
                      marginTop: 20,
                      marginBottom:20
                    }}>
                    <Button
                      onPress={this.forgotpassword}
                      buttonStyle = {styles.buttonLarge}
                      title       = "SEND OTP"
                    />
        </View>
        <View style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginRight: 100
          }}>
          <Icon name="chevrons-left" type="feather" color='#aaa'/>
          <Text style={{
              color: '#aaa',
              fontSize: 16
            }}>Already Registered?
          </Text>
          <TouchableOpacity onPress={() => this.props.goBack()} style={{
              borderBottomColor: '#54Aff3',
              borderStyle: 'dashed',
              borderBottomWidth: 1,
              paddingBottom: 1
            }} >
            <Text style={{fontSize: 16,color: '#54Aff3' }}> SIGN IN </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    );
  }
}
