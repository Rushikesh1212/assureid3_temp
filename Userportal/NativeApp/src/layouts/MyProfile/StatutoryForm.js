import React,{Component } from 'react';
import PropTypes from 'prop-types';
import {Platform, ScrollView, StyleSheet, Text,
TouchableOpacity, TextInput, View,  BackHandler, Alert,
 Image, BackAndroid, findNodeHandle, DrawerLayoutAndroid, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Card, Button, Icon, Avatar} from 'react-native-elements';
import Meteor, {createContainer} from 'react-native-meteor';
import SideMenu from 'react-native-side-menu';
import RNExitApp from 'react-native-exit-app';
import { TextField } from 'react-native-material-textfield';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';
import ValidationComponent from 'react-native-form-validator';

import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import ProfileNavigation from './ProfileNavigation.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class StatutoryForm extends ValidationComponent {
  constructor(props){
    super(props);
    let name ="";
    if(this.props.userName)
      name = "Welcome " + this.props.userName;
    this.state={
      name            :name,
      isOpen          : false,
      selectedItem    : 'About',
      inputFocusColor : '#00b8FF',
      fontSize        : 15,
      adharCardNo     : '',
      panCardNo       : '',
      drivingCardNo   : '',
      votingCardNo    : '',
      rationCardNo    : '',
      passportNo      : '',
      adharCardNoError: '',
      panCardNoError  : '',
      passportNoError : '',
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.toggle = this.toggle.bind(this);
    this.uploadProofDocs = this.uploadProofDocs.bind(this);
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

  componentWillReceiveProps(nextProps){
    if(nextProps.loading){
      if(nextProps.identity){
        this.setState({
          adharCardNo     : nextProps.identity.adharCardNo,
          panCardNo       : nextProps.identity.panCardNo,
          drivingCardNo   : nextProps.identity.drivingCardNo,
          votingCardNo    : nextProps.identity.votingCardNo,
          rationCardNo    : nextProps.identity.rationCardNo,
          passportNo      : nextProps.identity.passportNo,
        });
      }
    }
  }

  uploadProofDocs(proofSubtype){
    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;

    DocumentPicker.show({ filetype : [DocumentPickerUtil.images()]},(error,res) => {
      if(res){
                          // Android
                          // console.log("Result:: ",res);
                          // var fileName = userId+'_'+Date.now()+'_'+res.fileName;
                          var fileName = userId+'_'+res.fileName;
                          var fileExt = fileName.split('.').pop();  

                          var file = {
                            uri   : res.uri,
                            name  : fileName,
                            type  : res.type,
                          }
                          
                          // console.log("file obj => ",file);
                          
                          const options = {
                            keyPrefix           : "uploads/",
                            bucket              : s3Data.bucket,
                            region              : s3Data.region,
                            accessKey           : s3Data.key,
                            secretKey           : s3Data.secret,
                          }

                          RNS3.put(file, options).then((response) => {
                            // console.log("------------response---------------");
                            // console.log('response: ',response);
                            if (response.status !== 201)
                              throw new Error("Failed to upload image to S3");
                            // console.log("=========  response.body  ==================");
                            // console.log(response.body);
                            // console.log("---------  response.body  ------------------");
                            
                            var fileLink = response.body.postResponse.location;
                            var fileDetails = {
                              name          : fileName,
                              ext           : fileExt,
                              link          : fileLink,
                              proofSubtype  : proofSubtype,
                            }
                            // console.log("fileDetails = ",fileDetails);

                            Meteor.call("insertIdentityProofDoc",userId,fileDetails,(error,result) =>{
                              if(error){
                                console.log(error.reason);
                                Alert.alert(
                                  'Error',
                                )
                              }else{
                                console.log("File details saved.");
                              }
                            });
                            /**
                             * {
                             *   postResponse: {
                             *     bucket: "your-bucket",
                             *     etag : "9f620878e06d28774406017480a59fd4",
                             *     key: "uploads/image.png",
                             *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
                             *   }
                             * }
                             */
                          }).catch((error) => console.log("Handled Exceptions image ",error));
      }
                        });    
  }

  removeProofDocs = (subtype) =>{
    Meteor.call("removeIdentityProofDocs",'',subtype,(error,result) =>{
      if(error){
        console.log(error.reason);
        Alert.alert(
          'Error',
        )
      }else{
        console.log("File details removed.");
      }
    });
  }

  handleSave = () =>{
    Keyboard.dismiss();
    
    var userId        = Meteor.userId();
    var adharCardNo   = this.state.adharCardNo;
    var panCardNo     = this.state.panCardNo;
    var drivingCardNo = this.state.drivingCardNo;
    var votingCardNo  = this.state.votingCardNo;
    var rationCardNo  = this.state.rationCardNo;
    var passportNo    = this.state.passportNo;

    if(this.validInput()){
      Meteor.call("insertStatutory",userId,adharCardNo,panCardNo,drivingCardNo,votingCardNo,rationCardNo,passportNo,(error,result) =>{
        if(error){
          console.log(error.reason);
          Alert.alert(
            'Error',
          )
        }else{
          console.log("form submitted....");
          Alert.alert(
            '','Identity Information has been saved!'
          )
          // this.props.navigation.navigate('AddressForm');
        }
      });
    }
  }

  validInput = () =>{
    var valid = true;

    this.validate({
      adharCardNo: {regxS1: true},
      panCardNo: {regxS2: true},
      passportNo: {regxS3:true},
    });

    if(this.isFieldInError("adharCardNo")){
      let adharCardNoError = this.getErrorsInField('adharCardNo');
      console.log("adharCardNoError = ",adharCardNoError);
      this.setState({adharCardNoError});
      valid = false;
    }else{
      this.setState({adharCardNoError:''});
    }
    if(this.isFieldInError("panCardNo")){
      let panCardNoError = this.getErrorsInField('panCardNo');
      console.log("panCardNoError = ",panCardNoError);
      this.setState({panCardNoError});
      valid = false;
    }else{
      this.setState({panCardNoError:''});
    }
    if(this.isFieldInError("passportNo")){
      let passportNoError = this.getErrorsInField('passportNo');
      console.log("passportNoError = ",passportNoError);
      this.setState({passportNoError});
      valid = false;
    }else{
      this.setState({passportNoError:''});
    }

    return valid;

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

    return(
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
        <ProfileNavigation prevCount={1} nextCount={5} formName={"Identity"} iconName={"id-card"} 
        prevLink={"MyProfile"} nextLink={"AddressForm"} navigate={this.props.navigation.navigate} />

        <View style={styles.titleContainer}>
          <Text style={styles.heading}>IDENTITY INFORMATION</Text>
          <View style={styles.headingLine}></View>          
        </View>

        <View style={styles.formContainer}>
          {/*<Text style={styles.heading}>IDENTITY INFORMATION</Text>
          <View style={styles.headingLine}></View>*/}

          <View style={styles.inputWrapper}>
            <View style={styles.styleInputView}>
              <TextField
                label                 = "Aadhar Card No.(xxxx xxxx xxxx)"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                onChangeText          = {(adharCardNo) => this.setState({adharCardNo})}
                value                 = {this.state.adharCardNo}
                keyboardType          = 'phone-pad'
                error                 = {this.state.adharCardNoError[0]}
              />
            </View>

            {this.props.identity 
            ? 
              this.props.identity.aadhar1 && !this.props.identity.aadhar2
              ?
                <View style={styles.buttonView}>
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonIdentityBrowse}
                    onPress     = {()=>this.uploadProofDocs("aadhar2")}
                  />
                </View>
              : 
                this.props.identity.aadhar1 && this.props.identity.aadhar2
                ?
                  null
                :
                  <View style={styles.buttonView}>
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonIdentityBrowse}
                      onPress     = {()=>this.uploadProofDocs("aadhar1")}
                    />
                  </View>
            : 
              <View style={styles.buttonView}>
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonIdentityBrowse}
                  onPress     = {()=>this.uploadProofDocs("aadhar1")}
                />
              </View>
            }
            
          </View>

          {this.props.identity
          ?
            this.props.identity.aadhar1 || this.props.identity.aadhar2
            ?
              <View style={styles.inputWrapper}>
              {
                this.props.identity.aadhar1
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.aadhar1}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("aadhar1")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

              {
                this.props.identity.aadhar2
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.aadhar2}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("aadhar2")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

                
              </View>
            :
              null 
          :
            null
          }

          <View style={styles.inputWrapper}>
            <View style={styles.styleInputView}>
              <TextField
                label                 = "Pan Card No.(xxxxxxxxxx)"
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                onChangeText          = {(panCardNo) => this.setState({panCardNo})}
                value                 = {this.state.panCardNo}
                // keyboardType          = 'phone-pad'
                error                 = {this.state.panCardNoError[0]}
              />
            </View>

            {this.props.identity 
            ? 
              this.props.identity.pan1 && !this.props.identity.pan2
              ?
                <View style={styles.buttonView}>
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonIdentityBrowse}
                    onPress     = {()=>this.uploadProofDocs("pan2")}
                  />
                </View>
              : 
                this.props.identity.pan1 && this.props.identity.pan2
                ?
                  null
                :
                  <View style={styles.buttonView}>
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonIdentityBrowse}
                      onPress     = {()=>this.uploadProofDocs("pan1")}
                    />
                  </View>
            : 
              <View style={styles.buttonView}>
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonIdentityBrowse}
                  onPress     = {()=>this.uploadProofDocs("pan1")}
                />
              </View>
            }
          </View>

          {this.props.identity
          ?
            this.props.identity.pan1 || this.props.identity.pan2
            ?
              <View style={styles.inputWrapper}>
              {
                this.props.identity.pan1
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.pan1}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("pan1")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

              {
                this.props.identity.pan2
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.pan2}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("pan2")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

                
              </View>
            :
              null 
          :
            null
          }

          <View style={styles.inputWrapper}>
            <View style={styles.styleInputView}>
              <TextField
                label                 = "Driving License No."
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                onChangeText          = {(drivingCardNo) => this.setState({drivingCardNo})}
                value                 = {this.state.drivingCardNo}
                // keyboardType          = 'phone-pad'
              />
            </View>

            {this.props.identity 
            ? 
              this.props.identity.driving1 && !this.props.identity.driving2
              ?
                <View style={styles.buttonView}>
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonIdentityBrowse}
                    onPress     = {()=>this.uploadProofDocs("driving2")}
                  />
                </View>
              : 
                this.props.identity.driving1 && this.props.identity.driving2
                ?
                  null
                :
                  <View style={styles.buttonView}>
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonIdentityBrowse}
                      onPress     = {()=>this.uploadProofDocs("driving1")}
                    />
                  </View>
            : 
              <View style={styles.buttonView}>
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonIdentityBrowse}
                  onPress     = {()=>this.uploadProofDocs("driving1")}
                />
              </View>
            }
            
          </View>

          {this.props.identity
          ?
            this.props.identity.driving1 || this.props.identity.driving2
            ?
              <View style={styles.inputWrapper}>
              {
                this.props.identity.driving1
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.driving1}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("driving1")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

              {
                this.props.identity.driving2
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.driving2}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("driving2")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

                
              </View>
            :
              null 
          :
            null
          }

          <View style={styles.inputWrapper}>
            <View style={styles.styleInputView}>
              <TextField
                label                 = "Voting Card No."
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                onChangeText          = {(votingCardNo) => this.setState({votingCardNo})}
                value                 = {this.state.votingCardNo}
                // keyboardType          = 'phone-pad'
              />
            </View>

            {this.props.identity 
            ? 
              this.props.identity.voting1 && !this.props.identity.voting2
              ?
                <View style={styles.buttonView}>
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonIdentityBrowse}
                    onPress     = {()=>this.uploadProofDocs("voting2")}
                  />
                </View>
              : 
                this.props.identity.voting1 && this.props.identity.voting2
                ?
                  null
                :
                  <View style={styles.buttonView}>
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonIdentityBrowse}
                      onPress     = {()=>this.uploadProofDocs("voting1")}
                    />
                  </View>
            : 
              <View style={styles.buttonView}>
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonIdentityBrowse}
                  onPress     = {()=>this.uploadProofDocs("voting1")}
                />
              </View>
            }
          </View>

          {this.props.identity
          ?
            this.props.identity.voting1 || this.props.identity.voting2
            ?
              <View style={styles.inputWrapper}>
              {
                this.props.identity.voting1
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.voting1}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("voting1")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

              {
                this.props.identity.voting2
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.voting2}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("voting2")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

                
              </View>
            :
              null 
          :
            null
          }

          <View style={styles.inputWrapper}>
            <View style={styles.styleInputView}>
              <TextField
                label                 = "Ration Card No."
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                onChangeText          = {(rationCardNo) => this.setState({rationCardNo})}
                value                 = {this.state.rationCardNo}
                // keyboardType          = 'phone-pad'
              />
            </View>

            {this.props.identity 
            ? 
              this.props.identity.ration1 && !this.props.identity.ration2
              ?
                <View style={styles.buttonView}>
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonIdentityBrowse}
                    onPress     = {()=>this.uploadProofDocs("ration2")}
                  />
                </View>
              : 
                this.props.identity.ration1 && this.props.identity.ration2
                ?
                  null
                :
                  <View style={styles.buttonView}>
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonIdentityBrowse}
                      onPress     = {()=>this.uploadProofDocs("ration1")}
                    />
                  </View>
            : 
              <View style={styles.buttonView}>
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonIdentityBrowse}
                  onPress     = {()=>this.uploadProofDocs("ration1")}
                />
              </View>
            }
          </View>

          {this.props.identity
          ?
            this.props.identity.ration1 || this.props.identity.ration2
            ?
              <View style={styles.inputWrapper}>
              {
                this.props.identity.ration1
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.ration1}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("ration1")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

              {
                this.props.identity.ration2
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.ration2}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("ration2")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

                
              </View>
            :
              null 
          :
            null
          }

          <View style={styles.inputWrapper}>
            <View style={styles.styleInputView}>
              <TextField
                label                 = "Passport No."
                lineWidth             = {0}
                tintColor             = {this.state.inputFocusColor}
                inputContainerPadding = {8}
                labelHeight           = {18}
                labelPadding          = {8}
                keyboardType          = 'default'
                inputContainerStyle   = {{height:60}}
                style                 = {styles.inputText}
                labelTextStyle        = {styles.labelText}
                activeLineWidth       = {0}
                fontSize              = {this.state.fontSize}
                onChangeText          = {(passportNo) => this.setState({passportNo})}
                value                 = {this.state.passportNo}
                // keyboardType          = 'phone-pad'
                error                 = {this.state.passportNoError[0]}
              />
            </View>

            {this.props.identity 
            ? 
              this.props.identity.passport1 && !this.props.identity.passport2
              ?
                <View style={styles.buttonView}>
                  <Button
                    textStyle   = {{textAlign:'center'}}
                    title       = "Browse"
                    buttonStyle = {styles.buttonIdentityBrowse}
                    onPress     = {()=>this.uploadProofDocs("passport2")}
                  />
                </View>
              : 
                this.props.identity.passport1 && this.props.identity.passport2
                ?
                  null
                :
                  <View style={styles.buttonView}>
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonIdentityBrowse}
                      onPress     = {()=>this.uploadProofDocs("passport1")}
                    />
                  </View>
            : 
              <View style={styles.buttonView}>
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonIdentityBrowse}
                  onPress     = {()=>this.uploadProofDocs("passport1")}
                />
              </View>
            }
          </View>

          {this.props.identity
          ?
            this.props.identity.passport1 || this.props.identity.passport2
            ?
              <View style={styles.inputWrapper}>
              {
                this.props.identity.passport1
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.passport1}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("passport1")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

              {
                this.props.identity.passport2
                ?
                  <View style={styles.formInputView}>
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.identity.passport2}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs("passport2")}
                      />   
                    </View>
                  </View>
                :
                  null
              }

                
              </View>
            :
              null 
          :
            null
          }

          <View style={{width:'100%',alignItems:'center'}}>
            <View style={styles.formInputView}>
              <Button
                textStyle   = {{textAlign:'center'}}
                title       = "Save"
                buttonStyle = {styles.buttonSubmit}
                onPress     = {this.handleSave}
              />
            </View>
          </View>

          <View style={{flexDirection:'row'}}>
            <View style={{flex:0.5}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('ViewProfile')}>
                <Icon name="chevrons-left" type="feather" color="#aaa" />
                <Text style={{textDecorationLine:'underline'}}>Go to Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={{flex:0.5,alignItems:'flex-end'}}>
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('AddressForm')}>
                <Text style={{textDecorationLine:'underline'}}>Go Next</Text>
                <Icon name="chevrons-right" type="feather" color="#aaa" />
              </TouchableOpacity>
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

  var userId            = Meteor.userId();
  const postHandle      = Meteor.subscribe('userprofile',userId);
  const loading         = postHandle.ready();
  const userProfileData = Meteor.collection('userProfile').findOne({'userId':userId}) || {};

  const postHandle1     = Meteor.subscribe('projectSettingsPublish');
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  const identity = userProfileData.identity;

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;

  return{
    userProfileData,
    loading,
    s3Data,
    identity,
    notificationCount
  }

}, StatutoryForm);

StatutoryForm.defaultProps = {
  messages: {
    en: {
      regxS1: 'Please enter a valid aadhar card number.',
      regxS2: 'Please enter a valid pan card number.',
      regxS3: 'Please enter a valid driving license number.',
    }
  },

  rules: {
    regxS1: /^\d{4}\s\d{4}\s\d{4}$|^$/,
    regxS2: /[A-Za-z]{5}\d{4}[A-Za-z]{1}|^$/,
    regxS3: /^(?!^0+$)[a-zA-Z0-9]{3,20}$|^$/,
  },
}