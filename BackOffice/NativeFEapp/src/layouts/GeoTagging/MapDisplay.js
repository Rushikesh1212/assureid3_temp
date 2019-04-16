import React, { Component } from "react";
import { View, ScrollView, Text, Alert, TouchableOpacity, PermissionsAndroid, BackHandler, StyleSheet, Image, Dimensions } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Meteor, { withTracker } from 'react-native-meteor';
import { Icon, Button } from "react-native-elements";
let window = Dimensions.get('window');
// import Exif from 'react-native-exif';
import { RNS3 } from 'react-native-aws3';
import ViewShot, { captureScreen } from "react-native-view-shot";

const styles = StyleSheet.create({
  container: {
    position       :'absolute',
    height         : window.height/2,
    width          : 400,
    // top: 0,
    left           : 0,
    right          : 0,
    bottom         : 0,
    justifyContent : 'flex-end',
    alignItems     : 'center',
  },
  map: {
    position : 'absolute',
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0,
  },
});

class MapDisplay extends React.Component{

  constructor(props){
    super(props);
    // console.log('constructor props: ',props);
    // console.log('props.navigation.state.params.imgLink: ',props.navigation.state.params.imgLink);

    this.state = {
                  region : {
                            latitude       : 18.518306732177734,
                            longitude      : 73.93668365478516,
                            latitudeDelta  : 0.015,
                            longitudeDelta : 0.0121,
                          },
                  ticket    : '',
                  uri       : '../images',
                  latitude  : 18.518306732177734,
                  longitude : 73.93668365478516,
                  imgLink   : props.navigation.state.params.imgLink,
                  latitudeDelta  : 0.015,
                  longitudeDelta : 0.0121,
                  showContBtn    : true,
                 }
    this.onRegionChange  = this.onRegionChange.bind(this);
  }


  componentDidMount() {
    console.log('componentDidMount.latitude: ',this.props.latitude);
    console.log('componentDidMount.longitude: ',this.props.longitude);

    if(this.props.latitude && this.props.longitude){
      this.setState({ 
                    region : {
                              latitude       : parseFloat(this.props.latitude),
                              longitude      : parseFloat(this.props.longitude),
                              latitudeDelta  : 0.015,
                              longitudeDelta : 0.0121,
                            },
                    latitude  : parseFloat(this.props.latitude),
                    longitude : parseFloat(this.props.longitude),
                  });       
    }
      this.setState({ 
                    ticket    : this.props.ticket,
                    imgLink   : this.props.imgLink,
                  });   

    // this.refs.viewShot.capture().then(uri => {
    //   console.log("do something with ", uri);
    //   this.setState({ 
    //                 uri    : uri,
    //               });
    // });   


  }


  componentWillReceiveProps(nextProps) {
    console.log('nextProps.latitude: ',nextProps.latitude);
    console.log('nextProps.latitude: ',nextProps.latitude);
    if(nextProps.latitude && nextProps.longitude){
      this.setState({ 
                    region : {
                              latitude       : parseFloat(nextProps.latitude),
                              longitude      : parseFloat(nextProps.longitude),
                              latitudeDelta  : 0.015,
                              longitudeDelta : 0.0121,
                            },
                    latitude  : parseFloat(nextProps.latitude),
                    longitude : parseFloat(nextProps.longitude),
                  });       
    }
    this.setState({ 
                  ticket    : nextProps.ticket,
                  imgLink   : nextProps.imgLink,
                });
    
  }

  onRegionChange(region) {
    // console.log('region onRegionChange: ',region);
      // this.setState({ 
      //   'region' : region,
      // });      
  }

  onCapture = uri => {
    console.log("onCapture do something with ", uri);
  }

  // onImageLoad = () => {
  //   this.refs.viewShot.capture().then(uri => {
  //     console.log("do something with ", uri);
  //   })
  // }


