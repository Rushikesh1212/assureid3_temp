import React,{Component}  from 'react';
import {render}           from 'react-dom';
import TrackerReact       from 'meteor/ultimatejs:tracker-react';
import { withTracker }    from 'meteor/react-meteor-data';
import { FlowRouter }     from 'meteor/ostrio:flow-router-extra';
import StaticSummaryLedger from '/imports/AssureID/company/ledger/components/StaticSummaryLedger.jsx';
import StaticCaseStatus   from '/imports/AssureID/staticcasestatus/StaticCaseStatus.jsx';
import StaticRequestStatus   from './StaticRequestStatus.jsx';
import EmployeeStatus   from './EmployeeStatus.jsx';
import CandidateOrderList from '/imports/AssureID/company/newRequest/components/companyBulkRequestServices/components/CandidateOrderList.jsx';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';

class AllLedgers extends TrackerReact(Component) {
	 constructor(){
    super();  
    this.state ={ 
      "subscription" : {
      } 
    }
  }
  render(){
    if (!this.props.loading) {
      return(
        <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 visitedHeight companyVerifColor noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyOrderPage"><h3 className="companyVieworderNo">Case Status</h3></div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                {/* <StaticSummaryLedger companyDetails={this.props.companyDetails} contract={this.props.contract} services={this.props.validServiceArray}/> */}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <StaticCaseStatus />
              </div>
              { this.props.assureId == 'IN-CAA-000001' ?
                  <StaticRequestStatus/>
                :
                this.props.validServiceArray.length > 0 ?
                  <div className="allLedgersMargin col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <EmployeeStatus companyAssureID={this.props.assureId} contractId={this.props.contract.contractId} serivces={this.props.validServiceArray}/>  
                     </div>
                  </div>
                :
                <div className="allLedgersMargin col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <p className="text-center contactAdminMsg">Please contact admin for further processing..</p>
                  </div>
                </div>
              }
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyViewDiv companyOrderPage noProfilePadding" style={{height: 36+'px'}}></div>
            </div>
          </div>
        </div>
      );
    }else{
      return(
        <span>Loading</span>
      );
    }
  	
  }
}
AllLedgersContainer = withTracker(({props}) => {
  var assureId        = FlowRouter.getParam('assureid');
  var serviceId       = FlowRouter.getParam('serviceid'); 

  const postHandle    = Meteor.subscribe('companyProfileData',assureId);
  const loading       = !postHandle.ready();

  const companyDetails = CompanyProfile.findOne({'companyAssureID': assureId})||{};
  var contract          = {};
  var validServiceArray = [];
  if (companyDetails) {
    if (companyDetails.contract) {
      var validContract = companyDetails.contract.filter((contract) => {if( new Date() >= new Date(contract.validFrom) && new Date() <= new Date(contract.validTo) && contract.contractStatus == "Active"){return contract;} });
      if (validContract) {
           contract = validContract[0];
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

  return {
    loading,
    companyDetails,
    assureId,
    serviceId, 
    validServiceArray,
    contract
  };
})(AllLedgers);
export default AllLedgersContainer;