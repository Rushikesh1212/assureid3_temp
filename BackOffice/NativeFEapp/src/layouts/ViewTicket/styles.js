import {StyleSheet, Dimensions} from 'react-native';
const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    alignSelf:"flex-start"

  },
  referenceContainer:{
    flex: 1,
    // flexDirection:'row',
    
    backgroundColor: '#fff',
    width: (window.width - 25),
    // height:(window.height - 75),
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical:45,
    // marginHorizontal: 20,
    borderColor: '#333333',
    borderRadius: 2,
    borderWidth: 1,
    borderStyle: 'dashed'

  },
  videoContainer:{
    width: (window.width - 25),
    borderColor: '#333333',
    borderRadius: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent:'flex-start',    
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
  buttonLarge:{
    width: 100,
    height: 45,
    backgroundColor: '#54Aff3',
  },
  card: {
    backgroundColor: '#fff',
    padding: 0,
    borderRadius: 5,
    margin: 20,
    marginBottom: 20
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    maxHeight: 500,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
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
  button: {
    height: 50,
    backgroundColor: '#54Aff3',
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
    padding:10,
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
  },

  formContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:15
  },
   formInputView:{
    width:(window.width - 25),
    paddingVertical:10,
    flexDirection:'row'
  }, 
  formInputViews:{
    width:(window.width - 25),
  
    // flexDirection:'row',
    // borderWidth:1,
    // height:
    // paddingTop:10,
  },
  lineStyle:{
    // borderWidth: .5,
    borderColor:'#aaa',
    width:(window.width - 25),
  },
  inputText:{
    borderWidth:1,
    borderColor:'#aaa',
    height: 150,
    paddingLeft:10,
  },
  labelText:{
    paddingLeft:5,
  },
  closeBtn:{
    marginLeft:33,
    position:'absolute',
    top:2,
    left:5,
    zIndex:10
  },
  delBtn:{
    // marginLeft:27,
    position:'absolute',
    top:0,
    // left:5,
    zIndex:10
  },
  textInput:{
    width:'100%',
    borderWidth:1,
  },
  inputWrapper:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#fff',
    width:'100%',
    justifyContent:'space-between',
    // padding:10,
  },
  formInputView1:{
    // width:'100%',
    flex:1,
    backgroundColor: '#fff',
  },
  labelTextNew:{
    paddingLeft:5,
    marginHorizontal:10
  },
  inputTextNew:{
    borderWidth:1,
    borderColor:'#aaa',
    height: 40,
    paddingLeft:10,
    textAlignVertical:'center',
    paddingTop:0,
    paddingBottom:0,
  },
  pdf: {
      flex:1,
      width:window.width,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // backgroundColor:'#f00',
  },
  videoWrapper: {
   flex:1,
   // backgroundColor:'#0f0',
  },
  buttonLarge:{
    borderRadius:20,
    backgroundColor:'#33b5e5',
    // color:"#fff",
    paddingHorizontal:50
  }

});