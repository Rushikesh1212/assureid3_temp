import React, { Component } from "react";
import { View, Text, Alert,TouchableOpacity,DrawerLayoutAndroid,BackAndroid,BackHandler, Keyboard } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Icon,Header } from 'react-native-elements';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import SideMenu from 'react-native-side-menu';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
import FlipToggle from 'react-native-flip-toggle-button';
import Meteor, {createContainer} from 'react-native-meteor';

import Menu from '../../components/Menu/Menu.js';
import styles from './styles.js';
import ProfileNavigation from './ProfileNavigation.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';


class InfoChild extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      fontSize        : 15,
      effectiveDate   : '',
    };
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

  render(){
    return( 
      <View style={{width:'100%'}}>
        <View style={[styles.inputWrapper, styles.marginHorizontal]}>
          <View style={[styles.formInputView3]}>
            <Text>{this.props.data}</Text>
          </View>
          <View style={[styles.formInputView4]}>
            <FlipToggle
              value        = {this.props.isActive}
              buttonWidth  = {100}
              buttonHeight = {50}
              buttonRadius = {50}
              sliderWidth  = {20}
              sliderHeight = {10}
              sliderRadius = {50}
              onLabel      = {'Yes'}
              offLabel     = {'No'}
              labelStyle   = {{ color: '#fff' }}
              sliderOnColor  = {'#fff' }
              sliderOffColor = {'#fff' }
              buttonOnColor  = {'#00b8FF'}
              buttonOffColor = {'#bbb'}
              onToggle       = {(newState) => this.props.updateParentState({[this.props.stateName] : !this.props.isActive})}
            />
          </View>
        </View>
        <View style={{width:'100%'}}>
          <Collapsible collapsed={!this.props.isActive}>
          <View>                  
          <TextField
            label                 = ""
            lineWidth             = {0}
            tintColor             = {this.state.inputFocusColor}
            inputContainerPadding = {4}
            labelHeight           = {16}
            keyboardType          = 'default'
            inputContainerStyle   = {{height:60}}
            style                 = {styles.inputText}
            labelTextStyle        = {styles.labelText}
            activeLineWidth       = {0}
            fontSize              = {this.state.fontSize}
            labelFontSize         = {this.state.fontSize}
            onChangeText          = {(value) => this.props.updateParentState({[this.props.textState] : value})}
            value                 = {this.props.textData}
          />
          </View>
          </Collapsible> 
        </View>
      </View>
    );
  }
}


class OtherInfoForm extends React.Component{

  constructor(props){
    super(props);
    this.state={
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      fontSize        : 15,
      effectiveDate   : '',
      isActive1       : false,
      isActive2       : false,
      isActive3       : false,
      isActive4       : false,
      otherBusinessInvolving  : '',
      dismissedFromService    : '',
      criminalOffence         : '',
      civilJudgments          : ''
    };
    this.toggle = this.toggle.bind(this);
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

  browseFile(event){
    DocumentPicker.show({ filetype : [DocumentPickerUtil.images()]},(error,res) => {
                          // Android
                          console.log(res);
                        });    
  }

  updateState(data) {
    this.setState(data);
  }

  submitOtherInfo = () =>{
    Keyboard.dismiss();
    
    var userId   = Meteor.userId();
    var formValues = {
      "otherBusinessInvolving"  : this.state.otherBusinessInvolving,
      "dismissedFromService"    : this.state.dismissedFromService,
      "criminalOffence"         : this.state.criminalOffence,
      "civilJudgments"          : this.state.civilJudgments,
    }
    console.log("formValues = ",formValues);

    Meteor.call("insertOtherInformation",userId,formValues,(error,result) =>{
      if(error){
        console.log(error.reason);
        Alert.alert(
          'Error',
        )
      }else{
        Alert.alert('','Other Information submitted successfully!');
        this.props.navigation.navigate('ViewProfile');
      }
    });
  }

  render(){
    const {navigate,goBack}   = this.props.navigation;
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

    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        content={navigationView}
        // openDrawerOffset={(viewport) => viewport.width - 300}
        side="right"
        >
        <SideMenu disableGestures={true} openMenuOffset={300} menu={menu} isOpen={this.state.isOpen}  onChange={isOpen => this.updateMenuState(isOpen)} >
         
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

           
            <HeaderDy headerTitle="Profile" goBack={goBack}/>

      <ScrollView keyboardShouldPersistTaps="always">
      <ProfileNavigation prevCount={6} nextCount={0} formName={"Other"} iconName={"file-o"} 
      prevLink={"CertificateForm"} nextLink={""} navigate={this.props.navigation.navigate} />

        <View style={styles.titleContainer}>
          <Text style={styles.heading}>OTHER INFORMATION</Text>
          <View style={styles.headingLine}></View>          
        </View>
        
        <View style={styles.formContainer}>
          {/*<Text style={styles.heading}>OTHER INFORMATION</Text>
          <View style={styles.headingLine}></View>*/}

          <InfoChild data     = {"Are you currently engaged in any other business either as a proprietor, partner, officer, director, trustee, employee and agent or otherwise? If yes, please give details."} 
                     isActive = {this.state.isActive1} 
                     stateName = {'isActive1'}
                     textData  = {this.state.otherBusinessInvolving}
                     textState = {'otherBusinessInvolving'}
                     updateParentState = {this.updateState.bind(this)}/>

          <InfoChild data     = {"Have you ever been dismissed from the services of any previous employer(s)? If yes, please give details."} 
                     isActive = {this.state.isActive2} 
                     stateName = {'isActive2'}
                     textData  = {this.state.dismissedFromService}
                     textState = {'dismissedFromService'}
                     updateParentState = {this.updateState.bind(this)}/>

          <InfoChild data     = {"Have you ever been convicted in a court of law or of a criminal offence? If yes, please give details and status of prosecutions against you."} 
                     isActive = {this.state.isActive3} 
                     stateName = {'isActive3'}
                     textData  = {this.state.criminalOffence}
                     textState = {'criminalOffence'}
                     updateParentState = {this.updateState.bind(this)}/>

          <InfoChild data     = {"Have you ever had any civil judgments made against you? If yes, please give details."} 
                     isActive = {this.state.isActive4} 
                     stateName = {'isActive4'}
                     textData  = {this.state.civilJudgments}
                     textState = {'civilJudgments'}
                     updateParentState = {this.updateState.bind(this)}/>

          <View style={{width:'100%',alignItems:'center'}}>
            <View style={styles.formInputView}>
              <Button
                textStyle   = {{textAlign:'center'}}
                title       = "Save & Go to Profile"
                buttonStyle = {styles.buttonSubmit}
                onPress     = {this.submitOtherInfo}
              />
            </View>
          </View>

        </View>

      </ScrollView>
      </SideMenu>
       </Drawer>
    );
  }
}

export default createContainer((props) => {

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;
  
  return{
    notificationCount
  }

}, OtherInfoForm);