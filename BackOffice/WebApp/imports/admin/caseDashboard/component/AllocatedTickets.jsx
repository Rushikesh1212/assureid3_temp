import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class AllocatedTickets extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    } 
    render(){
        return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap noLRPad">
                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel">Allocated Cases
                    <span>
                        <a href="/admin/assignedtickets" title="View All">
                            <i className="fa fa-arrow-right pull-right arrowcolor" aria-hidden="true"></i>
                        </a>
                    </span>
                </label>                        
                    <table className="table">
                        <thead>
                            <tr className="tableHead">
                                <th>Case No.</th>
                                <th>Service Name</th>
                                <th>Arrival Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!this.props.loading && this.props.allocatedTicketList.length > 0 ?
                                this.props.allocatedTicketList.map((data, index)=>{
                                    return(
                                        <tr key={index}>                  
                                            <td><a href={"/admin/ticket/"+data._id}>{data.ticketNumber}</a></td>
                                            <td>{data.serviceName}</td>
                                            <td>{moment(data.createdAt).format('DD MMM YYYY')}</td>
                                            <td><lable className={ data.bgClassName ? data.bgClassName+ " tdStatus" : "bg-blue" }> {data.status} </lable> </td>       
                                        </tr>
                                    );
                                })
                            :
                            <tr>
                                <td></td>
                                <td></td>
                                <td className ="nodata">Nothing To Display</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default AllocatedTicketsContainer = withTracker(props => { 
    var handleAllocatedTicketList = Meteor.subscribe("listTickets");
    var _id  = Meteor.userId();
    const userHandle  = Meteor.subscribe('userData',_id);
    const user        = Meteor.users.findOne({"_id" : _id});
    const loading    = !userHandle.ready() && !handleAllocatedTicketList.ready(); 
    var listAllocated = [];
    var listReopen    = [];
    var heading = '';

    if(user){
        var roleArr = user.roles;
        if(roleArr){
        var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
        }
        //Get all the Tickets Assigned to Me
        var allocatedTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}},{ limit : 5}).fetch();
        // console.log("allocatedTicketList");
        // console.log(allocatedTicketList);
        if(allocatedTicketList){
        //find last status of the Tickets
        for(i=0;i< allocatedTicketList.length; i++){
            var ticketElements = allocatedTicketList[i].ticketElement;
            switch(role){
                case 'screening committee' : 
                heading = 'Approved Tickets';
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'NewScrAllocated':
                        allocatedTicketList[i].status = 'New' ;  
                        allocatedTicketList[i].bgClassName = 'btn-primary';    
                        break;
                    case 'ScreenApproved' :
                        allocatedTicketList[i].status = 'Approved' ; 
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'ScreenRejected' :
                        allocatedTicketList[i].status = 'Rejected' ;
                        allocatedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Completed' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        allocatedTicketList[i].status = 'WIP' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    }
                    break;
                case 'team leader' :
                heading = 'Assigned Tickets';
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'screenTLAllocated':
                        allocatedTicketList[i].status = 'New' ;      
                        allocatedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    case 'AssignAccept' :
                        allocatedTicketList[i].status = 'Allocated' ; 
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'AssignReject' :
                        allocatedTicketList[i].status = 'Rejected' ;
                        allocatedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Completed' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        allocatedTicketList[i].status = 'WIP' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    }
                    break;
                case 'team member' :
                heading = 'Accepted Tickets';
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'Assign':
                        allocatedTicketList[i].status = 'New' ;      
                        allocatedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    case 'QAFail':
                        allocatedTicketList[i].status = 'New' ;      
                        allocatedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    case 'AssignAccept' :
                        allocatedTicketList[i].status = 'Accepted' ; 
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'AssignReject' :
                        allocatedTicketList[i].status = 'Rejected' ;
                        allocatedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Completed' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        allocatedTicketList[i].status = 'WIP' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    }
                    break;
                case 'quality team member' : 
                heading = 'Approved Tickets';
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                        case 'VerificationPassQTMAllocated':
                            allocatedTicketList[i].status = 'New' ;      
                            allocatedTicketList[i].bgClassName = 'btn-primary';
                            break;
                        case 'ReviewFail':
                            allocatedTicketList[i].status = 'New' ;      
                            allocatedTicketList[i].bgClassName = 'btn-primary';
                            break;
                        case 'QAPass' :
                            allocatedTicketList[i].status = 'Approved' ; 
                            allocatedTicketList[i].bgClassName = 'btn-success';
                            break;
                        case 'QAFail' :
                            allocatedTicketList[i].status = 'Rejected' ;
                            allocatedTicketList[i].bgClassName = 'btn-danger';
                            break;
                        case 'ReviewPass' :
                            allocatedTicketList[i].status = 'Completed' ;
                            allocatedTicketList[i].bgClassName = 'btn-success';
                            break;
                        default:
                            allocatedTicketList[i].status = 'WIP' ;
                            allocatedTicketList[i].bgClassName = 'btn-success';
                            break;
                    }
                    break;
                case 'quality team leader' :
                heading = 'Approved Tickets';
                    switch (ticketElements[ticketElements.length - 1].roleStatus) {
                    case 'QAPassQTLAllocated':
                        allocatedTicketList[i].status = 'New' ;      
                        allocatedTicketList[i].bgClassName = 'btn-primary';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Approved' ; 
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    case 'ReiewFail' :
                        allocatedTicketList[i].status = 'Rejected' ;
                        allocatedTicketList[i].bgClassName = 'btn-danger';
                        break;
                    case 'ReviewPass' :
                        allocatedTicketList[i].status = 'Completed' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    default:
                        allocatedTicketList[i].status = 'WIP' ;
                        allocatedTicketList[i].bgClassName = 'btn-success';
                        break;
                    }
                    break;
                default : 
                    allocatedTicketList[i].status = 'WIP' ;
                    allocatedTicketList[i].bgClassName = 'btn-success';
                    break;
            }
            // allocatedTicketList[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
        } 
        }
    }
   
    return {
        loading,
        allocatedTicketList,
        heading
    };
})(AllocatedTickets);

