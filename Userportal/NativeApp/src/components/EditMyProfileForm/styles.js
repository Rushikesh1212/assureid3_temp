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
    color: '#000',
    fontSize: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#fbae16'
  },
  formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:10,
  },
  formInputView:{
    width:'80%',
    paddingVertical:4
  },
  buttonLarge:{
    width: (window.width - 75),
    height: 50,
    backgroundColor: '#54Aff3'
  },
  formInputViews:{
    width:'80%',
    flexDirection:'row',
    paddingVertical:10,
  },
   error: {

    width: (window.width - 75),
  },
  errorText: {
    color: '#FA3256',
    fontSize: 14,
  },
  
});
