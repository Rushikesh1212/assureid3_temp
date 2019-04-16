import { StyleSheet,Dimensions } from 'react-native';
const window = Dimensions.get('window');
export default StyleSheet.create({
  container : {
    justifyContent:'center',
    alignItems: 'center'
  },
  inputView:{
    borderStyle:'solid',
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor: "#aaa",
    backgroundColor:'transparent',
  },
  inputBox: {
    width:300,
    backgroundColor:'transparent',
    paddingHorizontal:16,
    fontSize:16,
    color:'#aaa',
  },
  buttons: {
    borderWidth: 1,
    borderStyle:'solid',
    borderColor: '#fbae16',
    height: 50,
    width: 250,
    borderRadius: 25,
    backgroundColor:'transparent',
  },
  button: {
    width:300,
    backgroundColor:'transparent',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
    borderStyle:'solid',
    borderWidth: 1,
    borderColor: '#fbae16'
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#fbae16',
    textAlign:'center'
  },
  error: {
    height: 28,
    justifyContent: 'center',
    width: window.width,
    alignItems: 'center',
  },
  errorText: {
    color: '#FA3256',
    fontSize: 14,
  },

});
