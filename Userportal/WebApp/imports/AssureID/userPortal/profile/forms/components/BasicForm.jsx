import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";

export default class BasicForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "firstName"        : this.props.basicValues.firstName,
      "lastName"         : this.props.basicValues.lastName,
      "fatherFirstName"  : this.props.basicValues.fatherFirstName,
      "fatherLastName"   : this.props.basicValues.fatherLastName,
      "motherFirstName"  : this.props.basicValues.motherFirstName,
      "motherLastName"   : this.props.basicValues.motherLastName,
      "spouseFirstName"  : this.props.basicValues.spouseFirstName,
      "spouseLastName"   : this.props.basicValues.spouseLastName,
      "gender"           : this.props.basicValues.gender,
      "dateofbirth"      : this.props.basicValues.dateOfBirth,
      "mobileNo"         : this.props.basicValues.mobileNo,
      "altMobileNo"      : this.props.basicValues.altMobileNo,
      "emailId"          : this.props.basicValues.emailId,
      "altEmailId"       : this.props.basicValues.altEmailId,
      "proofType"        : this.props.basicValues.proofType,
      "subscription" : { 
      } 
    };
   this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps() {
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
  
    this.setState({
      [name]: event.target.value,
    });
  }
  currentGender(event){
    if($(event.target).is(':checked')){
      var inputVal = $(event.target).val();
      this.setState({'gender':inputVal});
    }
  }
  showDatePicker(event){
    event.preventDefault();
    $(event.target).datepicker({
      // autoclose: true,
      todayHighlight: true
    });
    var inputVal = $(event.target).val();
    this.setState({'dateofbirth':inputVal});
  }
  componentDidMount(){
    $.validator.addMethod("regx1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");
    $.validator.addMethod("regx2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $.validator.addMethod("regx3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid mobile number.");
    $.validator.addMethod("regx4", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid phone number.");
    jQuery.validator.addMethod("notEqual", function(value, element, param) {
      return this.optional(element) || value != param;
    }, "Please specify a different value");
       
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    
    $("#basicForm").validate({
      rules: {
        firstName: {
          required: true,
          regx1: /^[a-zA-Z ]+$/,
        },
        lastName: {
          required: true,
          regx1: /^[a-zA-Z ]+$/,
        },
        fatherFirstName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        }, 
        fatherLastName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        motherFirstName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        motherLastName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        spouseFirstName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        spouseLastName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        mobileNo: {
          required: true,
          regx3: /^([0]|\+91)?[789]\d{9}$/,
        },
        altMobileNo: {
          notEqual: $('#mobileNo').val(),
          regx4: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
        },
        emailId: {
          required: true,
          regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
        },
        altEmailId: {
          notEqual: $('#emailId').val(),
          regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/, 
        }
      }
    });
    $("#basicFormEdit").validate({
      rules: {
        firstName: {
          required: true,
          regx1: /^[a-zA-Z ]+$/,
        },
        lastName: {
          required: true,
          regx1: /^[a-zA-Z ]+$/,
        },
        fatherFirstName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        fatherLastName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        motherFirstName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        motherLastName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        spouseFirstName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        spouseLastName: {
          regx1: /^[a-zA-Z ]+$|^$/,
        },
        mobileNo: {
          required: true,
          regx3: /^([0]|\+91)?[789]\d{9}$/,
        },
        altMobileNo: {
          notEqual: $('#mobileNo').val(),
          regx4: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
        },
        emailId: {
          required: true,
          regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
        },
        altEmailId: {
          notEqual: $('#emailId').val(),
          regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/, 
        },
      }
    });      
  }
  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      if($('.effect-21').hasClass('error')){
        $(event.target).find('.effect-21.error').addClass('has-content');  
      }else{
        $(event.target).removeClass("has-content");
      }
    }
  }
  basicForm(event){
    event.preventDefault();
    var userId = Meteor.userId();
    var validForm = $(event.target).attr('id');

    if($('#'+validForm).valid()){
      var formValues = {
        "userId"          : userId,
        "firstName"       : this.refs.firstName.value,
        "lastName"        : this.refs.lastName.value,
        "fatherFirstName" : this.refs.fatherFirstName.value,
        "fatherLastName"  : this.refs.fatherLastName.value,
        "motherFirstName" : this.refs.motherFirstName.value,
        "motherLastName"  : this.refs.motherLastName.value,
        "spouseFirstName" : this.refs.spouseFirstName.value,
        "spouseLastName"  : this.refs.spouseLastName.value,
        "gender"          : this.state.gender,
        "dateOfBirth"     : this.refs.dateofbirth.value,
        "mobileNo"        : this.refs.mobileNo.value,
        "altMobileNo"     : this.refs.altMobileNo.value,
        "emailId"         : this.refs.emailId.value,
        "altEmailId"      : this.refs.altEmailId.value,
        "proofType"       : this.refs.proofType.value,
        "companyReferences" : [],
      }
      
      var getuserProfileData = UserProfile.find({}).fetch();
      if (getuserProfileData) {
        var getuserProfileCount = getuserProfileData.length;
        if (getuserProfileCount == 0) {
          Meteor.call("insertBasicData",formValues, function(error,result){
            if(error){
              console.log(error.reason);
            }else{
              // swal("Done","Basic Information inserted successfully!"); 
            }
          });  
        }else{
          var userProfileObj = UserProfile.findOne({"userId" : Meteor.userId()});
          if (userProfileObj) {
            var getuserId = userProfileObj.userId;
            Meteor.call("updateBasicData",getuserId,formValues, function(error,result){
              if(error){
                console.log(error.reason);
              }else{
                // swal("Done","Basic Information updated successfully!");   
              }
            });  
          }
        }
        if($('#home').hasClass('in active')){
          FlowRouter.go('/profileForms/menu4');
          $('html, body').animate({
            'scrollTop' : $(".profileBody").position().top
          });
          $('#home').removeClass('in active');
          $('.home').removeClass('active');
          $('#menu4').addClass('in active');
          $('.menu4').addClass('active');
        }else{
          $('#basicinfo').modal('hide');
          $('#basicinfoModal').modal('hide');
        }

        if($('.effect-21.proofType').hasClass('error')){
          $('.proofType.error').removeClass('error has-content');
        }
      }
    }else{
      $(event.target).find('.effect-21.error').addClass('has-content');
    }
  }
  inputFileChange(event){
    event.preventDefault();
    if(this.refs.proofType.value != '-- Select --'){
      $(event.target).siblings('.inputFiles').click();
    }else{
      swal('Please select the basic prooftype.');
      $('#proofType').addClass('error has-content');
    }
  }
  uploadProofDocs(event){
    event.preventDefault();
    var proofSubtype = '';
    let self = this; 
    Session.set("uploadProofDocProgressPercent","");
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var userId = Meteor.userId();
      if (file) {
        var fileName = file.name;
        var fileSize = file.size;
        var size = 2000000;
        var prooftype = "basic";
        var ext = fileName.split('.').pop();
        $(event.target).parent().siblings('.selectWidth').addClass('documentSelect');
        $(event.target).parent().siblings('.selectWidth').find('label').css('fontWeight','100');
        $(event.target).parent().siblings('.fileNameDiv').css({'display':'block','marginTop':'1px','marginBottom':'0px'});
        $(event.target).parent().siblings('.fileNameDiv').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.fileNameDiv').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.basicProgressDiv').css('display','block');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').removeClass('error');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').html('');
            $(event.target).parent().siblings('.fileNameDiv').css('border','0px');
            addProofToS3Function(userId,file,prooftype,proofSubtype,self); 
          }else{
            $(event.target).parent().siblings('.basicProgressDiv').css('display','block');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').addClass('error');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').html('<p>Document size should not exceed file size limit 2MB.</p>');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').css({'color':'#e40b0b','fontSize':'13px'});
          } 
        }else{
          $(event.target).parent().siblings('.basicProgressDiv').css('display','block');
          $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').addClass('error');
          $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').html('<p>Only jpg, png, pdf format is supported.</p>');
          $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').css({'color':'#e40b0b','fontSize':'13px'});
        }
      }
    }    
  }
  removeProofDocs(event){
    event.preventDefault();
    $('.selectWidth').removeClass('zeroMarginTop');
    $('.selectWidth').removeClass('documentSelect');
    var imgLink = $(event.target).attr('data-value');
    var filename = this.props.basicValues.fileName;
    var fileext = this.props.basicValues.fileExt;
    Meteor.call("removeBasicProof",imgLink,filename,fileext,(error, result)=>{
      // swal({
      //   position: 'top-right',
      //   type: 'success',
      //   title: 'Deleted Successfully',
      //   showConfirmButton: false,
      //   timer: 1500
      // });
    });
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
  proofModals(event){
    event.preventDefault();
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#proofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#proofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#proofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#proofModals').css('display','block');
    }
  }
  proofInfoModal(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent().siblings('#proofInfoModal').addClass('in');
    $(event.target).parent().parent().parent().parent().siblings('#proofInfoModal').css('display','block');
  }
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#proofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#proofModals').css('display','none');
  }
  closeProofInfoModal(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#proofInfoModal').removeClass('in');
    $(event.target).parent().parent().parent().parent('#proofInfoModal').css('display','none');
  }

  render(){
    return (
      <form className="basicForm" id={this.props.basicEdit ? "basicFormEdit" : "basicForm"} onSubmit={this.basicForm.bind(this)}>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.firstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="firstName" name="firstName" ref="firstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.firstName}/>
            <label>First Name<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span> 
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.lastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="lastName" name="lastName" ref="lastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.lastName}/>
            <label>Last Name<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.fatherFirstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="fatherFirstName" name="fatherFirstName" ref="fatherFirstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.fatherFirstName}/>
            <label>Father's First Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.fatherLastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="fatherLastName" name="fatherLastName" ref="fatherLastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.fatherLastName}/>
            <label>Father's Last Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.motherFirstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="motherFirstName" name="motherFirstName" ref="motherFirstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.motherFirstName}/>
            <label>Mother's First Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.motherLastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="motherLastName" name="motherLastName" ref="motherLastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.motherLastName}/>
            <label>Mother's Maiden Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.spouseFirstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="spouseFirstName" name="spouseFirstName" ref="spouseFirstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.spouseFirstName}/>
            <label>Spouse's First Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.spouseLastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="spouseLastName" name="spouseLastName" ref="spouseLastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.spouseLastName}/>
            <label>Spouse's Last Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-group"> 
              <label style={{marginRight: "5"+"px"}}>Gender<span className="astrikReq">*</span></label>
              <label className="radio-inline"><input type="radio" name="gender" value="Female" ref="gender" defaultChecked={this.state.gender === 'Female'} onChange={this.currentGender.bind(this)} />Female</label>
              <label className="radio-inline"><input type="radio" name="gender" value="Male" ref="gender" defaultChecked={this.state.gender === 'Male'} onChange={this.currentGender.bind(this)} />Male</label>
              <label className="radio-inline"><input type="radio" name="gender" value="Other" ref="gender" defaultChecked={this.state.gender === 'Other'} onChange={this.currentGender.bind(this)} />Other</label>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="text" className={this.state.dateofbirth == '' ? "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs has-content required"} id="dateofbirth" name="dateofbirth"  ref="dateofbirth"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onFocus={this.showDatePicker.bind(this)} value={this.state.dateofbirth}/>
              <label className="">Date of Birth<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <select className={this.state.proofType ? this.state.proofType != '-- Select --' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} id="proofType" name="proofType" ref="proofType" defaultValue={this.state.proofType ? this.state.proofType : "-- Select --"} onBlur={this.inputEffect.bind(this)}>
                <option disabled="disabled">-- Select --</option>
                <option>Birth Certificate</option>
                <option>Aadhar Card</option>
                <option>School Leaving Certificate</option>
              </select> 
              <label>Basic Proof Type</label>
              <span className="focus-border"> 
                <i></i>
              </span>
            </div>
          </div>
          { 
            !this.props.basicValues.proofOfDocument ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidth" style={{paddingRight: "0"}}>
                  <div className="input-effect input-group">
                    <label className="">Proof of Date of Birth</label>&nbsp;&nbsp;
                    <i className="fa fa-question-circle-o proQuestion" aria-hidden="true" onClick={this.proofInfoModal.bind(this)}></i>
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileNameDiv" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButton">
                  <input type="file" className="btn btn-info inputFiles" name="inputFile" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress basicProgressDiv" style={{display: "none"}}>
                  <div id="errorProofList"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
              { 
                this.props.basicValues.proofOfDocument ?
                  this.props.basicValues.fileExt == 'jpg' || this.props.basicValues.fileExt == 'png' || this.props.basicValues.fileExt == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" src={this.props.basicValues.proofOfDocument} onClick={this.proofModals.bind(this)} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.basicValues.proofOfDocument}></i>
                    </div>
                  :
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <a href="" onClick={this.proofModals.bind(this)}><i className="fa fa-file"></i> {this.props.basicValues.fileName}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.basicValues.proofOfDocument}></i>
                  </div>
                :
                ""
              }
            </div>
          }
          
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
            <input type="text" className={this.state.mobileNo =='' ? "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs has-content required"} id="mobileNo" name="mobileNo" ref="mobileNo" onBlur={this.inputEffect.bind(this)} value={this.state.mobileNo} readOnly/>
            <label>Phone No.<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
            <input type="text" className={this.state.altMobileNo =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="altMobileNo" name="altMobileNo" ref="altMobileNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.altMobileNo}/>
            <label>Alternate Phone No.</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
            <input type="email" className={this.state.emailId =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="emailId" name="emailId" ref="emailId" aria-label="Email Id" onBlur={this.inputEffect.bind(this)} value={this.state.emailId} readOnly/>
            <label>Email Id<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
            <input type="email" className={this.state.altEmailId =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="altEmailId" name="altEmailId" ref="altEmailId" aria-label="Email Id" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.altEmailId}/>
            <label>Alternate Email Id</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <button type="submit" className="btn btn-info pull-right">Save</button>
        
        <div className="modal fade proofInfoModals" id="proofInfoModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" onClick={this.closeProofInfoModal.bind(this)}>&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="logoWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center noProfilePadding">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/>
                  </div> 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h5><b>What are applicable proof for Date of Birth? Use any one.</b></h5>
                    <ul>
                      <li><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;<span>Birth Certificate</span></li>
                      <li><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;<span>Aadhar Card</span></li>
                      <li><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;<span>School Leaving Certificate</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="proofModals" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  { 
                    this.props.basicValues.proofOfDocument ?
                      this.props.basicValues.fileExt == 'jpg' || this.props.basicValues.fileExt == 'png' || this.props.basicValues.fileExt == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.basicValues.proofOfDocument} style={{width: "100"+"%"}} />
                        </div>
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <iframe src={this.props.basicValues.proofOfDocument} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                      </div>
                    :
                    ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>     
      </form>
    );
  }
}