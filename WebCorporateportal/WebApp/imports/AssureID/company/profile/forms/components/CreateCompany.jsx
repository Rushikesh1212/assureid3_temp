import React, { Component }  from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import CompanyBasicInfo from './CompanyBasicInfo.jsx';
import CompanyEmployees from './CompanyEmployees.jsx';
import CompanyLocationsInfo from './CompanyLocationsInfo.jsx';
import CompanySettingsInfo from './CompanySettingsInfo.jsx';
import CompanyView from '/imports/AssureID/company/profile/view/components/CompanyView.jsx';
import { TempCompanyImages } from "/imports/AssureID/company/profile/api/companyProfile.js";
import { CompanyProfile } from "/imports/AssureID/company/profile/api/companyProfile.js";
import ListOfCompanyLocation from './ListOfCompanyLocation.jsx';

class CreateCompany extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      "subscription" : {    
      }
    }
  } 
  inputFileChange(event){
    event.preventDefault();
    $(event.target).parent().parent().find('.inputFiles').click();
  }
  
  uploadProfileImg(event){
    event.preventDefault();
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var fileName = file.name;
      var fileSize = file.size;
      var userId   = Meteor.userId();
      var type     = $(event.target).attr('data-type');
      var ext      = fileName.split('.').pop();
      if(file){
        $('#companyLogoLabel').removeClass('error');
        $('#companyLogoLabel').html('');
        $('#addCompanyLogo').removeClass('errorBorderColor');
        var size         = 1073741824;
        if(ext=="jpg" || ext=="png" || ext=="jpeg"){
          if (fileSize < size) {
            addCompanyLogoToS3Function(userId,file,type,self);
          }else{
            // swal("File not uploaded!","Document size limit is upto 1gb.","error");
            swal({
              title:'abc',
              text: "Document size limit is upto 1gb!",
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#666',
              // cancelButtonColor:'#d33',
              confirmButtonText: 'Ok'
            })

            
          }
        }else{
          // swal("Please upload file","in images format","error");
          swal({
            title:'abc',
            text: "Please upload file in image format!",
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#666',
            // cancelButtonColor:'#d33',
            confirmButtonText: 'Ok'
          })
        }
      }
    }
  }
  basicActive(event){
    event.preventDefault();
    if(this.props.assureId){
      FlowRouter.go('/companyForms/basic/'+this.props.assureId);
    }else{
      FlowRouter.go('/companyForms/basic');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#basic').addClass('in active');
    $('.basic').addClass('active');
  }
  locationsActive(event){
    event.preventDefault();
    if(this.props.assureId){
      FlowRouter.go('/companyForms/locations/'+this.props.assureId);
    }else{
      FlowRouter.go('/companyForms/locations');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#locations').addClass('in active');
    $('.locations').addClass('active');
  }
  settingsActive(event){
    event.preventDefault();
    if(this.props.assureId){
      FlowRouter.go('/companyForms/settings/'+this.props.assureId);
    }else{
      FlowRouter.go('/companyForms/settings');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#settings').addClass('in active');
    $('.settings').addClass('active');
  }

 
  
  
  render(){ 
    return(
      <div>
        <div className="profileForms">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileFormsHead">
            <div className="profileHead">
              <div className="color-overlay"></div>
              <div className="proHeadContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                {
                  this.props.imageLink ?
                  <div>
                    <input type="file" className="btn btn-info inputFiles" onChange={this.uploadProfileImg.bind(this)} data-type="companyProfile"/> 
                    <div className="addUserImage addUserImage1" onClick={this.inputFileChange.bind(this)}>
                      <img src={this.props.imageLink} title="Change profile picture"  className="img-circle userPrfileImg inputFileSpan" />
                    </div>
                  </div>              
                  :
                  this.props.companyProfileObj.companyLogo ?         
                  <div>
                    <input type="file" className="btn btn-info inputFiles" onChange={this.uploadProfileImg.bind(this)} data-type="companyProfile"/> 
                    <div className="addUserImage addUserImage1" onClick={this.inputFileChange.bind(this)}>
                      <img src={this.props.companyProfileObj.companyLogo} title="Change profile picture"  className="img-circle userPrfileImg inputFileSpan" />
                    </div>
                  </div>
                  :
                  <div>
                    <input type="file" onChange={this.uploadProfileImg.bind(this)} className="btn btn-info inputFiles" data-type="companyProfile"/> 
                    <div id="addCompanyLogo" className="addUserImage" onClick={this.inputFileChange.bind(this)}>
                      <i className="fa fa-plus-circle fa-lg inputFileSpan"></i><br/>Add Photo<span className="astrikReq addCompanyLogoAst">*</span>
                    </div>
                  </div>
                }
                {!this.props.companyProfileObj.companyLogo && !this.props.imageLink ?<label className="companyLogoLabel" id="companyLogoLabel"></label> : ""}
                <h4 className=""><b>{this.props.companyProfileObj.companyName}</b></h4>
                <h5>{this.props.companyProfileObj.companyAssureID ? 'AssureID  '+this.props.companyProfileObj.companyAssureID : ''}</h5>
                <div className="proheadNavTitle companyProheadNavTitle col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <ul>
                    <li><a><h5 className="fancy_title11">
                      <span className="charBas1">B</span>
                      <span className="charBas2">a</span> 
                      <span className="charBas3">s</span>
                      <span className="charBas4">i</span>
                      <span className="charBas5">c</span>
                    </h5></a></li>
                    <li><a><h5 className="fancy_title8">
                      <span className="charLoc1">L</span>
                      <span className="charLoc2">o</span>
                      <span className="charLoc3">c</span>
                      <span className="charLoc4">a</span>
                      <span className="charLoc5">t</span> 
                      <span className="charLoc6">i</span>
                      <span className="charLoc7">o</span>
                      <span className="charLoc8">n</span>
                      <span className="charLoc9">s</span>
                    </h5></a></li>
                    <li><a><h5 className="fancy_title9">
                      <span className="charSet1">S</span>
                      <span className="charSet2">e</span>
                      <span className="charSet3">t</span>
                      <span className="charSet4">t</span>
                      <span className="charSet5">i</span>
                      <span className="charSet6">n</span>
                      <span className="charSet7">g</span>
                      <span className="charSet8">s</span>
                    </h5></a></li>
  
                  </ul>
                </div>
                <div className="proheadNav companyProheadNav  col-lg-6 col-md-12 col-sm-12 col-xs-12">
                  <div className="progress">
                    <div className="progress-bar progress-bar-striped" role="progressbar"
                    aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"
                    style={this.props.companyProfileObj.companyProfilePercent ? {width: this.props.companyProfileObj.companyProfilePercent +'%'} : {width: 0+'%'}}>
                    </div>
                  </div>
                  <ul className="nav nav-pills pillsContent">
                    <li className="basic" onClick={this.basicActive.bind(this)}>
                      <a data-toggle="pill" href="#basic" className={this.props.companyProfileObj.profileBasicClass == '' || this.props.companyProfileObj.profileBasicClass == 'halfcompleteDetails' ? this.props.companyProfileObj.profileBasicClass+" smallFaPills" : "incompleteDetails smallFaPills"}>
                        <i className="fa fa-user"></i>
                        <i className={this.props.companyProfileObj.profileBasicStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.companyProfileObj.profileBasicStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.companyProfileObj.profileBasicStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                        title={this.props.companyProfileObj.profileBasicStatus == 'In Process' ? "Verification is in process." : this.props.companyProfileObj.profileBasicStatus == 'Reject' ? "Verification is rejected." : this.props.companyProfileObj.profileBasicStatus == 'Approved' ? "Verified" : ""}></i>
                      </a>
                    </li>
                    <li className="locations" onClick={this.locationsActive.bind(this)}>
                      <a data-toggle="pill" href="#locations" className={this.props.companyProfileObj.profileLocationClass == '' || this.props.companyProfileObj.profileLocationClass == 'halfcompleteDetails' ? this.props.companyProfileObj.profileLocationClass+ " smallFaPills" : "incompleteDetails smallFaPills"}>
                        <i className="fa fa-map-marker"></i>
                        <i className={this.props.companyProfileObj.profileLocationStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.companyProfileObj.profileLocationStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.companyProfileObj.profileLocationStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""}
                        title={this.props.companyProfileObj.profileLocationStatus == 'In Process' ? "Verification is in process." : this.props.companyProfileObj.profileLocationStatus == 'Reject' ? "Verification is rejected." : this.props.companyProfileObj.profileLocationStatus == 'Approved' ? "Verified" : ""}></i>
                      </a>
                    </li>
                    <li className="settings" onClick={this.settingsActive.bind(this)}>
                      <a data-toggle="pill" href="#settings" className={this.props.companyProfileObj.profileSettingClass == '' || this.props.companyProfileObj.profileSettingClass == 'halfcompleteDetails' ? this.props.companyProfileObj.profileSettingClass+" mediumFaPills" : "incompleteDetails mediumFaPills"}>
                        <i className="fa fa-cog"></i>
                        <i className={""/*this.props.userprofileObj.profileBasicStatus == 'In Process' ? "fa fa-warning text-warning warningProfile" : this.props.userprofileObj.profileBasicStatus == 'Reject' ? "fa fa-times-circle text-danger warningProfile" : this.props.userprofileObj.profileBasicStatus == 'Approved' ? "fa fa-check-circle text-success warningProfile" : ""*/}
                        title={""/*this.props.userprofileObj.profileBasicStatus == 'In Process' ? "Verification is in process." : this.props.userprofileObj.profileBasicStatus == 'Reject' ? "Verification is rejected." : this.props.userprofileObj.profileBasicStatus == 'Approved' ? "Verified" : ""*/}></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 headProgressNav">
                  <h5>Your profile is {this.props.companyProfileObj.companyProfilePercent ? this.props.companyProfileObj.companyProfilePercent : 0}% completed</h5>
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
                  <li className={this.props.currentLocation == '/companyForms/basic/'+this.props.companyProfileObj.companyAssureID || this.props.currentLocation == '/companyForms/basic' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight basic" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight basic"} onClick={this.basicActive.bind(this)}>
                    <a data-toggle="pill" href="#basic" className="noProfilePadding">
                      <i className="fa fa-user col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                      <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Basic Information
                        <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                      </span>
                    </a>
                  </li>
                  <li className={this.props.currentLocation == '/companyForms/locations/'+this.props.companyProfileObj.companyAssureID || this.props.currentLocation == '/companyForms/locations' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight locations" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight locations"} onClick={this.locationsActive.bind(this)}>
                    <a data-toggle="pill" href="#locations" className="noProfilePadding">
                      <i className="fa fa-map-marker col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                      <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Locations
                        <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                      </span>
                    </a>
                  </li>
                  <li className={this.props.currentLocation == '/companyForms/settings/'+this.props.companyProfileObj.companyAssureID || this.props.currentLocation == '/companyForms/settings' ? "active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight settings" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight settings"} onClick={this.settingsActive.bind(this)}>
                    <a data-toggle="pill" href="#settings" className="noProfilePadding">
                      <i className="fa fa-cog col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                      <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Settings
                        <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                      </span>
                    </a>
                  </li>
                 
                </ul>
              </div>
            </div>      
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyContent">
                <div className="tab-content">
                  <div id="basic" className={this.props.currentLocation == '/companyForms/basic/'+this.props.companyProfileObj.companyAssureID || this.props.currentLocation == '/companyForms/basic' ? "tab-pane fade in active" : "tab-pane fade"}>
                    <h4 className="">Basic Information</h4>
                    <hr className="profileMenuHR"/>
                    <CompanyBasicInfo key={this.props.companyProfileObj._id +'-basicInfo'} basicValues={this.props.companyProfileObj._id ? this.props.companyProfileObj : ''} companyLogo={this.props.imageLink} urlValues={this.props.url ? this.props.url : ""} />
                  </div>
                  <div id="locations" className={this.props.currentLocation == '/companyForms/locations/'+this.props.companyProfileObj.companyAssureID || this.props.currentLocation == '/companyForms/locations' ? "tab-pane fade in active" : "tab-pane fade"}>
                    <h4 className="">Locations</h4>
                    <hr className="profileMenuHR"/>
                    <CompanyLocationsInfo key={this.props.companyProfileObj._id +'-locationInfo'} companyProfile={this.props.companyProfileObj} />
                    <ListOfCompanyLocation key={this.props.companyProfileObj._id +'-listLocationInfo'} companyProfileId={this.props.companyProfileObj._id}  companyLocations={this.props.companyProfileObj.companyLocations} />
                  </div>
                  <div id="settings" className={this.props.currentLocation == '/companyForms/settings/'+this.props.companyProfileObj.companyAssureID || this.props.currentLocation == '/companyForms/settings' ? "tab-pane fade in active" : "tab-pane fade"}>
                    <h4 className="">Settings</h4>
                    <hr className="profileMenuHR"/>
                    <CompanySettingsInfo key={this.props.companyProfileObj._id +'-settingsInfo'} companyprofileobj ={this.props.companyProfileObj} companyProfileId={this.props.companyProfileObj._id} assureId={this.props.assureId}/>
                  </div>
                  <div id="viewCompany" className={this.props.currentLocation == '/companyForms/viewCompany/'+this.props.companyProfileObj.companyAssureID || this.props.currentLocation == '/companyForms/viewCompany' ? "tab-pane fade in active" : "tab-pane fade"}>
                    <h4 className="">Company Profile</h4>
                    <hr className="profileMenuHR"/>
                    <CompanyView key={this.props.companyProfileObj._id +'-viewInfo'} companyProfileId={this.props.companyProfileObj._id} assureId={this.props.assureId}/>
                  </div>
                </div>
              </div>
            </div>
            {<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyNews">
                <h4 className="">Company Employees</h4>
                <hr className="profileMenuHR" style={{width: 38+'%'}}/>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proNewsBlock nopadRight nopadLeft">
                  <CompanyEmployees authorisedpersons = {this.props.authorizedPersons}/>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
    );
  }
}
CreateCompanyContainer = withTracker(({props}) => {
  var id = Meteor.userId();
  const postHandle = Meteor.subscribe('tempCompanyImages',id);
  const loading    = !postHandle.ready();
 
  var currentLocation = FlowRouter.current().path;
  var splitUrl = currentLocation.split('/');
  var assureId = splitUrl[3];
  var url      = splitUrl[2];
  const postHandle1 = Meteor.subscribe('companyProfileData',assureId);
  const loading1    = !postHandle1.ready();

  var companyLogoImage = TempCompanyImages.findOne({'userId':id,'type':'companyProfile'});
  if(companyLogoImage){
    var imageLink = companyLogoImage.companyImage;
  }else{
    var imageLink = '';
  } 

  const companyProfileObj = CompanyProfile.findOne({'companyAssureID': assureId}) || {} ;
  if(companyProfileObj){
    const userHandle  = Meteor.subscribe('userData',companyProfileObj.userId);      
    const userDetails = Meteor.users.findOne({'_id':companyProfileObj.userId});
    if(userDetails){
      var authorizedPersons   =  userDetails.profile.authorizedPerson;  
      companyProfileObj.accessArray = userDetails.profile.authorizedPerson;
    }
  }
  
  
  return {
    loading,
    loading1,
    imageLink,
    companyProfileObj,
    currentLocation,
    assureId,
    url,
    authorizedPersons
  };
})(CreateCompany);

export default CreateCompanyContainer;