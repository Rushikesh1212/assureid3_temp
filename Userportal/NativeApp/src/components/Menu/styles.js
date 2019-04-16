import {StyleSheet,Dimensions} from 'react-native';
const window = Dimensions.get('window');

export default StyleSheet.create({
	bgImage:{
		flex:1,
		width:null,
		height:null,
		alignItems:'center',
		padding:10,
		opacity:1,
		borderBottomWidth:2,
		borderColor:'#fff'
	},
	heading:{
		color:'#fff',
		fontSize:11,
	},
	menu:{
		flexDirection: 'row',
    borderBottomWidth:1,
    alignItems:'center',
    borderColor: '#bbb',
		padding:12,
	},
	menuText:{
		color:'#fff',
		flex:0.8
	},
	iconContainer:{
		flex:0.2,
		alignItems:'flex-start'
	}
});