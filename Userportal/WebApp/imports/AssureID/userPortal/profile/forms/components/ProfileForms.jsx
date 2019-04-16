import React, { Component }  from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import BasicForm from './BasicForm.jsx';
import StatutoryFormProfile from './StatutoryFormProfile.jsx';
import AddressForm from './AddressForm.jsx';
import ListAddress from '/imports/AssureID/userPortal/profile/lists/components/ListAddress.jsx';
import EducationForm from './EducationForm.jsx';
import ProfessionalEduForm from './ProfessionalEduForm.jsx';
import ListAcademics from '/imports/AssureID/userPortal/profile/lists/components/ListAcademics.jsx';
import WorkForm from './WorkForm.jsx';
import ListEmploymentInfo from '/imports/AssureID/userPortal/profile/lists/components/ListEmploymentInfo.jsx';
import Skills from './Skills.jsx';
import Certificate from './Certificate.jsx';
import ListCertificate from '/imports/AssureID/userPortal/profile/lists/components/ListCertificate.jsx';
import OtherInfoForm from './OtherInfoForm.jsx'; 
import ProfileView from '/imports/AssureID/userPortal/profile/view/components/ProfileView.jsx';
import ReferralForm from './ReferralForm.jsx';
import ListOfReferrals from '/imports/AssureID/userPortal/profile/lists/components/ListOfReferrals.jsx';
// import NewsFeed from '../news/NewsFeed.jsx'; 

// import StatutoryForm from './StatutoryForm.jsx';

import { UserProfile } from '/imports/AssureID/userPortal/api/userProfile.js';

