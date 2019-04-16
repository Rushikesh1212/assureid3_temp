import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Support from '/imports/AssureID/website2/support/Support.jsx';
export default class FinancialVerification extends TrackerReact(Component){
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
							<h3>FIANCIAL  <span>VERIFICATION</span></h3> 
						</div>
					</div>
				</div> 
		    <section id="service-page">
					<div className="tabs">
						<div className="container">
							<div className="row">
								<div className="col-md-4 col-sm-5">
									<ul className="nav nav-pills nav-stacked flex-column">
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> PAN </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> CIBIL </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> BANK STATEMENT  </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> BALANCE SHEET  </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> TAX </a></li>
									</ul>
								</div>
								<div className="col-md-8 col-sm-7">
									<div className="tab-content">									
										<div className="row">
											<div className="col-sm-6">											
												<div className="id-heading"> Financial Verification </div>
												<hr/>											
												<p>AssureID ensures that each and every piece of financial information and history required of an individual by organisations is 100% valid.</p>											
											</div>
											<div className="col-sm-6">
												<img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/financial-ferification.jpg" className="img-responsive" />																														</div>
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