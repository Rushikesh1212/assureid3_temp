import React, { Component } from "react";
import PropTypes from "prop-types";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { Header, Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { TextField } from "react-native-material-textfield";
import ValidationComponent from 'react-native-form-validator';
import { robotoWeights } from 'react-native-typography';

import styles from "./styles.js";
import Loading from "../Loading";

export default class HeaderDy extends React.Component {
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
      this.setState({ error });Header
    }
  };

  render() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "ServiceList" })]
    });
    const {goBack, headerTitle } = this.props;
    return (
      <Header
        centerComponent={ <Text style={[(robotoWeights.bold),{fontSize:15,color:'#fff',textAlign:'center',paddingBottom:4}]}>{headerTitle}</Text>}
        leftComponent={
          <TouchableOpacity  onPress={()=>  this.props.goBack(null)} >
            <Icon size={25} name='arrow-left' type='feather' color='#fff' />
          </TouchableOpacity>
        }
        outerContainerStyles={{ borderColor:'transparent', backgroundColor: '#3c8dbc',height:50,padding:10,margin:0}}
        innerContainerStyles={{marginTop:0,paddingTop:0}}
        />
    );
  }
}
