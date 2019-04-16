import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {Tracker} from 'meteor/tracker';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

class AllCases extends TrackerReact(Component){
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
        insertData.allocatedToUserid   = $("#selectTMMember option:selected").val();
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
        Meteor.call('updateCheckBoxTM',checkedUsersList,insertData,(error,result)=>{
          // if(result == 1){
          //   
          //   this.refs.selectTMMember.value = ""
          //   // $("#selectTMMember").value = "";
          // }
        });
      }else{
        swal({   
          position: 'top-right',    
          type: 'error',   
          title: 'Please checked checkbox or team member ',      
          showConfirmButton: false,     
          timer: 1500     
        });  
      }

      $("#selectTMMember").val("");
      // this.refs.selectTMMember.value = "";
      
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
      var ticketMasterData = [1, 2, 3, 4]
      return(            
        <div>
          <div className="content-wrapper">
            <section className="content">
              <div className="row">
                <div className="col-md-12">
                  <div className="box">
                    <div className="box-header with-border">
                      <h2 className="box-title"> All Cases</h2> 
                    </div>
                      <div className="box-body">
                        <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          {/* {this.props.ticketBucketData[0].orderId} */}
                            <div>
                              <div className="reports-table-main">
                                <div className="col-lg-12">
                                  {
                                    this.props.role == "team leader" ? 
                                      <div className="col-lg-4 col-md-4 col-sm-8 col-xs-8 pull-right">
                                        <select className="col-lg-6 col-md-6 col-sm-4 col-xs-5 tmDropList tmListWrap" id="selectTMMember" ref="selectTMMember" name="userListDropdown"> 
                                          <option value="">--Select--</option>
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
                                        filename="Allcases"
                                        sheet="Allcases"
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
                                        this.props.alltickets.map((data, index)=>{
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
                                                  <td><a href={"/admin/ticket/"+data._id}>{data.corporateDetails ? data.corporateDetails.companyName+" - ("+data.userName+")": data.userName}</a></td>
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
export default AllTicketContainer = withTracker(props => {
  var handleAllTickets = Meteor.subscribe("listTickets");
  var handleUseFunc = Meteor.subscribe('userfunction');
  var _id  = Meteor.userId();
  const userHandle  = Meteor.subscribe('userData',_id);
  const user        = Meteor.users.findOne({"_id" : _id});
  const loading    = !userHandle.ready() && !handleAllTickets.ready() && !handleUseFunc.ready();
  var ticketAgeArray = [];
  if(user){
    var roleArr = user.roles;
    if(roleArr){
      var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
    }
    //Get all the Tickets
    var alltickets = TicketMaster.find({}).fetch();
    if(alltickets){
      //find last status of the Tickets
      for(i=0;i< alltickets.length; i++){
        var ticketElements = alltickets[i].ticketElement;
        switch(role){
          case 'screening committee' : 
            switch (ticketElements[ticketElements.length - 1].roleStatus){
              case 'NewScrAllocated':
                
                alltickets[i].status = 'New' ;  
                alltickets[i].bgClassName = 'btn-primary';   
                alltickets[i].roleCreatedAt = ticketElements[ticketElements.length - 1].createdAt;
                break;
              case 'ScreenApproved' :
                alltickets[i].status = 'Approved' ; 
                alltickets[i].bgClassName = 'btn-success';
                break;
              case 'ScreenRejected' :
                alltickets[i].status = 'Rejected' ;
                alltickets[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                alltickets[i].status = 'Completed' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
              default:
                alltickets[i].status = 'Work In Process' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'team leader' :
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'screenTLAllocated':
                alltickets[i].status = 'New' ;      
                alltickets[i].bgClassName = 'btn-primary';
                alltickets[i].roleCreatedAt = ticketElements[ticketElements.length - 1].createdAt;
                
                break;
              case 'AssignAccept' :
                alltickets[i].status = 'Work In Process' ; 
                alltickets[i].bgClassName = 'btn-success';
                break;
              case 'AssignReject' :
                alltickets[i].status = 'TM Rejected' ;
                alltickets[i].bgClassName = 'btn-warning';
                break;
              case 'ReviewPass' :
                alltickets[i].status = 'Completed' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
              default:
                alltickets[i].status = 'Work In Process' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'team member' :
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'Assign':
                alltickets[i].status = 'New' ;      
                alltickets[i].bgClassName = 'btn-primary';
                alltickets[i].roleCreatedAt = ticketElements[ticketElements.length - 1].createdAt;
                
                break;
              case 'QAFail':
                alltickets[i].status = 'Quality Rejected' ;      
                alltickets[i].bgClassName = 'btn-warning';
                break;
              case 'SelfAllocated':
                alltickets[i].status = 'Self Allocated' ;      
                alltickets[i].bgClassName = 'btn-warning';
                break;
              case 'ProofSubmit':
                alltickets[i].status = 'Proof Submitted' ;      
                alltickets[i].bgClassName = 'btn-warning';
                break;
              case 'VerificationPass':
                alltickets[i].status = 'TM Verified' ;      
                alltickets[i].bgClassName = 'btn-warning';
                break;
              case 'AssignAccept' :
                alltickets[i].status = 'Accepted' ; 
                alltickets[i].bgClassName = 'btn-warning';
                break;
              case 'ReviewPass' :
                alltickets[i].status = 'Completed' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
              default:
                alltickets[i].status = 'Work In Process' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'quality team member' : 
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'VerificationPassQTMAllocated':
                alltickets[i].status = 'New' ;      
                alltickets[i].bgClassName = 'btn-primary';
                alltickets[i].roleCreatedAt = ticketElements[ticketElements.length - 1].createdAt;
                
                break;
              case 'ReviewFail':
                alltickets[i].status = 'Review Fail' ;      
                alltickets[i].bgClassName = 'btn-warning';
                break;
              case 'QAPass' :
                alltickets[i].status = 'Approved' ; 
                alltickets[i].bgClassName = 'btn-success';
                break;
              case 'QAFail' :
                alltickets[i].status = 'Rejected' ;
                alltickets[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                alltickets[i].status = 'Completed' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
              default:
                alltickets[i].status = 'Work In Process' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
            }
            break;
          case 'quality team leader' :
            switch (ticketElements[ticketElements.length - 1].roleStatus) {
              case 'QAPassQTLAllocated':
                alltickets[i].status = 'New' ;      
                alltickets[i].bgClassName = 'btn-primary';
                alltickets[i].roleCreatedAt = ticketElements[ticketElements.length - 1].createdAt;
                
                break;
              case 'ReviewPass' :
                alltickets[i].status = 'Approved' ; 
                alltickets[i].bgClassName = 'btn-success';
                break;
              case 'ReiewFail' :
                alltickets[i].status = 'Rejected' ;
                alltickets[i].bgClassName = 'btn-danger';
                break;
              case 'ReviewPass' :
                alltickets[i].status = 'Completed' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
              default:
                alltickets[i].status = 'Work In Process' ;
                alltickets[i].bgClassName = 'btn-success';
                break;
            }
            break;
          default : 
            alltickets[i].status = 'Work In Process' ;
            alltickets[i].bgClassName = 'btn-success';
            break;
        }
        // alltickets[i].status = ticketElements[ticketElements.length - 1].roleStatus ;
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
      var tmVerifiedTickets  = [];
      var escalatedDaysCount = 2;
      var escalatedTickets   = [];
      var todaysDate = "";
      switch(role){
        case 'screening committee' :
          for(i=0; i < alltickets.length;i++){
            if(alltickets[i].status == 'New'){
              var createdAt = new Date(alltickets[i].roleCreatedAt);
              let sevenDaysAgo = createdAt.setDate(createdAt.getDate() + escalatedDaysCount);
              sevenDaysAgo = new Date(sevenDaysAgo).toISOString();
              todaysDate = new Date().toISOString();
                if(todaysDate >= sevenDaysAgo){
                alltickets[i].bgClassName = 'btn-danger';   
                escalatedTickets.push(alltickets[i]);
              }
              newTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Approved'){
              approvedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Rejected'){
              rejectedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Completed'){
              completedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Work In Process'){
              inProcessTickets.push(alltickets[i]);
            }
          }
          alltickets = [];
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          approvedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          alltickets = newTickets.concat(approvedTickets);
          alltickets = alltickets.concat(rejectedTickets);
          alltickets = alltickets.concat(completedTickets);
          alltickets = alltickets.concat(inProcessTickets);
          break;
        case 'team leader' :
          for(i=0; i < alltickets.length;i++){
            if(alltickets[i].status == 'New'){
              var createdAt = new Date(alltickets[i].roleCreatedAt);
              let sevenDaysAgo = createdAt.setDate(createdAt.getDate() + escalatedDaysCount);
              sevenDaysAgo = new Date(sevenDaysAgo).toISOString();
              todaysDate = new Date().toISOString();
                if(todaysDate >= sevenDaysAgo){
                alltickets[i].bgClassName = 'btn-danger';   
                escalatedTickets.push(alltickets[i]);
              }
              newTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Allocated'){
              allocatedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'TM Rejected'){
              rejectedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Completed'){
              completedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Work In Process'){
              inProcessTickets.push(alltickets[i]);
            }
          }
          alltickets = [];
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          allocatedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          alltickets = newTickets.concat(rejectedTickets);
          alltickets = alltickets.concat(allocatedTickets);
          alltickets = alltickets.concat(completedTickets);
          alltickets = alltickets.concat(inProcessTickets);
          break;
        case 'team member' :
          for(i=0; i < alltickets.length;i++){
            if(alltickets[i].status == 'Quality Rejected'){
              vFailTickets.push(alltickets[i]);
            }if(alltickets[i].status == 'New'){
              var createdAt = new Date(alltickets[i].roleCreatedAt);
              let sevenDaysAgo = createdAt.setDate(createdAt.getDate() + escalatedDaysCount);
              sevenDaysAgo = new Date(sevenDaysAgo).toISOString();
              todaysDate = new Date().toISOString();
                if(todaysDate >= sevenDaysAgo){
                alltickets[i].bgClassName = 'btn-danger';   
                escalatedTickets.push(alltickets[i]);
              }
              newTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Self Allocated'){
              selfAllocatedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Proof Submitted'){
              proofSubmittedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'TM Verified'){
              tmVerifiedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Accepted'){
              acceptedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Rejected'){
              rejectedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Completed'){
              completedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Work In Process'){
              inProcessTickets.push(alltickets[i]);
            }
          }
          alltickets = [];
          vFailTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          tmVerifiedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          proofSubmittedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          selfAllocatedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          acceptedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          alltickets = vFailTickets.concat(newTickets);
          alltickets = alltickets.concat(tmVerifiedTickets);
          alltickets = alltickets.concat(proofSubmittedTickets);
          alltickets = alltickets.concat(selfAllocatedTickets);
          alltickets = alltickets.concat(acceptedTickets);
          alltickets = alltickets.concat(rejectedTickets);
          alltickets = alltickets.concat(completedTickets);
          alltickets = alltickets.concat(inProcessTickets);
          break;
        case 'quality team member' :
          for(i=0; i < alltickets.length;i++){
            if(alltickets[i].status == 'Review Fail'){
              reviewFailTickets.push(alltickets[i]);
            }if(alltickets[i].status == 'New'){
              var createdAt = new Date(alltickets[i].roleCreatedAt);
              let sevenDaysAgo = createdAt.setDate(createdAt.getDate() + escalatedDaysCount);
              sevenDaysAgo = new Date(sevenDaysAgo).toISOString();
              todaysDate = new Date().toISOString();
                if(todaysDate >= sevenDaysAgo){
                alltickets[i].bgClassName = 'btn-danger';   
                escalatedTickets.push(alltickets[i]);
              }
              newTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Approved'){
              approvedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Rejected'){
              rejectedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Completed'){
              completedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Work In Process'){
              inProcessTickets.push(alltickets[i]);
            }
          }
          alltickets = [];
          reviewFailTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          tmVerifiedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          proofSubmittedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          selfAllocatedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          approvedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          alltickets = reviewFailTickets.concat(newTickets);
          alltickets = alltickets.concat(approvedTickets);
          alltickets = alltickets.concat(rejectedTickets);
          alltickets = alltickets.concat(completedTickets);
          alltickets = alltickets.concat(inProcessTickets);
          break;
        case 'quality team leader' :
          for(i=0; i < alltickets.length;i++){
            if(alltickets[i].status == 'New'){
              var createdAt = new Date(alltickets[i].roleCreatedAt);
              let sevenDaysAgo = createdAt.setDate(createdAt.getDate() + escalatedDaysCount);
              sevenDaysAgo = new Date(sevenDaysAgo).toISOString();
              todaysDate = new Date().toISOString();
                if(todaysDate >= sevenDaysAgo){
                alltickets[i].bgClassName = 'btn-danger';   
                escalatedTickets.push(alltickets[i]);
              }
              newTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Approved'){
              approvedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Rejected'){
              rejectedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Completed'){
              completedTickets.push(alltickets[i]);
            }else if(alltickets[i].status == 'Work In Process'){
              inProcessTickets.push(alltickets[i]);
            }
          }
          alltickets = [];
          newTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          approvedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          rejectedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          completedTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          inProcessTickets.sort(function(a,b){ return new Date(a.tatDate) - new Date(b.tatDate);});
          alltickets = newTickets.concat(approvedTickets);
          alltickets = alltickets.concat(rejectedTickets);
          alltickets = alltickets.concat(completedTickets);
          alltickets = alltickets.concat(inProcessTickets);
          break;
      } 
    }
  }
  console.log("alltickets :",alltickets);
  
  return {
    loading,
    alltickets,
    ticketAgeArray,
    role
  };
})(AllCases);