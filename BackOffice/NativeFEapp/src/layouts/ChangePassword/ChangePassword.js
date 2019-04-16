import React,{Component } from 'react';
import Meteor,{createContainer} from 'react-native-meteor';

import { Platform, ScrollView, StyleSheet, Text,TouchableOpacity, TextInput, View, BackHandler, Alert, Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid ,Package} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';

import { TextField } from 'react-native-material-textfield';
import { sha256 } from 'react-native-sha256';

import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import PropTypes from 'prop-types';

import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';

export default class ChangePassword extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state={
      name                :name,
      isOpen              : false,
      selectedItem        : 'About',
      inputFocusColor     : '#00b8FF',
      currentPassword     : '',
      newPassword         : '',
      reTypeNewPwd        : '',
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
  }
 

  handleSubmit = (event) => {

    event.preventDefault();
    const { state } = this.props.navigation;

    var oldpassword = this.state.currentPassword;
    var newPassword = this.state.newPassword;
    var reTypeNewPwd = this.state.reTypeNewPwd;

    console.log('oldpassword:',oldpassword);
    console.log('newPassword:',newPassword);
    console.log('reTypeNewPwd:',reTypeNewPwd);

    if(newPassword == reTypeNewPwd){

      sha256(oldpassword).then( hash => {
        // console.log(hash);
           Meteor.call('currentPassword',hash,(error,result) =>{
                if(error){
                   Alert.alert('Error',error.reason);
                }else{
                  // console.log('result: ',result);
                  if(result){
                     // console.log('newPassword: ',newPassword);
                     Meteor.call('changeUserPassword',newPassword,(error,result) =>{
                          // console.log('result new: ',result);
                          if(error){
                            Alert.alert('Error',error.reason);
                          }
                          Alert.alert(
                            "Success!",
                            "Customer Updated Successfully",
                            [{ text: "OK"}],
                            { cancelable: false }
                          );
                            
                        });
                  }else{
                    Alert.alert(
                      '','The old Password you have entered is incorrect!',
                    );
                  }

                }
              });
      });    
    }else{
        Alert.alert(
          '','New Password does not match with re-type Password!',
        );
    }
    // Meteor.logout();
     // this.props.navigation.navigate('LogIn');

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
    if(this.props.navigation.state.routeName != 'LogIn'){
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

    
    var userData = Meteor.user();
    const {navigate}  = this.props.navigation;
    const { state }   = this.props.navigation;
    const menu = <Menu navigate={navigate} userName={this.props.userName}/>;
    var navigationView = (
      <ScrollView style={{backgroundColor: '#fbae16'}} createContainerstyle={{flex: 1,backgroundColor: '#fbae16'}} keyboardShouldPersistTaps="always">
        <View style={{borderBottomWidth: 1, padding:10, borderColor: '#fff'}}>
          <View style={{maxHeight: 30, flexDirection:'row', justifyContent: 'flex-start'}} >
            <TouchableOpacity onPress={this.closeDrawer} >
              <View>
                <Icon size={25} name='close' type='evilicon' color='#000' />
              </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center',flex: 1, lineHeight: 30, fontSize: 30, color: '#fff'}}>
              NOTIFICATION
            </Text>
          </View>
        </View>
        <View>
          <Text style={{textAlign:'center',fontWeight:'bold', fontSize: 20,paddingTop: 10}}>Newly Added</Text>
        </View>
      </ScrollView>
    );

    return(
      <DrawerLayoutAndroid
       drawerWidth={300}
        ref={(_drawer) => this.drawer = _drawer}
       drawerPosition={DrawerLayoutAndroid.positions.Right}
       renderNavigationView={() => navigationView}>
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
         <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>
            <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>

              <Header
                centerComponent={{ text: "AssureID", style: { color: '#fff' } }}
                leftComponent={
                  <TouchableOpacity  onPress={this.toggle} >
                    <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                  </TouchableOpacity>
                }
                outerContainerStyles={{borderBottomWidth:0, backgroundColor: '#367fa9',height:60,paddingTop:0,margin:0}}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                rightComponent={<View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                        <TouchableOpacity onPress={this.openDrawer}>
                            <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                            <Text style={styles.notificationText}>9</Text>
                      </TouchableOpacity>
                    </View>
                    }
                />

                <Header
                  centerComponent={{ text: "My Profile", style:{ color: '#fff',alignSelf:'center'} }}
                  leftComponent={
                    <TouchableOpacity>
                      <Icon size={25} name='arrow-left' type='feather' color='#fff' />
                    </TouchableOpacity>
                  }
                  outerContainerStyles={{borderColor:'transparent', backgroundColor: '#3c8dbc',height:50,padding:10,margin:0}}
                  innerContainerStyles={{marginTop:0,paddingTop:0}}
                />
                <Text style={{alignSelf:'center',paddingTop:20,fontSize:15}}>Change Password</Text>
                <View style={styles.formContainer}>
                  <View style={styles.formInputView}>
                    <TextField
                      label                 = 'Current Password'
                      onChangeText          = {(currentPassword) => this.setState({currentPassword})}
                      value                 = {this.state.currentPassword}
                      lineWidth             = {1}
                      tintColor             = {this.state.inputFocusColor}
                      inputContainerPadding = {4}
                      secureTextEntry       ={true}
                      labelHeight           = {16}
                      keyboardType          = 'default'
                    />
                  </View>
                  <View style={styles.formInputView}>
                    <TextField
                      label                 = 'New Password'
                      onChangeText          = {(newPassword) => this.setState({newPassword})}
                      value                 = {this.state.newPassword}
                      lineWidth             = {1}
                      tintColor             = {this.state.inputFocusColor}
                      inputContainerPadding = {4}
                      secureTextEntry       ={true}
                      labelHeight           = {16}
                      keyboardType          = 'default'
                    />
                  </View>
                  <View style={styles.formInputView}>
                    <TextField
                      label                 = 'Re-type New Password'
                      onChangeText          = {(reTypeNewPwd) => this.setState({reTypeNewPwd})}
                      value                 = {this.state.reTypeNewPwd}
                      lineWidth             = {1}
                      tintColor             = {this.state.inputFocusColor}
                      inputContainerPadding = {4}
                      secureTextEntry       ={true}
                      labelHeight           = {16}
                      keyboardType          = 'default'
                    />
                  </View>
                </View>
                <View style={{ flexDirection: "row",marginLeft: 23 }}>
                  <Button
                    textStyle={{ textAlign: "center" }}
                    buttonStyle={styles.button}
                    title="CANCLE"
                  />
                  <Button
                    onPress={this.handleSubmit}
                    textStyle={{ textAlign: "center" }}
                    buttonStyle={styles.button1}
                    title="SAVE"
                  />
                </View>
                </ScrollView>
              </View>
            </SideMenu>
          </DrawerLayoutAndroid>
    );
  }
}
