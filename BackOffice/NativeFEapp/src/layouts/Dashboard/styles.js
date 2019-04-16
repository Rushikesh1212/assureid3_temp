import { StyleSheet,Dimensions } from 'react-native';
const window = Dimensions.get('window');
export default StyleSheet.create({

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
  imgWrapper:{
    flex:1,
    alignItems: 'center',
  },
  imgDisplay:{
    width:'70%',
    height:300,
    marginTop: 40,
  },
   buttonLarge:{
    width: (window.width - 22),
    height: 45,
    borderRadius:2,
    backgroundColor: '#ffbb33',
 
  },

});