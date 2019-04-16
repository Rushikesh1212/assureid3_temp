import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
// import { UserProfile } from '/imports/website/forms/api/userProfile.js';
// import { CompanyProfile } from '/imports/website/companyForms/api/companyProfile.js';
import LogIn from '/imports/systemSecurity/login/components/LogIn.jsx';
// import '../../dashboard/notification/components/SendMailnNotification.jsx';

export default class WebsiteHeader extends TrackerReact(Component){
  constructor(){
    super(); 
    this.state ={  
      // "searchArray"  : [],
      "subscription" : {
        // "userData" : Meteor.subscribe("userData"), 
        // "serachData" : Meteor.subscribe("userfunction"),      
        // "userprofile" : Meteor.subscribe('userprofile',Meteor.userId()),           
      } 
    }
  }
  componentDidMount(){
    if(!Meteor.userId()){
      $('#outerLoginWrapper').show();
      $('#outerSignUpWrapper').hide();
      $('#CompanySignUpWrapper').hide();
      $('#OtpBlock').hide();
      $('#companyOtpBlock').hide();
      $('#DoHaveProfile').hide();
      $('#ForgotBlock').hide();
      $('#ResetBlock').hide();
      $('.modalContent').removeClass('addModalHeight');
    }
  }
  showLogInOnly(event){
    event.preventDefault();
    console.log('login');
    $('#outerLoginWrapper').show();
    $('#outerSignUpWrapper').hide();
    $('#CompanySignUpWrapper').hide();
    $('#OtpBlock').hide();
    $('#companyOtpBlock').hide();
    $('#DoHaveProfile').hide();
    $('#ForgotBlock').hide();
    $('#ResetBlock').hide();
    $('.modalContent').removeClass('addModalHeight');
  }
  render() {  
    return (
    	<div>
    	  <nav className="navbar navbar-inverse navbar-fixed-top navbarOuter">
	        <div className="container">
	            <div className="navbar-header">
	                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
	                    <span className="sr-only">Toggle navigation</span>
	                    <span className="icon-bar"></span>
	                    <span className="icon-bar"></span>
	                    <span className="icon-bar"></span>
	                </button>
	                <a className="navbar-brand navBarbrand" href="/"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/logo.png" className=""/></a>
	            </div>

	            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
	                <ul className="nav navbar-nav navbar-right navBarUl">
	                    <li><a href="/">HOME</a></li>
	                    <li><a href="/aboutUs">ABOUT</a></li>
						          <li className="dropdown">
	                        <a href="#" data-toggle="dropdown" className="dropdown-toggle">SERVICES <b className="caret"></b></a>
	                        <ul className="dropdown-menu servicesDropdown">
	                            <li><a href="/services/identityVerification">IDENTITY VERIFICATION </a></li>
	                            <li><a href="/services/financialVerification">FINANCIAL VERIFICATION </a></li>                           
	                            <li><a href="/services/tenancy">TENANCY </a></li>                           
	                            <li><a href="/services/internationalVerification">INTERNATIONAL VERIFICATIONS</a></li>                           
	                            <li><a href="/services/legal">LEGAL</a></li>                           
	                            <li><a href="/services/professionalVerification">PROFESSIONAL VERIFICATION </a></li>                           
	                            <li><a href="/services/insurance">INSURANCE </a></li>                           
	                            <li><a href="/services/corporateVerification">CORPROATE VERIFICATION </a></li>                           
	                        </ul>
	                    </li>
	                    <li><a href="/contact">CONTACT </a></li>
	                    <li><a data-toggle="modal" data-target="#loginModal" href="#" onClick={this.showLogInOnly.bind(this)}>SIGN IN  </a></li>
	                </ul>
	            </div>
	        </div>
		    </nav>
{/*		    <LogIn />
*/}    	</div>
    );
  }
}