import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Support from '/imports/AssureID/website2/support/Support.jsx';
export default class AboutUS extends TrackerReact(Component){
  constructor(){ 
    super(); 
    this.state ={  
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
							<h3>ABOUT  <span>US</span></h3>
						</div>
					</div>
				</div>
		    <section id="about">
  				<div className="container">
		        <div className="row">
              <div className="col-sm-6">
              	<div className="img-wrapper">
              		<img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/aboutus.jpg" className="img-responsive" alt="" />
              	</div>
              </div>
              <div className="col-sm-6">
              	<h2>WHAT IS <span className="theam-color">ASSUREID?</span></h2>
              	<p className="text-justify">AssureID helps organisations verify people with unparalleled ease, owing to its Artificial Intelligence and Data Analytics–powered technological systems. In today’s times the information provided by a person even on paper is hard to trust. Fraudsters can use technology to forge documents and their identities. AssureID uses technology itself to verify people’s profiles in the most comprehensive manner; thus keeping fraudsters at bay. The team at AssureID prouds itself in its service and that is why it can say with conviction: if a person is verified by AssureID, you can trust them blindly!</p>
              </div>
					  
					   <div className="col-md-6 col-sm-12">
							  <div className="row pad-top-20">
									<div className="col-sm-4">
										<div className="services-post-3">
											<span><i className="fa fa-users"></i></span>
										  <div className="services-content">
											<h3>Verify People</h3>
										  </div> 
										</div> 
									</div>
									<div className="col-sm-4">
										<div className="services-post-3">
										  <span><i className="fa fa-lightbulb-o"></i></span>
										  <div className="services-content">
											<h3>Artificial Intelligence</h3>
										  </div> 
										</div> 
									</div>
									<div className="col-sm-4">
										<div className="services-post-3">
										  <span><i className="fa fa-pie-chart"></i></span>
										  <div className="services-content">
											<h3>Data Analytics</h3>
										  </div> 
										</div> 
									</div>
							  </div>
		          </div>					  
		        </div> 
		      </div>
		    </section>
			
			<section className="mt-100">
				<div className="container">
					<div className="row">
						<div className="col-sm-4">
							<div className="icon-box-3">            
								<div className="icon-box-icon">
									<i className="fa fa-bullseye" aria-hidden="true"></i>
								</div>
								<div className="icon-box-content">
									<h5 className="heading">Our Mission</h5>
									<span className="text-white">We believe in working towards the common goal.</span>
									<br /><br />
									<a href="#">Learn More</a>
								</div>
							</div>
						</div>
						<div className="col-sm-4">
							<div className="icon-box-3">           
								<div className="icon-box-icon">
									<i className="fa fa-crosshairs" aria-hidden="true"></i>
								</div>
								<div className="icon-box-content">
									<h5 className="heading">Our Vision</h5>
									<span className="text-white">We believe in working towards the common goal.</span>
									<br /><br />
									<a href="#">Learn More</a>
								</div>
							</div>
						</div>
						<div className="col-sm-4">
							<div className="icon-box-3">            
								<div className="icon-box-icon">
									<i className="fa fa-book" aria-hidden="true"></i>
								</div>
								<div className="icon-box-content">
									<h5 className="heading">Our Values</h5>
									<span className="text-white">We believe in working towards the common goal.</span>
									<br /><br />
									<a href="#">Learn More</a>
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