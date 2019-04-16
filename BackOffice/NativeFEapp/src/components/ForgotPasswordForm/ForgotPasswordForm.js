import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Meteor, {Accounts, createContainer} from 'react-native-meteor';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import ValidationComponent from 'react-native-form-validator';

import styles from './styles.js';

export default class ForgotPasswordForm extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError:'',
      error: null
    };
  }
  componentWillMount() {
    this.mounted = true;
  }
  componentDidMount() {

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
    const {username} = this.state;
    let valid = true;
    this.validate({
      username:{numbers:true,minlength:9,maxlength:10,required:true}

    });
    if(this.isFieldInError('username')){
      let usernameError = this.getErrorsInField('username');
      console.log(usernameError);
      this.setState({usernameError});
      valid = false;
    }else{
      this.setState({usernameError:''});
    }
    return valid;
  }
  handleSendOTP =()=>{
    const { username } = this.state;
    const { navigate } = this.props;
    if(this.validInput()){

       let OTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 99999;
       console.log('OTP ',OTP);
       Meteor.call('userExists', username, (err, res) => {
        if (err) {
          console.log(err.reason);
          this.setState({usernameError:err.reason});
        }
        if (res == true) {
          console.log('user found!');
          console.log(OTP);
          if(this.state.usernameError)
            this.setState({usernameError:""});
          Meteor.call('sendSMSMsg', username, 'Your OTP for pamtap app is ' + OTP, (err) => {
            if (err) {
              console.log(err);
            } else {
              Meteor.call('updateOTP', username, OTP, (err) => {
                if (err) {
                  console.log(err);
                  this.setState({usernameError:err.reason});
                } else {
                  console.log('otp ', OTP);
                  if(this.state.usernameError)
                    this.setState({usernameError:""});
                  // Actions.SubmitOTP({"username": username, "propOTP": OTP});
                  navigate('ReceivedOTP',{propParamOTP:OTP,propParamUsername:username});
                }
              });
            }
          });
        } else {
          // Actions.SignUp({'username': username});
          this.setState({usernameError:"User doesn't exist please sign up!"});
        }
      });
    }
  }
  render() {
    return (
    <View style={styles.setHeight}>
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
            label                 = 'Registered Mobile Number *'
            onChangeText          = {(username) => this.setState({username})}
            lineWidth             = {1}
            tintColor             = "#00b8FF"
            inputContainerPadding = {4}
            labelHeight           = {16}
            keyboardType          = 'phone-pad'
          />
        </View>
        {this.state.usernameError? (
          <View style={styles.error}>
             <Text style={[styles.errorText,{textAlign:'left'}]} >{this.state.usernameError}</Text>
          </View>
           ): null }
        <View style={{
                      alignItems: 'center',
                      marginTop: 0,
                      marginBottom:20
                    }}>
                    <Button
                      onPress={this.handleSendOTP}
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
