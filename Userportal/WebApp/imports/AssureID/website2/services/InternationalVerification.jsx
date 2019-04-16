import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Support from '/imports/AssureID/website2/support/Support.jsx';
export default class InternationalVerification extends TrackerReact(Component){
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
							<h3>INTERNATIONAL  <span>VERIFICATIONS</span></h3> 
						</div>
					</div>
				</div> 
        <section id="service-page">
						<div className="tabs">
							<div className="container">
								<div className="row">
									<div className="col-md-4 col-sm-5">
										<ul className="nav nav-pills nav-stacked flex-column">
											<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> PASSPORT VERIFICATION </a></li>
											<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> GLOBAL DATABASE VERIFICATION </a></li>
										</ul>
									</div>
									<div className="col-md-8 col-sm-7">									
										<div className="tab-content">										
											<div className="tab-content">
												<div className="row">														
													<div className="col-sm-6">													
														<div className="id-heading"> International Verification </div>
														<hr/>													
														<p>Not just locally or nationally, but AssureID checks for information authenticity of a person across the globe. This helps to ensure that an individual is not linked to any suspicious entities or legal cases abroad.</p>
													</div>													
													<div className="col-sm-6">													
														<img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/international-vrification.jpg" className="img-responsive" />																																			
													</div>													
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