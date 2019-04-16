import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class AllTickets extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }
    render(){
        return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap noLRPad">
                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel">All Cases
                    <span>
                        <a href="/admin/alltickets" title="View All">
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
                            {!this.props.loading && this.props.allTicketList.length > 0 ?
                                this.props.allTicketList.map((data, index)=>{
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
AllTicketsContainer = withTracker(props => { 
    var handleAllTicketList = Meteor.subscribe("listTickets");
    var _id  = Meteor.userId();
    const userHandle  = Meteor.subscribe('userData',_id);
    const user        = Meteor.users.findOne({"_id" : _id});
    const loading    = !userHandle.ready() && !handleAllTicketList.ready();

    if(user){
        var roleArr = user.roles;
        if(roleArr){
            var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
        }
        //Get all the Tickets Assigned to Me
        var allTicketList = TicketMaster.find({},{sort:{createdAt: -1}, limit : 5}).fetch();
        // var allTicketList = TicketMaster.aggregate({});
        // db.customer.aggregate([{$project: {name: 1, month: {$month: '$bday'}}},{$match: {month: 9}}]);
        
        
        if(allTicketList){
            //find last status of the Tickets
            for(i=0;i< allTicketList.length; i++){
                var ticketElements = allTicketList[i].ticketElement;
                switch(role){
                    case 'screening committee' : 
                        switch (ticketElements[ticketElements.length - 1].roleStatus) {
                        case 'NewScrAllocated':
                            allTicketList[i].status = 'New' ;  
                            allTicketList[i].bgClassName = 'btn-primary';    
                            break;
                        case 'ScreenApproved' :
                            allTicketList[i].status = 'Approved' ; 
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        case 'ScreenRejected' :
                            allTicketList[i].status = 'Rejected' ;
                            allTicketList[i].bgClassName = 'btn-danger';
                            break;
                        case 'ReviewPass' :
                            allTicketList[i].status = 'Completed' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        default:
                            allTicketList[i].status = 'WIP' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        }
                        break;
                    case 'team leader' :
                        switch (ticketElements[ticketElements.length - 1].roleStatus) {
                        case 'screenTLAllocated':
                            allTicketList[i].status = 'New' ;      
                            allTicketList[i].bgClassName = 'btn-primary';
                            break;
                        case 'AssignAccept' :
                            allTicketList[i].status = 'Allocated' ; 
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        case 'AssignReject' :
                            allTicketList[i].status = 'Rejected' ;
                            allTicketList[i].bgClassName = 'btn-danger';
                            break;
                        case 'ReviewPass' :
                            allTicketList[i].status = 'Completed' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        default:
                            allTicketList[i].status = 'WIP' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        }
                        break;
                    case 'team member' :
                        switch (ticketElements[ticketElements.length - 1].roleStatus) {
                        case 'Assign':
                            allTicketList[i].status = 'New' ;      
                            allTicketList[i].bgClassName = 'btn-primary';
                            break;
                        case 'QAFail':
                            allTicketList[i].status = 'New' ;      
                            allTicketList[i].bgClassName = 'btn-primary';
                            break;
                        case 'AssignAccept' :
                            allTicketList[i].status = 'Accepted' ; 
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        case 'AssignReject' :
                            allTicketList[i].status = 'Rejected' ;
                            allTicketList[i].bgClassName = 'btn-danger';
                            break;
                        case 'ReviewPass' :
                            allTicketList[i].status = 'Completed' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        default:
                            allTicketList[i].status = 'WIP' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        }
                        break;
                    case 'quality team member' : 
                        switch (ticketElements[ticketElements.length - 1].roleStatus) {
                        case 'VerificationPassQTMAllocated':
                            allTicketList[i].status = 'New' ;      
                            allTicketList[i].bgClassName = 'btn-primary';
                            break;
                        case 'ReviewFail':
                            allTicketList[i].status = 'New' ;      
                            allTicketList[i].bgClassName = 'btn-primary';
                            break;
                        case 'QAPass' :
                            allTicketList[i].status = 'Approved' ; 
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        case 'QAFail' :
                            allTicketList[i].status = 'Rejected' ;
                            allTicketList[i].bgClassName = 'btn-danger';
                            break;
                        case 'ReviewPass' :
                            allTicketList[i].status = 'Completed' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        default:
                            allTicketList[i].status = 'WIP' ;
                            allTicketList[i].bgClassName = 'btn-success';
                            break;
                        }
                        break;
                    case 'quality team leader' :
                        
                        switch (ticketElements[ticketElements.length - 1].roleStatus) {
                            case 'QAPassQTLAllocated':
                                allTicketList[i].status = 'New' ;      
                                allTicketList[i].bgClassName = 'btn-primary';
                                break;
                            case 'ReviewPass' :
                                allTicketList[i].status = 'Approved' ; 
                                allTicketList[i].bgClassName = 'btn-success';
                                break;
                            case 'ReviewFail' :
                                allTicketList[i].status = 'Rejected' ;
                                allTicketList[i].bgClassName = 'btn-danger';
                                break;
                            case 'ReviewPass' :
                                allTicketList[i].status = 'Completed' ;
                                allTicketList[i].bgClassName = 'btn-success';
                                break;
                            default:
                                allTicketList[i].status = 'WIP' ;
                                allTicketList[i].bgClassName = 'btn-success';
                                break;
                            }
                            break;
                    // default : 
                    //     allTicketList[i].status = 'In Process' ;
                    //     allTicketList[i].bgClassName = 'btn-primary';
                    //     break;
                }        
                // allTicketList[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
            } 
        }
    }

    return {
        loading,
        allTicketList
    };
   
})(AllTickets);
export default AllTicketsContainer;
