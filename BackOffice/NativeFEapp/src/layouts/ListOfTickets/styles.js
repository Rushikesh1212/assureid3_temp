import {StyleSheet, Dimensions} from 'react-native';
const window = Dimensions.get('window');

export default StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
   formInputView:{
    width:(window.width - 75),
    paddingVertical:15
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
  acceptedCard:{
    backgroundColor:'#fff',
    padding:0,
    width:window.width-30,
    // borderRadius:5,
    marginBottom: 10,
    alignSelf: 'center',
    // borderColor: '#000',
    borderTopColor:'#bbb',
    borderBottomColor:'#bbb',
    borderRightColor:'#bbb',
    borderLeftWidth: 5,
    borderLeftColor:'#5cb85c',
  },
  newCard:{
    backgroundColor:'#fff',
    padding:0,
    width:window.width-30,
    // borderRadius:5,
    marginBottom: 10,
    alignSelf: 'center',
    // borderColor: '#000',
    borderTopColor:'#ddd',
    borderBottomColor:'#ddd',
    borderRightColor:'#ddd',
    borderLeftWidth: 0,
    borderLeftColor:'#f7b731',
  },
   rejectedCard:{
    backgroundColor:'#fff',
    padding:0,
    width:window.width-30,
    // borderRadius:5,
    marginBottom: 10,
    alignSelf: 'center',
    // borderColor: '#000',
    borderTopColor:'#bbb',
    borderBottomColor:'#bbb',
    borderRightColor:'#bbb',
    borderLeftWidth: 5,
    borderLeftColor:'#d9534f',
  },
  cardHeader:{
    // flex:1,
    // flexDirection:'row',
    backgroundColor:'#fff',
    // color: '#fff',
    paddingVertical:5,
    borderBottomWidth:1,
    borderBottomColor:'#bbb'
  },
  cardHeaderText: {
    color: '#fbae16',
    textAlign: 'center',
    padding: 10
  },
  cardBody: {
    padding: 0,
    backgroundColor: '#fff',
    margin: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  videoBlock: {
    margin: 10,
    width: (window.width - 85) * 0.5
  },
    inputView:{
    borderStyle:'solid',
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor: "#aaa",
    backgroundColor:'transparent',
    marginBottom:20,
  },
  inputBox: {
    width:300,
    backgroundColor:'transparent',
    fontSize:16,
    color:'#444',
    paddingBottom:10,

  },
  button: {
    width: (window.width - 80) / 2,
    height: 50,
    backgroundColor: '#1c3c7c'
  },
    button1: {
    width: (window.width - 80) / 2,
    height: 50,
    backgroundColor: '#f7ac57'
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
    modalContent: {
    backgroundColor: 'white',
    width:window.width - 40,
    paddingVertical:40,
    paddingHorizontal:10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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
