import React, { Component } from "react";
import Meteor, { withTracker } from "react-native-meteor";

import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View, BackHandler, Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Header, Card, Button, Avatar, Icon, SearchBar, FormLabel, FormInput, FormValidationMessage } from "react-native-elements";
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from "react-native-table-component";

import SideMenu from "react-native-side-menu";
import RNExitApp from "react-native-exit-app";
import PropTypes from "prop-types";
import Modal from "react-native-modal";

import styles from "./styles.js";
import Menu from "../../components/Menu/Menu.js";
import EditMyProfileForm from "../../components/EditMyProfileForm/EditMyProfileForm.js";
import NotificationCommon from '../NotificationLayout/NotificationCommon.js';

class EditMyProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen       : false,
      selectedItem : "About",
    };
    this.openDrawer  = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle      = this.toggle.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount start');
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.androidBackHandler.bind(this)
    );
    console.log('componentDidMount end');
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener(
    //   "hardwareBackPress",
    //   this.androidBackHandler.bind(this)
    // );
  }

  androidBackHandler() {
    // console.log(this.props.navigation.state.routeName);
    if (this.props.navigation.state.routeName != "ServiceList") {
      this.props.navigation.goBack(null);
      return true;
    }
    return false;
  }

  toggle() {
    console.log("is open " + this.state.isOpen);
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
      selectedItem: item
    });

  handleLogout() {
    console.log("Logout function!");
    Meteor.logout();
    // Actions.LogIn();
  }

  openDrawer() {
    console.log("opening drawer!");
    this.drawer.openDrawer();
  }

  closeDrawer() {
    console.log("opening drawer!");
    this.drawer.closeDrawer();
  }

  render() {

    const rules = {
       alphabets : /^[a-zA-Z]+(\.\w+)+$/,
       numbers   : /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
       email     : /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
       required  : /\S+/,
       date(format="YYYY-MM-DD", value) {
         const d = moment(value, format);
         if(d == null || !d.isValid()) return false;
         return true;
       },
       minlength(length, value) {
         if (length === void(0)) {
           throw 'ERROR: It is not a valid length, checkout your minlength settings.';
         } else if(value.length > length) {
           return true;
         }
         return false;
       },
       maxlength(length, value) {
         if (length === void(0)) {
           throw 'ERROR: It is not a valid length, checkout your maxlength settings.';
         } else if (value.length > length) {
           return false;
         }
         return true;
      }
    };

    const messages = {
      en: {
        email     : "Please enter a valid Email address.\n",
        alphabets : "Plese enter  a valid Name.\n",
        numbers   : 'Please enter a valid Mobile number.\n',
        required  : 'This Field is mandatory.\n',
        minlength : 'This Field length must be greater than {1}.\n',
        maxlength : 'This Field length must be lower than {1}.\n'
      }
    };

    const { navigate,goBack } = this.props.navigation;
    
    const menu         = <Menu navigate={navigate} />;
    var navigationView = <NotificationCommon closeDrawer={this.closeDrawer} notificationData={this.props.notificationData} navigation={this.props.navigation}/>
    return (
      <DrawerLayoutAndroid
        drawerWidth          = {300}
        ref                  = {_drawer => (this.drawer = _drawer)}
        drawerPosition       = {DrawerLayoutAndroid.positions.Right}
        renderNavigationView = {() => navigationView}
      >
        <SideMenu
          disableGestures = {true}
          openMenuOffset  = {300}
          edgeHitWidth    = {0}
          menu            = {menu}
          isOpen          = {this.state.isOpen}
          onChange        = {isOpen => this.updateMenuState(isOpen)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFF",
              borderWidth: 0,
              padding: 0
            }}
          >
            <ScrollView
              createContainerStyle={{
                marginBottom: 25,
                borderWidth: 0,
                margin: 0
              }}
            >
              <Header
                centerComponent={{ text: "AssureID", style: { color: "#fff" } }}
                leftComponent={
                  <TouchableOpacity onPress={this.toggle}>
                    <Icon
                      size={25}
                      name="bars"
                      type="font-awesome"
                      color="#fff"
                    />
                  </TouchableOpacity>
                }
                outerContainerStyles={{
                  borderBottomWidth: 0,
                  backgroundColor: "#367fa9",
                  height: 60,
                  paddingTop: 0,
                  margin: 0
                }}
                innerContainerStyles={{ marginTop: 0, paddingTop: 0 }}
                rightComponent={
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "flex-end",
                      minHeight: 20,
                      minWidth: 20
                    }}
                  >
                    <TouchableOpacity onPress={this.openDrawer}>
                      <Icon
                        name="bell-outline"
                        type="material-community"
                        size={30}
                        color="#fff"
                        style={styles.bellIcon}
                      />
                      <Text style={styles.notificationText}>9</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
              <Header
                centerComponent={{
                  text: "Edit Profile",
                  style: { color: "#fff", alignSelf: "center" }
                }}
                leftComponent={
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('MyProfile')}
                  >
                    <Icon
                      size={25}
                      name="arrow-left"
                      type="feather"
                      color="#fff"
                    />
                  </TouchableOpacity>
                }
                outerContainerStyles={{
                  borderColor: "transparent",
                  backgroundColor: "#3c8dbc",
                  height: 50,
                  padding: 10,
                  margin: 0
                }}
                innerContainerStyles={{ marginTop: 0, paddingTop: 0 }}
              />
              <View>
                <EditMyProfileForm messages={messages} rules={rules} navigate={navigate} goBack={goBack}/>
              </View>
            </ScrollView>
          </View>
        </SideMenu>
      </DrawerLayoutAndroid>
    );
  }
}

export default withTracker(props => {
  const postHandle       = Meteor.subscribe('userNotification');
  const notificationData = Meteor.collection('notification').find({"toUserId": Meteor.userId()}) || [];

  var result = {
                  notificationData : notificationData,
                };

  return result;
})(EditMyProfile);
