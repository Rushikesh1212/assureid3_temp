import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { CompanySettings } from '../api/CompanySettingMaster.js';
import {withTracker} from 'meteor/react-meteor-data';

import CompanyBankList from './CompanyBankList.jsx';
import CompanySettingIndicators from './companySettingIndicators.jsx';


class CompanyBankDetails extends TrackerReact(Component){

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
	    accHolderName  : this.props.accHolderName,
	    bankName       : this.props.bankName,
	    branchName     : this.props.branchName,
	    accNumber      : this.props.accNumber,
	    ifscCode       : this.props.ifscCode,
	    subscription : {
	        "companyData" : Meteor.subscribe('companyData'),
	      }

	  };

	    this.handleChange = this.handleChange.bind(this);
	}
  componentDidMount(){
          // console.log("hi");
    $.validator.addMethod("regCx1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter valid bank IFSC code");
    $.validator.addMethod("regxCx2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain alphanumeric and some special character.");

    $.validator.addMethod("regxCx3", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter valid bank account number.");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
     $("#bankDetailForm").validate({
        rules: {
          accHolderName: {
            required: true,
            regxCx2 :/^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/[]]+$|^$/
          },
          bankName : {
            required: true,
            regxCx2 :/^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/[]]+$|^$/
          },
          branchName : {
            required: true,
            regxCx2 :/^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/[]]+$|^$/
          },
          accNumber : {
            required: true,
            regxCx3 : /[0-9]{9,18}/
          }, 
          ifscCode : {
            required: true,
            regCx1 : /^[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/
          }, 
        },
         errorPlacement: function(error, element) {
          error.appendTo(element.parent().parent(".form-group"));
        }
    });

  }

  componentWillReceiveProps(nextProps) {
  	if(!nextProps.loading){
      if(nextProps.post.bankDetails){
	    this.setState({
	        accHolderName : nextProps.post.accHolderName,
	        bankName   	  : nextProps.post.bankName,
	        branchName    : nextProps.post.branchName,
	        accNumber     : nextProps.post.accNumber,
	        ifscCode      : nextProps.post.ifscCode,

	    })
	  }
	}

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    }

  submitBankDetail(event){
    event.preventDefault();
    var sessionVar = Session.get('bankDetail');
    if ($('#bankDetailForm').valid()) {
       if(sessionVar){
      var companyBankDetailsFormValue ={

        accHolderName  : $(".accHolderName").val(),
        bankName       : $(".bankName").val(),
        branchName     : $(".branchName").val(),
        accNumber      : $(".accNumber").val(),
        ifscCode       : $(".ifscCode").val(),

     }//close array

      Meteor.call('updateBankDetails', companyBankDetailsFormValue,
              function(error, result){
                if(error){
                  console.log(error);
                }else{

                  swal('Bank Details Updated Successfully!');
                  Session.set('bankDetail','');
                  if ($(".bankDetails").text("Update"))
                  {     
                    $(".bankDetails").html("Submit");
                  }
                  $('.ifscCode').prop('disabled', false);
                  $('#bankDetailForm').find('input').val('');
                }
              }
      );

    }else{
      var companyBankDetailsFormValue ={

        accHolderName  : $(".accHolderName").val(),
        bankName       : $(".bankName").val(),
        branchName     : $(".branchName").val(),
        accNumber      : $(".accNumber").val(),
        ifscCode       : $(".ifscCode").val(),

     }//close array

      Meteor.call('insertCompanyBankDetails', companyBankDetailsFormValue,
              function(error, result){
                if(error){
                  console.log(error);
                }else{
                  swal('Bank Details Added Successfully!');
                  $(".accHolderName").val('');
                  $(".bankName").val('');
                  $(".branchName").val('');
                  $(".accNumber").val('');
                  $(".ifscCode").val('');
                }
              }
      );
    }
    }
    


  }


  companyBankData(){
    var companyData = CompanySettings.findOne({"companyId" : 1});
    var companyarray = [];
    if(companyData){
      if(companyData.bankDetails){
        for(var i=0;i<companyData.bankDetails.length;i++){
          companyarray.push({
            'accHolderName' : companyData.bankDetails[i].accHolderName,
            'bankName'      : companyData.bankDetails[i].bankName,
            'branchName'    : companyData.bankDetails[i].branchName,
            'accNumber'     : companyData.bankDetails[i].accNumber,
            'ifscCode'      : companyData.bankDetails[i].ifscCode,
            'index'         : i,
            '_id'           : companyData._id,
          })
        }//i
      }
    }//companyData
    return companyarray;
  }

  render(){

  	return(

  		<section className="NotificationContent">
        <div className="">
          <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <div className="box box-default">
              <div className="box-header with-border">
              <h3 className="box-title">BANK DETAILS</h3> 
              </div>

            <div className="box-body">
            <form id="bankDetailForm" className="bankDetailForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                   <span className="input-group-addon ipAddons"><i className="fa fa-user" aria-hidden="true"></i></span>
                   <input value={this.state.accHolderName} onChange={this.handleChange} type="text" placeholder="Enter Account Holder Name" name="accHolderName" className="form-control accHolderName inputValid" required/>
                  </div>
                </div>
                   
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                    <span className="input-group-addon ipAddons"><i className="fa fa-university" aria-hidden="true"></i></span>
                    <input value={this.state.bankName} onChange={this.handleChange} type="text" placeholder="Enter Bank Name" name="bankName" className="form-control bankName inputValid" required/>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                 <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-university" aria-hidden="true"></i></span>
                     <input value={this.state.branchName} onChange={this.handleChange} type="text" placeholder="Enter Branch Name" name="branchName" className="form-control branchName inputValid" required/>
                  </div>
                </div>
                 <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                   <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-address-card-o" aria-hidden="true"></i></span>
                     <input value={this.state.accNumber} onChange={this.handleChange} type="number" placeholder="Enter Account Number" name="accNumber" className="form-control accNumber inputValid" minLength="9" maxLength="18" required/>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
                 <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12 noFloat">
                   <div className="input-group">
      	             <span className="input-group-addon ipAddons"><i className="fa fa-globe" aria-hidden="true"></i></span>
                     <input value={this.state.ifscCode} onChange={this.handleChange} type="text" placeholder="Enter IFSC Code" name="ifscCode" className="form-control ifscCode inputValid" required pattern="[A-Za-z]{4}[a-zA-Z0-9]{7}" title="Please enter a valid IFSC Code."  disabled={this.state.isDisabled}/>
                   </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right bankDetails marginBottomDiv" onClick={this.submitBankDetail.bind(this)}>Submit</button>
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
                <th> Account Holder </th>
                <th> Bank Name </th>
                <th> Branch Name </th>
                <th> Account Number </th>
                <th> IFSC Code </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              { this.companyBankData().map( (bankData)=>{
                return <CompanyBankList key={bankData.index} companyBankDataVales={bankData}/>
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

 EditBankDetails = withTracker((props)=>{

    const postHandle = Meteor.subscribe('companyData');
    const post       = CompanySettings.findOne({})||{};
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    };
}) (CompanyBankDetails);

export default EditBankDetails;
