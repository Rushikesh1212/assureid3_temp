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
  contentBox: {
    // // marginLeft: 10,
    // // marginRight: 10,
    // marginTop: 5,
    // backgroundColor:'#aaa',
    // padding:10,
     backgroundColor:'#fff',
    // margin:20,
    padding:0,
    alignSelf:'center',
    width:'95%',
    // borderRadius:5,
    marginBottom: 10,
    // borderColor: '#000',
    borderTopColor:'#bbb',
    borderBottomColor:'#bbb',
    // borderLeftColor:'#00b8ff',
    // borderLeftWidth: 3,
  },
  profileimg:{
    // height:80,
    // borderRadius: 40,
    // width:80
    height:100,
    width:100,
  },
    formInputView:{
    width:'80%',
    paddingVertical:10,
    flexDirection:'row',
  },
    cardHeader:{
    
    backgroundColor:'#fff',
    // paddingVertical:6,
    // borderBottomWidth:1,
    // borderBottomColor:'#bbb'
  },
  cardHeaderText: {
    color: '#fbae16',
    // textAlign: 'center',
    // padding: 10
  },
  cardBody: {
    padding: 0,
    backgroundColor: '#fff',
    margin: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  card:{
    backgroundColor:'#fff',
    // margin:20,
    // padding:0,
    alignSelf:'center',
    width:'100%',
    // borderRadius:5,
    marginBottom: 10,
    // borderColor: '#000',
    // borderTopColor:'#00b8ff',
    // borderBottomColor:'#bbb',
    // borderRightColor:'#00b8ff',
    // borderTopWidth: 2,
    borderLeftWidth:2,
    borderLeftColor:'#00b8ff',
    paddingHorizontal:5
  },

  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom: 10,
  },

  SubmitButtonStyle: {
 
    marginTop:10,
    paddingTop:10,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#00b8ff'
  },
    cardOrder:{
    backgroundColor:'#fff',
    // margin:20,
    padding:0,
    alignSelf:'center',
    width:'95%',
    // borderRadius:5,
    marginBottom: 10,
    // borderColor: '#000',
    borderTopColor:'#bbb',
    borderBottomColor:'#bbb',
    borderLeftColor:'#00b8ff',
    borderLeftWidth: 3,
  
   
  },
    closeBtn:{
    marginLeft:33,
    position:'absolute',
    top:-4,
    left:147,
    zIndex:100
  },
   lineStyle:{
    borderWidth: .5,
    borderColor:'#00b8ff',
    width:(window.width - 20),
  },
  /**Modal css */
  modalContent: {
    backgroundColor: 'white',
    justifyContent:'center',
    width:window.width - 40,
    padding:10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonSubmit:{
    backgroundColor: '#54Aff3'
  }
  
});
