import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { TempProofDocs } from "/imports/AssureID/userPortal/api/userProfile.js";
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import { Location } from "/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js";

class WorkForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.workValues){
      this.state ={ 
       "searchArray"              : [],
       "employementId"            : this.props.workValues.employementId,
       "nameOfEmployer"           : this.props.workValues.nameOfEmployer,
       "employerAddress"          : this.props.workValues.employerAddress,
       "employerCity"             : this.props.workValues.employerCity,
       "employerState"            : this.props.workValues.employerState,
       "contactNo"                : this.props.workValues.contactNo,
       "employeeCode"             : this.props.workValues.employeeCode,
       "designation"              : this.props.workValues.designation,
       "department"               : this.props.workValues.department,
       "employmentFrom"           : this.props.workValues.employmentFrom,
       "employmentTo"             : this.props.workValues.employmentTo,
       "lastSalaryDrawn"          : this.props.workValues.lastSalaryDrawn,
       "typeOfEmployement"        : this.props.workValues.typeOfEmployement, 
       "detailOfAgency"           : this.props.workValues.detailOfAgency,
       "reasonOfLeaving"          : this.props.workValues.reasonOfLeaving,
       "dutiesAndResponsibilites" : this.props.workValues.dutiesAndResponsibilites,
       "reportingManagerNm"       : this.props.workValues.reportingManagerNm,
       "prevDesignation"          : this.props.workValues.prevDesignation,
       "contactDetails"           : this.props.workValues.contactDetails,
       "proofData"                : this.props.workValues.proofData,
       "employmentProofType"      : this.props.workValues.proofType,
       "editStatus"               : this.props.workValues.editStatus,
       "subscription" : {
        }
      };
    }else{
      this.state ={
       "searchArray"              : [],
       "employementId"            : '',
       "nameOfEmployer"           : '',
       "employerAddress"          : '',
       "employerCity"             : '',
       "employerState"            : '',
       "contactNo"                : '',
       "employeeCode"             : '',
       "designation"              : '',
       "department"               : '',
       "employmentFrom"           : '',
       "employmentTo"             : 'Present',
       "lastSalaryDrawn"          : '',
       "typeOfEmployement"        : '',
       "detailOfAgency"           : '',
       "reasonOfLeaving"          : '',
       "dutiesAndResponsibilites" : '',
       "reportingManagerNm"       : '',
       "prevDesignation"          : '',
       "contactDetails"           : '',
       "proofData"                : '',
       "employmentProofType"      : '',
       "editStatus"               : '',
       "subscription" : {
        }
      };
    }
    this.handleChange = this.handleChange.bind(this);
  }
  showDatePicker(event){
    event.preventDefault();
    var today = new Date();
    $(event.target).datepicker({
      todayHighlight: true,
      endDate: "today",
      maxDate: today
    });
    var inputVal = $(event.target).val();
    this.setState({'employmentFrom':inputVal});
  }
  showDatePicker1(event){
    event.preventDefault();
    $(event.target).datepicker({
      todayHighlight: true
    });
    var inputVal = $(event.target).val();
    this.setState({'employmentTo':inputVal});
    if(inputVal != ""){
      if(this.state.employmentTo != 'Present'){
        $(event.target).parent().parent().parent().find('#reasonOfLeaving').removeAttr('disabled','disabled');
      }
    }else{
      $(event.target).parent().parent().parent().find('#reasonOfLeaving').attr('disabled','disabled');
    }
  }
  componentWillReceiveProps() {
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   event.preventDefault();
   if(this.state.employmentTo != 'Present'){
    if($(event.target).val() == ""){
      $(event.target).parent().parent().parent().find('#reasonOfLeaving').attr('disabled','disabled');
    }else{
      $(event.target).parent().parent().parent().find('#reasonOfLeaving').removeAttr('disabled','disabled');
    }
   }

   const target = event.target;
   const name   = target.name;
   this.setState({
    [name]: event.target.value,
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
  componentDidMount(){
    $.validator.addMethod("regxW1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");

    $.validator.addMethod("regxW2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter numbers only.");
    
    $.validator.addMethod("regxW3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid contact number.");
       
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
  
    $("#workForm").validate({
      rules: {
        designation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        department: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        lastSalaryDrawn: {
          regxW2: /^[0-9]*$|^$/,
        },
        contactNo: {
          regxW3: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
        },
        reportingManagerNm: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        prevDesignation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        contactDetails: {
          regxW3: /^\+?\d+$|$/,
        },
      }  
    }); 
    $("#workFormAdd").validate({
      rules: {
        designation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        department: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        lastSalaryDrawn: {
          regxW2: /^[0-9]*$|^$/,
        },
        contactNo: {
          regxW3: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
        },
        reportingManagerNm: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        prevDesignation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        contactDetails: {
          regxW3: /^\+?\d+$|$/,
        },
      }  
    }); 
    $("#workFormEdit"+this.props.indexValue).validate({
      rules: {
        designation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        department: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        lastSalaryDrawn: {
          regxW2: /^[0-9]*$|^$/,
        },
        contactNo: {
          regxW3: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
        },
        reportingManagerNm: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        prevDesignation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        contactDetails: {
          regxW3: /^\+?\d+$|$/,
        },
      }  
    });
    $("#workForm"+this.props.indexValue).validate({
      rules: {
        designation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        department: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        lastSalaryDrawn: {
          regxW2: /^[0-9]*$|^$/,
        },
        contactNo: {
          regxW3: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
        },
        reportingManagerNm: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        prevDesignation: {
          regxW1: /^[a-zA-Z ]+$|^$/,
        },
        contactDetails: {
          regxW3: /^\+?\d+$|$/,
        },
      }  
    });  
  }
  submitEmpInfo(event){
    event.preventDefault();
    var index   = $(event.target).attr('data-index');
    var id      = Meteor.userId();
    var employementId = this.state.employementId;
    var editstatus    = this.state.editStatus;
    if(this.props.workValues){
      if(this.props.workValues.proofOfDocument){
        var imgLink = this.props.workValues.proofOfDocument;
        var fileName = this.props.workValues.fileName;
        var fileExt = this.props.workValues.fileExt;
      }else if(this.props.proofObj.imageLink){
        var imgLink = this.props.proofObj.imageLink;
        var fileName = this.props.proofObj.name;
        var fileExt = this.props.proofObj.ext;
        var imgId = this.props.proofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.proofData.imageLink){
      var imgLink = this.props.proofData.imageLink;
      var fileName = this.props.proofData.name;
      var fileExt = this.props.proofData.ext;
      var imgId = this.props.proofData._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }
    if(this.refs.employmentTo.value){
      var employmentTo = this.refs.employmentTo.value;
    }else{
      var employmentTo = "Present";
    }
    var employement = {
      "employementId"            : parseInt(employementId),
      "nameOfEmployer"           : this.refs.nameOfEmployer.value,
      "employerAddress"          : this.refs.employerAddress.value,
      "employerCity"             : this.refs.employerCity.value,
      "employerState"            : this.refs.employerState.value,
      "contactNo"                : this.refs.contactNo.value,
      "employeeCode"             : this.refs.employeeCode.value,
      "designation"              : this.refs.designation.value,
      "department"               : this.refs.department.value,
      "employmentFrom"           : this.refs.employmentFrom.value,
      "employmentTo"             : employmentTo,
      "lastSalaryDrawn"          : this.refs.lastSalaryDrawn.value,
      "typeOfEmployement"        : this.refs.typeOfEmployement.value,
      "detailOfAgency"           : this.refs.detailOfAgency.value,
      "reasonOfLeaving"          : this.refs.reasonOfLeaving.value,
      "dutiesAndResponsibilites" : this.refs.dutiesAndResponsibilites.value,
      "reportingManagerNm"       : this.refs.reportingManagerNm.value,
      "prevDesignation"          : this.refs.prevDesignation.value,
      "contactDetails"           : this.refs.contactDetails.value,
      "proofType"                : this.refs.employmentProofType.value,
      "proofOfDocument"          : imgLink,
      "fileName"                 : fileName,
      "fileExt"                  : fileExt,
      "verifiedStatus"           : "Not Verified",
      "editStatus"               : "Open",
    }
    if(this.props.listEmployee){
      var validForm = '#workForm'+this.props.indexValue;
    }else{
      var validForm = '#workFormEdit'+this.props.indexValue;
    }
    if($(validForm).valid()){
      if (employement.employmentTo != "Present") {
         if (Date.parse(employement.employmentFrom) > Date.parse(employement.employmentTo)) {
          swal("Employment From date","is greater than To Date","error");
          }else if(Date.parse(employement.employmentFrom) == Date.parse(employement.employmentTo)){
            swal("Employment From date","as same as To Date","error");
          }else{
            Meteor.call('updateEmployement',id,employement,index,function (error,result) {
             if(error){
                console.log(error.reason);
              }else{
                $('#editexperienceinfo-'+index).modal('hide');
                $('#editExperienceInfo-'+index).modal('hide');
                Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
                  if (error) {
                   console.log(error.reason);
                  }else{  
                  }
                }); 
                if (editstatus == "Reopen") {
                  Meteor.call('updateTicketAfterReopen',id,"employement",employementId,employement); 
                } 
              }
            });
            if($('.effect-21.proofType').hasClass('error')){
              $('.proofType.error').removeClass('error has-content');
            }
          }
      }else{
        Meteor.call('updateEmployement',id,employement,index,function (error,result) {
         if(error){
            console.log(error.reason);
          }else{
            $('#editexperienceinfo-'+index).modal('hide');
            $('#editExperienceInfo-'+index).modal('hide');
            Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
              if (error) {
               console.log(error.reason);
              }else{  
              }
            }); 
            if (editstatus == "Reopen") {
              Meteor.call('updateTicketAfterReopen',id,"employement",employementId,employement); 
            } 
          }
        });
        if($('.effect-21.proofType').hasClass('error')){
          $('.proofType.error').removeClass('error has-content');
        }
      }
      
    }else{
      $(event.target).parent().find('.effect-21.error').addClass('has-content');
      $(event.target).parent().find('.effect-21.error:first').focus();
    }
  }
  submitEmployerInformation(event){
    console.log("Inside");
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
    if(this.refs.employmentTo.value){
      var employmentTo = this.refs.employmentTo.value;
    }else{
      var employmentTo = "Present";
    } 
    var employementObj = UserProfile.findOne({"userId": id}, {sort: {'employement.employementId': -1}});
    if(employementObj){
      if (employementObj.employement) {
         if (employementObj.employement.length > 0 ) {
          var lastelem    = _.last(employementObj.employement);
          var employementId =  parseInt(lastelem.employementId) + 1;
        }else{
         var employementId=  1;
        }
      }
      else{
        var employementId=  1;
      }
    }
    console.log("this.refs.typeOfEmployement.value :"+this.refs.typeOfEmployement.value);
    var typeOfEmployement;
    if(this.refs.typeOfEmployement.value == "-- Select --"){
      typeOfEmployement = "-";
    }else{
      typeOfEmployement = this.refs.typeOfEmployement.value;
    }
    var employement = {
      "employementId"            : employementId,
      "nameOfEmployer"           : this.refs.nameOfEmployer.value,
      "employerAddress"          : this.refs.employerAddress.value,
      "employerCity"             : this.refs.employerCity.value,
      "employerState"            : this.refs.employerState.value,
      "contactNo"                : this.refs.contactNo.value,
      "employeeCode"             : this.refs.employeeCode.value,
      "designation"              : this.refs.designation.value,
      "department"               : this.refs.department.value,
      "employmentFrom"           : this.refs.employmentFrom.value,
      "employmentTo"             : employmentTo,
      "lastSalaryDrawn"          : this.refs.lastSalaryDrawn.value,
      "typeOfEmployement"        : typeOfEmployement,
      "detailOfAgency"           : this.refs.detailOfAgency.value,
      "reasonOfLeaving"          : this.refs.reasonOfLeaving.value,
      "dutiesAndResponsibilites" : this.refs.dutiesAndResponsibilites.value,
      "reportingManagerNm"       : this.refs.reportingManagerNm.value,
      "prevDesignation"          : this.refs.prevDesignation.value,
      "contactDetails"           : this.refs.contactDetails.value,
      "proofType"                : this.refs.employmentProofType.value,
      "proofOfDocument"          : imgLink,
      "fileName"                 : fileName,
      "fileExt"                  : fileExt,
      "verifiedStatus"           : "Not Verified",
      "editStatus"               : "Open",
    }
    console.log("employement :",employement);

    if(this.props.workFormAdd){
      var validForm = '#workFormAdd';
    }else{
      var validForm = '#workForm';
    }

    if($(validForm).valid()){
      if (employement.employementTo != "Present") {
        if (Date.parse(employement.employmentFrom) > Date.parse(employement.employmentTo)) {
          swal("Employment From date","is greater than To Date","error");
        }else if(Date.parse(employement.employmentFrom) == Date.parse(employement.employmentTo)){
          swal("Employment From date","as same as To Date","error");
        }else{
           Meteor.call('insertEmployement',id,employement,function (error,result) {
           if(error){
              console.log(error.reason);
            }else{
              $(event.target).parent().find('.effect-21').removeClass('has-content');
              if($('#menu3').hasClass('in active')){
                // browserHistory.replace('/profileForms/menu7');
                // $('html, body').animate({
                //   'scrollTop' : $(".profileBody").position().top
                // });
                // $('#menu3').removeClass('in active');
                // $('.menu3').removeClass('active');
                // $('#menu7').addClass('in active');
                // $('.menu7').addClass('active');  
              }else{
                $('#experienceinfo').modal('hide');
              }     
            }
          });
          $(event.target).parent().find('select').val('-- Select --');
          this.setState({
           "nameOfEmployer"           : '',
           "employerAddress"          : '',
           "employerCity"             : '',
           "employerState"            : '',
           "contactNo"                : '',
           "employeeCode"             : '',
           "designation"              : '',
           "department"               : '',
           "employmentFrom"           : '',
           "employmentTo"             : 'Present',
           "lastSalaryDrawn"          : '',
           "typeOfEmployement"        : '',
           "detailOfAgency"           : '',
           "reasonOfLeaving"          : '',
           "dutiesAndResponsibilites" : '',
           "reportingManagerNm"       : '',
           "prevDesignation"          : '',
           "contactDetails"           : '',
           "employmentProofType"      : '',
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
         Meteor.call('insertEmployement',id,employement,function (error,result) {
         if(error){
            console.log(error.reason);
          }else{
            $(event.target).parent().find('.effect-21').removeClass('has-content');
            if($('#menu3').hasClass('in active')){
              // browserHistory.replace('/profileForms/menu7');
              // $('html, body').animate({
              //   'scrollTop' : $(".profileBody").position().top
              // });
              // $('#menu3').removeClass('in active');
              // $('.menu3').removeClass('active');
              // $('#menu7').addClass('in active');
              // $('.menu7').addClass('active');  
            }else{
              $('#experienceinfo').modal('hide');
            }     
          }
        });
        $(event.target).parent().find('select').val('-- Select --');
        this.setState({
         "nameOfEmployer"           : '',
         "employerAddress"          : '',
         "employerCity"             : '',
         "employerState"            : '',
         "contactNo"                : '',
         "employeeCode"             : '',
         "designation"              : '',
         "department"               : '',
         "employmentFrom"           : '',
         "employmentTo"             : 'Present',
         "lastSalaryDrawn"          : '',
         "typeOfEmployement"        : '',
         "detailOfAgency"           : '',
         "reasonOfLeaving"          : '',
         "dutiesAndResponsibilites" : '',
         "reportingManagerNm"       : '',
         "prevDesignation"          : '',
         "contactDetails"           : '',
         "employmentProofType"      : '',
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
      $(event.target).parent().find('.effect-21.error').addClass('has-content');
      $(event.target).parent().find('.effect-21.error:first').focus();
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
        var prooftype = "employement";
        var ext = fileName.split('.').pop();
        $(event.target).parent().parent().find('.selectWidthEmp').addClass('otherDocSelect');
        $(event.target).parent().parent().find('.selectWidthEmp').find('label').css('fontWeight','100');
        $(event.target).parent().siblings('.fileName').css({'display':'block','marginTop':'1px','marginBottom':'0px'});
        $(event.target).parent().siblings('.fileName').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.fileName').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.employementProgressDiv').children('#errorProofEmp').removeClass('error');
            $(event.target).parent().siblings('.employementProgressDiv').children('#errorProofEmp').html('');
            $(event.target).parent().parent().find('.selectWidthEmp').addClass('zeroMarginTop');
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);
            $(event.target).parent().siblings('.employementProgressDiv').css('display','block');
          }else{
            $(event.target).parent().siblings('.employementProgressDiv').css('display','block');
            $(event.target).parent().siblings('.employementProgressDiv').children('#errorProofEmp').addClass('error');
            $(event.target).parent().siblings('.employementProgressDiv').children('#errorProofEmp').html('<p>Only jpg, png, pdf format is supported.</p>');
            $(event.target).parent().siblings('.employementProgressDiv').children('#errorProofEmp').css({'color':'#e40b0b','fontSize':'13px'});
          }
        }
      }
    }else{
      swal('Please select the employment prooftype.');
      $('#employmentProofType').addClass('error has-content');
    }
  }
  inputFileChange(event){
    event.preventDefault();
    if(this.refs.employmentProofType.value != '-- Select --'){
      $(event.target).siblings('.inputFiles').click();
    }else{
      swal('Please select the employment prooftype.');
      $(event.target).parent().parent().siblings().find('#employmentProofType').addClass('error has-content');
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
    $('#editexperienceinfo-'+index).animate({
      'scrollTop' : 0
    });
    $('#experienceinfo').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#empProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#empProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#empProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#empProofModals').css('display','block');
    }
  }
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#empProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#empProofModals').css('display','none');
  }
  residingToChange(event){
    event.preventDefault();
    if($(event.target).hasClass('residingToChangeLabel')){
      $(event.target).parent().parent().find('#reasonOfLeaving').attr('disabled','disabled');
      $(event.target).parent().find('#employmentTo').val('');
      $(event.target).parent().find('#employmentTo').removeClass('has-content')
      $(event.target).parent().css('display','none');
      $(event.target).parent().siblings('.employToDate').css('display','block');
    }else{
      $(event.target).parent().parent().parent().css('display','none');
      $(event.target).parent().parent().parent().siblings('#employTo').css('display','block');
      $(event.target).parent().parent().parent().siblings('#employToDate').css('display','block');
    }
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
      var searchData = Location.find({$or:[{'city':RegExpBuildValue},{"state":RegExpBuildValue}]}).fetch();
      if(searchData){
        if($(event.target).hasClass('employerCity')){
          var pluckCity = _.pluck(searchData,"city");
          var uniqueCity = _.uniq(pluckCity);
          this.setState({"searchArray":uniqueCity});
        }else if($(event.target).hasClass('employerState')){
          var pluckState = _.pluck(searchData,"state");
          var uniqueState = _.uniq(pluckState);
          this.setState({"searchArray":uniqueState});
        }
      }else{
      }
    }else{
      this.setState({"searchArray":[]});
      $(event.target).val('');
    }
  }
  // fresherCheckbox(event){
  //   event.preventDefault();
  //   const target = event.target;
  //   console.log("target",target);
  //   const value  = target.type === 'checkbox' ? target.checked : target.value;
  //   console.log("value",value);
  //   const name   = target.name;
  //   console.log("name",name);
  //   this.setState({
  //    [name]: value,
  //   },()=>{
  //     if (this.props.workFormAdd) {
  //      var id = "#workFormAdd";
  //     }else{
  //       if(this.props.workValues) {
  //         if (this.props.listEmployee) {
  //          var id = "#workForm"+this.props.indexValue;
  //         }else{
  //           var id = "#workFormEdit"+this.props.indexValue;
  //         }
  //       }else{
  //          var id = "#workForm";
  //       }   
  //     }
  //     console.log("id",id);
  //     console.log("areYouFresher",this.state.areYouFresher);
  //     if (this.state.areYouFresher == true) {
  //       $(id).css("display","none");
  //     }else{
  //       $(id).css("display","block");
  //     }
  //   });
  // }
  render(){
    return(
      <div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
           <form>
              <input type="checkbox" name="areYouFresher" id="areYouFresher" ref="areYouFresher" value={this.state.areYouFresher} /> &nbsp; Are you Fresher?
           </form>
        </div>
        <form className="workForm basicForm" id={this.props.workFormAdd ? "workFormAdd" : this.props.workValues ? this.props.listEmployee ? "workForm" + this.props.indexValue : "workFormEdit" + this.props.indexValue : "workForm"}>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
              <input type="text" className={this.state.nameOfEmployer ? this.state.nameOfEmployer != '' ? "effect-21 form-control loginInputs has-content required" : "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs required"} id="nameOfEmployer" name="nameOfEmployer" ref="nameOfEmployer" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.nameOfEmployer}/>
              <label>Company Name<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.employerAddress ? this.state.employerAddress != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="employerAddress" name="employerAddress" ref="employerAddress" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.employerAddress}/>
              <label>Company Address</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" className={this.state.employerCity ? this.state.employerCity != '' ? "effect-21 form-control loginInputs has-content employerCity required" : "effect-21 form-control loginInputs employerCity required" : "effect-21 form-control loginInputs employerCity required"} list="autoCityInEmp" id="employerCity" name="employerCity" ref="employerCity" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.employerCity} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>City<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
             <datalist className="autocomplete" id="autoCityInEmp">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <option value={searchDetails} key={searchDetails + '-searchCity'} />                        
                  );
                })
              }
            </datalist>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" className={this.state.employerState ? this.state.employerState != '' ? "effect-21 form-control loginInputs has-content employerState required" : "effect-21 form-control loginInputs employerState required" : "effect-21 form-control loginInputs employerState required"} list="autoStateInEmp" id="employerState" name="employerState" ref="employerState" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.employerState} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>State<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
             <datalist className="autocomplete" id="autoStateInEmp">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <option value={searchDetails} key={searchDetails + '-searchState'} />                        
                  );
                })
              }
            </datalist>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-phone" aria-hidden="true"></i></span>
              <input type="text" className={this.state.contactNo ? this.state.contactNo != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="contactNo" name="contactNo" ref="contactNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.contactNo}/>
              <label>Company Contact No</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-id-badge" aria-hidden="true"></i></span>
              <input type="text" className={this.state.employeeCode ? this.state.employeeCode != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="employeeCode" name="employeeCode" ref="employeeCode" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.employeeCode} required/>
              <label>Employee Code / Employee ID<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <input type="text" className={this.state.designation ? this.state.designation != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="designation" name="designation" ref="designation" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.designation} required/>
              <label>Designation<span className="astrikReq">*</span> </label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div> 
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <input type="text" className={this.state.department ? this.state.department != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="department" name="department" ref="department" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.department}/>
              <label>Department</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 "> 
            <label  style={{marginTop: "10"+"px"}}>Employment Period</label>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="text" className={this.state.employmentFrom ? this.state.employmentFrom != "" ? "effect-21 form-control loginInputs has-content required" : "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs required"} id="employmentFrom" name="employmentFrom" ref="employmentFrom" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.employmentFrom} onFocus={this.showDatePicker.bind(this)}/>
              <label className="">From<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 employToDate" style={{display: this.state.employmentTo == "Present" ? "block" : "none"}}>
            <label className="residingDateSelect">To<span className="astrikReq">*</span></label> 
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 residingToRadio">
              <label className="radio"><input type="radio" defaultChecked="checked" name="employToDate" value="stillWorkingHere" ref="" />Still working here</label>
              <label className="radio"><input type="radio" name="employToDate" value="selectToDate"  ref="" onClick={this.residingToChange.bind(this)}/>Select to date</label>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" id={this.state.employmentTo != 'Present' ? "employTo" : "employToDate"} style={{display: this.state.employmentTo == "Present" ? "none" : "block"}} >
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="text" className={this.state.employmentTo ? this.state.employmentTo != 'Present' ? "effect-21 form-control loginInputs has-content required" : "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs required"} id="employmentTo" name="employmentTo" ref="employmentTo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.employmentTo != 'Present' ? this.state.employmentTo : ""} onFocus={this.showDatePicker1.bind(this)}/>
              <label className="">To<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
            <span className="residingToChangeLabel pull-right fa fa-angle-double-left fa-lg" onClick={this.residingToChange.bind(this)}></span>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-inr" aria-hidden="true"></i></span>
              <input type="text" className={this.state.lastSalaryDrawn ? this.state.lastSalaryDrawn != "" ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="lastSalaryDrawn" name="lastSalaryDrawn" ref="lastSalaryDrawn" onChange={this.handleChange}  onBlur={this.inputEffect.bind(this)} value={this.state.lastSalaryDrawn}/>
              <label>Last Salary Drawn</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
              <select className={this.state.typeOfEmployement ? this.state.typeOfEmployement != '-- Select --' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="typeOfEmployement" name="typeOfEmployement" ref="typeOfEmployement" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.typeOfEmployement}>
                <option disabled="disabled">-- Select --</option>
                <option>Permanent</option>
                <option>Temporary</option>
                <option>Contractual</option>
              </select>
              <label className="">Type of Employment</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div> 
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-info" aria-hidden="true"></i></span>
              <textarea rows="2" className={this.state.detailOfAgency ? this.state.detailOfAgency != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} ref="detailOfAgency" id="detailOfAgency" name="detailOfAgency" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.detailOfAgency}></textarea>
              <label>Details of Agency [If deployed from another agency]</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <input type="text" disabled="disabled" className={this.state.reasonOfLeaving ? this.state.reasonOfLeaving != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="reasonOfLeaving" name="reasonOfLeaving" ref="reasonOfLeaving" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.reasonOfLeaving}/>
              <label>Reason Of Leaving</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <textarea rows="2" className={this.state.dutiesAndResponsibilites ? this.state.dutiesAndResponsibilites != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} ref="dutiesAndResponsibilites" id="dutiesAndResponsibilites" name="dutiesAndResponsibilites" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.dutiesAndResponsibilites}></textarea>
              <label>Duties & Responsibilities</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
              <input type="text" className={this.state.reportingManagerNm ? this.state.reportingManagerNm != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="reportingManagerNm" name="reportingManagerNm" ref="reportingManagerNm" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.reportingManagerNm}/>
              <label>Reporting Manager Name</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
              <input type="text" className={this.state.prevDesignation ? this.state.prevDesignation != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="prevDesignation" name="prevDesignation" ref="prevDesignation" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.prevDesignation}/>
              <label>Reporting Manager Designation</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-phone" aria-hidden="true"></i></span>
              <input type="text" className={this.state.contactDetails ? this.state.contactDetails != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="contactDetails" name="contactDetails" ref="contactDetails" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.contactDetails}/>
              <label>Reporting Manager Contact No</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <select className={this.state.employmentProofType ? this.state.employmentProofType != '-- Select --' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} id="employmentProofType" name="employmentProofType" ref="employmentProofType" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.employmentProofType ? this.state.employmentProofType : '-- Select --'}>
                  <option disabled="disabled">-- Select --</option>
                  <option>Offer Letter</option>
                  <option>Experience Letter</option>
                  <option>Appointment Letter</option>
                </select>
                <label className="">Employment Proof Type</label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div> 
            {
              !this.props.proofData.imageLink && !this.props.workValues ?
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthEmp">
                    <div className="input-effect input-group">
                      <label className="empLabelMarTop">Proof of Employment</label>&nbsp;&nbsp;
                    </div>
                  </div>
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileName" style={{display: "none"}}>
                    <div className="input-effect input-group">
                      <label></label>
                    </div>
                  </div>
                  <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButtonEmp">
                    <input type="file" className="btn btn-info inputFiles" data-subtype="employementDetails" onChange={this.uploadProofDocs.bind(this)}/>
                    <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress employementProgressDiv" style={{display: "none"}}>
                    <div id="errorProofEmp"></div>
                    {this.getUploadImagePercentage()}
                  </div>
                </div>
              :
              this.props.workValues ?
                this.props.workValues.proofOfDocument ?
                <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  {
                    this.props.workValues.fileExt == 'jpg' || this.props.workValues.fileExt == 'png' || this.props.workValues.fileExt == 'jpeg' ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                        <a href=""><img className="img" src={this.props.workValues.proofOfDocument} onClick={this.employementModal.bind(this)} data-index={this.props.indexValue} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.workValues.proofOfDocument} data-name={this.props.workValues.fileName} data-ext={this.props.workValues.fileExt} data-index={this.props.indexValue} data-subtype="editEmployementDetails"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                      <a href="" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.workValues.fileName}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.workValues.proofOfDocument} data-name={this.props.workValues.fileName} data-ext={this.props.workValues.fileExt} data-index={this.props.indexValue} data-subtype="editEmployementDetails"></i>
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
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editEmployementDetails"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                      <a href="" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editEmployementDetails"></i>
                    </div>
                  }   
                </div>  
                :
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-12 selectWidthEmp">
                    <div className="input-effect input-group">
                      <label className="empLabelMarTop">Proof of Employment</label>&nbsp;&nbsp;
                    </div>
                  </div>
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-12 fileName" style={{display: "none"}}>
                    <div className="input-effect input-group">
                      <label></label>
                    </div>
                  </div>
                  <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-12 nopadLeft BrowseButtonEmp">
                    <input type="file" className="btn btn-info inputFiles" data-subtype="editEmployementDetails" onChange={this.uploadProofDocs.bind(this)}/>
                    <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress employementProgressDiv" style={{display: "none"}}>
                    <div id="errorProofEmp"></div>
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
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="employementDetails"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="employementDetails"></i>
                  </div>
                }   
              </div>  
              :
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-12 selectWidthEmp">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Employment</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-12 fileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-12 nopadLeft BrowseButtonEmp">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="employementDetails" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress employementProgressDiv" style={{display: "none"}}>
                  <div id="errorProofEmp"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div> 
            }
          </div>
          <div className="modal fade" id="empProofModals" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    { 
                      this.props.workValues ?
                        this.props.workValues.proofOfDocument ?
                          this.props.workValues.fileExt == 'jpg' || this.props.workValues.fileExt == 'png' || this.props.workValues.fileExt == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <img src={this.props.workValues.proofOfDocument} style={{width: "100"+"%"}} />
                            </div>
                          :
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <iframe src={this.props.workValues.proofOfDocument} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                          </div>
                        :
                        this.props.proofObj ?
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
          <button type="submit" className="btn btn-info pull-right" onClick={this.props.workValues ? this.submitEmpInfo.bind(this) : this.submitEmployerInformation.bind(this)} data-index={this.props.indexValue}>Save</button>
        </form>

      </div>
    );
  }
}
EditPageContainer = withTracker(({props}) => {
    var _id          = Meteor.userId();
    const postHandle = Meteor.subscribe('TempProofDocs',_id);
    var proofData    = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'employement',"proofSubtype":'employementDetails'}) || {};
    var proofObj     = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'employement',"proofSubtype":'editEmployementDetails'}) || {};
    const loading    = !postHandle.ready();
     
    return {
      loading,
      proofData,
      proofObj,
    };
})(WorkForm);
export default EditPageContainer;