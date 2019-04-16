import React,{ Component } from "react";
import Meteor,{ Accounts, createContainer } from "react-native-meteor";

import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { Button, Icon } from "react-native-elements";
import { TextField } from "react-native-material-textfield";

import ValidationComponent from "react-native-form-validator";
import PropTypes from "prop-types";

import styles from "./styles.js";

export default class ResetPasswordForm extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordError:'',
      confirmPasswordError:'',
      confirmPassword: "",
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
      this.setState({ confirmPasswordError : error });
    }
  };
  validInput = () => {
    const { password, confirmPassword , passwordError, confirmPasswordError} = this.state;
    let valid = true;

    this.validate({
      password:{ minlength: 6,maxlength: 12,required:true},
      confirmPassword:{required:true}
    });
    if (this.isFieldInError("password")) {
      this.setState({ passwordError: this.getErrorsInField('password') });
      valid = false;
    }else{
      this.setState({passwordError:""})
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
    // if (password.length === 0 || confirmPassword.length === 0) {
    //   this.handleError("Fields cannot be empty.");
    //   valid = false;
    // }
    if (password != confirmPassword || password.length != 0) {
        this.setState({confirmPasswordError:"Password and confirm password fields do not match."})
        valid = false;
    }
    if (valid) {
      this.handleError(null);
    }
    return valid;
  };
  handleSetPassword = () => {
    const { password, confirmPassword } = this.state;
    const { propParamUsername, navigate } = this.props;
    if (this.validInput()) {
      Meteor.call("setPassword", propParamUsername, password, (err, res) => {
        if (err) {
          this.handleError(err.reason);
        }
        navigate("LogIn");
      });
    } else {
      navigate("SignUP");
    }
  };
  render() {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formInputView}>
          <TextField
            label="New Password *"
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
            secureTextEntry={true}
            ref={input => (this.confirmPassword = input)}
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
            alignItems: "center",
            marginTop: 0,
            paddingVertical:20
          }}
        >
          <Button
            onPress={this.handleSetPassword}
            buttonStyle={styles.buttonLarge}
            title="RESET PASSWORD"
          />
        </View>
      </View>
    );
  }
}
