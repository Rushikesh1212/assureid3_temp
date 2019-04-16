import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid, WebView } from 'react-native';
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

import ComingSoon from './ComingSoon.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';
import Video from 'react-native-video';


class NewsFeed extends React.Component {
  constructor(props){
    super(props);
    let name ="";
   
    this.state={
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#f7ac57',
      muted : true
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
                
                <HeaderDy headerTitle="News Feed" goBack={goBack}/>

                {this.props.loading ?
                  this.props.newsFeeds.length>0
                  ?
                    this.props.newsFeeds.map((newsFeeds, index)=>{
                      return(
                        <Card key={index} containerStyle={styles.cardOrder}>
                          <View style={styles.cardHeader}>
                            {newsFeeds.newsVideoType == 'LocalImage' 
                            ? 
                              <View style={{flex:1,alignSelf:'center',paddingVertical:10}}>
                                <Image style={{width:100, height:100, borderRadius: 15,}} resizeMode="stretch" 
                                  source={{uri: newsFeeds.newsImage}}/>
                              </View>
                            :
                              newsFeeds.newsVideoType == 'YouTubeVideo' 
                              ?
                                <View style={{height:200}}>
                                  {/*<Video source={{uri: newsFeeds.newsYouTubeVideo}} // Looks for .mp4 file (background.mp4) in the given expansion version.
                                                                      poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
                                                                      ref={(ref) => {
                                                                            this.player = ref
                                                                          }}  
                                                                      resizeMode="cover"           // Fill the whole screen at aspect ratio.
                                                                      repeat={false}                // Repeat forever.
                                                                    />*/}
                                  <WebView
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    source={{uri: newsFeeds.newsYouTubeVideo }}
                                  />
                                </View>
                              :
                                <View style={{height:200}}>
                                  {/*<Video
                                                                      repeat={true}
                                                                      muted={this.state.muted}
                                                                      // muted={true}
                                                                      // paused={true}
                                                                      playInBackground={false}
                                                                      resizeMode='cover'
                                                                      // onFullscreenPlayerWillPresent={this.fullScreenPlayerWillPresent}
                                                                      // source={require('../../videos/videoplayback.mp4')}
                                                                      source={{ uri: this.props.newsFeeds.newsVideo}}
                                                                      // style={[ styles.backgroundVideo, {height: window.height/2, width: window.width}  ]}
                                                                    />*/}
                                  <WebView
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    source={{uri: newsFeeds.newsVideo }}
                                  />
                                </View>
                            }
                            <View style={{flex:1,paddingHorizontal:5,}}>
                              <View style={{flex:1,paddingHorizontal:5, paddingTop: 5,paddingBottom:15,alignItems:'center'}}>
                                <Text style={{fontWeight:'bold',alignItems:'center',fontSize:20}}>{newsFeeds.newsFeedTitile}</Text>
                              </View>
                              <View style={{flex:1,paddingHorizontal:5, paddingTop: 5,paddingBottom:15}}>
                                <Text style={{flexWrap:'wrap'}}>{newsFeeds.newsDescription}</Text>
                              </View>
                              
                            </View>
                          </View>
                        </Card>
                      );
                    })
                  :
                    <View>
                      <Text>No Records Found!</Text>
                    </View> 
                :
                  <Loading/>
                }
                
                </ScrollView>
              </View>
            </SideMenu>
             </Drawer>
    );
  }
}
export default createContainer((props) => {
  const postHandle  = Meteor.subscribe('newsFeedData');
  var newsFeeds     = Meteor.collection('newsFeeds').find({})||[];
  const loading     = postHandle.ready();
  console.log('newsFeeds ',newsFeeds);

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  
  return {
      loading,
      newsFeeds,
      notificationCount
  };
}, NewsFeed);