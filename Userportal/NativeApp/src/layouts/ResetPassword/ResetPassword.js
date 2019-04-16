import React from 'react';
import PropTypes from 'prop-types';
import Meteor,{ createContainer } from 'react-native-meteor';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import styles from './styles.js';
import Logo from '../../components/Logo/Logo.js';
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm.js';

export default class ResetPassword extends React.Component{
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
        email: "Please enter a valid Email / Mobile number.\n",
        numbers: 'Please enter a valid Mobile number.\n',
        required: 'This Field is mandatory.\n',
        minlength: 'This Field length must be greater than {1}.\n',
        maxlength: 'This Field length must be lower than {1}.\n'
      }
    };
    const { navigate,goBack,state } = this.props.navigation;
    return (
      <ScrollView contentContainerStyle={styles.container} >
        <Logo/>
        <Text style={{color:'#aaa',fontSize:25,paddingBottom:50}} >
          Reset Password
        </Text>
        <View style={styles.containerView}>
          {/*<ResetPasswordForm messages={messages} navigate={navigate} propParamUsername={state.params.username}  goBack={goBack} />*/}
          <ResetPasswordForm 
            messages={messages} 
            navigate={navigate} 
            userId={state.params.userId}  
            goBack={goBack} 
          />
        </View>

      </ScrollView>
    );
  }
}
