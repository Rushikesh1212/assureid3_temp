import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import styles from "./styles.js";

export default class Logo extends Component{
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 200, height: 70}}
          resizeMode="stretch"
          source={require("../../images/IDlogoGrey2.png")}
          // source={require("../../images/pdf-icon.png")}
        />
      </View>
    );
  }
}
