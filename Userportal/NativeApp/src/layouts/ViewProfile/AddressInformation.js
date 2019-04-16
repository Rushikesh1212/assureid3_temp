import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';
import CheckBox from 'react-native-check-box';
import Moment from 'moment';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';


class AddressInformation extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      checked: false,
      "subscription" : {
        "userData" : Meteor.subscribe("userData",Meteor.userId()),
        "userProfileData" : Meteor.subscribe("userProfileData"),
        "LatestTempProofDocs" : Meteor.subscribe("LatestTempProofDocs"),
      }
    };
    // this.handleChange = this.handleChange.bind(this);
  }


  // handleChange(value){
    

    // this.setState({
    //   [value]: !this.state.[value],
    // });
    // alert(value);
    // this.props.updateParentState({[value]: !this.props.typeValues[value]});
  // } 

  confirmDelete = (deleteFuncName,index) => {
    Alert.alert(
      '','Do you want to delete this data?',
      [
        {text: 'Delete',onPress: ()=>{this[deleteFuncName](index)}},
        {text: 'Cancel'}
      ]
    );
  }


  deletePermanentAddress = (index) =>{
    Meteor.call("removePermanentAddress",index,(error, result)=>{
      if (error) {
       
      }else{  
        Alert.alert("","Permanent Address Deleted!");
      }
    });
  } 

  deleteCurrentAddress = (index) =>{
    Meteor.call("removeCurrentAddress",index,(error, result)=>{
      if (error) {
       
      }else{  
        Alert.alert("","Current Address Deleted!");
      }
    });
  } 

  handleEdit = (addressDetails,index,addressType) =>{
    // 
    // 
    // 
    this.props.navigate.navigate('AddressForm',{addressDetails:addressDetails,index:index,addressType:addressType,profileId:this.props.profileId});
  }

  render(){

    const {navigate}   = this.props.navigate;
    var checkboxValue = this.props.checkboxRequired;

    
    // var permanentAddress = this.props.permanentAddress;

    // 
    var permanentAddress = (this.props.permanentAddress) ? this.props.permanentAddress.filter(Boolean) : [];
    var currentAddress   = (this.props.currentAddress) ? this.props.currentAddress.filter(Boolean) : [];
    // 
    // 
    
    return(
        <View>
          <View style={{flex:1, flexDirection:'row'}}>
            <Icon name="map-marker" type="font-awesome" size={20}  color="#00b8ff" />
            <Text style={{padding:10,fontWeight: 'bold',color:'#00b8ff'}}>Address Information</Text>
          </View> 
              
          <View style={{flexDirection:'row',flex:1}}>
            <View style={{flex:.8}}>
              <Text style={{ color: "#7E7877",paddingHorizontal:22,fontWeight:'bold'}}>Permanent Address</Text>
            </View>
            
            {checkboxValue == false ?
                Meteor.userId() == this.props.currentId ?
                  <View style={{flex:.2}}>
                    <View style={{alignItems:'flex-end'}}>
                      <TouchableOpacity onPress ={()=>this.props.navigate.navigate('AddressForm',{goBack:true})}>
                        <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                      </TouchableOpacity>
                    </View>
                  </View>             
                :
                <Text></Text>
              :
              <View style={{flex:.2}}>
                <View style={{alignItems:'flex-end'}}>
                  <TouchableOpacity onPress ={()=>this.props.navigate.navigate('AddressForm',{goBack:true})}>
                    <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                  </TouchableOpacity>
                </View>
              </View>             
            }
          </View>

          { (permanentAddress.length > 0) 
            ?
            permanentAddress.map((permAddress,index)=>{
              return(
                <View key={index} style={{flexDirection:'row',flex:1}}>
                    {checkboxValue == false ?
                       <Text></Text>
                      : 
                       permAddress.editStatus == "Block" ?
                      <View></View>
                       :
                      <View style={{flex:0.1,marginTop:12}}>
                        <CheckBox
                            center
                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0}}
                            checkedColor="#54Aff3"
                            // checked={checked}
                            onClick={() => this.props.addDataToParent("Permanent Address : "+permAddress.permanentAddressId)}
                            checkBoxColor="#54Aff3"
                            // isChecked={() =>this.setState({ checked: !this.state.checked })}
                            value={this.state.checked}
                            // onValueChange={() => this.setState({ checked: !this.state.checked })}
                            // textStyle={{ color: "#7E7877" }}
                            />
                      </View>
                    }

                                     
                   <View style={{flex:1}}>
                    <Card containerStyle={styles.card}>
                      <View style={styles.cardHeader}>
                          <View style={{flex:1,flexDirection:'row'}}>
                            <View  style={{flex:.8}}>
                              <Text style={{flexWrap:'wrap'}}> {permAddress.line1 ? permAddress.line1 : ""} {permAddress.line2 ? ', ' + permAddress.line2 : ""} {permAddress.line3 ? ', ' + permAddress.line3 : ""} {permAddress.landmark ? ', ' + permAddress.landmark : ""} {permAddress.city ? ', ' +permAddress.city : ""} {permAddress.state ? ', ' + permAddress.state : ""} {permAddress.country ? ', ' + permAddress.country : "" } {permAddress.pincode}</Text>
                            </View>
                            { this.props.currentId ?
                                (permAddress.editStatus == "Open" || permAddress.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                                  <View style={{flex:.2,flexDirection:'row'}}>
                                    <View style={{paddingRight:10,marginTop:2,paddingHorizontal:5}}>
                                      <TouchableOpacity onPress={()=>this.handleEdit(permAddress,index,"Permanent")}>
                                        <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff"/>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={{}}>
                                      <TouchableOpacity onPress={()=>this.confirmDelete('deletePermanentAddress',index)}>
                                        <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                :
                                <Text></Text>
                              :
                              permAddress.editStatus == "Open" || permAddress.editStatus == "Reopen" ?
                                <View style={{flex:.2,flexDirection:'row'}}>
                                  <View style={{marginTop:2,paddingHorizontal:5}}>
                                    <TouchableOpacity onPress={()=>this.handleEdit(permAddress,index,"Permanent")}>
                                      <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff"/>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={{}}>
                                    <TouchableOpacity onPress={()=>this.confirmDelete('deletePermanentAddress',index)}>
                                      <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              :
                              permAddress.editStatus == "Block" ?
                                <View>
                                  <Text>Order No : {permAddress.orderNo}</Text>
                                  <Text>Status : {permAddress.verifiedStatus}</Text>
                                  <Text>Order Date : {Moment(permAddress.orderDate).format("DD/MM/YYYY")}</Text>
                                </View>
                              :
                              <Text></Text>
                            }
                          </View>
                      </View>
                    </Card>
                   </View>
                  
                </View>
              );                   
            })
            :
            checkboxValue == false ?
              Meteor.userId() == this.props.currentId ? 
                <View>
                  <Text style={{paddingHorizontal:22,paddingBottom:10}}>Please Add Your Permanent Address</Text>
                </View>
              :
              <Text>No data available.</Text>
            :
            <View>
                <Text style={{paddingHorizontal:22,paddingBottom:10}}>Please Add Your Permanent Address</Text>
            </View> 
          }

          <View style={{flexDirection:'row',flex:1}}>
            <View style={{flex:.8}}>
              <Text style={{ color: "#7E7877",paddingHorizontal:22,fontWeight:'bold'}}>Current Address</Text>
            </View>
            
            {checkboxValue == false ?
                Meteor.userId() == this.props.currentId ?
                  <View style={{flex:.2}}>
                    <View style={{alignItems:"flex-end"}}>
                      <TouchableOpacity onPress ={()=>this.props.navigate.navigate('AddressForm',{goBack:true})}>
                        <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                      </TouchableOpacity>
                    </View>
                  </View>             
                :
                <Text></Text>              
                :
              <View style={{flex:.2}}>
                <View style={{alignItems:'flex-end'}}>
                  <TouchableOpacity onPress ={()=>this.props.navigate.navigate('AddressForm',{goBack:true})}>
                    <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                  </TouchableOpacity>
                </View>
              </View>              
            } 
          </View>

            { currentAddress.length > 0 ?
              currentAddress.map((currentAddress,index)=>{
                return(
                  <View key={index} style={{flexDirection:'row',flex:1}}> 
                      {checkboxValue == false ?
                         <Text></Text>
                        : 
                         currentAddress.editStatus == "Block" ?
                          <View></View>
                         :  
                        <View style={{flex:0.1,marginTop:12}}>
                          <CheckBox
                            center
                            containerStyle={{ backgroundColor: "transparent", borderWidth: 0}}
                            checkedColor="#54Aff3"
                            // checked={this.state.isChecked}
                            onClick={() => this.props.addDataToParent("Current Address : "+currentAddress.currentAddressId)}
                            checkBoxColor="#54Aff3"
                            value={this.state.checked}
                            // onClick={this.handleOnChange}
                            // textStyle={{ color: "#54Aff3" }}
                          />
                        </View>
                      }
                     <View style={{flex:1}}>
                      <Card containerStyle={styles.card}>
                        <View style={styles.cardHeader}>
                          <View style={{flex:1,flexDirection:'row'}}>
                            <View  style={{flex:.8,}}>
                              <Text style={{flexWrap:'wrap'}}> {currentAddress.tempLine1} {currentAddress.tempLine2 ? ', ' + currentAddress.tempLine2 : ""} {currentAddress.tempLine3 ? ', ' + currentAddress.tempLine3 : ""} {currentAddress.tempLandmark ? ', ' +  currentAddress.tempLandmark : ""} {currentAddress.tempCity ? ', ' +  currentAddress.tempCity : ""} {currentAddress.tempState ? ', ' + currentAddress.tempState : ""} {currentAddress.tempCountry ? ', ' + currentAddress.tempCountry : ""} {currentAddress.tempPincode}</Text>
                            </View>
                            { 
                              this.props.currentId ?
                                (currentAddress.editStatus == "Open" || currentAddress.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                                  <View style={{flex:.2,flexDirection:'row'}}>
                                    <View style={{paddingRight:10,marginTop:2,paddingHorizontal:5}}>
                                      <TouchableOpacity onPress={()=>this.handleEdit(currentAddress,index,"Current")}>
                                        <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff" />
                                      </TouchableOpacity>
                                    </View>
                                    <View style={{}}>
                                      <TouchableOpacity onPress={()=>this.confirmDelete('deleteCurrentAddress',index)}>
                                        <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                  :
                                  <Text></Text>
                              :
                              currentAddress.editStatus == "Open" || currentAddress.editStatus == "Reopen" ?
                                <View style={{flex:.2,flexDirection:'row'}}>
                                    <View style={{marginTop:2,paddingHorizontal:5}}>
                                      <TouchableOpacity onPress={()=>this.handleEdit(currentAddress,index,"Current")}>
                                        <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff"/>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={{}}>
                                      <TouchableOpacity onPress={()=>this.confirmDelete('deleteCurrentAddress',index)}>
                                        <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                      </TouchableOpacity>
                                    </View>
                                </View>
                              :
                              currentAddress.editStatus == "Block" ?
                              <View>
                                <Text>Order No : {currentAddress.orderNo}</Text>
                                <Text>Status   : {currentAddress.verifiedStatus}</Text>
                                <Text>Order Date : {Moment(currentAddress.orderDate).format("DD/MM/YYYY")}</Text>
                              </View>
                              :
                              <Text></Text>                          
                            }  
                          </View>
                        </View>
                      </Card>
                    </View>                                          
                     
                </View>
                );                   
              })
              :
              checkboxValue == false ?
                Meteor.userId() == this.props.currentId ?
                  <View style={{paddingBottom:10}}>
                      <Text style={{paddingHorizontal:22}}>Please Add Your Current Address</Text>
                  </View>
                :
                <Text style={{paddingHorizontal:22}}>No data available.</Text>
              :
              <View style={{paddingBottom:10}}>
                  <Text style={{paddingHorizontal:22}}>Please Add Your Current Address</Text>
              </View>
            }
            <View style = {styles.lineStyle} />
        </View>
    );
  }
}
export default createContainer((props) => {

  var _id = props.profileId;
  var id = Meteor.userId();
  const postHandle1      = Meteor.subscribe('userprofile',Meteor.userId());
  const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
  // if(props.permanentAddress){
  //   var permanentAddress = props.permanentAddress;
  // }else{
  //   var permanentAddress = [];
  // }
  if(props.currentAddress){
    var currentAddress   = props.currentAddress;
  }else{
    var currentAddress = [];
  }
  const userprofile      = Meteor.collection('userProfile').findOne({"_id" : _id});
  const loading  = !postHandle.ready();
  const loading1 = !postHandle1.ready();
  const proofPerAddrData  = Meteor.collection('tempProofDocs').findOne({"userId":_id,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
  const proofCurrAddrData  = Meteor.collection('tempProofDocs').findOne({"userId":_id,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
  return {
      loading1 : loading1,
      userprofile : userprofile,
      currentAddress  : currentAddress,
      proofPerAddrData,
      proofCurrAddrData,
      loading,
  };


}, AddressInformation);
