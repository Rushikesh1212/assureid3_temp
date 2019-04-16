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

class OpenCases extends TrackerReact(Component){
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
      // var selectedValue        = this.refs.userListDropdown.value;
      var selectedValue = $("#selectTMMember option:selected").val();
      
      var insertData = {
        "userId"              : Meteor.userId(),
        "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
        "role"                : Meteor.user().roles.find(this.getRole),
        "roleStatus"          : $(event.currentTarget).attr('data-roleStatus'),
        "msg"                 : $(event.currentTarget).attr('data-msg'),
        "createdAt"           : new Date()
      }
      
      // if(selectedValue !="--Select--"){
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
      
      

      var checkedUsersList     = [];
      
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
                      <h2 className="box-title">My Open Cases</h2> 
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
                                            filename="openCases"
                                            sheet="openCases"
                                            buttonText="Download as XLS"/>
                                    </div>
                                    <table id="subscriber-list-outerTable" className="newOrderwrap subscriber-list-outerTable table table-bordered table-hover table-striped table-striped table-responsive table-condensed table-bordered">
                                    <thead className="table-head umtblhdr">
                                    <tr className="hrTableHeader UML-TableTr">
                                      {
                                        this.props.role == "team leader" ? 
                                            <th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1 "> <input type="checkbox" className="allSelector" name="allSelector" onChange={this.checkAll.bind(this)}/> </th>
                                            :
                                            null
                                          
                                      }
                                    <th className=""> Case No.</th>                            
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
                                              this.props.openTicketList.map((data, index)=>{
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
                                                          <td><a href={"/admin/ticket/"+data._id}>{data.corporateDetails ? data.corporateDetails.companyName+"- ("+data.userName+")": data.userName}</a></td>
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
export default OpenCasesContainer = withTracker(props => {
  
  var handleOpenTicketList = Meteor.subscribe("listTickets");
  var handleUseFunc = Meteor.subscribe('userfunction');
  var _id  = Meteor.userId();
  const userHandle  = Meteor.subscribe('userData',_id);
  const user        = Meteor.users.findOne({"_id" : _id});
  const loading    = !userHandle.ready() && !handleOpenTicketList.ready() && !handleUseFunc.ready();

  if(user){
    var roleArr = user.roles;
    if(roleArr){
      var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
    }
    //Get all the Open Tickets
    var openTicketList = [];
    var openTicketDetails = TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid: _id }}}).fetch();
    if(openTicketDetails){
      //find last status of the Tickets
      for(i=0;i< openTicketDetails.length; i++){
        var ticketElements = openTicketDetails[i].ticketElement;
        openTicketDetails[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
        if(openTicketDetails[i].status != 'ReviewPass'){
          switch(role){
            case 'screening committee' : 
              switch (ticketElements[ticketElements.length - 1].roleStatus) {
                case 'NewScrAllocated':
                  openTicketDetails[i].status = 'New' ;  
                  openTicketDetails[i].bgClassName = 'btn-primary';    
                  openTicketDetails[i].roleCreatedAt = ticketElements[ticketElements.length - 1].createdAt;

                  break;
                case 'ScreenApproved' :
                  openTicketDetails[i].status = 'Approved' ; 
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                case 'ScreenRejected' :
                  openTicketDetails[i].status = 'Rejected' ;
                  openTicketDetails[i].bgClassName = 'btn-danger';
                  break;
                case 'ReviewPass' :
                  openTicketDetails[i].status = 'Completed' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                default:
                  openTicketDetails[i].status = 'Work In Process' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
              }
              break;
            case 'team leader' :
              switch (ticketElements[ticketElements.length - 1].roleStatus) {
                case 'screenTLAllocated':
                  openTicketDetails[i].status = 'New' ;      
                  openTicketDetails[i].bgClassName = 'btn-primary';
                  break;
                case 'AssignAccept' :
                  openTicketDetails[i].status = 'Allocated' ; 
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                case 'AssignReject' :
                  openTicketDetails[i].status = 'Re-Allocate' ;
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'ReviewPass' :
                  openTicketDetails[i].status = 'Completed' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                default:
                  openTicketDetails[i].status = 'Work In Process' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
              }
              break;
            case 'team member' :
              switch (ticketElements[ticketElements.length - 1].roleStatus) {
                case 'Assign':
                  openTicketDetails[i].status = 'New' ;      
                  openTicketDetails[i].bgClassName = 'btn-primary';
                  break;
                case 'QAFail':
                  openTicketDetails[i].status = 'Quality Rejected' ;      
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'AssignAccept' :
                  openTicketDetails[i].status = 'Accepted' ; 
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'AssignReject' :
                  openTicketDetails[i].status = 'Rejected' ;
                  openTicketDetails[i].bgClassName = 'btn-danger';
                  break;
                case 'SelfAllocated' :
                  openTicketDetails[i].status = 'Self Allocated' ; 
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'ProofSubmit' :
                  openTicketDetails[i].status = 'Proof Submitted' ;      
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'VerificationFail' :
                  openTicketDetails[i].status = 'Proof Re-Submit' ;      
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'ProofResubmitted' : 
                  openTicketDetails[i].status = 'Proof Re-Submitted' ;      
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'VerificationPass' : 
                  openTicketDetails[i].status = 'Create Report' ;      
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'ReviewPass' :
                  openTicketDetails[i].status = 'Completed' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                default:
                  openTicketDetails[i].status = 'Work In Process' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
              }
              break;
            case 'quality team member' : 
              switch (ticketElements[ticketElements.length - 1].roleStatus) {
                case 'VerificationPassQTMAllocated':
                  openTicketDetails[i].status = 'New' ;      
                  openTicketDetails[i].bgClassName = 'btn-primary';
                  break;
                case 'ReviewFail':
                  openTicketDetails[i].status = 'Review Fail' ;      
                  openTicketDetails[i].bgClassName = 'btn-warning';
                  break;
                case 'QAPass' :
                  openTicketDetails[i].status = 'Approved' ; 
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                case 'QAFail' :
                  openTicketDetails[i].status = 'Rejected' ;
                  openTicketDetails[i].bgClassName = 'btn-danger';
                  break;
                case 'ReviewPass' :
                  openTicketDetails[i].status = 'Completed' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                default:
                  openTicketDetails[i].status = 'Work In Process' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
              }
              break;
            case 'quality team leader' :
              switch (ticketElements[ticketElements.length - 1].roleStatus) {
                case 'QAPassQTLAllocated':
                  openTicketDetails[i].status = 'New' ;      
                  openTicketDetails[i].bgClassName = 'btn-primary';
                  break;
                case 'ReviewPass' :
                  openTicketDetails[i].status = 'Approved' ; 
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                case 'ReiewFail' :
                  openTicketDetails[i].status = 'Rejected' ;
                  openTicketDetails[i].bgClassName = 'btn-danger';
                  break;
                case 'ReviewPass' :
                  openTicketDetails[i].status = 'Completed' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
                default:
                  openTicketDetails[i].status = 'Work In Process' ;
                  openTicketDetails[i].bgClassName = 'btn-success';
                  break;
              }
              break;
            default : 
              openTicketDetails[i].status = 'Work In Process' ;
              openTicketDetails[i].bgClassName = 'btn-success';
              break;
          }
          openTicketList.push(openTicketDetails[i]);
        }
      } 

      //Sorting the array according to the status depending upon the role
      var newTickets = [];
      var vFailTickets = [];
      var reviewFailTickets = [];
      var approvedTickets = [];
      var acceptedTickets = [];
      var allocatedTickets = [];
      var rejectedTickets = [];
      var completedTickets = [];
      var inProcessTickets = [];
      var selfAllocatedTickets = [];
      var proofSubmittedTickets = [];
      var proofReSubmittedTickets = [];
      var proofReSubmitTickets = [];
      var tmVerifiedTickets = [];
      var reAllocateTickets = [];
      var submitReportTickets = [];
      var qualityRejectedTickets = [];
      var selfAllocatedTickets = [];
      switch(role){
        case 'screening committee' :
          for(i=0; i < openTicketList.length;i++){
            if(openTicketList[i].status == 'New'){
              var createdAt = new Date(openTicketList[i].roleCreatedAt);
              let sevenDaysAgo = createdAt.setDate(createdAt.getDate() +2);
              sevenDaysAgo = new Date(sevenDaysAgo).toISOString();
              todaysDate = new Date().toISOString();
                if(todaysDate >= sevenDaysAgo){
                openTicketList[i].bgClassName = 'btn-danger';   
                newTickets.push(openTicketList[i]);
              }
              newTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Approved'){
              approvedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Rejected'){
              rejectedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Completed'){
              completedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Work In Process'){
              inProcessTickets.push(openTicketList[i]);
            }
          }
          openTicketList = [];
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          approvedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          openTicketList = newTickets.concat(approvedTickets);
          openTicketList = openTicketList.concat(rejectedTickets);
          openTicketList = openTicketList.concat(completedTickets);
          openTicketList = openTicketList.concat(inProcessTickets);
          break;
        case 'team leader' :
          for(i=0; i < openTicketList.length;i++){
            if(openTicketList[i].status == 'New'){
              newTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Allocated'){
              allocatedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Re-Allocate'){
              reAllocateTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Completed'){
              completedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Work In Process'){
              inProcessTickets.push(openTicketList[i]);
            }
          }
          openTicketList = [];
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          allocatedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          reAllocateTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          openTicketList = newTickets.concat(reAllocateTickets);
          openTicketList = openTicketList.concat(allocatedTickets);
          openTicketList = openTicketList.concat(completedTickets);
          openTicketList = openTicketList.concat(inProcessTickets);
          break;
        case 'team member' :
          for(i=0; i < openTicketList.length;i++){
            if(openTicketList[i].status == 'Create Report'){
              submitReportTickets.push(openTicketList[i]);
            }if(openTicketList[i].status == 'Proof Re-Submitted'){
              proofReSubmittedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Proof Re-Submit'){
              proofReSubmitTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Proof Submitted'){
              proofSubmittedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Quality Rejected'){
              qualityRejectedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Self Allocated'){
              selfAllocatedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'New'){
              newTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Accepted'){
              acceptedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Rejected'){
              rejectedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Completed'){
              completedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Work In Process'){
              inProcessTickets.push(openTicketList[i]);
            }
          }
          openTicketList = [];
          submitReportTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          proofReSubmittedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          proofSubmittedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          proofReSubmitTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          qualityRejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          selfAllocatedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          acceptedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          openTicketList = submitReportTickets.concat(proofReSubmittedTickets);
          openTicketList = openTicketList.concat(proofSubmittedTickets);
          openTicketList = openTicketList.concat(proofReSubmitTickets);
          openTicketList = openTicketList.concat(qualityRejectedTickets);
          openTicketList = openTicketList.concat(selfAllocatedTickets);
          openTicketList = openTicketList.concat(newTickets);
          openTicketList = openTicketList.concat(acceptedTickets);
          openTicketList = openTicketList.concat(rejectedTickets);
          openTicketList = openTicketList.concat(completedTickets);
          openTicketList = openTicketList.concat(inProcessTickets);
          break;
        case 'quality team member' :
          for(i=0; i < openTicketList.length;i++){
            if(openTicketList[i].status == 'Review Fail'){
              reviewFailTickets.push(openTicketList[i]);
            }if(openTicketList[i].status == 'New'){
              newTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Approved'){
              approvedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Rejected'){
              rejectedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Completed'){
              completedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Work In Process'){
              inProcessTickets.push(openTicketList[i]);
            }
          }
          openTicketList = [];
          reviewFailTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          tmVerifiedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          proofSubmittedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          selfAllocatedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          approvedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          openTicketList = reviewFailTickets.concat(newTickets);
          openTicketList = openTicketList.concat(approvedTickets);
          openTicketList = openTicketList.concat(rejectedTickets);
          openTicketList = openTicketList.concat(completedTickets);
          openTicketList = openTicketList.concat(inProcessTickets);
          break;
        case 'quality team leader' :
          for(i=0; i < openTicketList.length;i++){
            if(openTicketList[i].status == 'New'){
              newTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Approved'){
              approvedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Rejected'){
              rejectedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Completed'){
              completedTickets.push(openTicketList[i]);
            }else if(openTicketList[i].status == 'Work In Process'){
              inProcessTickets.push(openTicketList[i]);
            }
          }
          openTicketList = [];
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          approvedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          openTicketList = newTickets.concat(approvedTickets);
          openTicketList = openTicketList.concat(rejectedTickets);
          openTicketList = openTicketList.concat(completedTickets);
          openTicketList = openTicketList.concat(inProcessTickets);
          break;
      }
    }
  }
  return {
    loading,
    openTicketList,
    role

  };
})(OpenCases);