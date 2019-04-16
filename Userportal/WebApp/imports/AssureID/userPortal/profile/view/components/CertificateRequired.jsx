import React, { Component }  from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Certificate from '/imports/AssureID/userPortal/profile/forms/components/Certificate.jsx';
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class CertificateRequired extends TrackerReact(Component){
	constructor(props){
    super(props); 
    this.state ={
      "subscription" : {
        // "userData" : Meteor.subscribe('userprofile',Meteor.userId()),    
        // "userProfileData" : Meteor.subscribe("userProfileData"),
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
  deleteCertificate(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeCertificateData",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#delCertificateInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }
  handleChangeCertificate(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name; 
    var index    = parseInt($(event.currentTarget).attr('data-index'));
    this.props.certificateData[index].value = value;

     this.setState({
      [name]: value, 
     });
  }
  render() {
  	// console.log("certificateData",this.props.certificateData);
    return ( 
      <div>
       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-certificate col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-9 viewTitle">Certification Information</span>
          {
            FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
              Meteor.userId() == this.props.currentId ?
                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
                  <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Certificate Details" data-target="#certificateinfo"></i>
                </div>
              :
              ""
            :
            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
              <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Certificate Details" data-target="#certificateinfo"></i>
            </div>
          }
        </div>
        <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12" >
          {this.props.certificateData ?
            this.props.certificateData.length > 0?
            this.props.certificateData.map((certificateDetails, index)=>{
              return (  
                certificateDetails == null ?
                <div key={index}>
                </div>
                : 
		           <div className={certificateDetails.editStatus == "Block" ? "col-lg-12 col-md-12 col-sm-12 col-xs-12 blockedverficationData" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"}  key={index}>             
			           { FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' 
                    ?
                     ""
                     : 
                       certificateDetails.editStatus == "Block" ?
                      <div className="col-lg-1 col-md-1 col-sm-1 hidden-xs noProfilePadding">
                      </div>
                    : 
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile">
                      <input type="checkbox" className="reqInfocheck" name="certificateCheck" id={certificateDetails.chkid} data-index={index} data-present="SkillsCertificate" checked={certificateDetails.value} value={"Certificate Details : "+certificateDetails.certificateId} onChange={this.handleChangeCertificate.bind(this)}/>
                    </div> 
                 }
                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3 noProfilePadding">
			              <div className={certificateDetails.editStatus == "Reopen" ? "reOpenedu-box" : certificateDetails.editStatus == "Block" ? "blockEdu-box" : "edu-box"}>
                      <i className={certificateDetails.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : certificateDetails.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : certificateDetails.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                      title={certificateDetails.verifiedStatus == 'In Process' ? "Verification is in process." : certificateDetails.verifiedStatus == 'Reject' ? "Verification is rejected." : certificateDetails.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
			                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/certificate.png" className="college-img"/>
			              </div>
			            </div>
			            <div className={ FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : certificateDetails.editStatus == "Block" ? "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" :"edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" }>
			              <span className="university-name">{certificateDetails.certificateName}</span><br />
			              <span className="company-name">{certificateDetails.issuedBy}</span><br />
			              <span className="year">{certificateDetails.certificatedOn ? moment(certificateDetails.certificatedOn).format('MMMM YYYY') : ""}</span><br />
                    <span className="year text-success">{certificateDetails.ticketStatus ? "Verification Status: "+certificateDetails.ticketStatus : ""}</span>               
			              {certificateDetails.editStatus == "Reopen" ?
                       <span className="remarkafterReopen noProfilePadding col-lg-12 col-sm-12 col-xs-12 col-md-12">Remark : {certificateDetails.remark}</span>
                     :
                     ""
                    }
                  </div>
                  { 
                    this.props.currentId ?
                      (certificateDetails.editStatus == "Open" || certificateDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                       <div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 NOpadding">
                         <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Certificate" data-toggle="modal" onClick={this.editCertificate.bind(this)} data-target={"delCertificateInfo-"+index}></i>
    		                 <i className="fa fa-pencil edit-pencil pull-right add-btn" onClick={this.editCertificate.bind(this)} title="Edit Certificate" data-toggle="modal" data-target={"editCertificateInfo-"+index} style={{marginRight: '10'+'px'}}></i>
    		               </div>
                        :
                         certificateDetails.verifiedStatus == 'Approved' && certificateDetails.editStatus == "Block" && Meteor.userId() == this.props.currentId ?
                          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                            {/*<a href={certificateDetails.report} target="_blank">
                              <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                            </a> */}
                          </div> 
                       :
                       ""
                    :
                    certificateDetails.editStatus == "Open" || certificateDetails.editStatus == "Reopen" ?
                      <div className="col-lg-3 col-md-3 col-sm-3 col-xs-2 NOpadding">
                         <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Certificate" data-toggle="modal" onClick={this.editCertificate.bind(this)} data-target={"delCertificateInfo-"+index}></i>
                         <i className="fa fa-pencil edit-pencil pull-right add-btn" onClick={this.editCertificate.bind(this)} title="Edit Certificate" data-toggle="modal" data-target={"editCertificateInfo-"+index} style={{marginRight: '10'+'px'}}></i>
                      </div>
                    :
                    certificateDetails.editStatus == "Block" &&  certificateDetails.verifiedStatus != 'Approved' ?
                      <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12 noProfilePadding">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                            Order No <span className="pull-right">:</span>
                          </div>  
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                            <p>{certificateDetails.orderNo}</p>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                            Status <span className="pull-right">:</span>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                            <p>{certificateDetails.verifiedStatus}</p>
                          </div> 
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                            Order Date <span className="pull-right">:</span>
                          </div>                                    
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                            <p>{moment(certificateDetails.orderDate).format("DD/MM/YYYY")}</p>
                          </div> 
                        </div>   
                      </div>
                      :
                       certificateDetails.verifiedStatus == 'Approved' && certificateDetails.editStatus == "Block" ?
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                           {/* <a href={certificateDetails.report} target="_blank">
                              <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                            </a>  */}                      
                        </div>
                    :
                    "" 
                  } 
                  <div className="modal fade" id={"delCertificateInfo-"+index} role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                          </div>
                          <p className="">Do you want to delete this data?</p>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.deleteCertificate.bind(this)} data-index={index}>Yes</button>
                            &nbsp;&nbsp;
                            <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                          </div>
                        </div>
                        <div className="modal-footer">
                        </div>
                      </div>  
                    </div>
                  </div>
		              <div className="modal fade" id={"editCertificateInfo-"+index} role="dialog">
		                <div className="modal-dialog">
		                  <div className="modal-content">
		                    <div className="modal-body">
		                      <button type="button" className="close" data-dismiss="modal">&times;</button>
		                      <div className="row">
		                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                          <h4 className="text-center">Edit Certificate Information</h4>
		                          <br/>
		                         <Certificate key={index + '-certificate'} certificateValues={certificateDetails} indexValue={index}/>
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
                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Certificate Information</span>
              :
              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">No data available.</span>
            :
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Certificate Information</span>
            :
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Certificate Information</span>
          }
        </div>
        <div className="modal fade" id="certificateinfo" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="text-center">Add Certificate Information</h4>
                    <br/>
                    <Certificate key="certificateFormAdd" certificateAdd='certificateAddValue' />
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