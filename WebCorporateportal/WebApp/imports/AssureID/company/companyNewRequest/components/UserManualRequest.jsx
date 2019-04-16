import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {TempCorporateOrder} from '/imports/AssureID/company/companyNewRequest/api/TempCorporateOrder.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
import CandidateBulkUploadTable from './CandidateBulkUploadTable.jsx';

class UserManualRequest extends TrackerReact(Component) {
  constructor(props){
    super(props);  
    this.state ={ 
      "firstName" : '',
      "lastName"  : '',
      "emailId"   : '',
      "mobile"    : '',
      "aadharNo"  : '', 
      "gender"    : 'Female',
      "subscription" : {
      } 
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps() {
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){ 
   event.preventDefault();
    if($(event.target).hasClass('error')){
      $(event.target).addClass('has-content');  
    }
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
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
  componentDidMount() {
    $.validator.addMethod("regEC1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");
    $.validator.addMethod("regEC2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $.validator.addMethod("regEC3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid mobile number.");
    $.validator.addMethod("regEC4", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter an aadhar number in the format ex-1234 5678 9012.");
       
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
     
    $("#manualEmpVerif").validate({
      rules: {
        firstName: {
          required: true,
          regEC1: /^[a-zA-Z ]+$/,
        },
        lastName: {
          required: true,
          regEC1: /^[a-zA-Z ]+$/, 
        },
        mobile: {
          required: true,
          // regEC3: /^\+?\d+$/,
          regEC3:/^[6789]\d{9}$/,
        },
        emailId: {
          required: true,
          regEC2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
        },
        aadharNo: {
          // required: true,
          regEC4: /^\d{4}\s\d{4}\s\d{4}$|^$/,
        },
      }
    });
  }
  manualVerifForm(event){ 
    event.preventDefault();
    var listOfCandidate  = [];
    var manualformValues = {
      "candidateDetails" :{
        "candidateFirstName"   : this.refs.firstName.value.trim(),
        "candidateLastName"    : this.refs.lastName.value.trim(),
        "candidateEmailId"     : this.refs.emailId.value.trim(),
        "candidateMobile"      : this.refs.mobile.value.trim(),
        "candidateAadharNo"    : this.refs.aadharNo.value,
        "candidateGender"      : this.state.gender,
        "candidateVerificationStatus" : "New"
      }
    }
    // console.log("email Id :",this.refs.emailId.value);
    listOfCandidate.push(manualformValues);

      var formValue  = {
        companyAssureID  : this.props.assureId,
        services         : this.props.validServiceArray,
        contractId       : this.props.contractId,
        numOfCandidate   : 1, 
        listOfCandidates : listOfCandidate,
        url              : this.props.url, 
      }
      if($('#manualEmpVerif').valid()){
        Meteor.call('notaUser',this.refs.emailId.value.trim(),(err,res)=>{
          if(err){
            swal({
              title:'abc',
              text: err.reason,
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#666',
              confirmButtonText: 'Ok'
            });
          }else if (res){
            swal({
              title:'abc',
              text: "Same Email ID cannot double up as a user and staff due to conflict of interest!",
              type: 'error',
              showCancelButton: false,
              confirmButtonColor: '#666',
              confirmButtonText: 'Ok'
            });
          }else{
            if (this.props.tempcorporateOrder) {
              Meteor.call('updateTempCorporateOrderforManual',this.props.tempcorporateOrder._id,formValue);
            }else{
              Meteor.call("insertTempCorporateOrder",formValue, function(error,result){
                if(error){
                  console.log(error.reason);
                }else{
                  // swal("Done","Basic Information inserted successfully!"); 
                  // $("#manualEmpVerif").find("input.effect-21").val("");  
                }
              });
            }  
            this.setState({
              "firstName" : '',
              "lastName"  : '',
              "emailId"   : '',
              "mobile"    : '',
              "aadharNo"  : '',
            });     
          }
        });
      }else{
        $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
      }
   
  }
  currentGender(event){
    if($(event.target).is(':checked')){
      var inputVal = $(event.target).val();
      // console.log("inputVal",inputVal);
      this.setState({'gender':inputVal});
    }
  }
  submitUpload(event){
    event.preventDefault();
    // var formValue  = {
     var companyAssureID      = this.props.assureId;
    //   tempcorporateOrderId : this.props.tempcorporateOrder._id,
    //   url                  : this.props.url,
    // }
    $("#loaderDiv1").css({"display" : "block"});

    var tempcorporateOrder                  = this.props.tempcorporateOrder;
    tempcorporateOrder.tempcorporateOrderId = tempcorporateOrder._id;
      Meteor.call('insertCorporateOrderNOrderofManual',tempcorporateOrder,function (error,result) {
        if (error) { 
          console.log(error.reason);
          $("#loaderDiv1").css({"display" : "none"});

          swal({
            title:'abc',
            text: error.reason,
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#666',
            confirmButtonText: 'Ok'
          });
        }else{ 
          swal({
            title:'abc',
            text: "Order Placed Successfully",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#666',
            confirmButtonText: 'Ok'
          });
          
          FlowRouter.go('/ledger/'+companyAssureID);
        }
      });

  }
  render() {
    if(Meteor.userId())
       var disable_button = true;
      if (this.props.tempcorporateOrder) {
        if (this.props.tempcorporateOrder.orderDetails.length > 0) {
          disable_button = false;
        }
      }
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUserManualContent">
          <form className="basicForm manualEmpVerif" id="manualEmpVerif">
            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.firstName != ''   ? "effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} name="firstName" ref="firstName" id="firstName" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange} value={this.state.firstName} />
                <label>First Name<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span> 
              </div>
            </div>
            
            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 middleIpbox">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.lastName != ''  ?"effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} name="lastName" ref="lastName" id="lastName" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} value={this.state.lastName} />
                <label>Last Name<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span> 
              </div>
            </div>

            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.emailId != ''  ?"effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} name="emailId" ref="emailId" id="emailId" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} value={this.state.emailId} />
                <label>Email ID<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span> 
              </div>
            </div>

            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.mobile != ''  ?"effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} name="mobile" ref="mobile" id="mobile" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} value={this.state.mobile} />
                <label>Mobile<span className="astrikReq">*</span></label>
                <span className="focus-border">
                  <i></i>
                </span> 
              </div>
            </div>

            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 middleIpbox">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                <input type="text" className={this.state.aadharNo != ''  ?"effect-21 form-control loginInputs has-content" :"effect-21 form-control loginInputs"} name="aadharNo" ref="aadharNo" id="aadharNo" onBlur={this.inputEffect.bind(this)} onChange={this.handleChange.bind(this)} value={this.state.aadharNo} />
                <label>Aadhar Number<span className="formatText"> (Format - xxxx xxxx xxxx)</span></label>
                <span className="focus-border">
                  <i></i>
                </span> 
              </div>
            </div>

            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <label style={{marginRight: "5"+"px"}}>Gender<span className="astrikReq">*</span></label>
              <div className="input-effect input-group">
              <label className="radio-inline"><input type="radio" name="gender" value="Female" ref="gender" defaultChecked={this.state.gender === 'Female'} onChange={this.currentGender.bind(this)} />Female</label>
              <label className="radio-inline"><input type="radio" name="gender" value="Male" ref="gender" defaultChecked={this.state.gender === 'Male'} onChange={this.currentGender.bind(this)} />Male</label>
              <label className="radio-inline"><input type="radio" name="gender" value="Other" ref="gender" defaultChecked={this.state.gender === 'Other'} onChange={this.currentGender.bind(this)} />Other</label>
              </div>
            </div>
            
            <div className="col-lg-6 col-lg-offset-6 col-md-10 col-md-offset-2 col-sm-12 col-xs-12 nopadRight">
              <button type="submit" className="btn btn-info pull-right" onClick={this.manualVerifForm.bind(this)}>Add Candidate</button>
            </div>
          </form>
          {this.props.tempcorporateOrder ? 
            <div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <CandidateBulkUploadTable orderDetails={this.props.tempcorporateOrder.orderDetails} tempCorporateOrderId={this.props.tempcorporateOrder._id}/>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile">  
                <button type="button" className="btn btn-info pull-right bulkEmpButton" disabled={disable_button} onClick={this.submitUpload.bind(this)}>Submit</button>                 
              </div> 
            </div>
            :
            null
          }
          <div className="" id="loaderDiv1" style={{"display" : "none"}}>
             <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img>
          </div>
        </div>
         
      </div> 
    );
  }
}
UserManualRequestContainer = withTracker(({props,params}) => {
  var assureId           = FlowRouter.getParam('assureid');
  var url                = FlowRouter.getParam('url');
 
  const postHandle       = Meteor.subscribe('companyProfileData',assureId);
  const temporderHandle  = Meteor.subscribe('tempCorporateOrder',assureId,Meteor.userId(),"manual");
  const loading          = !postHandle.ready() && !temporderHandle.ready();

  const companyDetails   = CompanyProfile.findOne({'companyAssureID': assureId});
  if (companyDetails) {
    if (companyDetails.contract) {
      var validContract = companyDetails.contract.filter((contract) => {if( new Date() >= new Date(contract.validFrom) && new Date() <= new Date(contract.validTo) && contract.contractStatus == "Active"){return contract;} });
      if (validContract) {
          var contractId = validContract[0].contractId;
          var validServiceArray = [];
           validContract.map((validContract) =>{
              var validService = validContract.serviceLevelAgreement.filter((serviceLevelAgreement) => {
              return serviceLevelAgreement.value == true;
            });
              if(validService){
                validServiceArray.push(...validService);
              }
          });
      } 
    } 

  }
  var tempcorporateOrder = TempCorporateOrder.findOne({"companyDetails.orderPlacedById" : Meteor.userId(), "companyDetails.companyAssureID" : assureId, "informationFilledBy": "manual"});
 
  return {
    loading,
    assureId,
    contractId,
    validServiceArray,
    tempcorporateOrder,
    url
  };
})(UserManualRequest);
export default UserManualRequestContainer;