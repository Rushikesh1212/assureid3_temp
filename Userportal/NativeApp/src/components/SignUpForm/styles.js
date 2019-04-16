import { StyleSheet,Dimensions } from 'react-native';
const window = Dimensions.get('window');
export default StyleSheet.create({

  formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
   formInputView:{
    width: '85%' ,
  },
   buttonLarge:{
    width: (window.width - 75),
    height: 50,
    backgroundColor: '#54Aff3'
  },
  container1 : {
   flexDirection:'row',
   marginRight:59,
   marginBottom:50
  },
  container:{
    flexDirection:'row',
  },
  error: {

    width: (window.width - 75),
  },
  errorText: {
    color: '#FA3256',
    fontSize: 14,
  },
});
