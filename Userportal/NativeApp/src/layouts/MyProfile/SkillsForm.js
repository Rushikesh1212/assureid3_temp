import React, { Component } from "react";
import Meteor, {createContainer} from 'react-native-meteor';
import { View, Text, Alert,TouchableOpacity,DrawerLayoutAndroid,BackAndroid,BackHandler,Image } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { ScrollView, TextInput, StyleSheet } from 'react-native';
import { Header,Button, Icon } from 'react-native-elements';

import styles from './styles.js';

export default class SkillsForm extends React.Component{

  constructor(props){
    super(props);
    this.state={
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      fontSize        : 15,
      skillName       : '',
    };
    this.toggle = this.toggle.bind(this);
  }

  closeControlPanel = () => {
    this._drawer.close()
  }
  openControlPanel = () => {
    this._drawer.open()
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.androidBackHandler.bind(this));
  }
  androidBackHandler(){
    console.log('androidBackHandler: ',this.props.navigation );
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

  addSkill = () => {
    var id        = Meteor.userId();
    var skillName = this.state.skillName;
    // console.log("skillName = ",skillName);
    var skills = {
      skillName,
    }
    // console.log("skills",skills);
    if(skillName){
        Meteor.call('addSkills',id,skills, (error,result) => {
        if (error) {
          console.log(error.reason);
        }else{
          console.log("Skill added Successfully!");
          this.setState({skillName:''});
        }
      });  
    }
  }

  render(){
    
    return (
      <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
        {/*<Text style={styles.heading}>SKILLS</Text>
        <View style={styles.headingLine}></View>*/}

        {/*<Text style={{alignSelf:'flex-start'}}>Skill</Text>*/}
        <View style={{flex:1,flexDirection:'row',borderWidth:1,borderColor:'#aaa',padding:0}}>
          
          <View style={{ flex:0.9}}>
            <TextInput
              style                 = {{height:37,paddingLeft:10,fontSize:15}}
              underlineColorAndroid = 'rgba(0,0,0,0)'
              placeholderTextColor  = "#999"
              selectionColor        = "#aaa"
              keyboardType          = "default"
              placeholder           = "Skill"
              defaultValue          = {this.state.skillName}
              onChangeText          = {(skillName) => this.setState({skillName})}
            />
          </View>

          <TouchableOpacity style={{flex:0.1}}>
            <Icon 
              containerStyle={{flex:1,backgroundColor:'#00b8ff'}} 
              name="plus" 
              type="font-awesome" 
              size={16} 
              color="#fff"
              onPress = {this.addSkill} 
            />
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}
