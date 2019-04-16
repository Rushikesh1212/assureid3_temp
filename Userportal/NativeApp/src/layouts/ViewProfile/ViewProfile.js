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

import BasicInformation from './BasicInformation.js';
import AddressInformation from './AddressInformation.js';
import AcademicsInformation from './AcademicsInformation.js';
import ExperienceInformation from './ExperienceInformation.js';
import Skills from'./Skills.js';
import CertificationInformation from'./CertificationInformation.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class ViewProfile extends React.Component {
  constructor(props){
    super(props);
    let name ="";
   
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
    
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
  }
  toggle() {
    
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
    // 
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
      <ScrollView style={styles.notifView} createContainerstyle={{flex: 1,backgroundColor: '#fbae16'}}>
        <View style={{borderBottomWidth: 1, padding:15, borderColor: '#fff',backgroundColor: '#0a8fc4'}}>
          <View style={{maxHeight: 30, flexDirection:'row', justifyContent: 'flex-start'}} >
            <TouchableOpacity onPress={this.closeControlPanel} >
              <View>
                <Icon size={25} name='close' type='evilicon' color='#fff' />
              </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center',flex: 1, lineHeight: 30, fontSize: 20, color: '#fff'}}>
              NOTIFICATIONS
            </Text>
          </View>
        </View>
        <View style={{flex:1}}>
          <ShowNotification navigation={this.props.navigation} />
        </View>
      </ScrollView>
    );

    return(
     
      <Drawer
        ref={(ref) => this._drawer = ref}
        content={navigationView}
        // openDrawerOffset={(viewport) => viewport.width - 300}
        side="right"
        >
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
         <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>

              <Header
                centerComponent={{ text: "AssureID", style: { color: '#fff' } }}
                leftComponent={
                  <TouchableOpacity  onPress={this.toggle} >
                    <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                  </TouchableOpacity>
                }
                outerContainerStyles={styles.outerContent}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                rightComponent={
                      <View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                        <TouchableOpacity onPress={this.openControlPanel}>
                          <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                          {this.props.notificationCount>0 ?
                            <Text style={styles.notificationText}>{this.props.notificationCount}</Text> 
                            : 
                              null
                          }
                        </TouchableOpacity>
                      </View>
                    }
                />

                
                <HeaderDy headerTitle="My Profile" goBack={goBack}/>
            
            <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>

              {this.props.loading
              ?
                <View style={{padding:10}}>
                <View>
                  <BasicInformation userprofile={this.props.userData} navigate={this.props.navigation}/>
                </View>
                <View>
                  <AddressInformation 
                    profileId={this.props.userData._id} 
                    permanentAddress={this.props.userData.permanentAddress} 
                    currentAddress={this.props.userData.currentAddress} 
                    currentId={this.props._id} 
                    checkboxRequired={false} 
                    navigate={this.props.navigation}
                  />
                </View>
                <View>
                  <AcademicsInformation key={this.props.userData._id + '-academics'} academicsData={this.props.userData.education} professionalData={this.props.userData.professionalEducation} currentId={this.props._id} checkboxRequired={false} navigate={this.props.navigation}/>
                </View>
                <View>
                  <ExperienceInformation key={this.props.userData._id + '-employement'} employeeData={this.props.userData.employement} currentId={this.props._id} checkboxRequired={false} navigate={this.props.navigation}/>
                </View>
                <View>
                  <Skills userId={this.props.userData.userId} skillData={this.props.userData.skills} currentId={this.props._id} checkboxRequired={false} navigate={this.props.navigation}/>
                </View>
                <View>
                  <CertificationInformation key={this.props.userData._id + '-certificate'} certificateData={this.props.userData.certificates} currentId={this.props._id} checkboxRequired={false} navigate={this.props.navigation}/>
                </View>        
                </View>        
              :
                <Loading />
              }
            </ScrollView>
            </View>
            </SideMenu>
            </Drawer>
    );
  }
}

export default createContainer((props) => {

  var _id = Meteor.userId();
  const postHandle = Meteor.subscribe('userprofile',_id);
  const userData  = Meteor.collection('userProfile').findOne({"userId" : _id})|| {};
  // 
  const loading   = postHandle.ready();
  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  if(userData){
    var imagePath  = userData.userProfile;
    var splitImage = imagePath.split(":");
    if(splitImage[0] == "http"){
       userData.userProfile = "https:"+splitImage[1];
    }
  }
  
   
  return {
    loading,
    userData,
    _id,
    notificationCount
  };

}, ViewProfile);
