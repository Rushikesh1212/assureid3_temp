import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CompanyProfile }from '/imports/AssureID/company/profile/api/companyProfile.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class ChangePassword extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      'assureid'     : '',
      'currentPassword' : '',
      'newPassword'     : '',
      'reenterPassword' : '',
       "subscription" : { 
      } 
    };
   this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps() {
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   // event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    // console.log(target + '||' + value + '||' + name);
  
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
 
  // change password
  changepassword(event) {
    event.preventDefault();
    if($("#changePassword").valid()){
      var currentPassword = this.refs.currentPassword.value;
      var newPassword     = this.refs.newPassword.value;
      var reenterPassword = this.refs.reenterPassword.value;
      var newID           = Meteor.userId();
          //Check password is at least 6 chars long
      
      if (newPassword == "company123" || reenterPassword == "company123") {
        // swal("Invalid password","Not allowed to set the password to system","error")
        swal({
          title:'abc',
          text: "Invalid password",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#666',
          confirmButtonText: 'Ok'
        })
      }else{
        var isValidPassword = function(password, reenterPassword) {
          if (newPassword === reenterPassword) {
            return newPassword.length >= 6 ? true : swal({
              title: "abc",
              text: "Password should be at least 6 characters long, Please try again!",
              timer: 1700,
              showConfirmButton: false,
              confirmButtonColor: '#666',
              type: "error"
            }); 
          }else{
            return swal({
              title: "abc",
              text: 'Password does not match, Please try again!',
              showConfirmButton: true,
              showCancelButton: false,
              confirmButtonColor: '#666',
              type: 'error'
            }); //End of error swal
          } //End of else
        }
        if (isValidPassword(newPassword,reenterPassword)) { 
          Meteor.call("resetPasswordUsingotp",newID, newPassword, function(err) {
            if (err) {
              
            }else {
              Meteor.logout();
              FlowRouter.go('/'); 
              
              swal({
                title:'abc',
                text: "Password has been changed successfully!!",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#666',
                confirmButtonText: 'Ok'
              });

            }
          });         
        }
        return false;
      }
    }else{
      $(event.target).find('.effect-21.error:first').focus();
      $(event.target).find('.effect-21.error').addClass('has-content');
    }
      
  }
  render(){ 
      return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerwrapperChnagepass"> 
          <div className="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 innerwrapperChnagepass companySettingsMargins">
             <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/>
              <h2>Change Password</h2>
            </div>
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
              <form id="changePassword" onSubmit={this.changepassword.bind(this)}>
                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                  <div className="input-effect input-group">
                    <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                    <input type="password" className="effect-21 form-control loginInputs" ref="currentPassword" onBlur={this.inputEffect.bind(this)} name="currentPassword" title="Password should be at least 6 characters long." pattern=".{6,}" required/>
                    <label>Current Password<span className="astrikReq">*</span></label>
                    <span className="focus-border">
                      <i></i>
                    </span>
                  </div>
                </div> 
                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                  <div className="input-effect input-group">
                    <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                    <input type="password" className="effect-21 form-control loginInputs" ref="newPassword" onBlur={this.inputEffect.bind(this)} name="newPassword" title="Password should be at least 6 characters long." pattern=".{6,}" required/>
                    <label>New Password<span className="astrikReq">*</span></label>
                    <span className="focus-border">
                      <i></i>
                    </span>
                  </div>
                </div> 
                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                  <div className="input-effect input-group">
                    <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                    <input type="password" className="effect-21 form-control loginInputs" ref="reenterPassword" onBlur={this.inputEffect.bind(this)} name="reenterPassword" title="Password should be at least 6 characters long." pattern=".{6,}" required/>
                    <label>Re-enter Password<span className="astrikReq">*</span></label>
                    <span className="focus-border">
                      <i></i>
                    </span>
                  </div>
                </div> 
                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                   <button type="submit" className="btn btn-info  col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn">Submit</button>
                </div>
            </form>
            </div>
          </div>               
        </div>
      );
  }
}