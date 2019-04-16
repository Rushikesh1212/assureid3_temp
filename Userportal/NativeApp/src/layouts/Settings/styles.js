import {StyleSheet,Dimensions,Platform} from 'react-native';
const window = Dimensions.get('window');

export default StyleSheet.create({
	bellIcon: {
    right: 0,
    top: 25,
    fontWeight: "100"
  },
  notificationText: {
    position: 'absolute',
    right: 0,
    top: 3,
    borderRadius: 9,
    width: 18,
    height: 18,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12,
    borderStyle: 'solid',
    borderColor:'#B22222',
    borderWidth: 1,
    backgroundColor: '#B22222'
  },
  outerContent: {
    borderBottomWidth:0, 
    backgroundColor: '#00b8ff',
    // height:80,//for ios
    // height:60,//others
    height:((Platform.OS === 'ios') ? 80 : 60),
    // paddingTop:30,//ios
    // paddingTop:0,//others
    paddingTop:((Platform.OS === 'ios') ? 30 : 0),
    margin:0
  },
  formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:20,
  },
  formInputView:{
    width:(window.width - 25),
  },
   button: {
    width: (window.width - 100) / 2,
    height: 50,
    backgroundColor: '#aaa',
  },
  button1: {
    width: (window.width - 100) / 2,
    height: 50,
    backgroundColor: '#00b8ff'
  },
   inputText:{
    borderWidth:1,
    borderColor:'#aaa',
    height: 40,
    paddingLeft:10,
    textAlignVertical:'center',
    paddingTop:0,
    paddingBottom:0,
  },
  labelText:{
   
    top:5,
   

  },
});
