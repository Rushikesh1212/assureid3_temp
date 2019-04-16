import React, { Component } from "react";
import Meteor,{ createContainer } from "react-native-meteor";
import { CameraKitCamera, CameraKitCameraScreen } from 'react-native-camera-kit';
import { Alert, View, ScrollView, Text } from "react-native";

class CameraChild extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      componenentVisible : true,
    };
    this.onBottomButtonPressed = this.onBottomButtonPressed.bind(this);
  }

  componentWillMount (){
    console.log('componentWillMount!');
  }

  componentWillUnmount() {
      console.log('Component WILL UNMOUNT!');
      this.setState({ componenentVisible : false });
      // this.props.navigator.pop();
      // this.camera.removeCameraView();
   }

  componentDidMount(){
    console.log('componentDidMount');
  }



  componentWillReceiveProps(nextProps) {
    // console.log('nextProps: ',nextProps);
  }

  onBottomButtonPressed(event) {
    // console.log('in onBottomButtonPressed');
    // console.log('this.camera');
    // console.log(this.camera);
    // console.log("this.refs: ",this.refs);
    // const captureImagesStack = JSON.stringify(event.captureImages,null,4);
    // var s3Data = this.props.s3Data;
    // console.log("s3Data = ",s3Data);

    const captureImagesStack1 = event.captureImages;
    if(captureImagesStack1 && captureImagesStack1.length > 0){

      // this.setState({
      //                     "imagesSelected" : captureImagesStack1,
      //              });
      // console.log('captureImagesStack1: ',captureImagesStack1);
      var recentImg = "file://"+captureImagesStack1[0].uri;
      // console.log('recentImg: ',recentImg);
      // var x = this.props.navigator.pop();
      // console.log('x: ',x);

      this.props.navigation.navigate('CameraView', { photoUri: recentImg, ticket: this.props.ticket });
      this.setState({ componenentVisible : false });
      // console.log('unmount done after camera componenentVisible false');

      // event.captureImages = [];      
    }


  }




  render() {
    // console.log('-------------------------------------');
    // console.log(this.props.ele);

    if(this.state.componenentVisible === true){
      return (
        <CameraKitCameraScreen
          ref         = {(cam) => {
                                      this.camera = cam; 
                                    }
                        }
          actions     = {{ rightButtonText: 'Home', leftButtonText: 'Back' }}
          onBottomButtonPressed={(event:any) => {if(event.type == "left"){
                                                    this.props.navigation.navigate('ViewTicketForm', { ticket: this.props.ticket });
                                                  }else{
                                                    this.onBottomButtonPressed(event);
                                                  }}
                                }
          flashImages = {{
            on   : require('../../images/flashOn.png'),
            off  : require('../../images/flashOff.png'),
            auto : require('../../images/flashAuto.png')
          }}
          // cameraOptions={{
          //   flashMode: 'auto',             // on/off/auto(default)
          //   focusMode: 'on',               // off/on(default)
          //   zoomMode: 'on',                // off/on(default)
          //   ratioOverlay:'1:1',            // optional, ratio overlay on the camera and crop the image seamlessly
          //   ratioOverlayColor: '#00000077' // optional
          // }}
          // selectedImages = {this.state.imagesSelected}
          cameraFlipImage    = {require('../../images/cameraFlipIcon.png')}
          captureButtonImage = {require('../../images/cameraButton.png')}
          // hideControls       = {false}
        />
      );

    }else{
      return (<View><Text></Text></View>);
    }

  }

}

export default Camera = createContainer( (props) => {

  // console.log('camers props: ',props);
  // console.log('camers props: ',props.navigation);
  // console.log('ticket : ',props.navigation.state.params.ticket);
  var result =  {
      "ticket" : props.navigation.state.params.ticket,
      // "ele"    : props,
  };

  return result;

}, CameraChild);