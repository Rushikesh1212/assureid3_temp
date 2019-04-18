import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { TempProofDocs } from "/imports/AssureID/userPortal/api/userProfile.js";
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import { Location } from "/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js";
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { College } from "/imports/admin/adminDashboard/masterData/college/api/College.js";
import { QualificationLevel } from "/imports/admin/adminDashboard/masterData/qualification/api/QualificationLevel.js";
// date parse function
toDate = function(datestr){
  return new Date(parseInt(datestr.substring(3)), parseInt(datestr.substring(0, 2)));
};

class EducationForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.academicsValues){
      this.state ={  
       "searchArray"              : [],
       "educationId"              : this.props.academicsValues.educationId,
       "educationLevel"           : this.props.academicsValues.educationLevel,
       "educationQualification"   : this.props.academicsValues.educationQualification,
       "educationMode"            : this.props.academicsValues.educationMode,
       "dateAttendedFrom"         : this.props.academicsValues.dateAttendedFrom,
       "dateAttendedTo"           : this.props.academicsValues.dateAttendedTo,
       "collegeName"              : this.props.academicsValues.collegeName,
       "university"               : this.props.academicsValues.university,
       "collegeAddress"           : this.props.academicsValues.collegeAddress,
       "city"                     : this.props.academicsValues.city,
       "state"                    : this.props.academicsValues.state,
       "rollNo"                   : this.props.academicsValues.rollNo,
       "specialization"           : this.props.academicsValues.specialization,
       "grades"                   : this.props.academicsValues.grades,
       "educationType"            : this.props.academicsValues.proofType,
       "editStatus"               : this.props.academicsValues.editStatus,
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
      this.state ={
       "searchArray"               : [],
       "educationId"               : '',
       "educationLevel"            : '',
       "educationQualification"    : '',
       "educationMode"             : '',
       "dateAttendedFrom"          : '',
       "dateAttendedTo"            : '',
       "collegeName"               : '',
       "university"                : '',
       "collegeAddress"            : '',
       "city"                      : '',
       "state"                     : '',
       "rollNo"                    : '',
       "specialization"            : '',
       "grades"                    : '',
       "educationType"             : '',
       "editStatus"                : '',
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }
   this.handleChange = this.handleChange.bind(this);
  }
  showDatePicker(event){
    event.preventDefault();
    var today = new Date();
    $(event.target).datepicker({
      format: 'mm/yyyy',
      todayHighlight: true,
      endDate: "today",
      maxDate: today,
      viewMode: "months", 
      minViewMode: "months"
    });
    var inputVal = $(event.target).val();
    this.setState({'dateAttendedFrom':inputVal});
  }
  showDatePicker1(event){
    event.preventDefault();
    $(event.target).datepicker({
      format: 'mm/yyyy',
      todayHighlight: true,
      viewMode: "months", 
      minViewMode: "months"
    });
    var inputVal = $(event.target).val();
    this.setState({'dateAttendedTo':inputVal});
  }
  handleChange(event){
   event.preventDefault();
   const target = event.target;
   const name   = target.name;
   this.setState({
    [name]: event.target.value,
   });
  }
  componentDidMount(){    
    $.validator.addMethod("regxEm1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    if(this.props.educationFormAdd){
      var validId = 'educationFormAdd';
    }else if(this.props.academicsValues){
      if(this.props.listEducation){
        var validId = 'educationForm'+this.props.indexValue;
      }else{
        var validId = 'editEducationForm'+this.props.indexValue;
      }
    }else{
      var validId = 'educationForm';
    }
  
    $("#"+validId).validate({
      rules: {
        city: {
          regxEm1: /^[a-zA-Z ]+$|^$/,
        },
        state: {
          regxEm1: /^[a-zA-Z ]+$|^$/,
        }
      }
    });
  }
  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      $(event.target).removeClass("has-content");
    }
  }
  editAcademics(event){
    event.preventDefault(); 
    var id          = Meteor.userId();
    var index       = $(event.target).attr('data-index');
    var educationId = this.state.educationId;
    var editstatus  = this.state.editStatus;
    if(this.props.academicsValues){
      if(this.props.academicsValues.proofOfDocument){
        var imgLink  = this.props.academicsValues.proofOfDocument;
        var fileName = this.props.academicsValues.fileName;
        var fileExt  = this.props.academicsValues.fileExt;
      }else if(this.props.proofObj.imageLink){
        var imgLink  = this.props.proofObj.imageLink;
        var fileName = this.props.proofObj.name;
        var fileExt  = this.props.proofObj.ext;
        var imgId    = this.props.proofObj._id;
      }else{
        var imgLink  = '';
        var fileName = '';
        var fileExt  = '';
      }
    }else if(this.props.proofData.imageLink){
      var imgLink  = this.props.proofData.imageLink;
      var fileName = this.props.proofData.name;
      var fileExt  = this.props.proofData.ext;
      var imgId    = this.props.proofData._id;
    }else{
      var imgLink  = '';
      var fileName = '';
      var fileExt  = '';
    }
    var education = {
      "educationId"               : parseInt(educationId),
      "educationLevel"            : this.refs.educationLevel.value,
      "educationQualification"    : this.refs.educationQualification.value,
      "specialization"            : this.refs.specialization.value,
      "grades"                    : this.refs.grades.value,
      "educationMode"             : this.refs.educationMode.value,
      "dateAttendedFrom"          : this.refs.dateAttendedFrom.value,
      "dateAttendedTo"            : this.refs.dateAttendedTo.value,
      "collegeName"               : this.refs.collegeName.value,
      "university"                : this.refs.university.value,
      "collegeAddress"            : this.refs.collegeAddress.value,
      "city"                      : this.refs.city.value,
      "state"                     : this.refs.state.value,
      "rollNo"                    : this.refs.rollNo.value,
      "proofType"                 : this.refs.educationType.value,
      "proofOfDocument"           : imgLink,
      "fileName"                  : fileName,
      "fileExt"                   : fileExt,
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open",
    }

    if(this.props.listEducation){
      var validId = 'educationForm'+this.props.indexValue;
    }else{
      var validId = 'editEducationForm'+this.props.indexValue;
    }

    if($('#'+validId).valid()){
      if(toDate(education.dateAttendedFrom).getTime() > toDate(education.dateAttendedTo).getTime()) {         
        swal("Date Attended From","is greater than To Date Attended To","error");
      }else{
        Meteor.call('updateEducation',id,education,index,function (error,result) {
         if(error){ 
            console.log(error.reason);  
          }else{
            $('#editacadamicinfo-'+index).modal('hide');
            $('#editAcadamicInfo-'+index).modal('hide');
            Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
              if (error) {
               console.log(error.reason);
              }else{  
              }
            });
            if (editstatus == "Reopen") {
              Meteor.call('updateTicketAfterReopen',id,"education",educationId,education); 
            } 
          }

          if($('.effect-21.proofType').hasClass('error')){
            $('.proofType.error').removeClass('error has-content');
          } 
        });
      }
    }else{
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    }
  }
  submitAcademicInfo(event){ 
    event.preventDefault(); 
    var id   = Meteor.userId();
    if(this.props.proofData.imageLink){
      var imgLink = this.props.proofData.imageLink;
      var fileName = this.props.proofData.name;
      var fileExt = this.props.proofData.ext;
      var imgId = this.props.proofData._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = ''; 
    } 

    var educationObj = UserProfile.findOne({"userId" : id}, {sort: {'education.educationId': -1}});
    if(educationObj){
     if (educationObj.education) {
        if (educationObj.education.length > 0 ) {
          var lastelem    = _.last(educationObj.education);
          var educationId =  parseInt(lastelem.educationId) + 1;
        }else{
        var educationId =  1; 
        }
      }else{
        var educationId =  1;
      }
    }
    
    var education = {
      "educationId"               : educationId,
      "educationLevel"            : this.refs.educationLevel.value,
      "educationQualification"    : this.refs.educationQualification.value,
      "specialization"            : this.refs.specialization.value,
      "grades"                    : this.refs.grades.value,
      "educationMode"             : this.refs.educationMode.value,
      "dateAttendedFrom"          : this.refs.dateAttendedFrom.value,
      "dateAttendedTo"            : this.refs.dateAttendedTo.value,
      "collegeName"               : this.refs.collegeName.value,
      "university"                : this.refs.university.value,
      "collegeAddress"            : this.refs.collegeAddress.value,
      "city"                      : this.refs.city.value,
      "state"                     : this.refs.state.value,
      "rollNo"                    : this.refs.rollNo.value,
      "proofType"                 : this.refs.educationType.value,
      "proofOfDocument"           : imgLink,
      "fileName"                  : fileName,
      "fileExt"                   : fileExt,
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open",
    }

    if(this.props.educationFormAdd){
      var validId = 'educationFormAdd';
    }else{
      var validId = 'educationForm';
    }

    if($('#'+validId).valid()){ 
      if(toDate(education.dateAttendedFrom).getTime() > toDate(education.dateAttendedTo).getTime()) {         
        swal("Date Attended From","is greater than To Date Attended To","error");
      }else{
        Meteor.call('insertEducation',id,education,function (error,result) {
          if(error){
            console.log(error.reason);
          }else{
          }
        });
        $(event.target).parent().find('select').val('-- Select --');
        this.setState({
          "educationQualification"    : '',
          "specialization"            : '',
          "grades"                    : '',
          "dateAttendedFrom"          : '',
          "dateAttendedTo"            : '',
          "collegeName"               : '',
          "university"                : '',
          "collegeAddress"            : '',
          "rollNo"                    : '',
          "educationType"             : '',
          "educationLevel"            : '',
          "educationMode"             : '',
          "state"                     : '',
          "city"                      : '',
        });  
        if(imgId != ''){
          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             console.log(error.reason);
            }else{  
            }
          });   
        }
        if($('.effect-21.proofType').hasClass('error')){
          $('.proofType.error').removeClass('error has-content');
        } 
      }     
    }else{
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    }
  }
  getUploadImagePercentage(){
    var uploadProgressPercent = Session.get("uploadProofDocProgressPercent");
    if(uploadProgressPercent){
      var percentVal = parseInt(uploadProgressPercent);
      if(percentVal){
          
          var styleC = {
              width:percentVal + "%",
              display:"block",
          }
          var styleCBar = {
              display:"block",
              marginTop:5,
          }
      }
      if(!percentVal){
          var percentVal = 0;

          var styleC = {
              width:0 + "%",
              display:"none",
          }
          var styleCBar = {
              display:"none",
              marginTop:5,
          }
      }

      return (
        <div className="progress"  style= {styleCBar}>
          <div className="progress-bar progress-bar-striped active" role="progressbar"
          aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
            {percentVal} %
          </div>
        </div>
      );
    }
  }
  uploadProofDocs(event){
    event.preventDefault();
    var proofSubtype = $(event.target).attr('data-subtype');
    let self = this;   
    Session.set("uploadProofDocProgressPercent","");
    
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var userId = Meteor.userId();
      if (file) {
        var fileName = file.name;
        var fileSize = file.size;
        var size = 2000000;
        var prooftype = "education";
        var ext = fileName.split('.').pop();
        $(event.target).parent().parent().find('.selectWidthEdu').addClass('otherDocSelect');
        $(event.target).parent().parent().find('.selectWidthEdu').find('label').css('fontWeight','100');
        $(event.target).parent().siblings('.fileName').css({'display':'block','marginTop':'1px','marginBottom':'0px'});
        $(event.target).parent().siblings('.fileName').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.fileName').find('label').html(file.name);
        if( ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){
          if(fileSize < size){
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').removeClass('error');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').html('');
            $(event.target).parent().parent().find('.selectWidthEdu').addClass('zeroMarginTop');
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);
            $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
          }else{
            $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').addClass('error');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').html('<p>Only jpg, png format is supported.</p>');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').css({'color':'#e40b0b','fontSize':'13px'});
            $(event.target).parent().siblings('.fileName').find('label').html("");
          }
        }
      }
    }else{
      swal('Please select the education prooftype.');
      $('#educationType').addClass('error has-content');
    }
  }
  inputFileChange(event){
    event.preventDefault();
    if(this.refs.educationType.value != '-- Select --'){
      $(event.target).siblings('.inputFiles').click();
    }else{
      swal('Please select the education prooftype.');
      $(event.target).parent().parent().siblings().find('#educationType').addClass('error has-content');
    }
  }
  removeProofDocs(event){
    event.preventDefault();
    var imgLink = $(event.target).attr('data-value');
    var proofSubtype = $(event.target).attr('data-subtype');
    var index = $(event.target).attr('data-index');
    if(index >= 0){
      var fileName = $(event.target).attr('data-name');
      var fileExt = $(event.target).attr('data-ext');
      Meteor.call("removeTempDocProofs",imgLink,fileName,fileExt,index,proofSubtype,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{
          // swal({
          //   position: 'top-right',
          //   type: 'success',
          //   title: 'Deleted Successfully',
          //   showConfirmButton: false,
          //   timer: 1500
          // });
        }
      });
    }else{
      Meteor.call("removeTempProofDocs",imgLink,(error, result)=>{
        if (error) {
           console.log(error.reason);
        }else{
          // swal({
          //   position: 'top-right',
          //   type: 'success',
          //   title: 'Deleted Successfully',
          //   showConfirmButton: false,
          //   timer: 1500
          // });
        }
      });
    }  
  }
  employementModal(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    $('#editacadamicinfo-'+index).animate({
      'scrollTop' : 0
    });
    $('#acadamicinfo').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#eduProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#eduProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#eduProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#eduProofModals').css('display','block');
    }
  }
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#eduProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#eduProofModals').css('display','none');
  }
  buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
      return "(?=.*" + word + ")";
    });

    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
  }

  getTextValueWhenType(event){
    var textValue= $(event.target).val();
    if(textValue != ""){
      var RegExpBuildValue = this.buildRegExp(textValue); 
      var searchData = College.find({$or:[{'collegeName':RegExpBuildValue},{"universityName":RegExpBuildValue}]}).fetch();
      if(searchData){
        if($(event.target).hasClass('university')){
          var pluckUniversity  = _.pluck(searchData,"universityName");
          var uniqueUniversity = _.uniq(pluckUniversity);
          this.setState({"searchArray":uniqueUniversity});
        }else if($(event.target).hasClass('college')){
          var pluckCollege  = _.pluck(searchData,"collegeName");
          var uniqueCollege = _.uniq(pluckCollege);
          this.setState({"searchArray":uniqueCollege});
        }
      }else{
      }

      var searchLocation = Location.find({$or:[{'city':RegExpBuildValue},{"state":RegExpBuildValue}]}).fetch();
      if(searchLocation){
        if($(event.target).hasClass('city')){
          var pluckCity = _.pluck(searchLocation,"city");
          var uniqueCity = _.uniq(pluckCity);
          this.setState({"searchArray":uniqueCity});
        }else if($(event.target).hasClass('state')){
          var pluckState = _.pluck(searchLocation,"state");
          var uniqueState = _.uniq(pluckState);
          this.setState({"searchArray":uniqueState});
        }
      }else{
      }

      var searchQualData = QualificationLevel.find({'QualificationLevelTitle':RegExpBuildValue}).fetch();
      if(searchQualData){
        if($(event.target).hasClass('qualification')){
          var pluckQualification  = _.pluck(searchQualData,"QualificationLevelTitle");
          var uniqueQualification = _.uniq(pluckQualification);
          this.setState({"searchArray":uniqueQualification});
        }
      }else{
      }
    }else{
      this.setState({"searchArray":[]});
      $(event.target).val('');
    }
  }

  render(){
    return(
      <form className="educationForm basicForm" id={this.props.educationFormAdd ? "educationFormAdd" : this.props.academicsValues ? this.props.listEducation ? "educationForm" + this.props.indexValue : "editEducationForm" + this.props.indexValue : "educationForm"}> 
        <div className="form-group col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <select className={this.state.educationLevel ? this.state.educationLevel != '-- Select --' ? "effect-21 form-control loginInputs has-content required" : "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs required"} id="educationLevel" name="educationLevel" ref="educationLevel" defaultValue={this.state.educationLevel ? this.state.educationLevel : '-- Select --'} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}>
              <option disabled="disabled">-- Select --</option>
              <option>Post Graduation</option>
              <option>Graduation</option>
              <option>Diploma</option>
              <option>HSC</option> 
              <option>SSC</option>
              <option>Below Matriculation</option>
              <option>Others</option>
            </select>       
            <label>Qualification Level<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" autoComplete="on" list="autoQualification" className={this.state.educationQualification != '' ? "effect-21 form-control loginInputs has-content qualification required" : "effect-21 form-control loginInputs qualification required"} id="educationQualification" name="educationQualification" ref="educationQualification" value={this.state.educationQualification} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
            <label>Qualification<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
          <datalist className="autocomplete" id="autoQualification">
            { 
              this.state.searchArray.map((searchDetails, index)=>{
                return(
                  <option value={searchDetails} key={searchDetails + '-searchQualification'} />                        
                );
              })
            }
          </datalist>
        </div>
        <div className="form-group col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.specialization != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="specialization" name="specialization" ref="specialization" value={this.state.specialization} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Specialization</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.grades != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="grades" name="grades" ref="grades"  value={this.state.grades} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Grades / Percentage</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <select className={this.state.educationMode ? this.state.educationMode != '-- Select --' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="educationMode" name="educationMode" ref="educationMode" defaultValue={this.state.educationMode ? this.state.educationMode : '-- Select --'} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}>
              <option disabled="disabled">-- Select --</option>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Distance</option>
            </select> 
            <label>Mode</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 "> 
          <label style={{marginTop: "10"+"px"}}>Dates Attended (MM/YYYY)</label>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group"> 
           <span className="input-group-addon addons " id="basic-addon1"><i className="fa fa-calendar" aria-hidden="true"></i></span>
            <input type="text" className={this.state.dateAttendedFrom != '' ? "effect-21 form-control loginInputs has-content required" : "effect-21 form-control loginInputs required"} id="dateAttendedFrom" name="dateAttendedFrom" ref="dateAttendedFrom" value={this.state.dateAttendedFrom} onChange={this.handleChange}  onBlur={this.inputEffect.bind(this)} onFocus={this.showDatePicker.bind(this)}/>
            <label className="">From<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons " id="basic-addon1"><i className="fa fa-calendar" aria-hidden="true"></i></span>
            <input type="text" className={this.state.dateAttendedTo != '' ? "effect-21 form-control loginInputs has-content required" : "effect-21 form-control loginInputs required"} id="dateAttendedTo" name="dateAttendedTo" ref="dateAttendedTo" value={this.state.dateAttendedTo} onChange={this.handleChange}  onBlur={this.inputEffect.bind(this)} onFocus={this.showDatePicker1.bind(this)}/>
            <label className="">To<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons UniversityAddons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" autoComplete="on" list="autoUniversity" className={this.state.university != '' ? "effect-21 form-control loginInputs has-content university required" : "effect-21 form-control loginInputs university required"} id="university" name="university" ref="university" value={this.state.university} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
            <label>University<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
          <datalist className="autocomplete" id="autoUniversity">
            { 
              this.state.searchArray.map((searchDetails, index)=>{
                return(
                  <option value={searchDetails} key={searchDetails + '-searchUniversity'} />                        
                );
              })
            }
          </datalist>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons UniversityAddons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" autoComplete="on" list="autoCollege" className={this.state.collegeName != '' ? "effect-21 form-control loginInputs has-content college required" : "effect-21 form-control loginInputs college required"} id="collegeName" name="collegeName" ref="collegeName" value={this.state.collegeName} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
            <label>College / Institute<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
          <datalist className="autocomplete" id="autoCollege"> 
            { 
              this.state.searchArray.map((searchDetails, index)=>{
                return(
                  <option value={searchDetails} key={searchDetails + '-searchCollege'} />                        
                );
              })
            }
          </datalist>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-building-o" aria-hidden="true"></i></span>
            <textarea className={this.state.collegeAddress != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} onBlur={this.inputEffect.bind(this)} id="collegeAddress" name="collegeAddress" ref="collegeAddress" onChange={this.handleChange} value={this.state.collegeAddress} ></textarea>
            <label>College Address</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" autoComplete="on" className={this.state.city != '' ? "effect-21 form-control loginInputs has-content city required" : "effect-21 form-control loginInputs city required"} list="autoCityInEdu" id="city" name="city" ref="city"  value={this.state.city} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
            <label>City<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
          <datalist className="autocomplete" id="autoCityInEdu">
            { 
              this.state.searchArray.map((searchDetails, index)=>{
                return(
                  <option value={searchDetails} key={searchDetails + '-searchCity'}>{searchDetails}</option>                        
                );
              })
            }
          </datalist>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" autoComplete="on"  className={this.state.state != '' ? "effect-21 form-control loginInputs has-content state required" : "effect-21 form-control loginInputs state required"} list="autoStateInEdu" id="state" name="state" ref="state"  value={this.state.state} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>State<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div> 
           <datalist className="autocomplete" id="autoStateInEdu">
            { 
              this.state.searchArray.map((searchDetails, index)=>{
                return(
                  <option value={searchDetails} key={searchDetails + '-searchState'}>{searchDetails}</option>                        
                );
              })
            }
          </datalist>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
          <div className="input-effect input-group">
            <span className="input-group-addon addons UniversityAddons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.rollNo != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="rollNo" name="rollNo" ref="rollNo" onChange={this.handleChange} value={this.state.rollNo}  onBlur={this.inputEffect.bind(this)}/>
            <label>Regn No. / Roll No. / Seat No.</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <select className={this.state.educationType ? this.state.educationType != '-- Select --' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} id="educationType" name="educationType" ref="educationType" value={this.state.educationType ? this.state.educationType : '-- Select --'} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}>
                <option disabled="disabled">-- Select --</option>
                <option>Certificate</option>
                <option>Provisional Degree</option>
                <option>Degree</option>
                <option>Marksheet</option>
              </select> 
              <label>Education Proof Type</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          {
            !this.props.proofData.imageLink && !this.props.academicsValues ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthEdu">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Education</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButtonEdu">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="basicEducation" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                  <div id="errorProofEdu"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            this.props.academicsValues ?
              this.props.academicsValues.proofOfDocument ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                {
                  this.props.academicsValues.fileExt == 'jpg' || this.props.academicsValues.fileExt == 'png' || this.props.academicsValues.fileExt == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img src={this.props.academicsValues.proofOfDocument} className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.academicsValues.proofOfDocument} data-name={this.props.academicsValues.fileName} data-ext={this.props.academicsValues.fileExt} data-index={this.props.indexValue} data-subtype="editBasicEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.academicsValues.fileName}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.academicsValues.proofOfDocument} data-name={this.props.academicsValues.fileName} data-ext={this.props.academicsValues.fileExt} data-index={this.props.indexValue} data-subtype="editBasicEducation"></i>
                  </div>
                }   
              </div> 
              :
              this.props.proofObj.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                {
                  this.props.proofObj.ext == 'jpg' || this.props.proofObj.ext == 'png' || this.props.proofObj.ext == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} src={this.props.proofObj.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editBasicEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editBasicEducation"></i>
                  </div>
                }   
              </div> 
            : 
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthEdu">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Education</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButtonEdu">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="editBasicEducation" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                  <div id="errorProofEdu"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            this.props.proofData.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                {
                  this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} src={this.props.proofData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="basicEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="basicEducation"></i>
                  </div>
                }   
              </div> 
            : 
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthEdu">
                <div className="input-effect input-group">
                  <label className="empLabelMarTop">Proof of Education</label>&nbsp;&nbsp;
                </div>
              </div>
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileName" style={{display: "none"}}>
                <div className="input-effect input-group">
                  <label></label>
                </div>
              </div>
              <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButtonEdu">
                <input type="file" className="btn btn-info inputFiles" data-subtype="basicEducation" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                <div id="errorProofEdu"></div>
                {this.getUploadImagePercentage()}
              </div>
            </div>
          }
        </div>
        <div className="modal fade" id="eduProofModals" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  { 
                    this.props.academicsValues ?
                      this.props.academicsValues.proofOfDocument ?
                        this.props.academicsValues.fileExt == 'jpg' || this.props.academicsValues.fileExt == 'png' || this.props.academicsValues.fileExt == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.academicsValues.proofOfDocument} style={{width: "100"+"%"}} />
                        </div>
                        :
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <iframe src={this.props.academicsValues.proofOfDocument} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                        </div>
                      :
                      this.props.proofObj.imageLink ?
                        this.props.proofObj.ext == 'jpg' || this.props.proofObj.ext == 'png' || this.props.proofObj.ext == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.proofObj.imageLink} style={{width: "100"+"%"}} />
                        </div>
                        :
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <iframe src={this.props.proofObj.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                        </div>
                      :
                      "" 
                    :
                    this.props.proofData ?
                      this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.proofData.imageLink} style={{width: "100"+"%"}} />
                        </div>
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <iframe src={this.props.proofData.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                      </div>
                    :  
                    ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div> 
        <button type="submit" className="btn btn-info pull-right" onClick={this.props.academicsValues ? this.editAcademics.bind(this) : this.submitAcademicInfo.bind(this)} data-index={this.props.indexValue}>Save</button>
      </form>
    );
  }
}
EditPageContainer = withTracker(({props}) => {
    var _id           = Meteor.userId();
    const postHandle  = Meteor.subscribe('TempProofDocs',_id);
    const postHandle1 = Meteor.subscribe('qualificationLevel');
    const postHandle2 = Meteor.subscribe('college');
    var proofData     = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'education','proofSubtype':'basicEducation'}) || {};
    var proofObj      = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'education','proofSubtype':'editBasicEducation'}) || {};
    const loading     = !postHandle.ready();
    return {
      loading,
      proofData,
      proofObj,
    };
})(EducationForm);
export default EditPageContainer;