import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { CompanySettings } from '../api/CompanySettingMaster.js';
import {withTracker} from 'meteor/react-meteor-data';

import CompanyTaxList from './CompanyTaxList.jsx';
import CompanySettingIndicators from './companySettingIndicators.jsx';

class CompanyTaxDetails extends TrackerReact(Component){

  componentDidMount(){
    $('.companyTaxDetails').addClass('divActive');
     jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
     $("#companyTaxForm").validate({
        rules: {
          taxType: {
            required: true,
          },
          applicableTax : {
            required: true,
          },
          effectiveFrom : {
            required: true,
          },
        },
        messages: {
          taxType: {
            required: "Please enter tax type",
          },
         applicableTax: {
            required: "Please enter tax",
          },
         effectiveFrom: {
            required: "Please enter date from the tax will be effective",
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
	    taxType        : this.props.taxType,
	    applicableTax  : this.props.applicableTax,
	    effectiveFrom  : this.props.effectiveFrom,

	    subscription : {
	        "companyData" : Meteor.subscribe('companyData'),
	      }

	  };

	    this.handleChange = this.handleChange.bind(this);
	}

  componentWillReceiveProps(nextProps) {
    this.setState({
        taxType       : nextProps.post.taxType,
        applicableTax : nextProps.post.applicableTax,
        effectiveFrom : nextProps.post.effectiveFrom,
    })

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    }

  companyTaxData(){
  	var companyData = CompanySettings.findOne({"companyId" : 1});
  	var companyarray = [];
  	if(companyData){
  		if(companyData.taxSettings){
  			for(var i=0;i<companyData.taxSettings.length;i++){
  				companyarray.push({
  					'taxType'        : companyData.taxSettings[i].taxType,
  					'applicableTax'  : companyData.taxSettings[i].applicableTax,
            'effectiveFrom'  : companyData.taxSettings[i].effectiveFrom,
  					'effectiveTo'    : companyData.taxSettings[i].effectiveTo,
  					'index'			     : i,
  					'_id'			       : companyData._id,
  				})
  			}//i
  		}
  	}//companyData
  	return companyarray;
  }

  dateRestrict(){
    var dtToday = new Date();
    
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if(month < 10){      
      month = '0' + month.toString();
    }
    if(day < 10){
      day = '0' + day.toString();
    }
    
    var maxDate = year + '-' + month + '-' + day;
    // console.log(maxDate);
    return maxDate;
  }

  submitCompanyTax(event){
    event.preventDefault();
    var sessionVar = Session.get('taxType');
    var targetedID = Session.get('targetedID');

    var taxSettingsFormValue ={

    	taxType       : $(".taxType").val(),
      applicableTax : $(".applicableTax").val(),
      effectiveFrom : $(".effectiveFrom").val(),

     }//close array
    if ($("#companyTaxForm").valid()) {
      if(sessionVar){
        Meteor.call('updatetaxSettings', taxSettingsFormValue,targetedID,
              function(error, result){
                if(error){
                  console.log(error);
                }else{

                  swal('Tax Details Updated!');
                  $('.taxType').prop('disabled', false);
                  $(".taxType").val('');
                  $(".applicableTax").val('');
                  $(".effectiveFrom").val('');
                  if($(".companyTaxSubmit").text("Update")){     
                    $(".companyTaxSubmit").html("Submit");
                  }
                  Session.set('taxType','');
                  Session.set('targetedID','');
                }
              }
        );
     }else{
      Meteor.call('insertTaxSettings', taxSettingsFormValue,
              function(error, result){
                if(error){
                  console.log(error);
                }else{

                  swal('Tax Details Added!');
                  $(".taxType").val('');
                  $(".applicableTax").val('');
                  $(".effectiveFrom").val('');
                }
              }
      );
     }
    }
     
  }

  render(){

  	return(

  		<section className="NotificationContent">
        <div className="">
          <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 ">
            <div className="box box-default">
            <div className="box-header with-border">
            <h3 className="box-title">TAX DETAILS</h3>
            </div>

            <div className="box-body">
            <form id="companyTaxForm" className="companyTaxForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                   <span className="input-group-addon ipAddons"><i className="fa fa-usd" aria-hidden="true"></i></span>
                   <input value={this.state.taxType} onChange={this.handleChange} type="text" placeholder="Enter Tax Type" name="taxType" className="form-control taxType inputValid" pattern="[a-zA-Z ]*" title="Only alphabetic values are allowed." />
                  </div>
                </div>

                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                    <span className="input-group-addon ipAddons"><i className="fa fa-money" aria-hidden="true"></i></span>
                    <input value={this.state.applicableTax} onChange={this.handleChange} type="number" placeholder="Enter Tax Rate(%)" name="applicableTax" className="form-control applicableTax inputValid" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12 noFloat">
                  <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
                     <input value={this.state.effectiveFrom} onChange={this.handleChange} type="date"  name="effectiveFrom" className="form-control effectiveFrom inputValid" min={this.dateRestrict()} />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right companyTaxSubmit marginBottomDiv" onClick={this.submitCompanyTax.bind(this)}>Submit</button>
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
    						<th> Tax Type </th>
    						<th> Applicable Tax </th>
                <th> Effective From </th>
    						<th> Effective To </th>
    						<th> Action </th>
    					</tr>
    				</thead>
    				<tbody>
    					{ this.companyTaxData().map( (taxData)=>{
    						return <CompanyTaxList key={taxData.index} companyTaxDataVales={taxData}/>
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

 EditCompanyTaxDetails = withTracker((props)=>{

    const postHandle = Meteor.subscribe('companyData');
    const post       = CompanySettings.findOne({})||{};
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    };
}) (CompanyTaxDetails);

export default EditCompanyTaxDetails;
