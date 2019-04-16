import React, { Component } from "react";
import PropTypes from "prop-types";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import {
  StyleSheet,
  Text,
  View,
  TextInput,BackHandler,
  TouchableOpacity, ScrollView, DrawerLayoutAndroid, Image
} from "react-native";
import SideMenu from 'react-native-side-menu';
import { Header, Button, Icon } from "react-native-elements";
import { NavigationActions } from "react-navigation";

import styles from "./styles.js";
import Menu from '../../components/Menu/Menu.js';

export default class Dashboard extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state={
      name:name,
      isOpen: false,
      selectedItem: 'About',
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
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
  openDrawer(){
    console.log('opening drawer!');
          this.drawer.openDrawer();
  }
  closeDrawer(){
    console.log('opening drawer!');
          this.drawer.closeDrawer();
  }

  render(){
    const { navigate,goBack } = this.props.navigation;
    const menu = <Menu navigate={navigate} userName={this.props.userName}/>;
    var navigationView = (
      <ScrollView style={{backgroundColor: '#fbae16'}} createContainerstyle={{flex: 1,backgroundColor: '#fbae16'}}>
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
                    rightComponent={
                      <View style={{flex:1, flexDirection:'row',alignItems:'flex-end', minHeight:20, minWidth:20}}>
                        <TouchableOpacity onPress={this.openDrawer}>
                          <Icon name="bell-outline" type="material-community" size={30}  color="#fff" style={styles.bellIcon}/>
                          <Text style={styles.notificationText}>9</Text>
                        </TouchableOpacity>
                      </View>
                        }
                    />
                     <Header
                        centerComponent={{ text: "Dashboard", style:{ fontSize:17, color: '#fff',alignSelf:'center'} }}
                        outerContainerStyles={{borderColor:'transparent', backgroundColor: '#3c8dbc',height:50,padding:10,margin:0}}
                        innerContainerStyles={{marginTop:0,paddingTop:0}}
                      />

                      <View style={styles.imgWrapper}>
                        <Image style={styles.imgDisplay} resizeMode="stretch"
                              source={require('../../images/coming-soon.png')}/>
                      </View>


              </ScrollView>
            </View>
          </SideMenu>
        </DrawerLayoutAndroid>

    );
  }
}
