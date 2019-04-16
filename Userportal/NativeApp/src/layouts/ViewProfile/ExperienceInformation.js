import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';
import CheckBox from 'react-native-check-box';
import Moment from 'moment';

import styles from './styles.js';


export default class ExperienceInformation extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isChecked: false,
      checked: false,
    };
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

  confirmDelete = (index) => {
    Alert.alert(
      '','Do you want to delete this data?',
      [
        {text: 'Delete',onPress: ()=>{this.deleteExperience(index)}},
        {text: 'Cancel'}
      ]
    );
  }

  deleteExperience = (index) =>{
    Meteor.call("removeEmploymentData",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
      }
    });
  }

  handleEdit = (employmentDetails,index)=>{
    console.log("employmentDetails = ",employmentDetails);
    console.log("index = ",index);
    this.props.navigate.navigate('EmploymentInfo',{employmentDetails:employmentDetails,index:index});
  }


  render(){
    var checkboxValue = this.props.checkboxRequired;
    var employeeData  = (this.props.employeeData) ? this.props.employeeData.filter(Boolean) : [];

    return(
      <View style={{ flex: 1, backgroundColor: '#fff',paddingTop:10}}>

        <View style={{flexDirection:'row',flex:1}}>
            <View style={{flex:0.8,flexDirection:'row'}}>
              <Icon name="briefcase" type="font-awesome" size={15}  color="#00b8ff" />
              <Text style={{ color: "#00b8ff",paddingLeft:12,fontWeight:'bold'}}>Experience Information</Text>
            </View>
            
            {checkboxValue == false ?
                Meteor.userId() == this.props.currentId ?
                  <View style={{flex:0.2}}>
                    <View style={{alignItems:'flex-end'}}>
                      <TouchableOpacity onPress ={()=>this.props.navigate.navigate('EmploymentInfo',{goBack:true})}>
                        <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                      </TouchableOpacity>
                    </View>
                  </View>             
                :
                <Text></Text>
              :
              <View style={{flex:0.2}}>
                <View style={{alignItems:'flex-end'}}>
                  <TouchableOpacity onPress ={()=>this.props.navigate.navigate('EmploymentInfo',{goBack:true})}>
                    <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                  </TouchableOpacity>
                </View>
              </View>             
            }
          </View>

        {(employeeData.length > 0)
        ?
          employeeData.map((employmentDetails,index)=>{
            return(
              <View key={index} style={{flexDirection:'row',flex:1}}>
              {checkboxValue == false
              ?
                null
              :
                employmentDetails.editStatus == "Block"
                ?
                  null
                :
                  <View style={{flex:0.1,marginTop:12}}>
                    <CheckBox
                      center
                      containerStyle={{ backgroundColor: "transparent", borderWidth: 0}}
                      checkedColor="#54Aff3"
                      onClick={() => this.props.addDataToParent("Employment : "+employmentDetails.employementId)}
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
                          <Icon name="building-o" type="font-awesome" size={25}  color="#00b8ff" />
                        </View>
                        <View style={{flex:.8}}>
                          <Text>{employmentDetails.designation}</Text>
                          <Text>{employmentDetails.nameOfEmployer}</Text>
                          <Text>{employmentDetails.employmentFrom ? Moment(employmentDetails.employmentFrom,'MM/DD/YYYY').format('MMMM YYYY') + ' - ' : ""}{employmentDetails.employmentTo ? employmentDetails.employmentTo == 'Present' ? employmentDetails.employmentTo : Moment(employmentDetails.employmentTo,'MM/DD/YYYY').format('MMMM YYYY') : ""}</Text>
                        </View>
                        {/*<View style={{flex:.2,alignItems:'flex-end'}}>*/}
                        {this.props.currentId
                        ?
                          (employmentDetails.editStatus == "Open" || employmentDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId 
                          ?
                            <View style={{flex:.5,flexDirection:'row'}}>
                              <View style={{paddingRight:10,marginTop:2}}>
                                <TouchableOpacity onPress={()=>this.handleEdit(employmentDetails,index)}>
                                  <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                              <View style={{}}>
                                <TouchableOpacity onPress={()=>this.confirmDelete(index)}>
                                  <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          :
                            null
                        :
                          employmentDetails.editStatus == "Open" || employmentDetails.editStatus == "Reopen"
                          ?
                            <View style={{flex:.5,flexDirection:'row'}}>
                              <View style={{paddingRight:5,marginTop:2}}>
                                <TouchableOpacity onPress={()=>this.handleEdit(employmentDetails,index)}>
                                  <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                              <View style={{}}>
                                <TouchableOpacity onPress={()=>this.confirmDelete(index)}>
                                  <Icon name="delete-forever" type="MaterialIcons" size={22}  color="#00b8ff"/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          :
                            employmentDetails.editStatus == "Block"
                            ?
                              <View style={{paddingLeft:5}}>
                                <Text>Order No : {employmentDetails.orderNo}</Text>
                                <Text>Status   : {employmentDetails.verifiedStatus}</Text>
                                <Text>Order Date : {Moment(employmentDetails.orderDate).format("DD/MM/YYYY")}</Text>
                              </View>
                            :
                              null
                        }

                        {/*</View>*/}
                      </View>
                    </View>
                  </Card>
                </View>

              </View>
            );
          })
        :
          checkboxValue == false 
          ?
            Meteor.userId() == this.props.currentId
            ?
              <View>
                <Text style={{paddingHorizontal:22,paddingBottom:10}}>Please add your Experience Information</Text>
              </View>
            :
              <View>  
                <Text style={{paddingHorizontal:22}}>No data available.</Text>
              </View>
          :
            <View>
              <Text style={{paddingHorizontal:22,paddingBottom:10}}>Please add your Experience Information</Text>
            </View>
        }
        
        <View style = {styles.lineStyle}></View>

      </View>  
    );
  }
}
