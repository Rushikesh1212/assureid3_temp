import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class CompanyDetails extends TrackerReact(Component) {

        constructor(){
            super();
        }
 
        render(){
            return(
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 companyDetailsBlock">
                    <div className="col-lg-3 col-md-3 co-sm-3 col-xs-3">
                        <img src={this.props.companyLogo ? this.props.companyLogo : "https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/dummy-logo.png"} className="img img-responsive companyDetailsLogo"/>
                    </div> 
                    <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoOuter">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner NOpadding">
                                <h5><b>Company Name</b></h5>
                                <p>{this.props.companyName ? this.props.companyName : "--"}&nbsp;({this.props.companyAssureID ? this.props.companyAssureID : "--"})</p>
                            </div>                   
                        </div>
                        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
                            <h5><b>Company Assureid</b></h5>
                            
                        </div>  */}
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                       <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 basicInfoInner NOpadding">
                            <h5><b>Allocated To<span className="text-right">:</span></b></h5>
                       </div>
                       <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 basicInfoInner NOpadding">
                            <h5>{this.props.allocatedToUserName ? this.props.allocatedToUserName : "--"}</h5>
                       </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 basicInfoInner NOpadding">
                            <h5><b>SPOC Name</b></h5>
                            <p>{this.props.spocdetails ? this.props.spocdetails.spocName : "--"}</p>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 basicInfoInner NOpadding">
                            <h5><b>SPOC Email</b></h5>
                            <p>{this.props.spocdetails ? this.props.spocdetails.spocEmail : "--"}</p>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 basicInfoInner NOpadding">
                            <h5><b>SPOC Contact</b></h5>
                            <p>{this.props.spocdetails ? this.props.spocdetails.spocContact : "--"}</p>
                        </div>
                    </div>
               </div>
            )

        }       
}