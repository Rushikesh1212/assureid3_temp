import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Services} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import {TempServiceImages} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

export default class ServicePage extends TrackerReact(Component){
  constructor(props) { 
    super(props);
    this.state = {
        serviceName       : '',
        serviceRate       : '',
        serviceFor        : 'both',
        serviceDuration   : '',
        servicesDescription : '',
        id                : '',
        services          : [], 
        isUploading       : false,
        progressValue     : "0%",
        serviceRequired   : '',
        "subscription"  : {
          "singleServices" : Meteor.subscribe("singleServices"),
          "projectSettingsPublish" : Meteor.subscribe("projectSettingsPublish"),
          "tempServiceImages" : Meteor.subscribe("tempServiceImages"),
        } 
    };
      this.handleChange = this.handleChange.bind(this); 
  }
  
  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name] : value
    });
  }
  componentDidMount() {
    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script"); 
     adminLte.type="text/javascript"; 
     adminLte.src = "/js/adminLte.js"; 
     $("body").append(adminLte); 
    }
    // Jquery validation
    $.validator.addMethod("regxMessageBox", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain alphanumeric and some special character.");

    // $.validator.addMethod("regxNumber", function(value, element, regexpr) {          
    //   return regexpr.test(value);
    // }, "It should only numbers.");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });  
    $("#serviceForm").validate({
        rules: {
          serviceName: {
            required: true, 
            regxMessageBox: /^[a-zA-Z0-9 .,*_-|:;""''?=/]+$|^$/,
          },
          serviceRate: {
            required: true,
            // regxNumber : /^\-[0-9]*/,
          },  
          servicesDescription: {
            required: true,
            regxMessageBox: /^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/,
          },  
          serviceFor: {
            required: true,
          },  
        },
        messages: {
          servicesFor: {
            required: "Please select for whom the service will be displayed!",
          }
        }
    });
  }
  componentWillUnmount() {
     $("script[src='/js/adminLte.js']").remove();
     var tempserviceImage = TempServiceImages.findOne({"userId":Meteor.userId()},{sort:{"createdAt":-1}});  
     if (tempserviceImage) {
       Meteor.call('removeTempserviceImage',tempserviceImage._id);
     }
  }
  handleUpload(event){
    event.preventDefault();
    let self = this;
    Session.set("uploadServiceProgressPercent","");
      if (event.currentTarget.files && event.currentTarget.files[0]) { 
        var dataImg  = event.currentTarget.files[0]; 
        var fileSize = dataImg.size; 
        var size     = 1073741824;
         if(dataImg.type == "image/jpeg" || dataImg.type == "image/png"){      
           var reader    = new FileReader();        
           reader.onload = function (e) {          
             $('.uploadedImageFromLocl').attr('src', e.target.result);       
           };        
           reader.readAsDataURL(event.currentTarget.files[0]);      
           var file = event.currentTarget.files[0];      
            if (file) { 
              if (fileSize < size) {
                addServicesImgsToS3Function(file,self);  
              }else{
                swal("File not uploaded!","Document size limit is upto 1gb.","error");
              }     
            }   
         } else { 
          swal({    
             position: 'top-right',     
             type: 'error',    
             title: 'Please select image',       
             showConfirmButton: false,      
             timer: 1500      
           });   
        }
      }
  }

  checkAll(event){
    if(event.target.checked){      
      $('.userCheckbox').prop('checked',true);
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name] : value
      });
    }else{
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name] : value
      });
      $('.userCheckbox').prop('checked',false);
    }
  }

  handleSubmit(e){
    e.preventDefault();
      if($("#serviceForm").valid()){ 
        var serviceName       = this.refs.serviceName.value;
        var serviceRate       = this.refs.serviceRate.value;
        var serviceDayNumbers = this.refs.serviceDayNumbers.value;
        var servicesDescription  = this.refs.servicesDescription.value;
        var serviceFor          = this.state.serviceFor;
        var serviceRequired     = this.state.serviceRequired;       
        var userId              = Meteor.userId();
        var pageNameExist       = Services.findOne({'serviceName': serviceName});
        var selectedCard        = [];
        var lastModified        = ""; 
        /**Get value of identity verification options */
        if(serviceRequired == "StatutoryForm"){
          if(this.refs.AllForms.value =='true'){
              var AllForms={
                  'cardName': "AllForms",
                  'value'   : true,
              }
          }else{
              var AllForms={
                'cardName': "AllForms",
                'value'   : false,
              }
          }        
          if(this.refs.AadharForms.value =='true' || this.refs.AllForms.value =='true'){
           
            var AadharForms={
              'cardName': "AadharForms",
              'value'   : true,
          }
          }else{
            var AadharForms={
              'cardName': "AadharForms",
              'value'   : false,
            }
          }

          if(this.refs.PanCardForm.value =='true' || this.refs.AllForms.value =='true'){
            var PanCardForm={
              'cardName': "PanCardForm",
              'value'   : true,
            }
            
          }else{
            var PanCardForm={
              'cardName': "AadharForms",
              'value'   : false,
            }
          }

          if(this.refs.DrivingLicenseForm.value =='true' || this.refs.AllForms.value =='true'){ 
            var DrivingLicenseForm={
              'cardName': "DrivingLicenseForm",
              'value'   : true,
            }
            
          }else{
            var DrivingLicenseForm={
              'cardName': "DrivingLicenseForm",
              'value'   : false,
            } 
          }

          if(this.refs.VotingForm.value =='true' || this.refs.AllForms.value =='true'){ 
            var VotingForm={
              'cardName': "VotingForm",
              'value'   : true,
            }
          }else{
            var VotingForm={
              'cardName': "VotingForm",
              'value'   : false,
            }
          }

          if(this.refs.RationCardForm.value =='true' || this.refs.AllForms.value =='true'){ 
            var RationCardForm ={
              'cardName': "RationCardForm",
              'value'   : true,
            }
          }else{
            var RationCardForm ={
              'cardName': "RationCardForm",
              'value'   : false,
            }
          }

          if(this.refs.PassportForm.value =='true' || this.refs.AllForms.value =='true'){ 
            var PassportForm = {
              'cardName': "PassportForm",
              'value'   : true,
            }   
          }else{
            var PassportForm = {
              'cardName': "PassportForm",
              'value'   : false,
            }
          }
        
          if(this.refs.AllForms.value =='true'){
            selectedCard.push(AllForms,AadharForms,PanCardForm,DrivingLicenseForm,VotingForm,RationCardForm,PassportForm); 
          }else{
            selectedCard.push(AllForms,AadharForms,PanCardForm,DrivingLicenseForm,VotingForm,RationCardForm,PassportForm);
            
          }
        }else{
           var selectedCard = [];
        }
         if(pageNameExist){
           swal("Oops...!","This service name is already taken!","error");
         }else{
              if(serviceRequired!=""){
               Meteor.call('createService',serviceName,serviceRate,serviceDayNumbers,servicesDescription,serviceRequired,userId,lastModified,serviceFor,selectedCard,(error,result)=>{
                   if(error){
                      
                   }else{                     
                      swal("Done","Service added Successfully.","success");
                       $('.uploadedImageFromLocl').attr('src', "");
                       $('.uploadServiceImage').val("");
                       $(".serviceName").val("");  
                       $(".serviceRate").val("");  
                       $(".serviceDuration").val("");  
                       $(".servicesDescription").val("");  
                        // $('#servicesDescription').summernote('code','');
                   }
               });
              }else{
                swal("Please Select Required Information ");
              }
        }
      }    
  }
  getUploadImagePercentage(){
    var uploadProgressPercent = Session.get("uploadServiceProgressPercent");
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
        if(parseInt(percentVal)==100){
            setTimeout(()=>{ 
                Session.set("uploadServiceProgressPercent",0); 
            }, 5000);
            
             
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
  render(){
   // $('.note-editable').html(this.state.servicesDescription);
    return(
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1> Service Management </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-briefcase" />Service Management</a></li>
              <li className="active">Add New Service</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Add New Service
                    </h3>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                            <form className="newTemplateForm" id="serviceForm">
                              <div className="row inputrow">
                                {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service For:</label>
                                    <label className="radio-inline" style={{fontSize : '13' + 'px'}}><input value="user" type="radio" name="serviceFor" ref="serviceFor" checked={this.state.serviceFor === 'user'} onChange={this.handleChange} />User</label>
                                    <label className="radio-inline" style={{fontSize : '13' + 'px', marginLeft : '30' + 'px'}}><input value="company" type="radio" name="serviceFor" checked={this.state.serviceFor === 'company'} ref="serviceFor" onChange={this.handleChange}/>Company</label>
                                  </div>
                                </div>*/}
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service Name <span className="astrikReq">*</span>:</label>
                                     <input type="text" ref="serviceName" id="serviceName" name="serviceName" onChange={this.handleChange} className="templateName serviceName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service Rate<span className="astrikReq">*</span>:</label>
                                    <input type="number" ref="serviceRate" id="serviceRate" name="serviceRate"  onChange={this.handleChange} className="templateName serviceRate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" min="0"/>
                                  </div> 
                                </div>
                                 <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Duration (In Days):</label>
{/*                                      <label className="col-lg-4 col-md-12 col-sm-12 col-xs-12 label-category">Service Rate:</label>
*/}                                 <div className="col-lg-12 servicesDays">
                                      <input type="number" className="templateName serviceRate col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control inputValid"
                                      ref="serviceDayNumbers" id="serviceDayNumbers" name="serviceDayNumbers"  onChange={this.handleChange} min="0"/>
                                    </div>                      
                                  </div>

                               
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                      <label className="label-category">Description<span className="astrikReq">*</span>:</label>
                                      {/*<div id="servicesDescription" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" name="servicesDescription" ref="servicesDescription" value={this.state.servicesDescription} onChange={this.handleChange} ></div>*/}
                                      <textarea name="servicesDescription" ref="servicesDescription" id="servicesDescription"  onChange={this.handleChange} className="form-control servicesDescription col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="5"></textarea>                           
                                   </div>
                                </div>
                              </div>
                             <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-6 uploadedImageFromLocl1">
                                     <div className="form-group subjectDiv">
                                       <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Image Upload<span className="astrikReq">*</span>:</label>
                                        <input type="file" ref="serviceImageFile" id="s3file" name="serviceImageFile"  onChange={this.handleUpload.bind(this)}  className="subject uploadServiceImage col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid"  required/>     
                                      </div> 
                                  </div>

                                  <div className="col-lg-6 uploadedImageFromLocl2">    
                                      <div className="uploadedImageFromLocl3">       
                                          <img src="" alt="" className="img-responsive uploadedImageFromLocl"/>   
                                      </div>
                                  </div>
                               
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                  {this.getUploadImagePercentage()}
                                </div>
                              </div>
                              <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-12 uploadedImageFromLocl1">
                                     <div className="form-group subjectDiv">
                                       <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Required Information for verification<span className="astrikReq">*</span>:</label>
                                      </div> 
                                  </div>
                                  {/*<div className="col-lg-6">
                                    <div className="form-group">
                                      <input type="radio" name="serviceRequired"  onChange={this.handleChange} ref="serviceRequired" value="ProfileForms" checked={this.state.serviceRequired === 'ProfileForms'}/> Basic Information
                                    </div> 
                                  </div>*/}
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="StatutoryForm"  data-toggle="collapse" data-target="#indentityInformation" checked={this.state.serviceRequired === 'StatutoryForm'}/> Identity Information
                                    </div> 
                                  </div>
                                  <div className="collapse out" id="indentityInformation">
                                    <div className = "col-lg-8 col-md-12 col-sm-12 col-xs-12 col-sm-12 identityOuterBlock">
                                    <div className="row inputrow subjectRow">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <div className="col-lg-12 uploadedImageFromLocl1">
                                            <div className="form-group subjectDiv">
                                              <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Required Information for Indentity Information<span className="astrikReq">*</span>:</label>
                                              </div> 
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group">
                                              <input type="checkbox" name="AllForms"  className ="userCheckbox"  ref="AllForms" value={this.state.AllForms} checked={this.state.AllForms} onChange={this.checkAll.bind(this)}/> All 
                                            </div> 
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group">
                                              <input type="checkbox" name="AadharForms"  className ="userCheckbox" onChange={this.handleChange} ref="AadharForms" value={this.state.AadharForms} checked={this.state.AadharForms}/> Aadhar Card 
                                            </div> 
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group">
                                              <input type="checkbox" name="PanCardForm" className ="userCheckbox" onChange={this.handleChange} ref="PanCardForm" value={this.state.PanCardForm} checked={this.state.PanCardForm}/> Pan Card
                                            </div> 
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group ">
                                              <input type="checkbox" name="DrivingLicenseForm" className ="userCheckbox" onChange={this.handleChange} ref="DrivingLicenseForm" value={this.state.DrivingLicenseForm} checked={this.state.DrivingLicenseForm}/> Driving License
                                            </div> 
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group ">
                                                  <input type="checkbox" name="VotingForm" className ="userCheckbox" onChange={this.handleChange} ref="VotingForm" value={this.state.VotingForm} checked={this.state.VotingForm}/> Voting Card
                                            </div> 
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group">
                                                  <input type="checkbox" name="RationCardForm" className ="userCheckbox" onChange={this.handleChange} ref="RationCardForm" value={this.state.RationCardForm} checked={this.state.RationCardForm}/> Ration Card
                                            </div> 
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="form-group">
                                                  <input type="checkbox" name="PassportForm" className ="userCheckbox" onChange={this.handleChange} ref="PassportForm" value={this.state.PassportForm} checked={this.state.PassportForm}/> Passport
                                            </div> 
                                          </div>
                                          
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group ">
                                      <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="AddressForm" checked={this.state.serviceRequired === 'AddressForm'}/> Address Information
                                    </div> 
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group ">
                                     <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="EducationForm" checked={this.state.serviceRequired === 'EducationForm'}/> Academic Information
                                    </div> 
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="WorkForm" checked={this.state.serviceRequired  === 'WorkForm'}/> Employment Information
                                    </div> 
                                  </div>
                                  {/*<div className="col-lg-6">
                                    <div className="form-group">
                                      <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="SkillsCertificate" checked={this.state.serviceRequired  === 'SkillsCertificate'}/> Skills & Certification Information
                                    </div> 
                                  </div>*/}
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                     <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="ReferenceForm" checked={this.state.serviceRequired  === 'ReferenceForm'}/> Reference Verification
                                    </div> 
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                     <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="CriminalRecords" checked={this.state.serviceRequired  === 'CriminalRecords'}/> Criminal Records
                                    </div> 
                                 </div>
                                  {/*<div className="col-lg-6">
                                    <div className="form-group">
                                     <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="OtherInfoForm" checked={this.state.serviceRequired  === 'OtherInfoForm'}/> Other Information
                                    </div> 
                                  </div>*/}
                                </div>
                              </div>
                              {/*<div>
                                {<div className="form-group subjectDiv">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service for <span className="astrikReq">*</span>:</label>
                                </div>

                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <input type="radio" name="serviceRequired" onChange={this.handleChange} ref="serviceRequired" value="StatutoryForm"  data-toggle="collapse" data-target="#indentityInformation" checked={this.state.serviceRequired === 'StatutoryForm'}/> Identity Information
                                  </div> 
                                </div>}

                              </div>*/}
                              <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-12 uploadedImageFromLocl1">
                                    <div className="form-group subjectDiv">
                                      <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service for <span className="astrikReq">*</span>:</label>
                                    </div> 
                                  </div>
                                  <div className="col-lg-2">
                                    <div className="form-group ">
                                      {/*<input type="radio" name="serviceFor" onChange={this.handleChange} ref="serviceFor" value="User" checked={this.state.serviceRequired === 'AddressForm'}/> User*/}
                                      <input type="radio" name="serviceFor" onChange={this.handleChange} ref="serviceFor" value="user" checked={this.state.serviceFor === 'user'}/> User
                                    </div> 
                                  </div>
                                  <div className="col-lg-2">
                                    <div className="form-group ">
                                      <input type="radio" name="serviceFor" onChange={this.handleChange} ref="serviceFor" value="company" checked={this.state.serviceFor === 'company'}/> Company
                                    </div> 
                                  </div>
                                  <div className="col-lg-2">
                                    <div className="form-group ">
                                      <input type="radio" name="serviceFor" onChange={this.handleChange} ref="serviceFor" value="both" checked={this.state.serviceFor === 'both'}/> Both
                                    </div> 
                                  </div>
                                </div>
                              </div>
                              <div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <button onClick={this.handleSubmit.bind(this)} type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">ADD</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}
// AddServicesContainer = withTracker(({props}) => {
//     const postHandle    = Meteor.subscribe("checklistFieldExpert");
//     const loading       = !postHandle.ready();
//     const checklistFieldExpert  = ChecklistFieldExpert.find({}).fetch()||[];
//     //   
//     return {
//       loading,
//       // checklistFieldExpert,
//     };
// })(ServicePage);
// export default AddServicesContainer;