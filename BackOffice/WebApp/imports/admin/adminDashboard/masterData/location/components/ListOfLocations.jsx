import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
// import ListOfLocations from './ListOfLocations.jsx';
import { Location } from '/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js';

class ListOfLocations extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      location : [],
      "subscription"  : {
      }   
    }; 
  }
  componentDidMount() {
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
  renderTableRow(){
    return this.props.location.map((location,index) =>{
      return <tr key={index}>
              <td> {location.country} </td>
              <td> {location.state} </td>
              <td> {location.city} </td> 
              <td> {location.area} </td> 
              <td> {location.pinCode} </td>
              <td>
                <a href={'/admin/ManageLocation/'+location._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
                <a href="#" id={location._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
                  <i className="fa fa-trash-o"></i>  
                </a>
              </td>
            </tr>;
      });
    }
    delete(e){
     e.preventDefault();
      let id = $(e.currentTarget).attr("id");
      swal({
        title: "Are you sure?",
        text: "You want to delete this location!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
      }, function(){
        Meteor.call("deleteLocation",id,function(error,result){
            if(error){
                console.log(error.reason);
            }else{
                swal("Done","Location has been deleted!", "success");
            }
        });

      });
    }

  render() {
       return (
        
                <div className="box-body ">  
                  <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="">List of Locations</h4>  
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding table-responsive masterDataTable">
                        <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                          <thead>
                              <tr>
                                  <th className="text-center">Country</th>
                                  <th className="text-center">State</th>
                                  <th className="text-center">City</th>
                                  <th className="text-center">Area</th>
                                  <th className="text-center">Pin Code</th>
                                  <th className="text-center">Actions</th>
                              </tr>
                          </thead>                       
                          <tbody>
                              {this.renderTableRow()}
                          </tbody>
                       </table>
                      </div>
                  </div>
                </div>
                 
        );
  } 

}
ListOfLocationsContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('location');
    const location  = Location.find({}).fetch() || [];
    // console.log("location",location);
    const loading    = !postHandle.ready();
    
      return {
          loading,
          location
      };
})(ListOfLocations);

export default ListOfLocationsContainer;