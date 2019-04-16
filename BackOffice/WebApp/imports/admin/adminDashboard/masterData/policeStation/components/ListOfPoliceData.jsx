import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { PoliceStation } from '/imports/admin/adminDashboard/masterData/policeStation/api/PoliceStation.js';

class ListOfPoliceStation extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      policeStation : [],
      "subscription"  : {
        "policeStation" : Meteor.subscribe("policeStation"),
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
  renderTableRow(){
    return this.props.policeStation.map((policeStation,index) =>{

      return <tr key={index}>
              <td> {policeStation.policeStationName} </td>
              <td> {policeStation.policeStationAddressLine1} </td>
              <td> {policeStation.policeStationAddressLine2} </td>
              <td> {policeStation.policeStationAddressLine3} </td>
              <td> {policeStation.country} </td>
              <td> {policeStation.state} </td>
              <td> {policeStation.city} </td>
              <td> {policeStation.area} </td>
              <td> {policeStation.pinCode} </td>
              <td>
                <a href={'/admin/PoliceStation/'+policeStation._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
                <a href="#" id={policeStation._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
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
        text: "You want to delete this police data!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
      }, function(){
        Meteor.call("deletePoliceStation",id,function(error,result){
            if(error){
                console.log(error.reason);
            }else{
                swal("Done","Police station has been deleted!.", "success");
            }
        });

      });
    }

  render() {
       return (
        
                <div className="box-body ">  
                  <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="">List Of Police Stations</h4>  
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding table-responsive masterDataTable">
                        <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Police station name</th>
                                    <th>Address Line 1</th>
                                    <th>Address Line 2</th>
                                    <th>Address Line 3</th>
                                    <th>Country</th>
                                    <th>State</th>
                                    <th>City</th>
                                    <th>Area</th>
                                    <th>Pin Code</th>
                                    <th>Actions</th>
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
ListOfPoliceStationContainer = withTracker(({props}) => {
    const postHandle     = Meteor.subscribe('policeStation');
    const policeStation  = PoliceStation.find({}).fetch() || [];
    // console.log("location",location);
    const loading    = !postHandle.ready();
    
      return {
          loading,
          policeStation
      };
})(ListOfPoliceStation);

export default ListOfPoliceStationContainer;