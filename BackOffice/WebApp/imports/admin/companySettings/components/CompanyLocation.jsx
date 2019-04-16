import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { CompanySettings } from '../api/CompanySettingMaster.js';
import {withTracker} from 'meteor/react-meteor-data';

import CompanyInfoList from './CompanyInfoList.jsx';
import CompanySettingIndicators from './companySettingIndicators.jsx';


class CompanyLocation extends TrackerReact(Component){

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
    $('.CLcompanyAddress').prop('disabled', false);
    $("#companyLocationForm").validate({
      rules: { 
          CLcompanyLocation: { 
            required: true,
          },
          CLcompanyAddress : {
            required: true,
          },
          CLpincode : {
            required: true, 
            regxCA2: /^[1-9][0-9]{5}$|^$/,
          },
          CLcity: {
            required: true,
            regxCA1: /^[a-zA-Z ]+$|^$/,
          },
          CLstate : {
            required: true,
            regxCA1: /^[a-zA-Z ]+$|^$/,
          },
          CLcountry : {
            required: true,
            regxCA1: /^[a-zA-Z ]+$|^$/,
          },
        },
        errorPlacement: function(error, element) {
          error.appendTo(element.parent().parent(".form-group"));
        }
    });
  }

  handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    companyLocation      : this.props.companyLocation,
	    companyAddress       : this.props.companyAddress,
	    companyPincode       : this.props.companyPincode,
	    companyCity          : this.props.companyCity,
	    companyState         : this.props.companyState,
	    companyCountry       : this.props.companyCountry,
	    subscription : {
	        "companyData" : Meteor.subscribe('companyData'),
	      }

	  };

	    this.handleChange = this.handleChange.bind(this);
	}

  componentWillReceiveProps(nextProps) {
    this.setState({
        companyLocation     : nextProps.post.companyLocation,
        companyAddress   	  : nextProps.post.companyAddress,
        companyPincode   	  : nextProps.post.companyPincode,
        companyCity     	  : nextProps.post.companyCity,
        companyState     	  : nextProps.post.companyState,
        companyCountry     	: nextProps.post.companyCountry,

    })

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    }

  companyListData(){
  	var companyData = CompanySettings.findOne({"companyId" : 1});
  	var companyarray = [];
  	if(companyData){
  		if(companyData.companyLocationsInfo){
  			for(var i=1;i<companyData.companyLocationsInfo.length;i++){
  				companyarray.push({
  					'companyLocation' : companyData.companyLocationsInfo[i].companyLocation,
  					'companyAddress'  : companyData.companyLocationsInfo[i].companyAddress,
  					'companyPincode'  : companyData.companyLocationsInfo[i].companyPincode,
  					'companyCity'	    : companyData.companyLocationsInfo[i].companyCity,
  					'companyState'    : companyData.companyLocationsInfo[i].companyState,
  					'companyCountry'  : companyData.companyLocationsInfo[i].companyCountry,
  					'index'			      : i,
  					'_id'			        : companyData._id,
  				})
  			}//i
  		}
  	}//companyData
  	return companyarray;
  }

  submitCompanyLocation(event){
    event.preventDefault();
    var sessionVar = Session.get('location');

    var companyLocationFormValue ={

    	companyLocation      : $(".CLcompanyLocation").val(),
      companyAddress       : $(".CLcompanyAddress").val(),
      companyPincode       : $(".CLcompanyPincode").val(),
      companyCity          : $(".CLcompanyCity").val(),
      companyState         : $(".CLcompanyState").val(),
      companyCountry       : $(".CLcompanyCountry").val(),

     }//close array

    if(sessionVar){
      $(".compLocationBtn").prop('disabled', false);
    	Meteor.call('updateCompanyLocations', companyLocationFormValue,
        function(error, result){
          if(error){
            console.log(error);
          }else{

            swal('Company Address Updated Successfully!');
            $(".CLcompanyLocation").val('');
    		    $(".CLcompanyAddress").val('');
    		    $(".CLcompanyPincode").val('');
    		    $(".CLcompanyCity").val('');
     		    $(".CLcompanyState").val('');
    		    $(".CLcompanyCountry").val('');
            if ($(".compLocation").text("Update"))
                {     
                  $(".compLocation").html("Submit");
                }
            $('.CLcompanyAddress').prop('disabled', false);
            Session.set('location','');
          }
        }
	    );

    }else{
      console.log($('#companyLocationForm').valid());
    if($('#companyLocationForm').valid()){
	    Meteor.call('insertCompanyLocations', companyLocationFormValue,
	            function(error, result){
	              if(error){
	                console.log(error);
	              }else{

	                swal('Company Address Added Successfully!');
	                $(".CLcompanyLocation").val('');
	        		    $(".CLcompanyAddress").val('');
	        		    $(".CLcompanyPincode").val('');
	        		    $(".CLcompanyCity").val('');
	         		    $(".CLcompanyState").val('');
	        		    $(".CLcompanyCountry").val('');
	              }
	            }
	    );
    }
	  }

  }

  render(){
  	return(

      <section className="Content">
        {/*<div className="row">*/}
        <div className="">
          <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 ">
            <div className="box box-default">
            <div className="box-header with-border">
            <h3 className="box-title">COMPANY LOCATION</h3>
            </div>
 
            <div className="box-body">
            <form id="companyLocationForm" className="companyLocationForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                   <span className="input-group-addon ipAddons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                   <input value={this.state.companyLocation} onChange={this.handleChange} type="text" placeholder="Company Location" name="CLcompanyLocation" className="form-control CLcompanyLocation inputValid" required pattern="[a-zA-Z0-9 ]+" title="Only alphanumeric values are allowed" />
                  </div>
                </div>

                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                    <span className="input-group-addon ipAddons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                    <input value={this.state.companyAddress} onChange={this.handleChange} type="text" placeholder="Company Address" name="CLcompanyAddress" className="form-control CLcompanyAddress inputValid" required />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                 <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                  <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-address-card-o" aria-hidden="true"></i></span>
                     <input value={this.state.companyPincode} onChange={this.handleChange} type="number" placeholder="Pincode" name="CLpincode" className="form-control CLcompanyPincode inputValid" required pattern="[1-9][0-9]{5}" title="Please enter a valid pincode"/>
                  </div>
                </div>
                 <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                   <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-globe" aria-hidden="true"></i></span>
                     <input value={this.state.companyCity} onChange={this.handleChange} type="text" placeholder="City" name="CLcity" className="form-control CLcompanyCity inputValid" required pattern="[a-zA-Z ]*" title="Only alphabetic characters are allowed" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                 <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                   <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-globe" aria-hidden="true"></i></span>
                     <input value={this.state.companyState} onChange={this.handleChange} type="text" placeholder="State" name="CLstate" className="form-control CLcompanyState inputValid" required pattern="[a-zA-Z ]*" title="Only alphabetic characters are allowed"/>
                   </div>
                </div>
                <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                   <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-globe" aria-hidden="true"></i></span>
                     <input value={this.state.companyCountry} onChange={this.handleChange} type="text" placeholder="Country" name="CLcountry" className="form-control CLcompanyCountry inputValid" required pattern="[a-zA-Z ]*" title="Only alphabetic characters are allowed"/>
                    </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right compLocation compLocationBtn marginBottomDiv" onClick={this.submitCompanyLocation.bind(this)}>Submit</button>
              </div>
            </form>
            </div>
            </div>
          </div>
  		  </div>

  		  <div className="table-responsive col-lg-9 col-md-9 col-sm-12 col-xs-12">
			<table className="table table-bordered table-striped table-hover">
				<thead>
					<tr className="tableHeader">
						<th> Company Location </th>
						<th> Company Address </th>
						<th> Pincode </th>
						<th> City </th>
						<th> State </th>
						<th> Country </th>
						<th> Action </th>
					</tr>
				</thead>
				<tbody>
					{ this.companyListData().map( (locationData)=>{
						return <CompanyInfoList key={locationData.index} companyLocationDataVales={locationData}/>
					  })
					}
				</tbody>
			</table>
		  </div>



      {/*<div className="emptyDiv"></div>*/}
      </section>


  		);
  }

 }

 EditCompanyLocation = withTracker((props)=>{

    const postHandle = Meteor.subscribe('companyData');
    const post       = CompanySettings.findOne({})||{};
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    };
})(CompanyLocation);

export default EditCompanyLocation;
