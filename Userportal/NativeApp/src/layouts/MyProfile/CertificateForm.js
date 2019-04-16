import React, { Component } from "react";
import Meteor, {createContainer} from 'react-native-meteor';
import { View, Text, Alert,TouchableOpacity,DrawerLayoutAndroid,BackAndroid,BackHandler,Image, Keyboard } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { ScrollView, StyleSheet } from 'react-native';
import { Header,Button, Icon } from 'react-native-elements';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';
import SideMenu from 'react-native-side-menu';
import { Dropdown } from 'react-native-material-dropdown';
import ValidationComponent from 'react-native-form-validator';

import styles from './styles.js';
import ProfileNavigation from './ProfileNavigation.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
import SkillsForm from './SkillsForm.js';
import SkillsList from '../ViewProfile/SkillsList.js';
import ShowNotification from '../NotificationLayout/ShowNotification.js';

class CertificateForm extends ValidationComponent {
  constructor(props){
    super(props);
    
    if(this.props.certificateValues){
      var stateObj = {
        "certificateId"   : this.props.certificateValues.certificateId,
        "certificateName" : this.props.certificateValues.certificateName, 
        "issuedBy"        : this.props.certificateValues.issuedBy,
        "validTill"       : this.props.certificateValues.validTill,
        "certificatedOn"  : this.props.certificateValues.certificatedOn,
        "editStatus"      : this.props.certificateValues.editStatus,
        "proofType"       : this.props.certificateValues.proofType,
        "certificateNameError": '',
        "issuedByError"       : '',
        "certificatedOnError" : '',
      };
    }else{
      var stateObj = {
        certificateName : '',
        issuedBy        : '',
        certificatedOn  : '',
        validTill       : '',
        proofType       : '', 
        certificateNameError: '',
        issuedByError       : '',
        certificatedOnError : '',
      };
    }
    stateObj.inputFocusColor = '#00b8FF';
    stateObj.fontSize        = 15;
    stateObj.isOpen          = false;

    this.state = stateObj;

    this.toggle = this.toggle.bind(this);
    var imagePath  = this.props.certificateValues.proofOfDocument;
      
    var splitImage = imagePath.split(":");
    if(splitImage[0] == "http"){
      this.props.certificateValues.proofOfDocument = "https:"+splitImage[1];
    }else{
      this.props.certificateValues.proofOfDocument = this.props.certificateValues.proofOfDocument;
    }

  }

  // componentWillReceiveProps(nextProps){
  //   console.log("inside Academic componentWillReceiveProps.... loading => ",this.props.loading);
  // }

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

