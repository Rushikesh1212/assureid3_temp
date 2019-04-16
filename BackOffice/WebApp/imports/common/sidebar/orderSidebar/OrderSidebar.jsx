import React,{Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {Order} from '/imports/admin/orderManagement/api/Order.js';

class OrderSidebar extends TrackerReact(Component){
  constructor() {
   super();
    this.state = {
      subscription :{
        "userData" : Meteor.subscribe("userData",Meteor.userId()), 
      }
    }
  }
  removePersistantSessions(){
      UserSession.delete("progressbarSession", Meteor.userId());
      UserSession.delete("allProgressbarSession", Meteor.userId());
  }
  currentUser(){
    // Meteor.subscribe('userData',Meteor.userId());
    var userData = {"userName" : '', "userProfile" : ''};
    var id = Meteor.userId();
    var getUser = Meteor.users.findOne({"_id" : id});
    if (getUser) {
      if (getUser.roles[0] == "admin") {
        // var userName    = getUser.username;
        if (getUser.profile.firstname == '' && getUser.profile.lastname == '') {
          var userName = "Admin";
        }else if (getUser.profile.firstname != '' && getUser.profile.lastname == '') {
          var userName = getUser.profile.firstname;
        }else if (getUser.profile.firstname == '' && getUser.profile.lastname != '') {
          var userName = getUser.profile.lastname;
        }else{
           var userName = getUser.profile.firstname+' '+getUser.profile.lastname;
        }
        if (getUser.profile.userProfile == '') {
           var userProfile  = "https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/userIcon.png";
        }else{
          var userProfile  = getUser.profile.userProfile;
        }
        userData = {"userName" : userName, "userProfile" : userProfile};
      }else if((getUser.roles[0] != "admin") && (getUser.roles[0] != "user") ){
        if (getUser.profile.firstname == '' && getUser.profile.lastname == '') {
          var userName = "User";
        }else if (getUser.profile.firstname != '' && getUser.profile.lastname == '') {
          var userName = getUser.profile.firstname;
          var role = getUser.roles[1];
          
        }else if (getUser.profile.firstname == '' && getUser.profile.lastname != '') {
          var userName = getUser.profile.lastname;
          var role = getUser.roles[1];
          
        }else{
           var userName = getUser.profile.firstname+' '+getUser.profile.lastname;
           var role = getUser.roles[1];
        }
        if (getUser.profile.userProfile == '') {
           var userProfile  = "https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/userIcon.png";
        }else{
          var userProfile  = getUser.profile.userProfile;
          var role = getUser.roles[1];
          
        }
        userData = {"userName" : userName, "userProfile" : userProfile,"role":role};
      }
    }
    return userData;

  }
  render(){
      return(
          <aside className="main-sidebar">
            {/* sidebar: style can be found in sidebar.less */}
            <section className="sidebar">
              {/* Sidebar user panel */}
              <div className="user-panel">
              {!this.props.loading1 ?
                <div className="pull-left image">
                { this.props.user.profile.userProfile ?
                    <img src={this.props.user.profile.userProfile} className="img-circle" alt="User Image" />
                    :
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/userIcon.png" className="img-circle" alt="User Image" />
                }              
                </div>
                :
                ""
              }
              {!this.props.loading1 ?
                  this.props.user.profile ? 
                  <div className="pull-left info">
                    <p> {this.props.user.profile.firstname} {this.props.user.profile.lastname}</p>
                    <a href="javascript:void(0)"><i className="fa fa-circle text-success" />{this.props.role}</a>
                  </div>
                  :
                  ""
                :
                ""
                }
              </div>
              <ul className="sidebar-menu otherRoleSidebarMenu" data-widget="tree">
                <li className="header">MAIN NAVIGATION</li>
                <li className="">
                  <a href="/backoffice/dispactteamdashboard" activeclassname="active">
                    <i className="fa fa-dashboard" />
                      <span>Dashboard</span> 
                  </a>
                </li>
                <li className="">
                  {
                    Roles.userIsInRole(Meteor.userId(),['dispatch team']) ?
                      <a href="/admin/allorders" activeclassname="active">
                        <i className="fa fa-ticket" />
                        <span>All Orders({this.props.allOrderCount})</span>
                      </a>
                    :
                    <a href="/admin/allcorporateorders" activeclassname="active">
                      <i className="fa fa-ticket" />
                      <span>All Orders({this.props.allOrderCount})</span>
                    </a>

                  }
                  
                </li> 
                <li className="">
                {
                    Roles.userIsInRole(Meteor.userId(),['dispatch team']) ?
                      <a href="/admin/orderAllocatedToDispatchTeam" activeclassname="active">
                      <i className="fa fa-ticket"/>
                          <span>Orders Allocted To Me({this.props.allocateOrderCount ? this.props.allocateOrderCount : 0 })</span>
                      </a>
                  :
                    
                    <a href="/admin/allcorporateallocatedorders" activeclassname="active">
                    <i className="fa fa-ticket"/>
                        <span>Orders Allocted To Me({this.props.allocateOrderCount ? this.props.allocateOrderCount : 0 })</span>
                    </a>
                }
                  
                </li>
                <li className="">
                {
                    Roles.userIsInRole(Meteor.userId(),['dispatch team']) ?
                      <a href="/admin/openOrdersForDispatchTeam" activeclassname="active">
                      <i className="fa fa-ticket" />
                          <span>My Open Orders({this.props.openOrderCount ? this.props.openOrderCount : 0})</span>
                      </a>

                    :
                      <a href="/admin/allcorporateopenorders" activeclassname="active">
                      <i className="fa fa-ticket" />
                          <span>My Open Orders({this.props.openOrderCount ? this.props.openOrderCount : 0})</span>
                      </a>
                  
                }
                </li>
              
                <li className="">
                {
                    Roles.userIsInRole(Meteor.userId(),['dispatch team']) ?
                      <a href="/admin/completedOrdersForDispatchTeam" activeclassname="active">
                      <i className="fa fa-ticket" />
                          <span>My Completed Orders({this.props.completedOrderCount ? this.props.completedOrderCount : 0 })</span>
                      </a>
                    :
                      <a href="/admin/allcorporatecompleteorders" activeclassname="active">
                      <i className="fa fa-ticket" />
                          <span>My Completed Orders({this.props.completedOrderCount ? this.props.completedOrderCount : 0 })</span>
                      </a>

                    
                }
                
                </li>
                <li className="">
                {
                   Roles.userIsInRole(Meteor.userId(),['dispatch team']) ?
                    <a href="/admin/escalatedOrdersForDispatchTeam" activeclassname="active">
                    <i className="fa fa-ticket" />
                        <span>My Escalated Orders({this.props.escalatedOrderCount ? this.props.escalatedOrderCount : 0 })</span>
                    </a>
                  :
                    <a href="/admin/allcorporateesclatedorders" activeclassname="active">
                    <i className="fa fa-ticket" />
                        <span>My Escalated Orders({this.props.escalatedOrderCount ? this.props.escalatedOrderCount : 0 })</span>
                    </a>
                     
                }
               
                </li>
              </ul>
            </section>
            {/* /.sidebar */}
          </aside>
      ); 
  }
}
export default OrderSidebarContainer = withTracker(props => {
  var handleAllOrder = Meteor.subscribe("allOrders");
  var loading = !handleAllOrder.ready();
  var allOrder = Order.find({}).fetch() || [];
  var _id  = Meteor.userId();
  const userHandle  = Meteor.subscribe('userData',_id);
  const user        = Meteor.users.findOne({"_id" : _id});
  const loading1    = !userHandle.ready();
  var allOrder      = Order.find({}).fetch() || [];
  var allocateOrder = Order.find({"allocatedToUserid":Meteor.userId()}).fetch();
  
  
  var allocateOrderCount = allocateOrder.length;
  var escalatedOrderCount = 0;
  var openOrderCount      = 0;
  var completedOrderCount = 0;
  var allOrderCount       = 0;
  if(user){
    var roleArr = user.roles;
    if(roleArr){
      var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
    }
  }
  var i ;
  for(i=0;i<allocateOrder.length;i++){
    for(j=0;j<allocateOrder[i].candidateDetails.length;j++){    
      // console.log("allocateOrder[i].candidateDetails[j].candidateVerificationStatus :",allocateOrder[i].candidateDetails[j].candidateVerificationStatus);
        
      switch(allocateOrder[i].candidateDetails[j].candidateVerificationStatus){
        case 'Order Completed - Generating Report':
        case 'Order Completed - Report Completed' :
          openOrderCount++;
        break;
        case 'Completed':
          completedOrderCount++;
        break;

        
      }
    }//EOF j
  }//EOF i

  for(k=0;k<allOrder.length;k++){
    // for(l=0;l<allOrder[k].candidateDetails.length;l++){
      var allOrderCount = allOrderCount + allOrder[k].candidateDetails.length;
      
    // }
  }

  allocateOrderCount = openOrderCount+completedOrderCount;
  return {
      loading,
      loading1,
      allOrderCount,
      allocateOrderCount,
      openOrderCount,
      completedOrderCount,
      escalatedOrderCount,
      user,
      role
  };
  
})(OrderSidebar);
