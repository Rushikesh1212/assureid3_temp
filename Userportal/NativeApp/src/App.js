import React, {Component} from 'react';
import { View,StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Meteor, { createContainer } from 'react-native-meteor';

import {HomeStack,AuthStack} from './config/routes.js';
import Loading from './components/Loading';
import settings from './config/settings';

Meteor.connect(settings.METEOR_URL);

class App extends Component {
  constructor(props) {
     super(props);
   }
  render() {
    const { status, user, loggingIn } = this.props;
    // console.log(settings.METEOR_URL);
    // console.log('ddp connection',status.connected);
    // console.log('loggingIn',loggingIn);
    // console.log('user',user);
    if (status.connected === false || loggingIn) {
      return <Loading />;
    }else if(user !== null){
      return(
        <AuthStack />
      );
    }
    return (
    <HomeStack />
  );
  }
}
App.propTypes = {
  status    : PropTypes.object,
  user      : PropTypes.object,
  loggingIn : PropTypes.bool,
};

export default createContainer((props) => {
  return {
    status    : Meteor.status(),
    user      : Meteor.user(),
    loggingIn : Meteor.loggingIn(),
  };
}, App);
