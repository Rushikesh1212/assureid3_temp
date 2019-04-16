import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
class HeaderBlock extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }
    render(){
        return(
            <div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headerBlockWrap">
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                        <div className="col-lg-12 innerblock noLRPad">
                            <span className="col-lg-4 noLRPad">
                                <i className="fa fa-ticket iconStyle bg-blue" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-8 noLRPad">
                                <div className="col-lg-12 innerboxtext">
                                    <span className="col-lg-12"> &nbsp; &nbsp; All Cases</span>
                                    <span className="col-lg-12">&nbsp; &nbsp; {this.props.allticketsCount ? this.props.allticketsCount : 0}</span>
                                </div>
                                {/* <span className="col-lg-12 innerboxtext"> &nbsp; &nbsp; Quantity</span>
                                <span className="col-lg-12 innerboxtext">&nbsp; &nbsp;11,998</span> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <div className="col-lg-12 innerblock noLRPad">                        
                            <span className="col-lg-4 noLRPad">
                                <i className="fa fa-ticket iconStyle bg-green" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-8 noLRPad">
                                <div className="col-lg-12 innerboxtext">
                                    <span className="col-lg-12 noLRPad"> &nbsp; &nbsp; Allocated Cases</span>
                                    <span className="col-lg-12">&nbsp; &nbsp; {this.props.assignedTicketCount ? this.props.assignedTicketCount : 0}</span>
                                </div>
                                {/* <span className="col-lg-12 innerboxtext"> &nbsp; &nbsp; Quantity</span>
                                <span className="col-lg-12 innerboxtext">&nbsp; &nbsp;11,998</span> */}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <div className="col-lg-12 innerblock noLRPad">
                            <span className="col-lg-4 noLRPad">
                                <i className="fa fa-ticket iconStyle bg-orange" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-8 noLRPad">
                                <div className="col-lg-12 innerboxtext">
                                    <span className="col-lg-12 noLRPad"> &nbsp; &nbsp;{this.props.header3} </span>
                                    <span className="col-lg-12">&nbsp; &nbsp; {this.props.approvedTicketCount ? this.props.approvedTicketCount : 0}</span>
                                </div>
                                {/* <span className="col-lg-12 innerboxtext"> &nbsp; &nbsp; Quantity</span>
                                <span className="col-lg-12 innerboxtext">&nbsp; &nbsp;11,998</span> */}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                        <div className="col-lg-12 innerblock noLRPad">                        
                            <span className="col-lg-4 noLRPad ">
                                <i className="fa fa-ticket iconStyle bg-red" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-8 noLRPad">
                                <div className="col-lg-12 innerboxtext">
                                    <span className="col-lg-12 noLRPad"> &nbsp; &nbsp;{this.props.header4} </span>
                                    <span className="col-lg-12">&nbsp; &nbsp; {this.props.rejectTicketCount ? this.props.rejectTicketCount : 0}</span>
                                </div>
                                {/* <span className="col-lg-12 innerboxtext"> &nbsp; &nbsp; Quantity</span>
                                <span className="col-lg-12 innerboxtext">&nbsp; &nbsp;11,998</span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
HeaderBlockContainer = withTracker(props => { 
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
                }
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ScreenRejected'})){                
                  rejectTicketCount++;
                }
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewPass'})){
                  openTicketCount--;
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
                }
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'AssignReject'})){                
                  rejectTicketCount++;
                }
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewPass'})){
                  openTicketCount--;
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
                }
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'QAFail'})){
                  rejectTicketCount++;
                }
                
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewPass'})){
                  openTicketCount--;
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
                }                  
                
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewFail'})){
                    rejectTicketCount++;
                }
                
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewPass'})){
                  openTicketCount--;
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
                if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewPass'})){
                  openTicketCount--;
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
        rejectTicketCount,
        user,
        role,
    };
})(HeaderBlock);
export default HeaderBlockContainer;
