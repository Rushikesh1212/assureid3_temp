import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid,ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {withTracker} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import { robotoWeights } from 'react-native-typography';

import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';

class MyProfile extends React.Component {
    constructor(props){
    super(props);
    this.state={
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#f7ac57',
    };
    this.openDrawer  = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle      = this.toggle.bind(this);
    this.handleView  = this.handleView.bind(this);
  }

  handleView(){
    Actions.ViewCustomer();
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {

    // BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler(){
    // console.log(this.props.navigation.state.routeName );
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
  }
  toggle() {
    // console.log('is open ' + this.state.isOpen);
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
    Meteor.logout();
    Actions.LogIn();
  }
  openDrawer(){
    this.drawer.openDrawer();
  }
  closeDrawer(){
    this.drawer.closeDrawer();
  }

  render(){
    var { userData }          = this.props;
    const {navigate, goBack}  = this.props.navigation;
    const { state }           = this.props.navigation;
    const menu                = <Menu navigate={navigate}/>;
    var navigationView        = <NotificationCommon closeDrawer={this.closeDrawer} notificationData={this.props.notificationData} navigation={this.props.navigation}/>


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
                centerComponent={{ text: "ASSUREID", style: { color: '#fff',fontWeight:'bold'} }}
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
                            <Text style={styles.notificationText}>{this.props.notificationData.length}</Text>
                      </TouchableOpacity>
                    </View>
                    }
                />

              <ImageBackground source={require('../../images/Background.png')} style={{width: '100%', height:200}}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <View style={{flex:.2,alignItems:'flex-start'}}>
                    <TouchableOpacity onPress={this.backPressed}>
                      <Icon name="keyboard-arrow-left" type="MaterialIcons" size={50}  color="#333333" />
                    </TouchableOpacity>
                  </View> 
                  <View style={{flex:.5,paddingTop:15,}}>
                    <Text style={[(robotoWeights.bold),{fontSize:18,color:'#333333',textAlign:'center',paddingLeft:27}]}>My Profile</Text>      
                  </View>
                </View>   
                <View style={{flex:.6,alignItems:'center',paddingTop:50}}>
                  <View style={{borderWidth:2,borderColor:'#fff',borderRadius:100,padding:5}}>

                  {userData.profile.userProfile ? 

                    <Avatar
                      width={90}
                      height={90}
                      rounded
                      source={{uri: userData.profile.userProfile }}
                      // source={require('../../images/Vinod.png')}
                      activeOpacity={0.7}
                    />

                    :
                    <Avatar
                      width={90}
                      height={90}
                      rounded
                      source={require('../../images/Vinod.png')}
                      activeOpacity={0.7}
                    />
                  }

                  </View>
                </View>
              </ImageBackground>
              <TouchableOpacity onPress={()=> navigate('EditMyProfile')}>
                <View style={{alignSelf:'flex-end',paddingTop:20,paddingRight:25}}>
                  <Icon size={20} name="edit" type="font-awesome" color="#6d6e70" />
                </View>
              </TouchableOpacity>
                <View style={styles.formContainer}>

                  <View style={{flex:1,flexDirection:"row",paddingVertical:15}}>
                    <View style={{flex:.5,flexDirection:"row"}}>
                      <View style={{flex:.1}}>
                        <Icon size={18} name='user' type='font-awesome' color='#aaa' />
                      </View>
                      <View style={{flex:.9}}>
                        <Text style={[(robotoWeights.medium),{fontSize:14,color:'#666666',paddingLeft:4}]}>First Name</Text>
                      </View>
                    </View>
                    <View style={{flex:.5}}>
                      <Text style={[(robotoWeights.medium),{fontSize:14,color:'#333333'}]}>{userData.profile.firstname}</Text>
                    </View>
                  </View>
                  <View style={{flex:1,flexDirection:"row"}}>
                    <View style={{flex:.5,flexDirection:"row"}}>
                      <View style={{flex:.1}}>
                        <Icon size={18} name='user' type='font-awesome' color='#aaa' />
                      </View>
                      <View style={{flex:.9}}>
                        <Text style={[(robotoWeights.medium),{fontSize:14,color:'#666666',paddingLeft:4}]}>Last Name</Text>
                      </View>
                    </View>
                    <View style={{flex:.5}}>
                      <Text style={[(robotoWeights.medium),{fontSize:14,color:'#333333'}]}>{userData.profile.lastname}</Text>
                    </View>
                  </View>
                  <View style={{flex:1,flexDirection:"row",paddingVertical:15}}>
                    <View style={{flex:.5,flexDirection:"row"}}>
                      <View style={{flex:.1}}>
                        <Icon size={18} name='email' type='zocial' color='#aaa' />
                      </View>
                      <View style={{flex:.9}}>
                        <Text style={[(robotoWeights.medium),{fontSize:14,color:'#666666',paddingLeft:4,marginTop:3}]}>Email Id</Text>
                      </View>
                    </View>
                    <View style={{flex:.5}}>
                      <Text style={[(robotoWeights.medium),{fontSize:14,color:'#333333'}]}>{userData.emails[0].address}</Text>
                    </View>
                  </View>
                  <View style={{flex:1,flexDirection:"row"}}>
                    <View style={{flex:.5,flexDirection:"row"}}>
                      <View style={{flex:.1}}>
                        <Icon size={18} name='old-mobile' type='entypo' color='#aaa' />
                      </View>
                      <View style={{flex:.9}}>
                        <Text style={[(robotoWeights.medium),{fontSize:14,color:'#666666',paddingLeft:4}]}>Mobile Number</Text>
                      </View>
                    </View>
                    <View style={{flex:.5}}>
                      <Text style={[(robotoWeights.medium),{fontSize:14,color:'#333333'}]}>{userData.profile.mobNumber}</Text>
                    </View>
                  </View>
                </View>
                </ScrollView>
              </View>
            </SideMenu>
          </DrawerLayoutAndroid>
    );
  }
}

export default withTracker(props => {
  var _id        = Meteor.userId();
  const handle1  = Meteor.subscribe('currentUserfunction');
  let userData   = Meteor.collection('users').findOne({"_id":_id}) || {};
  // console.log('userData:',userData); 
  const postHandle       = Meteor.subscribe('userNotification');
  const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId()}) || [];

  // console.log('MyProfile notificationData:',notificationData);
  
  return {
    userData         : userData,
    notificationData : notificationData,
  };
})(MyProfile);

