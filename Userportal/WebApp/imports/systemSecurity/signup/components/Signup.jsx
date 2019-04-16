import React, { Component } from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class SignUp extends TrackerReact(React.Component) {
  componentDidMount() {
    $("#signUpH2 ").css('marginTop','0px');
    $.validator.addMethod("regx1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");
    $.validator.addMethod("regx2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $.validator.addMethod("regx3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter an aadhar number in the format ex-1234 5678 9012.");
    $.validator.addMethod("regx4", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid contact number.");
    
    $("#signUpUsers").validate({
      rules: {
        firstname: {
          required: true,
          regx1: /^[a-zA-Z ]+$/,
        },
        lastname: {
          required: true,
          regx1: /^[a-zA-Z ]+$/,
        },
        signupEmail: {
          required: true,
          regx2: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/,
        },
        mobNumber: {
          required: true,
          // regx1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
          regx4: /^\+?\d+$/,
        },
        aadharCard: {
          // required: true,
          regx3: /^\d{4}\s\d{4}\s\d{4}$|^$/,
        },
        signupPassword: {
          required: true,
          minlength: 6,
        },
        signupConfirmPassword: {
          required: true,
          minlength: 6,
        },
      }
    });
    
  }
	showSignIn(event){
		event.preventDefault();
		$('#outerSignUpWrapper').hide();
    $('#outerLoginWrapper').show(); 
    $('.modalContent').removeClass('addModalHeight');
	}
  showCompanySignUp(event){
    event.preventDefault();
    $('#outerSignUpWrapper').hide();
    $('#CompanySignUpWrapper').show();
  }
	showOTP(event){
		event.preventDefault();
    $('#outerSignUpWrapper').hide();
    $('#OtpBlock').show();
    $('.modalContent').removeClass('addModalHeight');
	}
  usersignup(event){
    event.preventDefault();
    if($("#signUpUsers").valid()){  
      var latestUsersDetails  = Meteor.users.findOne({'profile.loginAs':'user'},{sort: {"createdAt":-1}});
      // console.log("latestUsersDetails",latestUsersDetails);
      if(latestUsersDetails){
        if(latestUsersDetails.profile){
          if(latestUsersDetails.profile.assureId){
            var str = latestUsersDetails.profile.assureId;
          }else{
            var str = "IN-AAA-000000";
          }
        }
      }else{
        var str = "IN-AAA-000000";
      }

      var type = 'user';
      var splitStr = str.split('-');
      //splitStr[0] - Country Code
      //splitStr[1] - Character Code
      //splitStr[2] - Number
      //Number Logic
      // document.getElementById("demo").innerHTML = str;
      var firstChar = splitStr[1].substr(2,1);
      var middleChar = splitStr[1].substr(1,1);
      var lastChar = splitStr[1].substr(0,1);
      //Charcter Code Calculation
      //if DEG - then G - last E - middle D - first
      //var first2Char = splitStr[1].substr(1,1); /*second digit*/
       
      var number = parseInt(splitStr[2]);
      var last = number + 1;
      var last0 = '0';
      if(last > 0 && last < 11){
        last0 = '00000' + last;
        if(last == 10){last0 = '0000' + last;}
      }else if(last > 10 && last < 101){
        last0 = '0000' + last;
        if(last == 100){last0 = '000' + last;}
      }else if(last > 100 && last < 1001){
        last0 = '000' + last;
        if(last == 1000){last0 = '00' + last;}
      }else if(last > 1000 && last < 10001){
        last0 = '00' + last;
        if(last == 10000){last0 = '0' + last;}
      }else if(last > 10000 && last < 100001){
        last0 = last;
      }else if(last > 999999){
        last0 = '000000';         
        if(firstChar != 'Z'){
          var firstAscii = firstChar.charCodeAt();
          firstAscii = firstAscii + 1;
          firstChar = String.fromCharCode(firstAscii);
        }else{
          firstChar = 'A'; 
          if(middleChar != 'Z'){
            var middleAscii  = middleChar.charCodeAt();
            middleAscii  = middleAscii  + 1;
            middleChar = String.fromCharCode(middleAscii );
          }else{
            middleChar = 'A'; 
            if(type == 'user'){
              var lastAscii = lastChar.charCodeAt();
              if(lastChar == 'B'){
                lastAscii = lastAscii + 2;
              }else{
                lastAscii = lastAscii + 1;
              }
              lastChar = String.fromCharCode(lastAscii );
            }
          } 
        }
      }

      var newAssureID = splitStr[0] + '-' + lastChar+middleChar+firstChar + '-' + last0;
      // console.log('newAssureID:',newAssureID);

      var formValues = {
        'firstname'        : (this.refs.firstname.value).trim(),
        'lastname'         : (this.refs.lastname.value).trim(),
        'signupEmail'      : this.refs.signupEmail.value,
        'mobNumber'        : this.refs.mobNumber.value,
        'signupPassword'   : this.refs.signupPassword.value,
        'aadharCard'       : this.refs.aadharCard.value,
        'assureId'         : newAssureID,
      }   
      
      var passwordVar              = this.refs.signupPassword.value;
      var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;
      var mobileNo                 = this.refs.mobNumber.value;

      //Check password is at least 6 chars long
      var isValidPassword = function(passwordVar, signupConfirmPasswordVar) {
        if (passwordVar === signupConfirmPasswordVar) {
          return passwordVar.length >= 6 ? true : swal({
            title : "password should be at least 6 characters long",
            text  : "Please try again or create an account",
            showConfirmButton: true,
            type  : "error"
          });
        } else {
          return swal({
            title  : "Passwords doesn't match",
            text   : 'Please try again',
            showConfirmButton: true,
            type   : 'error'
          }); //End of error swal
        } //End of else
      }

      if (isValidPassword(passwordVar, signupConfirmPasswordVar)) {
        if ($('input.checkbox_check').is(':checked')) {
          Meteor.call('userCreateAccount', formValues ,(error,result) => {
            if(error){
              swal(error.reason);
            }else{      
              var mobile = mobileNo;
              var mobileotp = Math.floor(1000 + Math.random() * 9000);
              var emailotp = Math.floor(100000 + Math.random() * 900000);
              // ADD USER ROLE 
              var newID = result;
              Session.set('newID',newID);

              var basicformValues = {
                "userId"          : newID,
                "firstName"       : this.refs.firstname.value,
                "lastName"        : this.refs.lastname.value,
                "fatherFirstName" : '',
                "fatherLastName"  : '',
                "motherFirstName" : '',
                "motherLastName"  : '',
                "spouseFirstName" : '',
                "spouseLastName"  : '',
                "gender"          : 'Female',
                "dateOfBirth"     : '',
                "mobileNo"        : this.refs.mobNumber.value,
                "altMobileNo"     : '',
                "emailId"         : this.refs.signupEmail.value,
                "altEmailId"      : '',
                'assureId'        : newAssureID,
                "proofType"       : '',
                "proofOfDocument" : '', 
                "fileExt"         : '',
                "fileName"        : '',
                "aadharCard"      : this.refs.aadharCard.value,
                "companyReferences" : [],
              }
              Meteor.call("insertBasicData", basicformValues, function(error,result){
                if(error){
                  console.log(error.reason);
                }else{
                  Meteor.logout();
                }
              });
              
              Meteor.call('addOTP', newID , mobileotp, emailotp, function(error,result){
                if(error){
                  Bert.alert(error);
                }else{

                }
              });

              var Role  = "user";
              Meteor.call('addRoles', newID , Role, function(error,result){
                if(error){
                  Bert.alert(error);
                }else{                    
                }
              }); // add role

              //Send OTP  
              if(mobile != ""){
                var mobileotpStr = mobileotp.toString();
                var smsBody = "Enter "+mobileotpStr+" to verify your account on ASSUREiD.";
                Meteor.call('SEND_SMS',mobile,smsBody,
                function(error,result){
                  if(error){
                    console.log(error.reason);
                  }else{
                    // swal('Successfully sent the OTP to your mobile number.');                   
                  }
                }); 
              }else{
                swal('Your mobile number is not found. Please enter valid mobile number.');
              }   

              // SEND EMAIL VERIFICATION LINK
              Meteor.call('sendVerificationLinkToUser', newID, function(error,result){
                if(error){
                  console.log(error);
                }else{  
                  // swal('Successfully sent the OTP to your email address.');                   
                } //end else
              }); // send verification mail ends
              
              // CLEAR ALL FIELDS
              this.refs.firstname.value             = '';
              this.refs.lastname.value              = '';
              this.refs.signupEmail.value           = '';
              this.refs.mobNumber.value             = '';
              this.refs.signupPassword.value        = '';   
              this.refs.aadharCard.value            = '';
              this.refs.signupConfirmPassword.value = '';    
              $('#checkbox_check').prop('checked', false);
              $('input.effect-21').removeClass('has-content error');
              $('input[type="tel"]').removeClass('has-content error');

              $('.modalContent').removeClass('addModalHeight');
              $('#outerSignUpWrapper').hide();
              $('#OtpBlock').show();            
            } //end else
          });
        }else{
          swal({
            title: "Terms and Conditions!",
            text: "Please accept terms and conditions!",
            // timer: 1700,
            showConfirmButton: true,
            type: "error"
          });
        }
      }
    }else{
      $(event.target).find('.effect-21.error:first').focus();
      $(event.target).find('.effect-21.error').addClass('has-content');
    }
    return 0;   
  }

  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
      $(event.target).parent('.intl-tel-input').siblings('label').css({'padding-left':'15px','top':'-20px','left':'0px','color':'#0a8fc4'});
      $('.intl-tel-input').children('.effect-21').css('border','1px solid #00b8FF');
    }else{
      if($('.effect-21').hasClass('error')){
        $(event.target).find('.effect-21.error').addClass('has-content');  
      }else{
        $(event.target).removeClass("has-content");
      }
      $(event.target).parent('.intl-tel-input').children('.effect-21').css('border','1px solid #b9bed2');
      $(event.target).parent('.intl-tel-input').siblings('label').css({'color':'#4a4a4a'});
    }
  }
  handleChange(event){
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }
  }
  labelEffect(event){
    event.preventDefault();
    $(event.target).css('border','1px solid #00b8FF');
    $(event.target).parent('.intl-tel-input').siblings('label').css({'padding-left':'15px','top':'-20px','left':'0px','color':'#0a8fc4'});
  }

	render() {
    return (
    	<div>
    	  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerSignUpWrapper" id="outerSignUpWrapper" >
          <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12  col-xs-12">
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/>
            <h2 id="signUpH2">Sign Up</h2>
          </div>
          <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="signUpUsers" onSubmit={this.usersignup.bind(this)}>
              <div className="form-group col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-user" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" ref="firstname" name="firstname" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} aria-label="First Name" aria-describedby="basic-addon1"/>
                  <label>First Name<span className="astrikReq">*</span></label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-user" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" ref="lastname" name="lastname" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} aria-label="Last Name" aria-describedby="basic-addon1"/>
                  <label>Last Name<span className="astrikReq">*</span></label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div> 
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{marginBottom: '25'+'px'}}>
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                  <input type="email" className="effect-21 form-control loginInputs" ref="signupEmail" name="signupEmail" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} aria-label="Email Id" aria-describedby="basic-addon1"/>
                  <label>Email Id<span className="astrikReq">*</span></label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div> 
              </div>
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <input type="tel" className="effect-21 form-control loginInputs" id="phone" ref="mobNumber" name="mobNumber" onBlur={this.inputEffect.bind(this)} onFocus={this.labelEffect.bind(this)} aria-label="Mobile No" aria-describedby="basic-addon1"/>
                <label>Mobile No<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" ref="aadharCard" name="aadharCard" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} aria-label="Aadhar Card Number"  />
                  <label>Aadhar Card Number(Format - xxxx xxxx xxxx)</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div> 
              <div className="form-group col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{marginBottom: '35'+'px'}}>
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                  <input type="password" className="effect-21 form-control loginInputs" ref="signupPassword" name="signupPassword" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} aria-label="Username" aria-describedby="basic-addon1"/>
                  <label>Password<span className="astrikReq">*</span></label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                  <input type="password" className="effect-21 form-control loginInputs" ref="signupConfirmPassword" name="signupConfirmPassword" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} aria-label="Confirm Password" aria-describedby="basic-addon1"/>
                  <label>Confirm Password<span className="astrikReq">*</span></label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>   

             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
               <input type="checkbox" name="" value="" id="checkbox_check" className="checkbox_check" /> I agree to the <a className="signTerms" target="_blank" href="/termsandcondition">terms and conditions</a>
             </div>
             <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
               <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn" data-toggle="modal" data-target="#Hello">Sign Up</button>  
             </div>
            </form>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="text-left col-lg-6 col-md-6 col-sm-6 col-xs-6 nopadLeft bottomLiksOuter">
                <a href="#" className="bottomLinks" onClick={this.showSignIn.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i> Sign In</a>
              </div>
            </div>
          </div>
        </div>
    	</div>
    );
  }
}
