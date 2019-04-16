import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {CompanyProfile} from '/imports/AssureID/company/api/companyProfile.js';

class DoHaveProfile extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      "subscription" : {
      }
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }

  render(){
    return(
      <div id="DoHaveProfile">
        <div className="row text-center outerdoyouHaveProfile">
           <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/> 
           </div>
            
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 assureIdAouter">
                  <h3>Welcome to AssureID</h3>
                  <h5><p>Your AssureID is </p></h5>
                  <div className="progress hideMe">
                    <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: 100 + '%'}}>
                      <b>please wait...</b>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="idBlock">
                    <div className="idBlock col-lg-5 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12">
                      {
/*                        !this.props.loading1 && this.props.companyData ?
                          this.props.companyData.companyAssureID ?  
                            <b> {this.props.companyData.companyAssureID} </b>
                          :*/
                          !this.props.loading && this.props.usersDetails ?
                            this.props.usersDetails.profile ?
                              <b> {this.props.usersDetails.profile.assureId} </b>
                            :
                            ""
                          :
                          ""
/*                        :
                        ""
*/                      }
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 assureIdQuestion" id="idBlockNext">
                  <div className="col-lg-12 col-md-6 col-sm-6 col-xs-6">
                    {
/*                      !this.props.loading1 && this.props.companyData ?
                        this.props.companyData.companyAssureID ?  
                          <a href={"/companyForms/basic/"+this.props.companyData.companyAssureID}><button type="button" className="btn col-lg-12 submitBtn pull-right">OK, I got it!</button></a>
                        :*/
                        !this.props.loading && this.props.usersDetails ?
                          this.props.usersDetails.profile ?
                            <a href="/profileForms/home"><button type="button" className="btn col-lg-12 submitBtn pull-right">Create your own profile</button></a>
                          :
                          ""
                        :
                        ""
                     /* :
                      ""*/
                    }
                  </div>
                </div>
              </div>               
        </div>        
      </div>
    );
  }
}
DoHaveProfileContainer = withTracker(({props}) => {
  const postHandle    = Meteor.subscribe('userData',Meteor.userId());
  const loading       = !postHandle.ready();
  const usersDetails  = Meteor.users.findOne({'_id':Meteor.userId()})|| {};
  // console.log("usersDetails",usersDetails);

  const postHandle1   = Meteor.subscribe('companyProfileDetails');
  const loading1      = !postHandle1.ready();
  const companyData   = CompanyProfile.findOne({'userId':Meteor.userId()},{sort: {"createdAt":-1}})|| {};
  return {
    usersDetails,
    loading,
    loading1,
    companyData,
  };
})(DoHaveProfile);
export default DoHaveProfileContainer;