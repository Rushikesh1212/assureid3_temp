import React,{Component}  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';
import { TicketMaster } from '/imports/AssureID/userPortal/api/TicketMaster.js';

class TicketReports extends TrackerReact(Component){
	constructor(props){
    super(props);
    this.state ={
      }
  }
  componentDidMount(){
    $('html, body').scrollTop(0);
  }

  showData(verificationType,verificationData,ticketDetails){
    switch(verificationType){
      case 'permanentAddress' :
        return(
          <div className="col-lg-12 col-md-12 showAddrWrap">
            <div className="col-lg-6 col-md-6 text-left noPadLeftRight">
              <h4><b>Permanent Address</b></h4>
            </div>
            <div className="col-lg-6 col-md-6 text-right noPadLeftRight">
               <p><b>Status :</b> {ticketDetails.status}</p>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerverificationInfo">
              {verificationData.line1 ? verificationData.line1 : ''}, {verificationData.line2 ? verificationData.line2 : ''},
              {verificationData.line3 ? verificationData.line3 : ''}, {verificationData.landmark ? verificationData.landmark : ''},
              {verificationData.city ? verificationData.city+',' : ''}&nbsp;
              {verificationData.state ? verificationData.state+',' : ''}&nbsp;
              {verificationData.Country ? verificationData.Country+',' : ''}&nbsp;
              {verificationData.pincode ? verificationData.pincode+',' : ''}<br />
              <label><b>Residing From :</b> </label>{verificationData.residingFrom} <label><b>Residing Till :</b> </label>{verificationData.residingTo}
            </div>
            {
               ticketDetails.report?
                 <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerdownloadReportButton ">
                    <a href={ticketDetails.report} target="_blank"> <i className="fa fa-file-text-o downloadReportButton pull-right" aria-hidden="true"></i></a>
                </div>
               :
               null
            }
            
          </div>
        );
        break;
      case 'currentAddress' :
        return(
          <div className="col-lg-12 col-md-12 showAddrWrap">            
            <div className="col-lg-6 col-md-6 text-left noPadLeftRight">
              <h4><b>Current Address</b></h4>
            </div>
            <div className="col-lg-6 col-md-6 text-right noPadLeftRight">
               <p><b>Status :</b> {ticketDetails.status}</p>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerverificationInfo">
              {verificationData.tempLine1 ? verificationData.tempLine1 : ''}, {verificationData.tempLine2 ? verificationData.tempLine2 : ''},
              {verificationData.tempLine3 ? verificationData.tempLine3 : ''}, {verificationData.tempLandmark ? verificationData.temLandmark : ''},
              {verificationData.tempCity ? verificationData.tempCity+',' : ''}&nbsp;
              {verificationData.tempState ? verificationData.tempState+',' : ''}&nbsp;
              {verificationData.tempCountry ? verificationData.tempCountry+',' : ''}&nbsp;
              {verificationData.tempPincode ? verificationData.tempPincode+',' : ''}<br />
              <label><b>Residing From :</b> </label>{verificationData.tempresidingFrom} <label><b>Residing Till :</b> </label>{verificationData.tempresidingTo}
            </div>
            {
               ticketDetails.report?
                 <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerdownloadReportButton ">
                    <a href={ticketDetails.report} target="_blank"> <i className="fa fa-file-text-o downloadReportButton pull-right" aria-hidden="true"></i></a>
                </div>
               :
               null
            }
          </div>
        );
        break;
      case 'employement' :
        return(
          <div className="col-lg-12 col-md-12 showAddrWrap">
            <div className="col-lg-6 col-md-6 text-left noPadLeftRight">
              <h4><b>Employment Information</b></h4>
            </div>
            <div className="col-lg-6 col-md-6 text-right noPadLeftRight">
               <p><b>Status :</b> {ticketDetails.status}</p>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerverificationInfo">
              <label><b>Employer :</b> </label> {verificationData.nameOfEmployer ? verificationData.nameOfEmployer : "-"},<br />
              <label><b>Address :</b> </label> {verificationData.employerAddress ? verificationData.employerAddress : "-"},<br />
              <label><b>Contact No. :</b> </label> {verificationData.contactNo ? verificationData.contactNo : "-"},<br />
              <label><b>Employee Id :</b> </label> {verificationData.employeeCode ? verificationData.employeeCode : "-"},<br />
              <label><b>Designation :</b> </label> {verificationData.designation ? verificationData.designation : "-"},<br />
              <label><b>Department :</b> </label> {verificationData.department ? verificationData.department : " - "},<br />
              <label><b>Employment From :</b> </label> {verificationData.employmentFrom ? verificationData.employmentFrom : "-"},<br />
              <label><b>Employment To :</b> </label> {verificationData.employmentTo ? verificationData.employmentTo : "-"},<br />
              <label><b>Type Of Employement :</b> </label> {verificationData.typeOfEmployement ? verificationData.typeOfEmployement : "-"},<br /> 
              <label><b>Duties And Responsibilites :</b> </label> {verificationData.dutiesAndResponsibilites ? verificationData.dutiesAndResponsibilites : "-"},<br />
              <label><b>Reporting Manager :</b> </label> {verificationData.reportingManagerNm ? verificationData.reportingManagerNm : "-"},<br />
              <label><b>Previous Designation :</b> </label> {verificationData.prevDesignation ? verificationData.prevDesignation : "-"}
            </div>
           {
               ticketDetails.report?
                 <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerdownloadReportButton ">
                    <a href={ticketDetails.report} target="_blank"> <i className="fa fa-file-text-o pull-right downloadReportButton" aria-hidden="true"></i></a>
                </div>
               :
               null
            }
          </div>
        );
        break;
      case 'certificates' :
        return(
          <div className="col-lg-12 col-md-12 showAddrWrap">
            <div className="col-lg-6 col-md-6 text-left noPadLeftRight">
              <h4><b>Certificate Details</b></h4>
            </div>
            <div className="col-lg-6 col-md-6 text-right noPadLeftRight">
               <p><b>Status :</b> {ticketDetails.status}</p>
            </div>
             <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerverificationInfo">
              {this.props.verificationData[index].certificateName},
              {this.props.verificationData[index].issuedBy}<br />
              {this.props.verificationData[index].certificatedOn},
              {this.props.verificationData[index].validTill}
            </div>
            {
               ticketDetails.report?
                 <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerdownloadReportButton ">
                    <a href={ticketDetails.report} target="_blank"> <i className="fa fa-file-text-o downloadReportButton pull-right" aria-hidden="true"></i></a>
                </div>
               :
               null
            }
          </div>
        );
        break;
      case 'professionalEducation' :
        return(
          <div className="col-lg-12 col-md-12 showAddrWrap">
           <div className="col-lg-6 col-md-6 text-left noPadLeftRight">
              <h4><b>Professional Education</b></h4>
            </div>
            <div className="col-lg-6 col-md-6 text-right noPadLeftRight">
               <p><b>Status :</b> {ticketDetails.status}</p>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerverificationInfo">
              {verificationData.professionalQualification},<br />
              {verificationData.registrationNo},<br />
              {verificationData.dateOfQualification},<br />
              {verificationData.professionalRollNo},<br />
              {verificationData.qualifyingBodyNm}
            </div>
           {
               ticketDetails.report?
                 <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerdownloadReportButton ">
                    <a href={ticketDetails.report} target="_blank"> <i className="fa fa-file-text-o downloadReportButton pull-right" aria-hidden="true"></i></a>
                </div>
               :
               null
            }
          </div>
        );
        break;
      case 'education' :
        return(
          <div className="col-lg-12 col-md-12 showAddrWrap">           
            <div className="col-lg-6 col-md-6 text-left noPadLeftRight">
              <h4><b>Academics Information</b></h4>
            </div>
            <div className="col-lg-6 col-md-6 text-right noPadLeftRight">
               <p><b>Status :</b> {ticketDetails.status}</p>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noPadLeftRight outerverificationInfo">
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	              {verificationData.educationLevel},
	              {verificationData.educationQualification}
	            </div>
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	              {verificationData.specialization},
	              {verificationData.grades}
	            </div>
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	              {verificationData.educationMode},
	              {verificationData.dateAttendedTo},
	              {verificationData.collegeName},
	              {verificationData.university},<br />
	              {verificationData.collegeAddress} {verificationData.rollNo}
	            </div>
            </div>
             {
               ticketDetails.report?
                 <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerdownloadReportButton ">
                    <a href={ticketDetails.report} target="_blank"> <i className="fa fa-file-text-o downloadReportButton pull-right" aria-hidden="true"></i></a>
                </div>
               :
               null
            }
          </div>
        );
      break;

      case 'Identity' :
        return(
          <div className="col-lg-12 col-md-12 showAddrWrap">           
            <div className="col-lg-6 col-md-6 text-left noPadLeftRight">
              <h4><b>Identity Information</b></h4>
            </div>
            <div className="col-lg-6 col-md-6 text-right noPadLeftRight">
               <p><b>Status :</b> {ticketDetails.status}</p>
            </div>
            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noPadLeftRight outerverificationInfo">
	            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <label><b>{verificationData.identityType} :</b> </label>{verificationData.cardNo}<br />
	            </div>
            </div>
             {
               ticketDetails.report?
                 <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerdownloadReportButton ">
                    <a href={ticketDetails.report} target="_blank"> <i className="fa fa-file-text-o downloadReportButton pull-right" aria-hidden="true"></i></a>
                </div>
               :
               null
            }
          </div>
        );
      break;
    }
  }

