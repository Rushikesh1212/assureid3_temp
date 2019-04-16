import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

 
export default class EmployementCompanyDetails extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      'typeOfOwnersip' : '',
      'cinNo'          : '',
      'registeringIn'  : '',
       'siteVisit'     : '',
       'currentStatus' : '',
       'pastAberrations' : '',

      "subscription" : { 
      } 
    };
    this.handleChange          = this.handleChange.bind(this);

  }
  componentDidMount(){   
    $.validator.addMethod("regCx1", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid CIN number (L27100MH2015PTC000260).");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });   
     $("#employementInfoForm").validate({
      rules: {
        cinNo : {
          required: true,          
          regCx1:  /^([LU]{1}\d{5}[A-Z]{2}\d{4}[PLCT]{3}\d{6})$/,
        },
      },
    });  
  }
  handleChange(event){
    event.preventDefault();

    const target = event.target;
    const name   = target.name; 
    this.setState({
     [name]: event.target.value,
    });
  }
  getRole(role) {
      return role != "backofficestaff";
  }
  submitCompanyDetails(event){
    event.preventDefault();
    if($('#employementInfoForm').valid()){
      var companyDetails = {
         'typeOfOwnersip' : this.refs.typeOfOwnersip.value,
         'cinNo'          : this.refs.cinNo.value,
         'registeringIn'  : this.refs.registeringIn.value,
         'siteVisit'      : this.refs.siteVisit.value,
         'currentStatus'  : this.refs.currentStatus.value,
         'pastAberrations': this.refs.pastAberrations.value,
      };
      var insertData = {
        "userId"              : Meteor.userId(),
        "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
        "role"                : Meteor.user().roles.find(this.getRole),
        "roleStatus"          : 'VerificationPass-CompanyInfo',
        "msg"                 : 'Submited Company Details',
        "createdAt"           : new Date(),
        "allocatedToUserid"   : '',
        "allocatedToUserName"  : '',
        "companyDetails"      : companyDetails,
      };      
      Meteor.call('genericUpdateTicketMasterElement',this.props.ticketId,insertData,function(error,result) {
        if (error) {
          
        }else{
          
        }
      });
    }
  }
  render(){
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
         {/*http://localhost:3002/admin/ticket/qmQmswWSvrkxghXuM*/} 
        <form id="employementInfoForm">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">Type of Ownership :<span className="starcolor">*</span> </div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <input type="text" name="typeOfOwnersip" ref="typeOfOwnersip" className="form-control" onChange={this.handleChange} required/>
              </div>
          </div>
           <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">CIN No. :<span className="starcolor">*</span></div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <input type="text" name="cinNo" ref="cinNo" className="form-control" onChange={this.handleChange}/>
              </div>
          </div>
           <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">Registration In. :<span className="starcolor">*</span></div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <input type="text" name="registeringIn" ref="registeringIn" className="form-control" onChange={this.handleChange} required/>
              </div>
          </div>
           <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">Site Visit :<span className="starcolor">*</span></div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <input type="text" name="siteVisit" ref="siteVisit" className="form-control" onChange={this.handleChange} required/>
              </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">Current Status :<span className="starcolor">*</span></div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <input type="text" name="currentStatus" ref="currentStatus" className="form-control" onChange={this.handleChange} required/>
              </div>
          </div>
           <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">Past Aberrations :<span className="starcolor">*</span></div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <input type="text" name="pastAberrations" ref="pastAberrations" className="form-control" onChange={this.handleChange} required/>
              </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
            <button type="button" className="btn btn-primary col-lg-2 col-lg-offset-5 col-md-2 col-md-offset-5 col-sm-12 col-xs-12" onClick={this.submitCompanyDetails.bind(this)}>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}