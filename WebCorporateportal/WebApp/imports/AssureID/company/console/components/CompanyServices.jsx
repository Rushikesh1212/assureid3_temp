import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Packages } from '../../dashboard/reactCMS/api/Package.js';
import { Services } from '../../dashboard/reactCMS/api/Services.js';
import { CompanyProfile } from '/imports/website/companyForms/api/companyProfile.js';
class CompanyServices extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      "subscription"  : {
      }    
    };   
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }  
  linkToServiceInfo(event){
    event.preventDefault();
    var id = $(event.currentTarget).attr('data-id');
    browserHistory.replace("/companyConsole/"+this.props.assureId+'/'+id);
    $('html,body').scrollTop(0);
  }
  linkToPackageInfo(event){
    event.preventDefault();
    var id = $(event.currentTarget).attr('data-id');
    browserHistory.replace("/companyConsole-Package/"+this.props.assureId+'/'+id);
    $('html,body').scrollTop(0);
  }
  services(){
    return this.props.services.map((services,index)  => {
      return(
        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 companyServices" key={index}>
          {/*services.serviceFor == 'company' ?*/
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationBlock" data-id={services._id} onClick={this.linkToServiceInfo.bind(this)}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 iconOuterBlock">
                <img src={services.image}  className="profileServiceImage"/>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationName">
                <p>{services.serviceName}</p> 
              </div>
            </div>
            /*:
            ""
          */}
        </div>
      );
    });
  }
  packages(){
    return this.props.packages.map((packages,index)  => {
      return(
        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 companyServices" key={index}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationBlock" data-id={packages._id} onClick={this.linkToPackageInfo.bind(this)}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 iconOuterBlock">
                <img src={packages.image}  className="profileServiceImage"/>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationName">
                <p>{packages.packageName}</p> 
              </div>
            </div>
        </div>
      );
    });
  }
  render() {  
    if (!this.props.loading) {
      return ( 
        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12 verSerBlock landingBlocks noProfilePadding outerpaddingForMobile">
            <h5 className="text-center"><b>Our Services</b></h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerpaddingForMobile">
              {this.services()}
              {this.packages()}
            </div>
        </div>
      );
    }else{
      return(
         <span>Loading..</span>
        );
    }
  
  }
}
UserDataContainer = withTracker(({props,params}) => {
  const postHandle    = Meteor.subscribe("services");
  const packageHandle = Meteor.subscribe("packages");
  const loading       = !postHandle.ready() && !packageHandle.ready();
  var currentLocation = browserHistory.getCurrentLocation();
  var splitUrl        = currentLocation.pathname.split('/');
  var assureid        = splitUrl[2];
  // console.log("assureid",assureid);
  const companyHandle = Meteor.subscribe("companyProfileData",assureid);
  var companyProfile  = CompanyProfile.findOne({"companyAssureID": assureid});
  // console.log("companyProfile",companyProfile);
  var newDate         = new Date();
  // console.log("newDate",newDate);
  var currentDate     = moment(newDate).format("YYYY-MM-DD");
  // console.log("currentDate",currentDate);
  var services  = [];
  var packages  = [];
  var serviceLevelAgreement = [];
  if (companyProfile) {
    if (companyProfile.contract) {
       for (var i = 0; i < companyProfile.contract.length; i++) {
         if (currentDate >= companyProfile.contract[i].validFrom && currentDate <= companyProfile.contract[i].validTo) {
          var contractArr = companyProfile.contract[i];
         }  
      }
      // console.log("contractArr",contractArr);
      if (contractArr.serviceLevelAgreement) {
        for (var i = 0; i < contractArr.serviceLevelAgreement.length; i++) {
          if (contractArr.serviceLevelAgreement[i].value == true) {
            // serviceLevelAgreement.push(contractArr.serviceLevelAgreement[i]);
            if (contractArr.serviceLevelAgreement[i].type == "service" ) {
                var singleService = Services.findOne({"_id" : contractArr.serviceLevelAgreement[i]._id});
                // singleService.
                services.push(singleService);
            }else{
              var singlePackage = Packages.findOne({"_id" : contractArr.serviceLevelAgreement[i]._id,"packageStatus": "Active"});
              packages.push(singlePackage);
            }
          }
        }
        // console.log("serviceLevelAgreement",serviceLevelAgreement);
      }
    }else{
       services = Services.find({}).fetch();
       packages = Packages.find({"packageStatus": "Active"}).fetch();
    }
  }
  // console.log("packages",packages);

    return {
      loading,
      services,
      packages,
    };
})(CompanyServices);
export default UserDataContainer;