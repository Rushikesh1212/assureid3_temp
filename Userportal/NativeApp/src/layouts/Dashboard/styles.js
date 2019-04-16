import { StyleSheet,Dimensions,Platform } from 'react-native';
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
    width:'100%',
    height:50
  },
  profileimg:{
    height: 50,
    borderRadius: 25,
    width: 50,
    borderWidth:2,
    borderColor:'#00b8ff',
  },
  profileContent:{
    color:'#fff',
    fontSize:12,
    // padding:3
  },
  profiledata:{
    marginTop:5,
    // marginLeft:10
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
    // borderLeftWidth:1,
    // borderColor:'#bbb'
  },
  profile: {
    padding:10,
    flex:1,
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  viewBlock: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderColor:'#fff',
    borderWidth: 1,
    paddingHorizontal:2,
  },
  carausalcontainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carausalcontentContainer: {
    borderWidth: 2,
    borderColor: '#CCC',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    // // flex:1,
    // flexDirection:'row',
    flexDirection:'row',
    flexWrap:'wrap',
    // justifyContent:'center',
    borderWidth: 1,
    // borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    // marginBottom:100,
    backgroundColor:'#fff',
    padding:10,
    // textAlign:'center'
    // height:100
  },
  compcontentBox:{
    // flexDirection:'column',
    flexWrap:'wrap',
    borderWidth: 1,
    // borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    backgroundColor:'#fff'
    
  },
  textValue:{
    fontSize:10,
    textAlign:'center'
  },
   cardHeader:{
    
    backgroundColor:'#fff',
    // paddingVertical:6,
    borderBottomWidth:1,
    borderBottomColor:'#bbb'
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
  cardOrder:{
    backgroundColor:'#fff',
    // margin:20,
    padding:0,
    alignSelf:'center',
    width:'95%',
    // borderRadius:5,
    marginBottom: 10,
    // borderColor: '#000',
    borderTopColor:'#00b8ff',
    borderBottomColor:'#bbb',
    borderRightColor:'#00b8ff',
    borderTopWidth: 3,
    borderRightWidth:3,
    borderLeftColor:'#bbb',
  },

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },


});

