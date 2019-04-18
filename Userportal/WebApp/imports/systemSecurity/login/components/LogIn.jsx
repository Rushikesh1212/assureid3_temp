import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import SignUp from '/imports/systemSecurity/signup/components/Signup.jsx';
import OTPModal from '/imports/systemSecurity/otp/components/OTPModal.jsx';
import DoHaveProfile from '/imports/systemSecurity/otp/components/DoHaveProfile.jsx';
import ForgotPassword from '/imports/systemSecurity/forgotpassword/components/ForgotPassword.jsx';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'; 
// import {RequestPool} from '/imports/website/company/api/company.js';

export default class LogIn extends TrackerReact(Component) {
  componentWillMount() {
    if(!$("link[href='/css/intlTelInput.css']").length > 0){
      var pricingCss = document.createElement("link");
      pricingCss.type="text/css";
      pricingCss.rel ="stylesheet";
      pricingCss.href="/css/intlTelInput.css";
      document.head.append(pricingCss);     
    }
    $.getScript('/js/intlTelInput.js',function() {
      $(function(){
        $('#phone').intlTelInput({
          initialCountry: "auto",
          geoIpLookup: function(callback) {
            $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
              var countryCode = (resp && resp.country) ? resp.country : "";
              callback(countryCode);
            });
          },
          utilsScript: "/js/utils.js" // just for formatting/placeholders etc
        });
        $('#phoneCompany').intlTelInput({
          initialCountry: "auto",
          geoIpLookup: function(callback) {
            $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
              var countryCode = (resp && resp.country) ? resp.country : "";
              callback(countryCode);
            });
          },
          utilsScript: "/js/utils.js" // just for formatting/placeholders etc
        });
      });
    });
  }
  componentWillUnmount() {
    $("link[href='/css/intlTelInput.css']").remove();
  }
  componentDidMount() {
    $.validator.addMethod("regLx2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $("#login").validate({
      rules: {
        loginusername: {
          required: true,
          regLx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
        }
      }
    });
  }
	showSignUp(event){
		event.preventDefault();
		$('#outerLoginWrapper').hide();
    $('#outerSignUpWrapper').show();
    $('.modalContent').addClass('addModalHeight');
	}
  showForgotModal(event){
    event.preventDefault();
    $('#outerLoginWrapper').hide();
    $('#ForgotBlock').show();
    $('#OtpBlock').hide(); 
    $('#companyOtpBlock').hide();
  }
  userlogin(event){
    event.preventDefault();
    if($("#login").valid()){
      var email       = (this.refs.loginusername.value).trim();
      var passwordVar = this.refs.loginPassword.value;  

      if(email && passwordVar){ 
        Meteor.call('checkEmailVerification', email, function(error,data){
          if (data == "verified"){
            Meteor.call('checkBlockedUser', email, function(error,data){
              if (data == "Active"){
                Meteor.loginWithPassword(email, passwordVar, function(error) {
                  if (error) {
                    return swal({
                      title: "Either email or password is incorrect",
                      text: "Please try again",
                      timer: 3000,
                      showConfirmButton: false,
                      type: "error"
                    });
                  } else {
                    if(Roles.userIsInRole(Meteor.userId(), ['user'])) {
                       var userId = Meteor.users.findOne({"_id" : Meteor.userId()});
                       // console.log("userId",userId);
                       if (userId) {
                         if (userId.profile) {
                            var assureId = userId.profile.assureId;
                             // console.log("assureId",assureId);
                             // FlowRouter.go('/profileForms/home');
                            if (assureId) {
                              Meteor.call("requestPoolDataCount",assureId,function(error,result){
                                if (error) {
                                  console.log(error.reason);
                                }else{
                                   if (result == true) {
                                    $('#loginModal').modal('hide');
                                    $('.modal-backdrop').hide();
                                    FlowRouter.go('/cart');
                                   }else{
                                    $('#loginModal').modal('hide');
                                    $('.modal-backdrop').hide();
                                    FlowRouter.go('/profile');
                                   }
                                }
                              });                                                             
                            }
                         }
                       }
                       // $('#loginModal').modal('hide');
                       // $('.modal-backdrop').hide();
                        // browserHistory.replace('/profile'); 
                    }else if(Roles.userIsInRole(Meteor.userId(), ['admin','superAdmin'])) {
                      $('#loginModal').modal('hide');
                      $('.modal-backdrop').hide();
                      FlowRouter.go('/admin/dashboard');
                    }else{
                      $('#loginModal').modal('hide');
                      $('.modal-backdrop').hide();
                    }
                    // this.refs.loginusername.value = '';    
                    // this.refs.loginPassword.value = '';    
                    $('#checkbox_check1').prop('checked', false);
                    $('input.effect-21').removeClass('has-content error');
                  }
                });
              }else if(data == "Blocked"){
                swal({
                  title: "Your profile is blocked",
                  text: "Please contact with Admin",
                  timer: 3000,
                  showConfirmButton: false,
                  type: "error"
                });
              }else{
                swal({
                  title: "Either email or password is incorrect",
                  text: "Please try again",
                  timer: 3000,
                  showConfirmButton: false,
                  type: "error"
                });
              }
            });  
          }else if(data == "unverified"){
            swal({
              title: "Your Account is not verified",
              text: "Please click on 'OK' button to verify now",
              showConfirmButton: true,
              type: "error"      
            });
            $('#outerLoginWrapper').hide();
            $('#OtpBlock').show();
          }else{
            swal({
              title: "Email Id does not exist",
              text: "Please create an account",
              timer: 3000,
              showConfirmButton: false,
              type: "error"
            });
          }
          $("html,body").scrollTop(0);
        });
        return false;       
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

	render() {
    // console.log('hi');
    return (
    	<div>
  	   <div className="modal fade in" id="loginModal" role="dialog">
          <div className="modal-dialog modal-md">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 modalContent"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerLoginWrapper" id="outerLoginWrapper">
                    <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/>
                      <h2>Sign In</h2>
                    </div>
                    <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form className="" id="login" autoComplete="off" onSubmit={this.userlogin.bind(this)}>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-user" aria-hidden="true"></i></span>
                            <input type="text" className="effect-21 form-control loginInputs" ref="loginusername" name="loginusername" onBlur={this.inputEffect.bind(this)} required/>
                            <label>Email<span className="astrikReq">*</span></label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div> 
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                            <input type="password" className="effect-21 form-control loginInputs" ref="loginPassword" name="loginPassword" onBlur={this.inputEffect.bind(this)} required/>
                            <label>Password<span className="astrikReq">*</span></label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>  
                        {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 keepmeloginOuter"> 
                         <input type="checkbox" name="" value="" id='checkbox_check1'/> Keep me Signed In
                        </div>*/}
                        <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                         <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn">Sign In</button>
                        </div>
                      </form>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bottomLiksOuter">
                        <div className="text-left col-lg-6 col-md-6 col-sm-6 col-xs-5 nopadLeft ">
                          <a href="#" className="bottomLinks" onClick={this.showSignUp.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i> Sign Up</a>
                        </div>
                        <div className="text-right col-lg-6 col-md-6 col-sm-6 col-xs-7 NOpadding">
                          <a href="#" className="bottomLinks" onClick={this.showForgotModal.bind(this)}>Forgot Password ?</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <SignUp />
                  <ForgotPassword />
                  <OTPModal />
                  <DoHaveProfile/>
              </div>
            </div>
          </div>
        </div>
    	</div>
    );
  }
}
