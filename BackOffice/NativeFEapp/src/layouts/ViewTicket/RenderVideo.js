import React, { Component } from "react";
import { Text, View, Image, Modal, Alert, TouchableHighlight, TouchableOpacity, Dimensions} from "react-native";
import styles from "./styles.js";
import Video from "react-native-video";
import { Button } from "react-native-elements";

const window = Dimensions.get('window');

export default class RenderVideo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible : false,  
      muted        : true,
    };
  }

  setModalVisible(visible) {
    // console.log('in modal');
    this.setState({modalVisible: visible});
  }

  muteFunction(event) {
    this.setState({muted: !this.state.muted,});
  }

  fullScreenPlayerWillPresent(event){
    console.log('fullScreenPlayerWillPresent');
    event.target.player.presentFullscreenPlayer()
  }

  render() {
    return(
          <View style={{paddingHorizontal:10,paddingVertical:10,width:'100%'}}>

            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(true);
            }}>
              <Image
                onPress={() => {this.setModalVisible(true);}}
                style={{ width: 50, height: 50, borderRadius: 15}}
                resizeMode="stretch"
                source={require("../../images/file-video-icon.png")}
              />
            </TouchableHighlight>

            {/*<View style={{}}>*/}
            {this.props.delVideo
            ?
              <TouchableOpacity onPress={()=>this.props.delVideo()}>
                <Text>Remove</Text>
              </TouchableOpacity>
            :
              null
            }

            {/*</View>*/}

            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>

            <View style={{width: window.width}}>
              <View style={{zIndex : 1, position : 'absolute',backgroundColor:'rgba(52, 52, 52, 0.6)'}}>
                <TouchableOpacity>
                <Button
                    large
                    title="Close"
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                    buttonStyle={{ width : window.width, backgroundColor : 'transparent'}}
                  />  
                </TouchableOpacity>  
              </View>

              <View style={{height: window.height, width: window.width}}>
                <Video
                  repeat={true}
                  muted={this.state.muted}
                  // muted={true}
                  // paused={true}
                  playInBackground={false}
                  resizeMode='cover'
                  // onFullscreenPlayerWillPresent={this.fullScreenPlayerWillPresent}
                  // source={require('../../videos/videoplayback.mp4')}
                  source={{ uri: this.props.videoData.videoLink, type: this.props.videoData.ext }}
                  style={[ styles.backgroundVideo, {height: window.height/2, width: window.width}  ]}
                />
              </View>
            </View>

            <View style={{flex:1, backgroundColor:'#000' }}>
                <TouchableOpacity>
                  <Button
                    large
                    title="Mute"
                    onPress={() => {
                      this.muteFunction.bind(this);
                    }}
                    />  
                </TouchableOpacity>
            </View>

            </Modal>
        </View>
    );
  }
}
