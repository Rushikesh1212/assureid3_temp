import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { Location } from "/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js";
import { TempProofDocs } from "/imports/AssureID/userPortal/api/userProfile.js";
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";

class PermanentAddress extends TrackerReact(Component){
  constructor(props){
    super(props);
     if(this.props.permanentAddressValues){
      this.state ={ 
        "searchArray"        : [],
        'permanentAddressId' : this.props.permanentAddressValues.permanentAddressId,
        'line1'              : this.props.permanentAddressValues.line1,
        'line2'              : this.props.permanentAddressValues.line2,
        'line3'              : this.props.permanentAddressValues.line3,
        'landmark'           : this.props.permanentAddressValues.landmark, 
        'city'               : this.props.permanentAddressValues.city,
        'state'              : this.props.permanentAddressValues.state, 
        'country'            : this.props.permanentAddressValues.country,
        'pincode'            : this.props.permanentAddressValues.pincode,
        'residingFrom'       : this.props.permanentAddressValues.residingFrom,  
        'residingTo'         : this.props.permanentAddressValues.residingTo,
        'permanentProofType' : this.props.permanentAddressValues.proofType,
        'editStatus'         : this.props.permanentAddressValues.editStatus,
        "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
    this.state ={
        "searchArray"        : [],
        'permanentAddressId' : '',
        'line1'              : '',
        'line2'              : '',
        'line3'              : '',
        'landmark'           : '', 
        'city'               : '',
        'state'              : '', 
        'country'            : '',
        'pincode'            : '',
        'residingFrom'       : '',  
        'residingTo'         : 'Present',
        'permanentProofType' : '',
        'editStatus'         : '',
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
  residingToChange(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    // console.log("index",this.state.residingTo);
   
    if($(event.target).hasClass('residingToChangeLabel')){
      // console.log("in if");
      // console.log("#residingToOfAddress"+index);
      $('#residingToOfAddress'+index).css('display','none'); 
      $('#residingToDate'+index).css('display','none');
      $('#residingToOfAddress'+index).find('input#residingTo').val('');
      $('#residingToOfAddress'+index).find('input#residingTo').removeClass('has-content');
      $('#residingToDate'+index).find('input#residingTo').val('');
      $('#residingToDate'+index).find('input#residingTo').removeClass('has-content');
      $('input[name=residingToDate]').parent().parent().parent().css('display','block'); 
    }else{
      // console.log("in else");
      $('#residingToOfAddress'+index).css('display','block');
      $('#residingToDate'+index).css('display','block');
      $('input[name=residingToDate]').parent().parent().parent().css('display','none');       
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
  
    $("#addPermanentAddressForm").validate({
      rules: {
        city: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        state: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        country: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        pincode: {
          required:true,
          regxA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
    });
    $("#permanentAddressForm-"+this.props.indexVal).validate({
      rules: {
        city: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        state: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        country: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        pincode: {
          required:true,
          regxA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
    });
    $("#permanentAddrForm-"+this.props.indexVal).validate({
      rules: {
        city: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        state: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        country: {
          regxA1: /^[a-zA-Z ]+$|^$/,
        },
        pincode: {
          required:true,
          regxA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
    });
  }
  editPermanantAddress(event){
    event.preventDefault(); 
    var id                = this.props.id;
    var permAddressId     = $(event.currentTarget).attr('id');  
    var index             = $(event.currentTarget).attr('data-index');
    var editstatus        = this.state.editStatus;
    var userId            = Meteor.userId();
    if(FlowRouter.current().path == '/profileForms/menu1'){
      var addrForm = '#permanentAddrForm-';
    }else{
      var addrForm = '#permanentAddressForm-';
    }
    if($(addrForm+index).valid()){
      if(this.props.permanentAddressValues){
        if(this.props.permanentAddressValues.proofOfDocument){
          var imgLink  = this.props.permanentAddressValues.proofOfDocument;
          var fileName = this.props.permanentAddressValues.fileName;
          var fileExt  = this.props.permanentAddressValues.fileExt;
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
      }else if(this.props.proofPerAddrData.imageLink){
        var imgLink = this.props.proofPerAddrData.imageLink;
        var fileName = this.props.proofPerAddrData.name;
        var fileExt = this.props.proofPerAddrData.ext;
        var imgId = this.props.proofPerAddrData._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
      
      if(this.refs.residingTo.value){
        var residingTo = this.refs.residingTo.value;
      }else{
        var residingTo = "Present";
      }
      
      var selectedAddress = {
        "permanentAddressId": parseInt(permAddressId),
        "line1"             : this.refs.line1.value,
        "line2"             : this.refs.line2.value,
        "line3"             : this.refs.line3.value,
        "landmark"          : this.refs.landmark.value,
        "city"              : this.refs.city.value, 
        "state"             : this.refs.state.value,
        "country"           : this.refs.country.value,
        "pincode"           : this.refs.pincode.value,
        "residingFrom"      : this.refs.residingFrom.value,
        "residingTo"        : residingTo,
        "proofType"         : this.refs.permanentProofType.value,
        "createdAt"         : new Date(),
        "proofOfDocument"   : imgLink,
        "fileName"          : fileName,
        "fileExt"           : fileExt,
        "verifiedStatus"    : "Not Verified",
        "editStatus"        : "Open",
      }
      if (selectedAddress.residingTo != "Present") {
        if (Date.parse(selectedAddress.residingFrom) > Date.parse(selectedAddress.residingTo)) {
          swal("Residing From Date","is greater than Residing To Date","error");
        }else if (Date.parse(selectedAddress.residingFrom) == Date.parse(selectedAddress.residingTo)) {
          swal("Residing From Date","as same as Residing To Date","error");
        }else{
          Meteor.call('editPermanantAddress',id,permAddressId,selectedAddress,function (error,result) {
           if(error){
              console.log(error.reason);
            }else{
              $('#permAddressModal-'+index).modal('hide');
              $('#permAddrModal-'+index).modal('hide');
              Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
                if (error) {
                 console.log(error.reason);
                }else{  
                }
              }); 
              if (editstatus == "Reopen") {
                // console.log("in reopen");
                Meteor.call('updateTicketAfterReopen',userId,"permanentAddress",permAddressId,selectedAddress); 
              } 
            }
          });

          if($('.effect-21.proofType').hasClass('error')){
            $('.proofType.error').removeClass('error has-content');
          } 
        }
      }else{
        Meteor.call('editPermanantAddress',id,permAddressId,selectedAddress,function (error,result) {
         if(error){
            console.log(error.reason);
          }else{
            $('#permAddressModal-'+index).modal('hide');
            $('#permAddrModal-'+index).modal('hide');
            Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
              if (error) {
               console.log(error.reason);
              }else{  
              }
            }); 
            if (editstatus == "Reopen") {
              // console.log("in reopen");
              Meteor.call('updateTicketAfterReopen',userId,"permanentAddress",permAddressId,selectedAddress); 
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
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#perAddrProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#perAddrProofModals').css('display','none');
  }
  submitPermanantAddress(event){
    event.preventDefault();
    if(this.props.proofPerAddrData){
      if(this.props.proofPerAddrData.proofSubtype == 'permanentAddress'){
        var imgLink = this.props.proofPerAddrData.imageLink;
        var fileName = this.props.proofPerAddrData.name;
        var fileExt = this.props.proofPerAddrData.ext;
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

    if(this.refs.residingTo.value){
      var residingToDate = this.refs.residingTo.value;
    }else{
      var residingToDate = "Present";
    } 
    if($('#addPermanentAddressForm').valid()){ 
      var id   = Meteor.userId();
      var addressObj = UserProfile.findOne({"userId": id}, {sort: {'permanentAddress.permanentAddressId': -1}});
      if(addressObj){
        if(addressObj.permanentAddress) {
          if(addressObj.permanentAddress.length > 0) {
            var lastelem           = _.last(addressObj.permanentAddress);
            var permanentAddressId =  parseInt(lastelem.permanentAddressId) + 1;
          }else{
            var permanentAddressId =  1; 
          }
        }
        else{
          var permanentAddressId =  1;
        }
      }
      var permanentAddress = { 
        "permanentAddressId": permanentAddressId,
        "line1"             : this.refs.line1.value,
        "line2"             : this.refs.line2.value,
        "line3"             : this.refs.line3.value,
        "landmark"          : this.refs.landmark.value,
        "city"              : this.refs.city.value,
        "state"             : this.refs.state.value,
        "country"           : this.refs.country.value,
        "pincode"           : this.refs.pincode.value,
        "residingFrom"      : this.refs.residingFrom.value,
        "residingTo"        : residingToDate,
        "proofType"         : this.refs.permanentProofType.value,
        "createdAt"         : new Date(),
        "proofOfDocument"   : imgLink,
        "fileName"          : fileName,
        "fileExt"           : fileExt,
        "verifiedStatus"    : "Not Verified",
        "editStatus"        : "Open"
      }
      if (permanentAddress.residingTo != "Present") {
        if (Date.parse(permanentAddress.residingFrom) > Date.parse(permanentAddress.residingTo)) {
          swal("Residing From Date","is greater than Residing To Date","error");
        }else if (Date.parse(permanentAddress.residingFrom) == Date.parse(permanentAddress.residingTo)) {
          swal("Residing From Date","as same as Residing To Date","error");
        }else{
          Meteor.call('insertPermanantAddress',id,permanentAddress,function (error,result) {
           if(error){
              console.log(error.reason);
            }else{
              $("#addPermanentAddressForm").find("input.effect-21").val("");  
              $("#addPermanentAddressForm").find("select.effect-21").val("-- Select --");
              $("#addPermanentAddressForm").find(".effect-21").removeClass("has-content");
              $("#addPermanentAddressForm").find("input#country").val("India");  
              $("#addPermanentAddressForm").find("input#country").addClass('has-content');  
              $('#permaddAddressModal').modal('hide');
            }
          });
          var imgId = this.props.proofPerAddrData._id;
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
       Meteor.call('insertPermanantAddress',id,permanentAddress,function (error,result) {
         if(error){
            console.log(error.reason);
          }else{
            $("#addPermanentAddressForm").find("input.effect-21").val("");  
            $("#addPermanentAddressForm").find("select.effect-21").val("-- Select --");
            $("#addPermanentAddressForm").find(".effect-21").removeClass("has-content");
            $("#addPermanentAddressForm").find("input#country").val("India");  
            $("#addPermanentAddressForm").find("input#country").addClass('has-content');  
            $('#permaddAddressModal').modal('hide');
          }
        });
        var imgId = this.props.proofPerAddrData._id;
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
    if(this.refs.permanentProofType.value != '-- Select --'){
      $(event.target).siblings('.inputFiles').click();
    }else{
      swal('Please select the permanent address prooftype.');
      $(event.target).parent().parent().siblings().find('#permanentAddrProofType').addClass('error has-content');
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
        $(event.target).parent().parent().find('.perAddrselWidth').addClass('otherDocSelect');
        $(event.target).parent().parent().find('.perAddrselWidth').removeClass('col-lg-8');
        $(event.target).parent().parent().find('.perAddrselWidth').find('label').css('fontWeight','100');
        $(event.target).parent().siblings('.fileName').css({'display':'block','marginTop':'1px','marginBottom':'0px'});
        $(event.target).parent().siblings('.fileName').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.fileName').find('label').html(file.name);
        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){
          if(fileSize < size){ 
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);   
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').removeClass('error');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('');
            $(event.target).parent().parent().find('.perAddrselWidth').addClass('col-lg-12');
            $(event.target).parent().parent().find('.perAddrselWidth').addClass('zeroMarginTop');
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
          }else{
            $(event.target).parent().parent().find('.perAddrselWidth').addClass('col-lg-12');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').addClass('error');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('<p>Document size should not exceed file size limit 2MB.</p>');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'}); 
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
            $(event.target).parent().siblings('.fileName').find('label').html("");
          } 
        }else{
          $(event.target).parent().parent().find('.perAddrselWidth').addClass('col-lg-12');
          $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').addClass('error');
          $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('<p>Only jpg, png format is supported.</p>');
          $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
          $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
          $(event.target).parent().siblings('.fileName').find('label').html("");
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
  perAddrModal(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    $('#permAddressModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#permAddrModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#permaddAddressModal').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#perAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#perAddrProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#perAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#perAddrProofModals').css('display','block');
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
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.line1 ? "effect-21 form-control has-content loginInputs required" :"effect-21 form-control loginInputs required"} defaultValue={this.state.line1} id="line1" name="line1" ref="line1" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line1<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.line2 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} defaultValue={this.state.line2}  id="line2" name="line2" ref="line2" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line2</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.line3 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} defaultValue={this.state.line3} id="line3" name="line3" ref="line3" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line3</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.landmark ? "effect-21 form-control has-content loginInputs required" :"effect-21 form-control loginInputs required"} defaultValue={this.state.landmark} id="landmark" name="landmark" ref="landmark" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Landmark<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" list="autoCountry" className="effect-21 form-control has-content loginInputs country" id="country" name="country" ref="country" defaultValue="India" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>Country</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
            <datalist className="autocomplete" id="autoCountry">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <option value={searchDetails} key={searchDetails + '-searchCountry'} />                        
                  );
                })
              }
            </datalist>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" list="autoState" className={this.state.state ? "effect-21 form-control has-content loginInputs state" :"effect-21 form-control loginInputs state"} defaultValue={this.state.state} id="state" name="state" ref="state" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>State</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
            <datalist className="autocomplete" id="autoState">
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
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="on" list="autoCity" className={this.state.city ? "effect-21 form-control has-content loginInputs city" :"effect-21 form-control loginInputs city"} defaultValue={this.state.city} id="city" name="city" ref="city" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
              <label>City</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
            <datalist className="autocomplete" id="autoCity">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <option value={searchDetails} key={searchDetails + '-searchCity'} />                        
                  );
                })
              }
            </datalist>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" autoComplete="off" className={this.state.pincode ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} defaultValue={this.state.pincode} id="pincode" name="pincode" ref="pincode" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Pincode<span className="astrikReq">*</span></label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div> 
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="text" className={this.state.residingFrom ? "effect-21 form-control has-content loginInputs required" : "effect-21 form-control loginInputs required"} defaultValue={this.state.residingFrom} id="residingFrom" name="residingFrom" ref="residingFrom" onFocus={this.showDatePickerResidingFrom.bind(this)}/>
              <label className="">Residing From<span className="astrikReq">*</span></label>
              <span className="focus-border"><i></i></span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12" style={{display: this.state.residingTo == "Present" ? "block" : "none"}}>
            <label className="residingDateSelect">Residing To<span className="astrikReq">*</span></label>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 residingToRadio">
              <label className="radio"><input defaultChecked="checked" type="radio" name="residingToDate" value="stillLivingHere" ref="" />Still living here</label>
              <label className="radio"><input type="radio" name="residingToDate" value="selectToDate"  ref="" onClick={this.residingToChange.bind(this)} data-index={this.props.indexVal}/>Select to date</label>
            </div>
          </div>
          <div style={{display: this.state.residingTo == "Present" ? "none" : "block"}} className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12" id={this.state.residingTo != '' ? this.state.residingTo != 'Present' ? "residingToOfAddress"+this.props.indexVal : "residingToDate"+this.props.indexVal: "residingToDate"+this.props.indexVal}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="text" className={this.state.residingTo != 'Present' ? "effect-21 form-control has-content loginInputs required" : "effect-21 form-control loginInputs required"} id="residingTo" name="residingTo" ref="residingTo" onChange={this.handleChange} defaultValue={this.state.residingTo != 'Present' ? this.state.residingTo : ""} onFocus={this.showDatePicker.bind(this)}/>
              <label className="">Residing To<span className="astrikReq">*</span></label>
              <span className="focus-border"><i></i></span>
            </div>
            <span className="residingToChangeLabel pull-right fa fa-angle-double-left fa-lg" onClick={this.residingToChange.bind(this)} data-index={this.props.indexVal}></span>
          </div>          
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <select className={this.state.permanentProofType ? "effect-21 form-control has-content loginInputs proofType" :"effect-21 form-control loginInputs proofType"} defaultValue={this.state.permanentProofType ? this.state.permanentProofType : '-- Select --'} id="permanentAddrProofType" name="permanentProofType" ref="permanentProofType" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}>
                  <option disabled="disabled">-- Select --</option>
                  <option>Aadhar Card</option>
                  <option>Driving License</option>
                  <option>Index To</option>
                  <option>Passport</option>
                  <option>Voting Card</option>
                  <option>Ration Card</option>
                  <option>Electric Bill</option>
                </select>
                <label className="">Permanent Address Proof Type</label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div> 

          {
            !this.props.proofPerAddrData.imageLink && !this.props.permanentAddressValues ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 perAddrselWidth">
                  <div className="input-effect input-group">
                    <label className="">Proof of Permanent Address</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft perAddrBrowseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="permanentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                  <div id="perAddrErrorProof"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            this.props.permanentAddressValues ?
              this.props.permanentAddressValues.proofOfDocument ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                {
                  this.props.permanentAddressValues.fileExt == 'jpg' || this.props.permanentAddressValues.fileExt == 'png' || this.props.permanentAddressValues.fileExt == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                      <a href=""><img src={this.props.permanentAddressValues.proofOfDocument} className="img" data-index={this.props.indexVal} onClick={this.perAddrModal.bind(this)}  style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.permanentAddressValues.proofOfDocument} data-ext={this.props.permanentAddressValues.fileExt} data-index={this.props.permanentAddressValues.permanentAddressId} data-name={this.props.permanentAddressValues.fileName} data-subtype="editPermanentAddress"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                    <a href="" onClick={this.perAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.permanentAddressValues.fileName}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.permanentAddressValues.proofOfDocument} data-ext={this.props.permanentAddressValues.fileExt} data-index={this.props.permanentAddressValues.permanentAddressId} data-name={this.props.permanentAddressValues.fileName} data-subtype="editPermanentAddress"></i>
                  </div>
                }   
              </div> 
              :
              this.props.proofObj.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
                {
                  this.props.proofObj.ext == 'jpg' || this.props.proofObj.ext == 'png' || this.props.proofObj.ext == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" data-index={this.props.indexValue} onClick={this.perAddrModal.bind(this)} src={this.props.proofObj.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editPermanentAddress"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" className="pdfFileNm" onClick={this.perAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editPermanentAddress"></i>
                  </div>
                }   
              </div> 
            : 
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-12 perAddrselWidth">
                  <div className="input-effect input-group">
                    <label className="">Proof of Permanent Address</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-12 fileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-12 nopadLeft perAddrBrowseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="editPermanentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                  <div id="perAddrErrorProof"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            this.props.proofPerAddrData.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
                { 
                  this.props.proofPerAddrData.imageLink ?
                    this.props.proofPerAddrData.ext == 'jpg' || this.props.proofPerAddrData.ext == 'png' || this.props.proofPerAddrData.ext == 'jpeg' ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                        <a href=""><img className="img" onClick={this.perAddrModal.bind(this)} src={this.props.proofPerAddrData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofPerAddrData._id} data-subtype="permanentAddress"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                      <a href="" className="pdfFileNm" onClick={this.perAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofPerAddrData.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofPerAddrData._id} data-subtype="permanentAddress"></i>
                    </div>
                  :
                  ""
                }
              </div>
            : 
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 perAddrselWidth">
                <div className="input-effect input-group">
                  <label className="">Proof of Permanent Address</label>&nbsp;&nbsp;
                </div>
              </div>
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileName" style={{display: "none"}}>
                <div className="input-effect input-group">
                  <label></label>
                </div>
              </div>
              <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft perAddrBrowseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="permanentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                <div id="perAddrErrorProof"></div>
                {this.getUploadImagePercentage()}
              </div>
            </div>
          }
          </div>
          <div className="modal fade" id="perAddrProofModals" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        { this.props.permanentAddressValues ?
                          this.props.permanentAddressValues.proofOfDocument?
                             this.props.permanentAddressValues.fileExt == 'jpg' || this.props.permanentAddressValues.fileExt == 'png' || this.props.permanentAddressValues.fileExt == 'jpeg' ?
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <img src={this.props.permanentAddressValues.proofOfDocument} style={{width: "100"+"%"}} />
                              </div>
                            :
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <iframe src={this.props.permanentAddressValues.proofOfDocument} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
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
                        this.props.proofPerAddrData ?
                          this.props.proofPerAddrData.ext == 'jpg' || this.props.proofPerAddrData.ext == 'png' || this.props.proofPerAddrData.ext == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <img src={this.props.proofPerAddrData.imageLink} style={{width: "100"+"%"}} />
                            </div>
                          :
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <iframe src={this.props.proofPerAddrData.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
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
          <button type="submit" className="btn btn-info  pull-right" data-index={this.props.indexVal} id={this.state.permanentAddressId} onClick={this.props.permanentAddressValues ? this.editPermanantAddress.bind(this) : this.submitPermanantAddress.bind(this)} >Save</button>
        </div> 
      </div>
    );
  }
}
PermanentAddressContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
    const postHandle1 = Meteor.subscribe('allLocation');
    var _id = Meteor.userId();
    const proofPerAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
    const proofObj  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'editPermanentAddress'})|| {};
    const loading       = !postHandle.ready();
    return {
      loading,
      proofPerAddrData,
      proofObj,
    };
})(PermanentAddress);

export default PermanentAddressContainer;