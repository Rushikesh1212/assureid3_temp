import React from 'react';
import PropTypes from 'prop-types';
import {
  LayoutAnimation,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,ImageBackground, BackHandler
} from 'react-native';
import Meteor, {createContainer} from 'react-native-meteor';
import { Icon, Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RNS3 } from 'react-native-aws3';


import styles from './styles.js';

class Menu extends React.Component {

	constructor(props){
    super(props);
  }

	handleLogout(){
    console.log('Logout function!');
    Meteor.logout();
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
        }
                        });    
  }

  render(){
    // var userData  = Meteor.user().profile;
    var userData = this.props.userData;

  	return(
      <ScrollView scrollsToTop={false} style={{backgroundColor:'#00b8ff',}}>
      	<ImageBackground 
      		source={require('../../images/assureid/menuBg.png')}
      		style={styles.bgImage}
      		resizeMode="cover"
      	>
      		{/*<Icon 
            name           = "edit" 
            type           = "font-awesome"
            containerStyle = {{alignSelf:'flex-end'}}
            color 				 = "#fff"
            size 					 = {14}
            onPress 			 = {this.editProfileImage}
            underlayColor	 = {'transparent'}
          />*/}

          <TouchableOpacity onPress={this.editProfileImage}>
          {userData.userProfile 
          ?
          	<Avatar
	      			width={80}
	            height={80}
	      			rounded
	      			source={{uri:userData.userProfile}}
	      			avatarStyle={{borderWidth:1,borderColor:'#000'}}
	      			containerStyle={{marginBottom:5}}
	      		/>
	      	:
	      		<Avatar
	      			width={80}
	            height={80}
	      			rounded
	      			source={require('../../images/assureid/userIcon.png')}
	      			avatarStyle={{borderWidth:1,borderColor:'#000'}}
	      			containerStyle={{marginBottom:5}}
	      		/>	
          }
          </TouchableOpacity>

      		<Text style={styles.heading}>
      			{userData.firstname} {userData.lastname}
      		</Text>
      		<Text style={styles.heading}>
      			AssureID:{userData.assureId} 
      		</Text>
      	</ImageBackground>

      	<View>
      		<TouchableOpacity onPress={()=> this.props.navigate('ProfileLandingPage')}>
	      		<View style={styles.menu}>
	      			<Icon 
	      				size={24} 
	      				name='home' 
	      				type='font-awesome' 
	      				color='#fff' 
	      				containerStyle={styles.iconContainer}
	      			/>
	            <Text style={styles.menuText}>
	              HOME
	            </Text>
	      		</View>
      		</TouchableOpacity>

      		{/*<TouchableOpacity>
	      		<View style={styles.menu}>
	      			<Icon 
	      				size={25} 
	      				name='info-circle' 
	      				type='font-awesome' 
	      				color='#fff' 
	      				containerStyle={styles.iconContainer}
	      			/>
	            <Text style={styles.menuText}>
	              ABOUT US
	            </Text>
	      		</View>
      		</TouchableOpacity>*/}

          <TouchableOpacity onPress={()=> this.props.navigate('OurServicesBlock')}>
            <View style={styles.menu}>
              <Icon 
                size={25} 
                name='gears' 
                type='font-awesome' 
                color='#fff' 
                containerStyle={styles.iconContainer}
              />
              <Text style={styles.menuText}>
                SERVICES
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.props.navigate('LatestUpdatesBlock')}>
            <View style={styles.menu}>
              <Icon 
                size={25} 
                name='refresh' 
                type='material-community' 
                color='#fff' 
                containerStyle={styles.iconContainer}
              />
              <Text style={styles.menuText}>
                LATEST UPDATES
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.props.navigate('NewsFeed')}>
            <View style={styles.menu}>
              <Icon 
                size={25} 
                name='news' 
                type='entypo' 
                color='#fff' 
                containerStyle={styles.iconContainer}
              />
              <Text style={styles.menuText}>
                NEWS FEED
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> this.props.navigate('MyOrder')}>
            <View style={styles.menu}>
              <Icon 
                size={25} 
                name='credit-card' 
                type='font-awesome' 
                color='#fff' 
                containerStyle={styles.iconContainer}
              />
              <Text style={styles.menuText}>
                MY ORDER
              </Text>
            </View>
          </TouchableOpacity>

      		<TouchableOpacity onPress={()=> this.props.navigate('ViewProfile')}>
	      		<View style={styles.menu}>
	      			<Icon 
	      				size={25} 
	      				name='user' 
	      				type='font-awesome' 
	      				color='#fff' 
	      				containerStyle={styles.iconContainer}
	      			/>
	            <Text style={styles.menuText}>
	              MY PROFILE
	            </Text>
	      		</View>
      		</TouchableOpacity>

      		<TouchableOpacity onPress={()=> this.props.navigate('Settings')}>
	      		<View style={styles.menu}>
	      			<Icon 
	      				size={25} 
	      				name='settings' 
	      				type='feather' 
	      				color='#fff' 
	      				containerStyle={styles.iconContainer}
	      			/>
	            <Text style={styles.menuText}>
	              SETTING
	            </Text>
	      		</View>
      		</TouchableOpacity>

      		<TouchableOpacity  onPress={this.handleLogout}>
	      		<View style={styles.menu}>
	      			<Icon 
	      				size={25} 
	      				name='logout' 
	      				type='material-community' 
	      				color='#fff' 
	      				containerStyle={styles.iconContainer}
	      			/>
	            <Text style={styles.menuText}>
	              LOG OUT
	            </Text>
	      		</View>
      		</TouchableOpacity>
      	</View>

  		</ScrollView>
  	);
  }
}


export default createContainer((props) => {

  var userData={};
  const postHandle     	= Meteor.subscribe('projectSettingsPublish');
  const loading         = postHandle.ready();
  const s3Data          = Meteor.collection('projectSettings').findOne({"_id":"1"});
  if(Meteor.user()){
    userData        = Meteor.user().profile;
  }

  return{
    loading,
    s3Data,
    userData
  }

}, Menu);

