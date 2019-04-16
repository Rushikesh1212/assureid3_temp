import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
class StatutoryFormChild extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.identityValues){
      this.state ={
        "adharCardNo"   :  this.props.identityValues.adharCardNo, 
        "panCardNo"     :  this.props.identityValues.panCardNo,
        "drivingCardNo" :  this.props.identityValues.drivingCardNo,
        "votingCardNo"  :  this.props.identityValues.votingCardNo, 
        "rationCardNo"  :  this.props.identityValues.rationCardNo,  
        "passportNo"    :  this.props.identityValues.passportNo,
        "cardNameNew"   :  this.props.cardName,
        "cardValueNew"  :  this.props.cardValue,
        "subscription"  : {
        }
      };  
    }else{
      this.state ={
        "adharCardNo"   :  '', 
        "panCardNo"     :  '',
        "drivingCardNo" :  '',
        "votingCardNo"  :  '', 
        "rationCardNo"  :  '',  
        "passportNo"    :  '', 
        "cardNameNew"   :  '',
        "cardValueNew"  :  '',
        "subscription"  : {
        }
      };
    }
   this.handleChange = this.handleChange.bind(this);
   this.uploadProofDocs = this.uploadProofDocs.bind(this);
   
   
  }

  componentWillReceiveProps(nextProps){
    this.handleChange = this.handleChange.bind(this);
    this.uploadProofDocs = this.uploadProofDocs.bind(this);
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
  inputFileChange(event){
    event.preventDefault();
    var type = $(event.target).siblings().attr('data-subtype');
    if(type == 'aadhar1'){
      if(this.refs.adharCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#adharCardNo').addClass('error has-content');
        swal('Please specify the aadhar card number.');
      }
    }else if(type == 'aadhar2'){
      if(this.refs.adharCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#adharCardNo').addClass('error has-content');
        swal('Please specify the aadhar card number.');
      }
    }else if(type == 'pan1'){
      if(this.refs.panCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#panCardNo').addClass('error has-content');
        swal('Please specify the pan card number.');
      }
    }else if(type == 'pan2'){
      if(this.refs.panCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#panCardNo').addClass('error has-content');
        swal('Please specify the pan card number.');
      }
    }else if(type == 'driving1'){
      if(this.refs.drivingCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#drivingCardNo').addClass('error has-content');
        swal('Please specify the driving license number.');
      }
    }else if(type == 'driving2'){
      if(this.refs.drivingCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#drivingCardNo').addClass('error has-content');
        swal('Please specify the driving license number.');
      }
    }else if(type == 'voting1'){
      if(this.refs.votingCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#votingCardNo').addClass('error has-content');
        swal('Please specify the voting card number.');
      }
    }else if(type == 'voting2'){
      if(this.refs.votingCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#votingCardNo').addClass('error has-content');
        swal('Please specify the voting card number.');
      }
    }else if(type == 'ration1'){
      if(this.refs.rationCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#rationCardNo').addClass('error has-content');
        swal('Please specify the ration card number.');
      }
    }else if(type == 'ration2'){
      if(this.refs.rationCardNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#rationCardNo').addClass('error has-content');
        swal('Please specify the ration card number.');
      }
    }else if(type == 'passport1'){
      if(this.refs.passportNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#passportNo').addClass('error has-content');
        swal('Please specify the passport number.');
      }
    }else if(type == 'passport2'){
      if(this.refs.passportNo.value){
        $(event.target).siblings('.inputFiles').click();
      }else{
        $('#passportNo').addClass('error has-content');
        swal('Please specify the passport number.');
      }
    }
  }
  handleStatutorySubmit(event){
    event.preventDefault();
    if($('#identityForm').valid()){
      event.preventDefault();
      $('#identityForm').find('.FileDiv').css('display','none'); 
      $('#identityForm').find('.identityProofPro').css('display','none');

      if(this.state.cardNameNew == "AadharForms"){
        var adharCardNo  = this.refs.adharCardNo.value;      
      }
      if(this.state.cardNameNew == "PanCardForm"){
        var panCardNo   = this.refs.panCardNo.value;
        
      }
      if(this.state.cardNameNew == "DrivingLicenseForm"){
        var drivingCardNo = this.refs.drivingCardNo.value;        
      }
      if(this.state.cardNameNew == "VotingForm"){
        var votingCardNo = this.refs.votingCardNo.value;       
      }
      if(this.state.cardNameNew == "RationCardForm"){
      var rationCardNo = this.refs.rationCardNo.value;
            
      }
      if(this.state.cardNameNew == "PassportForm"){
      var passportNo = this.refs.passportNo.value;
      }
     
      var id = Meteor.userId();
      // console.log("adharCardNo :",adharCardNo);
      // if(this.refs.adharCardNo.value || this.refs.panCardNo.value || this.refs.drivingCardNo.value || this.refs.votingCardNo.value || this.refs.rationCardNo.value || this.refs.passportNo.value){
        if(adharCardNo || panCardNo || drivingCardNo || votingCardNo || rationCardNo || passportNo){
        Meteor.call('insertStatutory',id,adharCardNo,panCardNo,drivingCardNo,votingCardNo,rationCardNo,passportNo,function (error,result) {
          if (error) {
            
          }else{
            // swal("Done","Statutory Information updated successfully!","success");   

          }
        });
        if($('.effect-21.proofType').hasClass('error')){
          $('.proofType.error').removeClass('error has-content');
        }
         var currentLocation = FlowRouter.current();
         var url             = currentLocation.path;
        if(url == "/profileForms/menu4"){
          FlowRouter.go('/profileForms/menu1');
          $('html, body').animate({
            'scrollTop' : $(".profileBody").position().top
          });
          $('#menu4').removeClass('in active');
          $('.menu4').removeClass('active');
          $('#menu1').addClass('in active');
          $('.menu1').addClass('active');
        }else{
           $(".modal").modal("hide");
        }
      }
    }else{
      $(event.target).parent().find('.effect-21.error').addClass('has-content');
      $(event.target).parent().find('.effect-21.error:first').focus();
    }
    $(".modal").modal("hide");
  }
  componentDidMount(){ 
    $.validator.addMethod("regxS1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid aadhar number.");

    $.validator.addMethod("regxS2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid pan card number.");

    $.validator.addMethod("regxS3", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid driving license number.");

    // $.validator.addMethod("regxS4", function(value, element, regexpr) {          
    //   return regexpr.test(value);
    // }, "Please enter a valid voting card number.");

    // $.validator.addMethod("regxS5", function(value, element, regexpr) {          
    //   return regexpr.test(value);
    // }, "Please enter a valid ration card number.");

    $.validator.addMethod("regxS6", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid passport number.");

    jQuery.validator.setDefaults({
      // debug: true,
      success: "valid"
    });
  
    $("#identityForm").validate({
      rules: {
        adharCardNo: {
          regxS1: /^\d{4}\s\d{4}\s\d{4}$|^$/,
        },
        panCardNo: {
          regxS2: /[A-Za-z]{5}\d{4}[A-Za-z]{1}|^$/,
        },
        // drivingCardNo: {
        //   regxS3: /([a-z]{2}-\d{2}[ ,][a-z0-9]{1,2}[a-z]-\d{4})|([a-z]{2} \d{2}[ ,][a-z0-9]{1,2}[a-z] \d{4})/,
        // },
        // votingCardNo: {
        //   regxS4: /^[1-9][0-9]{5}$/,
        // },
        // rationCardNo: {
        //   regxS5: /^[A-za-z']+( [A-Za-z']+)*$/,
        // },
        passportNo: {
          regxS6: /^(?!^0+$)[a-zA-Z0-9]{3,20}$|^$/,
        }
      }
    });
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
        var prooftype = 'identity';
        var ext = fileName.split('.').pop();
        $(event.target).parent().siblings('.FileDiv').css('display','block');
        $(event.target).parent().siblings('.FileDiv').find('label').html(file.name);
              
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').removeClass('error');
            $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').html('');
            $(event.target).parent().siblings('.identityProofPro').css('display','block');
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);            
            event.target.value = null;
          }else{
            $(event.target).parent().siblings('.identityProofPro').css('display','block');
            $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').addClass('error');
            $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').html('<p>Document size should not exceed file size limit 2MB.</p>');
            $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').css({'color':'#e40b0b','fontSize':'13px'});
          } 
        }else{
          $(event.target).parent().siblings('.identityProofPro').css('display','block');
          $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').addClass('error');
          $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').html('<p>Only jpg, png, pdf format is supported.</p>');
          $(event.target).parent().siblings('.identityProofPro').find('#identyErrorList').css({'color':'#e40b0b','fontSize':'13px'});
        }
      }
    }
  }
  removeProofDocs(event){
    event.preventDefault();
    $('#identityForm').find('.FileDiv').css('display','none'); 
    $('#identityForm').find('.identityProofPro').css('display','none');   
    var imgLink = $(event.target).attr('data-value');
    var subtype = $(event.target).attr('data-subtype');
    var imageName = $(event.target).attr('data-name');
    var imageExt = $(event.target).attr('data-ext');
    Meteor.call("removeIdentityProofDocs",imgLink,subtype,imageName,imageExt,(error, result)=>{
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
        if(parseInt(percentVal)==100){
          setTimeout(()=>{ 
              Session.set("uploadProofDocProgressPercent",0); 
          }, 3000);     
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
  identityModal(event){
    event.preventDefault();
    $("div#proofDataModal > iframe").remove();
    $("div#proofDataModal > img").remove();
    
    $('#identityForm').find('.FileDiv').css('display','none'); 
    $('#identityForm').find('.identityProofPro').css('display','none');   
    var imgLink = $(event.target).attr('data-value');
    var imgExt = $(event.target).attr('data-ext');
    $('#identityProofModal').modal('show');
    
    if(imgExt == 'jpg' || imgExt == 'png' || imgExt == 'jpeg'){
      var img = "<img src="+imgLink+" style='width:100%;'>";
      $('div#proofDataModal').append(img);
    }else{
      var iframe = "<iframe src="+imgLink+" style='width:100%;height:500px;'></iframe>";
      $('div#proofDataModal').append(iframe);
    }
  }
  render(){
    return(
      <form className="basicForm" id="identityForm">
      {
        this.props.cardNameNew == "AadharForms" && this.props.cardValue== true?
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding aadhar">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                  <input type="text" className={ this.state.adharCardNo  ? this.state.adharCardNo != ''? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} ref="adharCardNo" name="adharCardNo" id="adharCardNo" onChange={this.handleChange}  onBlur={this.inputEffect.bind(this)} value={this.state.adharCardNo}/>
                  <label className="">Aadhar Card No.(xxxx xxxx xxxx)</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
            {
              this.props.identityValues ?
                this.props.identityValues.aadhar1 && !this.props.identityValues.aadhar2 ? 
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 backViewInput">
                  <input type="file" className="btn btn-info inputFiles" id="aadhar2" data-subtype="aadhar2" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                :
                this.props.identityValues.aadhar1 && this.props.identityValues.aadhar2 ?
                  ""
                :
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="aadhar1" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
              :
              <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="aadhar1" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
          }
            <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 FileDiv" style={{display: "none"}}>
              <div className="input-effect input-group">
                <label></label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right proofDocsProgress identityProofPro" style={{display: "none"}}>
              <div id="identyErrorList"></div>
              {this.getUploadImagePercentage()}
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding proofLinkDiv">
              { this.props.identityValues ?
                  this.props.identityValues.aadhar1 ?
                    this.props.identityValues.aadhar1ext == 'jpg' || this.props.identityValues.aadhar1ext == 'png' || this.props.identityValues.aadhar1ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.aadhar1} data-ext={this.props.identityValues.aadhar1ext} src={this.props.identityValues.aadhar1} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.aadhar1} data-subtype="aadhar1" data-name={this.props.identityValues.aadhar1name} data-ext={this.props.identityValues.aadhar1ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.aadhar1} data-ext={this.props.identityValues.aadhar1ext}><i className="fa fa-file"></i> {this.props.identityValues.aadhar1name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.aadhar1} data-subtype="aadhar1" data-name={this.props.identityValues.aadhar1name} data-ext={this.props.identityValues.aadhar1ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
              {
                this.props.identityValues ?
                  this.props.identityValues.aadhar2 ?
                    this.props.identityValues.aadhar2ext == 'jpg' || this.props.identityValues.aadhar2ext == 'png' || this.props.identityValues.aadhar2ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.aadhar2} data-ext={this.props.identityValues.aadhar2ext} src={this.props.identityValues.aadhar2} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.aadhar2} data-subtype="aadhar2" data-name={this.props.identityValues.aadhar2name} data-ext={this.props.identityValues.aadhar2ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.aadhar2} data-ext={this.props.identityValues.aadhar2ext}><i className="fa fa-file"></i> {this.props.identityValues.aadhar2name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.aadhar2} data-subtype="aadhar2" data-name={this.props.identityValues.aadhar2name} data-ext={this.props.identityValues.aadhar2ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
            </div>
          </div>
        :
          null
      }
      {
        this.props.cardNameNew == "PanCardForm" && this.props.cardValue == true ?
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding pan">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                  <input type="text" className={ this.state.panCardNo ? this.state.panCardNo != '' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} ref="panCardNo" name="panCardNo" id="panCardNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.panCardNo}/>
                  <label className="">Pan Card No.(xxxxxxxxxx)</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
            {
              this.props.identityValues ?
                this.props.identityValues.pan1 && !this.props.identityValues.pan2 ?  
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 backViewInput">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="pan2" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                :
                this.props.identityValues.pan1 && this.props.identityValues.pan2 ?
                ""
                :
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="pan1" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
              :
              <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="pan1" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
            }
            <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 FileDiv" style={{display: "none"}}>
              <div className="input-effect input-group">
                <label></label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right proofDocsProgress identityProofPro" style={{display: "none"}}>
              <div id="identyErrorList"></div>
              {this.getUploadImagePercentage()}
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding proofLinkDiv">
              { this.props.identityValues ?
                  this.props.identityValues.pan1 ?
                    this.props.identityValues.pan1ext == 'jpg' || this.props.identityValues.pan1ext == 'png' || this.props.identityValues.pan1ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img src={this.props.identityValues.pan1} data-value={this.props.identityValues.pan1} data-ext={this.props.identityValues.pan1ext} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.pan1} data-subtype="pan1" data-name={this.props.identityValues.pan1name} data-ext={this.props.identityValues.pan1ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.pan1} data-ext={this.props.identityValues.pan1ext}><i className="fa fa-file"></i> {this.props.identityValues.pan1name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.pan1} data-subtype="pan1" data-name={this.props.identityValues.pan1name} data-ext={this.props.identityValues.pan1ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
              {
                this.props.identityValues ?
                  this.props.identityValues.pan2 ?
                    this.props.identityValues.pan2ext == 'jpg' || this.props.identityValues.pan2ext == 'png' || this.props.identityValues.pan2ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img src={this.props.identityValues.pan2}  data-value={this.props.identityValues.pan2} data-ext={this.props.identityValues.pan2ext} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.pan2} data-subtype="pan2" data-name={this.props.identityValues.pan2name} data-ext={this.props.identityValues.pan2ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.pan2} data-ext={this.props.identityValues.pan2ext}><i className="fa fa-file"></i> {this.props.identityValues.pan2name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.pan2} data-subtype="pan2" data-name={this.props.identityValues.pan2name} data-ext={this.props.identityValues.pan2ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
            </div>
          </div>
        :
        null
      }
      {
        this.props.cardNameNew == "DrivingLicenseForm" &&  this.props.cardValue == true ?
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding driving">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                  <input type="text" className={ this.state.drivingCardNo ? this.state.drivingCardNo != '' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} ref="drivingCardNo" name="drivingCardNo" id="drivingCardNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.drivingCardNo}/>
                  <label className="">Driving License No.</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
            {
              this.props.identityValues ?
                this.props.identityValues.driving1 && !this.props.identityValues.driving2 ? 
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 backViewInput">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="driving2" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                :
                this.props.identityValues.driving1 && this.props.identityValues.driving2 ?
                  ""
                :
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="driving1" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
              :
              <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="driving1" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
            }
            <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 FileDiv" style={{display: "none"}}>
              <div className="input-effect input-group">
                <label></label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right proofDocsProgress identityProofPro" style={{display: "none"}}>
              <div id="identyErrorList"></div>
              {this.getUploadImagePercentage()}
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding proofLinkDiv">
              { this.props.identityValues ?
                  this.props.identityValues.driving1 ?
                    this.props.identityValues.driving1ext == 'jpg' || this.props.identityValues.driving1ext == 'png' || this.props.identityValues.driving1ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.driving1} data-ext={this.props.identityValues.driving1ext} src={this.props.identityValues.driving1} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.driving1} data-subtype="driving1" data-name={this.props.identityValues.driving1name} data-ext={this.props.identityValues.driving1ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.driving1} data-ext={this.props.identityValues.driving1ext}><i className="fa fa-file"></i> {this.props.identityValues.driving1name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.driving1} data-subtype="driving1" data-name={this.props.identityValues.driving1name} data-ext={this.props.identityValues.driving1ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
              {
                this.props.identityValues ?
                  this.props.identityValues.driving2 ?
                    this.props.identityValues.driving2ext == 'jpg' || this.props.identityValues.driving2ext == 'png' || this.props.identityValues.driving2ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.driving2} data-ext={this.props.identityValues.driving2ext} src={this.props.identityValues.driving2} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.driving2} data-subtype="driving2" data-name={this.props.identityValues.driving2name} data-ext={this.props.identityValues.driving2ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.driving2} data-ext={this.props.identityValues.driving2ext}><i className="fa fa-file"></i> {this.props.identityValues.driving2name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.driving2} data-subtype="driving2" data-name={this.props.identityValues.driving2name} data-ext={this.props.identityValues.driving2ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
            </div>
          </div>
        :
          null
      }
      {
        this.props.cardNameNew == "VotingForm" && this.props.cardValue == true ?
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding voting">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                  <input type="text" className={ this.state.votingCardNo ? this.state.votingCardNo != '' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} ref="votingCardNo" name="votingCardNo" id="votingCardNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.votingCardNo}/>
                  <label className="">Voting Card No.</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
            {
              this.props.identityValues ?
                this.props.identityValues.voting1 && !this.props.identityValues.voting2 ? 
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 backViewInput">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="voting2" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                :
                this.props.identityValues.voting1 && this.props.identityValues.voting2 ?
                  ""
                :
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="voting1" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
              :
              <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 backViewInput">
                <input type="file" className="btn btn-info inputFiles" data-subtype="voting2" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
            }
            <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 FileDiv" style={{display: "none"}}>
              <div className="input-effect input-group">
                <label></label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right proofDocsProgress identityProofPro" style={{display: "none"}}>
              <div id="identyErrorList"></div>
              {this.getUploadImagePercentage()}
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding proofLinkDiv">
              { this.props.identityValues ?
                  this.props.identityValues.voting1 ?
                    this.props.identityValues.voting1ext == 'jpg' || this.props.identityValues.voting1ext == 'png' || this.props.identityValues.voting1ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.voting1} data-ext={this.props.identityValues.voting1ext} src={this.props.identityValues.voting1} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.voting1} data-subtype="voting1" data-name={this.props.identityValues.voting1name} data-ext={this.props.identityValues.voting1ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.voting1} data-ext={this.props.identityValues.voting1ext}><i className="fa fa-file"></i> {this.props.identityValues.voting1name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.voting1} data-subtype="voting1" data-name={this.props.identityValues.voting1name} data-ext={this.props.identityValues.voting1ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
              {
                this.props.identityValues ?
                  this.props.identityValues.voting2 ?
                    this.props.identityValues.voting2ext == 'jpg' || this.props.identityValues.voting2ext == 'png' || this.props.identityValues.voting2ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.voting2} data-ext={this.props.identityValues.voting2ext} src={this.props.identityValues.voting2} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.voting2} data-subtype="voting2" data-name={this.props.identityValues.voting2name} data-ext={this.props.identityValues.voting2ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.voting2} data-ext={this.props.identityValues.voting2ext}><i className="fa fa-file"></i> {this.props.identityValues.voting2name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.voting2} data-subtype="voting2" data-name={this.props.identityValues.voting2name} data-ext={this.props.identityValues.voting2ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
            </div>
          </div>
        :
          null
      }
      {
        this.props.cardNameNew == "RationCardForm" && this.props.cardValue == true ?
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding ration">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                  <input type="text" className={ this.state.rationCardNo ? this.state.rationCardNo != '' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} ref="rationCardNo" name="rationCardNo" id="rationCardNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.rationCardNo}/>
                  <label className="">Ration Card No.</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
            {
              this.props.identityValues ?
                this.props.identityValues.ration1 && !this.props.identityValues.ration2 ? 
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 backViewInput">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="ration2" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                :
                this.props.identityValues.ration1 && this.props.identityValues.ration2 ?
                  ""
                :
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="ration1" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
              :
              <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="ration1" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
            }
            <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 FileDiv" style={{display: "none"}}>
              <div className="input-effect input-group">
                <label></label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right proofDocsProgress identityProofPro" style={{display: "none"}}>
              <div id="identyErrorList"></div>
              {this.getUploadImagePercentage()}
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding proofLinkDiv">
              { this.props.identityValues ?
                  this.props.identityValues.ration1 ?
                    this.props.identityValues.ration1ext == 'jpg' || this.props.identityValues.ration1ext == 'png' || this.props.identityValues.ration1ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.ration1} data-ext={this.props.identityValues.ration1ext} src={this.props.identityValues.ration1} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.ration1} data-subtype="ration1" data-name={this.props.identityValues.ration1name} data-ext={this.props.identityValues.ration1ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.ration1} data-ext={this.props.identityValues.ration1ext}><i className="fa fa-file"></i> {this.props.identityValues.ration1name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.ration1} data-subtype="ration1" data-name={this.props.identityValues.ration1name} data-ext={this.props.identityValues.ration1ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
              {
                this.props.identityValues ?
                  this.props.identityValues.ration2 ?
                    this.props.identityValues.ration2ext == 'jpg' || this.props.identityValues.ration2ext == 'png' || this.props.identityValues.ration2ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.ration2} data-ext={this.props.identityValues.ration2ext} src={this.props.identityValues.ration2} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.ration2} data-subtype="ration2" data-name={this.props.identityValues.ration2name} data-ext={this.props.identityValues.ration2ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.ration2} data-ext={this.props.identityValues.ration2ext}><i className="fa fa-file"></i> {this.props.identityValues.ration2name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.ration2} data-subtype="ration2" data-name={this.props.identityValues.ration2name} data-ext={this.props.identityValues.ration2ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
            </div>
          </div>
        :
         null
      }
      {
        this.props.cardNameNew == "PassportForm" && this.props.cardValue == true?
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding passport">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding">
              <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                  <input type="text" className={ this.state.passportNo ? this.state.passportNo != '' ? "effect-21 form-control loginInputs has-content proofType" : "effect-21 form-control loginInputs proofType" : "effect-21 form-control loginInputs proofType"} ref="passportNo" name="passportNo" id="passportNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.passportNo}/>
                  <label className="">Passport No.</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
            </div>
            {
              this.props.identityValues ?
                this.props.identityValues.passport1 && !this.props.identityValues.passport2 ? 
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 backViewInput">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="passport2" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                :
                this.props.identityValues.passport1 && this.props.identityValues.passport2 ?
                  ""
                :
                <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="passport1" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
              :
              <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 browseButton">
                <input type="file" className="btn btn-info inputFiles" data-subtype="passport1" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
            }
            <div className="form-group col-lg-3 col-md-3 col-sm-12 col-xs-12 FileDiv" style={{display: "none"}}>
              <div className="input-effect input-group">
                <label></label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right proofDocsProgress identityProofPro" style={{display: "none"}}>
              <div id="identyErrorList"></div>
              {this.getUploadImagePercentage()}
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding proofLinkDiv">
              { this.props.identityValues ?
                  this.props.identityValues.passport1 ?
                    this.props.identityValues.passport1ext == 'jpg' || this.props.identityValues.passport1ext == 'png' || this.props.identityValues.passport1ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.passport1} data-ext={this.props.identityValues.passport1ext} src={this.props.identityValues.passport1} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.passport1} data-subtype="passport1" data-name={this.props.identityValues.passport1name} data-ext={this.props.identityValues.passport1ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.passport1} data-ext={this.props.identityValues.passport1ext}><i className="fa fa-file"></i> {this.props.identityValues.passport1name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.passport1} data-subtype="passport1" data-name={this.props.identityValues.passport1name} data-ext={this.props.identityValues.passport1ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
              {
                this.props.identityValues ?
                  this.props.identityValues.passport2 ?
                    this.props.identityValues.passport2ext == 'jpg' || this.props.identityValues.passport2ext == 'png' || this.props.identityValues.passport2ext == 'jpeg' ?
                      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group" style={{height: "200"+"px"}}>
                        <a href="" onClick={this.identityModal.bind(this)}><img data-value={this.props.identityValues.passport2} data-ext={this.props.identityValues.passport2ext} src={this.props.identityValues.passport2} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.passport2} data-subtype="passport2" data-name={this.props.identityValues.passport2name} data-ext={this.props.identityValues.passport2ext}></i>
                      </div>
                    :
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group">
                      <a href="" onClick={this.identityModal.bind(this)} data-value={this.props.identityValues.passport2} data-ext={this.props.identityValues.passport2ext}><i className="fa fa-file"></i> {this.props.identityValues.passport2name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.identityValues.passport2} data-subtype="passport2" data-name={this.props.identityValues.passport2name} data-ext={this.props.identityValues.passport2ext}></i>
                    </div>
                  :
                  ""
                :
                ""
              }
            </div>
          </div>
        :
          null
      }
        <div className="modal fade" id="identityProofModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="proofDataModal">
                  hi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
        <button type="submit" className="btn btn-info pull-right" onClick={this.handleStatutorySubmit.bind(this)}>Save</button>
      </form>
    );
  }
}

export default StatutoryForm = withTracker(params => {
  
  return {
    cardNameNew : params.cardName,
    cardValue   : params.cardValue
  };

})(StatutoryFormChild);