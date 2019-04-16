import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class ForgotPassword extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      "subscription" : { 
        user             : Meteor.subscribe("userfunction"),  
      }
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount() {
    $.validator.addMethod("regFx4", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $.validator.addMethod("regFx5", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid contact number.");
    $("#forgotPassword").validate({
      rules: {
        forgotEmail: {
          required: true,
          regFx4: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
        },
        forgotNumber: {
          required: true,
          regFx5: /^[0-9]*$/,
        },
      }
    });
  }
  forgotpassword(event){
    event.preventDefault();
    if($("#forgotPassword").valid()){
      var mobile  = this.refs.forgotNumber.value;
      var email   = this.refs.forgotEmail.value;
      var userOtp = Meteor.users.findOne({"emails.address":email, "roles" : "user"});
      
      if(userOtp){
        var mobileotp = Math.floor(1000 + Math.random() * 9000);
        var emailotp  = Math.floor(100000 + Math.random() * 900000);
        var newID     = userOtp._id;
        Session.set('newID',newID);

        Meteor.call('addOTP', newID , mobileotp, emailotp, function(error,result){
          if(error){
            console.log(error.reason);
          }else{

          }
        });
       
        //Send OTP     
        var mobileotpStr = mobileotp.toString();
        var smsBody      = "Enter "+mobileotpStr+" to verify your account on ASSUREiD.";
        Meteor.call('SEND_SMS',mobile,smsBody,
        function(error,result){
          if(error){
            console.log(error.reason);
          }else{
            // swal('Successfully sent the OTP to your mobile number');
          }
        });  
                              
        // SEND EMAIL VERIFICATION LINK
        Meteor.call('sendVerificationLinkToUser', newID, function(error,result){
          if(error){
            console.log(error.reason);
          }else{  
            // swal('Successfully sent the OTP to your email address.');                   
          } //end else
        }); // send verification mail ends

        this.refs.forgotEmail.value  = '';
        this.refs.forgotNumber.value = '';
        $('input.effect-21').removeClass('has-content error');
            
        $('.modalContent').removeClass('addModalHeight');
        $('#ForgotBlock').hide();
        $('#OtpBlock').show();
        $('#OTPMobMail').addClass('newPassword'); 
      }else{
        swal('Please specify correct email address.');                   
      }
    }else{
      $(event.target).find('.effect-21.error:first').focus();
      $(event.target).find('.effect-21.error').addClass('has-content');
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

  render(){
    return(
      <div className="">
        <div className="outerOTPWRapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="row" id="ForgotBlock">
            <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/> 
              <h2>Forgot Password</h2>
            </div>
            <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <form id="forgotPassword" onSubmit={this.forgotpassword.bind(this)}>
                <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="input-effect input-group">
                    <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                    <input type="email" className="effect-21 form-control loginInputs" ref="forgotEmail" name="forgotEmail" onBlur={this.inputEffect.bind(this)}/>
                    <label>Email Id<span className="astrikReq">*</span></label>
                    <span className="focus-border">
                      <i></i>
                    </span>
                  </div>
                </div> 
                <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="input-effect input-group">
                    <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                    <input type="text" className="effect-21 form-control loginInputs" ref="forgotNumber" name="forgotNumber" onBlur={this.inputEffect.bind(this)}/>
                    <label>Mobile No<span className="astrikReq">*</span></label>
                    <span className="focus-border">
                      <i></i>
                    </span>
                  </div>
                </div> 
                <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                  <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn">Send OTP</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
