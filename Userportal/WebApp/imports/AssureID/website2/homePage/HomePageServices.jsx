import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class HomePageServices extends TrackerReact(Component){
	constructor(){ 
    super(); 
    this.state ={  
      "subscription" : {
      } 
    }
  }
  componenetDidMount(){

  }
  render(){
  	return(
      <section id="services">
    		<div className="container">
    			<div className="row">
    				<div className="services_heading">
              <h3>OUR <span>SERVICES</span></h3>
            </div>
          </div>
    			<div className="row">
    				<div className="wow fadeIn" data-wow-delay="0.3s" style={{"visibility": "visible", "animationDelay": "0.3s", "animationName": "fadeIn"}}>
              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon1.png"/>
                          <h4>IDENTITY VERIFICATION </h4>
                          <p>AssureID conducts a thorough background check and cross-verifies records...</p>
                          <a href="/services/identityVerification" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon2.png"/>
                          <h4>FINANCIAL VERIFICATION </h4>
                          <p>AssureID ensures that each and every piece of financial information...</p>
                          <a href="/services/financialVerification" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon3.png"/>
                          <h4>TENANCY/ADDRESS VERIFICATION </h4>
                          <p>The most number of discrepancies are identified in the address and tenancy. ... </p>
                          <a href="/services/tenancy" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon4.png"/>
                          <h4>INTERNATIONAL VERIFICATIONS</h4>
                          <p>Not just locally or nationally, but AssureID checks for information authenticity....</p>
                          <a href="/services/internationalVerification" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon5.png"/>
                          <h4>LEGAL</h4>
                          <p>To ensure that you are not dealing with a law offender AssureID scours through...</p>
                          <a href="/services/legal" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon6.png"/>
                          <h4> PROFESSIONAL VERIFICATION </h4>
                          <p>Each and every information furnished in the CV of an individual is thoroughly...</p>
                          <a href="/services/professionalVerification" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon7.png"/>
                          <h4> INSURANCE </h4>
                          <p>AssureID inspects all the data relevant to the insurance documents furnished...</p>
                          <a href="/services/insurance" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                  <div className="col-sm-4">
                      <div className="item-service">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/icon8.png"/>
                          <h4> CORPROATE VERIFICATION </h4>
                          <p>AssureID probes the information and history of companies to ensure authenticity ...</p>
                          <a href="/services/corporateVerification" >
                              READ MORE <i className="fa fa-long-arrow-right"></i>
                          </a>
                      </div>
                  </div>
                </div>
              </div>
    	      </div>
          </div>
    		</div>
    	</section>
  	);
  }
}