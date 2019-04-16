import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert, Dimensions,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';

import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
const window = Dimensions.get('window');

export default class ProfileNavigation extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state={
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#f7ac57',
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  handleView(){
    Actions.ViewCustomer();
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler(){
    console.log(this.props.navigation.state.routeName );
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
  }
  toggle() {
    console.log('is open ' + this.state.isOpen);
    let isOpen = !this.state.isOpen;
      this.setState({
        isOpen
      });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
  });

  handleLogout(){
    console.log('Logout function!');
    Meteor.logout();
    Actions.LogIn();
  }
  openDrawer(){
    console.log('opening drawer!');
          this.drawer.openDrawer();
  }
  closeDrawer(){
    console.log('opening drawer!');
          this.drawer.closeDrawer();
  }

  render(){
    
    return(
      <View style={{marginTop:0,height:window.height/4-20,backgroundColor:'#00b8ff'}}>
        {/*<Image style={styles.imgDisplay}  resizeMode="stretch"
          source={require('../../images/assureid/profileBack.jpg')}/>*/}
        
        <ImageBackground 
          source={require('../../images/assureid/profileBack.jpg')}
          style={styles.bgImage}
          resizeMode="stretch"
        >

          <View style={{flexDirection:'row'}}>
            <View style={{height:60, width:60,alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={()=>this.props.navigate(this.props.prevLink)}>
              <View style={{backgroundColor:'#00b8ff',height:40,width:40,alignItems:'center',justifyContent:'center',borderRadius:40/2}}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>{this.props.prevCount}</Text>
              </View>
              </TouchableOpacity>
            </View>

            <View style={{backgroundColor:'transparent',height:60,width:60,alignItems:'center',justifyContent:'center',borderRadius:60/2}}>
              <Icon 
                size={25} 
                name='linear-scale' 
                type='material-icons' 
                color='#fff' 
              />
            </View>

            <View style={{backgroundColor:'#0a8fc4',height:60,width:60,alignItems:'center',justifyContent:'center',borderRadius:60/2,borderColor:'#fff',borderWidth:2}}>
              <Icon 
                size={25} 
                name={this.props.iconName} 
                type='font-awesome' 
                color='#fff' 
              />
            </View>

            <View style={{backgroundColor:'transparent',height:60,width:60,alignItems:'center',justifyContent:'center',borderRadius:40/2}}>
              <Icon 
                size={25} 
                name='linear-scale' 
                type='material-icons' 
                color='#fff' 
              />
            </View>

            <View style={{height:60, width:60,alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={()=>this.props.navigate(this.props.nextLink)}>
              <View style={{backgroundColor:'#00b8ff',height:40,width:40,alignItems:'center',justifyContent:'center',borderRadius:40/2}}>
                <Text style={{color:'#fff',fontWeight:'bold'}}>{this.props.nextCount}</Text>
              </View>
              </TouchableOpacity>
            </View>

          </View>
          <View style={{paddingTop:5}}>
            <Text style={{color:'#fff',fontWeight:'bold'}}>{this.props.formName}</Text>
          </View>
        </ImageBackground>

      </View>
    );
  }
}
