import { StyleSheet,Dimensions } from 'react-native';
const window = Dimensions.get('window');
export default StyleSheet.create({
   formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
   formInputView:{
    width: (window.width - 75),
    paddingBottom:20
  },
   buttonLarge:{
    width: (window.width - 75),
    height: 50,
    backgroundColor: '#54Aff3'
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
