import React, { Component }  from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import ReferralForm from "/imports/AssureID/userPortal/profile/forms/components/ReferralForm.jsx";
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class ReferralRequired extends TrackerReact(Component){
	constructor(props){
    super(props); 
    this.state ={
      "subscription" : {
      } 
    }
  }
  componentDidMount(){
  }
  editCertificate(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
    // Session.set('editExp','editexperienceinfo');
  }
  deleteReference(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeReference",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#delreference-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }
  handleChangeReference(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name; 
    var index    = parseInt($(event.currentTarget).attr('data-index'));
    this.props.referralData[index].value = value;

     this.setState({
      [name]: value, 
     });
  } 
  render() {
    return ( 
      <div>
       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-users col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-9 viewTitle">Referral Information</span>
          {
            FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
              Meteor.userId() == this.props.currentId ?
                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
                  <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Referral Information" data-target="#addreferenceinfo"></i>
                </div>
              :
              ""
            :
            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
              <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Referral Information" data-target="#addreferenceinfo"></i>
            </div>
          }
        </div>
        <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12" >
          {this.props.referralData ?
            this.props.referralData.length > 0?
            this.props.referralData.map((referralData, index)=>{
              return (  
                referralData == null ?
                <div key={index}>
                </div>
                : 
		           <div className={referralData.editStatus == "Block" ? "col-lg-12 col-md-12 col-sm-12 col-xs-12 blockedverficationData" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"}  key={index}>             
			           { FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' 
                    ?
                      null
                     : 
                       referralData.editStatus == "Block" ?
                      <div className="col-lg-1 col-md-1 col-sm-1 hidden-xs noProfilePadding">
                      </div>
                    : 
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile">
                      <input type="checkbox" className="reqInfocheck" name="referalCheck" id={referralData.chkid} data-index={index} data-present="ReferenceForm" checked={referralData.value} value={"Reference Details : "+referralData.referenceId} onChange={this.handleChangeReference.bind(this)}/>
                    </div> 
                 }
                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3 noProfilePadding">
			              <div className={referralData.editStatus == "Reopen" ? "reOpenedu-box" : referralData.editStatus == "Block" ? "blockEdu-box" : "edu-box"}>
                      <i className={referralData.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : referralData.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : referralData.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                      title={referralData.verifiedStatus == 'In Process' ? "Verification is in process." : referralData.verifiedStatus == 'Reject' ? "Verification is rejected." : referralData.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
			                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/user-icon-reference+(1).png" className="college-img"/>
			              </div>
			            </div>
			            <div className={ FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : referralData.editStatus == "Block" ? "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" :"edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" }>
			              <span className="university-name">{referralData.referralFirstName} {referralData.referralLastName ? referralData.referralLastName : ""}</span><br />
			              <span className="company-name">{referralData.referralDesignation ? referralData.referralDesignation : ""}</span><br />
			              <span className="year">{referralData.referralEmailID ? referralData.referralEmailID : ""}</span><br />
                    <span className="year text-success">{referralData.ticketStatus ? "Verification Status: "+referralData.ticketStatus : ""}</span>               
			              {referralData.editStatus == "Reopen" ?
                       <span className="remarkafterReopen noProfilePadding col-lg-12 col-sm-12 col-xs-12 col-md-12">Remark : {referralData.remark}</span>
                     :
                     ""
                    }
                  </div>
                  { 
                    this.props.currentId ?
                      (referralData.editStatus == "Open" || referralData.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                       <div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 NOpadding">
                         <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Referance" data-toggle="modal" onClick={this.editCertificate.bind(this)} data-target={"delreference-"+index}></i>
    		                 <i className="fa fa-pencil edit-pencil pull-right add-btn" onClick={this.editCertificate.bind(this)} title="Edit Referance" data-toggle="modal" data-target={"editreferenceModal-"+index} style={{marginRight: '10'+'px'}}></i>
    		               </div>
                        :
                         referralData.verifiedStatus == 'Approved' && referralData.editStatus == "Block" && Meteor.userId() == this.props.currentId ?
                          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                            {/*<a href={referralData.report} target="_blank">
                              <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                            </a> */}
                          </div> 
                       :
                       ""
                    :
                    referralData.editStatus == "Open" || referralData.editStatus == "Reopen" ?
                      <div className="col-lg-3 col-md-3 col-sm-3 col-xs-2 NOpadding">
                         <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Referance" data-toggle="modal" onClick={this.editCertificate.bind(this)} data-target={"delreference-"+index}></i>
                         <i className="fa fa-pencil edit-pencil pull-right add-btn" onClick={this.editCertificate.bind(this)} title="Edit Referance" data-toggle="modal" data-target={"editreferenceModal-"+index} style={{marginRight: '10'+'px'}}></i>
                      </div>
                    :
                    referralData.editStatus == "Block" &&  referralData.verifiedStatus != 'Approved' ?
                      <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12 noProfilePadding">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                            Order No <span className="pull-right">:</span>
                          </div>  
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                            <p>{referralData.orderNo}</p>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                            Status <span className="pull-right">:</span>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                            <p>{referralData.verifiedStatus}</p>
                          </div> 
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                            Order Date <span className="pull-right">:</span>
                          </div>                                    
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                            <p>{moment(referralData.orderDate).format("DD/MM/YYYY")}</p>
                          </div> 
                        </div>   
                      </div>
                      :
                       referralData.verifiedStatus == 'Approved' && referralData.editStatus == "Block" ?
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                            {/*<a href={referralData.report} target="_blank">
                              <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                            </a>*/}                         
                        </div>
                    :
                    "" 
                  } 
                  <div className="modal fade" id={"delreference-"+index} role="dialog">
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
		              <div className="modal fade" id={"editreferenceModal-"+index} role="dialog">
		                <div className="modal-dialog">
		                  <div className="modal-content">
		                    <div className="modal-body">
		                      <button type="button" className="close" data-dismiss="modal">&times;</button>
		                      <div className="row">
		                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                          <h4 className="text-center">Edit Referral Information</h4>
		                          <br/>
                              <ReferralForm id={this.props.profileId} referralValues={referralData} indexVal={index} />
		                       </div>
		                      </div>
		                    </div>
		                  </div> 
		                </div>
		              </div>
		            </div>
              ); 
            })
            :
            FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
              Meteor.userId() == this.props.currentId ?
                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Referral Information</span>
              :
              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">No data available.</span>
            :
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Referral Information</span>
            :
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Referral Information</span>
          }
        </div>
        <div className="modal fade" id="addreferenceinfo" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="text-center">Add Certificate Information</h4>
                    <br/>
                    <ReferralForm/>
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    );
  }

}