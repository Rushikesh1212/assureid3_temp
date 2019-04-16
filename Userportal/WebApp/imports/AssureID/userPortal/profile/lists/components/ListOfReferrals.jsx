import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import ReferralForm from "/imports/AssureID/userPortal/profile/forms/components/ReferralForm.jsx";

class ListOfReferrals extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={
      "subscription" : {
      }
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }

  editDeleteReference(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show'); 
  }
  deleteReference(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeReference",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#deletereferenceInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }
  

  render(){
    return(
      <div>
        {
          this.props.reference.length > 0 ?
            <div>
              <hr className="listAcademicsHR col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <i className="fa fa-users col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 viewTitle">Referrals</span>
              </div> 
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoOuter">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
                   
                  { this.props.reference ?
                    this.props.reference.length > 0 ?
                      this.props.reference.map((reference,index)=>{
                        return(
                          <div  key={index}> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress">
                              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                                <i className={reference.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : reference.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : reference.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                                 title={reference.verifiedStatus == 'In Process' ? "Verification is in process." : reference.verifiedStatus == 'Reject' ? "Verification is rejected." : reference.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                                <div className="edu-box">
                                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/user-icon-reference+(1).png" className="college-img"/>
                                </div>
                              </div>
                              <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                <span className="pull-left"> {reference.referralFirstName} {reference.referralLastName ? reference.referralLastName : ""}  </span><br />
                                <span className="year">{reference.referralDesignation ? reference.referralDesignation : ""}</span><br />                       
                                <span className="year">{reference.referralEmailID ? reference.referralEmailID : ""}</span>                          
                              </div>
                              { 
                                reference.editStatus == "Open" || reference.editStatus == "Reopen" ?
                                  <div>
                                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                                      <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"referenceModal-"+index} id={reference.referenceId} onClick={this.editDeleteReference.bind(this)}></i>
                                    </div>
                                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                      <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <i className="fa fa-trash edit-pencil pull-right" title="Delete Address" data-toggle="modal" onClick={this.editDeleteReference.bind(this)} data-target={"deletereferenceInfo-"+index}></i>
                                      </div>
                                    </div>
                                  </div>
                                :
                                ""
                              }
                            </div> 
                            <div className="modal fade" id={"deletereferenceInfo-"+index} role="dialog">
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <p className="">Do you want to delete this data?</p>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.deleteReference.bind(this)} data-index={index}>Yes</button>
                                      &nbsp;&nbsp;
                                      <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                  </div>
                                </div>  
                              </div>
                            </div>
                            <div className="modal fade" id={"referenceModal-"+index} role="dialog">
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-body">
                                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                                      <br/>
                                      <div className="row">
                                        <h4 className="text-center">Edit Referral Information</h4>
                                         <br/>
                                         <ReferralForm  id={this.props.profileId} referralValues={reference} indexVal={index} />
                                      </div>
                                    </div> 
                                  </div> 
                                </div>
                            </div> 
                          </div> 
                        );                   
                      })
                    :
                     <span>Please Add Your References</span>
                    :
                     <span>Please Add Your References</span>
                  }
                </div>
                
              </div>
            </div>
          :
          ""
        }
      </div>
    );
  }
}
ListOfReferralsContainer = withTracker(props => {
  var _id = props.profileId;
  if(props.reference){
    var reference =  _.without(props.reference,null);
  }else{
    var reference = [];
  }
  
  return {
    reference  : reference,
  };
})(ListOfReferrals);
export default ListOfReferralsContainer;