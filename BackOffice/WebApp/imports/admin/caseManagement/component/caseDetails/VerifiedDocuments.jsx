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
import { UserProfile } from '/imports/admin/userViewProfile/api/userProfile.js';

class VerifiedDocuments extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      "subscription" : {
        "allTickets" : Meteor.subscribe("allTickets"),
        "userfunction" : Meteor.subscribe('userfunction'),
      },
      'showRejectBox':"N",
    }
  }
  showDocuments(event){
    event.preventDefault();
    var idVal= $(event.currentTarget).attr('data-target');
    $('#'+idVal).modal('show');
    // Session.set('editExp','editexperienceinfo');
  }

//hideShowRejectReason function for show reason block click on Reject button
  hideShowRejectReason(){
    // 
    // this.setState({"showRejectBox":"Y"});
    
    $('.showHideReasonWrap').toggleClass('showReasonSection');
  }
// hideShowRejectReason function for show reason block click on Reject button
  hideShowRejectCurReason(){
    $('.showHideReasonWrap').toggleClass('showReasonSection');
  }
  getRole(role) {
    return role != "backofficestaff";
  }
  //show data according to service
  showData(verificationType,verificationData){
    switch(verificationType){
      case 'permanentAddress' :
        return(
          <div className="col-lg-6 col-md-6 showAddrWrap">
            <h5 className ="documentHead">Permanent Address</h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.line1 ? verificationData.line1 : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.line2 ? verificationData.line2 : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.line3 ? verificationData.line3 : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.landmark ? verificationData.landmark : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.city ? verificationData.city+',' : ''}&nbsp;
              {verificationData.state ? verificationData.state+',' : ''}&nbsp;
              {verificationData.Country ? verificationData.Country+',' : ''}&nbsp;
              {verificationData.pincode ? verificationData.pincode+',' : ''},<br />
              <label><b>Residing From :</b> </label>{moment(verificationData.residingFrom).format("DD MMM YYYY")} <label><b>Residing Till :</b> </label>{verificationData.residingTo == "Present" ? "Present" :moment(verificationData.residingTo).format("DD MMM YYYY")}
            </div>
          </div>
        );
        break;
      case 'currentAddress' :
        return(
          <div className="col-lg-6 col-md-6 showAddrWrap">
            <h5 className ="documentHead">Current Address</h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.tempLine1 ? verificationData.tempLine1 : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.tempLine2 ? verificationData.tempLine2 : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.tempLine3 ? verificationData.tempLine3 : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.tempLandmark ? verificationData.temLandmark : ''},
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.tempCity ? verificationData.tempCity+',' : ''}&nbsp;
              {verificationData.tempState ? verificationData.tempState+',' : ''}&nbsp;
              {verificationData.tempCountry ? verificationData.tempCountry+',' : ''}&nbsp;
              {verificationData.tempPincode ? verificationData.tempPincode+',' : ''},<br />
              <label><b>Residing From :</b> </label>{moment(verificationData.tempresidingFrom).format("DD MMM YYYY")} <label><b>Residing Till :</b> </label>{verificationData.tempresidingTo == "Present" ? "Present" : moment(verificationData.tempresidingTo).format("DD MMM YYYY")}
            </div>
          </div>
        );
        break;
      case 'employement' :
        return(
          <div className="col-lg-6 col-md-6 showAddrWrap">
            <h5 className ="documentHead">Employment</h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Employer <span className="pull-right">:</span></b> </span><span className="col-lg-7 col-md-7">{verificationData.nameOfEmployer ? verificationData.nameOfEmployer : "-"},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Address <span className="pull-right">:</span></b> </span><span className="col-lg-7 col-md-7">{verificationData.employerAddress ? verificationData.employerAddress: "-"}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Contact No. <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.contactNo ? verificationData.contactNo : "-"}.</span><br />
            </div>
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Employee Id <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.employeeCode ? verificationData.employeeCode : "-"}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Designation <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.designation ? verificationData.designation :"-"},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Department <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.department ? verificationData.department :"-"},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Employment From <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{moment(verificationData.employmentFrom).format("DD MMM YYYY") ? moment(verificationData.employmentFrom).format("DD MMM YYYY"): "-"},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Employment To <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.employmentTo == "Present" ? "Present" :moment(verificationData.employmentTo).format("DD MMM YYYY") ? moment(verificationData.employmentTo).format("DD MMM YYYY") : "-"},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Type Of Employement <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.typeOfEmployement? verificationData.typeOfEmployement : "-"},</span><br /> 
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Duties And Responsibilites <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.dutiesAndResponsibilites? verificationData.dutiesAndResponsibilites :" - "}</span><br/>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Reporting Manager <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.reportingManagerNm ? verificationData.reportingManagerNm : " - "},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Previous Designation <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.prevDesignation ? verificationData.prevDesignation : "-"}</span><br />
            </div>
          </div>
        );
        break;
      case 'certificates' :
        return(
          <div className="col-lg-6 col-md-6 showAddrWrap">
            <h5 className ="documentHead">Certificates</h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {this.props.verificationData[index].certificateName ? this.props.verificationData[index].certificateName : " "},<br />
              {this.props.verificationData[index].issuedBy ? this.props.verificationData[index].issuedBy : ""}<br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {this.props.verificationData[index].certificatedOn ? this.props.verificationData[index].certificatedOn : ""},<br />
              {this.props.verificationData[index].validTill ? this.props.verificationData[index].validTill : ""}<br />
            </div>
          </div>
        );
        break;
      case 'professionalEducation' :
        return(
          <div className="col-lg-6 col-md-6 showAddrWrap">
            <h5 className ="documentHead">professional Education</h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.professionalQualification ? verificationData.professionalQualification : ""},<br />
              {verificationData.registrationNo ? verificationData.registrationNo : "" }<br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {verificationData.dateOfQualification ? verificationData.dateOfQualification : ""},<br />
              {verificationData.professionalRollNo ? verificationData.professionalRollNo : ""}<br />
              {verificationData.qualifyingBodyNm ? verificationData.qualifyingBodyNm : ""}<br />
            </div>
            
          </div>
        );
        break;
      case 'education' :
        return(
          <div className="col-lg-6 col-md-6 showAddrWrap">
            <h5 className ="documentHead">Education</h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>EducationLevel <span className="pull-right">:</span></b> </span><span className="col-lg-7 col-md-7">{verificationData.educationLevel ? verificationData.educationLevel : ""},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Qualification <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.educationQualification ? verificationData.educationQualification:""}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <span className="col-lg-5 col-md-5"><b>specialization <span className="pull-right">:</span></b> </span><span className="col-lg-7 col-md-7">{verificationData.specialization ? verificationData.specialization: ""},</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Grades <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.grades ? verificationData.grades:""}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Mode of Education <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.educationMode ? verificationData.educationMode:""}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>Duration <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.dateAttendedTo}{ verificationData.dateAttendedTo ? "-" : ""}
              {verificationData.collegeName}{ verificationData.collegeName ? "," : ""}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>University <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.university ? verificationData.university:""}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>College Address <span className="pull-right">:</span></b></span><span className="col-lg-7 col-md-7">{verificationData.collegeAddress} {verificationData.rollNo}</span><br />
            </div>
          </div>
        );
        break;
      case 'Identity' :
        return(
          <div className="col-lg-6 col-md-6 showAddrWrap">
            <h5 className ="documentHead">Identity</h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <span className="col-lg-5 col-md-5"><b>{verificationData.identityType ? verificationData.identityType : ""} Number<span className="pull-right">:</span></b> </span><span className="col-lg-7 col-md-7">{verificationData.cardNo ? verificationData.cardNo : ""}</span><br />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <img src={verificationData.proofOfDocument}  className="col-lg-12 img-responsive addressImageModal1 col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
            </div>
          </div>
        );
        break;
      case 'PoliceVerification' :
        return(
          <div>PoliceVerification</div>
        );
        break;
    }
  }
