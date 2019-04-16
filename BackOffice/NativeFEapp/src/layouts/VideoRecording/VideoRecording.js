// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { RNCamera } from 'react-native-camera';


// export default class VideoRecording extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <RNCamera
//             ref={ref => {
//               this.camera = ref;
//             }}
//             style                   = {styles.preview}
//             type                    = {RNCamera.Constants.Type.back}
//             flashMode               = {RNCamera.Constants.FlashMode.on}
//             permissionDialogTitle   = {'Permission to use camera'}
//             permissionDialogMessage = {'We need your permission to use your camera phone'}
//         />
//         <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
//         <TouchableOpacity
//             onPress={this.takePicture.bind(this)}
//             style = {styles.capture}
//         >
//             <Text style={{fontSize: 14}}> SNAP </Text>
//         </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   takePicture = async function() {
//     if (this.camera) {
//       const options = { quality: 0.5, base64: true };
//       const data = await this.camera.takePictureAsync(options)
//       console.log(data.uri);
//     }
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: 'black'
//   },
//   preview: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center'
//   },
//   capture: {
//     flex: 0,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     padding: 15,
//     paddingHorizontal: 20,
//     alignSelf: 'center',
//     margin: 20
//   }
// });



























import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,Dimensions,Image,TouchableOpacity,TouchableHighlight,Video
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
import { TabNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Camera from 'react-native-camera';


export default class VideoRecording extends Component {
	
  static navigationOptions = { 
        headerTintColor: 'white',
        headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 } 
      };

  constructor(props) {
      super(props);
      this.state = {
        cameraType : 'back',
        mirrorMode : false,
        path: null,
      };
    }

  takeVid() {
    const option = {};
    this.camera.capture({
      mode: Camera.constants.CaptureMode.video
    })
      .then((data) => {
         console.log(data);
         PicturePath = data.path;
     })
      .catch((err) => console.error(err));
  }


  stopVid(){
    this.camera.stopCapture();

  }



  changeCameraType() {
    if(this.state.cameraType === 'back') {
      this.setState({
        cameraType : 'front',
        mirrorMode : true
      })
    }
    else {
      this.setState({
        cameraType : 'back',
        mirrorMode : false
      })
    }
  }

  // renderCamera() {
  //   return (
  //     <Camera
  //          ref={(cam) => {
  //            this.camera = cam;
  //          }}
  //          style={styles.preview}
  //          aspect={Camera.constants.Aspect.fill}
  //          type={this.state.cameraType}
  //          captureMode = {Camera.constants.CaptureMode.video}
  //          mirrorImage={this.state.mirrorMode}
  //          keepAwake={true}
  //          >
  //          <Text style={styles.capture} onPress={this.changeCameraType.bind(this)}>switch</Text>
  //          <View style={styles.textCircular}><Text style={{color:'#fefefe',fontSize:14}} onPress={this.takeVid.bind(this)}>Start</Text></View>   
  //          <View style={styles.textCircular1}><Text style={{color:'#fefefe',fontSize:14}} onPress={this.stopVid.bind(this)}>Stop</Text></View>                   
  //      </Camera>
  //   );
  // }

  // renderVideo() {
  //   return (
  //     <View>
  //       <Video source={{ uri: this.state.path }}
  //          style={styles.preview}
  //          rate={1.0}
  //          volume={1.0}
  //          muted={false}
  //          resizeMode={"cover"}
  //          onEnd={() => { console.log('Done!') }}
  //          repeat={true} 
  //       />                
  //       <Text
  //         style={styles.cancel}
  //         onPress={() => this.setState({ path: null })}
  //       >Cancel
  //       </Text>
  //     </View>
  //   );
  // }

  render() {
  	const {goBack} = this.props.navigation;
    return (
      <View style={styles.container}>
       {/* {this.state.path ? this.renderVideo() : this.renderCamera()}*/}
       <Text>hi</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  cancel: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  }
});