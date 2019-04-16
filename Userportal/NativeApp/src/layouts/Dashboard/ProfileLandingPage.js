import React, { Component } from "react";
import PropTypes from "prop-types";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import {
  StyleSheet,
  Text,
  View,
  TextInput,BackHandler,
  TouchableOpacity, ScrollView, DrawerLayoutAndroid, Image, Dimensions
} from "react-native";
import Moment from 'moment';
import SideMenu from 'react-native-side-menu';
import { Header, Button, Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";

import styles from "./styles.js";
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
// import ProgressBar from 'react-native-simple-progressbar';
import Carousel from 'react-native-carousel-view';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import LatestUpdates from '../Services/LatestUpdates.js';
import OurServices from '../Services/OurServices.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class ProfileLandingPage extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    
    this.state={
      name:name,
      isOpen: false,
      selectedItem: 'About',
      notificationCount:0,
      enabled:true,
    };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));

  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler= ()=>{
    console.log(this.props.navigation.state.routeName );
    if(this.props.navigation.state.routeName != 'ServiceList'){
      this.props.navigation.goBack(null);
      return true;
    }
    return true;
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

  closeControlPanel = () => {
    this._drawer.close()
  }
  openControlPanel = () => {
    this._drawer.open()
  }
  linkToServiceInfo = (id) =>{
    this.props.navigation.navigate('ServiceInfo',{id:id});
  }

  render(){
    const { navigate,goBack } = this.props.navigation;
    const menu = <Menu navigate={navigate} userName={this.props.userName}/>;
    const barWidth = Dimensions.get('screen').width - 20;
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
        // openDrawerOffset={(viewport) => 0}
        side="right"
        >
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
          <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>
                  <Header
                    centerComponent={{ text: "AssureID", style: { color: '#fff', fontSize:17 } }}
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
              <ScrollView 
                createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}
                scrollEnabled={this.state.enabled}
              >
                     
                    <View style={styles.formContainer}>
                        <View style={{backgroundColor: '#0a8fc4', flex: 1, flexDirection: 'column',}}>
                          <View style={styles.profile}>
                            {this.props.loading1 ?
                              <View>
                              { this.props.userprofileObj.userProfile ? 
                                <Image style={styles.profileimg} source={{uri: this.props.userprofileObj.userProfile}}/>
                              :
                                <Image style={styles.profileimg} source={require('../../images/assureid/userIcon.png')}/>
                              }
                              </View>
                              
                              :
                              null
                            }

                            {this.props.loading ?
                              <View style={{justifyContent:'center'}}>
                                  <Text style={styles.profileContent}>{this.props.usersDetails.profile.firstname} {this.props.usersDetails.profile.lastname}</Text>
                                  <Text style={styles.profileContent}>AssureID: {this.props.usersDetails.profile.assureId}</Text>
                              </View>
                              : null
                            }
                              <TouchableOpacity onPress={()=> this.props.navigation.navigate('ViewProfile')}>
                              <View>
                                <View style={styles.viewBlock}><Text style={styles.profileContent}>View/Edit Profile</Text></View>
                              </View>
                              </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row',paddingHorizontal:10,alignItems:'center',justifyContent:'center'}}>
                            <Text style={styles.profileContent}>Profile Completion Status : </Text>

                            <Text style={styles.profileContent}>{this.props.userprofileObj.profilePercent}%</Text>

                          </View>
                          <View style={{alignItems:'center',paddingBottom:10}}>
                            <ProgressBarAnimated
                              width={barWidth}
                              value={this.props.userprofileObj.profilePercent}
                              backgroundColor={"#00b8ff"}
                              barEasing={"ease"}
                              backgroundColorOnComplete="#6CC644"
                              borderColor={"#f1f2f7"}
                            />
                          </View>
                        </View>
                        
                        <View style={{ flex: 1,backgroundColor: "#f1f2f7" }}>
                        
                        {/*<ScrollView 
                          style={[styles.compcontentBox,{maxHeight:210}]}
                          onTouchStart={(ev) => { 
                            this.setState({enabled:false }); }}
                          onMomentumScrollEnd={(e) => { this.setState({ enabled:true }); }}
                          onScrollEndDrag={(e) => { this.setState({ enabled:true }); }}
                        >
                          <Text style={{padding:5,color:'#666'}}>Our Services</Text>
                            <OurServices navigate={this.props.navigation.navigate} showLess={true} />
                        </ScrollView>*/}

                        <View style={[styles.compcontentBox,{}]}>
                          <Text style={{padding:5,color:'#666'}}>Our Services</Text>
                          <OurServices navigate={this.props.navigation.navigate} showLess={true} />
                        </View>

                        <View style={styles.compcontentBox}>
                          <Text style={{padding:5,color:'#666'}}>Who viewed your profile</Text>
                          <View style={{flex:1,backgroundColor:'#fff',padding:10,flexDirection:'row',justifyContent:'space-between'}}>
                            <View style={{flex:0.22,alignItems:'center',borderWidth:1,borderColor:'#00b8ff',borderRadius:2}}>
                              <Image style={{height:60,width:60}} source={require('../../images/view-1.png')}/>
                            </View>
                            <View style={{flex:0.22,alignItems:'center',borderWidth:1,borderColor:'#00b8ff',borderRadius:2}}>
                              <Image style={{height:60,width:60}} source={require('../../images/view-2.png')}/>
                            </View>
                            <View style={{flex:0.22,alignItems:'center',borderWidth:1,borderColor:'#00b8ff',borderRadius:2}}>
                              <Image style={{height:60,width:60}} source={require('../../images/view-3.png')}/>
                            </View>
                            <View style={{flex:0.22,alignItems:'center',borderWidth:1,borderColor:'#00b8ff',borderRadius:2}}>
                              <Image style={{height:60,width:60}} source={require('../../images/view-4.png')}/>
                            </View>
                          </View>
                        </View>

                          {/*<ScrollView style={[styles.compcontentBox,{maxHeight:300}]}
                            onTouchStart={(ev) => { 
                              this.setState({enabled:false }); }}
                            onMomentumScrollEnd={(e) => { this.setState({ enabled:true }); }}
                            onScrollEndDrag={(e) => { this.setState({ enabled:true }); }}
                          >
                            <Text style={{padding:5,color:'#666'}}>Latest Updates</Text>
                            <LatestUpdates navigate={this.props.navigation.navigate} />
                          </ScrollView>*/}

                        <View style={styles.compcontentBox}>
                            <Text style={{padding:5,color:'#666'}}>Latest Updates</Text>
                            <LatestUpdates navigate={this.props.navigation.navigate} showLess={true} />
                        </View>

                          {this.props.loading ?
                            <View style={{borderBottomWidth:0,borderBottomColor:'#ddd',flex:1}}>
                              <Text style={{padding:15,fontSize:12,}}>
                                Latest Login: {Moment(this.props.usersDetails.status.lastLogin.date).format('dddd, Do MMMM YYYY, h:mm:ss a')}
                              </Text>
                            </View>
                            :
                              null
                          }

                        </View>
                    </View>


              </ScrollView>
            </View>
          </SideMenu>
       </Drawer>

    );
  }
}

export default createContainer((props) => {
    const postHandle    = Meteor.subscribe('userData',Meteor.userId());
    const postHandle1   = Meteor.subscribe('userprofile',Meteor.userId());
    const postHandle2   = Meteor.subscribe("services");
    const orderHandle   = Meteor.subscribe("allOrders");
    const loading       = postHandle.ready();
    const loading1      = postHandle1.ready();
    const loading2      = postHandle2.ready() && orderHandle.ready();

    var _id = Meteor.userId();
    const usersDetails   = Meteor.collection('users').findOne({"_id":_id})||{};
    const userprofileObj = Meteor.collection('userProfile').findOne({'userId': _id}) || {} ;
    const services       = Meteor.collection('services').find({})||[];
    
    const notifPostHandle = Meteor.subscribe('userNotification');
    var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
    
    return {
        loading,
        loading1,
        usersDetails,
        userprofileObj,
        loading2,
        services,
        notificationCount
    };

}, ProfileLandingPage);


