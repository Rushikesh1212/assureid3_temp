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


import Drawer from 'react-native-drawer';

class Statutory extends ValidationComponent {
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
                            // 
                            // var fileName = userId+'_'+Date.now()+'_'+res.fileName;
                            var fileName = userId+'_'+res.fileName;
                            var fileExt = fileName.split('.').pop();  

                            var file = {
                                uri   : res.uri,
                                name  : fileName,
                                type  : res.type,
                            }
                            const options = {
                                keyPrefix           : "uploads/",
                                bucket              : s3Data.bucket,
                                region              : s3Data.region,
                                accessKey           : s3Data.key,
                                secretKey           : s3Data.secret,
                            }

                            RNS3.put(file, options).then((response) => {
                                // 
                                // 
                                if (response.status !== 201)
                                throw new Error("Failed to upload image to S3");
                                // 
                                // 
                                // 
                                
                                var fileLink = response.body.postResponse.location;
                                var fileDetails = {
                                name          : fileName,
                                ext           : fileExt,
                                link          : fileLink,
                                proofSubtype  : proofSubtype,
                                }
                                // 

                                Meteor.call("insertIdentityProofDoc",userId,fileDetails,(error,result) =>{
                                if(error){
                                    
                                    Alert.alert(
                                    'Error',
                                    )
                                }else{
                                    
                                }
                                });
                            
                            });    
                }//EOF if
            })//EOF DocumentPicket
    }//EOF uploadProofDocs


  removeProofDocs = (subtype) =>{
    Meteor.call("removeIdentityProofDocs",'',subtype,(error,result) =>{
      if(error){
        
        Alert.alert(
          'Error',
        )
      }else{
        
      }
    });
  }

  handleSave = () =>{
    
    Keyboard.dismiss();    
    var userId        = Meteor.userId();
    // var adharCardNo   = this.state.adharCardNo;
    // var panCardNo     = this.state.panCardNo;
    // var drivingCardNo = this.state.drivingCardNo;
    // var votingCardNo  = this.state.votingCardNo;
    // var rationCardNo  = this.state.rationCardNo;
    // var passportNo    = this.state.passportNo;
    
    if(this.props.cardName == "AadharForms"){
        var adharCardNo  = this.state.adharCardNo;      
      }
      if(this.props.cardName == "PanCardForm"){
        var panCardNo   = this.state.panCardNo;
        
      }
      if(this.props.cardName == "DrivingLicenseForm"){
        var drivingCardNo = this.state.drivingCardNo;
      }
      if(this.props.cardName == "VotingForm"){
        var votingCardNo = this.state.votingCardNo;
      }
      if(this.props.cardName == "RationCardForm"){
      var rationCardNo = this.state.rationCardNo;
            
      }
      if(this.props.cardName == "PassportForm"){
      var passportNo = this.state.passportNo;
      }

      
    if(this.validInput()){
        if(adharCardNo || panCardNo || drivingCardNo || votingCardNo || rationCardNo || passportNo){
            Meteor.call("insertStatutory",userId,adharCardNo,panCardNo,drivingCardNo,votingCardNo,rationCardNo,passportNo,(error,result) =>{
                if(error){
                
                Alert.alert(
                    'Error',
                )
                }else{
                
                Alert.alert(
                    '','Identity Information has been saved!',
                    [{ text: "OK", onPress: this.props.toggleModal}]
                )
                // this.props.navigation.navigate('AddressForm');
                }
            });
        }
    }
  }

  validInput = () =>{
    var valid = true;

    this.validate({
      adharCardNo: {regxS1: true},
      panCardNo: {regxS2: true},
      passportNo: {regxS3:true},
    });

    if(this.props.cardName == "AadharForms"){
        if(this.isFieldInError("adharCardNo")){
            let adharCardNoError = this.getErrorsInField('adharCardNo');
            
            this.setState({adharCardNoError});
            valid = false;
          }else{
            this.setState({adharCardNoError:''});
        }
    }
    if(this.props.cardName == "PanCardForm"){
        if(this.isFieldInError("panCardNo")){
            let panCardNoError = this.getErrorsInField('panCardNo');
            
            this.setState({panCardNoError});
            valid = false;
        }else{
            this.setState({panCardNoError:''});
        }
    }
    if(this.props.cardName == "PassportForm"){    
        if(this.isFieldInError("passportNo")){
        let passportNoError = this.getErrorsInField('passportNo');
        
        this.setState({passportNoError});
        valid = false;
        }else{
        this.setState({passportNoError:''});
        }
    }

    return valid;

  }

  render(){
    return(
        <Card>      
        <View style={styles.titleContainer}>
          <Text style={styles.heading}>IDENTITY INFORMATION</Text>
          <View style={styles.headingLine}></View>          
        </View>
        <View>
            {
                this.props.cardName == "AadharForms" && this.props.cardValue== true?
                <View style={styles.formContainer}>
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
                                buttonStyle = {[styles.buttonSubmit,styles.buttonSubmit]}
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
                                buttonStyle = {styles.buttonSubmit}
                                onPress     = {()=>this.uploadProofDocs("aadhar1")}
                                />
                            </View>
                        : 
                        <View style={styles.buttonView}>
                            <Button
                            textStyle   = {{textAlign:'center'}}
                            title       = "Browse"
                            buttonStyle = {styles.buttonSubmit}
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
                </View>
                :
                null
            }
            {/* EOF Adhar */}
            {/* Start of Pan */}

            {
                this.props.cardName == "PanCardForm" && this.props.cardValue == true ?
                    <View>
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
                                    buttonStyle = {styles.buttonSubmit}
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
                                    buttonStyle = {styles.buttonSubmit}
                                    onPress     = {()=>this.uploadProofDocs("pan1")}
                                    />
                                </View>
                            : 
                            <View style={styles.buttonView}>
                                <Button
                                textStyle   = {{textAlign:'center'}}
                                title       = "Browse"
                                buttonStyle = {styles.buttonSubmit}
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
                    </View>
                :
                null
            }

            {/* EOF PAN */}
            {/* Start of Driving License */}
            {
                this.props.cardName == "DrivingLicenseForm" &&  this.props.cardValue == true ?
                    <View>
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
                                    buttonStyle = {styles.buttonSubmit}
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
                                    buttonStyle = {styles.buttonSubmit}
                                    onPress     = {()=>this.uploadProofDocs("driving1")}
                                    />
                                </View>
                            : 
                            <View style={styles.buttonView}>
                                <Button
                                textStyle   = {{textAlign:'center'}}
                                title       = "Browse"
                                buttonStyle = {styles.buttonSubmit}
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
                    </View>
                :
                null
            }

            {/* EOF Driving  License*/}
            {/* Start of Voting */}
            {
                this.props.cardName == "VotingForm" && this.props.cardValue == true ?
                    <View>
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
                                    buttonStyle = {styles.buttonSubmit}
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
                                    buttonStyle = {styles.buttonSubmit}
                                    onPress     = {()=>this.uploadProofDocs("voting1")}
                                    />
                                </View>
                            : 
                            <View style={styles.buttonView}>
                                <Button
                                textStyle   = {{textAlign:'center'}}
                                title       = "Browse"
                                buttonStyle = {styles.buttonSubmit}
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
                    </View>
                :
                null
            }   
            {/* EOF Voting*/}
            {/* Start of Ration Card */}
            {
                this.props.cardName == "RationCardForm" && this.props.cardValue == true ?
                    <View>
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
                                    buttonStyle = {styles.buttonSubmit}
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
                                    buttonStyle = {styles.buttonSubmit}
                                    onPress     = {()=>this.uploadProofDocs("ration1")}
                                    />
                                </View>
                            : 
                            <View style={styles.buttonView}>
                                <Button
                                textStyle   = {{textAlign:'center'}}
                                title       = "Browse"
                                buttonStyle = {styles.buttonSubmit}
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
                    </View>
                :
                null
            }

            {/* EOF Voting*/}
            {/* Start of Ration Card */}
            {
                this.props.cardName == "RationCardForm" && this.props.cardValue == true ?
                    <View>
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
                                    buttonStyle = {styles.buttonSubmit}
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
                                    buttonStyle = {styles.buttonSubmit}
                                    onPress     = {()=>this.uploadProofDocs("passport1")}
                                    />
                                </View>
                            : 
                            <View style={styles.buttonView}>
                                <Button
                                textStyle   = {{textAlign:'center'}}
                                title       = "Browse"
                                buttonStyle = {styles.buttonSubmit}
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
                    </View>
                :
                null
            }

          <View style={{width:'100%',alignItems:'center'}}>
            <View style={[styles.formInputView,{justifyContent:'center'}]}>
              <Button
                textStyle   = {{textAlign:'center'}}
                title       = "Save"
                buttonStyle = {styles.buttonSubmit}
                onPress     = {this.handleSave}
              />
            </View>
          </View>

          {/* <View style={{flexDirection:'row'}}>
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
          </View> */}

        </View>
        </Card>
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

//   
  
  return{
    userProfileData,
    loading,
    s3Data,
    identity,
    notificationCount
  }

},Statutory);

Statutory.defaultProps = {
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