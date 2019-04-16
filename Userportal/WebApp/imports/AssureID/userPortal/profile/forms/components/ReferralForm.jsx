import React, {Component} from 'react';
import {render}        from 'react-dom';
import TrackerReact    from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";

export default class ReferralForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.referralValues){
      this.state ={  
       "referralFirstName"              : this.props.referralValues.referralFirstName,
       "referralLastName"               : this.props.referralValues.referralLastName,
       "referralMobileNum"              : this.props.referralValues.referralMobileNum,
       "referralEmailID"                : this.props.referralValues.referralEmailID,
       "referralOrganization"           : this.props.referralValues.referralOrganization,
       "referralDesignation"            : this.props.referralValues.referralDesignation,
       "referralRelationship"           : this.props.referralValues.referralRelationship,
       "referralAssociatedSinceMonths"  : this.props.referralValues.referralAssociatedSinceMonths,
       "editStatus"                     : this.props.referralValues.editStatus,
       "referenceId"                    : this.props.referralValues.referenceId,
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
	    this.state ={
	      "referralFirstName"					    : '',
	      "referralLastName"    			    : '',
	      "referralMobileNum"    			    : '',
	      "referralEmailID"	    			    : '',
	      "referralOrganization"				  : '',
	      "referralDesignation"    			  : '',
	      "referralRelationship"   			  : '', 
	      "referralAssociatedSinceMonths" : '',
	      "subscription" : { 

	      }
     };
    }
    this.handleChange = this.handleChange.bind(this);
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
  
  componentDidMount(){    
   $.validator.addMethod("regx1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");

    $.validator.addMethod("regx2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid email address.");

    $.validator.addMethod("regx3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid mobile number.");
    $.validator.addMethod("regx4", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "It should only contain letters and numbers.");
          
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
  
    $("#referralForm").validate({
      rules: {
        referralFirstName: {
           required: true,
            regx1: /^[a-zA-Z ]+$/,
        },
        referralLastName: {
        	required:true,
          regx1: /^[a-zA-Z ]+$/,
        },
        referralMobileNum: {
          required:true,
          regx3: /^([0]|\+91)?[789]\d{9}$/,
        },
        referralEmailID: {
          required:true,
          regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        },
        referralOrganization: {
          regx4: /^[a-zA-Z0-9 ]+$/,
        },
        referralDesignation: {
          regx1: /^[a-zA-Z ]+$/,
        },
        referralRelationship: { 
          regx1: /^[a-zA-Z ]+$/,
        }
      }
    });
   
  }
  submitrefernceInfo(event){
    event.preventDefault();
    if($('#referralForm').valid()){ 
      var id   = Meteor.userId();
      
      var reference = {
        "referralFirstName"					    : (this.refs.referralFirstName.value).trim(),
				"referralLastName"    			    : (this.refs.referralLastName.value).trim(),
				"referralMobileNum"    			    : (this.refs.referralMobileNum.value).trim(),
				"referralEmailID"	    			    : (this.refs.referralEmailID.value).trim(),
				"referralOrganization"				  : (this.refs.referralOrganization.value).trim(),
				"referralDesignation"    			  : (this.refs.referralDesignation.value).trim(),
				"referralRelationship"   			  : (this.refs.referralRelationship.value).trim(), 
				"referralAssociatedSinceMonths" : (this.refs.referralAssociatedSinceMonths.value).trim(),
        "verifiedStatus"                : "Not Verified",
        "editStatus"                    : "Open"
      }

      Meteor.call('insertReference',id,reference,function (error,result) {
       if(error){
          console.log(error.reason);
        }else{
        	
          $("#referralForm").find('.effect-21').removeClass('has-content');
          if($('#reference').hasClass('in active')){
          }else{
            $('#addreferenceinfo').modal('hide');
          } 
        }
      });
      this.setState({
        "referralFirstName"					    : '',
	      "referralLastName"    			    : '',
	      "referralMobileNum"    			    : '',
	      "referralEmailID"	    			    : '',
	      "referralOrganization"				  : '',
	      "referralDesignation"    			  : '',
	      "referralRelationship"   			  : '', 
	      "referralAssociatedSinceMonths" : '',
      });  
    } else{
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    }
  }
  editreferenceInfo(event){
  	event.preventDefault();
    var id          = Meteor.userId();
    var index       = $(event.target).attr('data-index');
    var referenceId = parseInt(this.state.referenceId);
    var reference = {
      "referralFirstName"					    : (this.refs.referralFirstName.value).trim(),
			"referralLastName"    			    : (this.refs.referralLastName.value).trim(),
			"referralMobileNum"    			    : (this.refs.referralMobileNum.value).trim(),
			"referralEmailID"	    			    : (this.refs.referralEmailID.value).trim(),
			"referralOrganization"				  : (this.refs.referralOrganization.value).trim(),
			"referralDesignation"    			  : (this.refs.referralDesignation.value).trim(),
			"referralRelationship"   			  : (this.refs.referralRelationship.value).trim(), 
			"referralAssociatedSinceMonths" : (this.refs.referralAssociatedSinceMonths.value).trim(),      
    }
    if (referenceId) {
      Meteor.call("updateReference",id,reference,referenceId,(error,result)=>{
      	if (error) {
           swal({
            title:'abc',
            text: "Something went wrong!",
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#666',
            // cancelButtonColor:'#d33',
            confirmButtonText: 'Ok'
          })
      	}else{
      	   $('#referenceModal-'+index).modal('hide');
      	   $('#editreferenceModal-'+index).modal('hide');
      	}
      });
    }else{
    	 swal({
          title:'abc',
          text: "Something went wrong!",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#666',
          // cancelButtonColor:'#d33',
          confirmButtonText: 'Ok'
        })
    }

  }
 
