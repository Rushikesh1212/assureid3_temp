import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

import UserProfileData from './UserProfileData.jsx';
import LatestUpdates from './LatestUpdates.jsx';
import Viewers from './Viewers.jsx';
import OurServices from './OurServices.jsx';
import Placeholder from './Placeholder.jsx'; 
import NewsFeed from './NewsFeed.jsx'; 

import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";

class UserHome extends TrackerReact(Component) {
  constructor(){
    super(); 
    this.state ={ 
      "subscription" : {
        "userprofile" : Meteor.subscribe("userprofile"),      
      } 
    }
  }
  componentDidMount() {

  }
	render() {
    if(Meteor.userId())
    return (
      <div>
        {
          !this.props.loading ?
            this.props.usersDetails.profile.loginAs == 'user' ?
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visitedHeight noProfilePadding">
                  <UserProfileData />
                  <LatestUpdates />
                  <Viewers viewedByPeople={this.props.userProfile.viewedByPeople} viewedByCompanies={this.props.userProfile.viewedByCompanies} />             
                   </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 outerpaddingForMobile">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding newsVerBlock landingBlocks text-center">
                      <h5><b>News Feed</b></h5>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proNewsBlock">
                        <NewsFeed />
                      </div>
                    </div> 
                  </div>
                  <OurServices />
                 <Placeholder />
                </div>
              </div> 
            :
            ""
          :
          <span>Loading..</span>
        }
      </div>
    );
  }
}
UserDataContainer = withTracker(({props}) => {
  const postHandle    = Meteor.subscribe('userData',Meteor.userId());
  const loading       = !postHandle.ready();
  const postHandle1   = Meteor.subscribe('userprofile',_id);
  const loading1      = !postHandle1.ready();

  var _id = Meteor.userId();
  const usersDetails   = Meteor.users.findOne({"_id":_id})||{};
  // console.log("usersDetails",usersDetails);
  const userProfile = UserProfile.findOne({'userId': _id}) || {} ;
  // console.log("userprofileObj",userprofileObj);
 
  return {
    loading,
    usersDetails,
    userProfile,
  };
})(UserHome);
export default UserDataContainer;