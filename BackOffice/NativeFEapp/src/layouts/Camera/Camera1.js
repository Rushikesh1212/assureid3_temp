import React, { Component } from "react";
import { CameraKitCamera, CameraKitCameraScreen } from 'react-native-camera-kit';
import { Alert,View, ScrollView } from "react-native";

export default class Camera extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      path : null,
    }
  }


 onBottomButtonPressed(event) {
    const captureImages = JSON.stringify(event.captureImages);
    console.log(captureImages[0]);
    this.setState({path: captureImages.uri});
  }


  renderCamera(){
    return(
        <CameraKitCameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
        flashImages={{
          on: require('../../images/flashOn.png'),
          off: require('../../images/flashOff.png'),
          auto: require('../../images/flashAuto.png')
        }}
        cameraFlipImage={require('../../images/cameraFlipIcon.png')}
        captureButtonImage={require('../../images/cameraButton.png')}
      />    
    );
  }

  renderImage(){
    return(
      <View>
        <Image Source={{ uri : this.state.path }} />
        <Text onPress={()=> this.setState({path : null,})} > Cancel </Text>
      </View>
    );
  }


  render(){
    return(
      <ScrollView> 
        {
         
          this.renderCamera()
        }
      </ScrollView>
    );
  }
}
