import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
export default class CompanyProfileData extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      "subscription" : {
      } 
    }
  }
  componentDidMount() {
  }

	render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-4 col-xs-12 outerpaddingForMobile">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImgOuter noProfilePadding landingBlocks text-center">
          <h5><b>Profile</b></h5>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userImg"> 
            { this.props.userValues.companyLogo ? 
              <img src={this.props.userValues.companyLogo} className="img-rounded profileImg" />
              :
              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-rounded profileImg" />
            }
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userInfo">
            <h5 className=""><b>{this.props.userValues.companyName}</b></h5>
            <p>{this.props.userValues.companyAssureID}</p>
            <h5>Profile Completion Status</h5>
            {!this.props.loading1?
              <div>
                <div className="progress">
                  <div className="progress-bar progress-bar-striped" role="progressbar"
                  aria-valuenow={this.props.userValues.companyProfilePercent} aria-valuemin="0" aria-valuemax="100" style={{width: this.props.userValues.companyProfilePercent+'%'}}>
                  </div>
                </div>
                <h3>{this.props.userValues.companyProfilePercent}%</h3>
              </div>
              :
              <div></div>
            }
          </div>
        </div>
      </div>
    );
  }
}