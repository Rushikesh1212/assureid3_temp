import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import Support from '../Support.jsx';
export default class Legal extends TrackerReact(Component){
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
							<h3>LEGAL  <span></span></h3> 
						</div>
					</div>
				</div> 
		    <section id="service-page">				
					<div className="tabs">
						<div className="container">
							<div className="row">
								<div className="col-md-4 col-sm-5">
									<ul className="nav nav-pills nav-stacked flex-column">
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> COURT RECORDS CHECK </a></li>
										<li><a href="#" data-toggle="pill"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/bulet-icon.png" /> POLICE VERIFICATION </a></li>										
									</ul>
								</div>
								<div className="col-md-8 col-sm-7">								
									<div className="tab-content">									
										<div className="row">											
											<div className="col-sm-6">											
												<div className="id-heading"> Legal Verification </div>
												<hr/>
												<p>To ensure that you are not dealing with a law offender AssureID scours through every legal database related to an individual.</p>											
											</div>											
											<div className="col-sm-6">											
												<img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/legal.jpg" className="img-responsive" />																			
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