  render(){
    return(
      <div>
        <form className="referralForm basicForm" id="referralForm">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userAddress">
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.referralFirstName != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralFirstName} id="referralFirstName" name="referralFirstName" ref="referralFirstName" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Referral First Name<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.referralLastName != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralLastName} id="referralLastName" name="referralLastName" ref="referralLastName" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Referral Last Name<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                <input type="text" className={this.state.referralMobileNum != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralMobileNum} id="referralMobileNum" name="referralMobileNum" ref="referralMobileNum" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Referral Mobile Number<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                <input type="text" className={this.state.referralEmailID != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralEmailID} id="referralEmailID" name="referralEmailID" ref="referralEmailID" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Referral Email Id<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div>
            <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-building" aria-hidden="true"></i></span>
                <input type="text" className={this.state.referralOrganization != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralOrganization} id="referralOrganization" name="referralOrganization" ref="referralOrganization" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Organization</label>
                <span className="focus-border">
                  <i></i>
                </span> 
              </div>
            </div>
            <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                <input type="text"className={this.state.referralDesignation != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralDesignation} id="referralDesignation" name="referralDesignation" ref="referralDesignation" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} />
                <label>Designation</label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div> 
             <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.referralRelationship != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralRelationship} id="referralRelationship" name="referralRelationship" ref="referralRelationship"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Relationship</label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div>
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
              <div className="input-effect input-group">  
                <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                <input type="number" className={this.state.referralAssociatedSinceMonths != '' ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} value={this.state.referralAssociatedSinceMonths} id="referralAssociatedSinceMonths" name="referralAssociatedSinceMonths" ref="referralAssociatedSinceMonths"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Associated Since Months<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span>
              </div>
            </div>         
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            <button type="submit" className="btn btn-info  pull-right" data-index={this.props.indexVal} onClick={this.props.referralValues ? this.editreferenceInfo.bind(this) : this.submitrefernceInfo.bind(this)}>Save</button>
          </div>
        </form>
      </div>
    );
  }
}