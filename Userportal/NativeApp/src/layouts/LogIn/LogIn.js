import React from 'react';
import PropTypes from 'prop-types';
import Meteor,{ createContainer } from 'react-native-meteor';
import {
  Alert,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View,
  BackHandler,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import styles from './styles.js';
import Logo from '../../components/Logo/Logo.js';
import LoginForm from '../../components/Login/LoginForm.js';



export default class LogIn extends React.Component{
  constructor(props){
    super(props)
  }
  static onEnter(){
    console.log('On Enter loggedOut');
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
  render(){
    const messages = {
      en: {
        email: "Please enter a valid Email / Mobile number.",
        numbers: 'Please enter a valid Email / Mobile number.',
        required: '\nThis Field is mandatory.',
        minlength: '\nPassword length must be greater than {1}.',
        maxlength: '\nPassword length must be lower than {1}.'
      }
    };
    const { navigate,dispatch } = this.props.navigation;
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always" >
        <Logo/>
        <Text style={{color:'#aaa',fontSize:25,paddingBottom:50}}>
          Sign In
        </Text>
        <View style={styles.containerView}>
          <LoginForm messages={messages} deviceLocale="en" navigate={navigate} dispatch={dispatch}/>
        </View>
      </ScrollView>
    );
  }
}
