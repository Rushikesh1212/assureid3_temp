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
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  error: {
    marginTop:-15,
    width: (window.width - 75),
    paddingBottom:20
  },
  errorText: {
    color: '#FA3256',
    fontSize: 14,
  },

});
