import React,{Component}  from 'react';
import {render}           from 'react-dom';
import TrackerReact       from 'meteor/ultimatejs:tracker-react';
import { withTracker }    from 'meteor/react-meteor-data';
import { Services }       from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
import { FlowRouter }     from 'meteor/ostrio:flow-router-extra';
import CandidateOrderList from './CandidateOrderList.jsx';
import StaticCaseStatus   from '/imports/admin/corporateOrderManagement/component/staticcasestatus/StaticCaseStatus.jsx';

class RequestStatus extends TrackerReact(Component) { 
	 constructor(){
    super();  
    this.state ={
      "subscription" : {
      } 
    }
  }
  render(){
  	return(
       <div className="content-wrapper">
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h2 className="box-title"> Request Status</h2> 
                  </div> 
                    <div className="box-body">
                			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding visitedHeight companyVerifColor outerpaddingForMobile">
                       
                          {/*<StaticCaseStatus/>*/}
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImgOuter landingBlocks NOpadding">
                             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerServicesBlock">
                              {this.props.validServiceArray ?
                                  this.props.validServiceArray.length > 0 ?
                                   <div>
              	                      <ul className="nav nav-pills empVerification col-lg-12 col-md-12 col-sm-12 col-xs-12">
              	                       {this.props.validServiceArray.map((service,index)=>{
              	                          return(
              	                              <li className="col-lg-2 col-md-3 col-sm-4 col-xs-6 NOpadding" key={index}><a href={"/requestStatus/company/"+this.props.assureId+"/"+service._id} className={this.props.serviceId == service._id ? "active": ""}>{service.Name}</a></li>
              	                            );
              	                         })
              	                       }
              	                      </ul>
                                   <div className="tab-content">
                                      {this.props.validServiceArray.map((service,index)=>{
                                          return(
                                            <div id={"/requestStatus/company/"+this.props.assureId+"/"+service._id} className={this.props.serviceId == service._id ? "tab-pane fade in active" : "tab-pane fade"} key={index}>
                                                <CandidateOrderList assureId={this.props.assureId ? this.props.assureId : ""} serviceid={service._id} serviceRequired={service.serviceRequired}/>
                                            </div>
                                            );
                                         })
                                       }
                                    </div>
                                   </div>

                                  :
                                  null
                                :
                                null
                              }
                              </div>
                          </div>      
                        </div>
                      </div>
                     </div>
                  </div>
              </div> 
            </div>
          </section>
        </div>

  		);
  }
}
RequestStatusContainer = withTracker(({params}) => {

  var assureId  = FlowRouter.getParam("assureid");
  var serviceId = FlowRouter.getParam("serviceid");
  console.log('assureId ',assureId,' serviceId ',serviceId);
   var validServiceArray = [];  
   const postHandle      = Meteor.subscribe('companyProfileData',assureId);
  
  const loading          = !postHandle.ready() ;
  
  const companyDetails   = CompanyProfile.findOne({"companyAssureID" : assureId });
  if (companyDetails) {
    if (companyDetails.contract) {
      var validContract = companyDetails.contract.filter((contract) => {if( new Date() >= new Date(contract.validFrom) && new Date() <= new Date(contract.validTo) && contract.contractStatus == "Active"){return contract;} });
      if (validContract) {

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
    assureId,
    validServiceArray,
    serviceId,
  };
})(RequestStatus);
export default RequestStatusContainer;