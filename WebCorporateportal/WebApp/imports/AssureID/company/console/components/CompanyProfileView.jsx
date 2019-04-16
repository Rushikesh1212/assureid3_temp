import React,{Component} from 'react';
import {render} from 'react-dom'; 
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import CompanyContractServices from './CompanyContractServices.jsx';
import CompanyProfileData from './CompanyProfileData.jsx';
import RequestVerification from './RequestVerification.jsx';
import InsufficiencyOrder from './InsufficiencyOrder.jsx';
import StatisticsMaster from './StatisticsMaster.jsx';
import SummaryLedger from './SummaryLedger.jsx';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
class CompanyProfileView extends TrackerReact(Component){
  constructor(){
    super(); 
    this.state ={ 
      "subscription" : { 
      } 
    }
  }
  componentDidMount() {
  }
	render() {
    if(Meteor.userId())
    return (
      <div>
        {!this.props.loading ?
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visitedHeight noProfilePadding">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                <CompanyProfileData userValues={this.props.companyDetails} key={this.props.companyDetails._id + 'company'}/>
                <CompanyContractServices services={this.props.services}/> 
                </div>
                
                {/* <SummaryLedger companyDetails={this.props.companyDetails} contract={this.props.contract} services={this.props.validServiceArray}/> */}
                <div className="col-lg-9 col-md-9 col-sm-8 col-xs-12 noLRPad landingBlocks placeholderVerBlock">
                  <StatisticsMaster companyDetails={this.props.companyDetails} contractstatus ={this.props.contractStatus} contract={this.props.contract} services={this.props.validServiceArray}/>                
                </div>
                {/* <RequestVerification contractDetails={this.props.contract} contractstatus ={this.props.contractStatus} companyDetails={this.props.companyDetails} services={this.props.services}/> */}
                {/* <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 visitedHeight prZero">
                  <InsufficiencyOrder companyDetails={this.props.companyDetails} contract={this.props.contract} services={this.props.validServiceArray}/>
                </div> */}
              </div>
              
            </div>
          :
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visitedHeight noProfilePadding">
              <div className="" id="commoneLoaderDiv">
                 <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img>
              </div>
            </div>
          </div>
        }
      </div> 
    );
  } 
}
CompanyConsoleContainer = withTracker(({props}) => {
  var currentLocation = FlowRouter.current().path;
  var splitUrl        = currentLocation.split('/');
  var assureId        = splitUrl[2]; 
  const postHandle    = Meteor.subscribe('companyProfileData',assureId);
  var services        = [];
  const serviceHandle = Meteor.subscribe('services');
  const loading       = !postHandle.ready() && !serviceHandle.ready();
  const companyDetails   = CompanyProfile.findOne({'companyAssureID': assureId})||{};
  var contract          = {};
  var validServiceArray = [];
  var contractStatus ="";
  if (companyDetails) {
    if (companyDetails.contract) {
      var validContract = companyDetails.contract.filter((contract) => {if( new Date() >= new Date(contract.validFrom) && new Date() <= new Date(contract.validTo) && contract.contractStatus == "Active"){return contract;} });
      // console.log("validContract",validContract);
      var invalidContract = companyDetails.contract.filter((contract) => {if( new Date() >= new Date(contract.validFrom) && new Date() <= new Date(contract.validTo) && contract.contractStatus == "Inactive"){return contract;} });
      if (validContract.length > 0) {
           contractStatus = "Active"
           contract = validContract[0];
           validContract.map((validContract) =>{
              var validService = validContract.serviceLevelAgreement.filter((serviceLevelAgreement) => {
              return serviceLevelAgreement.value == true;
            });
              if(validService){
                validServiceArray.push(...validService);
              }
          });
           if (validServiceArray) { 
             validServiceArray.map((validService) =>{
              var validServiceId = validService._id;
                var matchedServices = Services.findOne({"_id" : validService._id});
                if(matchedServices){
                  services.push(matchedServices);
                }               
             });
           }
      }else if(invalidContract){
        var contractStatus = "Inactive";
      }
    } 
  }
  // contract=[];
  console.log("contractStatus companyProfileView :",contractStatus);
  return {
    loading,
    companyDetails,
    assureId,
    validServiceArray,
    services,
    contract,
    contractStatus
  };
})(CompanyProfileView);
export default CompanyConsoleContainer;