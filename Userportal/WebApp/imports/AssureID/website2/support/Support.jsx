import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class Support extends TrackerReact(Component){
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
    	  <div id="feedback">
					<a href="#popup1" >Support</a>
				</div>

				<div id="popup1" className="overlay1">
					<div className="popup">	
						<div className="div1" style={{"background" : "#fff"}}>			
							<a className="close" href="#">×</a>		 
							<div className="content1" id="quickenquire">
								<h3 style={{"textAlign": "center"}}>Send Enquiry</h3>
								<form action="#">
									<label htmlFor="name">Name</label>
									<input type="text" id="name" name="name" className="enquiryIp" />
									<label htmlFor="email">Email Id</label>
									<input type="email" id="email" name="email" className="enquiryIp"/>
									<label htmlFor="contact">Contact No</label>
									<input type="text" id="contact" name="contact" className="enquiryIp" />
									<label htmlFor="country">Country</label>
									<select id="country" name="country" className="enquiryIp">
										<option value="">-- Select Country --</option>
										<option value="australia">Australia</option>
										<option value="canada">Canada</option>
										<option value="usa">USA</option>
										<option value="usa">India</option>
									</select>				
									<label htmlFor="comment">Your Message</label>
									<textarea className="enquiryIp"></textarea>
									<input type="submit" value="Submit" />
								</form>
							</div>
						</div>
					</div>
				</div>
			  
    	</div>
    );
  }
}