import React, { Component } from "react";
import Meteor,{ Accounts, createContainer } from "react-native-meteor";
        
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Button, Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { TextField } from "react-native-material-textfield";

import PropTypes from "prop-types";
import ValidationComponent from 'react-native-form-validator';

import styles from "./styles.js";
import Loading from "../Loading";

export default class LoginForm extends ValidationComponent {
  constructor(props) {
    super(props);
    let username = "";
    if (this.props.username) {
      username = this.props.username;
    }
    this.state = {
      username: username,
      user: "",
      userError:'',
      passwordError:'',
      password: "",
      error: null
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
  handleError = error => {
    if (this.mounted) {
      this.setState({ error });
    }
  };
  // validInput = () => {
  //   const { user, password } = this.state;
  //   let valid = true;
  //   if (user.length === 0 || password.length === 0) {
  //     this.handleError("Fields cannot be empty.");
  //     valid = false;
  //   }
  //   if (valid) {
  //     this.handleError(null);
  //   }
  //   return valid;
  // };
  handleSignIn = () => {
    console.log("logging in");
    // if(this.validate({
    //   user:{email:true,required:true},
    //   password:{required:true,minlength:5,maxlength:12}
    // }) || this.validate({
    //   user:{numbers:true,required:true,minlength:9,maxlength:10},
    //   password:{required:true,minlength:5,maxlength:12}
    // }) )
    if(this.validate({
      user:{email:true,required:true},
      password:{required:true,minlength:5,maxlength:12}
    }) ){
      // if (this.validInput(true)) {
        const { user, password } = this.state;
        Meteor.loginWithPassword(user, password, (err) => {
          if (err) {
            console.log(err);
            Alert.alert(
              "Sorry! Unable to login",
              err.reason,
              [{ text: "OK"}],
              { cancelable: false }
            );
            this.handleError("Unable to Login. Check Email and Password.");
          }else{
            this.handleError(null);
          }
        });
      // }
    }
    if(this.isFieldInError('user')){
      this.setState({userError: "Please enter a valid Email.\nThis Field is mandatory."})
    }else{
      this.setState({userError:""});
    }
    if(this.isFieldInError('password')){
      this.setState({passwordError: "Invalid Password.\nThis Field is mandatory."})
    }else{
      this.setState({passwordError:""});
    }
    console.log(this.getErrorMessages('\n'));
  };

  render() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "ServiceList" })]
    });
    return (
      <View style={styles.setHeight}>
        <View style={styles.formContainer}>
          <View style={styles.formInputView}>
            <TextField
              label                 = "Email ID *"
              onChangeText          = {user => this.setState({ user })}
              value                 = {this.state.user}
              lineWidth             = {1}
              tintColor             = "#00b8FF"
              inputContainerPadding = {4}
              labelHeight           = {16}
              keyboardType          = "default"
            />
          </View>
          {this.state.userError? (
            <View style={styles.error}>
               <Text style={[styles.errorText,{textAlign:'left'}]} >{this.state.userError}</Text>
            </View>
             ): null }
          <View style={styles.formInputView}>
            <TextField
              label                 = "Password *"
              onChangeText          = {password => this.setState({ password })}
              lineWidth             = {1}
              tintColor             = "#00b8FF"
              inputContainerPadding = {4}
              labelHeight           = {16}
              secureTextEntry       = {true}
              keyboardType          = "default"
            />
          </View>
          {this.state.passwordError? (
            <View style={styles.error}>
               <Text style={[styles.errorText,{textAlign:'left'}]} >{this.state.passwordError}</Text>
            </View>
             ): null }
          {this.state.error ? (
            <View style={styles.error}>
              <Text style={styles.errorText}>{this.state.error}</Text>
            </View>
          ) : null}
          <View
            style={{
              alignItems: "center",
              marginTop: 0,
              paddingVertical:20
            }}
          >
            <Button
              onPress={this.handleSignIn}
              buttonStyle={styles.buttonLarge}
              title="SIGN IN"
            />
          </View>
          <View
            style={{
              flexDirection: "row",

            }}
          >
           <Icon name="chevrons-left" type="feather" color="#aaa" />
            <TouchableOpacity onPress={() => this.props.navigate("SignUp")}>
              <Text
                style={{
                  color: "#aaa",
                  fontSize: 16,
                  marginRight: 90
                }}
              >
                SignUp
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigate("ForgotPassword")}
            >
              <Text
                style={{
                  color: "#aaa",
                  fontSize: 16
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
