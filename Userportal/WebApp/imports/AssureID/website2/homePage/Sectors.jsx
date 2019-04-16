import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class Sectors extends TrackerReact(Component){
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
  render(){
  	return(
      <section id="sectors">
        <div className="container">  
          <div className="row">
            <div className="services_heading">
              <h3>SECTORS  <span>WE SERVE</span></h3>
            </div>
          </div>    
          <div className="row">
            <div className="col-md-4 col-sm-6">
              <div className="our-team-main">
                <div className="team-front">
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/sector1.png" className="img-fluid" />
                  <h3>BIFS</h3>
                </div>
                <div className="team-back">           
                  <div className="col-md-12">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/c-icon1.png"/>
                    <h4> BIFS</h4>
                  </div>        
                  <div className="col-md-12">
                     AssureID helps banks verify background information of prospective customers, so that they can bank with genuine people not scammers.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="our-team-main">
                <div className="team-front">
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/sector2.png" className="img-fluid" />
                  <h3>CORPORATE</h3>
                </div>
                <div className="team-back">           
                  <div className="col-md-12">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/c-icon2.png"/>
                    <h4> CORPORATE </h4>
                  </div>        
                  <div className="col-md-12">
                    AssureID reduces the hassle of recruiters by providing the whole gamut of verifications required for hiring authentic professionals.
                  </div>
                </div>

              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="our-team-main">
                <div className="team-front">
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/sector3.png" className="img-fluid" />
                  <h3>REAL ESTATE</h3>
                </div>
                <div className="team-back">           
                  <div className="col-md-12">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/c-icon3.png"/>
                    <h4> REAL ESTATE </h4>
                  </div>        
                  <div className="col-md-12">
                    Often, properties for sale/Rent are involved in disputes, which is deliberately kept hidden by the seller/Tenant. AssureID conducts a thorough background check to ensure thetransaction is completely dispute-free by information verification of all the parties.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="our-team-main">
                <div className="team-front">
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/sector4.png" className="img-fluid" />
                  <h3>CORPORATE BACKGROUND </h3>
                </div>
                <div className="team-back">           
                  <div className="col-md-12">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/c-icon4.png"/>
                    <h4> CORPORATE BACKGROUND </h4>
                  </div>        
                  <div className="col-md-12">
                    AssureID provides a holistic verification of a company’s background, which may be needed in due diligence by, say, a banks/investors/corporates in joint ventures.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="our-team-main">
                <div className="team-front">
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/sector5.png" className="img-fluid" />
                  <h3>COMMUNITIES </h3>
                </div>
                <div className="team-back">           
                  <div className="col-md-12">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/c-icon5.png"/>
                    <h4> COMMUNITIES </h4>
                  </div>        
                  <div className="col-md-12">
                    Our society is heavily dependent on service personnel like maids, security guards, delivery people, labours, etc. for its functioning. AssureID verifies their profile and ensures that you are dependent on the right people.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="our-team-main">
                <div className="team-front">
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/sector6.png" className="img-fluid" />
                  <h3> GOVERNMENT </h3>
                </div>
                <div className="team-back">           
                  <div className="col-md-12">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/c-icon6.png"/>
                    <h4> GOVERNMENT </h4>
                  </div>        
                  <div className="col-md-12">
                    Procurement of Products and Services By Government 
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