import React,{Component} from 'react';
import {render} from 'react-dom'; 
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'; 
import {Order} from '/imports/AssureID/company/newRequest/api/Order.js';
import {TicketMaster} from '/imports/AssureID/company/newRequest/api/TicketMaster.js';
require('moment-weekday-calc');

class CandidateOrderList extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      candidateDetails : {},
      "subscription" : {
      } 
    }
  } 

  // componentDidMount(){

  //   var serviceId = FlowRouter.getParam("serviceid");
  //   console.log("serviceId :",serviceId);
  //   var contractId = 0;
  //   var value = {};

  //   Meteor.call("getCandidateOrderList",this.props.assureId,serviceId,contractId,
  //     (error,result)=>{
  //       if(error){
  //         console.log('getCandidateOrderList call error ',error);
  //       }else{
  //         console.log('getCandidateOrderList call result',result);
  //         value.serviceName = result.serviceName;
  //         value.candidateList = result.candidateList;
  //         this.setState({
  //           'candidateDetails':value
  //         });
  //         // return value;
  //       }
  //   });
  // }


  render() {
    
    // console.log('serviceName ',candidates.serviceName , ' candidateList ',candidates.candidateList);
    if (!this.props.loading) {
      return (
       <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerServicesBlock"> 
            <table className="table empVerifListTable table-striped table-bordered">
              <thead>
                <tr className="" >
                  <th className="text-center ">Sr. No.</th>
                  <th className="text-center ">AssureID</th>
                  <th className="text-center ">Employee Details</th>
                  <th className="text-center ">{this.props.serviceName}</th>
                  <th className="text-center ">Document Attachment</th>
                  <th className="text-center ">Status</th>
                  <th className="text-center ">Report</th>
                </tr>
              </thead>
              <tbody>
                {  
                  this.props.candidateList && this.props.candidateList.length > 0 ?
                    this.props.candidateList.map((candidate, index)=>{
                      return(
                        <tr key={index} className="">
                          <td className="text-left">
                            {index + 1}
                          </td>
                          <td className="text-left">
                            {candidate.candidateAssureID}
                          </td>
                          <td className="text-left">
                            {candidate.candidateName}<br />
                            {candidate.candidateEmailId}<br />
                            {candidate.candidateMobile}<br />
                            {candidate.candidateAadharNo} 
                          </td>
                          <td className="text-left">
                           {candidate.verificationData.line1}<br />
                           {candidate.verificationData.line2}<br />
                           {candidate.verificationData.line3}<br />
                          </td> 
                          <td className="text-left">
                           {  candidate.verificationDocument ?
                                candidate.verificationDocument.length > 0 ?
                                  candidate.verificationDocument.map((documents,l)=>{
                                    return(
                                      <div className="col-lg-10" key={l}>
                                        <img src={documents} className="img img-responsive profileStatusServiceImage"/>
                                      </div>
                                    )
                                  })
                                :
                                  <div className="col-lg-10">
                                    <p>No Document Attached.</p>
                                  </div>
                              :
                                <div className="col-lg-10">
                                    <p>No Document Attached.</p>
                                </div>
                            }
                          </td>
                          <td className="text-left">
                            <div className="verificationDataOuter">
                              <div className={candidate.verificationStatusBGColor}>
                                <p>{candidate.verificationDataStatus}</p>
                              </div>
                            </div>
                          </td>                           
                          <td className="">
                           {candidate.report != '-' ? 
                              <div className="col-lg-10">
                                <img src={documents} className="img img-responsive profileStatusServiceImage"/>
                              </div>
                              :
                                <div>
                                  <p>-</p>
                                </div>
                           }
                          </td>
                        </tr>                        
                      );
                    })
                    :
                    <tr>
                      <td></td>
                      <td></td>                      
                      <td></td>
                      <td>No Data Available</td>
                      <td></td>
                      <td></td>
                      <td></td>

                    </tr>
                  
                } 
              </tbody>
            </table>
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

CandidateOrderListContainer = withTracker(props => {
  var serviceId = FlowRouter.getParam("serviceid");
  const postHandle     = Meteor.subscribe('matchedcompanyOrders',props.assureId,serviceId);
  const loading        = !postHandle.ready();
  var candidateList = [];
  var serviceName = '';
  var displayArrayMsg = [
        {
          roleStatus : 'New',
          role     : 'data entry operator',
          displayMsg : 'Case Initiated',
          bgColor    : 'blockwrap1 bgOrange', 
        },
        {
          roleStatus : 'NewScrAllocated',
          role     : 'system action',
          displayMsg : 'Case Initiated',
          bgColor    : 'blockwrap1 bgOrange', 
        },
        {
          roleStatus : 'ScreenApproved',
          role     : 'screening committee',
          displayMsg : 'Case Initiated',
          bgColor    : 'blockwrap1 bgOrange', 
        },
        {
          roleStatus : 'screenTLAllocated',
          role     : 'system action',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'Assign',
          role     : 'team leader',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'AssignReject',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ReAssign',
          role     : 'team leader',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'AssignAccept',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'SelfAllocated',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'FEAllocated',
          role     : 'field expert',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'BAAllocated',
          role     : 'ba',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ProofSubmit-Pending',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ProofSubmit',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ProofResubmitted',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ProofResubmitted-Pending',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'VerificationPass-CompanyInfo',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ReportSubmitted',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ReportGenerated',
          role     : 'team member',
          displayMsg : 'Report Generating',
          bgColor    : 'blockwrap1 bgGeen', 
        },
        {
          roleStatus : 'TMReviewSubRemark',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'TMReviewRemark',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'QTMReviewRemark-GetUsrRemark',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'QTMReviewRemark',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ReportReGenerated',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'QAFail',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'ReviewFail',
          role     : 'team member',
          displayMsg : 'Verification Started',
          bgColor    : 'blockwrap1 bgYellow', 
        },
        {
          roleStatus : 'QTLReviewRemark',
          role     : 'quality team leader',
          displayMsg : 'Report Generating',
          bgColor    : 'blockwrap1 bgGreen', 
        },
        {
          roleStatus : 'TicketClosed',
          role     : 'quality team leader',
          displayMsg : 'Completed',
          bgColor    : 'blockwrap1 bgBlue', 
        },
      ];
  if(serviceId){
    console.log('serviceId ',serviceId, ' assureId ',props.assureId);
    var orderDetails   = Order.find({  "companyDetails.companyAssureID" : props.assureId, 
                                       "serviceDetails.serviceId"       : serviceId,
                                      },{sort:{"createdAt": -1}}).fetch();
    if(orderDetails.length > 0){
      serviceName = orderDetails[0].serviceDetails.serviceName;
      orderDetails.map((order,index)=>{
        if(order.candidateDetails){
          if(order.candidateDetails.length > 0){
            var candidateDetailsList = order.candidateDetails;
            if(candidateDetailsList){
              candidateDetailsList.map((singleCandidate,i)=>{
                  var verifyData = singleCandidate.verificationData;
                  console.log("verifyData :",verifyData);
                  if(verifyData){
                    verifyData.map((data,j)=>{
                      if(data.verificationType == "permanentAddress"){
                        var verificationData = new Object();
                        verificationData.line1 = data.line1 + data.line2 + data.line3 + data.landmark;
                        verificationData.line2 = data.city + data.state + data.country + data.pincode;
                        verificationData.line3 = 'From ' + data.residingFrom + ' To ' + data.residingTo;
                      }else if(data.verificationType == "currentAddress"){
                        var verificationData = new Object();
                        verificationData.line1 = data.tempLine1 + data.tempLine2 + data.tempLine3 + data.tempLandmark;
                        verificationData.line2 = data.tempCity + data.tempState + data.tempCountry + data.tempPincode;
                        verificationData.line3 = 'From ' + data.tempresidingFrom + ' To ' + data.tempresidingTo;
                      }else if(data.verificationType == "education"){
                        var verificationData = new Object();   
                        verificationData.line1 = data.educationLevel +" - "+ data.educationQualification +" - "+ data.specialization +" " +data.grades+ " "+ data.educationMode;
                        verificationData.line2 = 'From ' + data.dateAttendedFrom + ' To ' + data.dateAttendedTo + ' Roll # : '+ data.rollNo; 
                        verificationData.line3 = ' Collage Name : '+data.collegeName + " University : "+data.university+ "Address : "+data.collegeAddress+' ' + data.city+' '+data.state+' '+data.pincode;
                      }else if(data.verificationType == "Identity"){
                        var verificationData = new Object();                      
                        verificationData.line1 = data.identityType +" : "+data.cardNo;
                        verificationData.line2 = '';
                        verificationData.line3 = '';
                      }
                      else if(data.verificationType == "employement"){
                        var verificationData = new Object();
                        verificationData.line1 = data.nameOfEmployer +" ( "+ data.employerAddress +" "+ data.employerCity +" "+ data.employerState+" ) Employee Code : "+data.employeeCode + " Contact No. "+ data.contactNo;
                        verificationData.line2 = 'Designation : '+data.designation+ ' Department : '+ data.department + ' From : '+data.employmentFrom+ ' To : '+data.employmentTo+' Last Salary : '+data.lastSalaryDrawn + ' Type Of Employement '+ data.typeOfEmployement;
                        verificationData.line3 = 'Detail Of Agency : '+data.detailOfAgency + ' Reason Of Leaving : '+data.reasonOfLeaving+' Duties And Responsibilites : '+data.dutiesAndResponsibilites + ' Reporting Manager Name : '+data.reportingManagerNm+' Designation'+ data.prevDesignation+' Contact No. '+data.contactDetails;
                      }
                      if(data.ticketDetails){
                        var ticketDetails = Meteor.subscribe('singleTicket',data.ticketDetails.ticketId);
                        //Get Ticket Status
                        if(ticketDetails){
                          var ticketObj = TicketMaster.findOne({"_id":data.ticketDetails.ticketId}, {sort: { createdAt : -1}});
                          if(ticketObj){
                            var lastTktElem = ticketObj.ticketElement[ticketObj.ticketElement.length-1];
                            if(lastTktElem){
                              var ticketStatus = displayArrayMsg.find(function (obj) { return obj.roleStatus == lastTktElem.roleStatus });
                            }
                          }
                        }else{
                          var ticketStatus = {
                            bgColor    : "blockwrap1 bgOrange",
                            displayMsg : "Document Not Uploaded",
                          };                      
                        }
                      }else{
                        var ticketStatus = {
                          bgColor    : "blockwrap1 bgOrange",
                          displayMsg : "Document Not Uploaded",
                        };                      
                      }
                      //End of Ticket Status
                      if(ticketStatus){
                          var candidate = {
                            "candidateAssureID"         : singleCandidate.candidateAssureID,
                            "candidateName"             : singleCandidate.candidateFirstName + ' ' + singleCandidate.candidateLastName,
                            "candidateEmailId"          : singleCandidate.candidateEmailId,
                            "candidateMobile"           : singleCandidate.candidateMobile,
                            "candidateAadharNo"         : singleCandidate.candidateAadharNo,
                            "verificationData"          : verificationData,
                            "verificationDocument"      : data.documents,
                            "verificationStatusBGColor" : ticketStatus.bgColor,
                            "verificationDataStatus"    : ticketStatus.displayMsg,
                            "report"                    : '-'
                          };
                          if(candidate){
                            candidateList.push(candidate);
                          }
                        }
                    });
                  }
                  
              });
            }
          }
        }
      });
    }else{
      console.log('no data found');
    }
  }
  console.log("candidateList :",candidateList);
  return {
    loading,
    serviceName,
    candidateList,
  };
  
})(CandidateOrderList);






// ==============================
// CandidateOrderListContainer = withTracker(props => {
//   const postHandle     = Meteor.subscribe('matchedcompanyOrders',props.assureId,props.serviceid);
//   console.log("props.assureId :",props.assureId);
//   var assureId = props.assureId;
//   const loading        = !postHandle.ready();
//   var serviceId = FlowRouter.getParam("serviceid");
//   console.log('props.assureId ', props.assureId , ' props.serviceid ',serviceId);
  
//   var serviceName = '';
//   var candidateList = []; 
//   var contractId = 0;

  
//     return {
//       loading,
//       assureId
//     };    
  
// })(CandidateOrderList);

export default CandidateOrderListContainer;