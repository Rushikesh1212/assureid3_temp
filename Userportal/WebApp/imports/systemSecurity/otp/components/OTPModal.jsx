import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DoHaveProfile from './DoHaveProfile.jsx';
import ResetPassword from '/imports/systemSecurity/resetpassword/components/ResetPassword.jsx';

export default class OTPModal extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      "subscription" : { 
        user             : Meteor.subscribe("userfunction"), 
        "notificationTemplate" : Meteor.subscribe("notificationTemplate") 
      }
    }
  }
  componentDidMount() {
    $.validator.addMethod("regOx4", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter numbers only.");
    $("#OTPMobMail").validate({
      rules: {
        emailotp: {
          required: true,
          regOx4: /^[0-9]*$/,
          maxlength: 6,
        },
        mobileotp: {
          required: true,
          regOx4: /^[0-9]*$/,
          maxlength: 4,
        },
      }
    });
  }
  showWelcome(event){
    event.preventDefault();
    $('#OtpBlock').hide();
    $('#DoHaveProfile').show();
  }
  confirmOTP(event){
    event.preventDefault();
    if($('#OTPMobMail').valid()){
      var newID = Session.get('newID');
      if(newID){
        var userOtp = Meteor.users.findOne({"_id":newID});
      }else{
        var username = $('input[name="loginusername"]').val();   
        var userOtp = Meteor.users.findOne({"username":username});
      }
      if(userOtp){
        var mobotp = userOtp.profile.sentMobileOTP;
        var mailotp = userOtp.profile.sentEmailOTP;
        var usercode = userOtp.profile.userCode.split("").reverse().join("");
        var newID = userOtp._id;
        var email = userOtp.username;
      }

      var emailotp = this.refs.emailotp.value;
      var mobileotp = this.refs.mobileotp.value;

      if(emailotp && mobileotp){
        if(mailotp == emailotp && mobotp == mobileotp){
          Meteor.call('createUserByAdminSetEmailToTrue',newID,
          function(error,result){
            if(error){
              console.log(error.reason);
            }else{
              if($('#OTPMobMail').hasClass('newPassword')){
                
              }else{
                Meteor.loginWithPassword(email, usercode, function(error) {
                  if (error) {
                    console.log('error: ',error);
                  } else {
                    
                  }
                }); 
              }   
            }
          });

          Meteor.call('updateOTP', newID , mobotp, mailotp , function(error,result){
            if(error){
              Bert.alert(error);
            }else{
              var adminData   = Meteor.users.findOne({'roles' : "admin"});
              var userData    = Meteor.users.findOne({"_id" : newID});
              if (adminData) {
                var adminId  = adminData._id;
              }
              if (userData) {
                if (userData.profile) {
                  var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
                  var assureId    = userData.profile.assureId;
                  var mobNumber   = userData.profile.mobNumber;
                }
              }
              var newDate     = new Date();

              var msgvariable = {                       
                '[username]' : firstLastNm+"("+assureId+") ",
                '[date]'     : moment(newDate).format("DD/MM/YYYY"),
              };
              
              // Format for send Email //
              var inputObj = {
                  from         : adminId,
                  to           : newID,
                  templateName : 'New Registration',
                  variables    : msgvariable,
              }
              sendMailNotification(inputObj);
              
              // Format for sending SMS //
              var smsObj = {
                  to           : newID,
                  templateName : 'New Registration',
                  number       : mobNumber,
                  variables    : msgvariable,
              }
              // console.log("smsObj",smsObj);
              sendSMS(smsObj);

              // Format for sending notification //
              var notifictaionObj = {
                to           : newID,
                templateName : 'New Registration',
                variables    : msgvariable,
              }
              sendInAppNotification(notifictaionObj);
            }
          });

          if($('#OTPMobMail').hasClass('newPassword')){
            $('#OtpBlock').hide();
            $('#companyOtpBlock').hide();
            $('#ResetBlock').show();
          }else{
            $('#OtpBlock').hide();
            $('#companyOtpBlock').hide();
            $('#DoHaveProfile').show();
          }  

          this.refs.emailotp.value  = '';
          this.refs.mobileotp.value = '';
          $('input.effect-21').removeClass('has-content error');
        }else{
          swal('Either email OTP or mobile OTP is incorrect');
        }
      }
    }else{
      $(event.target).find('.effect-21.error:first').focus();
      $(event.target).find('.effect-21.error').addClass('has-content');
    }
  }
  resendOTP(event){
    event.preventDefault();
    var sessionValue = Session.get('newID');
    if(sessionValue){
      var newID = sessionValue;
      var userData = Meteor.users.findOne({"_id":newID});
      if(userData){
        var mobile = userData.profile.mobNumber;
        var username = userData.username;   
      }
    }else{
      var username = $('input[name="loginusername"]').val();   
      var userData = Meteor.users.findOne({"username":username});
      if(userData){
        var mobile = userData.profile.mobNumber;
        var newID  = userData._id;
      }
    }
    
    var mobileotp = Math.floor(1000 + Math.random() * 9000);
    var emailotp = Math.floor(100000 + Math.random() * 900000);

    Meteor.call('addOTP', newID , mobileotp, emailotp, function(error,result){
      if(error){
        Bert.alert(error);
      }else{

      }
    });

    //Send Mobile OTP  
    if(mobile != ""){
      var mobileotpStr = mobileotp.toString();
      var smsBody = "Enter "+mobileotpStr+" to verify your account on ASSUREiD.";
      Meteor.call('SEND_SMS',mobile,smsBody,
      function(error,result){
        if(error){
          console.log(error.reason);
        }else{
          // swal('Successfully sent the OTP to your mobile number');
        }
      }); 
    }else{
      swal('Your mobile number is not found. Please enter valid mobile number.');
    }    

    // SEND EMAIL VERIFICATION LINK
    Meteor.call('sendVerificationLinkToUser', newID, function(error,result){
      if(error){
        Bert.alert(error);
      }else{  
        // swal('Successfully sent the OTP to your email address.');                   
      } //end else
    }); // send verification mail ends

    swal('Successfully sent the OTP to your mobile number and email address.');
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

  render(){
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
        <div className="outerOTPWRapper col-lg-12 col-md-12 col-sm-12 col-xs-12" id="OtpBlock">

          <div className="row">
             <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/> 
              </div>
            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
              <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                <span>We have sent you an OTP<br/>
                to your registered email Id and mobile no.<br />
                Enter your OTP below.</span>
              </div>
              <form id="OTPMobMail" onSubmit={this.confirmOTP.bind(this)}>
                <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="input-effect input-group">
                    <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-key" aria-hidden="true"></i></span>
                    <input type="text" className="effect-21 form-control loginInputs" ref="emailotp" name="emailotp" onBlur={this.inputEffect.bind(this)}/>
                    <label>Please enter 6 digits OTP sent on email Id<span className="astrikReq">*</span></label>
                    <span className="focus-border">
                      <i></i>
                    </span>
                  </div>
                </div>
                <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="input-effect input-group">
                    <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-key" aria-hidden="true"></i></span>
                    <input type="text" className="effect-21 form-control loginInputs" ref="mobileotp" name="mobileotp" onBlur={this.inputEffect.bind(this)}/>
                    <label>Please enter 4 digits OTP sent on mobile no.<span className="astrikReq">*</span></label>
                    <span className="focus-border">
                      <i></i>
                    </span>
                  </div>
                </div>  
                <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                  <button type="submit" className="btn btn-info submitBtn col-lg-12 col-md-12 col-sm-12 col-xs-12">Submit</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <p className="pull-right resendOTP" onClick={this.resendOTP.bind(this)}><b>RESEND OTP</b></p>
                </div>
              </form>
            </div>
          </div>

        </div>
        <DoHaveProfile />
        <ResetPassword />
      </div>
    );
  }
}
