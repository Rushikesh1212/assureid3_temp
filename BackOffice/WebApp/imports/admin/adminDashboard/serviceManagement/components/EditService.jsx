import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Services} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import {TempServiceImages} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
 
class EditService extends TrackerReact (Component){
  constructor(props) {
    super(props); 
    this.state = {
      serviceName         : '',
      serviceRate         : '',
      serviceDuration     : '',
      servicesDescription : '',
      serviceFor          : '',
      id                  : '',
      services            : [], 
      serviceRequired     : '',
      serviceFor          : '',
      isUploading         : false,
      // progressValue     : "0%",
      edit                : false,
      selectedCard        : [],
      serviceDayNumbers   : '',
      "subscription"  : {
        "singleServices" : Meteor.subscribe("singleServices"),
        "projectSettingsPublish" : Meteor.subscribe("projectSettingsPublish"),
        "tempServiceImages" : Meteor.subscribe("tempServiceImages"),
      }  
    }; 
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.services){
         this.setState({
             // fieldChecklist      : nextProps.services.fieldChecklist,
             serviceName         : nextProps.services.serviceName,
             serviceRate         : nextProps.services.serviceRate,
             servicesDescription : nextProps.services.servicesDescription,
             image               : nextProps.services.image,
             id                  : nextProps.services._id,
             serviceRequired     : nextProps.services.serviceRequired,
             serviceDayNumbers   : nextProps.services.serviceDayNumbers,
             serviceFor          : nextProps.services.serviceFor,
         });
         if(nextProps.services.selectedCard){
            nextProps.services.selectedCard.map((elem)=>{
              this.setState({
                [elem.cardName] : elem.value,
              });
            });
         }
      }
    }else{
      this.setState({
             // fieldChecklist      : '',
             serviceName         : '',
             serviceRate         : '',
             servicesDescription : '',
             serviceRequired     : '',
             serviceFor          : '',
             image               : '',
             id                  : '',
             serviceDayNumbers   : '',
      });
    }
    // 

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    
    this.setState({
      [name]: value
    });
  }
  componentDidMount() {
   // $("html,body").scrollTop(0);
   //  // $(".serviceName").focus();
   //  if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
   //   var adminLte = document.createElement("script");  
   //   adminLte.type="text/javascript";  
   //   adminLte.src = "/js/adminLte.js";  
   //   $("body").append(adminLte);  
   //  }
    this.serviceTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("services");
      const services = Services.find().fetch();
      this.setState({services: services});
    });
    this.tempServiceImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempServiceImages');
      const tempServiceImages = TempServiceImages.find().fetch();
      this.setState({tempServiceImages});
    });
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
    $("#newTemplateForm").validate({
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
    if (this.serviceTracker) {
    this.serviceTracker.stop();
    }
    if (this.tempServiceImageTracker) {
      this.tempServiceImageTracker.stop();
    }
  }

  handleUpload(event){
    event.preventDefault();
    let self = this;
     this.setState({isUploading: true});
    if (event.currentTarget.files && event.currentTarget.files[0]) {   
      var dataImg = event.currentTarget.files[0];  
      var fileSize = dataImg.size; 
      var size     = 1073741824; 
       if(dataImg.type == "image/jpeg" || dataImg.type == "image/png"){       
         var reader = new FileReader();        reader.onload = function (e) {           
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

  // showSelected(checkboxValue){
  //   var value = false;
  //   if(this.state.selectedCard.length > 0){
  //     // var selectedData = this.state.selectedCard[this.state.selectedCard.map(function (item) { return item.Id; }).indexOf(searchKey)];
  //     this.state.selectedCard.map((elem)=>{
  //       if(elem.cardName == checkboxValue){
  //         value = elem.value;
  //       }
  //     });
  //     return value;
  //   } 
  // }

  handleChange(event){
    
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]        : value,
      "AllForms"    : false,
    });
   
    // console.log(this.state.AadharForms);
    // console.log(this.state.PanCardForm);
    // console.log(this.state.DrivingLicenseForm);
    // console.log(this.state.RationCardForm);
    // console.log(this.state.PassportForm);
    // console.log(this.state.VotingForm);
    // if((this.state.AadharForms == true) && (this.state.PanCardForm == true) && (this.state.DrivingLicenseForm == true) && (this.state.RationCardForm == true) && (this.state.PassportForm == true) && (this.state.VotingForm == true)){
    //   this.setState({
    //     "AllForms"    : true,
    //   });
    // }
  }

  checkAll(event){
    if(event.target.checked){
      $('.userCheckbox').prop('checked',true);
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
        this.setState({
          "AadharForms"        : true,
          "PanCardForm"        : true,
          "DrivingLicenseForm" : true,
          "VotingForm"         : true,
          "PassportForm"       : true,
          "RationCardForm"     : true,
          "AllForms"           : true
        });
    }else{
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        "AadharForms"        : false,
        "PanCardForm"        : false,
        "DrivingLicenseForm" : false,
        "VotingForm"         : false,
        "RationCardForm"     : false,
        "PassportForm"       : false,
        "AllForms"           : false
        
      });
      $('.userCheckbox').prop('checked',false);
    }
  }

  handleSubmit(e){
      e.preventDefault();
      let serviceName         = this.refs.serviceName.value;
      let serviceRate         = this.refs.serviceRate.value;
      var serviceDayNumbers   = this.refs.serviceDayNumbers.value;
      let servicesDescription = this.refs.servicesDescription.value;
      let userId              = Meteor.userId();
      var id                  = FlowRouter.getParam('id');
      var serviceFor          = this.state.serviceFor;
      var serviceRequired     = this.state.serviceRequired;
      
      var selectedCard        = [];
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
              'cardName': "PanCardForm",
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
           
      if (id) {
        if($("#newTemplateForm").valid()){ 
          let lastModified        = new Date();
          Meteor.call('updateService',id,serviceName,serviceRate,serviceDayNumbers,servicesDescription,serviceRequired,userId,lastModified,serviceFor,selectedCard,(error,result)=>{
              if(error){
                  
              }else{               
                  swal("Done","Your service has been Updated!.","success");
                  $('.uploadedImageFromLocl').attr('src', "");
                  $("#serviceName").val("");
                  var path = "/admin/ListOfServices";
                  FlowRouter.go(path);
                  $('.uploadedImageFromLocl').attr('src', "");
                  $(".serviceName").val("");   
                  $(".serviceRate").val("");   
                  $(".serviceDuration").val("");   
                  $(".servicesDescription").val("");  
                    // $('#servicesDescription').summernote('code','');
              }
          });
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
              <li className="active">Edit Service</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Edit Service
                    </h3>
                    <div className="box-tools pull-right">
                      {/*<button type="button" className="btn btn-box-tool btn-minus" data-widget="collapse">
                        <i className="fa fa-minus" />
                      </button>
                      <div className="btn-group">
                        <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                          <i className="fa fa-wrench" /></button>
                        <ul className="dropdown-menu" role="menu">
                          <li>
                            <a href="#">Action</a>
                          </li>
                          <li>
                            <a href="#">Another action </a>
                          </li>
                          <li>
                            <a href="#">Something else here</a>
                          </li>
                          <li className="divider" />
                          <li>
                            <a href="#">
                            Separated link
                            </a> 
                          </li>
                        </ul>
                      </div>
                      <button type="button" className="btn btn-box-tool" data-widget="remove">
                        <i className="fa fa-times" />
                      </button>*/}
                    </div>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        
                          <div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <form className="newTemplateForm" id="newTemplateForm">
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
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service Name<span className="astrikReq">*</span>:</label>
                                     <input type="text" ref="serviceName" id="serviceName" name="serviceName" value={this.state.serviceName}  onChange={this.handleChange} className="templateName serviceName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service Rate<span className="astrikReq">*</span>:</label>
                                     <input type="number" ref="serviceRate" id="serviceRate" name="serviceRate" value={this.state.serviceRate}  onChange={this.handleChange} className="templateName serviceRate col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Service Duration<span className="astrikReq">*</span>:</label>
{/*                                     <input type="text" ref="serviceDuration" id="serviceDuration" name="serviceDuration" value={this.state.serviceDuration}  onChange={this.handleChange} className="templateName serviceDuration col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
*/}                                   <div className="col-lg-12 servicesDays">
                                        <input type="number" className="templateName serviceRate col-lg-12 col-md-12 col-sm-12 col-xs-12 form-control inputValid"
                                        ref="serviceDayNumbers" id="serviceDayNumbers" name="serviceDayNumbers" value={this.state.serviceDayNumbers}   onChange={this.handleChange}/>
                                      </div> 
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                      <label className="label-category">Description<span className="astrikReq">*</span>:</label>
                                      {/*<div id="servicesDescription" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" name="servicesDescription" ref="servicesDescription" value={this.state.servicesDescription} onChange={this.handleChange} ></div>*/}
                                      <textarea name="servicesDescription" ref="servicesDescription" value={this.state.servicesDescription} onChange={this.handleChange} className="form-control servicesDescription col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="10"></textarea>                            
                                   </div>
                                </div>
                              </div>
                            <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-6 uploadedImageFromLocl1">
                                     <div className="form-group subjectDiv">
                                       <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Image Upload<span className="astrikReq">*</span>:</label>
                                        <input type="file" ref="serviceImageFile" id="s3file" name="serviceImageFile"  onChange={this.handleUpload.bind(this)}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />      
                                      </div>  
                                  </div>
                                  <div className="col-lg-6 uploadedImageFromLocl2">     
                                      <div className="uploadedImageFromLocl3">        
                                          <img src={this.state.image} alt="" className="img-responsive uploadedImageFromLocl"/>    
                                      </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    {this.getUploadImagePercentage()}
                                  </div>
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
                                    <input type="radio" name="serviceRequired" data-toggle="collapse" data-target="#indentityInformation" onChange={this.handleChange} ref="serviceRequired" value="StatutoryForm" checked={this.state.serviceRequired === 'StatutoryForm'}/> Identity Information
                                  </div> 
                                </div>
                                <div className="collapse out " id="indentityInformation">
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
                                              <input type="checkbox" name="AllForms"  className ="userCheckbox" ref="AllForms" value={this.state.AllForms} checked={this.state.AllForms} onChange={this.checkAll.bind(this)}/> All 
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
                                <button onClick={this.handleSubmit.bind(this)} type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">UPDATE</button>
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
EditPageContainer = withTracker(({params}) => {
    var _id = FlowRouter.getParam('id');
    const postHandle = Meteor.subscribe('singleServices',_id);
    const services = Services.findOne({"_id":_id})|| {};
    const loading = !postHandle.ready();
    if(_id){
      return {
          loading,
          services,
          // loading1,
          // checklistFieldExpert
      };
    }
})(EditService);

export default EditPageContainer;