class ProfileForms extends TrackerReact(Component){
  constructor(){
    super(); 
    this.state ={ 
      "subscription" : {     
      } 
    }
  }
  inputFileChange(event){
    // console.log($(event.target));
    event.preventDefault();
    $(event.target).parent().parent().find('.inputFiles').click();
  } 
  uploadProfileImg(event){
    event.preventDefault(); 
    let self = this; 
    this.setState({isUploading: true});
    //  this.calculateProgress();
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      // console.log("file",file);
      var userId = Meteor.userId();
      // console.log("userId",userId); 
      if (file) {
        var userFileName = file.name; 
        var userFileExt  = userFileName.split('.').pop();
        addUserToS3Function(userId,file,self,userFileName,userFileExt);
      }
    }
  }
  homeActive(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/home');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#home').addClass('in active');
    $('.home').addClass('active');
  }
  menu4Active(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/menu4');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu4').addClass('in active');
    $('.menu4').addClass('active');
  }
  menu1Active(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/menu1');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu1').addClass('in active');
    $('.menu1').addClass('active');
  }
  menu2Active(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/menu2');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu2').addClass('in active');
    $('.menu2').addClass('active');
  }
  menu3Active(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/menu3');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu3').addClass('in active');
    $('.menu3').addClass('active');
  }
  menu7Active(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/menu7');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu7').addClass('in active');
    $('.menu7').addClass('active');
  } 
  menu5Active(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/menu5');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu5').addClass('in active');
    $('.menu5').addClass('active');
  }
  referenceActive(event){
    event.preventDefault();
    FlowRouter.go('/profileForms/reference');
    $('.pillsContent').find('.active').removeClass('in active');
    $('#reference').addClass('in active');
    $('.reference').addClass('active');
  }
  slideProfEducation(event){
    event.preventDefault(); 
    // console.log('event: ',$(event.target));
    if($(event.target).hasClass('angleSlide')){
      $(event.target).siblings('i').addClass('fa-angle-up');
      $(event.target).siblings('i').removeClass('fa-angle-down');
      $(event.target).removeClass('angleSlide');
      $('#profEduCollapse').slideDown();
    }else if($(event.target).hasClass('fa-angle-down')){
      $(event.target).removeClass('fa-angle-down');
      $(event.target).addClass('fa-angle-up');
      $('#profEduCollapse').slideDown();
    }else{
      $(event.target).siblings('i').addClass('fa-angle-down');
      $(event.target).siblings('i').removeClass('fa-angle-up');
      $(event.target).addClass('angleSlide');
      $('.fa-angle-up').addClass('fa-angle-down');
      $('.fa-angle-down').removeClass('fa-angle-up');
      $('#profEduCollapse').slideUp();
    }
  }
  
  render(){ 
    if(!this.props.loading && !this.props.loading1){
      return(
        <div>
          <div className="profileForms">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileFormsHead">
              <div className="profileHead">
                <div className="color-overlay"></div>
                <div className="proHeadContent col-lg-12 col-md-12 col-sm-12 col-xs-12">

                  { Meteor.userId() == this.props._id ?

                    this.props.usersDetails.profile.userProfile ? 
                    <div>
                      <input type="file" className="btn btn-info inputFiles" onChange={this.uploadProfileImg.bind(this)}/>  
                      {/*<div className="color-overlay"> 
                        <div><i className="fa fa-times-circle"></i> Remove</div>
                      </div>*/}
                      <div className="addUserImage addUserImage1" onClick={this.inputFileChange.bind(this)}>
                        <img src={this.props.usersDetails.profile.userProfile} title="Change profile picture"  className="img-circle userPrfileImg inputFileSpan" />
                      </div>
                    </div>               
                    :          
                    <div>
                      <input type="file" onChange={this.uploadProfileImg.bind(this)} className="btn btn-info inputFiles"/>  
                      <div className="addUserImage" onClick={this.inputFileChange.bind(this)}>
                        <i className="fa fa-plus-circle fa-lg inputFileSpan"></i><br/>Add Photo
                      </div>
                    </div> 
                    :
                    this.props.usersDetails.profile.userProfile ? 
                      <div className="addUserImage addUserImage1">
                        <img src={this.props.usersDetails.profile.userProfile} className="img-circle userPrfileImg inputFileSpan" />
                      </div>
                    :
                    ""

                  }
                  <h4 className=""><b>{this.props.usersDetails.profile.firstname} {this.props.usersDetails.profile.lastname}</b></h4>
                  <h5>{'AssureID  '+this.props.usersDetails.profile.assureId}</h5>
                  <div className="proheadNavTitle col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <ul>
                      <li><a><h5 className="fancy_title1">
                        <span className="charBas1">B</span>
                        <span className="charBas2">a</span>  
                        <span className="charBas3">s</span>
                        <span className="charBas4">i</span>
                        <span className="charBas5">c</span>
                      </h5></a></li>
                      <li><a><h5 className="fancy_title2">
                        <span className="charIdn1">I</span>
                        <span className="charIdn2">d</span>
                        <span className="charIdn3">e</span>
                        <span className="charIdn4">n</span>
                        <span className="charIdn5">t</span>
                        <span className="charIdn6">i</span>
                        <span className="charIdn7">t</span>
                        <span className="charIdn8">y</span>
                      </h5></a></li>
                      <li><a><h5 className="fancy_title3">
                        <span className="charAdd1">A</span>
                        <span className="charAdd2">d</span>
                        <span className="charAdd3">d</span>
                        <span className="charAdd4">r</span>
                        <span className="charAdd5">e</span>
                        <span className="charAdd6">s</span>
                        <span className="charAdd7">s</span>
                      </h5></a></li>
                      <li><a><h5 className="fancy_title4">
                        <span className="charAca1">A</span>
                        <span className="charAca2">c</span>
                        <span className="charAca3">a</span>
                        <span className="charAca4">d</span>
                        <span className="charAca5">e</span>
                        <span className="charAca6">m</span>
                        <span className="charAca7">i</span>
                        <span className="charAca8">c</span>
                      </h5></a></li>
                      <li><a><h5 className="fancy_title5">
                        <span className="charEmp1">E</span>
                        <span className="charEmp2">m</span>
                        <span className="charEmp3">p</span>
                        <span className="charEmp4">l</span>
                        <span className="charEmp5">o</span>
                        <span className="charEmp6">y</span>
                        <span className="charEmp7">m</span>
                        <span className="charEmp8">e</span>
                        <span className="charEmp9">n</span>
                        <span className="charEmp10">t</span>
                      </h5></a></li>
                      <li><a><h5 className="fancy_title6">
                        <span className="charCer1">C</span>
                        <span className="charCer2">e</span>
                        <span className="charCer3">r</span>
                        <span className="charCer4">t</span>
                        <span className="charCer5">i</span>
                        <span className="charCer6">f</span>
                        <span className="charCer7">i</span>
                        <span className="charCer8">c</span>
                        <span className="charCer9">a</span>
                        <span className="charCer10">t</span>
                        <span className="charCer11">i</span>
                        <span className="charCer12">o</span>
                        <span className="charCer13">n</span>
                      </h5></a></li>
                      <li><a><h5 className="fancy_title7">
                        <span className="charOth1">O</span>
                        <span className="charOth2">t</span>
                        <span className="charOth3">h</span>
                        <span className="charOth4">e</span>
                        <span className="charOth5">r</span>
                      </h5></a></li>
                    </ul>
                  </div>
                  <div className="proheadNav col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <div className="progress">
                      <div className="progress-bar progress-bar-striped" role="progressbar"
                      aria-valuenow={this.props.userprofileObj.profilePercent ? this.props.userprofileObj.profilePercent : 8} aria-valuemin="0" aria-valuemax="100" 
                      style={{width: this.props.userprofileObj.profilePercent ? this.props.userprofileObj.profilePercent +'%' : 8+'%'}}>
                      </div>
                    </div>
                    <ul className="nav nav-pills pillsContent">
                      <li className="home" onClick={this.homeActive.bind(this)}>
                        <a data-toggle="pill" href="#home" className={this.props.userprofileObj.profileBasicClass + " smallFaPills"}>
                          <i className="fa fa-user"></i>
                          <i className={this.props.userprofileObj.profileBasicStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileBasicStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileBasicStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileBasicStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileBasicStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileBasicStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>
                      <li className="menu4" onClick={this.menu4Active.bind(this)}>
                        <a data-toggle="pill" href="#menu4" className={this.props.userprofileObj.profileIdentityClass + " largeFaPills"}>
                          <i className="fa fa-id-card"></i>
                          <i className={this.props.userprofileObj.profileIdentityStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileIdentityStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileIdentityStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileIdentityStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileIdentityStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileIdentityStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>
                      <li className="menu1" onClick={this.menu1Active.bind(this)}>
                        <a data-toggle="pill" href="#menu1" className={this.props.userprofileObj.profileAddressClass + " smallFaPills"}>
                          <i className="fa fa-map-marker"></i>
                          <i className={this.props.userprofileObj.profileAddressStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileAddressStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileAddressStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileAddressStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileAddressStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileAddressStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>
                      <li className="menu2" onClick={this.menu2Active.bind(this)}>
                        <a data-toggle="pill" href="#menu2" className={this.props.userprofileObj.profileAcademicsClass + " largeFaPills"}>
                          <i className="fa fa-graduation-cap"></i>
                          <i className={this.props.userprofileObj.profileAcademicsStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileAcademicsStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileAcademicsStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileAcademicsStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileAcademicsStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileAcademicsStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>
                      <li className="menu3" onClick={this.menu3Active.bind(this)}>
                        <a data-toggle="pill" href="#menu3" className={this.props.userprofileObj.profileEmploymentClass + " mediumFaPills"}>
                          <i className="fa fa-briefcase"></i>
                          <i className={this.props.userprofileObj.profileEmploymentStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileEmploymentStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileEmploymentStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileEmploymentStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileEmploymentStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileEmploymentStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>
                      <li className="menu7" onClick={this.menu7Active.bind(this)}>
                        <a data-toggle="pill" href="#menu7" className={this.props.userprofileObj.profileSkillsCertClass + " mediumFaPills"}>
                          <i className="fa fa-certificate"></i>
                          <i className={this.props.userprofileObj.profileSkillsCertStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileSkillsCertStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileSkillsCertStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileSkillsCertStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileSkillsCertStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileSkillsCertStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>
                     {/* <li className="reference" onClick={this.menu7Active.bind(this)}>
                        <a data-toggle="pill" href="#reference" className={this.props.userprofileObj.profileSkillsCertClass + " mediumFaPills"}>
                          <i className="fa fa-user"></i>
                          <i className={this.props.userprofileObj.profileSkillsCertStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileSkillsCertStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileSkillsCertStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileSkillsCertStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileSkillsCertStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileSkillsCertStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>*/}
                      <li className="menu5" onClick={this.menu5Active.bind(this)}>
                        <a data-toggle="pill" href="#menu5" className={this.props.userprofileObj.profileOtherInfoClass + " mediumFaPills"}>
                          <i className="fa fa-file-o"></i>
                          <i className={this.props.userprofileObj.profileOtherInfoStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileOtherInfoStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileOtherInfoStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                          title={this.props.userprofileObj.profileOtherInfoStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileOtherInfoStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileOtherInfoStatus == 'Approved' ? "Verified" : ""}></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-4 headProgressNav">
                    <h5>Your profile is {this.props.userprofileObj.profilePercent ? this.props.userprofileObj.profilePercent : 8}% completed</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBody"> 
              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyMenu">
                  <h4 className="">Menu</h4>
                  <hr className="profileMenuHR" style={{width: 21+'%'}}/>
                  <ul className="nav nav-pills pillsContent">
                    <li className={this.props.currentLocation.path == '/profileForms/home' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight home" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight home"} onClick={this.homeActive.bind(this)}>
                      <a data-toggle="pill" href="#home" className="noProfilePadding">
                        <i className="fa fa-user col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Basic Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>
                    <li className={this.props.currentLocation.path == '/profileForms/menu4' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu4" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu4"} onClick={this.menu4Active.bind(this)}>
                      <a data-toggle="pill" href="#menu4" className="noProfilePadding">
                        <i className="fa fa-id-card col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Identity Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>
                    <li className={this.props.currentLocation.path == '/profileForms/menu1' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu1" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu1"} onClick={this.menu1Active.bind(this)}>
                      <a data-toggle="pill" href="#menu1" className="noProfilePadding">
                        <i className="fa fa-map-marker col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Address Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>
                    <li className={this.props.currentLocation.path == '/profileForms/menu2' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu2" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu2"} onClick={this.menu2Active.bind(this)}>
                      <a data-toggle="pill" href="#menu2" className="noProfilePadding">
                        <i className="fa fa-graduation-cap col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Academic Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li> 
                    <li className={this.props.currentLocation.path == '/profileForms/menu3' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu3" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu3"} onClick={this.menu3Active.bind(this)}>
                      <a data-toggle="pill" href="#menu3" className="noProfilePadding">
                        <i className="fa fa-briefcase col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Employment Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>
                    <li className={this.props.currentLocation.path == '/profileForms/menu7' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu7" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu7"} onClick={this.menu7Active.bind(this)}>
                      <a data-toggle="pill" href="#menu7" className="noProfilePadding">
                        <i className="fa fa-certificate col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Skills & Certification Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>
                  {/* <li className={this.props.currentLocation.path == '/profileForms/reference' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight reference" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight reference"} onClick={this.referenceActive.bind(this)}>
                      <a data-toggle="pill" href="#reference" className="noProfilePadding">
                        <i className="fa fa-users col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Referral Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>*/}
                    <li className={this.props.currentLocation.path == '/profileForms/menu5' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu5" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu5"} onClick={this.menu5Active.bind(this)}>
                      <a data-toggle="pill" href="#menu5" className="noProfilePadding">
                        <i className="fa fa-file-o col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Other Information
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>
                   {/* <li className={this.props.currentLocation.pathname == '/profileForms/menu6' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu6" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu6"}>
                      <a data-toggle="pill" href="#menu6" className="noProfilePadding">
                        <i className="fa fa-file-o col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                        <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">View
                          <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                        </span>
                      </a>
                    </li>*/}
                  </ul>
                </div>
              </div>       
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyContent">
                  <div className="tab-content tabContents">
                    <div id="home" className={this.props.currentLocation.path == '/profileForms/home' ? "tab-pane fade in active" : "tab-pane fade"}>
                      <h4 className="">Basic Information</h4>
                      <hr className="profileMenuHR"/>
                      <BasicForm key={this.props.userprofileObj._id +'-basic'} basicValues={this.props.userprofileObj}/>
                    </div>
                    <div id="menu4" className={this.props.currentLocation.path == '/profileForms/menu4' ? "tab-pane fade in active" : "tab-pane fade"}>
                      <h4 className="">Identity Information</h4>
                      <hr className="profileMenuHR"/>
                      <StatutoryFormProfile key={this.props.userprofileObj._id +'-identity'} identityValues={this.props.userprofileObj.identity} />
                    </div> 
                    <div id="menu1" className={this.props.currentLocation.path == '/profileForms/menu1' ? "tab-pane fade in active" : "tab-pane fade"}>
                      <h4 className="">Address Information</h4>
                      <hr className="profileMenuHR"/>
                      <AddressForm />
                      <ListAddress key={this.props.userprofileObj._id +'-address'} profileId={this.props.userprofileObj._id} permanentAddress={this.props.userprofileObj.permanentAddress} currentAddress={this.props.userprofileObj.currentAddress} />
                    </div>
                    <div id="menu2" className={this.props.currentLocation.path == '/profileForms/menu2' ? "tab-pane fade in active" : "tab-pane fade"}>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        <h4 className="">Academic Information</h4>
                        <hr className="profileMenuHR"/>
                        <EducationForm key={this.props.userprofileObj._id + '-educationForm'} />
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerprofessonalBlock noProfilePadding">
                        <a href="" onClick={this.slideProfEducation.bind(this)} style={{color : '#'+'333'}}>
                          <h4 className="col-lg-11 col-md-11 col-sm-11 col-xs-11 angleSlide">Professional Qualification Information [Only in case of IIT, CA, ICWAI, CS, MBBS etc]</h4>
                          <i className="col-lg-1 col-md-1 col-sm-1 col-xs-1 fa fa-2x fa-angle-down" style={{marginTop : '6'+'px'}}></i>
                        </a>
                        {/*<hr className="profileMenuHR"/>*/}
                        <div id="profEduCollapse">
                          <ProfessionalEduForm /> 
                        </div>
                      </div>
                      <ListAcademics key={this.props.userprofileObj._id + '-academics'} academicsData={this.props.userprofileObj.education ? this.props.userprofileObj.education.length > 0 ? this.props.userprofileObj.education : [] :[]} professionalData={this.props.userprofileObj.professionalEducation ? this.props.userprofileObj.professionalEducation.length > 0 ? this.props.userprofileObj.professionalEducation : [] :[]}/>
                    </div>
                    <div id="menu3" className={this.props.currentLocation.path == '/profileForms/menu3' ? "tab-pane fade in active" : "tab-pane fade"}>
                      <h4 className="">Employment Information</h4>
                      <hr className="profileMenuHR"/>
                      <WorkForm />
                      <ListEmploymentInfo key={this.props.userprofileObj._id + '-employement'} employeeData={this.props.userprofileObj.employement ? this.props.userprofileObj.employement.length > 0 ? this.props.userprofileObj.employement :[] :[]}/>
                    </div>
                    <div id="menu7" className={this.props.currentLocation.path == '/profileForms/menu7' ? "tab-pane fade in active" : "tab-pane fade"}>       
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        <h4 className="">Skills</h4>
                        <hr className="profileMenuHR"/>
                        <Skills userId={this.props.userprofileObj.userId} />                    
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        <h4 className="">Certification Information</h4>
                        <hr className="profileMenuHR"/>
                        <Certificate />                        
                        <ListCertificate key={this.props.userprofileObj._id + '-certificate'} certificateData={this.props.userprofileObj.certificates ? this.props.userprofileObj.certificates.length > 0 ? this.props.userprofileObj.certificates : [] :[]} certificateForm="editCertificateForm" />
                      </div>
                    </div>
                    <div id="menu5" className={this.props.currentLocation.path == '/profileForms/menu5' ? "tab-pane fade in active" : "tab-pane fade"}>
                      <h4 className="">Other Information</h4>
                      <hr className="profileMenuHR"/>
                      <OtherInfoForm key={this.props.userprofileObj._id +'-other'} basicValues={this.props.userprofileObj}/>
                    </div>
                   {/* <div id="reference" className={this.props.currentLocation.path == '/profileForms/reference' ? "tab-pane fade in active" : "tab-pane fade"}>
                      <h4 className="">Referral Information</h4>
                      <hr className="profileMenuHR"/>
                      <ReferralForm />
                      <ListOfReferrals key={this.props.userprofileObj._id + '-reference'} reference={this.props.userprofileObj.reference ? this.props.userprofileObj.reference.length > 0 ? this.props.userprofileObj.reference : [] :[]}/>
                    </div>*/}
                    <div id="menu6" className={this.props.currentLocation.path == '/viewProfile/'+this.props._id ? "tab-pane fade in active" : "tab-pane fade"}>
                      <h4 className="">Profile</h4>
                      <hr className="profileMenuHR"/> 
                      <ProfileView/>
                    </div>  
                  </div> 
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyNews">
                  <h4 className="">News Feed</h4>
                  <hr className="profileMenuHR" style={{width: 38+'%'}}/>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proNewsBlock">
{/*                    <NewsFeed />
*/}                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }else{
      return(<span>Loading..</span>);
    }   
  }
}
ProfileFormsContainer = withTracker(({props}) => {
  var currentLocation = FlowRouter.current();
  // console.log('currentLocation: ',currentLocation);
  var splitUrl = currentLocation.path.split('/'); 
  // console.log('splitUrl: ',splitUrl);
  var url = splitUrl[1]; 
  // if (FlowRouter.getParam('url')) {
  //   var _id = Meteor.userId();
  // }else{
  //   var _id = FlowRouter.getParam('id');
  // }
  if(url == 'profileForms'){
    var _id = Meteor.userId();
  }else{
    var _id = FlowRouter.getParam('id');
  }
    // console.log("_id",_id);

  const postHandle    = Meteor.subscribe('userData',_id);
  const postHandle1   = Meteor.subscribe('userprofile',_id);
  const loading       = !postHandle.ready();
  const loading1      = !postHandle1.ready();
  const usersDetails  = Meteor.users.findOne({"_id":_id})|| {};
  const userprofileObj = UserProfile.findOne({'userId': _id}) || {} ;
  
  return {
    loading,
    usersDetails,
    userprofileObj,
    loading1,
    currentLocation,
    _id
    };
})(ProfileForms);

export default ProfileFormsContainer;