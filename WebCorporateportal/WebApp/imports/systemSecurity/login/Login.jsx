import React,{Component}   from 'react';
import {render}            from 'react-dom';
import TrackerReact        from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import  ForgotPassword     from '/imports/systemSecurity/forgotpassword/ForgotPassword.jsx';
import  OTPModal           from '/imports/systemSecurity/forgotpassword/OTPModal.jsx';    

export default class Login extends TrackerReact(Component) {
  constructor(props){
    super(props);
      this.state ={ 
        "loginassureId"   : '',
        "loginusername"   : '',
        "loginPassword"   : '',
        "subscription" : { 
        } 
      };
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

  userlogin(event){
    event.preventDefault();
    // swal("Work is under maintenance!");
    if($("#login").valid()){
      var assureId    = this.refs.loginassureId.value;
      var email       = (this.refs.loginusername.value).trim().toLowerCase();
      var passwordVar = this.refs.loginPassword.value; 
      // console.log("assureID :"+ assureId + "email :"+ email);
      var splitAssureId = assureId.split('-');
      // console.log("2 : ",splitAssureId[1]);
      if (splitAssureId[1] == "CAA") {
        if(email && passwordVar){ 
          Meteor.call('checkEmailVerification', email, function(error,data){
            if (data == "verified"){
              Meteor.call('checkBlockedUser', email, function(error,data){
                if (data == "Active"){
                  Meteor.call('checkAssureidandemailid',email,assureId,function(error,data){
                    if (data == "Correct") {
                      Meteor.loginWithPassword(email, passwordVar, function(error) {
                        if (error) {
                          swal({
                            title: "abc",
                            text: "Email id or Password is wrong! Please try again.",
                            timer: 3000,
                            showConfirmButton: false,
                            type: "error"
                          });
                        }else {
                          if(Roles.userIsInRole(Meteor.userId(), ['companyuser'])) {
                             var userId = Meteor.users.findOne({"_id" : Meteor.userId()});
                             // console.log("userId",userId);
                             if (userId) {
                               if (userId.profile) {
                                  var assureId = userId.profile.assureId;
                                   // console.log("assureId",assureId);
                                  if (userId.profile.changedPassword == false) {
                                    FlowRouter.go('/changePassword') ;                                                         
                                  }else{
                                    FlowRouter.go('/companyConsole/'+assureId);                                                          
                                  }
                               }
                             }else{
                                FlowRouter.go('/companyForms/basic'); 
                             }
                          }else{
                            swal({
                                title: "abc",
                                text: "You are not authorize person to SIGN IN in this system!",
                                timer: 3000,
                                showConfirmButton: false,
                                type: "error"
                              });
                          }
                          // this.refs.loginusername.value = '';    
                          // this.refs.loginPassword.value = '';    
                          $('#checkbox_check1').prop('checked', false);
                          $('input.effect-21').removeClass('has-content error');
                        }
                      });
                    }else{
                      swal({
                        title: "abc",
                        text: "Email Id and AssureID does not match. Please Check!",
                        timer: 3000,
                        showConfirmButton: false,
                        type: "error"
                      });
                    }
                  });
                }else if(data == "Blocked"){
                  swal({
                    title: "abc",
                    text: "Your profile is blocked. Please contact with Admin!",
                    timer: 3000,
                    showConfirmButton: false,
                    type: "error"
                  });
                }else{
                  swal({
                    title: "abc",
                    text: "Email id or Password is wrong. Please try again!",
                    timer: 3000,
                    showConfirmButton: false, 
                    type: "error"
                  });
                }
              });  
            }else if(data == "unverified"){
              swal({
                title: "abc",
                text: "Your Account is not verified. Please click on 'OK' button to verify now!",
                showConfirmButton: true,
                type: "error"
              });
              $('#outerLoginWrapper').hide();
              $('#OtpBlock').show();
            }else{
              swal({
                title: "abc",
                text: "Email Id does not exist. Please contact system admin!",
                timer: 3000,
                showConfirmButton: false,
                type: "error"
              });
            }
            // $("html,body").scrollTop(0);
          });
          return false;       
        }
      }else{
         swal({
            title: "abc",
            text: "AssureID does not exist. Please correct it!",
            timer: 3000,
            showConfirmButton: false,
            type: "error"
          });
      }

    }
  }

  inputEffect(event){ 
    event.preventDefault();
    // alert('hi');
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      $(event.target).removeClass("has-content");
    }
  }

  /**Code for Forgot Password */
  showForgotModal(event){
    event.preventDefault();
    $('#outerLoginWrapper').hide();
    $('#ForgotBlock').show();
    $('#OtpBlock').hide(); 
    $('#companyOtpBlock').hide();
  }

	render() {
    return (
    	<div>
  	   <div className="modal fade in" id="loginModal" role="dialog">
          <div className="modal-dialog modal-md">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 modalContent"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                {/* <button type="button" className="close" data-dismiss="modal">&times;</button> */}

                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerLoginWrapper" id="outerLoginWrapper">
                    <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/>
                      <h2>Sign In</h2>
                    </div>
                    <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form className="" id="login" onSubmit={this.userlogin.bind(this)}>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-address-book" aria-hidden="true"></i></span>
                            <input type="text" className="effect-21 form-control loginInputs" ref="loginassureId" name="loginassureId" onBlur={this.inputEffect.bind(this)} autoComplete="off" aria-label="Username" aria-describedby="basic-addon1" required/>
                            <label>AssureID<span className="astrikReq">*</span></label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div> 
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-user" aria-hidden="true"></i></span>
                            <input type="text" className="effect-21 form-control loginInputs" ref="loginusername" name="loginusername" onBlur={this.inputEffect.bind(this)} autoComplete="off" aria-label="Username" aria-describedby="basic-addon1" required/>
                            <label>Email Id<span className="astrikReq">*</span></label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div> 
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                            <input type="password" className="effect-21 form-control loginInputs" ref="loginPassword" name="loginPassword" onBlur={this.inputEffect.bind(this)} autoComplete="off" aria-label="Username" aria-describedby="basic-addon1" required/>
                            <label>Password<span className="astrikReq">*</span></label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>  
                        {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 keepmeloginOuter"> 
                         <input type="checkbox" name="" value=""/> Keep me Signed In
                        </div>*/}
                        <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                         <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn">Sign In</button>
                        </div>
                      </form>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bottomLiksOuter">
                        
                        <div className="col-lg-4 col-md-6 col-sm-6 col-xs-7 NOpadding ">
                          <a href="#" className="bottomLinks" onClick={this.showForgotModal.bind(this)}>Forgot Password ?</a>
                        </div>
                        <div className="text-left col-lg-8 col-md-6 col-sm-6 col-xs-6 nopadRight nopadLeft">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/assireID-poweredby.jpg" className="img img-responsive" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* <SignUp /> */}
                   <OTPModal />
                   <ForgotPassword />
                  
              </div>
             
            </div>
          </div>
        </div>
    	</div>
    );
  }
}
