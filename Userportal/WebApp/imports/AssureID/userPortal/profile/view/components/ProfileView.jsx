import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { UserProfile } from '/imports/AssureID/userPortal/api/userProfile.js';
import AddressRequired from './AddressRequired.jsx';
import EmploymentRequired from './EmploymentRequired.jsx';
import AcademiceRequired from './AcademiceRequired.jsx';
import BasicInfoRequired from './BasicInfoRequired.jsx';
import BasicForm from '/imports/AssureID/userPortal/profile/forms/components/BasicForm.jsx';
import CertificateRequired from './CertificateRequired.jsx';
import SkillsRequired from './SkillsRequired.jsx';
import SkillsForm from '/imports/AssureID/userPortal/profile/forms/components/SkillsForm.jsx';
import ReferralForm from "/imports/AssureID/userPortal/profile/forms/components/ReferralForm.jsx";
import ReferralRequired from './ReferralRequired.jsx';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

class ProfileView extends TrackerReact(Component){
	constructor(props) {
    super(props);  
    this.state = {
      "firstName"        : '',
      "lastName"         : '',
      "gender"           : '',
      "dateofbirth"      : '',
      "mobileNo"         : '',
      "altMobileNo"      : '',
      "emailId"          : '',
      'education'        : [],
      'employment'       : [],
      'permanentAddress' : [],
      'currentAddress'   : [],
      "subscription"  : {
        "userprofile" : Meteor.subscribe("userprofile"),
      }  
    }; 
  }
	render(){
   if(!this.props.loading){
    return (
    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine" />
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-user col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-9 col-md-9 col-sm-9 col-xs-9 viewTitle">Basic Information</span>
          {
            FlowRouter.current().path == "/viewProfile/"+this.props._id ?
              Meteor.userId() == this.props._id ?
               <i className="fa fa-pencil add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" data-toggle="modal" title="Edit Information" data-target="#basicinfoModal"></i>
              :
              "" 
            :
            <i className="fa fa-pencil add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" title="Edit Information" data-toggle="modal" data-target="#basicinfoModal"></i>
          }
          <div className="modal fade" id="basicinfoModal" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <h4 className="text-center">Edit Basic Information</h4>
                      <br/>
                      <BasicForm key={this.props.userData._id +'-basicEdit'} basicValues={this.props.userData} basicEdit="basicEdit"/>
                    </div>
                  </div>
                </div>
              </div> 
            </div>
          </div>
        </div>
	      <BasicInfoRequired userData={this.props.userData}/> 
	      <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine" />
        <AddressRequired profileId={this.props.userData._id} permanentAddress={this.props.userData.permanentAddress} currentAddress={this.props.userData.currentAddress} currentId={this.props._id} currentUrl={this.props.url}/>
	      <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine" />  
        <AcademiceRequired key={this.props.userData._id + '-academics'} academicsData={this.props.userData.education ? this.props.userData.education.length > 0 ? this.props.userData.education : [] : []} professionalData={this.props.userData.professionalEducation ? this.props.userData.professionalEducation.length > 0 ? this.props.userData.professionalEducation : [] : []} currentId={this.props._id} currentUrl={this.props.url} />  
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine" />
        <EmploymentRequired key={this.props.userData._id + '-employement'} employeeData={this.props.userData.employement ? this.props.userData.employement.length > 0 ? this.props.userData.employement : [] : []} currentId={this.props._id} currentUrl={this.props.url} />	      
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine" />
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-certificate col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 viewTitle">Skills</span>
          {
            FlowRouter.current().path == "/viewProfile/"+this.props._id ?
              Meteor.userId() == this.props._id ?
                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
                 <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Skills" data-target="#skillsinfo"></i>
                </div>
              :
              "" 
            :
            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
              <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Skills" data-target="#skillsinfo"></i>
            </div>
          }
         <SkillsRequired userId={this.props.userData.userId} skillData={this.props.userData.skills ? this.props.userData.skills.length > 0 ? this.props.userData.skills : [] :[]} currentId={this.props._id} currentUrl={this.props.url} />
          <div className="modal fade" id="skillsinfo" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <h4 className="text-center">Add Skills</h4>
                        <br/>
                        <SkillsForm />
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
          </div>
        </div>
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine" />
        <CertificateRequired key={this.props.userData._id + '-certificate'} certificateData={this.props.userData.certificates ? this.props.userData.certificates.length > 0 ? this.props.userData.certificates : [] :[]} currentId={this.props._id} currentUrl={this.props.url} />
{/*        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine" />
        <ReferralRequired key={this.props.userData._id + '-referral'} referralData={this.props.userData.reference ? this.props.userData.reference.length > 0 ? this.props.userData.reference : [] :[]} currentId={this.props._id} currentUrl={this.props.url}/>
*/}      </div>
    );
    }else{
      return(
        <span></span>
      );
    }
  }
} 
EditPageContainer = withTracker(({props}) => {
  var currentLocation = FlowRouter.current();
  // console.log('currentLocation: ',currentLocation);
  var splitUrl = currentLocation.path.split('/'); 
  // console.log('splitUrl: ',splitUrl);
  var url = splitUrl[1]; 
  if(url == 'profileForms'){
    var _id = Meteor.userId();
  }else{
    var _id = FlowRouter.getParam('id');
  }
  const postHandle = Meteor.subscribe('userprofile',_id);
  const userData   = UserProfile.findOne({"userId" : _id})|| {};
  // console.log("userData",userData);
  const loading    = !postHandle.ready();
   
  return {
    loading,
    userData,
    _id,
    url,
  };
})(ProfileView);

export default EditPageContainer;