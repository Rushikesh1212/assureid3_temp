import React from 'react';
import PropTypes from 'prop-types';
import {
  LayoutAnimation,
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import Meteor from 'react-native-meteor';
import { Icon, Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { robotoWeights } from 'react-native-typography';

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#fff',
  },
  avatarContainer: {
    justifyContent:'center',
    alignItems:'center',
    marginBottom: 20,
    padding: 40,
    backgroundColor:'gray'
  },
  avatar: {
    height: 70,
    width: 150,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '600',
    padding: 20,
    color:'#666'
  },
  itemProfile:{
    fontSize:16,
    fontWeight: '700',
    color:'#fff',
    marginLeft:6,
  },
  menuView: {
    paddingLeft: 20,
    paddingRight:20
  },
  menuRow:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth:1,
    borderColor: '#444'
  },
  subMenuRow:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth:1,
    marginLeft: 20,
    borderColor: '#444'
  },
  linearGradient:{
    padding:20,
    paddingTop:39,
  }
});

export default class Menu extends React.Component {
  constructor(props){
    super(props);
    this.state={
      expandHome:false,
      expandDashboard:false,
      expandSetup:false,
      expandProduct:false,
      expandDelivery:false,
      expandIcon:'plus',
      expandSetupIcon:'plus',
      expandDeliveryIcon:'plus',
      expandProductIcon:'plus',
      expandDashboardIcon:'plus'
    };

  }
  handleLogout(){
    Meteor.logout();
  }
  handleExpandHome=()=>{
    let expandHome = !this.state.expandHome;
    this.setState({expandHome});
    if(expandHome)
      this.setState({expandIcon:'minus'});
    else
      this.setState({expandIcon:'plus'});
  }
  handleExpandSetup=()=>{
    let expandSetup = !this.state.expandSetup;
    this.setState({expandSetup});
    if(expandSetup)
      this.setState({expandSetupIcon:'minus'});
    else
      this.setState({expandSetupIcon:'plus'});
  }
  handleExpandProduct=()=>{
    let expandProduct = !this.state.expandProduct;
    this.setState({expandProduct});
    if(expandProduct)
      this.setState({expandProductIcon:'minus'});
    else
      this.setState({expandProductIcon:'plus'});
  }
  handleExpandDashboard=()=>{
    let expandDashboard = !this.state.expandDashboard;
    this.setState({expandDashboard});
    if(expandDashboard)
      this.setState({expandDashboardIcon:'minus'});
    else
      this.setState({expandDashboardIcon:'plus'});
  }
  handleExpandDelivery=()=>{
    let expandDelivery = !this.state.expandDelivery;
    this.setState({expandDelivery});
    if(expandDelivery)
      this.setState({expandDeliveryIcon:'minus'});
    else
      this.setState({expandDeliveryIcon:'plus'});
  }
  render(){
    var userData  = Meteor.user().profile;
    // console.log('userData: ',userData);

    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <LinearGradient colors={['(rgb(30, 87, 153) 0%', 'rgb(41, 137, 216) 50%', 'rgb(32, 124, 202) 51%', 'rgb(125, 185, 232) 100%)']} style={styles.linearGradient}>
            <View style={{}}>
                 <View style={{alignItems:"flex-end",padding:0}}>
                    <TouchableOpacity onPress={()=> this.props.navigate('MyProfile')} style={{flexDirection:'row',flex:1}} >
                      <Icon size={18} name='user' type='entypo' color='#fff' />
                      <Text style={styles.itemProfile}>
                        Profile
                      </Text>
                    </TouchableOpacity>
                  </View>
               {userData.userProfile 
                ?
                  <Avatar
                    width={80}
                    height={80}
                    rounded
                    source={{uri:userData.userProfile}}
                    avatarStyle={{borderWidth:1,borderColor:'#000'}}
                    containerStyle={{marginBottom:5}}
                  />
                :
                    <Avatar
                      width={90}
                      height={90}
                      rounded
                      source={require("../../images/Vinod.png")}
                      activeOpacity={0.7}
                    />  
                }
                <View style={{padding:5,marginBottom:10}}>
                 <Text style={[(robotoWeights.bold),{fontSize:15,flex:1,color:'#fff',textAlign:'left',paddingVertical:4}]}>{userData.firstname} {userData.lastname}</Text>
                 <Text style={[(robotoWeights.regular),{fontSize:15,flex:1,color:'#fff',textAlign:'left'}]}>Field Expert</Text>
                </View>
            </View>
        </LinearGradient>
        <View style={styles.menuView}>

          <View style={styles.menuRow}>
            <TouchableOpacity onPress={()=> this.props.navigate('Dashboard')} style={{flexDirection:'row',flex:1}} >
              <Icon size={25} name='home' type='font-awesome' color='#666' />
              <Text style={styles.item}>
                Home
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuRow}>
            <TouchableOpacity  onPress={()=> this.props.navigate('ListOfTickets')}  style={{flexDirection:'row',flex:1}} >
              <Icon size={25} name='ticket' type='font-awesome' color='#666' />
              <Text style={styles.item}>
                All Tickets
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuRow}>
            <TouchableOpacity onPress={()=> this.props.navigate('NewTickets')} style={{flexDirection:'row',flex:1}} >
              <Icon size={25} name='ticket' type='font-awesome' color='#666' />
              <Text style={styles.item}>
                New Tickets
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuRow}>
            <TouchableOpacity onPress={()=> this.props.navigate('AllocatedTickets')} style={{flexDirection:'row',flex:1}} >
              <Icon size={25} name='ticket' type='font-awesome' color='#666' />
              <Text style={styles.item}>
               Allocated Tickets
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuRow}>
            <TouchableOpacity onPress={()=> this.props.navigate('CompletedRejectedTickets')} style={{flexDirection:'row',flex:1}} >
              <Icon size={25} name='ticket' type='font-awesome' color='#666' />
              <Text style={styles.item}>
               Escalated Tickets
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuRow}>
            <TouchableOpacity onPress={()=>this.props.navigate('ReopenedTickets')} style={{flexDirection:'row',flex:1}} >
              <Icon size={25} name='ticket' type='font-awesome' color='#666' />
              <Text style={styles.item}>
               Re-Opened Tickets
              </Text>
            </TouchableOpacity>
          </View>
          <View >
            <TouchableOpacity style={[styles.menuRow,{borderBottomWidth:0}]} onPress={this.handleLogout.bind(this)}>
              <Icon size={25} name='logout' type='material-community' color='#666' />
              <Text style={styles.item} >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
