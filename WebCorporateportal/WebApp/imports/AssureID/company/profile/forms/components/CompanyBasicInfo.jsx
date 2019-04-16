import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { TempCompanyImages } from "/imports/AssureID/company/profile/api/companyProfile.js";
import { CompanyProfile }from '/imports/AssureID/company/profile/api/companyProfile.js';
import { UserProfile } from "/imports/AssureID/user/api/userProfile.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

class CompanyBasicInfo extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.basicValues){
      this.state ={ 
        "companyName"             : this.props.basicValues.companyName,
        "companyPanNo"            : this.props.basicValues.companyPanNo,
        "contactPersonDesignation": this.props.basicValues.contactPersonDesignation,
        "companyEmail"            : this.props.basicValues.companyEmail,
        "contactNo1"              : this.props.basicValues.contactNo1,
        "assureId"                : this.props.basicValues.companyAssureID,
        "_id"                     : this.props.basicValues._id,  
        "companyLogo"             : this.props.basicValues.companyLogo,
        "contactNo2"              : this.props.basicValues.contactNo2,
        "companycinNo"            : this.props.basicValues.companycinNo,
        "companyAddress"          : this.props.basicValues.companyAddress,
        "companyCity"             : this.props.basicValues.companyCity,
        "companyState"            : this.props.basicValues.companyState,
        "companyCountry"          : this.props.basicValues.companyCountry,
        "companyPincode"          : this.props.basicValues.companyPincode, 
        "HREmail"                 : this.props.basicValues.HREmail,
        "companyDescription"      : this.props.basicValues.companyDescription,
        "companyWebsite"          : this.props.basicValues.companyWebsite,
        "accessArray"              :this.props.basicValues.accessArray,
        "subscription" : { 
        } 
      };
    }else{
      this.state ={ 
        "companyName"                : '',
        "companyPanNo"               : '',
        "contactPersonDesignation"   : '',
        "website"                    : '',
        "companyEmail"               : '',
        "contactNo1"                 : '',
        "contactNo2"                 : '',
        "companycinNo"               : '',
        "companyAddress"             : '',
        "companyCity"                : "",
        "companyState"               : "",
        "companyCountry"             : "",
        "companyPincode"             : "",
        "HREmail"                    : '',
        "companyDescription"         : '',
        "companyWebsite"             : "",
        "accessArray"              : [],
        "subscription" : { 
        } 
      };
    }
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
  componentDidMount(){
    $.validator.addMethod("regCx4", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please Enter in (www.xyz.com / www.xyz.in)");
    $.validator.addMethod("regCx6", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter only text.");
    $.validator.addMethod("regCx3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid mobile number.");
    $.validator.addMethod("regCx8", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid CIN number (L27100MH2015PTC000260).");
    $.validator.addMethod("regCx5", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid pan card number.");
    $.validator.addMethod("regCx7", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid pincode.");
    $.validator.addMethod("regCx2", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid email.");
    $.validator.addMethod("regx9", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid name.");
    $.validator.addMethod("regxMessage", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain alphanumeric and some special character.");
   


    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });



    if(this.props.basicValues){
      if(this.props.basicEdit){
        var validId = "basicEdit";
      }else{
        var validId = "basicFormEdit";
      }
    }
    $("#basicForm").validate({
      rules: {
         companyWebsite: {
          // required: true,
          regCx4: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$|^$/,
          
        },
        companyPanNo:{
          regCx5 : /^([a-zA-Z]){3}([CHFATBLJG]){1}([a-zA-Z]){1}([0-9]){4}([a-zA-Z]){1}$|^$/ 
        },
        companyCity : {
          regCx6: /^[a-zA-Z]+$|^$/,
        },
        companyState : {
          regCx6: /^[a-zA-Z]+$|^$/,
        },
        companyCountry : {
          regCx6: /^[a-zA-Z]+$|^$/,
        },
        companyPincode : {
          regCx7: /^[0-9]{6}$|^$/,
        },
        // companyState : {
        //   regCx6: /^[a-zA-Z]+$/,
        // },        
        companycinNo : {
          // required: true,          
          regCx8:  /^([LU]{1}\d{5}[A-Z]{2}\d{4}[PLCT]{3}\d{6})$/,
        },
        companyName:{
          regx9:/^[a-zA-Z0-9&()-_ ]+$/
        },
        companyAddress:{
          regxMessage :/^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/
        },
        companyDescription:{
          regxMessage :/^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/
        }
      },
    });
    $("#"+validId).validate({
      rules: {     
        companyWebsite: {
          // required: true,
          regCx4: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$|^$/,
          
        },
        companyPanNo:{
          regCx5 : /^([a-zA-Z]){3}([CHFATBLJG]){1}([a-zA-Z]){1}([0-9]){4}([a-zA-Z]){1}$|^$/ 
        },
        companyCity : {
          regCx6: /^[a-zA-Z]+$|^$/,
        },
        companyState : {
          regCx6: /^[a-zA-Z]+$|^$/,
        },
        companyCountry : {
          regCx6: /^[a-zA-Z]+$|^$/,
        },
        companyPincode : {
          regCx7: /^[0-9]{6}$|^$/,
        },
        // companyState : {
        //   regCx6: /^[a-zA-Z]+$/,
        // },        
        companycinNo : {
          // required: true,          
          regCx8:  /^([LU]{1}\d{5}[A-Z]{2}\d{4}[PLCT]{3}\d{6})$/,
        },
        companyName:{
          regx9:/^[a-zA-Z0-9&()-_ ]+$/
        },
        companyAddress:{
          regxMessage :/^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/
        },
        companyDescription:{
          regxMessage :/^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/
        }
      },//EOF rules

      // errorPlacement: function(error, element) {   
      //   if (element.attr("name") == "companyWebsite"){      
      //     error.insertAfter("#companyWebsiteError");  
      //   }
      //   if (element.attr("name") == "companycinNo"){      
      //     error.insertAfter("#companycinNoError");  
      //   }
      //   if (element.attr("name") == "companyPanNo"){      
      //     error.insertAfter("#companyPanNoError");  
      //   } 
      //   if (element.attr("name") == "companyCity"){      
      //     error.insertAfter("#companyCityError");  
      //   } 
      //   if (element.attr("name") == "companyState"){      
      //     error.insertAfter("#companyStateError");  
      //   } 
      //   if (element.attr("name") == "companyCountry"){      
      //     error.insertAfter("#companyCountryError");  
      //   } 
      //   if (element.attr("name") == "companyPincode"){      
      //     error.insertAfter("#companyPincodeError");  
      //   }
      //   if (element.attr("name") == "companyName"){      
      //     error.insertAfter("#companyNameError");  
      //   }
      //   if (element.attr("name") == "companyLogo"){      
      //     error.insertAfter("#companyLogoError");  
      //   }
      // }//EOF Error
      
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
    
    var userId    = Meteor.userId();
    var validForm = $(event.target).attr('id');    
    // if(this.props.proofData){
    //   var proofOfDocument = this.props.proofData.companyImage;
    //   var fileName = this.props.proofData.companyFileName;
    //   var fileExt = this.props.proofData.companyFileExt;
    // }else{
    //   var proofOfDocument = '';
    //   var fileName = '';
    //   var fileExt = '';
    // }

    if(this.props.companyLogo && $('#'+validForm).valid()){
      var formValues = {
        "userId"              : this.props.basicValues.userId,
        "companyName"         : this.refs.companyName.value,
        "companyWebsite"      : this.refs.companyWebsite.value,
        'emails'              : this.state.accessArray,                 
        "companyPanNo"        : this.refs.companyPanNo.value,
        "companycinNo"        : this.refs.companycinNo.value,
        "companyAddress"      : this.refs.companyAddress.value,
        "companyCity"         : this.refs.companyCity.value,
        "companyState"        : this.refs.companyState.value,
        "companyCountry"      : this.refs.companyCountry.value,
        "companyPincode"      : this.refs.companyPincode.value,
        "companyDescription"  : this.refs.companyDescription.value,
        "companyLogo"         : this.props.companyLogo,
      }
      Meteor.call("insertComapnyBasicInfo", formValues, function(error,result){
        if(error){
          
        }else{ 
          $('#loginModal').modal('show');
          $('.outerLoginWrapper').css('display','none');
          $('#companyOtpBlock').css('display','block');
          if (result) {
            var companyId = result;
            Session.set('companyId',companyId);
            var emailotp = Math.floor(100000 + Math.random() * 900000);
              Meteor.call('addOTPToCompany',companyId,emailotp, function(error,result){
                if(error){
                  // Bert.alert(error);
                }else{

                }
              });
              // SEND EMAIL VERIFICATION LINK
                Meteor.call('sendVerificationLinkToComapny',formValues.companyEmail,emailotp, function(error,result){
                  if(error){
                    // Bert.alert(error);
                  }else{  
                    // swal('Successfully sent the OTP to your email address.');                   
                  } //end else
                }); // send verification mail ends
            }
          }
            
      }); 
    }else{
      $(event.target).find('.effect-21.error').addClass('has-content');
      $(event.target).find('.effect-21.error').focus();
      $('#companyLogoLabel').addClass('error');
      $('#companyLogoLabel').html('This field is required.');
      $('#addCompanyLogo').addClass('errorBorderColor');
      $('html, body').animate({
        'scrollTop' : $(".profileFormsHead").position().top
      });
    }
  }
  removeAccessPerson(event){
    event.preventDefault();
    var index = $(event.currentTarget).attr('data-index');
    
    if(this.props.basicValues){
      var userId = $(event.currentTarget).attr('data-userid');
      Meteor.call("removeEmailFromUser",userId,index);
    }
    var accessArray = this.state.accessArray;
    accessArray.splice(index,1);
    this.setState({
      accessArray
    }) 
  }

  editBasicForm(event){
    event.preventDefault();
    // console.log("Inside editBasicForm"); 
    var validForm = $(event.target).attr('id');  
    var urlValues = this.props.urlValues;
    if(this.props.basicValues){
      if(this.props.basicValues.proofOfDocument){
        var proofOfDocument = this.props.basicValues.proofOfDocument;
        var fileName        = this.props.basicValues.fileName;
        var fileExt         = this.props.basicValues.fileExt;
      }else if(this.props.proofData){
        if(this.props.proofData.companyImage){
          var proofOfDocument = this.props.proofData.companyImage;
          var fileName = this.props.proofData.companyFileName;
          var fileExt = this.props.proofData.companyFileExt;
        }else{
          var proofOfDocument = '';
          var fileName = '';
          var fileExt = '';
        }
      }else{
        var proofOfDocument = '';
        var fileName = '';
        var fileExt = '';
      }
    }

    if(this.props.companyLogo){
      var companyLogo = this.props.companyLogo;
    }else{
      var companyLogo = this.props.basicValues.companyLogo;
    }
    // console.log("validForm :",validForm);
    if(companyLogo != "" && $('#basicFormEdit').valid()){
      var formValues = {
        "userId"              : this.props.basicValues.userId,
        "companyName"         : this.refs.companyName.value,
        "companyWebsite"      : this.refs.companyWebsite.value,
        'emails'              : this.state.accessArray,                    
        "companyPanNo"        : this.refs.companyPanNo.value,
        "companycinNo"        : this.refs.companycinNo.value,
        "companyAddress"      : this.refs.companyAddress.value,
        "companyCity"         : this.refs.companyCity.value,
        "companyState"        : this.refs.companyState.value,
        "companyCountry"      : this.refs.companyCountry.value,
        "companyPincode"      : this.refs.companyPincode.value,
        "companyDescription"  : this.refs.companyDescription.value,
        "companyLogo"         : companyLogo,
      }
      var assureId = this.state.assureId;
      var _id      = this.state._id;
      Meteor.call("editComapnyBasicInfo",_id,assureId,formValues, function(error,result){
        if(error){
          
        }else{
          if(urlValues == 'basic'){
            FlowRouter.go('/companyForms/locations/'+assureId);
          }else{
            $('#basiccompanyinfoModal').modal('hide');
            $('html, body').scrollTop(0);
          }
        }
      }); 
    }else{
      // $(event.target).find('.effect-21.error').addClass('has-content');
      // $(event.target).find('.effect-21.error').focus();
      // $('#companyLogoLabel').addClass('error');
      // $('#companyLogoLabel').html('This field is required.');
      // $('#addCompanyLogo').addClass('errorBorderColor');
      // $('html, body').animate({
      //   'scrollTop' : $(".profileFormsHead").position().top
      // });
    }
  }
  inputFileChange(event){
    event.preventDefault();
    if(this.refs.governmentNo.value){
      $(event.target).siblings('.inputFiles').click();
    }else{
      // swal('Please enter the government registration number.');
      
      swal({
        title:'abc',
        text: "Please enter the government registration number",
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#666',
        // cancelButtonColor:'#d33',
        confirmButtonText: 'Ok'
      })

      $('#governmentNo').addClass('error has-content');
    }
  }
  uploadProofDocs(event){
    event.preventDefault();
    var type = $(event.target).attr('data-type');
    let self = this; 
    Session.set("uploadCompanyLogoProgressPercent","");
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      var userId = Meteor.userId();
      if (file) {
        var companyFileName = file.name;
        var fileSize = file.size;
        var size = 2000000;
        var ext = companyFileName.split('.').pop();

        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.basicProgressDiv').css('display','block');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').removeClass('error');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').html('');
            $(event.target).parent().siblings('.companyFileNameDiv').css('border','0px');
            addCompanyLogoToS3Function(userId,file,type,self);
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

  // addAccessPermissionPerson(event){
  //   var accessPersonName        = this.refs.accessPersonName.value;      
  //   var accessPersonDesignation = this.refs.accessPersonDesignation.value;      
  //   var accessPersonEmail       = this.refs.accessPersonEmail.value;
  //   var accessPersonContact     = this.refs.accessPersonContact.value;
    
  //   var accessPersonAddress     = this.refs.accessPersonAddress.value;
  //   var companyId               = $(event.target).attr('data-companyid');

    
  //   var accessArray = this.state.accessArray;
    
  //   if(accessArray.length>0){
  //     let found = accessArray.some(function(elem){ 
  //          return elem.accessPersonContact == accessPersonContact;
  //     });
  //     if(!found){
  //       accessArray.push({'accessPersonName': accessPersonName,'accessPersonDesignation':accessPersonDesignation,'address': accessPersonEmail,'accessPersonContact':accessPersonContact,'accessPersonAddress':accessPersonAddress,'verified':true});
  //       this.setState({
  //         accessArray 
  //       });
  //       if(accessArray.length>0){
  //         this.refs.accessPersonName.value         = "";
  //         this.refs.accessPersonDesignation.value  = "";  
  //         this.refs.accessPersonEmail.value        = "";
  //         this.refs.accessPersonContact.value      = ""; 
  //         this.refs.accessPersonAddress.value      = ""; 
  //       }
  //     }else{
  //       swal("Contact number already exist");
  //     }
     
  //   }else{
  //     accessArray.push({'accessPersonName': accessPersonName,'accessPersonDesignation':accessPersonDesignation,'address': accessPersonEmail,'accessPersonContact':accessPersonContact,'accessPersonAddress':accessPersonAddress,'verified':true});
  //     this.setState({
  //       accessArray 
  //     });
  //     if(accessArray.length>0){
  //       this.refs.accessPersonName.value         = "";
  //       this.refs.accessPersonDesignation.value  = "";  
  //       this.refs.accessPersonEmail.value        = "";
  //       this.refs.accessPersonContact.value      = ""; 
  //       this.refs.accessPersonAddress.value      = "";
        
  //     }
  //   }
  // }
  removeProofDocs(event){
    event.preventDefault();
    $('.selectWidth').removeClass('zeroMarginTop');
    $('.selectWidth').removeClass('documentSelect');
    var imgId = $(event.target).attr('data-id');
    var imgValue = $(event.currentTarget).attr('data-value');
    var companyId = $(event.currentTarget).attr('data-companyId');
    if(imgId){
      Meteor.call("removeTempCompanyImages",imgId,(error, result)=>{
        // swal({
        //   position: 'top-right',
        //   type: 'success',
        //   title: 'Deleted Successfully',
        //   showConfirmButton: false,
        //   timer: 1500
        // });
      });
    }else{
      Meteor.call("removeBasicCompanyImages",imgValue,companyId,(error, result)=>{
      });
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
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#proofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#proofModals').css('display','none');
  }

  render(){
    // console.log("this.props.basicValues :",this.props.basicValues);
    // console.log("this.props.basicEdit :",this.props.basicEdit);
    return (
      <div>
        <form className="basicForm" id={this.props.basicValues ? this.props.basicEdit ? "basicEdit" : "basicFormEdit" : "basicForm"} onSubmit={this.props.basicValues ? this.editBasicForm.bind(this) : this.basicForm.bind(this)}>
          <div className="form-group inputmargin col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group" id="companyNameError">
              <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companyName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyName" name="companyName" ref="companyName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyName} required/>
              <label>Company Name<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span> 
            </div>
          </div>
          
          <div className="form-group inputmargin col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group" id="companyWebsiteError">
              <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companyWebsite =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyWebsite" name="companyWebsite" ref="companyWebsite"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyWebsite} required/>
              <label>Company Website
                {/* <span className="astrikReq">*</span>*/}
              </label> 
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group" id="companyPanNoError">
              <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companyPanNo =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyPanNo" name="companyPanNo" ref="companyPanNo"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyPanNo} required/>
              <label>Pan Card No. <span className="formatText">(XXXXXXXXXX)</span><span className="astrikReq">*</span></label>
              <span className="focus-border"> 
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companycinNo =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companycinNo" name="companycinNo" ref="companycinNo"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companycinNo} required/>
              <label>CIN No. <span className="formatText">(L27100MH2015PTC000260)</span><span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group inputmargin col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-address-book" aria-hidden="true"></i></span>
               <textarea className={this.state.companyAddress != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} onBlur={this.inputEffect.bind(this)} id="companyAddress" name="companyAddress" ref="companyAddress" onChange={this.handleChange} value={this.state.companyAddress} ></textarea>
              <label>Address</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div> 
          <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companyCity =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyCity" name="companyCity" ref="companyCity"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyCity} />
              <label>City
                {/* <span className="astrikReq">*</span> */}
              </label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companyState =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyState" name="companyState" ref="companyState"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyState} />
              <label>State
                {/* <span className="astrikReq">*</span> */}
              </label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companyCountry =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyCountry" name="companyCountry" ref="companyCountry"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyCountry}/>
              <label>Country
                {/* <span className="astrikReq">*</span> */}
              </label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
         <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.companyPincode =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyPincode" name="companyPincode" ref="companyPincode"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyPincode}/>
              <label>Pincode
                {/* <span className="astrikReq">*</span> */}
              </label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
           <div className="form-group inputmargin col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-info" aria-hidden="true"></i></span>
              <textarea className={this.state.companyDescription != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} onBlur={this.inputEffect.bind(this)} id="companyDescription" name="companyDescription" ref="companyDescription" onChange={this.handleChange} value={this.state.companyDescription} ></textarea>
              <label>Description (Company Information)</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div> 
          <button type="submit" className="btn btn-info pull-right">Submit</button>           
        </form>
      </div>
    );
  }
}
CompanyBasicInfoContainer = withTracker(({props}) => {
  var id = Meteor.userId();
  const postHandle = Meteor.subscribe('tempCompanyImages',id);
  const loading    = !postHandle.ready();

  var proofData    = TempCompanyImages.findOne({'userId':id,'type':'companyProfile'});
  return {
    proofData,
  };
})(CompanyBasicInfo);

export default CompanyBasicInfoContainer;