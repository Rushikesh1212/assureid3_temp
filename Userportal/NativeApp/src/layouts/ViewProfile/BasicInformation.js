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
import Moment from 'moment';


import Loading from '../../components/Loading/Loading.js';
import styles from './styles.js';
import Menu from '../../components/Menu/Menu.js';
import Drawer from 'react-native-drawer';
import HeaderDy from '../../components/HeaderDy/HeaderDy.js';
// import AddressInformation from './AddressInformation.js';


class BasicInformation extends React.Component {
  constructor(props){
    super(props);
  }

  editProfileImage = () =>{

    var userId = Meteor.userId();
    var s3Data = this.props.s3Data;

    DocumentPicker.show({ filetype : [DocumentPickerUtil.images()]},(error,res) => {
      if(res){
                          // Android
                          console.log("Result:: ",res);
                          // var fileName = userId+'_'+Date.now()+'_'+res.fileName;
                          var fileName = userId+'_'+res.fileName;
                          var fileExt = fileName.split('.').pop();  

                          var file = {
                            uri   : res.uri,
                            name  : fileName,
                            type  : res.type,
                          }
                          
                          console.log("file obj => ",file);
                          
                          const options = {
                            keyPrefix           : "uploads/",
                            bucket              : s3Data.bucket,
                            region              : s3Data.region,
                            accessKey           : s3Data.key,
                            secretKey           : s3Data.secret,
                          }

                          RNS3.put(file, options).then((response) => {
                            console.log("------------response---------------");
                            console.log('response: ',response);
                            if (response.status !== 201)
                              throw new Error("Failed to upload image to S3");
                            console.log("=========  response.body  ==================");
                            console.log(response.body);
                            console.log("---------  response.body  ------------------");
                            
                            var imageLink = response.body.postResponse.location;
                            
                            Meteor.call("addUserProfileImage",userId,imageLink,(error,result) =>{
                              if(error){
                                console.log(error.reason);
                                Alert.alert(
                                  'Error',
                                )
                              }else{
                                console.log("Image details saved.");
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
        }else{
          // this.props.navigate.goBack(null);
        }
                        });    
  }

  render(){
    const {navigate}   = this.props.navigate;

    return(
         <View style={{ flex: 1, backgroundColor: '#FFF',borderWidth:0}}>
            <ScrollView createContainerStyle={{marginBottom: 25,borderWidth:0,margin:0}}>
                {this.props.userprofile ?
                <View>
                  	<View style={{flex:1,flexDirection:'row'}}>
                  		<Icon name="user" type="font-awesome" size={20}  color="#00b8ff" />
                          <Text style={{padding:10,fontWeight: 'bold',color:'#00b8ff'}}>Basic Information</Text>
                  	</View> 
                  	<View style={{alignItems:'center',padding:10}}>
  	                	<View style={{alignItems:'center',borderWidth:1,borderColor:'#4a4a4a',borderRadius:2}}>
  	                    <TouchableOpacity onPress={this.editProfileImage}>
                        {this.props.userprofile.userProfile
                        ?
                          <Image style={styles.profileimg} source={{uri:this.props.userprofile.userProfile}} />
                        :
                          <Image style={styles.profileimg} source={require('../../images/assureid/userIcon.png')} />
                        }                             
  	                    </TouchableOpacity>
  	                  </View>
                    </View>
                    <View style={{alignItems:'flex-end',padding:10}}>
                        <TouchableOpacity onPress={()=> navigate('MyProfile')}>
                            <Icon name="edit" type="font-awesome" size={20}  color="#00b8ff" style={{alignItems:'flex-end'}}/>
                      </TouchableOpacity>
                    </View>
                  	<View style={styles.contentBox}>
                      <View style={{flex:1,flexDirection:'row'}}>
                       	<View style={{flex:.5,paddingHorizontal:10}}>
                      		<Text style={{fontWeight: 'bold'}}>Name :</Text>
                      	</View>
                        <View style={{flex:.5}}>
                          <Text>{this.props.userprofile.firstName ? this.props.userprofile.firstName : "--"} {this.props.userprofile.lastName ? this.props.userprofile.lastName : "--"}</Text>
                        </View>
                      </View>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:.5,paddingHorizontal:10}}>
                          <Text style={{fontWeight: 'bold'}}>Gender :</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>{this.props.userprofile.gender ? this.props.userprofile.gender : "--"}</Text>
                        </View>
                      </View>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:.5,paddingHorizontal:10}}>
                          <Text style={{fontWeight: 'bold'}}>Date Of Birth :</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>{this.props.userprofile.dateOfBirth ? Moment(this.props.userprofile.dateOfBirth,'MM/DD/YYYY').format("DD/MM/YYYY") : "--"}</Text>
                        </View>
                      </View>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:.5,paddingHorizontal:10}}>
                          <Text style={{fontWeight: 'bold'}}>Phone Number :</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>{this.props.userprofile.mobileNo ? this.props.userprofile.mobileNo : "--"}</Text>
                        </View>
                      </View>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:.5,paddingHorizontal:10}}>
                          <Text style={{fontWeight: 'bold'}}>Email ID :</Text>
                        </View>
                        <View style={{flex:.5}}>
                          <Text>{this.props.userprofile.emailId ? this.props.userprofile.emailId : "--"}</Text>
                        </View>
                      </View>	
                    </View>     
                </View>
                :
                  <View >
                    <Text style={{paddingHorizontal:22}}>Please add your Basic Information</Text>
                  </View>
                }  

                <View style = {styles.lineStyle} />
                
            </ScrollView>
          </View>
            
    );
  }
}

export default createContainer((props) => {

  const postHandle      = Meteor.subscribe('projectSettingsPublish');
  const loading         = postHandle.ready();
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});

  return{
    loading,
    s3Data,
  }

}, BasicInformation);
