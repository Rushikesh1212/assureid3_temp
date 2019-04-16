import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class AdminTicketDetails extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      'userDetails': {}, 
      "userRoleIn": Meteor.userId(),
    }
    this.handlechange = this.handlechange.bind(this);
  }
  showUserList(role){
    var teammemberDetails = Meteor.users.find({"roles": {$in:[role]},}).fetch();
    return teammemberDetails;
  }
  getRole(role) {
    return role != "backofficestaff";
  }
  handlechange(event){
    // event.preventDefault()
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    this.setState({
      [name]: value
    });
  }
  assignTicket(event){
    event.preventDefault();

    // var ticketid          = $(event.currentTarget).attr('data-tickteid');
    var ticketid          = event.target.getAttribute("data-tickteid");
    var selectedValue     = $("#selectTMMember"+ticketid).val();
    // console.log("selectedValue :",selectedValue);
    // console.log("selected Text :",$("#selectTMM.ember"+ticketid+" option:selected").text());
    var checkedUsersList  = [];     
    var insertData = {
      "userId"              : "",
      "userName"            : "",
      "role"                : Meteor.user().roles.find(this.getRole),
      "roleStatus"          : event.target.getAttribute('data-rolestatus'),
      "msg"                 : event.target.getAttribute('data-msg'),
      "bulkCount"           : 1,
      "createdAt"           : new Date()
    }
    if(selectedValue != "--Select--"){
      if(event.target.getAttribute('data-rolestatus') != 'AssignAccept' &&  event.target.getAttribute('data-rolestatus') != 'SelfAllocated' && event.target.getAttribute('data-rolestatus') != 'ProofSubmit' &&  event.target.getAttribute('data-rolestatus') != 'ProofSubmit-Pending' &&  event.target.getAttribute('data-rolestatus') != 'ProofResubmitted'){
        insertData.allocatedToUserid   = $("#selectTMMember"+ticketid).val();
        insertData.allocatedToUserName = ($("#selectTMMember"+ticketid+" option:selected").text()).replace(/\s*\([0-9*]\)/g,'');
      }else{
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        insertData.userId   = $("#selectTMMember"+ticketid).val();
        insertData.userName = ($("#selectTMMember"+ticketid+" option:selected").text()).replace(/\s*\([0-9*]\)/g,'');
      }
      // console.log("insertData :",insertData);
      Meteor.call('genericUpdateTicketMasterElement',ticketid,insertData);
    }else{
      swal({   
        position: 'top-right',    
        type: 'error',   
        title: 'Please select '+event.target.getAttribute('data-status'),      
        showConfirmButton: false,     
        timer: 1500     
      });  
    }
    // $('input[name=userCheckbox]:checked').each(function() {
    //   checkedUsersList.push(this.value);
    // });
    // if(selectedValue!=""){
    //   // console.log('insertData ',insertData);
    // }else{
    //   swal({   
    //     position: 'top-right',    
    //     type: 'error',   
    //     title: 'Please checked checkbox or team member ',      
    //     showConfirmButton: false,     
    //     timer: 1500     
    //   });  
    // }
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
                      <h2 className="box-title">All Cases Details </h2> 
                    </div>
                    <div className="box-body">
                      <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">                           
                        <div>
                          <div className="reports-table-main">
                              <table id="adminOrderTicketList" className="newOrderwrap subscriber-list-outerTable table table-bordered table-hover table-striped table-striped table-responsive table-condensed table-bordered">
                                <thead className="table-head umtblhdr">
                                  <tr className="hrTableHeader  UML-TableTr">
                                    <th className=""> Cases No.</th>
                                    <th className=""> Service Name </th>
                                    <th className=""> Receive Date </th>
                                    <th className=""> Last Action Date </th>
                                    <th className=""> Currently With </th>
                                    <th className=""> Allocate To </th>
                                    <th className="">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    !this.props.loading ?
                                      this.props.allTicketList.map((data, index)=>{
                                          return(
                                              <tr key={index}>
                                                  <td><a href={"/admin/ticket/"+data._id}>{data.ticketNumber}</a></td>
                                                  <td><a href={"/admin/ticket/"+data._id}>{data.serviceName}</a></td>
                                                  <td><a href={"/admin/ticket/"+data._id}>{moment(data.createdAt).format('DD MMM YYYY')}</a></td>
                                                  <td><a href={"/admin/ticket/"+data._id}>{moment(data.tatDate).format('DD MMM YYYY')}</a></td> 
                                                  <td><a href={"/admin/ticket/"+data._id} className="orderticketbg">{data.withPerson}</a></td> 
                                                  <td className="tmDropList"><a href={"/admin/ticket/"+data._id} >{data.status}</a></td>
                                                  <td>
                                                    {
                                                      data.showList.length >= 0 ?
                                                          <div className="col-lg-12">
                                                          <select className="col-lg-6 col-md-6 col-sm-4 col-xs-5 tmDropList tmListWrap" id={"selectTMMember"+data._id} ref="userListDropdown" name="userListDropdown"> 
                                                          <option>--Select--</option>
                                                          {
                                                               data.showList.map((user,i)=>{
                                                                // console.log('_id ',user._id);
                                                                return(
                                                                <option key={i} value={user._id} >
                                                                    {user.profile.firstname + ' ' + user.profile.lastname}&nbsp; 
                                                                    ({user.count ? user.count : 0})
                                                                  </option>
                                                                );
                                                              })
                                                          }
                                                          </select>
                                                          <button type="button" className="btn btn-primary tmDropList col-lg-5 col-md-5 col-sm-6 col-xs-6"  data-tickteid={data._id} data-status={data.status} data-role={data.datarole} data-rolestatus={data.dataroleStatus} data-msg={data.datamsg} onClick={this.assignTicket.bind(this)}>Allocate</button>
                                                          </div>
                                                      :
                                                      <div>-</div>
                                                    }
                                                  </td>
                                              </tr>
                                          );
                                      })  
                                    :
                                      <tr>
                                          <td></td>
                                          <td></td>
                                          <td className ="nodata">Nothing To Dispaly</td>
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
export default AdminTicketDetailsContainer = withTracker(props => {
  var handleApprovedTicketList = Meteor.subscribe("allTickets");
  var handleUseFunc = Meteor.subscribe('userfunction');
  
  var date            = ""; 
  var datarole        = "";
  var dataroleStatus  = "";  
  var datamsg         = "";
  var allTicketList   = [];
  var withPerson        = "";

  const loading    =  !handleApprovedTicketList.ready() && !handleUseFunc.ready();
  var allTicketDetails = TicketMaster.find({}).fetch();


  if(allTicketDetails.length > 0){
    for(var i=0;i<allTicketDetails.length;i++){
        var showList = [];
        var ticketElemLength = allTicketDetails[i].ticketElement.length;          
        
        if(allTicketDetails[i].ticketElement.length >  0){
              var ticketElemLenght = allTicketDetails[i].ticketElement.length;
              var lastStatus = allTicketDetails[i].ticketElement[ticketElemLenght-1].roleStatus;                
              var date = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;
              switch(lastStatus){
                  case 'New':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "NewScrAllocated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Screening Committee";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Screening Committee";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['screening committee']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "System";
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'NewScrAllocated':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "NewScrAllocated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Screening Committee";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Screening Committee";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['screening committee']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Screeing Committee - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].allocatedToUserName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'ScreenApproved':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "screenTLAllocated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Leader";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Leader";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team leader']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "System";
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'screenTLAllocated':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "screenTLAllocated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Leader";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Leader";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team leader']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Leader - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].allocatedToUserName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'Assign':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "Assign";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].allocatedToUserName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'AssignAccept':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "AssignAccept";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'SelfAllocated':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "SelfAllocated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'ProofSubmit-Pending':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "ProofSubmit-Pending";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'ProofSubmit':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "ProofSubmit";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'ProofResubmitted':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "ProofResubmitted";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'VerificationPass':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "VerificationPass";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'TMReviewRemark':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "TMReviewRemark";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "System";
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'TMReviewSubRemark':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "TMReviewSubRemark";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'VerificationPassQTMAllocated':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "VerificationPassQTMAllocated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].allocatedToUserName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'QAPass':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "QAPass";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'QTMReviewRemark-GetUsrRemark':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "QTMReviewRemark-GetUsrRemark";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'QTMReviewRemark':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "QTMReviewRemark";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Member";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Member";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team member']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Member - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'ReportGenerated':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "ReportGenerated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Leader";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Leader";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team leader']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "System";
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'QAPassQTLAllocated':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "QAPassQTLAllocated";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Leader";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Leader";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team leader']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Leader - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].allocatedToUserName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'ReviewPass':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "ReviewPass";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Leader";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Leader";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team leader']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Leader - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'QTLReviewRemark':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "QTLReviewRemark";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Leader";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Leader";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team leader']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Leader - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'ReportReGenerated':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "QTLReviewRemark";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Quality Team Leader";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Quality Team Leader";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['quality team leader']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Quality Team Leader - "+ allTicketDetails[i].ticketElement[ticketElemLenght-1].userName;
                    allTicketList.push(allTicketDetails[i]);
                  break;
                  case 'TicketClosed':
                    allTicketDetails[i].datarole        = "Admin";
                    allTicketDetails[i].dataroleStatus  = "TicketClosed";
                    allTicketDetails[i].datamsg         = "Admin Allocated Ticket To Dispatch Team";
                    allTicketDetails[i].date            = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                    allTicketDetails[i].status          = "Dispatch Team";
                    allTicketDetails[i].showList        = Meteor.users.find({"roles": {$in:['dispatch team']},"profile.status":"Active"}).fetch();   
                    allTicketDetails[i].withPerson      = "Dispatch Team";
                    allTicketList.push(allTicketDetails[i]);
                  break;
              }
      } //EOF if
    }//EOF i loop
  }
  // console.log("allTicketList",allTicketList);
  return {
    loading,
    allTicketList,
    lastStatus
  };
})(AdminTicketDetails);