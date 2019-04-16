import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import { Packages } from '../../dashboard/reactCMS/api/Package.js';
import {Order} from '/imports/website/ServiceProcess/api/Order.js';
import {Services} from '/imports/dashboard/reactCMS/api/Services.js';

import {CompanyProfile} from '/imports/website/companyForms/api/companyProfile.js';

class CompanyPackageInfo extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){ 
    $('html,body').scrollTop(0);
  }
  backClick(event){
    event.preventDefault();
    // var path = "/profile";
    browserHistory.replace('/companyConsole/'+this.props.assureId);
  }
  proceedClick(event){
    event.preventDefault();
    event.preventDefault();
    var id = $(event.currentTarget).attr('id');
    if(this.props.companyProfile){
      if(this.props.companyProfile.companyLocations){
        if(this.props.companyProfile.companyLocations.length > 0){
          // browserHistory.replace('/verificationProcess/manual/'+this.props.assureId+'/'+id);
          browserHistory.replace('/verificationProcess/manual/Package/'+this.props.assureId+'/'+id);
        }else{
          swal('Please add company location first.');
        }
      }else{
        swal('Please add company location first.');
      }
    }
  }
  
  render(){
    if (!this.props.loading) {
      return(
        <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
              <h1 className="text-center headerinvoice"> {this.props.packages.packageName} </h1>    

              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 outerServiceImage">
                <img src={this.props.packages.image} className="img-responsive serviceImage" />
              </div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 serviceInfoColumn">
{/*                    <span className="">Rate : <i className="fa fa-inr" aria-hidden="true"></i> {this.props.packages.serviceRate}</span>
*/}                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right serviceInfoColumn">
                    <span className="">Expected Completion : {this.props.packages.packageDuration} Days</span>
                </div> 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 serviceInfoDesc">
                    <span className="">{this.props.packages.packageDescription}</span>
                </div>

              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-left" onClick={this.backClick.bind(this)} value="" >Back</button>
                <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-right" id={this.props.packages._id } onClick={this.proceedClick.bind(this)} type="submit" value="" >Continue</button>
              </div>
              
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

CompanyPackageInfoContainer = withTracker(({params}) => {
    var _id = params.packageid;

    // var _id             = params.serviceid;
    const packageHandle = Meteor.subscribe("singlePackages",_id);
    const packages      = Packages.findOne({"_id":_id});
    var assureId        = params.assureid;
    const postHandle1   = Meteor.subscribe('companyProfileData',assureId);
    var companyProfile  = CompanyProfile.findOne({'companyAssureID':assureId}) || {};
    const loading       = !packageHandle.ready() && !postHandle1.ready();
    
    return {
      loading,
      assureId,
      packages,
      companyProfile,
    };
})(CompanyPackageInfo);
export default CompanyPackageInfoContainer;

