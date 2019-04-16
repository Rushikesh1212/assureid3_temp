import React, { Component } from "react";
import Meteor,{ createContainer } from "react-native-meteor";
import { CameraKitCamera, CameraKitCameraScreen } from 'react-native-camera-kit';
import { Alert, View, ScrollView, Text } from "react-native";
import { Icon } from "react-native-elements";

class CameraImgPickerChild extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      componenentVisible : true,
    };
    this.browseFile = this.browseFile.bind(this);
  }



  browseFile = ()=>{
      var ImagePicker = require('react-native-image-picker');
      var options = {
        quality       : 1,
        mediaType     : "photo",
        cameraType    : "back",
        allowsEditing : true,
        noData        : true,
        maxWidth      : 8000, 
        maxHeight     : 8000,
      };
      
      ImagePicker.showImagePicker((response) => {
        // response.data='';
        // console.log('response: ', response);
        console.log('response latitude: ', response.latitude);
        console.log('response longitude: ', response.longitude);
        if (response.didCancel) {
        }
        else if (response.error) {
        
        }
        else if (response.customButton) {
        
        }
        else {
          let source = response.uri;
          // console.log('source1: ', response.uri);
          // let source = response.path;
          // console.log('source: ', source);
          // this.setState({
          //   avatarSource: source,
          //   updatedProfilePic: source,
          //   responseS3: response,
          // });
        }
      });
  
  }


  render() {

      return (
        <View style={{backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingVertical:10}}>
          <View style={{ flex: 3, paddingTop: 15 }}>
            <Icon
              name={'edit'}
              containerStyle={{
              backgroundColor: '#DBDBDB',
              position: 'absolute',
              borderRadius: 50,
              padding: 5,
              bottom: 0,
              right: 0,
              }}
              onPress={this.browseFile.bind(this)}
            />
          </View>
        </View>
      );

  }

}

export default CameraImgPicker = createContainer( (props) => {

  var result =  {
      "ticket" : 'hi',
  };

  return result;

}, CameraImgPickerChild);