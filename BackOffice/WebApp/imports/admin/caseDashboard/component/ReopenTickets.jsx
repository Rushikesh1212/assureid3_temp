import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class ReopenTickets extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }
    render(){
        return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap noLRPad">
                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel"> My {this.props.header4}                        
                    <span>
                        <a href="/admin/rejectedtickets" title="View All">
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
                            {!this.props.loading && this.props.listR.length > 0 ?
                                this.props.listR.map((data, index)=>{
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
ReopenTicketsContainer = withTracker(props => { 
    var handleAssignToMeTicketList = Meteor.subscribe("listTickets");
    var _id  = Meteor.userId();
    const userHandle  = Meteor.subscribe('userData',_id);
    const user        = Meteor.users.findOne({"_id" : _id});
    const loading     = !userHandle.ready() && !handleAssignToMeTicketList.ready();
    var listR  = [];
    var header4 = '';

    if(user){
        var roleArr = user.roles;
        if(roleArr){
            var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
        }
        //Get all the Tickets Assigned to Me 
        var assignToMeTicketList = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}},{ limit : 5}).fetch();
        if(assignToMeTicketList){
            //find last status of the Tickets
            for(i=0;i< assignToMeTicketList.length; i++){
                var ticketElements = assignToMeTicketList[i].ticketElement;
                switch(role){
                    case 'screening committee' : 
                    header4 = 'Rejected Cases';
                        if(ticketElements.find(function (obj) { return obj.roleStatus == 'ScreenRejected'})){
                            switch (ticketElements[ticketElements.length - 1].roleStatus) {
                                case 'NewScrAllocated':
                                    assignToMeTicketList[i].status = 'New' ;  
                                    assignToMeTicketList[i].bgClassName = 'btn-primary';    
                                    break;
                                case 'ScreenApproved' :
                                    assignToMeTicketList[i].status = 'Approved' ; 
                                    assignToMeTicketList[i].bgClassName = 'btn-success';
                                    break;
                                case 'ScreenRejected' :
                                    assignToMeTicketList[i].status = 'Rejected' ;
                                    assignToMeTicketList[i].bgClassName = 'btn-danger';
                                    break;
                                case 'ReviewPass' :
                                    assignToMeTicketList[i].status = 'Completed' ;
                                    assignToMeTicketList[i].bgClassName = 'btn-success';
                                    break;
                                default:
                                    assignToMeTicketList[i].status = 'WIP' ;
                                    assignToMeTicketList[i].bgClassName = 'btn-success';
                                    break;
                            }
                            listR.push(assignToMeTicketList[i]);                            

                        }
                       
                        break;
                    case 'team leader' :
                    header4 = 'Reassigned Cases';
                        if(ticketElements.find(function (obj) { return obj.roleStatus == 'AssignReject'})){                    
                            switch (ticketElements[ticketElements.length - 1].roleStatus) {
                            case 'screenTLAllocated':
                                assignToMeTicketList[i].status = 'New' ;      
                                assignToMeTicketList[i].bgClassName = 'btn-primary';
                                break;
                            case 'AssignAccept' :
                                assignToMeTicketList[i].status = 'Allocated' ; 
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            case 'AssignReject' :
                                assignToMeTicketList[i].status = 'Rejected' ;
                                assignToMeTicketList[i].bgClassName = 'btn-danger';
                                break;
                            case 'ReviewPass' :
                                assignToMeTicketList[i].status = 'Completed' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            default:
                                assignToMeTicketList[i].status = 'WIP' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            }
                            listR.push(assignToMeTicketList[i]);                                                        
                        }
                        break;
                    case 'team member' :
                    header4 = 'Reopen Cases';
                    if(ticketElements.find(function (obj) { return obj.roleStatus == 'QAFail'})){                                        
                        switch (ticketElements[ticketElements.length - 1].roleStatus) {
                            case 'Assign':
                                assignToMeTicketList[i].status = 'New' ;      
                                assignToMeTicketList[i].bgClassName = 'btn-primary';
                                break;
                            case 'QAFail':
                                assignToMeTicketList[i].status = 'New' ;      
                                assignToMeTicketList[i].bgClassName = 'btn-primary';
                                break;
                            case 'AssignAccept' :
                                assignToMeTicketList[i].status = 'Accepted' ; 
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            case 'AssignReject' :
                                assignToMeTicketList[i].status = 'Rejected' ;
                                assignToMeTicketList[i].bgClassName = 'btn-danger';
                                break;
                            case 'ReviewPass' :
                                assignToMeTicketList[i].status = 'Completed' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            default:
                                assignToMeTicketList[i].status = 'WIP' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                        }
                            listR.push(assignToMeTicketList[i]);                                                        
                        }
                        break;
                    case 'quality team member' :
                        header4 = 'Reopen Cases';
                        if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewFail'})){                                                            
                            switch (ticketElements[ticketElements.length - 1].roleStatus) {
                            case 'VerificationPassQTMAllocated':
                                assignToMeTicketList[i].status = 'New' ;      
                                assignToMeTicketList[i].bgClassName = 'btn-primary';
                                break;
                            case 'ReviewFail':
                                assignToMeTicketList[i].status = 'New' ;      
                                assignToMeTicketList[i].bgClassName = 'btn-primary';
                                break;
                            case 'QAPass' :
                                assignToMeTicketList[i].status = 'Approved' ; 
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            case 'QAFail' :
                                assignToMeTicketList[i].status = 'Rejected' ;
                                assignToMeTicketList[i].bgClassName = 'btn-danger';
                                break;
                            case 'ReviewPass' :
                                assignToMeTicketList[i].status = 'Completed' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            default:
                                assignToMeTicketList[i].status = 'WIP' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            }
                            listR.push(assignToMeTicketList[i]);                                                        
                        }
                        break;
                    case 'quality team leader' :
                        header4 = 'Reopen Cases';
                        if(ticketElements.find(function (obj) { return obj.roleStatus == 'ReviewFail'})){                    
                            switch (ticketElements[ticketElements.length - 1].roleStatus) {
                            case 'QAPassQTLAllocated':
                                assignToMeTicketList[i].status = 'New' ;      
                                assignToMeTicketList[i].bgClassName = 'btn-primary';
                                break;
                            case 'ReviewPass' :
                                assignToMeTicketList[i].status = 'Approved' ; 
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            case 'ReiewFail' :
                                assignToMeTicketList[i].status = 'Rejected' ;
                                assignToMeTicketList[i].bgClassName = 'btn-danger';
                                break;
                            case 'ReviewPass' :
                                assignToMeTicketList[i].status = 'Completed' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            default:
                                assignToMeTicketList[i].status = 'WIP' ;
                                assignToMeTicketList[i].bgClassName = 'btn-success';
                                break;
                            }
                            listR.push(assignToMeTicketList[i]);                                                        
                        }   
                            break;
                        default : 
                            assignToMeTicketList[i].status = 'WIP' ;
                            assignToMeTicketList[i].bgClassName = 'btn-success';
                            break;
                    }
                // assignToMeTicketList[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
            } 
        }
    }
    return {
        loading,
        // assignToMeTicketList,
        listR,
        header4,
    };
})(ReopenTickets);
export default ReopenTicketsContainer;
