import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
class ApprovedCases extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      'userDetails': {},
      "userRoleIn": Meteor.userId(),
    }
  }

  showTMList(role){
    var teammemberDetails = Meteor.users.find({"roles": {$in:[role]},}).fetch();
    return teammemberDetails;
  }
  getRole(role) {
    return role != "backofficestaff";
  }
  assignTicketToTM(event){
      event.preventDefault();
      var selectedValue = $("#selectTMMember option:selected").val();
      var checkedUsersList     = [];      
      var insertData = {
        "userId"              : Meteor.userId(),
        "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
        "role"                : Meteor.user().roles.find(this.getRole),
        "roleStatus"          : $(event.currentTarget).attr('data-roleStatus'),
        "msg"                 : $(event.currentTarget).attr('data-msg'),
        "createdAt"           : new Date()
      }
 
      if($("#selectTMMember option:selected").val() !="--Select--"){
        insertData.allocatedToUserid = $("#selectTMMember option:selected").val();
        insertData.allocatedToUserName = $("#selectTMMember option:selected").text();
      }else{
        swal({   
          position: 'top-right',    
          type: 'error',   
          title: 'Please select team member ',      
          showConfirmButton: false,     
          timer: 1500     
        });  
      }
      
			$('input[name=userCheckbox]:checked').each(function() {
				checkedUsersList.push(this.value);
      });
      if(checkedUsersList.length>0 && selectedValue!=""){
        Meteor.call('updateCheckBoxTM',checkedUsersList,insertData);
      }else{
        swal({   
          position: 'top-right',    
          type: 'error',   
          title: 'Please checked checkbox or team member ',      
          showConfirmButton: false,     
          timer: 1500     
        });  
      }
  }

  checkAll(event) {
    // event.preventDefault();
    
    if(event.target.checked){
      $('.userCheckbox').prop('checked',true);
    }else{
      $('.userCheckbox').prop('checked',false);
    }
  }

  render(){
      return(            
        <div>
          <div className="content-wrapper">
            <section className="content">
              <div className="row">
                <div className="col-md-12">
                  <div className="box">
                    <div className="box-header with-border">
                      <h2 className="box-title">My {this.props.header3}</h2> 
                    </div>
                    <div className="box-body">
                      <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">                           
                        <div>
                          <div className="reports-table-main">
                                <div className="col-lg-12">
                                  {
                                    this.props.role == "team leader" ? 
                                      <div className="col-lg-4 col-md-4 col-sm-8 col-xs-8 pull-right">
                                        <select className="col-lg-6 col-md-6 col-sm-4 col-xs-5 tmDropList tmListWrap" id="selectTMMember"ref="userListDropdown" name="userListDropdown"> 
                                          <option>--Select--</option>
                                            {
                                              this.showTMList('team member').map((data,i)=>{
                                                return(
                                                <option key={i} value={data._id} >
                                                    {data.profile.firstname + ' ' + data.profile.lastname}&nbsp; 
                                                    ({data.count ? data.count : 0})
                                                  </option>
                                                );
                                              })
                                            }
                                        </select>
                                        <button type="button" className="btn btn-primary tmDropList col-lg-5 col-md-5 col-sm-6 col-xs-6"  data-role="Team Leader" data-roleStatus="Assign" data-msg="Assigned Ticket To Team Member" onClick={this.assignTicketToTM.bind(this)}>Allocate</button>
                                      </div>

                                      :
                                      null
                                  }
                                </div>
                               <div className="report-list-downloadMain col-lg-12">
                                    <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="download-table-xls-button btn report-list-downloadXLXS"
                                        table="subscriber-list-outerTable"
                                        filename="approvedCases"
                                        sheet="approvedCases"
                                        buttonText="Download as XLS"/>
                                </div>
                              <table id="subscriber-list-outerTable" className="newOrderwrap subscriber-list-outerTable table table-bordered table-hover table-striped table-striped table-responsive table-condensed table-bordered">
                                <thead className="table-head umtblhdr">
                                  <tr className="hrTableHeader  UML-TableTr">
                                   {
                                       this.props.role == "team leader" ? 
                                          <th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1 "> <input type="checkbox" className="allSelector" name="allSelector" onChange={this.checkAll.bind(this)}/> </th>
                                          :
                                          null
                                        
                                    }
                                    <th className=""> Cases No.</th>
                                    <th className=""> Service Name </th>
                                    <th className=""> Applicant Name </th>
                                    <th className=""> Receive Date </th>
                                    <th className=""> Due Date </th>
                                    <th className=""> Aging &nbsp;( In Days ) </th>                                          
                                    <th className=""> Status </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                      !this.props.loading ?
                                        this.props.approvedTicketList.map((data, index)=>{
                                          return(
                                              <tr key={index}>
                                                  {
                                                    data.status == "New" && this.props.role == "team leader" ? 
                                                     <td> <input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" value={data._id}/></td>
                                                     :
                                                     data.status != "New" && this.props.role == "team leader" ? 
                                                     <td></td>
                                                     : 
                                                     null
                                                    
                                                  }
                                                  <td><a href={"/admin/ticket/"+data._id}>{data.ticketNumber}</a></td>
                                                  <td><a href={"/admin/ticket/"+data._id}>{data.serviceName==="Address Information" ? data.verificationType==="currentAddress" ? data.serviceName+" - (Current Address)" : data.serviceName+" - (Permanent Address)": data.serviceName} </a></td>
                                                  <td><a href={"/admin/ticket/"+data._id}>{moment(data.createdAt).format('DD MMM YYYY')}</a></td>
                                                  <td><a href={"/admin/ticket/"+data._id}>{moment(data.tatDate).format('DD MMM YYYY')}</a></td> 
                                                  <td><a href={"/admin/ticket/"+data._id}>{Math.round(Math.abs((new Date().getTime() - data.createdAt.getTime())/(24*60*60*1000)))}</a></td>
                                                  <td className={data.bgClassName}><a href={"/admin/ticket/"+data._id} className="statuswcolor">{data.status}</a></td>
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
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
            </section>
          </div>
        </div>    
      );
    }
}
export default ApprovedCasesContainer = withTracker(props => {
  var handleApprovedTicketList = Meteor.subscribe("listTickets");
  var handleUseFunc = Meteor.subscribe('userfunction');
  var _id  = Meteor.userId();
  const userHandle  = Meteor.subscribe('userData',_id);
  const user        = Meteor.users.findOne({"_id" : _id});
  const loading    = !userHandle.ready() && !handleApprovedTicketList.ready() && !handleUseFunc.ready();
  var header3 = '';

  if(user){
    var roleArr = user.roles;
    if(roleArr){
      var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
    }
    var roleStatus = '';
    switch (role) {
      case 'screening committee':
        roleStatus = 'ScreenApproved';
        break;
      case 'team leader':
        roleStatus = 'AssignAccept';
        break;
      case 'team member':
        roleStatus = 'AssignAccept';
        break;
      case 'quality team leader':
        roleStatus = 'ReviewPass';
        break;
      case 'quality team member':
        roleStatus = 'QAPass';
        break;
    
      default:
        break;
    }
    //Get all the Open Tickets
    var approvedTicketList = [];
    var approvedTicketDetails = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}}).fetch();
    if(approvedTicketDetails){
      //find last status of the Tickets
      for(i=0;i< approvedTicketDetails.length; i++){
        var ticketElements = approvedTicketDetails[i].ticketElement;
        approvedTicketDetails[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
        if(ticketElements.find(function (obj) { return obj.roleStatus == roleStatus})){
          approvedTicketList.push(approvedTicketDetails[i]);
        }
      }

      for(i=0;i< approvedTicketList.length; i++){
        var ticketElements = approvedTicketList[i].ticketElement;
        switch(role){
          case 'screening committee' : 
          header3 = 'Approved Cases';
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'NewScrAllocated':
                approvedTicketList[i].status = 'New' ;  
                approvedTicketList[i].bgClassName = 'btn-primary';    
                break;
              case 'ScreenApproved' :
                approvedTicketList[i].status = 'Approved' ; 
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              case 'ScreenRejected' :
                approvedTicketList[i].status = 'Rejected' ;
                approvedTicketList[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                approvedTicketList[i].status = 'Completed' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              default:
                approvedTicketList[i].status = 'Work In Process' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'team leader' :
          header3 = 'Assigned Cases';
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'screenTLAllocated':
                approvedTicketList[i].status = 'New' ;      
                approvedTicketList[i].bgClassName = 'btn-primary';
                break;
              case 'AssignAccept' :
                approvedTicketList[i].status = 'Allocated' ; 
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              case 'AssignReject' :
                approvedTicketList[i].status = 'Rejected' ;
                approvedTicketList[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                approvedTicketList[i].status = 'Completed' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              default:
                approvedTicketList[i].status = 'Work In Process' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'team member' :
          header3 = 'Accepted Cases';
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'Assign':
                approvedTicketList[i].status = 'New' ;      
                approvedTicketList[i].bgClassName = 'btn-primary';
                break;
              case 'QAFail':
                approvedTicketList[i].status = 'New' ;      
                approvedTicketList[i].bgClassName = 'btn-primary';
                break;
              case 'AssignAccept' :
                approvedTicketList[i].status = 'Accepted' ; 
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              case 'AssignReject' :
                approvedTicketList[i].status = 'Rejected' ;
                approvedTicketList[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                approvedTicketList[i].status = 'Completed' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              default:
                approvedTicketList[i].status = 'Work In Process' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'quality team member' : 
          header3 = 'Approved Cases';
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'VerificationPassQTMAllocated':
                approvedTicketList[i].status = 'New' ;      
                approvedTicketList[i].bgClassName = 'btn-primary';
                break;
              case 'ReviewFail':
                approvedTicketList[i].status = 'New' ;      
                approvedTicketList[i].bgClassName = 'btn-primary';
                break;
              case 'QAPass' :
                approvedTicketList[i].status = 'Approved' ; 
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              case 'QAFail' :
                approvedTicketList[i].status = 'Rejected' ;
                approvedTicketList[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                approvedTicketList[i].status = 'Completed' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              default:
                approvedTicketList[i].status = 'Work In Process' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'quality team leader' :
          header3 = 'Approved Cases';
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'QAPassQTLAllocated':
                approvedTicketList[i].status = 'New' ;      
                approvedTicketList[i].bgClassName = 'btn-primary';
                break;
              case 'ReiewFail' :
                approvedTicketList[i].status = 'Rejected' ;
                approvedTicketList[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                approvedTicketList[i].status = 'Completed' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
              default:
                approvedTicketList[i].status = 'Work In Process' ;
                approvedTicketList[i].bgClassName = 'btn-success';
                break;
            }
            break;
          default : 
            approvedTicketList[i].status = 'Work In Process' ;
            approvedTicketList[i].bgClassName = 'btn-success';
            break;
        }
        // assignedTicketList[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
      } 
    }
  }
  return {
    loading,
    approvedTicketList,
    header3,
    role

  };
})(ApprovedCases);