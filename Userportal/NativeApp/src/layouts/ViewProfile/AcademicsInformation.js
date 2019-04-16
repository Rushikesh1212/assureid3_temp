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
import { RNS3 } from 'react-native-aws3';
import CheckBox from 'react-native-check-box';
import Moment from 'moment';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';


export default class AcademicsInformation extends React.Component {
  constructor(props){
    super(props);
    this.state={
      checked: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  } 

  confirmDelete = (deleteFuncName,index) => {
    console.log("func=> ","this."+deleteFuncName+"("+index+")");
    Alert.alert(
      '','Do you want to delete this data?',
      [
        {text: 'Delete',onPress: ()=>{this[deleteFuncName](index)}},
        {text: 'Cancel'}
      ]
    );
  }

  deleteBasicEducation = (index) =>{
    Meteor.call("removeBasicEducation",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{ 
      }
    });
  }

  deleteProfessionalEducation = (index) =>{
    Meteor.call("removeProfessionalEducation",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{ 
      }
    });
  }

  handleEdit = (academicsDetails,index,addressType)=>{
    console.log("academicsDetails = ",academicsDetails);
    console.log("index = ",index);
    this.props.navigate.navigate('AcademicForm',{academicsDetails:academicsDetails,index:index,addressType:addressType});
  }

  render(){
    var checkboxValue    = this.props.checkboxRequired;
    var academicsData    = (this.props.academicsData) ? this.props.academicsData.filter(Boolean) : [];
    var professionalData = (this.props.professionalData) ? this.props.professionalData.filter(Boolean) : [];

    return(
      <View>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:1,flexDirection:'row'}}>
            <Icon name="graduation-cap" type="font-awesome" size={15}  color="#00b8ff" />
            <Text style={{padding:10,fontWeight: 'bold',color:'#00b8ff'}}>Academics Information</Text>
          </View> 
          <View style={{flex:.2,alignItems:'flex-end',marginTop:10}}>
            <TouchableOpacity onPress ={()=>this.props.navigate.navigate('AcademicForm',{goBack:true})}>
              <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
            </TouchableOpacity>
          </View>
        </View>

        {(academicsData.length>0) 
        ?
          academicsData.map((academicsDetails, index)=>{
            return(
              <View style={{flexDirection:'row',flex:0.1}} key={index}>
                {checkboxValue == false 
                ?
                  null
                : 
                  academicsDetails.editStatus == "Block" 
                  ?
                    null
                  :
                    <View style={{flex:0.1,marginTop:12}}>
                      <CheckBox
                        center
                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0}}
                        checkedColor="#54Aff3"
                        onClick={() => this.props.addDataToParent("Academics : "+academicsDetails.educationId)}
                        checkBoxColor="#54Aff3"
                        value={this.state.checked}
                      />
                    </View>
                }
                <View style={{flex:1}}>
                  <Card containerStyle={styles.card}>
                    <View style={styles.cardHeader}>
                      
                      <View style={{flexDirection:'row',flex:1,}}>
                        <View style={{flex:.2,marginTop:6}}>
                          <Icon name="institution" type="font-awesome" size={20}  color="#00b8ff" />
                        </View>
                        <View style={{flex:.8}}>
                          <Text>{academicsDetails.university}</Text>
                          <Text>{academicsDetails.educationQualification}{academicsDetails.specialization ? ' - ' + academicsDetails.specialization : ""}</Text>
                          <Text>{academicsDetails.dateAttendedFrom ? Moment(academicsDetails.dateAttendedFrom,'MM/DD/YYYY').format('MMMM YYYY') : ""}{academicsDetails.dateAttendedTo ? ' - ' + Moment(academicsDetails.dateAttendedTo,'MM/DD/YYYY').format('MMMM YYYY') : ""}</Text>
                        </View>
                        {this.props.currentId
                        ?
                          (academicsDetails.editStatus == "Open" || academicsDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId
                          ?
                            <View style={{flex:.5,flexDirection:'row'}}>
                              <View style={{paddingRight:10,marginTop:2}}>
                                <TouchableOpacity onPress={()=>this.handleEdit(academicsDetails,index,"Basic")}>
                                  <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                              <View style={{}}>
                                <TouchableOpacity onPress={()=>this.confirmDelete('deleteBasicEducation',index)}>
                                  <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          :
                            null
                        :
                          academicsDetails.editStatus == "Open" || academicsDetails.editStatus == "Reopen"
                          ?
                            <View style={{flex:.5,flexDirection:'row'}}>
                              <View style={{paddingRight:5,marginTop:2}}>
                                <TouchableOpacity onPress={()=>this.handleEdit(academicsDetails,index,"Basic")}>
                                  <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                              <View style={{}}>
                                <TouchableOpacity onPress={()=>this.confirmDelete('deleteBasicEducation',index)}>
                                  <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          :
                            academicsDetails.editStatus == "Block"
                            ?
                              <View>
                                <Text>Order No : {academicsDetails.orderNo}</Text>
                                <Text>Status : {academicsDetails.verifiedStatus}</Text>
                                <Text>Order Date : {Moment(academicsDetails.orderDate).format("DD/MM/YYYY")}</Text>
                              </View>
                            :
                              null
                        }
                      </View>

                    </View>
                  </Card>
                </View>
              </View>
            );
          })
        :
          <View>
            <Text style={{paddingHorizontal:22,paddingBottom:10}}>Please add your Academics Information</Text>
          </View>
        }

        {(professionalData.length>0)
        ?
          professionalData.map((professionalsDetails, index)=>{
            return(
              <View style={{flexDirection:'row',flex:1}} key={index}>
                {checkboxValue == false 
                ?
                  null                     
                : 
                  professionalsDetails.editStatus == "Block" 
                  ?
                    null
                  :
                    <View style={{flex:0.1,marginTop:12}}>
                      <CheckBox
                        center
                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0}}
                        checkedColor="#54Aff3"
                        onClick={() => this.props.addDataToParent("Professionals Academics : "+professionalsDetails.professionalEducationId)}
                        checkBoxColor="#54Aff3"
                        value={this.state.checked}
                      />
                    </View>
                }
                <View style={{flex:1}}>
                  <Card containerStyle={styles.card}>
                    <View style={styles.cardHeader}>

                      <View style={{flexDirection:'row',flex:1}}>
                        <View style={{flex:.2,marginTop:5}}>
                           <Icon name="institution" type="font-awesome" size={20}  color="#00b8ff" />
                        </View>
                        <View style={{flex:.8}}>
                          <Text>{professionalsDetails.professionalQualification}</Text>
                          <Text>{professionalsDetails.qualifyingBodyNm}</Text>
                          <Text>{professionalsDetails.dateOfQualification}</Text>
                        </View>
                        {this.props.currentId
                        ?
                          (professionalsDetails.editStatus == "Open" || professionalsDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId
                          ?
                            <View style={{flex:.5,flexDirection:'row'}}>
                              <View style={{paddingRight:10,marginTop:2}}>
                                <TouchableOpacity onPress={()=>this.handleEdit(professionalsDetails,index,"Professional")}>
                                  <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                                </TouchableOpacity>
                              </View>
                              
                              <View style={{}}>
                                <TouchableOpacity onPress={()=>this.confirmDelete('deleteProfessionalEducation',index)}>
                                  <Icon name="delete-forever" type="MaterialIcons" size={25}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          :
                            null
                        :
                          professionalsDetails.editStatus == "Open" || professionalsDetails.editStatus == "Reopen"
                          ?
                            <View style={{flex:.5,flexDirection:'row'}}>
                              <View style={{paddingRight:5,marginTop:2}}>
                                <TouchableOpacity onPress={()=>this.handleEdit(professionalsDetails,index,"Professional")}>
                                  <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                                </TouchableOpacity>
                              </View>
                              <View style={{}}>
                                <TouchableOpacity onPress={()=>this.confirmDelete('deleteProfessionalEducation',index)}>
                                  <Icon name="delete-forever" type="MaterialIcons" size={25}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          :
                            professionalsDetails.editStatus == "Block"
                            ?
                              <View style={{paddingLeft:5}}>
                                <Text>Order No : {professionalsDetails.orderNo}</Text>
                                <Text>Status : {professionalsDetails.verifiedStatus}</Text>
                                <Text>Order Date : {Moment(professionalsDetails.orderDate).format("DD/MM/YYYY")} </Text>
                              </View>
                            :
                              null
                        }
                      </View>
                      
                    </View>

                  </Card>
                </View>
                
              </View>
            );
          })
        :
          null
        }

        <View style = {styles.lineStyle} />

      </View>
    );
  }
}
 