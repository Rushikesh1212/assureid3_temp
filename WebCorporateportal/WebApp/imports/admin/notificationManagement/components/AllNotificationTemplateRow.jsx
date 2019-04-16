import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
export default class AllNotificationTemplateRow extends TrackerReact(Component){
	constructor(){
		super();
		this.state ={
			"subscription" : {
				"userData" : Meteor.subscribe('userData',Meteor.userId()),
			}
		}
	}

	deleteTemplate(event){
		event.preventDefault();
		var tempId = $(event.target).attr('id');
		swal({
        title: "Are you sure?",
        text: "You want to delete this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
      }, function(){
				Meteor.call('removeTemplate',tempId,function(error,result){
					if(error){
						console.log(error);
					}else{
					   swal('Deleted Successfully !!');
					}
				});
     });
	}

	userRole(){
		var userObj = Meteor.users.findOne({"_id" : Meteor.userId()});
		if(userObj){
			if(userObj.roles.length > 0){
	        	var userRole = userObj.roles[0];
	      	}else{
	        	var userRole = '';
	      	}
		}else{
	      var userRole = '';
	    }

	    return userRole; 
	}

	render() {
		
			var text= this.props.notificationtemplateValues.content;
			var regex = new RegExp("</p><p>", 'g');
			text = text.replace(regex, '\n');
			var strippedText = $("<div/>").html(text).text();
	       return (
	       		<div className="contentBox">
	       		{this.userRole() == 'superAdmin' ?
		       		<div className="pull-right actionBtn">
						<span className="col-xs-2 editTemp"><a href={`/admin/createTemplate/${this.props.notificationtemplateValues._id}`}><i className="fa fa-pencil" aria-hidden="true" id={this.props.notificationtemplateValues._id}></i></a></span>
						<span onClick={this.deleteTemplate.bind(this)} className="col-xs-2"><i className="fa fa-trash" aria-hidden="true" id={this.props.notificationtemplateValues._id}></i></span>
					</div>
				:
				""
				}
				
				<div className="row inputrow">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="form-group">
						 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label>     						
						 <textarea className="form-control noBorderBox" rows="5" value={strippedText}></textarea>
						</div>	
					</div>
				</div>
				</div>
		    );


	} 

}