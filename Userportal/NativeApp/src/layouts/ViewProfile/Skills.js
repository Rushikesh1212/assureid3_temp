import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar,CheckBox} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';

import styles from './styles.js';

export default class Skills extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      isChecked: false,
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
        {text: 'Delete',onPress: ()=>{this.deleteSkills(index)}},
        {text: 'Cancel'}
      ]
    );
  }

  deleteSkills = (index) =>{
    var userId  = Meteor.userId();
    Meteor.call('deleteSkills',index,userId,function(error,result) {
        if (error) {
          console.log(error.reason);
        }else{
          // swal("Done","Skill Deleted successfully!");   
        }
     })
  }

  render(){
    var checkboxValue = this.props.checkboxRequired;
    var skillData     = (this.props.skillData) ? this.props.skillData.filter(Boolean) : [];

    return(
      <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0,paddingTop:3}}>
            <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>
                <View>
                  <View style={{flex:1, flexDirection:'row'}}>
                    <View style={{flex:.8,flexDirection:'row'}}>
                        <Icon name="certificate" type="font-awesome" size={18}  color="#00b8ff" />
                        <Text style={{fontWeight: 'bold',paddingHorizontal:10,paddingTop:7,color:'#00b8ff'}}>Skills </Text>
                    </View> 
                    <View style={{flex:.2,alignItems:'flex-end',marginTop:10}}>
                      <TouchableOpacity onPress ={()=>this.props.navigate.navigate('CertificateForm')}>
                        <Icon name="plus-square-o" type="font-awesome" size={20}  color="#00b8ff"/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  { (skillData.length>0) ?
                    skillData.map((skillsDetails,index)=>{
                      return(
                        <View style={styles.MainContainer} key={index}>
                          <TouchableOpacity
                              style={styles.SubmitButtonStyle}
                              activeOpacity = { .5 }
                              >
                              <View style={{flex:1, flexDirection:'row',paddingVertical:10}}>
                                <View style={{flex:.8,flexDirection:'row',paddingHorizontal:15}}>
                                  <Text style={{flexWrap:'wrap'}}>
                                    {skillsDetails.skillName}
                                  </Text>
                                </View>
                                
                                  {checkboxValue == false ?
                                    Meteor.userId() == this.props.currentId ?
                                     <View style={{flex:.2,flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=>this.confirmDelete(index)}>
                                          <Icon name="close" type="FontAwesome" size={20}  color="#00b8ff"/>
                                        </TouchableOpacity>
                                      </View>
                                    :
                                    null
                                  :
                                  <View style={{flex:.2,flexDirection:'row'}}>
                                    <TouchableOpacity onPress={()=>this.confirmDelete(index)}>
                                      <Icon name="close" type="FontAwesome" size={20}  color="#00b8ff"/>
                                    </TouchableOpacity>
                                  </View>
                                }
                              </View>
                          </TouchableOpacity>
                        </View>
                        );
                      })
                     :
                      <View>
                        <Text style={{paddingHorizontal:22,paddingBottom:10}}>Please add your Skills</Text>
                      </View>
                   }
                   <View style = {styles.lineStyle} />

                </View>
                </ScrollView>
              </View>
            
    );
  }
}