  takeScreenshot = () => {

    this.setState({ 
                  showContBtn : false,
                },()=>{


                      captureScreen({
                        format  : "jpg",
                        quality : 0.8
                      })
                      .then(
                        uri => {
                                // console.log("Image saved to", uri);

                                var s3Data    = this.props.s3Data;
                                var recentImg = uri;
                                var ext       = recentImg.split('.')[2];

                                var file = {
                                  uri   : uri,
                                  name  : new Date().getTime()+'.'+ext,
                                  type  : 'image/'+ext,
                                }
                                
                                const options = {
                                  keyPrefix           : "screenshots/",
                                  bucket              : s3Data.bucket,
                                  region              : s3Data.region,
                                  accessKey           : s3Data.key,
                                  secretKey           : s3Data.secret,
                                }

                                // console.log('file: ',file);
                                // console.log('options: ',options);

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
                                  console.log("fileLocation = ",fileLocation);

                                  Meteor.call('saveTicketFEImgUpload', this.props.ticket, fileLocation, 'image', (error,result)=>{
                                      if (error) {
                                        console.log(error.reason);
                                      }else{
                                        // console.log("Ticket image Inserted Successfully!");
                                      }
                                  });
                                  this.props.navigation.navigate('ViewTicketNextForm', { ticket: this.props.ticket, photoUri: recentImg, insertData:this.props.insertData });

                                }).catch((error) => console.log("Handled Exceptions image ",error));


                              },
                        error => console.error("Oops, snapshot failed", error)
                      ); 

                });

  }


  goToCamera =(event)=>{

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
        console.log('response.didCancel: ', response.didCancel);
      }
      else if (response.error) {
        console.log('response.error: ', response.error);
      }
      else if (response.customButton) {
        console.log('response.customButton: ', response.customButton);
      }
      else {
        let source = response.uri;
        this.props.navigation.navigate('MapDisplay',{ ticket : this.props.ticket, latitude : response.latitude, longitude : response.longitude, imgLink : 'file://'+response.path });
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

    const { navigate } = this.props.navigation;
    return (
              <View style={{flex:1, flexDirection:'row'}}>
                
                { this.state.showContBtn === true ? 
                  <View style={{ width : window.width, borderColor:'#f00', zIndex : 1, flexDirection:'row', position : 'absolute', backgroundColor:'rgba(52, 52, 52, 0.6)'}}>
                    <TouchableOpacity onPress={this.goToCamera}>
                      <View style = {{backgroundColor : '#0ff', width : window.width/2}}>
                          <Icon size={25} name="arrow-long-left" type="entypo" color="#000" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {this.takeScreenshot}>
                      <View style = {{backgroundColor : '#0ff', width : window.width/2}} >
                          <Icon size={25} name="arrow-long-right" type="entypo" color="#000" />
                      </View>
                    </TouchableOpacity>
                  </View>
                  :
                  null
                }

                <Image
                      key        = { this.state.imgLink }
                      style      = {{ flex: 1, width: null, height: window.height/2 }}
                      source     = {{ uri: this.state.imgLink }}
                      resizeMode = "stretch"
                  />

                <View style={styles.container}>
                  <MapView
                    region         = {this.state.region}
                    onRegionChange = {this.onRegionChange}
                    style          = { styles.map }>

                      <Marker
                        coordinate={{ latitude : this.state.latitude, longitude : this.state.longitude }}
                        title={'title'}
                        description={'description'}
                      />

                  </MapView>
                 </View>
                 {/*</ViewShot>*/}
               </View>
             );
  }

}

export default withTracker(params => {
  
  let paramData = params.navigation.state.params;
  const insertData   = params.navigation.state.params.insertData;

  // console.log('params MapDisplay: ',paramData);

  // Exif.getLatLong(this.state.imgLink)
  //     .then(({latitude, longitude}) => {
  //       console.warn('OK: ' + latitude + ', ' + longitude);
        
  //     })
  //     .catch(msg => {
  //                     console.warn('ERROR: ' + msg);
  //     });

  const postHandle      = Meteor.subscribe('projectSettingsPublish');
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"}) || {};

  return {
    params    : params,
    ticket    : paramData.ticket,
    latitude  : paramData.latitude,
    longitude : paramData.longitude,
    imgLink   : paramData.imgLink,
    "s3Data"  : s3Data,
    navigation : params.navigation,
    insertData : insertData,
  };
})(MapDisplay);