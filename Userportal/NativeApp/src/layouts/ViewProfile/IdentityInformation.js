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
import CheckBox from 'react-native-check-box';
import Modal from "react-native-modal";

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import Statutory from './Statutory.js';



export default class IdentityInformation extends React.Component {
  constructor(props){
    super(props);
    let name ="";
   
    this.state={
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#f7ac57',
      modalVisible    : false,
      cardName        : "",
      cardValue       : ""
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
    this.handleIdentityEdit = this.handleIdentityEdit.bind(this);
    this._toggleModal = this._toggleModal.bind(this);
  }

  handleView(){
    Actions.ViewCustomer();
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
  handleIdentityEdit(cardName,cardValue){
    
    this.setState({
      'modalVisible' : true,
      'cardName'     : cardName,
      'cardValue'    : cardValue,
    },()=>{
      
    });
  }

  _toggleModal = () => {   
     this.setState({ modalVisible: !this.state.modalVisible });
  }
  render(){
    // const {navigate}   = this.props.navigation;

    // const { state,goBack }    = this.props.navigation;
    // const menu         = <Menu navigate={navigate} userName={this.props.userName}/>;
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
    // 


    return(
        <View>
          <View style={{flex:1, flexDirection:'row'}}>
            <Icon name="map-marker" type="font-awesome" size={20}  color="#00b8ff" />
            <Text style={{padding:10,fontWeight: 'bold',color:'#00b8ff'}}>Identity Information</Text>
          </View> 
          {
            this.props.serviceDetails.selectedCard && this.props.serviceDetails.selectedCard.length>0 ?
              this.props.serviceDetails.selectedCard.map((data,index)=>{
                var text    = '';
                var image1  = '';
                var image2  = '';
                var id      = '';
                var heading = '';
                var value   = '';
                if(data.cardName == "AadharForms" && data.value == true){
                  if(this.props.userData.identity){
                    if(this.props.userData.identity.adharCardNo || this.props.userData.identity.adharCardChkid){
                      text   = this.props.userData.identity.adharCardNo;
                      value  = "Aadhar Card : "+this.props.userData.identity.adharCardChkid;																		
                    }else{
                      text = "Please Add Information";			
                      value = "";								
                    }
                    
                    image1 = this.props.userData.identity.aadhar1;
                    image2 = this.props.userData.identity.aadhar2;
                    id     = this.props.userData.identity.adharCardChkid;
                  }else{
                    text = "Please Add Information";			
                    value = "";								
                  }
                  heading = "Aadhar Card";
                }

                /**===========Pan Card=========== */
                if(data.cardName == "PanCardForm" && data.value == true ){
                  if(this.props.userData.identity){
                    if(this.props.userData.identity.panCardNo || this.props.userData.identity.panCardChkid){
                      text   = this.props.userData.identity.panCardNo;
                      value  = "Pan Card : "+this.props.userData.identity.panCardChkid;
                                            
                    }else{
                      text  = "Please Add Information";	
                      value = "";											
                    }
                    image1 = this.props.userData.identity.pan1;
                    image2 = this.props.userData.identity.pan2;
                    id     = this.props.userData.identity.panCardChkid;
                  }else{
                    text = "Please Add Information";			
                    value = "";								
                  }
                  heading = "Pan Card";
                }
                /**============== Driving Liscence==============*/
                if(data.cardName == "DrivingLicenseForm" && data.value == true){
                  if(this.props.userData.identity){
                    if(this.props.userData.identity.drivingCardNo || this.props.userData.identity.drivingCardchkid){
                      text   = this.props.userData.identity.drivingCardNo;
                      value  = "Driving License : "+this.props.userData.identity.drivingCardchkid;
                                            
                    }else{
                      text = "Please Add Information";
                      value = "";
                    }
                    image1 = this.props.userData.identity.driving1;
                    image2 = this.props.userData.identity.driving2;
                    id     = this.props.userData.identity.drivingCardchkid;
                  }else{
                    text = "Please Add Information";			
                    value = "";								
                  }
                  heading = "Driving License ";
                }

                /**===================Voting Form================== */

                if(data.cardName == "VotingForm" && data.value == true){
                  if(this.props.userData.identity){
                    if(this.props.userData.identity.votingCardNo || this.props.userData.identity.votingCardchkid){
                      text   = this.props.userData.identity.votingCardNo;
                      value  = "Voting Card : "+this.props.userData.identity.votingCardchkid;
                                      
                    }else{
                      text = "Please Add Information";
                      value = "";
                    }
                    image1 = this.props.userData.identity.voting1;
                    image2 = this.props.userData.identity.voting2;
                    id     = this.props.userData.identity.votingCardchkid;
                  }else{
                    text = "Please Add Information";			
                    value = "";								
                  }	
                  heading = "Voting Card ";
                }

                /**============Ration Card================== */
                if(data.cardName == "RationCardForm" && data.value == true){
                  if(this.props.userData.identity){
                    if(this.props.userData.identity.rationCardNo || this.props.userData.identity.rationCardNo){
                      text   = this.props.userData.identity.rationCardNo;	
                      value  = "Ration Card : "+this.props.userData.identity.rationCardchkid;
                                      
                    }else{
                      text  = "Please Add Information";
                      value = "";
                    }
                    image1 = this.props.userData.identity.ration1;
                    image2 = this.props.userData.identity.ration2;
                    id     = this.props.userData.identity.rationCardchkid;
                  }else{
                    text = "Please Add Information";			
                    value = "";								
                  }
                  heading = "Ration Card ";
                }
                /*=================== Passport================ */
                if(data.cardName == "PassportForm" && data.value == true){
                  if(this.props.userData.identity){
                    if(this.props.userData.identity.passportNo || this.props.userData.identity.passportchkid){
                      text   = this.props.userData.identity.passportNo;	
                      value  = "Passport : "+this.props.userData.identity.passportchkid;
                                          
                    }else{
                      text = "Please Add Information";
                      value = "";
                    }
                    image1 = this.props.userData.identity.passport1;
                    image2 = this.props.userData.identity.passport2;
                    id     = this.props.userData.identity.passportchkid;
                  }else{
                    text = "Please Add Information";			
                    value = "";								
                  }
                  heading = "Passport Card ";
                }

                if(data.value == true){
                  
                  return(
                    <View  key={index} style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>
                      
                      <Card containerStyle={styles.cardOrder}>
                        <View style={styles.cardHeader}>
                          <View style={{flex:1,flexDirection:'row'}}>
                            <View style={{flex:1,flexDirection:'row',paddingHorizontal:10,paddingVertical:10}}>
                              <View style={{flex:0.1}}>
                                <CheckBox
                                  center
                                  containerStyle={{ backgroundColor: "transparent", borderWidth: 0}}
                                  checkedColor="#54Aff3"
                                  onClick={() => this.props.addDataToParent(value)}
                                  checkBoxColor="#54Aff3"
                                  value={this.state.checked}
                                />  
                              </View>
                              <Text style={{flex:0.5,fontSize:16,fontWeight:'bold'}}>{heading}</Text>
                              <View style={{flex:0.5,alignItems:"flex-end"}}>
                                {
                                  this.props.userData ?
                                  <TouchableOpacity onPress={()=>this.handleIdentityEdit(data.cardName,data.value)}>
                                    <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff" />
                                  </TouchableOpacity>
                                  :
                                  ""
                                }
                                

                              </View>
                            </View>
                          </View>
                       
                          <View style={{flex:1,flexDirection:'row',paddingHorizontal:10,paddingBottom:10}}>
                            <View style={{flex:.5}}>
                              <Text>{heading} Number :</Text>
                            </View>
                            <View style={{flex:.5}}>
                              <Text>{text}</Text>
                            </View>
                          </View>
                          <View style={{flex:1, flexDirection:'row',paddingHorizontal:10, paddingTop: 5,paddingBottom:15}}>
                            <View style={{paddingVertical: 5,flex:.3}}>
                              
                              {
                                image1 ?
                                <View style={styles.closeBtn}>
                                {/* <Icon name="cancel" type="MaterialIcons" size={20} color="#00b8ff"  /> */}
                                <Image style={{width:'200%', height:100, borderRadius:0,borderWidth:1,borderColor:'#ccc'  }} resizeMode="stretch"
                                source={{uri : image1}}/>
                                </View>
                                :
                                null
                              }
                              
                              {
                                image2 ?
                                <Image style={{width:'200%', height:100, borderRadius:0,borderWidth:1,borderColor:'#ccc'  }} resizeMode="stretch"
                                source={{uri : image2}}/>
                                :
                                null
                              }

                              
                            </View>
                          </View>
                        </View>
                      </Card>
                    </View>
                  )
                }
              })

            :
            <Loading/>
          }
          <Modal
            isVisible={this.state.modalVisible}
            backdropColor={"black"}
            backdropOpacity={0.9}
            >
            <View style={styles.modalContent}>
            <View>
              <Statutory cardName={this.state.cardName} cardValue={this.state.cardValue} identityValues={this.props.userData.identity}  toggleModal = {this._toggleModal.bind(this)}/>
            </View>
              <Button
                onPress={()=>this._toggleModal()}
                textStyle={{ textAlign: "center" }}
                title="CANCEL"
                buttonStyle={styles.buttonSubmit}
              />
            </View>
          </Modal>
        </View>
        // <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,padding:0}}>     
        //   <Card containerStyle={styles.cardOrder}>
        //     <View style={styles.cardHeader}>
        //       <View style={{flex:1,flexDirection:'row'}}>
        //         <View style={{flex:.7,paddingHorizontal:10,paddingVertical:10}}>
        //           <Text style={{fontSize:16,fontWeight:'bold'}}>Aadhar Card</Text>
        //         </View>
        //       </View>
        //       <View style={{flex:1,flexDirection:'row',paddingHorizontal:10,paddingBottom:10}}>
        //         <View style={{flex:.5}}>
        //           <Text>Aadhar Card Number :</Text>
        //         </View>
        //         <View style={{flex:.5}}>
        //           <Text>1234 1234 1234</Text>
        //         </View>
        //       </View>
        //       <View style={{flex:1, flexDirection:'row',paddingHorizontal:10, paddingTop: 5,paddingBottom:15}}>
        //         <View style={{paddingVertical: 5,flex:.3}}>
        //           <View style={styles.closeBtn}>
        //             <Icon name="cancel" type="MaterialIcons" size={20} color="#00b8ff"  />
        //           </View>
        //           <Image style={{width:'200%', height:100, borderRadius:0,borderWidth:1,borderColor:'#ccc'  }} resizeMode="stretch"
        //             source={require('../../images/aadhaarCard.png')}/>
        //         </View>
        //       </View>
        //     </View>
        //   </Card>
        // </View>
    );
  }
}
