import React, { Component } from "react";
import Meteor,{ createContainer } from "react-native-meteor";
// import { CameraKitCamera, CameraKitCameraScreen } from 'react-native-camera-kit';
import { ScrollView, Text, TouchableOpacity, Image, View, Dimensions } from "react-native";
import { Icon, Button } from "react-native-elements";
import { RNS3 } from 'react-native-aws3';
let window = Dimensions.get('window');

class CameraViewChild extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      photoUri  : this.props.navigation.state.params.photoUri,  
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log('nextProps.photoUri: ',nextProps.photoUri);
     this.setState({
          photoUri : nextProps.photoUri,
      });
  }

  componentWillUnmount() {
      // console.log('#####################CameraViewChild Component WILL UNMOUNT!@@@@@@@@@@@@@@@@@@@@@');
   }

  backToCamera(event){
    event.preventDefault();
    // console.log(this.props.ticket);
    // console.log(this.props);
    // const file = this.props.navigation.state.params.photoUri;
    // console.log('file14: ',file);

    // const dirPicutures = `${RNFS.ExternalStorageDirectoryPath}/Pictures`;
    // var filename       = file.split('Pictures/')[1];
    // const filePath     = `${dirPicutures}/${filename}`;
    // console.log('filePath: ',filePath);

    // RNFS.exists(filePath)
    // .then( (result) => {
    //     console.log("file exists: ", result);

    //     if(result){
    //       return RNFS.unlink(filePath)
    //         .then(() => {
    //           console.log('FILE DELETED');
              this.props.navigation.navigate('Camera', { ticket: this.props.ticket });
    //         })
    //         // `unlink` will throw an error, if the item to unlink does not exist
    //         .catch((err) => {
    //           console.log('file del error: ',err.message);
    //         });
    //     }

    //   })
    //   .catch((err) => {
    //     console.log("file does not exist: ",err.message);
    //   });
  }

  continueToForm(event){
    event.preventDefault();

    var s3Data    = this.props.s3Data;
    var recentImg = this.props.navigation.state.params.photoUri;
    var ext       = recentImg.split('.')[1];
    // if(ext == 'jpg') {
    //   ext = 'jpeg';
    // }
    var file = {
      uri   : recentImg,
      name  : new Date().getTime()+'.'+ext,
      type  : 'image/'+ext,
    }
    
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
      
      var fileLocation = response.body.postResponse.location;


      fileLocation.replace("%2F", "/");
      // console.log("fileLocation = ",fileLocation);

      Meteor.call('saveTicketFEImgUpload', this.props.ticket, fileLocation, 'image', (error,result)=>{
          if (error) {
            console.log(error.reason);
          }else{
            // console.log("Ticket image Inserted Successfully!");
          }
      });

      this.props.navigation.navigate('ViewTicketForm', { ticket: this.props.ticket, photoUri: recentImg  });
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

  render(){

    const { navigate, goBack, state } = this.props.navigation;

    return(

        <View style={{flex:1, flexDirection:'row'}}>
            <View style={{zIndex : 1, position : 'absolute',backgroundColor:'rgba(52, 52, 52, 0.6)'}}>
              <TouchableOpacity  onPress={()=>navigate('Camera')} >
              <Button
                large
                icon = {{name: 'arrow-long-left', type: 'entypo' }}
                onPress = {this.backToCamera.bind(this)}
                // onPress={()=>navigate('Camera')}
                buttonStyle={{ width : window.width, backgroundColor : 'transparent'}}
                />  
              </TouchableOpacity>  
            </View>
            {/*<Text>{this.props.navigation.state.params.photoUri}</Text>*/}
            { this.state.photoUri ? 
            
                <Image
                      key        = { this.props.navigation.state.params.photoUri }
                      // style      = {{ height: window.height, width: window.width, alignSelf: "center", resizeMode: 'stretch' }}
                      style      = {{ flex: 1, width: null, height: null }}
                      // style      = {{ height: window.height, width: window.width}}
                      // source     = {{ uri: this.state.photoUri }}
                      source     = {{ uri: this.props.navigation.state.params.photoUri }}
                      // source     = {require('../../images/Background.png')}
                      resizeMode = "stretch"
                    />
            
            :
            <View><Text>No img</Text></View>
            }

            <View style={{zIndex : 1, position : 'absolute',backgroundColor:'rgba(52, 52, 52, 0.6)', bottom: 0}}>
              <TouchableOpacity>
              <Button
                large
                title="Continue"
                // icon = {{name: 'arrow-long-left', type: 'entypo' }}
                onPress = {this.continueToForm.bind(this)}
                // onPress={()=>navigate('Camera')}
                buttonStyle={{ width : window.width, backgroundColor : 'transparent'}}
                />  
              </TouchableOpacity>  
            </View>

        </View>
    );
  }
}


CameraView = createContainer( (props) => {

  // console.log('navigation.state.params: ',props.navigation.state.params);
  // console.log(props.navigation.state.params.ticket);
  const postHandle      = Meteor.subscribe('projectSettingsPublish');
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"}) || {};

      var result =  {
          "s3Data"     : s3Data,
          "ticket"     : props.navigation.state.params.ticket,
          "photoUri"   : props.navigation.state.params.photoUri,
      };

      // console.log('result: ',result);

      return result;

}, CameraViewChild);
export default CameraView;