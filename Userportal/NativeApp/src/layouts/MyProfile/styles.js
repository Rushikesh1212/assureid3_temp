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
  formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical:20,
    paddingBottom:20,
    paddingHorizontal:10
  },
  titleContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop:20.
  },
  formInputView:{
    width:'48%',
    backgroundColor: '#fff',
  },
  formInputView1:{
    // width:'100%',
    flex:1,
    backgroundColor: '#fff',
  },
  formInputView3:{
    // width:'100%',
    flex:0.7,
    backgroundColor: '#fff',
  },
  formInputView4:{
    flex:0.3,
    flexDirection:'row',
  },
  formInputView2:{
    // width:'100%',
    flex:1,
    backgroundColor: '#fff',
    alignItems:"center",
    marginTop:10,
  },

  styleInputView:{
    width:'75%',
    backgroundColor: '#fff',

  },
  assignBreak:{
    height:10
  },
  dropdownStyle:{
    backgroundColor: '#ff0',
    borderWidth:1,
    borderColor:'#aaa',
    // marginTop:18
  },
  fieldView:{
    width: '48%',
    padding: 2
},
  addressTitle:{
    textAlign: 'left',
    flex:0.5,
    fontWeight:'bold',
  },
  styleInputView:{
    width:'75%',
    backgroundColor: '#fff',

  },
  assignBreak:{
    height:10
  },
  dropdownStyle:{
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor:'#aaa',
    marginTop:18
  },
  addressTitle:{
    textAlign: 'left',
    flex:0.5,
  },
  styleInputView:{
    width:'75%',
    backgroundColor: '#fff',

  },
  /*styleTextView:{
    marginTop: 20,
    width:'50%'
  },*/
  textViewWrapper:{
    width: '50%'
  },
  assignBreak:{
    height:10
  },
  dropdownStyle:{
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor:'#aaa',
    marginTop:18
  },
  buttonLarge:{
    width: (window.width - 75),
    height: 50,
    backgroundColor: '#f7ac57'
  },
  imgDisplay:{
    width:'100%',
    height:150
  },
  fieldTextareaView:{
    width:'100%'
  },
  dropdownView:{
    width:'48%',
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
    top:6,
    paddingLeft:2,
    // marginHorizontal:10
  },
  rowContainerView:{
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowContainerView:{
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonBrowse:{
    backgroundColor: '#54Aff3',
    // margin:0,
  },
  buttonSave:{
    backgroundColor: '#54Aff3',
    margin:0,
    marginTop:10,
  },
  buttonView:{
    backgroundColor: '#fff',
  },
  labelAlignStyle:{
    textAlign: 'left'
  },
  buttonIdentityBrowse:{
    backgroundColor: '#54Aff3',
    margin:0,
    marginTop:15,
  },
  buttonSubmit:{
    // width: (window.width) / 2,
    width:'100%',
    // flex:1,
    backgroundColor: '#54Aff3',
    height:50,
    marginVertical:10,
  },
  buttonBack:{
    flex:1,
    backgroundColor: '#54Aff3',
    height:50,
    marginVertical:10,
  },
  btnStyle:{
    flex:1,
    alignItems:'center'
  },
  inputWrapper:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#fff',
    width:'100%',
    justifyContent:'space-between',
    marginTop:10,
  },
  accordianWrapper:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#fff',
    width:'100%',
    justifyContent:'space-between',
    paddingRight:30
  },
  heading:{
    color:'#00b8FF',
    fontSize:16,
  },
  headingLine:{
    width:'100%',
    borderBottomWidth:1,
    borderBottomColor:'#00b8FF',
    marginVertical:15,
  },
  headingLine30:{
    width:'30%',
    borderBottomWidth:1,
    borderBottomColor:'#00b8FF',
    marginVertical:15,
    alignItems:'flex-start',
    justifyContent:'flex-start'
  },
  marginHorizontal:{
    marginVertical:15,
  },
  content:{
    flex:1,
    paddingHorizontal:10,
    backgroundColor:'#fff',
  },

  dateStyle:{
    borderWidth : 1,
    borderColor : '#aaa',
  },
searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
},
searchIcon: {
    padding: 10,
},
input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
},
header:{
  backgroundColor: '#eee',
  paddingLeft: 10,
  paddingRight:10,
  marginTop:2,
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  height:35
},

collapseHeader: {
  flexDirection:'row',
  alignItems:'center',
  paddingHorizontal:10,
},

textAreaHeight:{
  height:80,
},

textAreaHeight:{
  height:80,
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
notifView: {
  backgroundColor: '#fff',
  paddingTop:((Platform.OS === 'ios') ? 30 : 0),
},
bgImage:{
  flex:1,
  width:null,
  height:0,
  alignItems:'center',
  justifyContent:'center',
  padding:10,
  opacity:1,
},
  
  dropdownInput:{
    justifyContent:'center',
    paddingBottom:15,
    paddingLeft:2,
    backgroundColor:'#fff',
    borderBottomWidth:1,
    borderColor:'#aaa',
    borderWidth:1
  },
  errorText:{
    color:'rgb(213, 0, 0)',
    fontSize:12,
  }
});
