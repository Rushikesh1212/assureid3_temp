import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Services} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import {TempServiceImages} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
class ListOfServices extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      "subscription"  : {
        "packages" : Meteor.subscribe("packages"),
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
    return this.props.services.map((service,index) =>{
      // var text= service.servicesDescription;
      // var regex = new RegExp("</p><p>", 'g');
      // text = text.replace(regex, '\n');
      return <tr key={index}>
              <td><img src={service.image} className="img-responsive serviceLogo" /></td>
              <td className="text-capitalize serviceNameStyle"> {service.serviceFor} </td>
              <td className="serviceNameStyle"> {service.serviceName} </td>
              <td className="commoninputstyle"> {service.serviceRate} </td>
              <td className="commoninputstyle">{service.serviceDayNumbers}</td>
              <td>
                <a href={'/admin/EditService/'+service._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
             
                <a href="#" id={service._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
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
      text: "You want to delete this service!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Continue",
      closeOnConfirm: false,
      html: false
    }, function(){
      var selctedpackage = [];
      var allPackages = Packages.find({}).fetch();
      if (allPackages) {
        for (var i = 0; i < allPackages.length; i++) {
          var selectedServices = allPackages[i].selectedServices;
          for (var j = 0; j < selectedServices.length; j++) {
            if (id == selectedServices[j].serviceId) {
              var matchedService = selectedServices[j];
              if (matchedService.value == true) {
                selctedpackage.push(allPackages[i]);
              }
            }
          }
        }
      }
      if (selctedpackage) {
        if (selctedpackage.length > 0) {
         swal({
          title: "Are you sure?",
          text: "You want to delete this service, it is already added in package then package will be inactive",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false,
          html: false
        }, function(){
          for (var i = 0; i < selctedpackage.length; i++) {         
             var packageId = selctedpackage[i]._id;
               Meteor.call('updatePackageStatus',packageId,function(error,result){
                 if (error) {
                   console.log(error.reason);
                 }else{
                   
                 }
               });
            }
             Meteor.call("deleteService",id,function(error,result){
                if(error){
                    console.log(error.reason);
                }else{
                    // Bert.alert("Successfully Deleted..!!");
                    swal("Done","Your page has been deleted!.", "success");
                }
            });
          });
        }else{
          Meteor.call("deleteService",id,function(error,result){
              if(error){
                  console.log(error.reason);
              }else{
                  // Bert.alert("Successfully Deleted..!!");
                  swal("Done","Your page has been deleted!.", "success");
              }
          });
        }
      }
    });
  }

  render() {
    if (!this.props.loading) {
      return (
        <div className="content-wrapper">
          <section className="content-header">
            <h1> Service Management </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-briefcase" />Service Management</a></li>
              <li className="active">List Of Services</li>
            </ol>
          </section>
           <section className="content">
             <div className="row">
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <div className="box box-primary">
                    <div className="box-header with-border">
                     <h2 className="box-title">List Of Services</h2>  
                    </div>
                    <div className="box-body ">  
                      <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                          <thead>
                              <tr>
                                  <th>Logo</th>
                                  <th>Service For</th>
                                  <th>Service Name</th>
                                  <th>Service Rate</th>
                                  <th>Service Duration</th>
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
                </div>
             </div>
           </section>
        </div>
      );
    }else{
      return(
         <span>Loading</span>
        );
    } 
  }

}
ListOfServicesContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('services');
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const services  = Services.find({}).fetch() || [];
    const loading    = !postHandle.ready();
    
      return {
          loading,
          services
      };
})(ListOfServices);

export default ListOfServicesContainer;