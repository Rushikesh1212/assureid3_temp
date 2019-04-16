import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Meteor, {Accounts, createContainer} from 'react-native-meteor';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import ValidationComponent from 'react-native-form-validator';


import { TextField } from 'react-native-material-textfield';


import styles from './styles.js';

export default class ReceivedOTPForm extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputOTP: '',
      error: null
    };
  }
  componentWillMount() {
    this.mounted = true;
    console.log('mounted login form');
  }
  componentDidMount() {

  }
  componentWillUnmount() {
    this.mounted = false;
    console.log('unmounting login form');
  }
  handleError = (error) => {
    if (this.mounted) {
      this.setState({error});
    }
  }
  validInput = () => {
    const {inputOTP} = this.state;
    let valid = true;
    if (inputOTP.length === 0 ) {
       this.handleError('OTP field cannot be empty.');
       valid = false;
    }
    if (valid) {
      this.handleError(null);
    }
    return valid;
  }
  handleVerifyOTP =()=>{
    const { inputOTP } = this.state;
    const { navigate, propParamOTP,propParamUsername } = this.props;
    console.log(propParamOTP,propParamUsername);
    console.log(inputOTP);
    if (this.validInput()) {
      if(inputOTP != propParamOTP){
        this.handleError('Invalid OTP entered');
      }else{
        navigate('ResetPassword',{username:propParamUsername});
      }
    }
  }
  handleReSendOTP =()=>{
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
  }
  render() {
    return (
      <View style={styles.formContainer}>

        <View>
          <Text style={{
              color: '#aaa',
              fontSize: 16,
              marginHorizontal:15,
              textAlign:'center',
              paddingBottom:25
            }}>Enter your Registered Mobile Number to receive OTP to reset password</Text>
        </View>
        <View style={styles.formInputView}>
          <TextField
            label                 = 'OTP Received *'
            onChangeText          = {(inputOTP) => this.setState({inputOTP})}
            lineWidth             = {1}
            tintColor             = "#00b8FF"
            inputContainerPadding = {4}
            labelHeight           = {16}
            keyboardType          = "phone-pad"
          />
        </View>
        {
          this.state.error ?
            <View style={styles.error}>
              <Text style={styles.errorText}>{this.state.error}</Text>
            </View>
          :
          null
        }

        <View style={{
                          alignItems: 'center',
                          marginTop: 0,
                          marginBottom:20
                        }}>
                        <Button
                        onPress={this.handleVerifyOTP}
                          buttonStyle = {styles.buttonLarge}
                          title       = "RESET PASSWORD"
                        />
        </View>

        <View style={{
            flexDirection: 'row',
            marginRight:75,
          }}>
          <Text style={{
              color: '#aaa',
              fontSize: 16
            }}> Not received yet? </Text>
          <TouchableOpacity style={{
              borderBottomColor: '#54Aff3',
              borderStyle: 'dashed',
              borderBottomWidth: 1
              }} >
            <Text style={{
                textAlign: 'right',
                fontSize: 16,
                color: '#54Aff3',

              }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
