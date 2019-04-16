import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Meteor, { Accounts, createContainer } from 'react-native-meteor';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { Button, Icon } from 'react-native-elements';

import styles from './styles.js';
import Loading from '../Loading';

export default class Form extends Component<{}> {
	constructor(props) {
		super(props);
    let username = "";
    if(this.props.username){
      username = this.props.username;
    }
		this.state = {
			username: username,
			error: null,
		};
	}
	componentWillMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;

	}
	handleError = (error) => {
		if (this.mounted) {
			this.setState({ error });
		}
	}
	validInput = () => {
    const { username } = this.state;
    let valid = true;

    if ( username.length === 0) {
      this.handleError('Moblie number field cannot be empty.');
      valid = false;
    }
    if (valid) {
      this.handleError(null);
    }
    return valid;
  }
  handleSignIn = () => {
    const {  username } = this.state;
    let  OTP = Math.floor(Math.random() * (99999 - 10000 + 1)) + 99999;

		Meteor.call('userExists',username,(err,res)=>{
			if(err){
				console.log(err.reason);
			}
			if(res == true){
				console.log('user found!');
				console.log(OTP);
				Meteor.call('sendSMSMsg',username,'Your OTP for e-duca app is '+OTP,(err)=>{
					if(err){
						console.log(err);
					}else{
							Meteor.call('updateOTP',username,OTP,(err)=>{
								if(err){
									console.log(err);
								}else{
									console.log('otp ', OTP);
									Actions.SubmitOTP({"username":username,"propOTP":OTP});
								}
							});
						}
					});
			}else{
			  Actions.SignUp({'username':username});
			}
		});
}
	render(){
      if(this.props.username){
        return(
    			<View style={styles.container}>
            <View style={styles.inputView}>
              <Icon name="smartphone" type="feather" color='#aaa' />
              <TextInput style={styles.inputBox}
      						onChangeText={(username) => this.setState({ username })}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.username}
                  placeholderTextColor = "#aaa"
                  selectionColor="#aaa"
                  keyboardType="phone-pad"
                  />
            </View>
    				<View style={styles.error}>
              <Text style={styles.errorText}>{this.state.error}</Text>
            </View>
            <View style={{alignItems:'center',paddingTop:80}} >
              <Button buttonStyle={styles.buttons}  iconRight={{name: 'arrow-right', type: 'feather', size: 30, style:{color: '#fbae16', } }} textStyle={{color:'#fbae16'}} title="REQUEST OTP"  onPress={this.handleSignIn} />
            </View>
      		</View>
    		);
      }else{
    		return(
    			<View style={styles.container}>
            <View style={styles.inputView}>
              <Icon name="smartphone" type="feather" color='#aaa' />
              <TextInput style={styles.inputBox}
      						onChangeText={(username) => this.setState({ username })}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  value={this.state.username}
                  placeholder="Mobile Number"
                  placeholderTextColor = "#aaa"
                  selectionColor="#aaa"
                  keyboardType="phone-pad"
                  />
            </View>
    				<View style={styles.error}>
              <Text style={styles.errorText}>{this.state.error}</Text>
            </View>
            <View style={{alignItems:'center',paddingTop:80}} >
              <Button buttonStyle={styles.buttons}  iconRight={{name: 'arrow-right', type: 'feather', size: 30, style:{color: '#fbae16', } }} textStyle={{color:'#fbae16'}} title="REQUEST OTP"  onPress={this.handleSignIn} />
            </View>
      		</View>
  		  );
      }
	}
}
