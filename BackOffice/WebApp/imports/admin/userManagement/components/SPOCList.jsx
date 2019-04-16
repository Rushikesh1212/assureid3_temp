import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
import { Email } from 'meteor/email';

class SPOCList extends TrackerReact(Component) {
	constructor(props) {
	    super(props); 
	    this.state = {
	      "subscription"  : {
	      
	      }  
	    }; 
	} 
	componentDidMount() {
	    $("html,body").scrollTop(0);
	    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
	    	var adminLte = document.createElement("script");  
	    	adminLte.type="text/javascript";  
	    	adminLte.src = "/js/adminLte.js";  
	    	$("body").append(adminLte);  
	    }
	}
	componentWillMount() {

	}
	componentWillUnmount(){
  	$("script[src='/js/adminLte.js']").remove(); 
	}
	render() {
 		return (
	    <div className="content-wrapper">
	      	<section className="content-header">
	        	<h1> Corporate Management </h1>
	        	<ol className="breadcrumb">
	          		<li><a href="#"><i className="fa fa-file-o"/> Corporate Management</a></li>
	          		<li className="active">List Of SPOC's</li>
	        	</ol>
	      	</section>
	       	<section className="content">
	        	<div className="row">
	           		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	             		<div className="box box-primary">
	                		<div className="box-header with-border">
	                 			<h2 className="box-title">List Of SPOC's</h2>  
	                		</div>
		                	<div className="box-body">  
		                  		<div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive">
		                    		<table className="display table table-bordered servicesTable">
		                      			<thead className="table-head">
		                          			<tr>
		                              			<th>Name</th>
		                              			<th>Email</th>
		                              			<th>Contact Number</th>
		                              			<th>Location</th>
											  	<th>Corporate Name</th>
     											<th>Company AssureID</th> 
		                              			{/*<th>Action</th>*/}
		                          			</tr>
		                      			</thead>
		                      			{!this.props.loading ? 
		                      				<tbody>
		                      					{
		                      						this.props.spocList.map((spoc,index)=>{
		                      							return(
		                      								<tr key={index}>
		                      									<td>{spoc.name}</td>
		                      									<td>{spoc.email}</td>
		                      									<td>{spoc.contact}</td>
		                      									<td>{spoc.location?spoc.location:'-'}</td>
															  	<td>{spoc.corpName}</td>
		                      									<td>{spoc.corpAssureID}</td>																  	
		                      								</tr>
		                      							);
		                      						})
		                      					}	
		                      				</tbody>
		                      			:
					                          <tbody>
					                            <tr>Loading</tr>
					                          </tbody>
					                    }
		                    		</table>
		                  		</div>
		                	</div>
	             		</div>
	            	</div>
	         	</div>
	       	</section>
	    </div>
  	);
	}
}
SPOCListContainer = withTracker(({props}) => {
	const postHandle    = Meteor.subscribe("spocListCorp",);
    const companies      = CompanyProfile.find({}).fetch()||[];
    // console.log('companies ',companies);
    var spocList = [];
    // var spoc = {}
    if(companies && companies.length > 0){
    	for(i = 0 ; i < companies.length ; i++){
    		var userHandle  = Meteor.subscribe('userData',companies[i].userId);      
	        const userDetails = Meteor.users.findOne({'_id':companies[i].userId});
	        if(userDetails && userDetails.profile && userDetails.profile.authorizedPerson && userDetails.profile.authorizedPerson.length>0){
	        	// console.log('userDetails ',userDetails);
	        	for(j=0;j < userDetails.profile.authorizedPerson.length; j++){
		    		var spoc = {
		    			name 			: userDetails.profile.authorizedPerson[j].accessPersonName,
			    		email 			: userDetails.profile.authorizedPerson[j].address,
			    		contact 		: userDetails.profile.authorizedPerson[j].accessPersonContact,
			    		corpName 		: companies[i].companyName,
			    		corpAssureID 	: companies[i].companyAssureID,
			    		location 		: userDetails.profile.authorizedPerson[j].accessPersonAddress,
		    		};
		    		spocList.push(spoc);
	        	}
	        }
    	}
    }
    // console.log('spocList data ',spocList);
	// var loading = false;
 //    spocList = [
 //    	{
 //    		name 			: 'Nilam Badadhe',
 //    		email 			: 'nilub04@gmail.com',
 //    		contact 		: '9604584418',
 //    		corpName 		: 'i Assure International Technologies',
 //    		corpAssureID 	: 'IN-CAA-000002',
 //    	},
 //    	{
 //    		name 			: 'Nilam Badadhe',
 //    		email 			: 'nilub04@gmail.com',
 //    		contact 		: '9604584418',
 //    		corpName 		: 'i Assure International Technologies',
 //    		corpAssureID 	: 'IN-CAA-000002',
 //    	},
 //    	{
 //    		name 			: 'Nilam Badadhe',
 //    		email 			: 'nilub04@gmail.com',
 //    		contact 		: '9604584418',
 //    		corpName 		: 'i Assure International Technologies',
 //    		corpAssureID 	: 'IN-CAA-000002',
 //    	},
 //    	{
 //    		name 			: 'Nilam Badadhe',
 //    		email 			: 'nilub04@gmail.com',
 //    		contact 		: '9604584418',
 //    		corpName 		: 'i Assure International Technologies',
 //    		corpAssureID 	: 'IN-CAA-000002',
 //    	},
 //    ];
 	const loading       = !postHandle.ready();
    return {
      loading,
      spocList,
    };
})(SPOCList);
export default SPOCListContainer;
