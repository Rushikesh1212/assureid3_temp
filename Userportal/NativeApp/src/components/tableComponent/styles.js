import { StyleSheet,Dimensions } from 'react-native';
const window = Dimensions.get('window');
export default StyleSheet.create({
  container : {
    justifyContent:'center',
    bottom:0,
    padding:20,
    top:0
  },
  formInputView:{
    flex:1
 },
 formInputViewHalf:{
   width: (window.width - 80 ) /2
 },
  inputViewHalf:{
    width: ( window.width - 80 ) /2,
    borderStyle:'solid',
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor: "#aaa",
    backgroundColor:'transparent',
  },
  halfDropdown:{
    width: (window.width - 80) / 2,

  },
  modalContent: {
    backgroundColor: 'white',
    width:window.width - 40,
    padding:10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputView:{
    borderStyle:'solid',
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor: "#aaa",
    backgroundColor:'transparent',
  },
  inputBox: {
    flex:1,
    backgroundColor:'transparent',
    paddingHorizontal:16,
    fontSize:16,
    color:'#aaa',
  },
  buttons: {
    backgroundColor: '#fbae16',
    height: 50,
    width: 250,

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
    flex:1,
  },
  errorText: {
    color: '#FA3256',
    fontSize: 14,
  },
  head: {
    backgroundColor: '#6d6e70',
  },
  text: {
    textAlign: 'center',
    padding:10
  },
  headText: {
    textAlign: 'center',
    color:'#fff',
    padding:10
  },
  buttonClose:{
    width: (window.width - 80) / 2,
    height: 50,
    backgroundColor: '#f7ac57'

  },
  buttonDelete:{
    width: (window.width - 80) / 2,
    height: 50,
    backgroundColor: '#0000ff'
  }
});
