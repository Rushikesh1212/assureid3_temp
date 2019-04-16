import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

import { Order } from '/imports/admin/orderManagement/api/Order.js';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

import  ServiceInformation from '/imports/admin/caseManagement/component/caseDetails/ServiceInformation.jsx';
import VerifiedDocuments from '/imports/admin/caseManagement/component/caseDetails/VerifiedDocuments.jsx';
import VerificationDataSubmit from '/imports/admin/caseManagement/component/caseDetails/VerificationDataSubmit.jsx';
import VerifyDetailsDocument from '/imports/admin/caseManagement/component/caseDetails/VerifyDetailsDocument.jsx';
import { UserProfile } from '/imports/admin/userViewProfile/api/userProfile.js';
import { ChecklistFieldExpert } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import OrderGeneration          from '/imports/admin/orderManagement/component/OrderGeneration.jsx';
// import ReportGeneration from '/imports/admin/reportgeneration/components/ReportGeneration.jsx';


class OrderDetails extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      'userDetails': {},
      "userRoleIn": Meteor.userId(),
      "showRejectBox" : 'N',
      "radioState":'',
      "showRadiobtn": 'N',
      "verifiedInfo":[],
    }   
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.loading){
      this.setState({
        'userDetails':nextProps.user,
      });
    }   
  }
  viewprofile(event){
    event.preventDefault();
    var path = $(event.target).attr('data-userid');
    // 
    browserHistory.replace('/admin/viewProfile/'+path);
  }
  getRole(role) {
    return role != "backofficestaff";
  }
  generateOrder(event){
    event.preventDefault();
    var userId      = $(event.target).attr('data-userid'); 
    var candidateId = $(event.target).attr('data-candidateId'); 
    
  //  
    Meteor.call("orderCompleted",this.props.orderId,candidateId);
    var path = '/orderGeneration/'+this.props.orderId+"-"+this.props.candidateId;
        window.open(path);
  }
  showOrderReport(event){
    event.preventDefault();

    var path = '/orderGeneration/'+this.props.orderId+"-"+this.props.candidateId;
    
    
    // var path = '/orderGeneration';
        window.open(path);
  }
  orderUpdate(event){
    event.preventDefault();
    var orderId             = this.props.orderId;
    var genratedReport      = '/orderGeneration/'+this.props.orderId+"-"+this.props.candidateId;
    var genratedReportDate  = new Date();
    var candidateId = $(event.target).attr('data-candidateId'); 
    // 
    Meteor.call("updateOrderGenrationlink",orderId,genratedReport,genratedReportDate,candidateId,function(error,result) {
      if (error) {
        
      }else{
        
        var adminData   = Meteor.users.findOne({'roles' : "admin"});
        if (adminData) {
          var adminId  = adminData._id;
        }
        var order      = Order.findOne({"_id" : orderId});
        if (order) {
          var userid   = order.userId;
          var userData = Meteor.users.findOne({"_id" : userid});
           if (userData) {
            var newID = userData._id;
            if (userData.profile) {
              var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
              var assureId    = userData.profile.assureId;
              var mobNumber   = userData.profile.mobNumber;
            }
          }
          var orderNo     = order.orderNo;
          var newDate     = new Date();
          var msgvariable = {                       
                            '[username]' : firstLastNm+"("+assureId+") ",
                            '[orderNo]'  : orderNo,
                            '[date]'     : moment(newDate).format("DD/MM/YYYY"),
                           };
            // Format for send Email //
            var inputObj = {
              from         : adminId,
              to           : newID,
              templateName : 'OrderCompleted',
              variables    : msgvariable,
            }
            sendMailNotification(inputObj);
          
            // Format for sending SMS //
            var smsObj = {
              to           : newID,
              templateName : 'OrderCompleted',
              number       : mobNumber,
              variables    : msgvariable,
            }
            // 
            sendSMS(smsObj);

            // Format for sending notification //
            var notifictaionObj = {
              to           : newID,
              templateName : 'OrderCompleted',
              variables    : msgvariable,
          }
            sendInAppNotification(notifictaionObj);

        } 
       
      }
    });
  } 
  render(){
      if(!this.props.loading){
        return(           
          <div>
            <div className="content-wrapper">
              <section className="content">
                <div className="row">
                  <div className="col-md-12">
                    <div className="box">
                      <div className="box-header with-border">
                        <h2 className="box-title">Order</h2>
                      </div>
                      <div className="box-body">
                         <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="ticketHeader col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                              <div className="ticketBorder col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="assureidLogo" />
                                </div>
                              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-right outerTicketIcons">
                                  <i className="fa fa-print ticketIcons" title="Print"></i> 
                                  <i className="fa fa-file-pdf-o ticketIcons"  title="PDF"></i>
                                  <i className="fa fa-download ticketIcons" title="Download"></i>
                              </div>
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              {
                                this.props.orderDetails.serviceDetails ?
                                  <h3 className="ticketheadStyle col-lg-12">{this.props.orderDetails.serviceDetails.serviceName}/{this.props.orderDetails.orderNo}</h3>
                                :
                                  <h3 className="ticketheadStyle col-lg-12">{this.props.orderDetails.packageDetails.packageName}/{this.props.orderDetails.orderNo}</h3>
                              }
                            </div>
                            <div className="ticketPills col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLRPad">
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                  { this.props.userProfile.userProfile ?
                                    <img src={this.props.userProfile.userProfile } className="ticketUserImage" /> :
                                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/userIcon.png" className="ticketUserImage" />
                                  }
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight assureidValue">
                                      <button type="button" className="btn viewbtn" data-userid={this.props.user._id} onClick= {this.viewprofile.bind(this)}>View Profile</button>
                                  </div>
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left userName">
                                      <h5>{this.props.userProfile.firstName} {this.props.userProfile.lastName}</h5>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left  userLabel">
                                    Assure ID <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                      <p>&nbsp;{this.props.userProfile.assureId ? this.props.userProfile.assureId : "-"}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                   Mobile <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    {/* <p>{this.state.userDetails.emails[0].address}</p> */}
                                      <p>{this.props.userProfile.mobileNo ? "+91"+this.props.userProfile.mobileNo : "-"}</p>
                                    </div>
                                  </div>

                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                    Email Id <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                      <p>{this.props.userProfile.emailId ? this.props.userProfile.emailId : "-"}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                    Age<span className="pull-right">:</span>
                                    </div> 
                                     <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                      <p>{this.props.userProfile.dateOfBirth!="-" ? this.props.userProfile.dateOfBirth +" Years" : "-"}</p>
                                      
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                    Gender <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                      <p className="genName">{this.props.userProfile.gender ? this.props.userProfile.gender : ""}</p>
                                    </div>
                                  </div>
                                
                                </div>
                           </div>
                           <div className="col-lg-6">
                             <ServiceInformation ticketId={this.props.parameter}/>
                           </div>
                           {/*Show all the tickets*/}
                          </div>
                          <div id="SubmittedDocuments" >
                             {this.props.orderDetails ?
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outeReportBlock">
                                    <h6 className="dataDetails col-lg-3 col-md-3 col-sm-1 col-xs-1">Order Process Summary</h6> 
                                      <table id="subscriber-list-outerTable" className="newOrderwrap subscriber-list-outerTable table table-bordered table-hover table-striped table-striped table-responsive table-condensed table-bordered">
                                        <thead className="table-head umtblhdr">
                                        <tr className="hrTableHeader UML-TableTr noLRPad col-lg-12">
                                            <th className="col-lg-1"> Order No.</th>
                                            <th className="col-lg-2"> User Name</th>
                                            <th className="col-lg-2"> Service Purchased </th>
                                            <th className="col-lg-2"> Order Date </th>
                                            <th className="col-lg-1"> Completion Date </th>
                                            <th className="col-lg-1"> Final Status </th>                          
                                        </tr>
                                        </thead>
                                        <tbody>
                                          {
                                            this.props.verificationData  ?
                                                <tr className="tableDatabottom noLRPad col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <td className="col-lg-1">{this.props.verificationData.orderNo}</td>
                                                    <td className="col-lg-2 noLRPad">{this.props.verificationData.userName}</td>
                                                    <td className="col-lg-2">{this.props.verificationData.serviceName}</td>
                                                    <td className="col-lg-2">{moment(this.props.orderDetails.createdAt).format('DD MMM YYYY')}</td>
                                                    <td className="col-lg-1">{moment(this.props.verificationData.completionDate).format('DD MMM YYYY')}</td> 
                                                    <td className="col-lg-1">{this.props.verificationData.finalStatus}</td>
                                                </tr>
                                            :
                                              null
                                          }
                                        </tbody>
                                      </table> 
                                      {/*Code for Generate Consolidated Report Button*/}
                                      {
                                        this.props.verificationData.candidateVerificationStatus == 'Order Completed - Generating Report' ?
                                          <div className="col-lg-6 col-lg-offset-3 outerGenrateOrder">
                                            <button type="button" className="btn btn-success col-lg-6 col-lg-offset-3" data-candidateId ={this.props.verificationData.candidateId} data-userid ={this.props.orderDetails.userId} onClick={this.generateOrder.bind(this)}>Generate Consolidated Report</button>
                                            <div className="progress col-lg-12">                      
                                              {/*<div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width:100+'%'}}>                      
                                              </div>*/}                    
                                            </div>
                                          </div>  
                                        :
                                          this.props.verificationData.candidateVerificationStatus == 'Order Completed - Report Completed' ?
                                            <div className="col-lg-8 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12 outerViewPublish">
                                              <div className="col-lg-5 outerGenrateOrder text-right">
                                                <i className="fa fa-file-pdf-o orderprocessIcons" title="Download PDF" onClick={this.showOrderReport.bind(this)}></i>
                                              </div>
                                              <div className="col-lg-7 col-lg-offset-3 outerGenrateOrder">
                                                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 viewTitle" onClick={this.showOrderReport.bind(this)}>View</span>
                                                {
                                                    <button className="btn btn-success publishTitle" data-candidateId ={this.props.verificationData.candidateId} onClick={this.orderUpdate.bind(this)}>Publish to user</button>
                                                }
                                              </div>
                                            </div>
                                          :
                                            this.props.verificationData.candidateVerificationStatus == 'Completed' ?
                                              <div className="col-lg-8 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12 outerViewPublish">
                                                <div className="col-lg-12 outerGenrateOrder text-right">
                                                  <i className="fa fa-file-pdf-o orderprocessIcons" title="Download PDF" onClick={this.showOrderReport.bind(this)}></i>
                                                </div>
                                                <div className="col-lg-7 col-lg-offset-0 outerGenrateOrder">
                                                  <span className="btn-success publishTitle" >Published on {moment(this.props.verificationData.genratedReportDate).format('DD-MM-YYYY')}</span>
                                                </div>
                                              </div>
                                          :   
                                            null
                                      }
                                       
                                  </div>   
                                </div>                       
                                :
                                null
                              }
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
      }else{
        return(<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noData"> No Data Available</div>);
      }

     }
  }

export default UserDetailsContainer = withTracker(props => {
  var parameter    = FlowRouter.getParam("id");  
  console.log('parameter: ', parameter);
  var handleSinTick = Meteor.subscribe("singleOrder",parameter);
  var handleUseFunc = Meteor.subscribe('userfunction');
  var handleUserProfile = Meteor.subscribe("userProfileData");
  var handleTicket = Meteor.subscribe("allTickets");
  // var parameter    = props.params.id;
  var splitParam   = parameter.split('-');
  var orderId      = splitParam[0];
  var candidateId  = splitParam[1];
  
  var loading = !handleSinTick.ready() && !handleUseFunc.ready() && !handleUserProfile.ready() && !handleTicket.ready();
  var orderDetails = Order.findOne({"_id":orderId,"candidateDetails.candidateId":candidateId});

  
  if(orderDetails){
      var index = orderDetails.candidateDetails.findIndex(x=> x.candidateId == candidateId);
      if(index >=0){
        var verificationData1 = orderDetails.candidateDetails[index];
        
        
        var verificationData = {
          "orderNo"                       : orderDetails.orderNo + ':'+ verificationData1.candidateAssureID,
          "userName"                      : verificationData1.candidateFirstName + ' ' + verificationData1.candidateLastName,
          // "ServiceName" : 
          "OrderDate"                     : orderDetails.createdAt,
          "completionDate"                : orderDetails.completedDate,
          "finalStatus"                   : orderDetails.orderStatus,
          "candidateVerificationStatus"   : verificationData1.candidateVerificationStatus, 
          "candidateId"                   : verificationData1.candidateId,
          "genratedReportDate"            : verificationData1.genratedReportDate,
        };
        if(orderDetails.serviceDetails){
          verificationData.serviceName = orderDetails.serviceDetails.serviceName;
        }else{
          verificationData.serviceName = orderDetails.packageDetails.packageName;
        }
      }

    //user Details
    var user = Meteor.users.findOne({"_id": candidateId}) || {};
    if(user){
      var userProfile = UserProfile.findOne({"userId": candidateId}) || {};
      if(userProfile.dateOfBirth){
        var today = new Date();
        var birthDate = new Date(userProfile.dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
            age--;
        }
        userProfile.dateOfBirth=age;
      }else{
        userProfile.dateOfBirth='-';
      }
    }
    //Ticket Details
    // if(orderDetails.candidateDetails){
    //   for(var i=0;i<orderDetails.candidateDetails.length;i++){
    //       if(orderDetails.candidateDetails[i].verificationData && orderDetails.candidateDetails[i].verificationData.length>0){
    //         for(j = 0 ; j < orderDetails.candidateDetails[i].verificationData.length; j++){
    //           var ticketDetail = TicketMaster.findOne({"_id":orderDetails.candidateDetails[i].verificationData[j].ticketDetails.ticketId});
              
    //           if(ticketDetail){
    //             orderDetails.candidateDetails[i].verificationData[j].ticketDetails.ticketNumber  = ticketDetail.ticketNumber;
    //             var verificationType = ticketDetail.verificationType;
    //             if (verificationType == "professionalEducation") {
    //               var vt = "Academic Verification";
    //             }else if (verificationType == "permanentAddress") {
    //               var vt = "Address Verification";
    //             }else if (verificationType == "currentAddress") {
    //               var vt = "Address Verification";
    //             }else if (verificationType == "employement") {
    //               var vt = "Employment Verification";
    //             }else if (verificationType == "education") {
    //               var vt = "Academic Verification";
    //             }else  if (verificationType == "certificates") {
    //               var vt = "Skills And Certification Verification";
    //             }
    //             orderDetails.candidateDetails[i].verificationData[j].verificationType = vt;
    //             orderDetails.candidateDetails[i].verificationData[j].createdAt        = ticketDetail.createdAt;
    //           }

    //         }
    //       }
    //   }
    // }
    // var buttonStatus = orderDetails.orderStatus;
  } 
  console.log("verificationData :",verificationData);  
  return {
    loading,
    orderDetails,
    user,
    userProfile,
    orderId,
    verificationData,
    candidateId,
    parameter
  };
})(OrderDetails);
