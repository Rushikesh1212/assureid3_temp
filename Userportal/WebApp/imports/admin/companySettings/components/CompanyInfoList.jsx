import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class CompanyInfoList extends TrackerReact(Component) {
    

    delLocation(event){
    	event.preventDefault();
    	var selectedLocation = this;
		var targetedID = event.currentTarget.id;
       	
       	Meteor.call('removeCompanyLocation', targetedID);
    }

    editLocation(event){
    	event.preventDefault();
    	$(".CLcompanyLocation").val(this.props.companyLocationDataVales.companyLocation);
        $(".CLcompanyAddress").val(this.props.companyLocationDataVales.companyAddress);
        $(".CLcompanyPincode").val(this.props.companyLocationDataVales.companyPincode);
        $(".CLcompanyCity").val(this.props.companyLocationDataVales.companyCity);
        $(".CLcompanyState").val(this.props.companyLocationDataVales.companyState);
        $(".CLcompanyCountry").val(this.props.companyLocationDataVales.companyCountry);  
        if ($(".compLocation").text("Submit"))
      	{			
        	$(".compLocation").html("Update");
      	}
      	$('.CLcompanyAddress').prop('disabled', true);
      	Session.set('location',this.props.companyLocationDataVales.companyLocation);
    }

	render(){

       return(
				<tr>
					<td> {this.props.companyLocationDataVales.companyLocation}</td>			
					<td> {this.props.companyLocationDataVales.companyAddress}</td>			
					<td> {this.props.companyLocationDataVales.companyPincode}</td>			
					<td> {this.props.companyLocationDataVales.companyCity}</td>			
					<td> {this.props.companyLocationDataVales.companyState}</td>			
					<td> {this.props.companyLocationDataVales.companyCountry}</td>			
					<td> 
						<button onClick={this.editLocation.bind(this)} className="editInfo fa fa-pencil-square-o"></button>	
						<button className= "locationDelete fa fa-trash delIcon detailsCenter" data-toggle="modal" data-target={`#del-${this.props.companyLocationDataVales.companyLocation}`}></button>

						 <div className="modal fade" id={`del-${this.props.companyLocationDataVales.companyLocation}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete Company Location</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delLocation.bind(this)} id={this.props.companyLocationDataVales.index} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
				    			  <button type="button" data-dismiss="modal" className="btn btn-primary ">Cancel</button>
						        </div>
						      </div>
						    </div>
						  </div>					
					</td>		
				</tr>
	    );

	} 

}