  render(){
  	if (!this.props.loading) {
  			return(
	  	  <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-1">
	        <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
	          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	            <h1 className="text-center headerinvoice">Your Verification Reports</h1>
                <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 noPadLeftRight orderInfo">
	                <span className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-left noPadLeftRight"><span className=""><b>Order Number :</b></span><span> {this.props.orderDetails.orderNo}</span></span>
	                <span className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right noPadLeftRight"><span><b>Order Date :</b></span><span> {moment(this.props.orderDetails.createdAt).format("DD/MM/YYYY")}</span></span>
	              </div>
	             { this.props.approvedTicket ?
		             	this.props.approvedTicket.length > 0 ?
		             	  this.props.approvedTicket.map((approvedTicket,index)=>{
                       return(
                       	 <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerReportBlock" key={index}>
                            {this.showData(approvedTicket.verificationType,approvedTicket,approvedTicket.ticketDetails)}
	                       </div>
                       	);
		             	  })
                  :
                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerReportBlock">
                    <p>Verification is in process!</p>
                  </div>
	              :
                <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerReportBlock" >
                    <p>Verification is in process!</p>
                  </div>
	             }
               
	          </div>
	        </div>
	  	  </div>
	  	);
  	}else{
  		return(
  			<span>Loading</span>
  			);
  	} 
  	
  }
}
TicketReportsContainer = withTracker(({params}) => {
    var _id  = FlowRouter.getParam('id');
    // console.log("_id",_id);
    const postHandle        = Meteor.subscribe('singleOrder',_id);
    // const ticketpostHandle  = Meteor.subscribe('allTickets');
    var orderDetails        = Order.findOne({"_id": _id})|| {};
    // console.log("orderDetails",orderDetails);
    var approvedTicket = [];
    if (orderDetails) { 
      // if (orderDetails.orderStatus == "Order Completed - Report Completed" || orderDetails.orderStatus == "Order Completed - Generating Report" ||  orderDetails.orderStatus == "In Process"){
         // if (orderDetails.ticket) {
         //   for (var i = 0; i < orderDetails.ticket.length; i++) {
         //      var ticket = TicketMaster.findOne({"_id" : orderDetails.ticket[i].ticketId});
         //      approvedTicket.push(ticket);
         //   }
         // }
         if (orderDetails.candidateDetails) {
           for (var i = 0; i < orderDetails.candidateDetails.length; i++) {
              if (orderDetails.candidateDetails[i].candidateVerificationStatus == "Order Completed - Report Completed" || orderDetails.candidateDetails[i].candidateVerificationStatus == "Order Completed - Generating Report" ||  orderDetails.candidateDetails[i].candidateVerificationStatus == "In Process"){
                if (Meteor.userId() == orderDetails.candidateDetails[i].candidateId) {
                  // console.log("orderDetails.candidateDetails[i]",orderDetails.candidateDetails[i]);
                  var matchedCandidate = orderDetails.candidateDetails[i];
                } 
             }
            if (matchedCandidate) {
              if (matchedCandidate.verificationData) {
                for (var j = 0; j < matchedCandidate.verificationData.length; j++) {
                  approvedTicket.push(matchedCandidate.verificationData[j]);
                }
              }
            }
         }
         
      }
    	
    }
    // console.log("approvedTicket",approvedTicket);
    const loading       = !postHandle.ready();
    // if(_id){
      return {
          loading,
          orderDetails,
          approvedTicket
      };
    // }
})(TicketReports);

export default TicketReportsContainer;