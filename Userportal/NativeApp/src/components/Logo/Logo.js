import React, { Component } from "react";
import {StyleSheet, Text, View, Image, Dimensions } from "react-native";
import styles from "./styles";
const window = Dimensions.get('window');

export default class Logo extends Component<{}> {
  render() {
    return (
      <View style={{marginTop: 100,height:80,width:'70%',backgroundColor:'#fff'}}>
        <Image style={styles.imgDisplay}  resizeMode="stretch"
          source={require('../../images/assureid/IDlogoGrey.png')}/>
      </View>
    );
  }
}



{/*<View style={styles.container}>
        {/*<Image
          style={styles.imgStyle}
          resizeMode="center"
          source={require("../../images/IDlogoGrey1.png")}
        />
      </View>*/}