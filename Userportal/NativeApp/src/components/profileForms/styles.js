import {StyleSheet,Dimensions} from 'react-native';

export default StyleSheet.create({
	basicFormInput: {
    borderWidth : 10,
    backgroundColor: '#ff0'
  },
  formContainer:{
    flex: 1, 
    flexDirection:'row',
    backgroundColor: '#FFF',
    borderWidth:0,
    padding:10,
  },
  formInputView:{
    flex:0.5,
    justifyContent:'space-between'
    
  }
});