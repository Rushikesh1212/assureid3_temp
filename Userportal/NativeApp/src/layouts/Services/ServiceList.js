import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon  } from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { NavigationActions } from 'react-navigation';


import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';

class ServiceList extends React.Component {
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
    this.openDrawer          = this.openDrawer.bind(this);
    this.closeDrawer         = this.closeDrawer.bind(this);
    this.toggle              = this.toggle.bind(this);
    this.handleSelectService = this.handleSelectService.bind(this);
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

  handleSelectService = (serviceId,serviceType,serviceName) => {
    // console.log("select service ", serviceId);
    // console.log("serviceType = ",serviceType);

    Meteor.call('updateActiveService',serviceId,serviceType,serviceName,(error,result) =>{
      if(error){
        console.log(error);
      }else{
        this.props.navigation.navigate('Dashboard');
      }
    });
  }

  render(){
    const { serviceData } = this.props;

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
                    centerComponent={{ text: "Pamtap", style: { color: '#fff' } }}
                    // leftComponent={
                    //   <TouchableOpacity  onPress={this.toggle} >
                    //     <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                    //   </TouchableOpacity>
                    // }
                    outerContainerStyles={{borderBottomWidth:0, backgroundColor: '#f7ac57',height:60,paddingTop:0,margin:0}}
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
                  <View style={styles.servicesHeader}>
                    <Text style={styles.headerText}>My Services</Text>
                    <TouchableOpacity>
                      <Text>Learn How >></Text>
                    </TouchableOpacity>
                  </View>
                  {/*<View style={{flex:0.5,justifyContent: 'center',alignItems: 'center',backgroundColor:'#ff0'}}>
                    <TouchableOpacity onPress={()=> navigate('AdditionalSetting')}>
                      <Image style={{height:120, width:120}}  resizeMode="stretch"
                              source={require('../../images/add_service.png')}/>
                    </TouchableOpacity>

                    <Text>Add Service</Text>
                  </View>*/}
                  <View style={styles.serviceListWrapper}>

                    {this.props.serviceData.map((item,i) =>
                      <View key={i} style={styles.imgWrapper}>
                        <TouchableOpacity
                          onPress={() => this.handleSelectService(item.serviceId,item.serviceType,item.serviceName)}
                        >
                          <Image style={styles.imgDisplay}  resizeMode="stretch"
                                source={{uri: item.serviceLogo }} />
                        </TouchableOpacity>
                        <Text style={{fontWeight:'bold'}}>{item.serviceType}</Text>
                        <Text>{item.serviceName}</Text>
                      </View>
                    )}

                    <View style={styles.imgWrapper}>
                      <TouchableOpacity onPress={()=> navigate('AdditionalSetting')}>
                        <Image style={styles.imgDisplay}  resizeMode="stretch"
                              source={require('../../images/add_service.png')}/>
                      </TouchableOpacity>
                      <Text>Add Service</Text>
                    </View>

                  </View>
              </ScrollView>
            </View>
          </SideMenu>
        </DrawerLayoutAndroid>
    );
  }
}

export default createContainer(props => {
  const handle = Meteor.subscribe('businessDetails');
  const handle2 = Meteor.subscribe('adminServiceDetails');

  let data = Meteor.collection('BusinessMaster').find({'ownerId':Meteor.userId()});
  let serviceData = [];
  console.log("biz data = ",data);

  for(var i=0;i<data.length;i++){
    var businessType = data[i].businessType;
    var businessName = data[i].businessName;
    var businessId   = data[i]._id;
    // console.log("biz type = ",businessType);
    var serviceDetails = Meteor.collection('ServiceMaster').findOne({serviceName:businessType}) || [];
    // console.log("serviceDetails = ",serviceDetails);
    var serviceLogo = serviceDetails.serviceLogo;
    // console.log("serviceLogo = ",serviceLogo);
    serviceData.push({
      'serviceId'   : businessId,
      'serviceType' : businessType,
      'serviceName' : businessName,
      'serviceLogo' : serviceLogo,
    })
  }
  // console.log("serviceData = ",serviceData);
  return{
    handle:handle,
    handle2:handle2,
    subReady: handle.ready(),
    subReady2: handle2.ready(),
    serviceData: serviceData,
    // businessData: Meteor.collection('BusinessMaster').find({}) || [],
  }
}, ServiceList);
