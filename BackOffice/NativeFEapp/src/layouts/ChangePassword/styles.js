import {StyleSheet,Dimensions} from 'react-native';
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
  formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:20,
  },
  formInputView:{
    width:(window.width - 75),
  },
  buttonLarge:{
    width: (window.width - 75),
    height: 50,
    backgroundColor: '#f7ac57'
  },
    button: {
    width: (window.width - 100) / 2,
    height: 50,
    backgroundColor: '#ff5c5c'
  },
    button1: {
    width: (window.width - 100) / 2,
    height: 50,
    backgroundColor: '#00b8ff'
  },
   error: {
    width: (window.width - 75),
  },
  errorText: {
    color: '#FA3256',
    fontSize: 14,
  },
});
