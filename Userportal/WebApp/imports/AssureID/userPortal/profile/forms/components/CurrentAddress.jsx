import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { Location } from "/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js";
import { TempProofDocs } from "/imports/AssureID/userPortal/api/userProfile.js";
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";

class CurrentAddress extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.currentAddressValues){
      this.state ={ 
        "searchArray"         : [],
        'currentAddressId'    : this.props.currentAddressValues.currentAddressId,
        'tempLine1'           : this.props.currentAddressValues.tempLine1,
        'tempLine2'           : this.props.currentAddressValues.tempLine2,
        'tempLine3'           : this.props.currentAddressValues.tempLine3,
        'tempLandmark'        : this.props.currentAddressValues.tempLandmark, 
        'tempCity'            : this.props.currentAddressValues.tempCity,
        'tempState'           : this.props.currentAddressValues.tempState, 
        'tempCountry'         : this.props.currentAddressValues.tempCountry,
        'tempPincode'         : this.props.currentAddressValues.tempPincode,
        'tempresidingFrom'    : this.props.currentAddressValues.tempresidingFrom,  
        'tempresidingTo'      : this.props.currentAddressValues.tempresidingTo,
        'currentProofType'    : this.props.currentAddressValues.proofType,
        'editStatus'          : this.props.currentAddressValues.editStatus,
        "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
    this.state ={
        "searchArray"      : [],
        'currentAddressId' : '',
      	'tempLine1'        : '',
        'tempLine2'        : '',
        'tempLine3'        : '',
        'tempLandmark'     : '',
        'tempCity'         : '',
        'tempState'        : '',
        'tempCountry'      : '',
        'tempPincode'      : '',
        'tempresidingFrom' : '',
        'tempresidingTo'   : 'Present',
        'currentProofType' : '0',
        'editStatus'       :  '',
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
      todayHighlight: true,
      endDate: "today",
      maxDate: today,
      format: 'dd/mm/yyyy'
    });
    if($(event.target).val() != ''){
      $(event.target).addClass('has-content');
    }else{
      $(event.target).removeClass('has-content');
    }
  }
  showDatePickerResidingFrom(event){
    event.preventDefault();
    var today = new Date();
    $(event.target).datepicker({
      todayHighlight: true,
      endDate: "today",
      maxDate: today,
      format: 'dd/mm/yyyy'
    });
    if($(event.target).val() != ''){
      $(event.target).addClass('has-content');
    }else{
      $(event.target).removeClass('has-content');
    }
  }
  currAddrModal(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    $('#currentAddressModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#currAddrModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#currentaddAddressModal').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#currAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#currAddrProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#currAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#currAddrProofModals').css('display','block');
    }
  }
  closeProofModal(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#currAddrProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#currAddrProofModals').css('display','none');
  }

  handleChange(event){
   event.preventDefault();
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
  tempResidingToChange(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    if($(event.target).hasClass('tempResidingToChangeLabel')){
      $('#tempResidingToDate'+index).css('display','none');
      $('#tempResidingToOfAddress'+index).css('display','none');
      $('#tempResidingToOfAddress'+index).find('input#residingTo').val('');
      $('#tempResidingToOfAddress'+index).find('input#residingTo').removeClass('has-content');
      $('#tempResidingToDate'+index).find('input#residingTo').val('');
      $('#tempResidingToDate'+index).find('input#residingTo').removeClass('has-content');
      $('input[name=tempResidingToDate]').parent().parent().parent().css('display','block'); 
    }else{
     $('#tempResidingToOfAddress'+index).css('display','block');
      $('#tempResidingToDate'+index).css('display','block');
      $('input[name=tempResidingToDate]').parent().parent().parent().css('display','none');       
    }
  }
  componentDidMount(){    
    $.validator.addMethod("regxA1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");

    $.validator.addMethod("regxA2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid pincode.");
          
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
  
    $("#addCurrentAddressForm").validate({
      rules: {
        tempCity: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempState: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempCountry: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempPincode: {
          required:true,
          regxA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
    });
    $("#currentAddrForm-"+this.props.indexVal).validate({
      rules: {
        tempCity: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempState: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempCountry: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempPincode: {
          required:true,
          regxA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
    });
    $("#currentAddressForm-"+this.props.indexVal).validate({
      rules: {
        tempCity: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempState: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempCountry: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        tempPincode: {
          required:true,
          regxA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
    });
  }
  editTemporaryAddress(event){
    event.preventDefault(); 
    var index = $(event.currentTarget).attr('data-index');
    var id    = this.props.id;
    if(this.refs.tempresidingTo.value){
      var tempresidingTo = this.refs.tempresidingTo.value;
    }else{
      var tempresidingTo = "Present";
    } 

    if(FlowRouter.current().path == '/profileForms/menu1'){
      var addrForm = '#currentAddrForm-';
    }else{
      var addrForm = '#currentAddressForm-';
    }

    if($(addrForm+index).valid()){
      if(this.props.currentAddressValues){
        if(this.props.currentAddressValues.proofOfDocument){
          var imgLink = this.props.currentAddressValues.proofOfDocument;
          var fileName = this.props.currentAddressValues.fileName;
          var fileExt = this.props.currentAddressValues.fileExt;
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
      }else if(this.props.proofCurrAddrData.imageLink){
        var imgLink = this.props.proofCurrAddrData.imageLink;
        var fileName = this.props.proofCurrAddrData.name;
        var fileExt = this.props.proofCurrAddrData.ext;
        var imgId = this.props.proofCurrAddrData._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }

      var currentAddressId     = $(event.currentTarget).attr('id');      
      var editstatus           = this.state.editStatus;
      var userId = Meteor.userId();
      var selectedAddress = {
        "currentAddressId"   : parseInt(currentAddressId),
        "tempLine1"          : this.refs.tempLine1.value,
        "tempLine2"          : this.refs.tempLine2.value,
        "tempLine3"          : this.refs.tempLine3.value,
        "tempLandmark"       : this.refs.tempLandmark.value,
        "tempCity"           : this.refs.tempCity.value,
        "tempState"          : this.refs.tempState.value,
        "tempCountry"        : this.refs.tempCountry.value,
        "tempPincode"        : this.refs.tempPincode.value,
        "tempresidingFrom"   : this.refs.tempresidingFrom.value,
        "tempresidingTo"     : tempresidingTo,
        "proofType"          : this.refs.currentProofType.value,
        "createdAt"          : new Date(),
        "proofOfDocument"    : imgLink,
        "fileName"           : fileName,
        "fileExt"            : fileExt,
        "verifiedStatus"     : "Not Verified",
        "editStatus"         : "Open",
      }
      if(selectedAddress.tempresidingTo != "Present") {
        if (Date.parse(selectedAddress.tempresidingFrom) > Date.parse(selectedAddress.tempresidingTo)) {
          swal("Residing From Date","is greater than Residing To Date","error");
        }else if (Date.parse(selectedAddress.tempresidingFrom) == Date.parse(selectedAddress.tempresidingTo)) {
          swal("Residing From Date","as same as Residing To Date","error");
        }else{
          Meteor.call('editCurrentAddress',id,currentAddressId,selectedAddress,function (error,result) {
           if(error){
              console.log(error.reason);
            }else{
              $('#currentAddressModal-'+index).modal('hide');
              $('#currAddrModal-'+index).modal('hide');
              Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
                if (error) {
                 console.log(error.reason);
                }else{  
                }
              }); 
              if (editstatus == "Reopen") {
                 Meteor.call('updateTicketAfterReopen',userId,"currentAddress",currentAddressId,selectedAddress); 
              }
            }
          });

          if($('.effect-21.proofType').hasClass('error')){
            $('.proofType.error').removeClass('error has-content');
          } 
        }
      }else{
        Meteor.call('editCurrentAddress',id,currentAddressId,selectedAddress,function (error,result) {
         if(error){
            console.log(error.reason);
          }else{
            $('#currentAddressModal-'+index).modal('hide');
            $('#currAddrModal-'+index).modal('hide');
            Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
              if (error) {
               console.log(error.reason);
              }else{  
              }
            }); 
            if (editstatus == "Reopen") {
               Meteor.call('updateTicketAfterReopen',userId,"currentAddress",currentAddressId,selectedAddress); 
            }
          }
        });

        if($('.effect-21.proofType').hasClass('error')){
          $('.proofType.error').removeClass('error has-content');
        } 
      }
    }else{
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    }
  }
  submitTemporaryAddress(event){
    event.preventDefault(); 
    if(this.props.proofCurrAddrData){
      if(this.props.proofCurrAddrData.proofSubtype == 'currentAddress'){
        var imgLink = this.props.proofCurrAddrData.imageLink;
        var fileName = this.props.proofCurrAddrData.name;
        var fileExt = this.props.proofCurrAddrData.ext;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }
    if(this.refs.tempresidingTo.value){
      var tempResidingToDate = this.refs.tempresidingTo.value;
    }else{
      var tempResidingToDate = "Present";
    } 
    if($('#addCurrentAddressForm').valid()){
	    var id   = Meteor.userId();
	    var addressObj = UserProfile.findOne({"userId": id}, {sort: {'currentAddress.currentAddressId': -1}});
	    if(addressObj){ 
	      if (addressObj.currentAddress) {
          if (addressObj.currentAddress.length > 0) {
            var lastelem           = _.last(addressObj.currentAddress);
            var currentAddressId =  parseInt(lastelem.currentAddressId) + 1;
          }
          else{
            var currentAddressId =  1;
          }
        }else{
            var currentAddressId =  1;
        }      
	    }
	    var currentAddress = {
	      "currentAddressId"   : currentAddressId,
	      "tempLine1"          : this.refs.tempLine1.value,
	      "tempLine2"          : this.refs.tempLine2.value,
	      "tempLine3"          : this.refs.tempLine3.value,
	      "tempLandmark"       : this.refs.tempLandmark.value,
	      "tempCity"           : this.refs.tempCity.value,
	      "tempState"          : this.refs.tempState.value,
	      "tempCountry"        : this.refs.tempCountry.value,
	      "tempPincode"        : this.refs.tempPincode.value,
	      "tempresidingFrom"   : this.refs.tempresidingFrom.value,
	      "tempresidingTo"     : tempResidingToDate,
        "proofType"          : this.refs.currentProofType.value,
	      "createdAt"          : new Date(),
	      "proofOfDocument"    : imgLink,
	      "fileName"           : fileName,
	      "fileExt"            : fileExt,
	      "verifiedStatus"     : "Not Verified",
	      "editStatus"         : "Open"
	    }
      if (currentAddress.tempresidingTo != "Present") {
        if (Date.parse(currentAddress.tempresidingFrom) > Date.parse(currentAddress.tempresidingTo)) {
          swal("Residing From Date","is greater than Residing To Date","error");
        }else if (Date.parse(currentAddress.tempresidingFrom) == Date.parse(currentAddress.tempresidingTo)) {
          swal("Residing From Date","as same as Residing To Date","error");
        }else{
          Meteor.call('insertTemporaryAddress',id,currentAddress,function (error,result) {
           if(error){
              console.log(error.reason);
            }else{
              $("#addCurrentAddressForm").find("input.effect-21").val("");  
              $("#addCurrentAddressForm").find("select.effect-21").val("-- Select --");
              $("#addCurrentAddressForm").find(".effect-21").removeClass("has-content");          
              $('#currentaddAddressModal').modal('hide');
            }
          });
          var imgId = this.props.proofCurrAddrData._id;
          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             console.log(error.reason);
            }else{  
            }
          });
          if($('.effect-21.proofType').hasClass('error')){
            $('.proofType.error').removeClass('error has-content');
          } 
        }
      }else{
        Meteor.call('insertTemporaryAddress',id,currentAddress,function (error,result) {
         if(error){
            console.log(error.reason);
          }else{
            $("#addCurrentAddressForm").find("input.effect-21").val("");  
            $("#addCurrentAddressForm").find("select.effect-21").val("-- Select --");
            $("#addCurrentAddressForm").find(".effect-21").removeClass("has-content");          
            $('#currentaddAddressModal').modal('hide');
          }
        });
        var imgId = this.props.proofCurrAddrData._id;
        Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
          if (error) {
           console.log(error.reason);
          }else{  
          }
        });
        if($('.effect-21.proofType').hasClass('error')){
          $('.proofType.error').removeClass('error has-content');
        } 
      }	    
	  }else{
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    } 
  }
  inputFileChange(event){
    event.preventDefault();
    if(this.refs.currentProofType.value != '0'){
      $(event.target).siblings('.inputFiles').click();
    }else{
      swal('Please select the current address prooftype.');
      $(event.target).parent().parent().siblings().find('#currentAddrProofType').addClass('error has-content');
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
        var prooftype = "address";
        var ext = fileName.split('.').pop();
        $(event.target).parent().parent().find('.currAddrselWidth').addClass('otherDocSelect');
        $(event.target).parent().parent().find('.currAddrselWidth').removeClass('col-lg-8');
        $(event.target).parent().parent().find('.currAddrselWidth').find('label').css('fontWeight','100');
        $(event.target).parent().siblings('.fileName').css({'display':'block','marginTop':'1px','marginBottom':'0px','fontSize':'13px','fontWeight':'100',});
        $(event.target).parent().siblings('.fileName').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.fileName').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){ 
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);   
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').removeClass('error');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').html('');
            $(event.target).parent().parent().find('.currAddrselWidth').addClass('col-lg-12');
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
          }else{
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
            $(event.target).parent().parent().find('.currAddrselWidth').addClass('col-lg-12');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').addClass('error');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').html('<p>Document size should not exceed file size limit 2MB.</p>');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
          } 
        }else{
          $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
          $(event.target).parent().parent().find('.currAddrselWidth').addClass('col-lg-12');
          $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').addClass('error');
          $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').html('<p>Only jpg, png, pdf format is supported.</p>');
          $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
        }
      }
    }
  }
  removeProofDocs(event){
    event.preventDefault();
    var imgLink = $(event.target).attr('data-value');
    var proofSubtype = $(event.target).attr('data-subtype');
    var index = ($(event.target).attr('data-index')-1);
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
          if(proofSubtype == "editPermanentAddress"){
            $(event.target).parent().parent().parent().find('.perAddrselWidth').find('label').css({'marginTop':'15px','fontSize':'14px','fontWeight':'700'});
          }else{
            $(event.target).parent().parent().parent().find('.currAddrselWidth').find('label').css({'marginTop':'15px','fontSize':'14px','fontWeight':'700'});
          }
        }
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
      var searchData = Location.find({$or:[{'city':RegExpBuildValue},{"country":RegExpBuildValue},{"state":RegExpBuildValue}]}).fetch();
      if(searchData){
        if($(event.target).hasClass('city')){
          var pluckCity = _.pluck(searchData,"city");
          var uniqueCity = _.uniq(pluckCity);
          this.setState({"searchArray":uniqueCity});
        }else if($(event.target).hasClass('country')){
          var pluckCountry = _.pluck(searchData,"country");
          var uniqueCountry = _.uniq(pluckCountry);
          this.setState({"searchArray":uniqueCountry});
        }else if($(event.target).hasClass('state')){
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

  render() {
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 currentAddrContent">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLine1 ? "effect-21 form-control has-content loginInputs required" :"effect-21 form-control loginInputs required"} defaultValue={this.state.tempLine1} id="tempLine1" name="tempLine1" ref="tempLine1"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line1<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLine2 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} defaultValue={this.state.tempLine2} id="tempLine2" name="tempLine2" ref="tempLine2"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line2</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLine3 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} defaultValue={this.state.tempLine3} id="tempLine3" name="tempLine3" ref="tempLine3"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line3</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLandmark ? "effect-21 form-control has-content loginInputs required" :"effect-21 form-control loginInputs required"} defaultValue={this.state.tempLandmark} id="tempLandmark" name="tempLandmark" ref="tempLandmark" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Landmark<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" list="autoTempCurrrentCountry" className={this.state.tempCountry ? "effect-21 form-control has-content loginInputs country" :"effect-21 form-control loginInputs country"} defaultValue={this.state.tempCountry} id="tempCountry" name="tempCountry" ref="tempCountry" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>Country</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
            <datalist className="autocomplete" id="autoTempCurrrentCountry">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <option value={searchDetails} key={searchDetails + '-searchTempCountry'} />                        
                  );
                })
              }
            </datalist>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" list="autoTempCurrentState" className={this.state.tempState ? "effect-21 form-control has-content loginInputs state" :"effect-21 form-control loginInputs state"} defaultValue={this.state.tempState} id="tempState" name="tempState" ref="tempState" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>State</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
            <datalist className="autocomplete" id="autoTempCurrentState">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <option value={searchDetails} key={searchDetails + '-searchTempState'} />                        
                  );
                })
              }
            </datalist>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" list="autoTempCurrentCity" className={this.state.tempCity ? "effect-21 form-control has-content loginInputs city" :"effect-21 form-control loginInputs city"} defaultValue={this.state.tempCity} id="tempCity" name="tempCity" ref="tempCity"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>City</label> 
              <span className="focus-border">
                <i></i>
              </span>
            </div>
            <datalist className="autocomplete" id="autoTempCurrentCity">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <option value={searchDetails} key={searchDetails + '-searchTempState'} />                        
                  );
                })
              }
            </datalist>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempPincode ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} defaultValue={this.state.tempPincode} id="tempPincode" name="tempPincode" ref="tempPincode" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Pincode<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempresidingFrom ? "effect-21 form-control has-content loginInputs required" :"effect-21 form-control loginInputs required"} defaultValue={this.state.tempresidingFrom} id="tempresidingFrom" name="tempresidingFrom" ref="tempresidingFrom" onChange={this.handleChange} onFocus={this.showDatePickerResidingFrom.bind(this)}/>
              <label className="">Residing From<span className="astrikReq">*</span></label>
              <span className="focus-border"><i></i></span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" style={{display: this.state.tempresidingTo == "Present" ? "block" : "none" }}>
            <label className="residingDateSelect">Residing To<span className="astrikReq">*</span></label>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 residingToRadio" >
              <label className="radio"><input defaultChecked="checked" type="radio" name="tempResidingToDate" value="stillLivingHere" ref="" />Still living here</label>
              <label className="radio"><input type="radio" name="tempResidingToDate" value="selectToDate"  ref="" onClick={this.tempResidingToChange.bind(this)} data-index={this.props.indexVal}/>Select to date</label>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" style={{display: this.state.tempresidingTo == "Present" ? "none" : "block" }} id={this.state.tempresidingTo != '' ? this.state.tempresidingTo != 'Present' ? "tempResidingToOfAddress" + this.props.indexVal: "tempResidingToDate" + this.props.indexVal: "tempResidingToDate" + this.props.indexVal}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempresidingTo != 'Present' ? "effect-21 form-control has-content loginInputs required" :"effect-21 form-control loginInputs required"} defaultValue={this.state.tempresidingTo != 'Present' ? this.state.tempresidingTo : ''} id="tempresidingTo" name="tempresidingTo" ref="tempresidingTo" onChange={this.handleChange} onFocus={this.showDatePicker.bind(this)}/>
              <label className="">Residing To<span className="astrikReq">*</span></label>
              <span className="focus-border"><i></i></span>
            </div>
            <span className="tempResidingToChangeLabel pull-right fa fa-angle-double-left fa-lg" onClick={this.tempResidingToChange.bind(this)} data-index={this.props.indexVal}></span>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <select className={this.state.currentProofType ? "effect-21 form-control has-content loginInputs proofType" :"effect-21 form-control loginInputs proofType"} defaultValue={this.state.currentProofType ? this.state.currentProofType : "0"} id="currentAddrProofType" name="currentProofType" ref="currentProofType" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}>
                  <option value="0" disabled="disabled">-- Select --</option>
                  <option value="Aadhar Card">Aadhar Card</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Index To">Index To</option>
                  <option value="Passport">Passport</option>
                  <option value="Voting Card">Voting Card</option>
                  <option value="Ration Card">Ration Card</option>
                  <option value="Electric Bill">Electric Bill</option>
                </select>
                <label className="">Current Address Proof Type</label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div>
          {
            !this.props.proofCurrAddrData.imageLink && !this.props.currentAddressValues ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 currAddrselWidth formGroup">
                  <div className="input-effect input-group">
                    <label className="">Proof of Current Address</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup fileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 formGroup nopadLeft perAddrBrowseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="currentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                  <div id="currAddrErrorProof"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            this.props.currentAddressValues ?
              this.props.currentAddressValues.proofOfDocument ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                {
                  this.props.currentAddressValues.fileExt == 'jpg' || this.props.currentAddressValues.fileExt == 'png' || this.props.currentAddressValues.fileExt == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                      <a href=""><img className="img" data-index={this.props.indexVal} onClick={this.currAddrModal.bind(this)} src={this.props.currentAddressValues.proofOfDocument} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.currentAddressValues.proofOfDocument} data-ext={this.props.currentAddressValues.fileExt} data-index={this.props.currentAddressValues.currentAddressId} data-name={this.props.currentAddressValues.fileName} data-subtype="editCurrentAddress"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                    <a href="" onClick={this.currAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.currentAddressValues.fileName}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.currentAddressValues.proofOfDocument} data-ext={this.props.currentAddressValues.fileExt} data-index={this.props.currentAddressValues.currentAddressId} data-name={this.props.currentAddressValues.fileName} data-subtype="editCurrentAddress"></i>
                  </div>
                }   
              </div> 
            :
            this.props.proofData.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                { 
                  this.props.proofData.imageLink ?
                    this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                        <a href=""><img className="img" data-index={this.props.indexVal}  onClick={this.currAddrModal.bind(this)} src={this.props.proofData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="editCurrentAddress"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                      <a href="" onClick={this.currAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="editCurrentAddress"></i>
                    </div>
                  :
                  ""
                }
              </div>
            : 
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 currAddrselWidth formGroup">
                <div className="input-effect input-group">
                  <label className="">Proof of Current Address</label>&nbsp;&nbsp;
                </div>
              </div>
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup fileName" style={{display: "none"}}>
                <div className="input-effect input-group">
                  <label></label>
                </div>
              </div>
              <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 formGroup nopadLeft perAddrBrowseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="editCurrentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                <div id="currAddrErrorProof"></div>
                {this.getUploadImagePercentage()}
              </div>
            </div>
            :
            this.props.proofCurrAddrData.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                { 
                  this.props.proofCurrAddrData.imageLink ?
                    this.props.proofCurrAddrData.ext == 'jpg' || this.props.proofCurrAddrData.ext == 'png' || this.props.proofCurrAddrData.ext == 'jpeg' ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                        <a href=""><img className="img" data-index={this.props.indexVal}  onClick={this.currAddrModal.bind(this)} src={this.props.proofCurrAddrData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofCurrAddrData._id} data-subtype="editCurrentAddress"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                      <a href="" onClick={this.currAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofCurrAddrData.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofCurrAddrData._id} data-subtype="editCurrentAddress"></i>
                    </div>
                  :
                  ""
                }
              </div>
            : 
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 currAddrselWidth formGroup">
                <div className="input-effect input-group">
                  <label className="">Proof of Current Address</label>&nbsp;&nbsp;
                </div>
              </div>
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup fileName" style={{display: "none"}}>
                <div className="input-effect input-group">
                  <label></label>
                </div>
              </div>
              <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 formGroup nopadLeft perAddrBrowseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="currentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                <div id="currAddrErrorProof"></div>
                {this.getUploadImagePercentage()}
              </div>
            </div>
          } 
          </div>
          <div className="modal fade" id="currAddrProofModals" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <button type="button" className="close" onClick={this.closeProofModal.bind(this)}>&times;</button>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        { this.props.currentAddressValues  ?
                          this.props.currentAddressValues.proofOfDocument ?
                           this.props.currentAddressValues.fileExt == 'jpg' || this.props.currentAddressValues.fileExt == 'png' || this.props.currentAddressValues.fileExt == 'jpeg' ?
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <img src={this.props.currentAddressValues.proofOfDocument} style={{width: "100"+"%"}} />
                              </div>
                            :
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <iframe src={this.props.currentAddressValues.proofOfDocument} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                            </div>
                          :
                          this.props.proofData.imageLink ?
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
                        :
                        this.props.proofCurrAddrData ?
                          this.props.proofCurrAddrData.ext == 'jpg' || this.props.proofCurrAddrData.ext == 'png' || this.props.proofCurrAddrData.ext == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <img src={this.props.proofCurrAddrData.imageLink} style={{width: "100"+"%"}} />
                            </div>
                          :
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <iframe src={this.props.proofCurrAddrData.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                          </div>
                        :  
                        ""
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div> 
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <button type="submit" className="btn btn-info pull-right" data-index={this.props.indexVal} id={this.state.currentAddressId} onClick={this.props.currentAddressValues ? this.editTemporaryAddress.bind(this) :this.submitTemporaryAddress.bind(this)}>Save</button>
        </div>
      </div>
    );
  }
}
CurrentAddressContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
    const postHandle1 = Meteor.subscribe('allLocation');
    var _id = Meteor.userId();
    const proofCurrAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
    const proofData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'editCurrentAddress'})|| {};
    const loading       = !postHandle.ready();
    return {
      loading,
      proofCurrAddrData,
      proofData,
    };
})(CurrentAddress);

export default CurrentAddressContainer;