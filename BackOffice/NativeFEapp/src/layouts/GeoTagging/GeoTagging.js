import React, { Component } from "react";
import { View, ScrollView, Text, Alert, PermissionsAndroid, BackHandler } from "react-native";
import Permissions from 'react-native-permissions';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

// import MapFilter from 'react-mapfilter';

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
      	rationale: {
			        'title': 'Location Permission',
			        'message': 'Cool Photo App needs access to your camera ' +
			                   'so you can take awesome pictures.'
                   },
      }
    )
    // console.log('PermissionsAndroid: ',PermissionsAndroid);
    console.log('granted: ',granted);
    console.log('PermissionsAndroid.RESULTS.GRANTED: ',PermissionsAndroid.RESULTS.GRANTED);
    if (granted === true) {
      // Alert.alert("You can use the Location");
    } else {
      // Alert.alert("Location permission denied");
      PermissionsAndroid.openSetting;
    }
  } catch (err) {
    Alert.alert('err: ',err);
  }
}

export default class GeoTagging extends React.Component{

  constructor(props){
    super(props);
    this.state = {
          				'photoPermission' : '',
          				'locationPermission' : '',
          				'initialPosition': 'unknown',
                 }
  }

  // Check the status of a single permission
  componentDidMount() {


    LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message              : "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok                   : "YES",
        cancel               : "NO",
        enableHighAccuracy   : true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog           : true, // false => Opens the Location access page directly
        openLocationServices : true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch  : false, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick     : false //true => To prevent the location services popup from closing when it is clicked back button
    }).then(function(success) {
        // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
            navigator.geolocation.getCurrentPosition((position) => {
                let initialPosition = JSON.stringify(position);
                this.setState({ initialPosition });
            }, error => console.log(error), { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
        }.bind(this)
    ).catch((error) => {
      console.log('error.message: ',error.message);
    });
    
    BackHandler.addEventListener('hardwareBackPress', () => { //(optional) you can use it if you need it
      LocationServicesDialogBox.forceCloseDialog();
    });

    Permissions.check('photo').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      console.log('photo response: ',response);
      this.setState({
      					     'photoPermission' : response,
                   });
      // this.setState({ photoPermission: response })
    });

    Permissions.check('location').then(response => {
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      console.log('location response check: ',response);
      this.setState({
      					     'locationPermission' : response,
                   });
      // this.setState({ photoPermission: response })
    });

	// example
	Permissions.request('location', 'always', {
	  rationale: {
	    title   : 'Cool Photo App Camera Permission',
	    message :
	      'Cool Photo App needs access to your camera ' +
	      'so you can take awesome pictures.',
	  },
	}).then(response => {
		console.log('locationPermission request: ',response);
	  // this.setState({ cameraPermission: response })
	})

	// // example
	// Permissions.request('location', { type: 'always' }).then(response => {
	// 	console.log('locationPermission: ',response);
	//   // this.setState({ locationPermission: response })
	// })
 	
 	requestLocationPermission();
 	// this.alertForPhotosPermission();

  }

  // Request permission to access photos
  requestPermission = () => {
    Permissions.request('photo').then(response => {
      // Returns once the user has chosen to 'allow' or to 'not allow' access
      // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
      this.setState({ photoPermission : response })
    })
  }

  alertForPhotosPermission() {
  	console.log('Permissions: ');
  	console.log("Permissions: ",Permissions);
  	console.log('-------------------');
    Alert.alert(
      'Can we access your photos?',
      'We need access so you can set your profile pic',
      [
        {
          text: 'No way',
          onPress: () => Alert.alert('Permission denied'),
          style: 'cancel',
        },
        this.state.photoPermission == 'undetermined'
          ? { text: 'OK', onPress: this.requestPermission }
          : { text: 'Open Settings', onPress: this.requestLocationPermission },
      ],
    )
  }


  render() {

    return (
            <View>
                <Text>
                    Geolocation: {this.state.initialPosition}
                </Text>
            </View>

    );
  }

}