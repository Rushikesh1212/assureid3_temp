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
  servicesHeader:{
		backgroundColor:'#f7ac57',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 0,
    height: (window.height)*0.3,
	},
	headerText:{
		color:'#fff',
		fontSize: 30,
		marginBottom: 30,
	},
	serviceListWrapper:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent: 'center',
  },
  imgWrapper:{
    width:'50%',
    alignItems: 'center',
    padding: 15,
  },
  imgDisplay:{
    // backgroundColor: '#eee',
    height:100,
    width:100, 
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
  profileimg:{
    height: 100,
    // borderRadius: 50,
    width: 100,
  },
  contentBox: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor:'#f1f2f7',
    padding:10,
    // textAlign:'center'
    // height:100
  },
  continueBtn:{
    backgroundColor: '#54Aff3',
    margin:0,
    marginTop:10,
  },
  borderBottom:{
    height:15,
    // borderWidth:1,
    // borderColor:'#ddd',
    // marginTop:5
  },
  buttonLarge:{
    width: (window.width - 45),
    height: 50,
    backgroundColor: '#54Aff3'
  },

  servicesProfileimg:{
    height: 50,
    borderRadius: 25,
    width: 50,
    borderWidth:2,
    borderColor:'#00b8ff',
  },

  textValue:{
    fontSize:10,
    textAlign:'center'
  },

  
});
