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

class MultipleVerifiedDocuments extends TrackerReact(Component){
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
  }

//hideShowRejectReason function for show reason block click on Reject button
  hideShowRejectReason(){

    
    $('.showHideReasonWrap').toggleClass('showReasonSection');
  }
// hideShowRejectReason function for show reason block click on Reject button
  hideShowRejectCurReason(){
    $('.showHideReasonWrap').toggleClass('showReasonSection');
  }
  getRole(role) {
    return role != "backofficestaff";
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
        Meteor.call('genericUpdateTicketMasterElement',ticketId,insertData,(err,res)=>{
          if(res){
            var remark = $('.rejectReason-0').val('');
          }
        });
        
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
          {
            this.props.getTicket.verificationDocument.length > 0 ?
              <div className="verifiedDocumentsWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="verifiedDocumentsHeader text-left col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <h5 className="dataDetails">Document Attachment:</h5>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressDashedLine">
                    {
                      this.props.getTicket.verificationDocument.length > 0 ?
                        this.props.getTicket.verificationDocument.map((verificationDocument,index)=>{
                          return(
                            <div key={index}>
                                {
                                    verificationDocument.proofOfDocument ?
                                        <div>
                                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 verifyDocWrap" >
                                                <div data-toggle="modal" data-target={"showProofOfDocumentModal-"+index} onClick={this.showDocuments.bind(this)} title="Click to see document">
                                                {/* { verificationDocument.fileExt == "png" || verificationDocument.fileExt == "jpg" || verificationDocument.fileExt == "jpeg" || verificationDocument.fileExt == "gif" ? */}
                                                    <img src={verificationDocument.proofOfDocument} className=" col-lg-offset-2 img-responsive addressImage img-thumbnail"/>
                                                    {/* :
                                                //     verificationDocument.fileExt == "pdf" ?
                                                //     <img src={verificationDocument.proofOfDocument} className="img-responsive col-lg-offset-1 addressImage"/>
                                                //     :
                                                //     ""
                                                // } */}
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <h6>{verificationDocument.proofType}</h6>
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
                                                                {/* {this.showData(this.props.getTicket.verificationType,this.props.getTicket.verificationData)} */}
                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                                                <img src={verificationDocument.proofOfDocument}  className="img-responsive addressImageModal showAddrImgWrap col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                                                                </div>
                                                            </div>
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
              :
              null
          }
          
          {
            this.props.getTicket.ticketElement[this.props.getTicket.ticketElement.length-1].roleStatus == "NewScrAllocated" ?
              <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 otherInfoForm">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <button type="button" className="btn btn-danger rejectTicket teammember acceptreject" data-id={this.props.getTicket._id} onClick={this.hideShowRejectReason.bind()}>Reject</button>
                  <button type="button" className="btn btn-success acceptTicket acceptreject teammemberApprove" data-id={this.props.getTicket._id} data-status="ScreenApproved" onClick={this.approvedCurDocument.bind()}>Approve</button>
                  </div>    
              </div>
            : 
            ""
          }
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 showHideReasonWrap">
              <div className="col-lg-10  col-md-10  col-sm-12 col-xs-12 otherInfoForm">
                  <textarea className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 rejectReason required rejectReason-0"} rows='2' placeholder="Enter Reject reason..."></textarea>
              </div>
              <div className="col-lg-2  col-md-2  col-sm-12 col-xs-12 rejectBtnWrap">
                  <button className="col-lg-12 col-md-12 btn btn-primary rejectReasonBtn  scrRejectBtn pull-left" data-status="ScreenRejected" onClick={this.approvedCurDocument.bind(this)}>Submit</button>
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
multipleVerifiedDocumentsContainer = withTracker(props => { 
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
        // var docApproveRejectData = ticketElement.find(function(obj){return (obj.allocatedToUserid == userId && obj.roleStatus == 'NewScrAllocated' ) ? obj : false});
        var docApproveRejectData = ticketElement.find(function(obj){return (obj.allocatedToUserid == userId && obj.roleStatus == 'ScreenApproved' )});
        if(docApproveRejectData == undefined){
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
})(MultipleVerifiedDocuments);
export default multipleVerifiedDocumentsContainer;