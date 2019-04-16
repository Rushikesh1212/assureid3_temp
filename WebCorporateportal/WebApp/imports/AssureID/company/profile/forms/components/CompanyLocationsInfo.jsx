import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { UserProfile } from "/imports/AssureID/user/api/userProfile.js";
import { CompanyProfile } from "/imports/AssureID/company/profile/api/companyProfile.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
export default class CompanyLocationsInfo extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.companyLocationsValues){
      this.state ={
        "companyLocationId"   : this.props.companyLocationsValues.companyLocationId,
        "locationType"        : this.props.companyLocationsValues.locationType, 
        "companyLine1"        : this.props.companyLocationsValues.companyLine1,
        "companyLine2"        : this.props.companyLocationsValues.companyLine2,
        "companyCountry"      : this.props.companyLocationsValues.companyCountry,
        "companyState"        : this.props.companyLocationsValues.companyState,
        "companyCity"         : this.props.companyLocationsValues.companyCity,
        // "companyArea"         : this.props.companyLocationsValues.companyArea,
        "companyPincode"      : this.props.companyLocationsValues.companyPincode,
        "companyIncharge"     : this.props.companyLocationsValues.companyIncharge,
        "subscription" : { 
        } 
      };
    }else{
      this.state ={ 
        "companyLocationId"   : '',
        "locationType"        : '',
        "companyLine1"        : '',
        "companyLine2"        : '',
        "companyCountry"      : '',
        "companyState"        : '', 
        "companyCity"         : '',
        // "companyArea"         : '',
        "companyPincode"      : '',
        "companyIncharge"     : '',
        "subscription" : { 
        } 
      };
    }    
   this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps() {
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
  
    this.setState({
      [name]: event.target.value,
    });
  }
  componentDidMount(){
    $.validator.addMethod("regxCA1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");
    $.validator.addMethod("regxCA2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid pincode.");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    }); 

    if(this.props.companyLocationAdd){
      var validId = 'companyLocationAdd';        
    }else if(this.props.companyLocationsValues){
      if(this.props.companyLocationEdit){
        var validId = 'companyLocationEdit'+this.props.indexVal;
      }else{
        var validId = 'companyLocationFormEdit'+this.props.indexVal;
      }
    }else{
      var validId = 'companyLocationForm';
    }
  
    $("#"+validId).validate({
      rules: {
        locationType: { 
          regxCA1: /^[a-zA-Z ]+$|^$/,
        },
        companyCity: {
          regxCA1: /^[a-zA-Z ]+$|^$/,
        },
        companyState: {
          regxCA1: /^[a-zA-Z ]+$|^$/,
        },
        companyCountry: {
          regxCA1: /^[a-zA-Z ]+$|^$/,
        },
        companyPincode: {
          required:true,
          regxCA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
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
  editCompanyInfo(event){
    event.preventDefault();
    var companyId = this.props.id;
    var companyLocationId = parseInt($(event.currentTarget).attr('id'));
    var index   =  $(event.currentTarget).attr('data-index')
    
    if(this.props.companyLocationEdit){
      var validId = 'companyLocationEdit'+this.props.indexVal;
    }else{
      var validId = 'companyLocationFormEdit'+this.props.indexVal;
    }

    if($('#'+validId).valid()){
      var companyLocations = {
        "locationType"        : this.refs.locationType.value,
        "companyLine1"        : this.refs.companyLine1.value,
        "companyLine2"        : this.refs.companyLine2.value,
        "companyCountry"      : this.refs.companyCountry.value,
        "companyState"        : this.refs.companyState.value,
        "companyCity"         : this.refs.companyCity.value,
        // "companyArea"         : this.refs.companyArea.value,
        "companyPincode"      : this.refs.companyPincode.value,
        "companyIncharge"     : this.refs.companyIncharge.value,
      }
      Meteor.call('editCompanyLocation',companyId,companyLocationId,companyLocations,function(error,result){
        if (error) {
          
        }else{
          $('#editlocationModal-'+index).modal('hide');
          $('#editlocationModalAtView-'+index).modal('hide');
          
        }
      });
    }else{
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    }
  }
  companyLocationForm(event){
    event.preventDefault();
    var currentLocation = FlowRouter.current().path;
    var splitUrl = currentLocation.split('/');
    var assureid =  splitUrl[3];
  
    if(this.props.companyLocationAdd){
      var validId = 'companyLocationAdd';
    }else{
      var validId = 'companyLocationForm';
    }

    if($('#'+validId).valid()){
      var companyLocationObj = CompanyProfile.findOne({"companyAssureID": assureid}, {sort: {'companyLocations.companyLocationId': -1}});
      if(companyLocationObj){
        if (companyLocationObj.companyLocations) {
          if (companyLocationObj.companyLocations.length > 0) {
             var lastelem           = _.last(companyLocationObj.companyLocations);
             var companyLocationId =  parseInt(lastelem.companyLocationId) + 1;
          }else{
            var companyLocationId =  1;
          }
        }
        else{
          var companyLocationId =  1;
        }
      }

      var userProfileObj = UserProfile.findOne({'assureId':this.refs.companyIncharge.value});
      if(userProfileObj){
        var companyIncharge = userProfileObj.firstName+' '+userProfileObj.lastName;
      }else{
        var companyIncharge = '';
      }

      var companyLocations = {
          "companyLocationId"   : parseInt(companyLocationId),
          "locationType"        : this.refs.locationType.value,
          "companyLine1"        : this.refs.companyLine1.value,
          "companyLine2"        : this.refs.companyLine2.value,
          "companyCountry"      : this.refs.companyCountry.value,
          "companyState"        : this.refs.companyState.value,
          "companyCity"         : this.refs.companyCity.value,
          // "companyArea"         : this.refs.companyArea.value,
          "companyPincode"      : this.refs.companyPincode.value,
          "companyIncharge"     : companyIncharge,
      }
      if(companyLocationObj){
        Meteor.call('addCompanyLocation',assureid,companyLocations,function(error,result){
          if (error) {
            
          }else{
            $('#addLocationModal').modal('hide');
          }
        });
        this.setState({
          "locationType"        : '',
          "companyLine1"        : '',
          "companyLine2"        : '',
          "companyCountry"      : '',
          "companyState"        : '',
          "companyCity"         : '',
          // "companyArea"         : '',
          "companyPincode"      : '',
          "companyIncharge"     : '',
        });
      }else{
        // swal('Please add company basic information first.');
        swal({
          title:'abc',
          text: "Please add company basic information first!",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#666',
          // cancelButtonColor:'#d33',
          confirmButtonText: 'Ok'
        })
      }
    }else{
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    }
  }

  render(){
    return (
      <form className="companyLocationForm basicForm" id={this.props.companyLocationAdd ? "companyLocationAdd" : this.props.companyLocationsValues ? this.props.companyLocationEdit ? "companyLocationEdit"+this.props.indexVal : "companyLocationFormEdit"+this.props.indexVal : "companyLocationForm"}>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">
              <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              {/* <select className={this.state.locationType ? this.state.locationType != '-- Select --' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="locationType" name="locationType" ref="locationType" defaultValue={this.state.locationType ? this.state.locationType : "-- Select --"} onBlur={this.inputEffect.bind(this)}>
                <option disabled="disabled">-- Select --</option>
                <option>Head Office</option>
                <option>Branch Office</option>
              </select>*/}
              <input type="text" className={this.state.locationType =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="locationType" name="locationType" ref="locationType"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.locationType}/>
              <label>Location Type</label>
              <span className="focus-border"> 
                <i></i>
              </span>
            </div>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyLine1 =='' ? "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs has-content required"} id="companyLine1" name="companyLine1" ref="companyLine1"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyLine1}/>
            <label>Address Line 1<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span> 
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyLine2 =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyLine2" name="companyLine2" ref="companyLine2"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyLine2}/>
            <label>Address Line 2</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyCountry =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyCountry" name="companyCountry" ref="companyCountry"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyCountry}/>
            <label>Country</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyState =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyState" name="companyState" ref="companyState"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyState}/>
            <label>State</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyCity =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyCity" name="companyCity" ref="companyCity"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyCity}/>
            <label>City</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div> 
        {/*<div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-phone" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyArea =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyArea" name="companyArea" ref="companyArea"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyArea}/>
            <label>Area</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>*/} 
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyPincode =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyPincode" name="companyPincode" ref="companyPincode"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyPincode}/>
            <label>Pincode<span className="astrikReq">*</span></label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div> 
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.companyIncharge =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="companyIncharge" name="companyIncharge" ref="companyIncharge"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.companyIncharge}/>
            <label>Location Incharge(e.g. 'IN-AAA-000000' or 'John Deo')</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-info pull-right" data-index={this.props.indexVal} id={this.state.companyLocationId} onClick={this.props.companyLocationsValues ? this.editCompanyInfo.bind(this) : this.companyLocationForm.bind(this)}>Save</button>           
      </form>
    );
  }
}