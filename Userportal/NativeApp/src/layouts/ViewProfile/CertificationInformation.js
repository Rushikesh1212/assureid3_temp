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
import CheckBox from 'react-native-check-box';
import Moment from 'moment';

import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';


export default class CertificationInformation extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      checked: false,
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

  confirmDelete = (index) => {
    Alert.alert(
      '','Do you want to delete this data?',
      [
        {text: 'Delete',onPress: ()=>{this.deleteCertificate(index)}},
        {text: 'Cancel'}
      ]
    );
  }

  deleteCertificate = (index) =>{
    Meteor.call("removeCertificateData",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        // Alert.alert("Certificate Deleted Successfully!!!");
      }
    });
  }

  handleEdit = (certificateDetails,index)=>{
    console.log("certificateDetails = ",certificateDetails);
    console.log("index = ",index);
    this.props.navigate.navigate('CertificateForm',{certificateDetails:certificateDetails,index:index});
  }

  render(){

    var checkboxValue   = this.props.checkboxRequired;
    var certificateData = (this.props.certificateData) ? this.props.certificateData.filter(Boolean) : [];

    return(
      <View>
        <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex:.8,flexDirection:'row'}}>
            <Icon name="certificate" type="font-awesome" size={18}  color="#00b8ff" />
            <Text style={{fontWeight: 'bold',padding:10,color:'#00b8ff'}}>Certification Information</Text>
          </View> 
          {checkboxValue == false 
          ?
            Meteor.userId() == this.props.currentId 
            ?
              <View style={{flex:.2,alignItems:'flex-end',marginTop:10}}>
                <TouchableOpacity onPress ={()=>this.props.navigate.navigate('CertificateForm',{goBack:true})}>
                  <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                </TouchableOpacity>
              </View>
            :
              null                      
          :
            <View style={{flex:.2,alignItems:'flex-end',marginTop:10}}>
              <TouchableOpacity onPress ={()=>this.props.navigate.navigate('CertificateForm',{goBack:true})}>
                <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
              </TouchableOpacity>
            </View>
          }
          
        </View>
        {(certificateData.length>0) 
        ?
          certificateData.map((certificateDetails, index)=>{
            return(
              <View key={index} style={{flexDirection:'row',flex:1}}>
              {checkboxValue == false 
              ?
                null
              : 
                certificateDetails.editStatus == "Block" 
                ?
                  null
                :
                  <View style={{flex:0.1}}>
                    <CheckBox
                      center
                      containerStyle={{ backgroundColor: "transparent", borderWidth: 0}}
                      checkedColor="#54Aff3"
                      onClick={() => this.props.addDataToParent("Certificate Details : "+certificateDetails.certificateId)}
                      checkBoxColor="#54Aff3"
                      value={this.state.checked}
                    />
                  </View>
              }
              <View style={{flex:1}}>
                <Card containerStyle={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{flexDirection:'row',flex:1}}>
                      <View style={{flex:.2,marginTop:6}}>
                         <Icon name="certificate" type="font-awesome" size={25}  color="#00b8ff" />
                      </View>
                      <View style={{flex:.8}}>
                        <Text>{certificateDetails.certificateName}</Text>
                        <Text>{certificateDetails.issuedBy}</Text>
                        {/*<Text>{certificateDetails.certificatedOn}</Text>*/}
                      </View>

                    {this.props.currentId 
                    ?
                      (certificateDetails.editStatus == "Open" || certificateDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId 
                      ?
                       <View style={{flex:.5,flexDirection:'row'}}>
                          <View style={{paddingRight:10,marginTop:2}}>
                            <TouchableOpacity onPress={()=>this.handleEdit(certificateDetails,index)}>
                              <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                            </TouchableOpacity>
                          </View>
                          <View style={{}}>
                            <TouchableOpacity onPress={()=>this.confirmDelete(index)}>
                              <Icon name="delete-forever" type="MaterialIcons" size={25}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                            </TouchableOpacity>
                          </View>
                        </View>
                      :
                       null                          
                    :
                      certificateDetails.editStatus == "Open" || certificateDetails.editStatus == "Reopen" 
                      ?
                      <View style={{flex:.5,flexDirection:'row'}}>
                        <View style={{paddingRight:5,marginTop:2}}>
                          <TouchableOpacity onPress={()=>this.handleEdit(certificateDetails,index)}>
                            <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                          </TouchableOpacity>
                        </View>
                        <View style={{}}>
                          <TouchableOpacity onPress={()=>this.confirmDelete(index)}>
                            <Icon name="delete-forever" type="MaterialIcons" size={25}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                      :
                        certificateDetails.editStatus == "Block" 
                        ?
                          <View>
                            <Text>Order No : {certificateDetails.orderNo}</Text>
                            <Text>Status   : {certificateDetails.verifiedStatus}</Text>
                            <Text>Order Date : {Moment(certificateDetails.orderDate).format("DD/MM/YYYY")}</Text>
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
          checkboxValue == false ?
            Meteor.userId() == this.props.currentId ?
              <View>
                <Text style={{paddingHorizontal:22,paddingBottom:10}}> Please add your Certificate Information</Text>
              </View>
            :
            <Text style={{paddingHorizontal:22}}>No data available.</Text>
          :
          <View>
            <Text style={{paddingHorizontal:22,paddingBottom:10}}>Please add your Certificate Information</Text>
          </View>
        }

        <View style = {styles.lineStyle}></View>
                        
      </View>
    );
  }
}
