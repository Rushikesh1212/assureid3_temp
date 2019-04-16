import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Support from '/imports/AssureID/website2/support/Support.jsx';
export default class CorporateVerification extends TrackerReact(Component){
  constructor(){ 
    super(); 
    this.state ={  
      // "searchArray"  : [],
      "subscription" : {
      } 
    }
  }
  componenetDidMount(){

  }
  render() {  
    return (
    	<div>
      	<div className="container-fluid bg-overlay top30" id="heading-page">
					<div className="row text-center">
						<div className="lt_heading">
							<h3>CORPORATE   <span>VERIFICATION</span></h3> 
						</div>
					</div>
				</div> 
		    <section id="service-page">			
					<div className="tabs">
						<div className="container">
							<div className="row">
								<div className="col-md-4 col-sm-5">
									<ul className="nav nav-pills nav-stacked flex-column">
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> ROCE Verification</a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> TAX Verification</a></li>							
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> CIN  Verification</a></li>							
									</ul>
								</div>
								<div className="col-md-8 col-sm-7">
									<div className="tab-content">								
										<div className="row">											
											<div className="col-sm-6">											
												<div className="id-heading"> Corporate Verification </div>
												<hr/>
												<p>AssureID probes the information and history of companies to ensure authenticity of the details furnished.</p>											
											</div>											
											<div className="col-sm-6">											
												<img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/corporate.jpg" className="img-responsive" />	
											</div>										
										</div>	
									</div>
								</div>
							</div>
						</div>
					</div>
		    </section>	
		    <Support />
		  </div>
    );
  }
}