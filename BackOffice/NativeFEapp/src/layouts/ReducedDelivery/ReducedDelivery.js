import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TextInput, View,  BackHandler, Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, SearchBar  } from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';



 export default class ReducedDelivery extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state={
      name:name,
      isOpen: false,
      selectedItem: 'About',
      isModalVisibleOne: false,
      isModalVisibleTwo: false,

    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
  }
  handleView(){
    this.props.navigation.navigate('ViewCustomer');
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

  _toggleModal1 = () =>this.setState({ isModalVisibleOne: !this.state.isModalVisibleOne });

  _toggleModal2 = () =>this.setState({ isModalVisibleTwo: !this.state.isModalVisibleTwo });

  render(){
    let subData = [
      {value:'Sakal'},
      {value:'Dainik Bhaskar'},
      {value:'Times of India'},
    ];
    const {navigate,goBack} = this.props.navigation;
    const tableHead = ['Line Number', 'Total Customers', 'Area'];
    const tableData = [
      ['145 shakti House', '28', 'Magarpatta, John Deere'],
      ['145 shakti House', '28', 'Magarpatta, John Deere'],
      ['145 shakti House', '28', 'Magarpatta, John Deere'],
      ['145 shakti House', '28', 'Magarpatta, John Deere'],
      ['145 shakti House', '28', 'Magarpatta, John Deere'],
      ['145 shakti House', '28', 'Magarpatta, John Deere'],
    ];
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
    return (
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
              leftComponent={
                <TouchableOpacity  onPress={this.toggle} >
                  <Icon size={25} name='bars' type='font-awesome' color='#fff' />
                </TouchableOpacity>
              }
              outerContainerStyles={{borderBottomWidth:0, backgroundColor: '#f7ac57',height:60,paddingTop:0,margin:0}}
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
                centerComponent={{ text: "Deliveries", style:{ color: '#fff',alignSelf:'center'} }}
                leftComponent={
                  <TouchableOpacity  onPress={()=>console.log('back pressed!')} >
                    <Icon size={25} name='arrow-left' type='feather' color='#fff' />
                  </TouchableOpacity>
                }
                outerContainerStyles={{ borderColor:'transparent', backgroundColor: '#f7bc79',height:50,padding:10,margin:0}}
                innerContainerStyles={{marginTop:0,paddingTop:0}}
                />
              <View style={{padding:10}}>
                <View style={{flexDirection:'row'}}>
                  <Button onPress={()=>navigate('DeliveriesLine')} textStyle={{textAlign:'center'}} buttonStyle={styles.button1} title="DELIVERY BY LINE"/>
                  <Button onPress={()=>navigate('DeliveriesProduct')} textStyle={{textAlign:'center'}} buttonStyle={styles.button1} title="DELIVERY BY PRODUCT"/>
                </View>

                <View style={{flexDirection:'row',paddingTop:20}}>
                 <TouchableOpacity onPress={()=> navigate('NonDelivery')}>
                  <View style={{borderRadius: 0,
                                borderWidth: 0.5,
                                borderColor: '#f7ac57',
                                padding:8,
                                marginRight:13

                              }}>
                    <Text style={{fontSize:12}}>NON DELIVERIES</Text>
                    <Text style={{fontSize:12}}>23 users </Text>
                  </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> navigate('ResumeDelivery')}>
                  <View style={{borderRadius: 0,
                                borderWidth: 0.5,
                                borderColor: '#f7ac57',padding:8,
                                marginRight:13}}>
                    <Text style={{fontSize:12}}>RESUME</Text>
                    <Text style={{fontSize:12}}>10 users </Text>
                  </View>
                   </TouchableOpacity>
                  <TouchableOpacity onPress={()=> navigate('ExtraDelivery')}>
                  <View style={{borderRadius: 0,
                                borderWidth: 0.5,
                                borderColor: '#f7ac57',padding:8,
                                marginRight:13,
                                }}>
                    <Text style={{fontSize:12}}>EXTRA</Text>
                    <Text style={{fontSize:12}}>2 users</Text>
                  </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> navigate('ReducedDelivery')}>
                  <View style={{borderRadius: 0,
                                borderWidth: 0.5,
                                borderColor: '#f7ac57',padding:8,
                                marginRight:13,backgroundColor:'#6d6e70',}}>
                    <Text style={{fontSize:12,color:'#fff'}}>REDUCED</Text>
                    <Text style={{fontSize:12,color:'#fff'}}>0 users</Text>
                  </View>
                   </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',paddingTop:30,alignSelf:'center',paddingBottom:30}}>
                  <Icon name="chevron-left" type="feather" color='#aaa'/>
                  <Text style={{paddingRight:10,paddingLeft:10,textAlign:'center',paddingTop:2}}>25 January,2018</Text>
                  <Icon name="chevron-right" type="feather" color='#aaa'/>
                </View>
                <TouchableOpacity onPress={()=>navigate('Deliveries3')}>

                <View style={{borderRadius:3,borderWidth:1,borderColor:'#aaa',height:168,marginBottom:10}} >
                  <View style={{height:120,borderTopWidth:5,borderColor:'#f7ac57'}}>
                    <View style={{flexDirection:'row',alignSelf:'center',padding:15}}>
                      <Text style={{textAlign:'center'}}>Line 45, Shakti House</Text>
                    </View>
                    <View style={{flexDirection:'row',alignSelf:'center'}}>
                      <View style={{flexDirection:'column',paddingRight:15}}>
                        <Text style={{textAlign:'center'}}>Today Reduced Deliveries</Text>
                        <Text style={{textAlign:'center'}}>2</Text>
                      </View>
                       <View style={{flexDirection:'column',paddingLeft:15}}>
                        <Text style={{textAlign:'center'}}>Today Deliveries</Text>
                        <Text style={{textAlign:'center'}}>28</Text>
                      </View>
                    </View>
                  </View>
                    <View style={{height:46,backgroundColor:'#f3ebe8',borderTopWidth:1,borderColor:'#aaa'}}>
                      <View style={{alignSelf:'center',padding:12}}>
                        <Text>John Deere, Magarpatta</Text>
                      </View>
                    </View>
                </View>
               </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigate('Deliveries3')}>
                <View style={{borderRadius:3,borderWidth:1,borderColor:'#aaa',height:168}} >
                  <View style={{height:120,borderTopWidth:5,borderColor:'#f7ac57'}}>
                    <View style={{flexDirection:'row',alignSelf:'center',padding:15}}>
                      <Text style={{textAlign:'center'}}>Line 45,Pentagon</Text>
                    </View>
                    <View style={{flexDirection:'row',alignSelf:'center'}}>
                      <View style={{flexDirection:'column',paddingRight:15}}>
                        <Text style={{textAlign:'center'}}>Today Reduced Deliveries</Text>
                        <Text style={{textAlign:'center'}}>0</Text>
                      </View>
                       <View style={{flexDirection:'column',paddingLeft:15}}>
                        <Text style={{textAlign:'center'}}>Today Deliveries</Text>
                        <Text style={{textAlign:'center'}}>160</Text>
                      </View>
                    </View>
                  </View>
                    <View style={{height:46,backgroundColor:'#f3ebe8',borderTopWidth:1,borderColor:'#aaa'}}>
                      <View style={{alignSelf:'center',padding:12}}>
                        <Text>John Deere, Magarpatta</Text>
                      </View>
                    </View>
                </View>
               </TouchableOpacity>


              </View>

            </ScrollView>
          </View>
          </SideMenu>
        </DrawerLayoutAndroid>
    );
  }
}
