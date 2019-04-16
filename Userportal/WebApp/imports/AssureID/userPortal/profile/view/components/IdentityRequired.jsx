import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { UserProfile } from '/imports/AssureID/userPortal/api/userProfile.js';
import StatutoryForm from '/imports/AssureID/userPortal/profile/forms/components/StatutoryForm.jsx';

export default class IdentityRequired extends TrackerReact(Component) {
  	constructor(props){
	    super(props); 
			this.state ={
			"subscription" : {   
				"userProfileData" : Meteor.subscribe("userProfileData"),
			} 
		  }
   	}
  	handleChangeIdentity(event){
  		const target    = event.target;
	    const value     = target.type === 'checkbox' ? target.checked : target.value;
	    const name      = target.name; 
	    var cardvalue   = $(event.currentTarget).attr('data-identity');
	    this.props.userData.identity[cardvalue] = value;
	     this.setState({
	      [name]: value, 
	     });
  	}
  	render() {
  		// console.log("serviceDetails",this.props.serviceDetails);
	    return (  
	        <div>
		       {
				  	this.props.serviceDetails.selectedCard && this.props.serviceDetails.selectedCard.length>0 ?
						this.props.serviceDetails.selectedCard.map((data,index)=>{
							var text    = '';
							var image1  = '';
							var image2  = '';
							var id      = '';
							var heading = '';
							var value   = '';
							var cardvalue = false;
              var cardName = '';
							if(data.cardName == "AadharForms" && data.value == true){
								if(this.props.userData.identity){
									if(this.props.userData.identity.adharCardNo || this.props.userData.identity.adharCardChkid){
										text   = this.props.userData.identity.adharCardNo;
										value  = "Aadhar Card : "+this.props.userData.identity.adharCardChkid;																		
									}else{
										text = "Please Add Information";			
										value = "";								
									}
									
									image1 = this.props.userData.identity.aadhar1;
									image2 = this.props.userData.identity.aadhar2;
									id     = this.props.userData.identity.adharCardChkid;
									cardvalue  = this.props.userData.identity.adharCardvalue;
                  cardName   = 'adharCardvalue';
								}else{
									text = "Please Add Information";			
									value = "";								
								}
								heading = "Aadhar Card";
							}
							if(data.cardName == "PanCardForm" && data.value == true ){
								if(this.props.userData.identity){
									if(this.props.userData.identity.panCardNo || this.props.userData.identity.panCardChkid){
										text   = this.props.userData.identity.panCardNo;
										value  = "Pan Card : "+this.props.userData.identity.panCardChkid;
																					
									}else{
										text  = "Please Add Information";	
										value = "";											
									}
									image1 = this.props.userData.identity.pan1;
									image2 = this.props.userData.identity.pan2;
									id     = this.props.userData.identity.panCardChkid;
									cardvalue  = this.props.userData.identity.panCardvalue;
  							  cardName   = 'panCardvalue';
								}else{
									text = "Please Add Information";			
									value = "";								
								}
								heading = "Pan Card";
							}

							if(data.cardName == "DrivingLicenseForm" && data.value == true){
								if(this.props.userData.identity){
									if(this.props.userData.identity.drivingCardNo || this.props.userData.identity.drivingCardchkid){
										text   = this.props.userData.identity.drivingCardNo;
										value  = "Driving License : "+this.props.userData.identity.drivingCardchkid;
																					
									}else{
										text = "Please Add Information";
										value = "";
									}
									image1 = this.props.userData.identity.driving1;
									image2 = this.props.userData.identity.driving2;
									id     = this.props.userData.identity.drivingCardchkid;
									cardvalue  = this.props.userData.identity.drivingCardvalue;
									cardName   = 'drivingCardvalue';
								}else{
									text = "Please Add Information";			
									value = "";								
								}
								heading = "Driving License ";
							}
							
							if(data.cardName == "VotingForm" && data.value == true){
								if(this.props.userData.identity){
									if(this.props.userData.identity.votingCardNo || this.props.userData.identity.votingCardchkid){
										text   = this.props.userData.identity.votingCardNo;
										value  = "Voting Card : "+this.props.userData.identity.votingCardchkid;
																		
									}else{
										text = "Please Add Information";
										value = "";
									}
									image1 = this.props.userData.identity.voting1;
									image2 = this.props.userData.identity.voting2;
									id     = this.props.userData.identity.votingCardchkid;
									cardvalue  = this.props.userData.identity.votingCardvalue;
									cardName   = 'votingCardvalue';
								}else{
									text = "Please Add Information";			
									value = "";								
								}	
								heading = "Voting Card ";
							}

							if(data.cardName == "RationCardForm" && data.value == true){
								if(this.props.userData.identity){
									if(this.props.userData.identity.rationCardNo || this.props.userData.identity.rationCardNo){
										text   = this.props.userData.identity.rationCardNo;	
										value  = "Ration Card : "+this.props.userData.identity.rationCardchkid;
																		
									}else{
										text  = "Please Add Information";
										value = "";
									}
									image1 = this.props.userData.identity.ration1;
									image2 = this.props.userData.identity.ration2;
									id     = this.props.userData.identity.rationCardchkid;
									cardvalue  = this.props.userData.identity.rationCardvalue;
									cardName   = 'rationCardvalue';
								}else{
									text = "Please Add Information";			
									value = "";								
								}
								heading = "Ration Card ";
							}
							if(data.cardName == "PassportForm" && data.value == true){
								if(this.props.userData.identity){
									if(this.props.userData.identity.passportNo || this.props.userData.identity.passportchkid){
										text   = this.props.userData.identity.passportNo;	
										value  = "Passport : "+this.props.userData.identity.passportchkid;
																				
									}else{
										text = "Please Add Information";
										value = "";
									}
									image1 = this.props.userData.identity.passport1;
									image2 = this.props.userData.identity.passport2;
									id     = this.props.userData.identity.passportchkid;
									cardvalue  = this.props.userData.identity.passportvalue;
									cardName   = 'passportvalue';
								}else{
									text = "Please Add Information";			
									value = "";								
								}
								heading = "Passport Card ";
							}
							if(data.value == true){
							 // console.log("cardvalue",cardvalue);
						   // console.log("value",value);
							return(
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerIdentityDiv NOpadding" key={index}> 
									
										{
											this.props.userData ?
											<i className="fa fa-pencil add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" data-toggle="modal" data-target={"#identityinfo-"+index} title="Edit Information"></i>
											:
											""
										}
										
										<div className="modal fade" id={"identityinfo-"+index} role="dialog">
											<div className="modal-dialog">
												<div className="modal-content">
												<div className="modal-body">
													<button type="button" className="close" data-dismiss="modal">&times;</button>
													<div className="row">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<h4 className="text-center">Edit Identity Information</h4>
														<br/>
														<StatutoryForm cardName={data.cardName} cardValue={data.value} identityValues={this.props.userData.identity}/>
													</div>
													</div>
												</div>
												</div> 
											</div>
										</div>
										<div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile">
											<input type="checkbox" className="reqInfocheck" name="identityCheck" data-present="StatutoryForm" id={id} checked={cardvalue} data-identity={cardName} value={value} onChange={this.handleChangeIdentity.bind(this)}/>
										</div>
										<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 basicInfoInner">
											<h5>{heading}</h5>
											<p>{text}</p>
										</div>
										<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
											{
												image1 ?
												<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 outerpaddingForMobile"> 
													<div>
														<div className="userImageOnServiceOuter">
															<img src={image1} className="img-responsive userImageOnService"/>
														</div>
													</div>
												</div>
												:
												null
											}
											{
												image2 ?
													<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 outerpaddingForMobile"> 
														<div>
														<div className="userImageOnServiceOuter">
																<img src={image2} className="img-responsive userImageOnService"/>
														</div>
														</div>   				                          
													</div>
												:
												null
											}
											
										</div>		
										</div>
							);}
										
						})
						:
						<div>Sorry No Information Available</div>
						 
					 }
		    </div>
		);
	}

}