import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Support from '/imports/AssureID/website2/support/Support.jsx';
export default class ProfessionalVerification extends TrackerReact(Component){
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
							<h3>PROFESSIONAL  <span>VERIFICATION</span></h3> 
						</div>
					</div>
				</div> 
		    <section id="service-page">
					<div className="tabs">
						<div className="container">
							<div className="row">
								<div className="col-md-4 col-sm-5">
									<ul className="nav nav-pills nav-stacked flex-column">
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> EDUCATION </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> EMPLOYMENT </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> CV </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> TAX </a></li>
									</ul>
								</div>
								<div className="col-md-8 col-sm-7">
									<div className="tab-content">									
										<div className="row">												
											<div className="col-sm-6">
												<div className="id-heading"> Professional Verification </div>
												<hr/>											
												<p>Each and every information furnished in the CV of an individual is thoroughly investigated by AssureID to ensure you are hiring or dealing with a genuinely competent individual.</p>											
											</div>											
											<div className="col-sm-6">											
												<img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/professional-vrification.jpg" className="img-responsive" />																															
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