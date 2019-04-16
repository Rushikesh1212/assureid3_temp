import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';


export default class Settings extends React.Component {
  constructor(props){
    super(props);
    let name ="";
   
    this.state={
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
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
    console.log('androidBackHandler: ',this.props.navigation );
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
    // console.log('opening drawer!');
          this.drawer.openDrawer();
  }
  closeDrawer(){

    this.drawer.closeDrawer();
  }

  closeControlPanel = () => {
    this._drawer.close()
  }
  openControlPanel = () => {
    this._drawer.open()
  }

  render(){

    const {navigate}   = this.props.navigation;

    const { state,goBack }    = this.props.navigation;
    const menu         = <Menu navigate={navigate} userName={this.props.userName}/>;
    var navigationView = (
      <ScrollView style={styles.notifView} createContainerstyle={{flex: 1,backgroundColor: '#fbae16'}} keyboardShouldPersistTaps="always">
        <View style={{borderBottomWidth: 1, padding:10, borderColor: '#000'}}>
          <View style={{maxHeight: 30, flexDirection:'row', justifyContent: 'flex-start'}} >
            <TouchableOpacity onPress={this.closeControlPanel} >
              <View>
                <Icon size={25} name='close' type='evilicon' color='#000' />
              </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center',flex: 1, lineHeight: 30, fontSize: 30, color: '#000'}}>
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
     
      <Drawer
        ref={(ref) => this._drawer = ref}
        content={navigationView}
        openDrawerOffset={(viewport) => viewport.width - 300}
        side="right"
        >
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
                outerContainerStyles={styles.outerContent}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                rightComponent={<View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                        <TouchableOpacity onPress={this.openControlPanel}>
                            <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                            <Text style={styles.notificationText}>9</Text>
                      </TouchableOpacity>
                    </View>
                    }
                />

                
                <HeaderDy headerTitle="Settings" goBack={goBack}/>

                <Text style={{alignSelf:'center',paddingTop:20,fontSize:15}}>Change Password</Text>
                <View style={styles.formContainer}>
                  <View style={styles.formInputView}>
                    <TextField
                      label                 = "Current Password"
                      lineWidth             = {1}
                      tintColor             = {this.state.inputFocusColor}
                      inputContainerPadding = {8}
                      labelHeight           = {18}
                      labelPadding          = {8}
                      labelFontSize         = {14}
                      keyboardType          = 'default'
                      inputContainerStyle   = {{height:60}}
                      style                 = {styles.inputText}
                      labelTextStyle        = {styles.labelText}
                      activeLineWidth       = {0}
                      fontSize              = {this.state.fontSize}
                      // labelFontSize         = {this.state.fontSize}

                      onChangeText          = {(currentPassword) => this.setState({currentPassword})}
                      value                 = {this.state.currentPassword}

                    />
                  </View>
                  <View style={styles.formInputView}>
                    <TextField
                      label                 = "New Password"
                      lineWidth             = {0}
                      tintColor             = {this.state.inputFocusColor}
                      inputContainerPadding = {4}
                      labelHeight           = {16}
                      labelFontSize         = {14}
                      labelPadding          = {8}
                      keyboardType          = 'default'
                      inputContainerStyle   = {{height:60}}
                      style                 = {styles.inputText}
                      labelTextStyle        = {styles.labelText}
                      activeLineWidth       = {0}
                      fontSize              = {this.state.fontSize}
                      // labelFontSize         = {this.state.fontSize}

                      onChangeText          = {(newPassword) => this.setState({newPassword})}
                      value                 = {this.state.newPassword}

                    />
                  </View>
                  <View style={styles.formInputView}>
                    <TextField
                      label                 = "Re-type New Password"
                      lineWidth             = {0}
                      tintColor             = {this.state.inputFocusColor}
                      inputContainerPadding = {12}
                      labelHeight           = {16}
                      labelFontSize         = {14}
                      labelPadding          = {8}
                      keyboardType          = 'default'
                      inputContainerStyle   = {{height:60}}
                      style                 = {styles.inputText}
                      labelTextStyle        = {styles.labelText}
                      activeLineWidth       = {0}
                      fontSize              = {this.state.fontSize}
                     // z labelFontSize         = {this.state.fontSize}

                      onChangeText          = {(reTypeNewPwd) => this.setState({reTypeNewPwd})}
                      value                 = {this.state.reTypeNewPwd}

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
            </Drawer>
    );
  }
}
