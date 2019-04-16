import {StyleSheet, Dimensions} from 'react-native';
const window = Dimensions.get('window');

export default StyleSheet.create({
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
    color: '#000',
    fontSize: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: '#fbae16'
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
    width: (window.width - 50) / 2,
    height: 50,
    backgroundColor: '#6d6e70'
  
  },
  button1: {
    width: (window.width - 50)/ 2,
    height: 50,
    backgroundColor: '#f7ac57',
    marginRight:15,
    marginLeft:-15

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

