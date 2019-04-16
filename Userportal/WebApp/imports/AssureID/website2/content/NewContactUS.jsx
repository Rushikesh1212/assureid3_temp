import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Support from './Support.jsx';
export default class NewContactUS extends TrackerReact(Component){
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
							<h3>Contact <span>Us</span></h3>
						</div>
					</div>
				</div>
			  <section id="contact-page">
			    <div className="container">
		        <div className="row">
	            <div className="col-lg-5 mt-20">
	                <h3 className="heading">Contact <span className="text-primary">Us</span></h3>
	                <p>Not sure where to start? Visit our <a href="faq.html"> help center</a> to get answers to your queries.</p>
	                <br />
	                <div className="bg-light p-20">
	                    <h5 className="heading">Headquarters</h5>
	                    <address className="nom">
	                        <span>Magarpatta City  <br /> Pune – 411013<br /> India</span>
	                    </address> 
	                </div>
	                <br />
	                <div className="bg-light p-20">
	                    <h5 className="heading">Contacts</h5>
	                    <p className="nom">Call us : 020 000000 / +91 000 000 00</p>
	                    <p className="nom">Email us : ashwini.dhamorikar@iassureit.com</p>
	                </div>
	                <br />
	                <div className="bg-light p-20">
	                    <h5 className="heading">Social Connect</h5>
	                    <ul className="social nom">
	                        <li><a href="#"><i className=" fa fa-facebook"></i></a></li>
	                        <li><a href="#"><i className=" fa fa-twitter"></i></a></li>
	                        <li><a href="#"><i className=" fa fa-pinterest-p"></i></a></li>
	                        <li><a href="#"><i className=" fa fa-linkedin"></i></a></li>
	                        <li><a href="#"><i className=" fa fa-reddit-alien"></i></a></li>
	                    </ul>
	                </div>
	            </div>
	            <div className="col-lg-7 mt-20">
	                <h3 className="heading">Or Drop us a <span className="text-primary">line</span></h3>
	                <form id="main-contact-form" noValidate="novalidate">
	                    <div className="form-group">
	                        <label htmlFor="contact-name">Name</label>
	                        <input id="contact-name" className="form-control" name="name" type="text" />
	                    </div>
	                    <div className="form-group">
	                        <label htmlFor="contact-email">Email ID</label>
	                        <input id="contact-email" className="form-control" name="email" type="text" />
	                    </div> 
	                    <div className="form-group">
	                        <label htmlFor="contact-number">Subject</label>
	                        <input id="contact-number" className="form-control" name="subject" type="text" />
	                    </div>
	                    <div className="form-group">
	                        <label htmlFor="contact-message">Your Message</label>
	                        <textarea id="contact-message" className="form-control" rows="6" name="message"></textarea>
	                    </div>
	                    <p id="status"></p>
	                    <button type="submit" name="submit" className="btn btn-default">Send Query</button>
	                </form>
	            </div>           
		        </div>
			    </div>
			  </section>
			  <div className="container-fluid top50">
					<div className="row">			
						<iframe 
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15133.142748578537!2d73.91674022893866!3d18.515987698585178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c18d3fd3454d%3A0x38ae6b1008a0d0c4!2sMagarpatta+City%2C+Hadapsar%2C+Pune%2C+Maharashtra!5e0!3m2!1sen!2sin!4v1533706689587"
						 width="100%" height="450" frameBorder="0" style={{"border": "0"}} allowFullScreen></iframe>
					</div>	
				</div> 
				<Support />
	   </div>
    );
  }
}