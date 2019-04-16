import React, { Component } from "react";
import Meteor, { Accounts } from "react-native-meteor";
import { Platform, StyleSheet, Text, View, TextInput, TouchableOpacity,Alert} from "react-native";
import { Button, Icon, CheckBox } from "react-native-elements";
import { TextField } from "react-native-material-textfield";

import ValidationComponent from "react-native-form-validator";
import RadioButton from "radio-button-react-native";

import styles from "./styles.js";

export default class SignUpForm extends ValidationComponent {
  constructor(props) {
    super(props);
    let username = "";
    if (this.props.username) {
      username = this.props.username;
    }
    this.mounted = false;
    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstNameError: "",
      lastNameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      usernameError: "",
      isChecked:false,
      isCheckedError:"",
      error: null,
      value: 0
    };
  }
  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  handleError = error => {
    if (this.mounted) {
      this.setState({ error });
    }
  };
  handleOnChange = () => {
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked });
  };
  handlePasswordError = error => {
    if (this.mounted) {
      this.setState({ confirmPasswordError : error});
    }
  };
  validInput = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      username
    } = this.state;
    let valid = true;

      this.validate({
        firstName: {
          minlength: 3,
          maxlength: 12,
          required: true,
        },
        lastName: {
          minlength: 3,
          maxlength: 12,
          required: true,

        },
        email: { email: true, required: true },
        username: { numbers: true, minlength: 9, maxlength: 10,required:true },
        password: { minlength: 6,maxlength: 12, required: true},
        confirmPassword: { required: true }
      });

    if (this.isFieldInError("firstName")) {
      let firstNameError = this.getErrorsInField('firstName');
      console.log('firstNameError ',firstNameError);
      this.setState({ firstNameError });
      valid = false;
    }else{
      this.setState({firstNameError:""})
    }
    if (this.isFieldInError("lastName")) {
      this.setState({ lastNameError: this.getErrorsInField('lastName') });
      valid = false;
    }else{
      this.setState({lastNameError:""})
    }
    if (this.isFieldInError("username")) {
      this.setState({ usernameError: this.getErrorsInField('username') });
      valid = false;
    }else{
      this.setState({usernameError:""})
    }
    if (this.isFieldInError("email")) {
      this.setState({ emailError: this.getErrorsInField('email') });
      valid = false;
    }else{
      this.setState({emailError:""})
    }
    if (this.isFieldInError("password")) {
      this.setState({ passwordError: this.getErrorsInField('password') });
      valid = false;
    }else{
      this.setState({passwordError:""})
    }
    if(!this.state.isChecked){
      this.setState({ isCheckedError: "You must agree to all terms and conditions" });
      valid = false;
    }else{
      this.setState({isCheckedError:""})
    }
  //     this.handleError(null);
  //   }
    if (this.isFieldInError("confirmPassword")) {
      this.setState({
        confirmPasswordError: this.getErrorsInField('confirmPassword')
      });
      valid = false;
    }else{
      this.setState({confirmPasswordError:""})
    }
    console.log(this.state.firstNameError);
    console.log('password ', password != confirmPassword);
    if(password != confirmPassword) {
      console.log('true??');
      this.handlePasswordError(
        "Password and confirm password fields do not match."
      );
      valid = false;
    }

    // if (
    //   firstName.length === 0 ||
    //   lastName.length === 0 ||
    //   email.length === 0 ||
    //   password.length === 0 ||
    //   confirmPassword.length === 0 ||
    //   username.length === 0
    // ) {
    //   this.handleError("Fields cannot be empty.");
    //   valid = false;
    // }
    if (valid) {
      this.handleError(null);
    }
    console.log('valid : ',valid);
    console.log('error ',this.getErrorMessages('\n'));
    return valid;
  };
  handleCreateAccount = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      username,
      value
    } = this.state;
    let OTP = "";
      if (this.validInput()) {
        let OTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 99999;
        if(this.state.username && this.state.email){
          Meteor.call('userExistEmailUsername',username,email,(err,res)=>{
            if(err){
              Alert.alert(
                err.reason,
                "Sorry! Some error occoured!",
                [{ text: "OK"}],
                { cancelable: false }
              );
            }
            console.log('res : ',res);
            if(!res){
              Meteor.call(
                "sendSMSMsg",
                username,
                "Your OTP for pamtap app is " + OTP,
                err => {
                  if (err) {
                    Alert.alert(
                      err.reason,
                      "Sorry! Some error occoured!",
                      [{ text: "OK"}],
                      { cancelable: false }
                    );
                  } else {
                    this.props.navigate("SubmitOTP", {
                      firstName,
                      lastName,
                      email,
                      password,
                      OTP,
                      username,
                      value
                    });
                  }
                }
              );
            }else{
              Alert.alert(
                "Sorry! This email or mobile number is already registered.",
                "Please login or reset password or use different email and mobile number to continue.",
                [{ text: "OK"}],
                { cancelable: false }
              );
            }
          });
        }
      }
  };

  handleOnPress(value) {
    this.setState({ value });
  }

  render() {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formInputView}>
          <TextField
            label="First Name *"
            onChangeText={firstName => this.setState({ firstName })}
            lineWidth={1}
            tintColor="#f7ac57"
            inputContainerPadding={4}
            labelHeight={16}
            ref={input => (this.firstName = input)}
            onSubmitEditing={() => this.lastName.focus()}
            keyboardType="default"
          />
        </View>
        {this.state.firstNameError? (
          <View style={styles.error}>
             <Text style={[styles.errorText,{textAlign:'left'}]} >{this.state.firstNameError}</Text>
          </View>
           ): null }
        <View style={styles.formInputView}>
          <TextField
            label="Last Name *"
            onChangeText={lastName => this.setState({ lastName })}
            lineWidth={1}
            tintColor="#f7ac57"
            inputContainerPadding={4}
            labelHeight={16}
            ref={input => (this.lastName = input)}
            onSubmitEditing={() => this.mobileNumber.focus()}
            keyboardType="default"
          />
        </View>
        {this.state.lastNameError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.lastNameError}</Text>
          </View>
        ) : null}
        <View style={styles.formInputView}>
          <TextField
            label="Mobile Number *"
            onChangeText={username => this.setState({ username })}
            lineWidth={1}
            tintColor="#f7ac57"
            inputContainerPadding={4}
            labelHeight={16}
            ref={input => (this.mobileNumber = input)}
            onSubmitEditing={() => this.email.focus()}
            keyboardType="default"
          />
        </View>
        {this.state.usernameError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.usernameError}</Text>
          </View>
        ) : null}
        <View style={styles.formInputView}>
          <TextField
            label="Email ID *"
            onChangeText={email => this.setState({ email })}
            lineWidth={1}
            tintColor="#f7ac57"
            inputContainerPadding={4}
            autoCapitalize="none"
            labelHeight={16}
            ref={input => (this.email = input)}
            onSubmitEditing={() => this.password.focus()}
            keyboardType="default"
          />
        </View>
        {this.state.emailError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.emailError}</Text>
          </View>
        ) : null}
        <View style={styles.formInputView}>
          <TextField
            label="Password *"
            onChangeText={password => this.setState({ password })}
            lineWidth={1}
            tintColor="#f7ac57"
            inputContainerPadding={4}
            labelHeight={16}
            secureTextEntry={true}
            ref={input => (this.password = input)}
            onSubmitEditing={() => this.confirmPassword.focus()}
            keyboardType="default"
          />
        </View>
        {this.state.passwordError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.passwordError}</Text>
          </View>
        ) : null}
        <View style={styles.formInputView}>
          <TextField
            label="Confirm Password *"
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
            lineWidth={1}
            tintColor="#f7ac57"
            inputContainerPadding={4}
            labelHeight={16}
            ref={input => (this.confirmPassword = input)}
            secureTextEntry={true}
            keyboardType="default"
          />
        </View>
        {this.state.confirmPasswordError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.confirmPasswordError}</Text>
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 15
          }}
        >
          <RadioButton
            currentValue={this.state.value}
            value={0}
            onPress={this.handleOnPress.bind(this)}
          >
            <Text
              style={{
                color: "#aaa",
                fontSize: 16,
                marginRight: 50,
                marginLeft: 5
              }}
            >
              Vendor
            </Text>
          </RadioButton>
          <RadioButton
            currentValue={this.state.value}
            value={1}
            onPress={this.handleOnPress.bind(this)}
          >
            <Text style={{ color: "#aaa", fontSize: 16, marginLeft: 5 }}>
              Customer
            </Text>
          </RadioButton>
        </View>
        <View style={styles.container}>
          <CheckBox
            center
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
            checkedColor="green"
            checked={this.state.isChecked}
            onPress={this.handleOnChange}
            textStyle={{ color: "#aaa" }}
            title="I read and agree to the terms of usage."
          />
        </View>
        {this.state.isCheckedError ? (
          <View style={styles.error}>
            <Text style={styles.errorText}>{this.state.isCheckedError}</Text>
          </View>
        ) : null}
        <View
          style={{
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <Button
            onPress={this.handleCreateAccount}
            buttonStyle={styles.buttonLarge}
            title="SIGN UP"
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.container1}
            onPress={() => this.props.goBack()}
          >
            <Icon name="chevrons-left" type="feather" color="#aaa" />
            <Text
              onPress={this.handleSignIn}
              style={{ color: "#aaa", fontSize: 16 }}
            >
              {" "}
              Already Registered? SIGN IN{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
