import React from 'react';
import PropTypes from 'prop-types';
import Meteor,{ createContainer } from 'react-native-meteor';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  BackHandler,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import styles from './styles.js';
import Logo from '../../components/Logo/Logo.js';
import SubmitOTPForm from '../../components/SubmitOTPForm/SubmitOTPForm.js';

export default class SubmitOTP extends React.Component{
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
    const { navigate, goBack,state } = this.props.navigation;
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        <Logo/>
        {/*<Text style={{color:'#aaa',fontSize:25,paddingBottom:20}} >
          OTP Verification
        </Text>*/}
        <View style={styles.container}>
          {/*<SubmitOTPForm navigate={navigate} firstName={state.params.firstName} lastName={state.params.lastName} email={state.params.email} password={state.params.password}  username={state.params.username} signUpOTP={state.params.OTP} value={state.params.value} navigate={navigate} goBack={goBack} />*/}
          <SubmitOTPForm 
            navigate={navigate} 
            userId={state.params.userId} 
            firstName={state.params.firstName} 
            lastName={state.params.lastName} 
            email={state.params.email} 
            password={state.params.password}  
            mobileNumber={state.params.mobileNumber} 
            mobileotp={state.params.mobileotp} 
            emailotp={state.params.emailotp} 
            otpFor={state.params.otpFor} 
            goBack={goBack} 
          />
          {/*<SubmitOTPForm navigate={navigate} userId={''} firstName={''} lastName={''} email={''} password={''}  mobileNumber={''} mobileotp={'1111'} emailotp={'222333'} navigate={navigate} goBack={goBack} />*/}        
        </View>
      </ScrollView>
    );

  }
}
