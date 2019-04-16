import { StyleSheet,Dimensions } from 'react-native';
const window = Dimensions.get('window');
export default StyleSheet.create({
   formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
   formInputView:{
    width:(window.width - 75),
  },
   buttonLarge:{
    width: (window.width - 75),
    height: 50,
    backgroundColor: '#f7ac57'
  },
  error: {
    width: (window.width - 75),
  },
  errorText: {
    color: '#FA3256',
    fontSize: 14,
  },

});
