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
var moment = require('moment');
import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';


class Invoice extends React.Component {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
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

  makePayment = () =>{
    // Meteor.call('sendUserOrderNotifications',Meteor.userId(),this.props.order._id,'Order Placed',(error,result)=>{
    //   if(error){
    //     console.log(error.reason);
    //   }else{
    //     console.log("sent notifications");
    //   }
    // });

    this.props.navigation.navigate("PaymentGateway",{id:this.props.order._id});
  }

  render(){

    var {userData}     = this.props;
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
            <HeaderDy headerTitle="Invoice" goBack={goBack}/>
              
              <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>

                { this.props.loading ?
                  this.props.data?
                      <View style={styles.formContainer}>
                        <View style={{flexDirection:'row',flex:1}}>
                          <View style={{flex:.5}}>
                            <Text style={{fontWeight: 'bold',color:'#000'}}>Date</Text>
                          </View>
                          <View style={{flex:.5}}>
                            <Text> {this.props.data.date} </Text>
                          </View>
                        </View>
                        <View style={{flexDirection:'row',flex:1,paddingBottom:15}}>
                          <View style={{flex:.5}}>
                            <Text style={{fontWeight: 'bold',color:'#000'}}>Invoice Number</Text>
                          </View>
                          <View style={{flex:.5}}>
                            <Text> {this.props.invoice.invoiceNo} </Text>
                          </View>
                        </View>
                        <View style = {styles.lineStyle} />
                        <View style={{flexDirection:'row',flex:1,marginTop:15}}>
                          <View style={{flex:.5}}>
                            <Text style={{fontWeight: 'bold',color:'#000'}}>Billed From</Text>
                          </View>
                          <View style={{flex:.5}}>
                            <Text>{this.props.invoice.companyName}</Text>
                            <Text>{this.props.invoice.companyAddress.companyAddress}</Text>
                            <Text>{this.props.invoice.companyAddress.companyCity},{this.props.invoice.companyAddress.companyState}, {this.props.invoice.companyAddress.companyCountry} - {this.props.invoice.companyAddress.companyPincode} </Text>
                          </View>
                        </View>
                        <View style={{flexDirection:'row',flex:1,marginTop:15,paddingBottom:15}}>
                          <View style={{flex:.5}}>
                            <Text style={{fontWeight: 'bold',color:'#000'}}>Billed To</Text>
                          </View>
                          <View style={{flex:.5}}>
                            <Text>{this.props.invoice.userName}</Text>
                            {
                               this.props.invoice.billingDetails ?
                              <View>
                                <Text style={{flexWrap:'wrap'}}>{this.props.invoice.billingDetails.address},{this.props.invoice.billingDetails.city} ,{this.props.invoice.billingDetails.state} ,{this.props.invoice.billingDetails.country} , {this.props.invoice.billingDetails.pincode}</Text>
                              </View>
                              :
                              null
                            }
                          </View>
                        </View>
                        <View style={{flexDirection:'row',flex:1,marginTop:15,paddingBottom:15}}>
                          <View style={{flex:.5}}>
                            <Text style={{fontWeight: 'bold',color:'#000'}}>Invoice Total</Text>
                          </View>
                          <View style={{flex:.5,flexDirection:'row'}}>
                            <View>
                              <Icon name="rupee" type="font-awesome" size={20}  color="#696969"/>
                            </View>
                            <View>
                              <Text style={{fontWeight: 'bold',color:'#696969',fontSize:16}}> {(this.props.invoice.totalAmount).toFixed(2)} </Text>
                            </View> 
                          </View>
                        </View>
                        <View style = {styles.lineStyle} />
                        
                        <View style={{flexDirection:'row',flex:1,marginTop:15,paddingBottom:15}}>
                            <View style={{flex:.45}}>
                              <Text style={{fontWeight: 'bold',paddingBottom:15,color:'#000'}}>Service Name</Text>
                              {/* <Text style={{flexWrap:'wrap'}}>{this.props.data.serviceName} </Text> */}
                            </View>
                            <View style={{flex:.7,flexDirection:'row',paddingLeft:30}}>
                              <View style={{flex:.45,alignItems:'center'}}>
                                <Text style={{fontWeight: 'bold',paddingBottom:15,color:'#000'}}>Unit Cost</Text>
                                <View style={{flexDirection:'row'}}>
                                  {/* <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/> */}
                                  {/* <Text style={{flexWrap:'wrap'}}>{this.props.data.serviceRate}</Text> */}
                                </View>
                              </View>
                              <View style={{flex:.45,alignItems:'center'}}>
                                <Text style={{fontWeight: 'bold',paddingBottom:15,color:'#000'}}>Qty</Text>
                                {/* <Text style={{flexWrap:'wrap'}}>{this.props.data.qty}</Text> */}
                              </View>
                              <View style={{flex:.45,alignItems:'center'}}>
                                <Text style={{fontWeight: 'bold',paddingBottom:15,color:'#000'}}>Amount</Text>
                                <View style={{flexDirection:'row'}}>
                                  {/* <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/> */}
                                  {/* <Text style={{flexWrap:'wrap'}}>{this.props.data.rate}</Text> */}
                                </View>
                              </View>
                            </View>

                            
                        </View>
                        {
                          this.props.invoice.serviceArray.length > 0 ?
                            this.props.invoice.serviceArray.map((serviceData,index)=>{
                              return(
                                <View key={index} style={{flexDirection:'row',flex:1,marginTop:15,paddingBottom:15}}>
                                  <View style={{flex:.45}}>
                                    <Text style={{flexWrap:'wrap'}}>{serviceData.serviceName} </Text>
                                  </View>
                                  <View style={{flex:.7,flexDirection:'row',paddingLeft:30}}>
                                    <View style={{flex:.45,alignItems:'center'}}>
                                      <View style={{flexDirection:'row'}}>
                                        <Text style={{flexWrap:'wrap'}}>{serviceData.serviceRate}</Text>
                                      </View>
                                    </View>
                                    <View style={{flex:.45,alignItems:'center'}}>
                                      <Text style={{flexWrap:'wrap'}}>{serviceData.totalQty}</Text>
                                    </View>
                                    <View style={{flex:.45,alignItems:'center'}}>
                                      <View style={{flexDirection:'row'}}>
                                        <Text style={{flexWrap:'wrap'}}>{serviceData.serviceRate * serviceData.totalQty}</Text>
                                      </View>
                                    </View>
                                  </View>                            
                                </View>
                              )
                            })
                          :
                          null
                        }
                        
                       
                        <View style = {styles.lineStyle} />
                        
                        <View style={{flexDirection:'row',flex:1}}>
                          <View style={{flex:.6,alignItems:'flex-end'}}>
                            <Text style={{paddingVertical:5}}>Subtotal</Text>
                          </View>
                          <View style={{flex:.4,alignItems:'flex-end'}}>
                            <View style={{flexDirection:'row',paddingVertical:5}}>
                              <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                              <Text style={{flexWrap:'wrap'}}>{this.props.invoice.actualAmount}</Text>
                            </View>
                          </View>
                        </View>

                        {
                          this.props.invoice.packageDetails ?
                          <View style={{flexDirection:'row',flex:1}}>
                              <View style={{flex:.6,alignItems:'flex-end'}}>
                              <Text style={{paddingVertical:5}}>Discount ({this.props.invoice.packageDetails.packageDiscount}%)</Text>
                              </View>
                              
                              <View style={{flex:.4,alignItems:'flex-end'}}>
                              <View style={{flexDirection:'row',paddingVertical:5}}>
                                  <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                                  <Text style={{flexWrap:'wrap'}}>{(this.props.invoice.packageDiscountValue).toFixed(2)}</Text>
                              </View>
                              </View>
                          </View>
                            :
                            null
                        }
                     
                        {
                          this.props.invoice.packageDetails ?
                          <View style={{flexDirection:'row',flex:1}}>
                              <View style={{flex:.6,alignItems:'flex-end'}}>
                              <Text style={{paddingVertical:5}}>After Discount Value</Text>
                              </View>
                              <View style={{flex:.4,alignItems:'flex-end'}}>
                              <View style={{flexDirection:'row',paddingVertical:5}}>
                                  <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                                  <Text style={{flexWrap:'wrap'}}>{(this.props.invoice.reducedActualAmount)}</Text>
                              </View>
                              </View>
                          </View>
                          :
                          null
                        }

                        {
                          this.props.invoice.taxAmount.length > 0 ?
                            this.props.invoice.taxAmount.map((tax,index) =>{
                              return(
                                <View key={index} style={{flexDirection:'row',flex:1}}>
                                  <View style={{flex:.6,alignItems:'flex-end'}}>
                                    <Text style={{paddingVertical:5}}>{tax.taxName} ({tax.taxRate}%)</Text>
                                  </View>
                                  
                                  <View style={{flex:.4,alignItems:'flex-end'}}>
                                    <View style={{flexDirection:'row',paddingVertical:5}}>
                                      <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                                      <Text style={{flexWrap:'wrap'}}>{(tax.calculatedAmount).toFixed(2)}</Text>
                                    </View>
                                  </View>
                                </View>
                              );
                            })
                          :
                            <View style={{flexDirection:'row',flex:1}}>
                              <View style={{flex:.6,alignItems:'flex-end'}}>
                                <Text style={{paddingVertical:5}}>Tax(0%)</Text>
                              </View>
                              
                              <View style={{flex:.4,alignItems:'flex-end'}}>
                                <View style={{flexDirection:'row',paddingVertical:5}}>
                                  <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                                  <Text style={{flexWrap:'wrap'}}>0.00</Text>
                                </View>
                              </View>
                            </View>
                        }
                        <View style = {styles.lineStyle} />                        
                        <View style={{flexDirection:'row',flex:1}}>
                          <View style={{flex:.6,alignItems:'flex-end'}}>
                            <Text style={{color:'#000',fontWeight: 'bold',paddingVertical:5}}>Invoice Total</Text>
                          </View>
                          <View style={{flex:.4,alignItems:'flex-end'}}>
                            <View style={{flexDirection:'row',paddingVertical:5}}>
                              <Icon name="rupee" type="font-awesome" size={15}  color="#696969"/>
                              <Text style={{flexWrap:'wrap',color:"#696969",fontWeight: 'bold',}}>{(this.props.invoice.totalAmount).toFixed(2)}</Text>
                            </View>
                          </View>
                        </View>

                        {
                          this.props.order.paymentStatus == "paid" ?
                            null
                          :
                          <View style={{flexDirection:'row',paddingVertical:20}}>
                            <Button  textStyle={{textAlign:'center'}} 
                              buttonStyle={styles.button} 
                              title="CANCEL"
                              onPress={()=>this.props.navigation.goBack(null)}
                            />
                            <Button  
                              textStyle={{textAlign:'center'}} 
                              buttonStyle={styles.button1}
                              onPress={this.makePayment} 
                              title="MAKE PAYMENT"/>
                          </View>
                        }
                        
                      </View>
                :
                  <Text>No Data Available</Text>
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
  const { state }   = props.navigation;
  var Id            = state.params.Id;
  
  var data = {};
  var address1      = {};
  var loading       = false;
  var postHandle1;
  var postHandle2;
  var address       = {};
  var serviceArray  = []; 
  
  const postHandle  = Meteor.subscribe('singleInvoice',Id);
  const invoice     = Meteor.collection('invoice').findOne({'_id':Id});
 

  if (invoice) {
    postHandle1  = Meteor.subscribe('singleOrder',invoice._id);
    var order = Meteor.collection('order').findOne({'invoiceDetails.invoiceId':invoice._id}) || {};
    
    postHandle2  = Meteor.subscribe('userprofile',invoice.userId);
    var userProfile = Meteor.collection('userProfile').findOne({'userId':invoice.userId}) || {};
    data.address          = address;
    loading  = postHandle.ready() && postHandle1.ready() && postHandle2.ready();
    var serviceDetails  =  invoice.serviceDetails;
      if(serviceDetails !=undefined){
        invoice.serviceArray = [];
        invoice.serviceArray.push(serviceDetails);
        
      }else{
               
        var packageServiceDetails = invoice.packageDetails.serviceDetails;
        
        invoice.serviceArray=packageServiceDetails;
      }
      
      
    const notifPostHandle = Meteor.subscribe('userNotification');
    var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
    }
  return {
      loading,
      data,
      invoice,
      order,
      notificationCount
  };

}, Invoice);
