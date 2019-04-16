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

class AdminTicketDetails extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      'userDetails': {},
      "userRoleIn": Meteor.userId(),
    }
  }

  showUserList(role){
    var teammemberDetails = Meteor.users.find({"roles": {$in:[role]},}).fetch();
    return teammemberDetails;
  }
  getRole(role) {
    return role != "backofficestaff";
  }
  assignTicket(event){
    event.preventDefault();
    
    var selectedValue = $(".selectTMMember option:selected").val();
    var checkedUsersList     = [];     
    var ticketid = $(event.currentTarget).attr('data-tickteId');  
    var insertData = {
      "userId"              : "",
      "userName"            : "",
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
    if(selectedValue!=""){
      Meteor.call('genericUpdateTicketMasterElement',ticketid,insertData,(res,err)=>{
        if(err){
          console.log("Error :",err);
          // console.log("AdminTicket file error in genericUpdateTicketMasterElement return methos :",err);
        }

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
                                    {/* <th className=""> Aging &nbsp;( In Days ) </th>                                           */}
                                    <th className=""> Status </th>
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
                                                  {/* <td><a href={"/admin/ticket/"+data._id}>{moment(data.date).format('DD MMM YYYY')}</a></td> */}
                                                  <td className="tmDropList"><a href={"/admin/ticket/"+data._id} className="orderticketbg">{data.status}</a></td>
                                                  <td>
                                                    
                                                    {
                                                      
                                                      data.showList.length > 0 ?
                                                          <div className="col-lg-12">
                                                          <select className="col-lg-6 col-md-6 col-sm-4 col-xs-5 tmDropList tmListWrap" id={"selectTMMember"+data._id} ref="userListDropdown" name="userListDropdown"> 
                                                          <option>--Select--</option>
                                                          {
                                                               data.showList.map((data,i)=>{
                                                                return(
                                                                <option key={i} value={data._id} >
                                                                    {data.profile.firstname + ' ' + data.profile.lastname}&nbsp; 
                                                                    ({data.count ? data.count : 0})
                                                                  </option>
                                                                );
                                                              })
                                                          }
                                                          </select>

                                                          <button type="button" className="btn btn-primary tmDropList col-lg-5 col-md-5 col-sm-6 col-xs-6"  data-tickteId={data._id} data-role={data.datarole} data-roleStatus={data.dataroleStatus} data-msg={data.datamsg} onClick={this.assignTicket.bind(this)}>Allocate</button>
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

  const loading    =  !handleApprovedTicketList.ready() && !handleUseFunc.ready();
  var allTicketDetails = TicketMaster.find({}).fetch();
  // 

  


  if(allTicketDetails.length > 0){
      for(var i=0;i<allTicketDetails.length;i++){
          var showList = [];
          var ticketElemLength = allTicketDetails[i].ticketElement.length;          
          
          if(allTicketDetails[i].ticketElement.length >  0){
            // for(var j=0;j<allTicketDetails[i].ticketElement.length;j++){
               

                var ticketElemLenght = allTicketDetails[i].ticketElement.length;
                var lastStatus = allTicketDetails[i].ticketElement[ticketElemLenght-1].roleStatus;
                
                var date = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;
              
                
                switch(lastStatus){

                    case 'New':

                      datarole       = "system action";
                      dataroleStatus = "NewScrAllocated";
                      datamsg        = "System Allocated Ticket To Screening Committee";
                      date           = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                      status         = "Allocate to screening committee";
                      showList       = Meteor.users.find({"roles": {$in:['screening committee']},}).fetch();   
                      allTicketDetails[i].showList       = showList;
                      allTicketDetails[i].datarole       = datarole;
                      allTicketDetails[i].dataroleStatus = dataroleStatus;
                      allTicketDetails[i].datamsg        = datamsg;
                      allTicketDetails[i].date           = date;
                      allTicketDetails[i].status         = status;
                      allTicketList.push(allTicketDetails[i]);
                    break;

                
                    case 'ScreenApproved':
                        // showList = this.showUserList('team leader');
                        datarole       = "system action";
                        dataroleStatus = "screenTLAllocated";
                        datamsg        = "System Allocated Ticket To Team Leader";
                        date           = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                        status         = "Allocate to team leader";
                        showList       = Meteor.users.find({"roles": {$in:['team leader']},}).fetch();   
                        allTicketDetails[i].showList       = showList;
                        allTicketDetails[i].datarole       = datarole;
                        allTicketDetails[i].dataroleStatus = dataroleStatus;
                        allTicketDetails[i].datamsg        = datamsg;
                        allTicketDetails[i].date           = date;
                        allTicketDetails[i].status         = status;
                        allTicketList.push(allTicketDetails[i]);
                    break;

                    case 'screenTLAllocated':
                        datarole       = "Team Leader";
                        dataroleStatus = "Assign";
                        datamsg        = "Assigned Ticket To Team Member";
                        date           = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                        
                        status         = "Allocate to team member" ;                       
                        showList       = Meteor.users.find({"roles": {$in:['team member']},}).fetch();     
                        // allTicketList  = allTicketDetails[i];
                        allTicketDetails[i].showList       = showList;
                        allTicketDetails[i].datarole       = datarole;
                        allTicketDetails[i].dataroleStatus = dataroleStatus;
                        allTicketDetails[i].datamsg        = datamsg;
                        allTicketDetails[i].date           = date;
                        allTicketDetails[i].status         = status;
            
            
                        allTicketList.push(allTicketDetails[i]);
                        
                        
                    break;

                    case 'TMReviewRemark':
                        datarole       = "system action";
                        dataroleStatus = "VerificationPassQTMAllocated";
                        datamsg        = "System Allocated Ticket To Quality Team Member";
                        date           = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;
                        status         = "Allocate to quality team member";                        
                        showList       = Meteor.users.find({"roles": {$in:['quality team member']},}).fetch();                         
                        // allTicketList  = allTicketDetails[i];
                        allTicketDetails[i].showList       = showList;
                        allTicketDetails[i].datarole       = datarole;
                        allTicketDetails[i].dataroleStatus = dataroleStatus;
                        allTicketDetails[i].datamsg        = datamsg;
                        allTicketDetails[i].date           = date;
                        allTicketDetails[i].status         = status;
            
            
                        allTicketList.push(allTicketDetails[i]);
                        
                        
                        // showUserList('quality team member');
                    break;

                    case 'ReportGenerated':
                        datarole       = "system action";
                        dataroleStatus = "QAPassQTLAllocated";
                        datamsg        = "System Allocated Ticket To Quality Team Leader";
                        date           = allTicketDetails[i].ticketElement[ticketElemLenght-1].createdAt;                                                
                        status         = "Allocate to quality team leader";                                                
                        showList       = Meteor.users.find({"roles": {$in:['quality team leader']},}).fetch();                                             
                        allTicketDetails[i].showList       = showList;
                        allTicketDetails[i].datarole       = datarole;
                        allTicketDetails[i].dataroleStatus = dataroleStatus;
                        allTicketDetails[i].datamsg        = datamsg;
                        allTicketDetails[i].date           = date;
                        allTicketDetails[i].status         = status;
                        allTicketList.push(allTicketDetails[i]);
                    break;

                    default : 
                        datarole       = "";
                        dataroleStatus = "";
                        datamsg        = "";
                        date           = "";
                        status         = "";                                                
                        showList       = "";                                            

                    break;

                    
                }
            // }


        } //EOF if
      }//EOF i loop
  }
  return {
    loading,
    allTicketList,
    lastStatus

  };
})(AdminTicketDetails);