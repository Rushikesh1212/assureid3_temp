import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
import ViewBasicInfo from './ViewBasicInfo.jsx';
import ViewLocationInfo from './ViewLocationInfo.jsx';
import ViewSettingsInfo from './ViewSettingsInfo.jsx';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

class CompanyView extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  }
  componentDidMount(){      
      $('html, body').scrollTop(0);
  }

  render(){
    if (!this.props.loading && this.props.location) {
      return (
        <div>
          <ViewBasicInfo key={location._id + 'viewBasic'} companyProfileId={this.props.companyProfileId} assureId={this.props.assureId} location={this.props.location}/>
          <ViewLocationInfo key={location._id + 'viewLocation'} companyProfileId={this.props.companyProfileId} assureId={this.props.assureId} companyLocations={this.props.companyLocations}/>
          <ViewSettingsInfo key={location._id + 'viewSettings'} spocperson = {this.props.spocPerson} companyProfileId={this.props.companyProfileId} assureId={this.props.assureId} />
        </div>
      );
    }else{
      return(
        <span></span>
      );
    }
    
  }
}
CompanyViewContainer = withTracker(props => {
  var assureId = props.assureId;  
  const postHandle = Meteor.subscribe('companyProfileData',assureId);
  const loading    = !postHandle.ready();
  var location     = CompanyProfile.findOne({"companyAssureID": assureId});  
  if(location){
    if (location.companyLocations) {
      var companyLocations = location.companyLocations;
    }
    var userDetails = Meteor.users.findOne({"_id":location.userId});    
    if(userDetails){
      var spocPerson =  userDetails.profile.authorizedPerson;      
    }
  }
  console.log("spocPerson :",spocPerson);
  companyLocations = _.without(companyLocations,null);
  return {
    loading : loading,
    location : location,
    companyLocations  : companyLocations,
    spocPerson : spocPerson
  }; 
})(CompanyView);
export default CompanyViewContainer;
