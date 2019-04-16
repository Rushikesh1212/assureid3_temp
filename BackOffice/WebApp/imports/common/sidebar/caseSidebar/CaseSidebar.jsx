import React,{Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class CaseSidebar extends TrackerReact(Component){
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
                  <div className="pull-left info sidebarFont">
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
                  <a href="/backoffice/dashboard" activeclassname="active">
                    <i className="fa fa-dashboard" />
                      <span>Dashboard</span>
                  </a>
                </li>
                <li className="">
                  <a href="/admin/alltickets" activeclassname="active">
                    <i className="fa fa-ticket" />
                      <span>All Cases({this.props.allticketsCount})</span>
                  </a>
                </li>
                <li className="">
                  <a href="/admin/assignedtickets" activeclassname="active">
                  <i className="fa fa-ticket" />
                      <span>Cases Allocted To Me({this.props.assignedTicketCount ? this.props.assignedTicketCount : 0 })</span>
                  </a>
                </li>
                <li className="">
                  <a href="/admin/opentickets" activeclassname="active">
                  <i className="fa fa-ticket" />
                      <span>My Open Cases({this.props.openTicketCount ? this.props.openTicketCount : 0})</span>
                  </a>
                </li>
              
                <li className="">
                  <a href="/admin/approvedtickets" activeclassname="active">
                  <i className="fa fa-ticket" />
                      <span>My {this.props.header3} ({this.props.approvedTicketCount ? this.props.approvedTicketCount : 0 })</span>
                  </a>
                </li>
                <li className="">
                  <a href="/admin/rejectedtickets" activeclassname="active">
                  <i className="fa fa-ticket" />
                      <span>My {this.props.header4} ({this.props.rejectTicketCount ? this.props.rejectTicketCount: 0 })</span>
                  </a>
                </li>
                <li className="">
                  <a href="/admin/escalatedtickets" activeclassname="active">
                  <i className="fa fa-ticket" />
                      <span>My Escalated Cases({this.props.escalatedCount  ? this.props.escalatedCount : 0})</span>
                  </a>
                </li>
              </ul>
            </section>
            {/* /.sidebar */}
          </aside>
      ); 
  }
}
export default allCaseSidebarContainer = withTracker(props => {
  var handleAllTick = Meteor.subscribe("allTickets");
  var loading = !handleAllTick.ready();
  var _id  = Meteor.userId();
  const userHandle  = Meteor.subscribe('userData',_id);
  const user        = Meteor.users.findOne({"_id" : _id});
  const loading1    = !userHandle.ready();
  var header3 = 'Approved';
  var header4 = 'Reopen';
  var allticketsCount = 0;
  var assignedTicketCount = 0;
  var openTicketCount= 0;
  var approvedTicketCount= 0;
  var rejectTicketCount= 0;
  var escalatedCount = 0 ;
  var todaysDate = new Date();
  var todaysTimeStamp  = todaysDate.getTime();

  if(user){
    var roleArr = user.roles;
    if(roleArr){
      var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
    }
    var allticketsDetalis      = TicketMaster.find({}).fetch();
    if(allticketsDetalis){
      var allticketsCount      = TicketMaster.find({}).count();
      switch(role){
        case 'screening committee' :
          header3 = 'Approved Cases';
          header4 = 'Rejected Cases';

          var assignedTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}}).fetch();
          if(assignedTicketList){
            var assignedTicketCount = assignedTicketList.length;
            for(i = 0 ; i < assignedTicketList.length; i++){
              var ticketElements = assignedTicketList[i].ticketElement;
              if(ticketElements.find(function (obj) { return obj.roleStatus == 'ScreenApproved'})){
                approvedTicketCount++;
              }else if(ticketElements.find(function (obj) { return obj.roleStatus == 'ScreenRejected'})){                
                rejectTicketCount++;
              }
              if(ticketElements.find(function (obj) { return obj.roleStatus != 'ReviewPass'})){
                openTicketCount++;
              }
             
              /**========================= Nilam addlogic for escalated ticket count================ */              
              var ticketElemLength = assignedTicketList[i].ticketElement.length;
              if(assignedTicketList[i].ticketElement[ticketElemLength-1].roleStatus == 'NewScrAllocated'){
                  var ticketLastActionDate   = assignedTicketList[i].ticketElement[ticketElemLength-1].createdAt;
                  var formatLastDate = new Date(ticketLastActionDate);       
                  var lastTimeStamp    = formatLastDate.getTime();
                  var difference = todaysTimeStamp - lastTimeStamp;
                  var hoursDifference = Math.floor(difference/1000/60/60);
                  if(hoursDifference > 48){
                    escalatedCount++;
                  }  
               
              }
            }
          }

          break;
        case 'team leader' :
          header3 = 'Assigned Cases';
          header4 = 'Reassigned Cases';
          var assignedTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}}).fetch();
          if(assignedTicketList){
            var assignedTicketCount = assignedTicketList.length;
            
            for(i = 0 ; i < assignedTicketList.length; i++){
              
              var ticketElements = assignedTicketList[i].ticketElement;
              if(ticketElements.find(function (obj) { return obj.roleStatus == 'AssignAccept'})){
                approvedTicketCount++;
              }else if(ticketElements.find(function (obj) { return obj.roleStatus == 'AssignReject'})){                
                rejectTicketCount++;
              }
              if(ticketElements.find(function (obj) { return obj.roleStatus != 'ReviewPass'})){
                openTicketCount++;
              }


              var ticketElemLength = assignedTicketList[i].ticketElement.length;
              if(assignedTicketList[i].ticketElement[ticketElemLength-1].roleStatus == 'screenTLAllocated'){
                  var ticketLastActionDate   = assignedTicketList[i].ticketElement[ticketElemLength-1].createdAt;
                  var formatLastDate = new Date(ticketLastActionDate);       
                  var lastTimeStamp    = formatLastDate.getTime();
                  var difference = todaysTimeStamp - lastTimeStamp;
                  var hoursDifference = Math.floor(difference/1000/60/60);
                  if(hoursDifference > 48){
                    escalatedCount++;
                  }  
               
              }
            }
          }
          break;
        case 'team member' :
          header3 = 'Accepted Cases';
          header4 = 'Reopen Cases';
          var assignedTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}}).fetch();
          if(assignedTicketList){
            var assignedTicketCount = assignedTicketList.length;
            
            for(i = 0 ; i < assignedTicketList.length; i++){
              var ticketElements = assignedTicketList[i].ticketElement;
              if(ticketElements.find(function (obj) { return obj.roleStatus == 'AssignAccept'})){
                approvedTicketCount++;
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'QAFail'})){
                  rejectTicketCount++;
                }
              }
              if(ticketElements.find(function (obj) { return obj.roleStatus != 'ReviewPass'})){
                openTicketCount++;
              }


              /**========================= Nilam addlogic for escalated ticket count================ */              
              var ticketElemLength = assignedTicketList[i].ticketElement.length;
              if(assignedTicketList[i].ticketElement[ticketElemLength-1].roleStatus == 'AssignAccept'){
                  var ticketLastActionDate   = assignedTicketList[i].ticketElement[ticketElemLength-1].createdAt;
                  var formatLastDate = new Date(ticketLastActionDate);       
                  var lastTimeStamp    = formatLastDate.getTime();
                  var difference = todaysTimeStamp - lastTimeStamp;
                  var hoursDifference = Math.floor(difference/1000/60/60);
                  if(hoursDifference > 48){
                    escalatedCount++;
                  }  
               
              }
            }
          }
          break;
        
        case 'quality team member' :
          header3 = 'Approved Cases';
          header4 = 'Reopen Cases';

          var assignedTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}}).fetch();
          if(assignedTicketList){
            var assignedTicketCount = assignedTicketList.length;
          
            for(i = 0 ; i < assignedTicketList.length; i++){
              var ticketElements = assignedTicketList[i].ticketElement;
              if(ticketElements.find(function (obj) { return obj.roleStatus == 'QAPass'})){
                approvedTicketCount++;

                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewFail'})){
                  rejectTicketCount++;
                }
              }
              if(ticketElements.find(function (obj) { return obj.roleStatus != 'ReviewPass'})){
                openTicketCount++;
              }

              /**========================= Nilam addlogic for escalated ticket count================ */              
              var ticketElemLength = assignedTicketList[i].ticketElement.length;
              if(assignedTicketList[i].ticketElement[ticketElemLength-1].roleStatus == 'VerificationPassQTMAllocated'){
                  var ticketLastActionDate   = assignedTicketList[i].ticketElement[ticketElemLength-1].createdAt;
                  var formatLastDate = new Date(ticketLastActionDate);       
                  var lastTimeStamp  = formatLastDate.getTime();
                  var difference     = todaysTimeStamp - lastTimeStamp;
                  var hoursDifference = Math.floor(difference/1000/60/60);
                  if(hoursDifference > 48){
                    escalatedCount++;
                  }  
               
              }
            }
          }
          break;

        case 'quality team leader' :
          header3 = 'Approved Cases';
          header4 = 'Reopen Cases';

          var assignedTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}}).fetch();
          if(assignedTicketList){
            var assignedTicketCount = assignedTicketList.length;
            
            for(i = 0 ; i < assignedTicketList.length; i++){
              var ticketElements = assignedTicketList[i].ticketElement;
              if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewPass'})){
                approvedTicketCount++;
              }else if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewFail'})){
                rejectTicketCount++;
              }
              if(ticketElements.find(function (obj) { return obj.roleStatus != 'ReviewPass'})){
                openTicketCount++;
              }
                /**========================= Nilam addlogic for escalated ticket count================ */              
              var ticketElemLength = assignedTicketList[i].ticketElement.length;
              if(assignedTicketList[i].ticketElement[ticketElemLength-1].roleStatus == 'QAPassQTLAllocated'){
                  var ticketLastActionDate   = assignedTicketList[i].ticketElement[ticketElemLength-1].createdAt;
                  var formatLastDate  = new Date(ticketLastActionDate);       
                  var lastTimeStamp   = formatLastDate.getTime();
                  var difference      = todaysTimeStamp - lastTimeStamp;
                  var hoursDifference = Math.floor(difference/1000/60/60);
                  if(hoursDifference > 48){
                    escalatedCount++;
                  }  
               
              }

            }
          }
          break;

        default :
        break;
        
      }
      
    }
  }
  return {
      loading,
      loading1,
      header3,
      header4,
      allticketsCount,
      assignedTicketCount,
      openTicketCount,
      approvedTicketCount,
      escalatedCount,
      rejectTicketCount,
      user,
      role,
  };
  
})(CaseSidebar);
