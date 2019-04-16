import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { TempCompanyImages } from "/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js";
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';


class CorporateCreateAccount extends TrackerReact(Component) {
    constructor(props) {
      super(props); 
          this.state = { 
            "companyName"              : "",
            "companyLogo"              : "", 
            "companyWebsite"           : "",
            "companyPanNo"             : "", 
            "companycinNo"             : "",
            "companyAddress"           : "",
            "companyCity"              : "",
            "companyState"             : "",
            "companyCountry"           : "",
            "companyPincode"           : "",
            "companyDescription"       : "",
            "accessArray"              : [],
            "buttonName"               : "Add",
            "companyTitle"             : "Add Corporate Profile",
          } 
        // }
       
        this.handleChange = this.handleChange.bind(this);
    }
  
    componentWillReceiveProps(nextProps){
      // console.log(nextProps.companyDetails);
      if(!nextProps.companyLoading){
        if(nextProps.companyDetails){
          this.setState({
            "companyName"              : nextProps.companyDetails.companyName,
            "companyLogo"              : nextProps.companyDetails.companyLogo, 
            "companyWebsite"           : nextProps.companyDetails.companyWebsite,
            "companyPanNo"             : nextProps.companyDetails.companyPanNo,
            "companycinNo"             : nextProps.companyDetails.companycinNo,
            "companyAddress"           : nextProps.companyDetails.companyAddress,
            "companyCity"              : nextProps.companyDetails.companyCity,
            "companyState"             : nextProps.companyDetails.companyState,
            "companyCountry"           : nextProps.companyDetails.companyCountry,
            "companyPincode"           : nextProps.companyDetails.companyPincode,
            "companyDescription"       : nextProps.companyDetails.companyDescription,
            "accessArray"              : nextProps.companyDetails.accessArray,
            "companyid"                : nextProps.companyDetails._id,
            "buttonName"               : "Update",
            "companyTitle"             : "Edit Corporate Account",
           })
          }
      }else{
        this.setState({
          "companyName"              : "",
          "companyLogo"              : "",
          "companyWebsite"           : "",
          "companyPanNo"             : "",
          "companycinNo"             : "",
          "companyAddress"           : "",
          "companyCity"              : "",
          "companyState"             : "",
          "companyCountry"           : "",
          "companyPincode"           : "",
          "companyDescription"       : "",
          "accessArray"              : [],
          "companyid"                : '',
          "buttonName"               : "Submit",
          "companyTitle"             : "Add Corporate Profile",
        });
      }

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

    addAccessPermissionPerson(event){
      event.preventDefault();
      // console.log("inside addAccessPermissionPerson");
      var accessPersonName        = this.refs.accessPersonName.value;      
      var accessPersonDesignation = this.refs.accessPersonDesignation.value;      
      var accessPersonEmail       = this.refs.accessPersonEmail.value;
      var accessPersonContact     = this.refs.accessPersonContact.value;      
      var accessPersonAddress     = this.refs.accessPersonAddress.value;
      var companyId               = $(event.target).attr('data-companyid');      
      var accessArray = this.state.accessArray;
      if(!this.props.loading){
        var emailExists = Meteor.users.find({"emails.address":accessPersonEmail}).fetch();
      }
    
      var accessPersonNameValid = (!accessPersonName.match(/^[a-zA-Z0-9_ ]+$|^$/));
      var accessPersonDesigValid = (!accessPersonDesignation.match(/^[a-zA-Z-._/ ]+$|^$/));
      var accessPersonEmailValid = (!accessPersonEmail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/));
      var accessPersonContactValid = (!accessPersonContact.match(/^((\\+91-?)|0)?[0-9]{10}$|^$/));
      
      // if(!accessPersonName.match(/^[a-zA-Z]+$/)){
      //   $("#accessPersonNameError").append('<label className="error">xyz</label>');  
        
      // }
      
      if(accessPersonName !="" && accessPersonDesignation!="" && accessPersonContact!="" && accessPersonEmail!=""){
        if(accessPersonNameValid || accessPersonDesigValid || accessPersonEmailValid || accessPersonContactValid){
          swal("Please enter value in valid format")
        }else{
          if(emailExists.length==0){
            if(accessArray.length>0){
              
              // var elemPresent = accessArray.indexOf(accessPersonContact);
              let found = accessArray.some(function(elem){ 
                  return elem.accessPersonContact == accessPersonContact;
              });
              
              if(!found){
                accessArray.push({'accessPersonName': accessPersonName,'accessPersonDesignation':accessPersonDesignation,'address': accessPersonEmail,'accessPersonContact':accessPersonContact,'accessPersonAddress':accessPersonAddress,'verified':true});
                this.setState({
                  accessArray 
                });
                // console.log("accessArray :",accessArray);
                if(accessArray.length>0){
                  this.refs.accessPersonName.value         = "";
                  this.refs.accessPersonDesignation.value  = "";  
                  this.refs.accessPersonEmail.value        = "";
                  this.refs.accessPersonContact.value      = ""; 
                  this.refs.accessPersonAddress.value      = ""; 
                }
              }else{
                swal("Contact number already exist");
              }
            }else{
              accessArray.push({'accessPersonName': accessPersonName,'accessPersonDesignation':accessPersonDesignation,'address': accessPersonEmail,'accessPersonContact':accessPersonContact,'accessPersonAddress':accessPersonAddress,'verified':true});
              this.setState({
                accessArray 
              });
              if(accessArray.length>0){
                this.refs.accessPersonName.value         = "";
                this.refs.accessPersonDesignation.value  = "";  
                this.refs.accessPersonEmail.value        = "";
                this.refs.accessPersonContact.value      = ""; 
                this.refs.accessPersonAddress.value      = "";
                
              }
            }
          }else{
            swal("One email id can not be used to access multiple account");          
          }
        }
      }else{
        swal("Please fill mandetory field's");
      }
    }
    //submit form function
    createCorporateAccount(event){
      event.preventDefault();
      var userId = Meteor.userId();
      if(this.state.companyid && $('#basicForm').valid()){
        if(this.state.accessArray.length >0){
          if(!this.props.loading){
            var tempCompanyLogo = TempCompanyImages.findOne({});
            if(tempCompanyLogo){
              var companyLogo     =  tempCompanyLogo.companyImage;
            }else{
              var companyLogo     =  this.props.companyDetails.companyLogo;            
            }
          }
          var formValues = {
            "userId"              : this.props.companyDetails.userId,
            "companyName"         : (this.refs.companyName.value).trim(),
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
          
          Meteor.call('UpdateCompanyUserByAdmin',formValues,this.props.companyId,(error,result)=>{
            if(result){
              var userId = result;
              swal("Account updated successfully");             
              formValues.userId = userId;     
              FlowRouter.go('/admin/createcorporateaccount'); 
            }       
          });
        }else{
          swal("Please add atleast one access permission person");
        }
      }else{
        //Add New Corporate
        if($('#basicForm').valid()){
          if(!this.props.loading){
            var tempCompanyLogo = TempCompanyImages.findOne({});
            if(tempCompanyLogo){
              var companyLogo     =  tempCompanyLogo.companyImage;          
            }
          }
          var companyName = (this.refs.companyName.value).trim();
          // console.log('companyName: ', companyName);
          if(!this.props.loading){
            var existingCompanyDetails = CompanyProfile.findOne({'companyName':companyName});        
          }
          if(this.state.accessArray.length >0){
            if(existingCompanyDetails){
              swal("Oops! Company name already exist");  
            }else{
              if(this.refs.companycinNo.value !=""){          
                var createUserFormValues ={
                  'name'             : this.refs.companyName.value,
                  'emails'           : this.state.accessArray,
                  'city'             : this.refs.companyCity.value,
                  'state'            : this.refs.companyState.value,
                  'country'          : this.refs.companyCountry.value,
                  'pincode'          : this.refs.companyPincode.value,
                  'authorizedPerson' : this.state.accessArray,
                  'loginAs'          : "company",
                  'signupPassword'   : "company123",
                }   
                
                var roles = ['companyuser'];
                var formValues = {
                  "userId"              : userId,
                  "companyName"         : this.refs.companyName.value,
                  "companyWebsite"      : this.refs.companyWebsite.value,
                  "companyPanNo"        : this.refs.companyPanNo.value,
                  "companycinNo"        : this.refs.companycinNo.value,
                  "companyAddress"      : this.refs.companyAddress.value,
                  "companyCity"         : this.refs.companyCity.value,
                  "companyState"        : this.refs.companyState.value,
                  "companyCountry"      : this.refs.companyCountry.value,
                  "companyPincode"      : this.refs.companyPincode.value,
                  "companyDescription"  : this.refs.companyDescription.value,
                  "authorizedPerson"    : createUserFormValues.authorizedPerson,
                  "companyLogo"         : companyLogo,
                }
                console.log('createUserFormValues ',createUserFormValues);
                console.log('formValues ',formValues);
                if(createUserFormValues){
                  Meteor.call('createCompanyUserByAdmin',createUserFormValues,(error,result)=>{
                    if(result!="emailIdExist"){
                      var userId = result;
                      formValues.userId = userId;
                      if(userId){
                        if(roles){
                          Meteor.call('addRoles',userId,roles);
                        }
                        if(formValues){
                          Meteor.call("insertComapnyBasicInfo",formValues,(error,result)=>{
                            if(result){
                              var assignedAssureId = Meteor.call('setAssureId',userId,result.companyAssureID);
                              console.log('assignedAssureId ',assignedAssureId);
                              // if(assignedAssureId){
                                swal("Company account created successfully");
                                this.refs.companyName.value               = '';
                                this.refs.companyWebsite                  = '';
                                this.refs.companyPanNo.value              = '';
                                this.refs.companycinNo.value              = '';
                                this.refs.companyAddress.value            = '';
                                this.refs.companyCity.value               = ''; 
                                this.refs.companyState.value              = '';
                                this.refs.companyCountry.value            = '';
                                this.refs.companyPincode.value            = '';
                                this.refs.companyDescription.value        = '';
                                FlowRouter.go('/admin/AddNewContract/'+result.comapnyId);
                              // }
                            } 
                          }); 
                        }
                      }
                    }
                    // else{
                    //     swal("One email id can not be used to access multiple account");    
                    // }
                  });
                }
              }else{
                swal("Please add cin number");                
              }
            }
          }else{
            swal("Please add atleast one access permission person");
          }
        }
      }
    }

    uploadProfileImg(event){
      event.preventDefault();
      let self = this;
      if (event.currentTarget.files && event.currentTarget.files[0]) {
        var file     = event.currentTarget.files[0];
        var fileName = file.name;
        var fileSize = file.size; 
        var ext      = fileName.split('.').pop();
        var userId   = Meteor.userId();
        var type     = $(event.target).attr('data-type');
        if(file){
          if(ext=="jpg" || ext=="png" || ext=="jpeg"){
            $('#companyLogoLabel').removeClass('error');
            $('#companyLogoLabel').html('');
            $('#addCompanyLogo').removeClass('errorBorderColor');
            var size         = 1073741824;
            if (fileSize < size) {
              addCompanyLogoToS3Function(userId,file,type,self);
            }else{
              swal("File not uploaded!","Document size limit is upto 1gb.","error");
            }
          }else{
            swal("Please upload file","in images format","error");
          }
        }
      }
    }
    removeAccessPerson(event){
      var index = $(event.currentTarget).attr('data-index');
      if(this.props.companyId){
        var userId = $(event.currentTarget).attr('data-userid');
        Meteor.call("removeEmailFromUser",userId,index);
      }
      var accessArray = this.state.accessArray;
      accessArray.splice(index,1);
      this.setState({
        accessArray
      })
    }
    removeLogo(event){
      event.preventDefault();
      var companyId = event.currentTarget.id;
      Meteor.call("removeLogo",companyId);
    }
    removeLogoFromTemp(event){
      var tempId = event.currentTarget.id;
      Meteor.call("removeLogoFromTemp",tempId);
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
      $("#basicForm").validate({
        rules: {
         
          accessPersonEmail: {
            regCx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/, 
          },       
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
          accessPersonContact: {
            // required: true,            
            regCx3: /^((\\+91-?)|0)?[0-9]{10}$|^$/, 
          },
          accessPersonDesignation : {
            // required: true,            
            regCx6: /^[a-zA-Z-._/ ]+$|^$/,
          },
          accessPersonName:{
            // required: true,           
            regx9:/^[a-zA-Z0-9_ ]+$|^$/
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

        errorPlacement: function(error, element) {   
          if (element.attr("name") == "companyWebsite"){      
            error.insertAfter("#companyWebsiteError");  
          }
          if (element.attr("name") == "companycinNo"){      
            error.insertAfter("#companycinNoError");  
          } 
          if (element.attr("name") == "companyPanNo"){      
            error.insertAfter("#companyPanNoError");  
          } 
          if (element.attr("name") == "companyCity"){      
            error.insertAfter("#companyCityError");  
          } 
          if (element.attr("name") == "companyState"){      
            error.insertAfter("#companyStateError");  
          } 
          if (element.attr("name") == "companyCountry"){      
            error.insertAfter("#companyCountryError");  
          } 
          if (element.attr("name") == "companyPincode"){      
            error.insertAfter("#companyPincodeError");  
          }
          if (element.attr("name") == "accessPersonName"){      
            error.insertAfter("#accessPersonNameError");  
          }
          if (element.attr("name") == "accessPersonEmail"){      
            error.insertAfter("#accessPersonEmailError");  
          }
          if (element.attr("name") == "accessPersonContact"){      
            error.insertAfter("#accessPersonContactError");  
          }
          if (element.attr("name") == "accessPersonDesignation"){      
            error.insertAfter("#accessPersonDesignationError");  
          }
          if (element.attr("name") == "accessPersonName"){      
            error.insertAfter("#accessPersonNameError");  
          }
          if (element.attr("name") == "companyName"){      
            error.insertAfter("#companyNameError");  
          }
          if (element.attr("name") == "companyLogo"){      
            error.insertAfter("#companyLogoError");  
          }
        }

      }); 

      Meteor.call('companyImg',Meteor.userId(),"companyProfile",(err,res)=>{
        if (err) {

        }else{
          if (res) {
            Meteor.call('removeTempCompanyImages',res);
          }
        }
      });
    }
    componentWillUnmount() {
       if (this.props.companyLogoImage) {
         Meteor.call('removeTempCompanyImages',this.props.companyLogoImage._id);
       }
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

    inputFileChange(event){
      event.preventDefault();
      $(event.target).parent().parent().find('.inputFiles').click();
    }
  
  render() { 
   return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1> Corporate Management </h1>
        <ol className="breadcrumb">
          <li>
            <a href="#"><i className="fa fa-file-o"/> Corporate Management</a></li>
          <li className="active">{this.state.companyTitle}</li>
        </ol>
      </section>
       <section className="content">
         <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <div className="box box-primary">
                <div className="box-header with-border">
                 <h2 className="box-title">{this.state.companyTitle}</h2>  
                </div>
                <div className="box-body">  
                <div>
                {/* <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12" id=""> */}
                <form className="basicForm" id="basicForm" onSubmit={this.createCorporateAccount.bind(this)}>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                      <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="companyNameError">
                        <label>Company Name
                          <span className="astrikReq">*</span>
                        </label>
                        <input type="text" className="form-control loginInputs" id="companyName" name="companyName" ref="companyName" value={this.state.companyName} onChange={this.handleChange.bind(this)}/> 
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" id="companyLogoError">
                    <label>Company Logo
                          <span className="astrikReq">*</span>
                    </label>  
                    {                     
                      this.props.companyLogoImage ? 
                        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                          <input type="file" className="btn inputFiles col-lg-6" name="companyLogo" onChange={this.uploadProfileImg.bind(this)} data-type="companyProfile"/> 
                          <div className="col-lg-3">
                             <i className="fa fa-close pull-right deleteCompanyIcon" id={this.props.companyLogoImage._id} onClick={this.removeLogoFromTemp.bind(this)}></i>                                             
                            <img src={this.props.companyLogoImage.companyImage} title="Change profile picture"  className="img-thumbnail userPrfileImg inputFileSpan" />
                          </div>
                        </div>
                      :
                      this.state.companyLogo != '' ?         
                        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                          <input type="file" className="btn inputFiles col-lg-6" onChange={this.uploadProfileImg.bind(this)} data-type="companyProfile"/> 
                          <div className="col-lg-3">
                            <i className="fa fa-close pull-right deleteCompanyIcon" id={this.state.companyid} onClick={this.removeLogo.bind(this)}></i>
                            <img src={this.state.companyLogo} title="Change profile picture"  className="img-thumbnail userPrfileImg inputFileSpan" />
                          </div>
                        </div>
                      :
                      <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                        {/* Add Photo<span className="astrikReq addCompanyLogoAst">*</span>                         */}
                        <input type="file" onChange={this.uploadProfileImg.bind(this)} className="btn col-lg-6" name="companyLogo" data-type="companyProfile" required/> 
                      </div>
                    }
                    </div>
                    <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="companyWebsiteError">
                        <label>Comapny Website
                          {/* <span className="astrikReq">*</span> */}
                        </label>
                        <input type="text" className="form-control loginInputs" id="companyWebsite" name="companyWebsite" ref="companyWebsite" onBlur={this.inputEffect.bind(this)} value={this.state.companyWebsite} onChange={this.handleChange.bind(this)}/> 
                      </div>
                    </div>

                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="companyPanNoError">
                        <label>Pan Card No.(XXXXXXXXXX)
                          {/* <span className="astrikReq">*</span> */}
                        </label>                        
                        <input type="text" className="form-control loginInputs" id="companyPanNo" name="companyPanNo" ref="companyPanNo" onBlur={this.inputEffect.bind(this)} value={this.state.companyPanNo} onChange={this.handleChange.bind(this)}/>
                        {/* <input type="text" className={this.state.companyPanNo =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyPanNo" name="companyPanNo" ref="companyPanNo"  onBlur={this.inputEffect.bind(this)} value={this.state.companyPanNo}/> */}
                       
                      </div>
                    </div>
                    <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                      <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="companycinNoError">
                        <label>CIN No.<span className="astrikReq">*</span></label>                        
                        <input type="text" className="form-control loginInputs" id="companycinNo" name="companycinNo" ref="companycinNo" value={this.state.companycinNo} onChange={this.handleChange.bind(this)}/>
                        {/* <input type="text" className={this.state.company cinNo  =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companycinNo " name="companycinNo " ref="company cinNo "  onBlur={this.inputEffect.bind(this)} value={this.state.company cinNo }/> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <label>Address</label>                        
                        <textarea className="form-control loginInputs" id="companyAddress" name="companyAddress" ref="companyAddress"value={this.state.companyAddress} onChange={this.handleChange.bind(this)}></textarea>
                      </div>
                    </div> 
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12">
                      <div className="input-effect input-group" id="companyCityError">
                        <label>City</label>                        
                        <input type="text" className="form-control loginInputs" id="companyCity" name="companyCity" ref="companyCity" value={this.state.companyCity} onChange={this.handleChange.bind(this)}/>
                        {/* <textarea className={this.state.companyAddress != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} onBlur={this.inputEffect.bind(this)} id="companyAddress" name="companyAddress" ref="companyAddress" value={this.state.companyAddress} ></textarea> */}
                      </div>
                    </div> 
                    <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12">
                      <div className="input-effect input-group" id="companyStateError">
                        <label>State</label>                        
                        <input type="text" className="form-control loginInputs" id="companyState" name="companyState" ref="companyState" value={this.state.companyState} onChange={this.handleChange.bind(this)}/>
                        {/* <textarea className={this.state.companyAddress != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} onBlur={this.inputEffect.bind(this)} id="companyAddress" name="companyAddress" ref="companyAddress" value={this.state.companyAddress} ></textarea> */}
                        
                      </div>
                    </div> 
                    <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12">
                      <div className="input-effect input-group" id="companyCountryError">
                      <label>Country</label>                      
                        <input type="text" className="form-control loginInputs" id="companyCountry" name="companyCountry" ref="companyCountry" value={this.state.companyCountry} onChange={this.handleChange.bind(this)}/>
                      </div>
                    </div>
                    <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12">
                      <div className="input-effect input-group" id="companyPincodeError">
                        <label>Pincode</label>                        
                        <input type="text" className="form-control loginInputs" id="companyPincode" name="companyPincode" ref="companyPincode" value={this.state.companyPincode} onChange={this.handleChange.bind(this)}/>                        
                      </div>
                    </div>

                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <label>Description (Company Information)</label>                      
                        <textarea className="form-control loginInputs" id="companyDescription" name="companyDescription" ref="companyDescription" value={this.state.companyDescription} onChange={this.handleChange.bind(this)}></textarea>
                      </div>
                    </div> 
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                  
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 accessPermissionWrap">
                      <h5 className="accessPermissionHead">Add SPOC</h5>
                      <div className="form-group col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="accessPersonNameError">
                          <label>Name<span className="astrikReq">*</span></label>                        
                          <input type="text" className="form-control loginInputs" id="accessPersonName" name="accessPersonName" ref="accessPersonName" onChange={this.handleChange.bind(this)}/>
                        </div>
                      </div>

                      <div className="form-group col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="accessPersonEmailError">
                          <label>Email<span className="astrikReq">*</span></label>                        
                          <input type="email" className="form-control loginInputs" id="accessPersonEmail" name="accessPersonEmail" ref="accessPersonEmail" onChange={this.handleChange.bind(this)}/>
                        </div>
                      </div>
                      <div className="form-group col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="accessPersonContactError">
                          <label>Contact Number<span className="astrikReq">*</span></label>                        
                          <input type="text" className="form-control loginInputs" id="accessPersonContact" name="accessPersonContact" ref="accessPersonContact" onChange={this.handleChange.bind(this)}/>
                        </div>
                      </div>
                      <div className="form-group col-lg-3 col-md-6 col-sm-12 col-xs-12">
                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12" id="accessPersonDesignationError">
                          <label>Designation<span className="astrikReq">*</span></label>                        
                          <input type="text" className="form-control loginInputs" id="accessPersonDesignation" name="accessPersonDesignation" ref="accessPersonDesignation" onChange={this.handleChange.bind(this)}/>
                        </div>
                      </div>
                      <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <label>Address
                            {/* <span className="astrikReq">*</span> */}
                          </label>                        
                          <input type="text" className="form-control loginInputs" id="accessPersonAddress" name="accessPersonAddress" ref="accessPersonAddress" onChange={this.handleChange.bind(this)}/>
                        </div>
                      </div>
                      
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="form-group btntop col-lg-3 col-md-3 col-sm-12 col-xs-12  addAuthorisedPermission noLRPad">
                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">                                              
                            <button type="button" className="btn btn-info" onClick={this.addAccessPermissionPerson.bind(this)} data-companyid={this.props.companyId}>Add</button>                                   
                        </div>
                      </div>
                      </div>

                      {/**Display added persons */}
                      <div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <table className="table table-bordered table-striped table-hover">
                          <thead>
                            <tr className="tableHeader">
                              <th> Name </th>
                              <th> Email </th>
                              <th> Contact Number </th>
                              <th> Designation </th>  
                              <th> Address </th>  
                              <th> Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            { this.state.accessArray ?
                              this.state.accessArray.length>0 ?
                              this.state.accessArray.map((accessData,index)=>{
                                return(
                                  <tr key={index}>
                                      <td>{accessData.accessPersonName} </td>                                       
                                      <td>{accessData.address}</td>     
                                      <td>{accessData.accessPersonContact} </td>      
                                      <td>{accessData.accessPersonDesignation} </td>      
                                      <td>{accessData.accessPersonAddress ? accessData.accessPersonAddress : "-"} </td>     
                                      <td><button type="button" className= "btn-danger taxDelete fa fa-trash delIcon detailsCenter" data-index={index} data-userid={this.props.companyId ? this.props.companyDetails.userId:""} onClick ={this.removeAccessPerson.bind(this)}></button></td>    
                                  </tr>
                                )
                              })
                              
                              :
                              <tr>
                                <td></td>   
                                <td></td>     
                                <td>SPOC not yet added</td>     
                                <td></td>   
                                <td></td>   
                                <td></td>   
                              </tr>
                             :
                             <tr>
                                <td></td>   
                                <td></td>     
                                <td>SPOC not yet added</td>     
                                <td></td>   
                                <td></td>   
                                <td></td>   
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                      </div>
                      </div>
                    </div>
                  <button type="submit" className="btn btn-info pull-right" value={this.state.buttonName == "Update" ? "Update" : "Add"}>{this.state.buttonName == "Update" ? "Update" : "Submit"}</button>           
                </form>
                
              </div>
             </div>
            </div>
            </div>
         </div>
       </section>
    </div>
    );
  } 
}
CorporateCreateAccountContainer = withTracker(({params}) => {
  var  companyId = FlowRouter.getParam('id');  
  const postHandle  = Meteor.subscribe("singleCompanyProfile",companyId);
  const allCompanyHandle  = Meteor.subscribe("companyProfileDetails");
  const tempImageHandle = Meteor.subscribe("alltempCompanyImages");
  const allUser = Meteor.subscribe("userfunction");
  
  var companyLoading   = !postHandle.ready();
  var loading          = !postHandle.ready() && !allCompanyHandle.ready()&& !tempImageHandle.ready() && allUser.ready();
  const companyDetails = CompanyProfile.findOne({'_id':companyId});
  if(companyDetails){
    const userHandle   = Meteor.subscribe('userData',companyDetails.userId);      
    const userDetails  = Meteor.users.findOne({'_id':companyDetails.userId});
    if(userDetails){
      var accessArray  =  userDetails.profile.authorizedPerson;  
      companyDetails.accessArray = userDetails.profile.authorizedPerson;
    }
  }
  const companyLogoImage = TempCompanyImages.findOne({"userId": Meteor.userId(),'type':'companyProfile'});
  return{
    loading,
    companyDetails,
    companyId,
    companyLogoImage,
    companyLoading
  }
})(CorporateCreateAccount);
export default CorporateCreateAccountContainer;