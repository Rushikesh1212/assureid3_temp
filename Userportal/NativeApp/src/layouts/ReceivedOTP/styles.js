import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');

export default StyleSheet.create({

   container:{
    backgroundColor: '#fff',
    alignItems:'center',
    minHeight: window.height -25,
  },
  containerView:{
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center',
  }
});