  addCertificate = () =>{
    Keyboard.dismiss();

    var userId = Meteor.userId();

    if(this.props.certProofObj.imageLink){
      var imgLink   = this.props.certProofObj.imageLink;
      var fileName  = this.props.certProofObj.name;
      var fileExt   = this.props.certProofObj.ext;
      var imgId     = this.props.certProofObj._id;
    }else{
      var imgLink   = '';
      var fileName  = '';
      var fileExt   = '';
    }

    var certificateObj = Meteor.collection('userProfile').findOne({}, {sort: {'certificates.certificateId': -1}});

    if(certificateObj){
      if (certificateObj.certificates) {
        if (certificateObj.certificates.length > 0 ) {
          // var lastelem    = _.last(certificateObj.certificates);
          var lastelem = certificateObj.certificates[certificateObj.certificates.length-1];
          var certificateId =  parseInt(lastelem.certificateId) + 1;
        }else{
        var certificateId =  1;
        }
      }else{
        var certificateId =  1;
      }
    }

    var formValues = {
      "certificateId"   : certificateId,
      "certificateName" : this.state.certificateName,
      "issuedBy"        : this.state.issuedBy,
      "certificatedOn"  : this.state.certificatedOn,
      "validTill"       : this.state.validTill,
      "proofOfDocument" : imgLink,
      "fileName"        : fileName,
      "fileExt"         : fileExt,
      "verifiedStatus"  : "Not Verified",
      "editStatus"      : "Open",
      "proofType"       : this.state.proofType,
    }

    // console.log("formValues = ",formValues);

    if(this.validInput()){
      Meteor.call('addCertificates', userId, formValues, (error,result) =>{
        if(error){
          Alert.alert(
            'Error',
          );
        }else{
          Alert.alert(
            '','Certificate details inserted successfully!',
          );

          this.state.certificateName = '';
          this.state.issuedBy = '';
          this.state.certificatedOn = '';
          this.state.validTill = '';
          this.state.proofType = '';

          if(this.props.goBack){
            this.props.navigation.goBack(null);
          }
          // this.props.navigation.navigate('OtherInfoForm');
        }
      });

      if(imgId != ''){
        Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
          if (error) {
           console.log(error.reason);
          }else{  
          }
        });   
      }  
    }
  }

  editCertificate = () =>{
    Keyboard.dismiss();

    var id            = Meteor.userId();
    var index         = this.props.index;
    var certificateId = this.state.certificateId;
    var editstatus    = this.state.editStatus;

    if(this.props.certificateValues){
      if(this.props.certificateValues.proofOfDocument){
        var imgLink = this.props.certificateValues.proofOfDocument;
        var fileName = this.props.certificateValues.fileName;
        var fileExt = this.props.certificateValues.fileExt;
      }else if(this.props.editCertProofObj.imageLink){
        var imgLink = this.props.editCertProofObj.imageLink;
        var fileName = this.props.editCertProofObj.name;
        var fileExt = this.props.editCertProofObj.ext;
        var imgId = this.props.editCertProofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.certProofObj.imageLink){
      var imgLink = this.props.certProofObj.imageLink;
      var fileName = this.props.certProofObj.name;
      var fileExt = this.props.certProofObj.ext;
      var imgId = this.props.certProofObj._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }

    var formValues = {
      "certificateId"    : parseInt(certificateId),
      "certificateName"  : this.state.certificateName,
      "issuedBy"         : this.state.issuedBy,
      "certificatedOn"   : this.state.certificatedOn,
      "validTill"        : this.state.validTill,
      "proofOfDocument"  : imgLink,
      "fileName"         : fileName,
      "fileExt"          : fileExt,
      "verifiedStatus"   : "Not Verified",
      "editStatus"       : "Open",
      "proofType"        : this.state.proofType,
    }

    if(this.validInput()){
      Meteor.call('updateCertificate',id,formValues,index, (error,result) => {
        if(error){
            console.log(error.reason);
          }else{
            Alert.alert(
              '','Certificate details updated successfully!',
            );

            if (editstatus == "Reopen") {
                Meteor.call('updateTicketAfterReopen',id,"certificates",certificateId,formValues); 
             } 
            Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
              if (error) {
               console.log(error.reason);
              }else{  
              }
            }); 
            
            this.state.certificateName = '';
            this.state.issuedBy = '';
            this.state.certificatedOn = '';
            this.state.validTill = '';
            this.state.proofType = '';

            this.props.navigation.goBack(null);      
        }
      });
    }
  }

  validInput = () => {
    var valid = true;

    this.validate({
      certificateName: {required: true},
      issuedBy: {required: true},
      certificatedOn: {required: true},
    });

    if(this.isFieldInError("certificateName")){
      let certificateNameError = this.getErrorsInField('certificateName');
      this.setState({certificateNameError});
      valid = false;
    }else{
      this.setState({certificateNameError:''});
    }

    if(this.isFieldInError("issuedBy")){
      let issuedByError = this.getErrorsInField('issuedBy');
      this.setState({issuedByError});
      valid = false;
    }else{
      this.setState({issuedByError:''});
    }

    if(this.isFieldInError("certificatedOn")){
      let certificatedOnError = this.getErrorsInField('certificatedOn');
      this.setState({certificatedOnError});
      valid = false;
    }else{
      this.setState({certificatedOnError:''});
    }

    return valid;

  }

  uploadProofDocs(proofSubtype){
    // console.log("proofSubtype = ",proofSubtype);
    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;
    var prooftype = "certificates";

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
                            }
                            // console.log("fileDetails = ",fileDetails);

                            Meteor.call("insertCertTempProofDocs",userId,fileDetails,prooftype,proofSubtype,(error,result) =>{
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

  removeProofDocs(imageLink,subtype,fileName='',fileExt='',index=-1){
    
    // console.log("imageLink = ",imageLink);
    // console.log("subtype = ",subtype);
    // console.log("fileName = ",fileName);
    // console.log("fileExt = ",fileExt);
    // console.log("index = ",index);

    if(index >= 0){
      Meteor.call("removeTempDocProofs",imageLink,fileName,fileExt,index,subtype,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{
          console.log("File details1 removed.");
          this.props.certificateValues.proofOfDocument='';
          this.props.certificateValues.fileName='';
          this.props.certificateValues.fileExt='';
        }
      });
    }else{
      Meteor.call("removeTempProofDocs",imageLink,(error,result) =>{
        if(error){
          console.log(error.reason);
          Alert.alert(
            'Error',
          )
        }else{
          console.log("File details2 removed.");
        }
      });
    }
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

    proofType = [{
      value: 'Certificate',
    }, {
      value: 'Provisional Degree',
    }, {
      value: 'Degree',
    }, {
      value: 'Marksheet',
    }];

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
      <ProfileNavigation prevCount={3} nextCount={3} formName={"Academic"} iconName={"graduation-cap"} 
      prevLink={"AddressForm"} nextLink={"EmploymentInfo"} navigate={this.props.navigation.navigate} />
        <View style={styles.titleContainer}>
          <Text style={styles.heading}>SKILLS</Text>
          <View style={styles.headingLine}></View>          
        </View>

        <View style={styles.formContainer}>
        
          <SkillsForm />
          <SkillsList userId={this.props.userProfileData.userId} skillData={this.props.userProfileData.skills} currentId={this.props.userProfileData.userId} checkboxRequired={false} navigate={this.props.navigation}/>
          <Text style={[styles.heading,styles.marginHorizontal]}>CERTIFICATION INFORMATION</Text>
          <View style={styles.headingLine}></View>
          
          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Certificate Name *'
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
                value                 = {this.state.certificateName}
                onChangeText          = {(certificateName) => this.setState({certificateName})}
                error                 = {this.state.certificateNameError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView1}>
              <TextField
                label                 = 'Issued By *'
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
                value                 = {this.state.issuedBy}
                onChangeText          = {(issuedBy) => this.setState({issuedBy})}
                error                 = {this.state.issuedByError[0]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.formInputView}>
              <Text style={this.state.certificatedOnError?{color:'rgb(213, 0, 0)'}:{}}>Certificated On *</Text>
              <DatePicker 
                  mode                  = "date"
                  placeholder           = "Select Date"
                  format                = "L"
                  minDate               = "01-01-1960"
                  confirmBtnText        = "Confirm"
                  cancelBtnText         = "Cancel"
                  style                 = {{borderWidth:1,borderColor: '#aaa',width:'100%'}}
                  customStyles          = {{ dateInput : { borderWidth : 0}}}
                  date                  = {this.state.certificatedOn}
                  onDateChange          = {(date) => {this.setState({certificatedOn: date})}}
              />
              {this.state.certificatedOnError?
                <View style={{paddingTop:5}}>
                  <Text style={styles.errorText}>{this.state.certificatedOnError[0]}</Text>
                </View>
              :
                null
              }
            </View>

            <View style={styles.formInputView}>
              <Text >Valid Till</Text>
              <DatePicker 
                  mode                  = "date"
                  placeholder           = "Select Date"
                  format                = "L"
                  minDate               = "01-01-1960"
                  confirmBtnText        = "Confirm"
                  cancelBtnText         = "Cancel"
                  style                 = {{borderWidth:1,borderColor: '#aaa',width:'100%'}}
                  customStyles          = {{ dateInput : { borderWidth : 0}}}
                  date                  = {this.state.validTill}
                  onDateChange          = {(date) => {this.setState({validTill: date})}}
              />
            </View>
          </View>

          <View style={[styles.inputWrapper, styles.marginHorizontal]}>
            <View style={styles.formInputView}>
              <Text>Certificate Proof Type</Text>
              <Dropdown
                label                 = ''
                data                  = {proofType}
                inputContainerStyle   = {styles.dropdownInput}
                labelHeight           = {9}
                onChangeText          = {(proofType) => this.setState({proofType})}
                value                 = {this.state.proofType}
              />
            </View>

            <View style={styles.formInputView}>
              <Text style={{fontWeight:'bold'}}>Proof of Certificate</Text>
              
              {!this.props.certProofObj.imageLink && !this.props.certificateValues 
              ?
                <Button
                  textStyle   = {{textAlign:'center'}}
                  title       = "Browse"
                  buttonStyle = {styles.buttonBrowse}
                  onPress     = {()=>this.uploadProofDocs("certificate")}
                />
              :
                this.props.certificateValues 
                ?
                  this.props.certificateValues.proofOfDocument 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.certificateValues.proofOfDocument}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.certificateValues.proofOfDocument,"editCertificate",this.props.certificateValues.fileName,this.props.certificateValues.fileExt,this.props.index)}
                      />   
                    </View>
                  :
                    this.props.editCertProofObj.imageLink
                    ?
                      <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                        <Image
                            resizeMode="stretch"
                            source={{uri: this.props.editCertProofObj.imageLink}} 
                            style={{ width:'100%', height: 120, zIndex:-1 }}
                        />
                        <Icon 
                          name           = "close" 
                          type           = "font-awesome"
                          containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                          onPress        = {()=>this.removeProofDocs(this.props.editCertProofObj._id,"editCertificate")}
                        />   
                      </View>
                    :
                      <Button
                        textStyle   = {{textAlign:'center'}}
                        title       = "Browse"
                        buttonStyle = {styles.buttonBrowse}
                        onPress     = {()=>this.uploadProofDocs("editCertificate")}
                      />
                :
                  this.props.certProofObj.imageLink 
                  ?
                    <View style={{width:'100%',borderWidth:1,borderColor:'#bbb'}}>
                      <Image
                          resizeMode="stretch"
                          source={{uri: this.props.certProofObj.imageLink}} 
                          style={{ width:'100%', height: 120, zIndex:-1 }}
                      />
                      <Icon 
                        name           = "close" 
                        type           = "font-awesome"
                        containerStyle = {{backgroundColor:'#fff',position:'absolute',alignSelf:'flex-end',top:0,borderRightWidth:1,borderColor:'#bbb'}}
                        onPress        = {()=>this.removeProofDocs(this.props.certProofObj._id,"certificate")}
                      />   
                    </View>
                  :
                    <Button
                      textStyle   = {{textAlign:'center'}}
                      title       = "Browse"
                      buttonStyle = {styles.buttonBrowse}
                      onPress     = {()=>this.uploadProofDocs("certificate")}
                    />
              }
              
            </View>
          </View>

           <View style={{width:'100%',alignItems:'center'}}>
            <View style={styles.formInputView}>
              <Button
                textStyle   = {{textAlign:'center'}}
                title       = "Save"
                buttonStyle = {styles.buttonSubmit}
                onPress     = {this.props.certificateValues ? this.editCertificate : this.addCertificate}
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
              <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('OtherInfoForm')}>
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
  // console.log("userprofile = ",userProfileData);

  const postHandle1       = Meteor.subscribe('projectSettingsPublish');
  const s3Data            = Meteor.collection('projectSettings').findOne({"_id":"1"});

  const postHandle2       = Meteor.subscribe('TempProofDocs',userId);
  const imgLoading        = postHandle2.ready();
  const certProofObj      = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"certificates","proofSubtype": 'certificate'})|| {};
  const editCertProofObj  = Meteor.collection('tempProofDocs').findOne({"userId":userId,"prooftype":"certificates","proofSubtype": 'editCertificate'})|| {};
  
  const { state } = props.navigation;
  // console.log("state---------- ",state);
  if(state.params){
    if(state.params.certificateDetails){
      var certificateValues = state.params.certificateDetails;
      var index = state.params.index;       
    }
    if(state.params.goBack){
      var goBack = state.params.goBack;
    }
  }

  const notifPostHandle = Meteor.subscribe('userNotification');
  var notificationCount = Meteor.collection('notification').find({"toUserId": Meteor.userId(),"status":"unread"}).length;

  return{
    userProfileData,
    loading,
    s3Data,
    certProofObj,
    editCertProofObj,
    certificateValues,
    index,
    goBack,
    notificationCount
  }

}, CertificateForm);

CertificateForm.defaultProps = {
  messages: {
    en: {
      required: 'This field is required.',
    }
  },

  rules: {
    required: /\S+/,
  },
}