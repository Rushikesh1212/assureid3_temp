import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, ScrollView, Text, View, BackHandler, ImageBackground, Image, TouchableOpacity } from 'react-native';

import styles from './styles.js';
import Logo from '../../components/Logo/Logo.js';
import SignUpForm from '../../components/SignUpForm/SignUpForm.js';

export default class SignUp extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler(){
    console.log(this.props.navigation.state.routeName );
    if(this.props.navigation.state.routeName != 'LogIn'){
      this.props.navigation.goBack(null);
      return true;
    }
    return true;
  }
  static onEnter(){
    console.log('On Enter LoggedIn');
  }

  render(){
    const rules = {
       alphabets: /^[a-zA-Z]+(\.\w+)+$/,
       numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
       email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
       required: /\S+/,
       date(format="YYYY-MM-DD", value) {
         const d = moment(value, format);
         if(d == null || !d.isValid()) return false;
         return true;
       },
       minlength(length, value) {
         if (length === void(0)) {
           throw 'ERROR: It is not a valid length, checkout your minlength settings.';
         } else if(value.length > length) {
           return true;
         }
         return false;
       },
       maxlength(length, value) {
         if (length === void(0)) {
           throw 'ERROR: It is not a valid length, checkout your maxlength settings.';
         } else if (value.length > length) {
           return false;
         }
         return true;
      }
    };
    const messages = {
      en: {
        email      : "Please enter a valid Email address.\n",
        alphabets  : "Plese enter  a valid Name.\n",
        numbers    : 'Please enter a valid Mobile number.\n',
        required   : 'This Field is mandatory.\n',
        minlength  : 'This Field length must be greater than {1}.\n',
        maxlength  : 'This Field length must be lower than {1}.\n'
      }
    };
    const { navigate,goBack } = this.props.navigation;
    return (
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <Logo/>
          <Text style={{color:'#aaa',fontSize:25,paddingBottom:50}}>Sign Up</Text>
        </View>
        <SignUpForm messages={messages} rules={rules} navigate={navigate} goBack={goBack} />
      </ScrollView>
      );
    }
  }