/*This function execute when document get approved as well as rejected. */
  approvedCurDocument(event){
    event.preventDefault();
    var curURl = location.pathname;
    if(curURl){
      var ticketId = curURl.split('/').pop();
    }
    var status = $(event.currentTarget).attr('data-status');
    var remark = $('.rejectReason-0').val();
    var ticketObj = TicketMaster.findOne({'_id':ticketId});                       
    if(ticketObj){
      var insertData = {
        "userId"              : Meteor.userId(),
        "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
        "role"                : 'screening committee',
        "roleStatus"          : status,
        "msg"                 : 'Screened Ticket Documents',
        "allocatedToUserid"   : '',
        "allocatedToUserName" : '',
        "createdAt"           : new Date()
      }
      if(status == 'ScreenRejected'){
        insertData.remark = remark;
      }
      
      if(remark!="" && status != 'ScreenRejected'){
          $('.close').click();
          $('.showHideReasonWrap').removeClass('showReasonSection');    
          Meteor.call('genericUpdateTicketMasterElement',ticketId,insertData);
      }else if(status == 'ScreenRejected' && remark!=""){
        $('.close').click();        
        $('.showHideReasonWrap').removeClass('showReasonSection');            
        Meteor.call('genericUpdateTicketMasterElement',ticketId,insertData);
        
      }else if(status == 'ScreenApproved'){
        $('.showHideReasonWrap').removeClass('showReasonSection'); 
        $('.close').click();                           
        Meteor.call('genericUpdateTicketMasterElement',ticketId,insertData);
      }else{
          swal({
            position: 'top-right',
            type: 'error',
            title: 'Please Add Remark',
            showConfirmButton: false,
            timer: 1500
        });
      }
      // $('.showHideReasonWrap').toggleClass('showReasonSection');
    }
  }


  render(){
    if (!this.props.loading) {
     return(           
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="verifiedDocumentsWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="verifiedDocumentsHeader text-left col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <h5 className="dataDetails">Document Attachment:</h5>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressDashedLine">
            <div className="col-lg-10 col-lg-offset-1">
              {this.props.getTicket.verificationDocument.length > 0 ?
                this.props.getTicket.verificationDocument.map((verificationDocument,index)=>{
                  return(
                    <div key={index}>
                      {verificationDocument.proofOfDocument ?
                        <div>
                          <div className="col-lg-12 col-md-12 col-sm-3 col-xs-3 verifyDocWrap" >
                            <div data-toggle="modal" data-target={"showProofOfDocumentModal-"+index} onClick={this.showDocuments.bind(this)} title="Click to verify Document">
                              { verificationDocument.fileExt == "png" || verificationDocument.fileExt == "jpg" || verificationDocument.fileExt == "jpeg" || verificationDocument.fileExt == "gif" ?
                                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Photo-icon.png" className=" col-lg-offset-1 img-responsive addressImage"/>
                                :
                                verificationDocument.fileExt == "pdf" ?
                                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pdf.png" className="img-responsive col-lg-offset-1 addressImage"/>
                                :
                                ""
                              }
                              <div className="text-center col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <p>{verificationDocument.fileName}</p>
                              </div>
                            </div>
                          </div>
                          <div className="modal fade" id={"showProofOfDocumentModal-"+index} role="dialog">
                            <div className="modal-dialog modal-lg">
                              <div className="modal-content">
                                <div className="modal-body">
                                  <button type="button" className="close documentClose" data-dismiss="modal">&times;</button>
                                  <div className="row">
                                    <div className="col-lg-12 col-md-12  col-sm-12 col-sm-12">
                                        {this.showData(this.props.getTicket.verificationType,this.props.getTicket.verificationData)}
                                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                                          <img src={verificationDocument.proofOfDocument}  className="col-lg-12 img-responsive addressImageModal showAddrImgWrap col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                                        </div>
                                    </div>
                                    
                                    {this.props.docApproveRejectDiv == true ?
                                      <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 otherInfoForm">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <button type="button" className="btn btn-danger rejectTicket teammember acceptreject" data-id={this.props.getTicket._id} onClick={this.hideShowRejectReason.bind()}>Reject</button>
                                            <button type="button" className="btn btn-success acceptTicket acceptreject" data-id={this.props.getTicket._id} data-status="ScreenApproved" onClick={this.approvedCurDocument.bind()}>Approve</button>
                                          </div>    
                                      </div>
                                      :
                                      ""
                                      }
                                      {/* { this.state.showRejectBox =='Y'? */}
                                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 showHideReasonWrap">
                                      <div className="col-lg-10  col-md-10  col-sm-12 col-xs-12 otherInfoForm">
                                            <textarea className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 rejectReason required rejectReason-"+index} rows='2' placeholder="Enter Reject reason..."></textarea>
                                      </div>
                                      <div className="col-lg-2  col-md-2  col-sm-12 col-xs-12 rejectBtnWrap">
                                        <button className="col-lg-12 col-md-12 btn btn-primary rejectReasonBtn pull-left scrRejectBtn" data-status="ScreenRejected" onClick={this.approvedCurDocument.bind(this)}>Submit</button>
                                      </div>
                                      </div>
                                      {/* :
                                      ""
                                      } */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      :
                        <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 verifyDocWrap" >
                            <div  title="No Documents Attached!">
                            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/noDocument.png" className="img-responsive addressImage"/>
                          </div>
                        </div>
                      }
                    </div>
                  )
                })  
              : 
              ''
              }
            </div>
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
verifiedDocumentsContainer = withTracker(props => { 
    var _id = props.ticketId;
    const postHandle = Meteor.subscribe('singleTicket',_id); 
    const getTicket   = TicketMaster.findOne({"_id" : _id}) || {};
    
    var roles = Meteor.user().roles;
    var reqRole = roles.find(function (obj) { return obj != 'backofficestaff' });
    // 
    var userId = Meteor.userId();
    if(userId){
      var ticketElement = getTicket.ticketElement;
      if(ticketElement){
        var docApproveRejectData = ticketElement.find(function(obj){return (obj.allocatedToUserid == userId && obj.roleStatus == 'NewScrAllocated' ) ? obj : false});
        if(docApproveRejectData){
          var docApproveRejectDiv = true;
        }else{
          var docApproveRejectDiv = false;
        }
      }
    }
    const loading = !postHandle.ready() ;
    return {
        loading,
        getTicket,
        docApproveRejectDiv,
    };
})(VerifiedDocuments);
export default verifiedDocumentsContainer;