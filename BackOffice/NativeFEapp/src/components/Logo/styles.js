import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingBottom: 50,

  },
  imgStyle:{
 	...Platform.select({
 		android:{
 			maxWidth:200,
 			maxHeight:50,

 		}
  	})
  }
});
