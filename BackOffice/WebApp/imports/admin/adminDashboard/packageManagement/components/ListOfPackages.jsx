import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Packages} from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
class ListOfPackages extends TrackerReact(Component) {
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
     // $("link[href='/css/dashboard.css']").remove();
  }
  // renderTableRow(){
  //   return(
      
  //   )
  // }
  
  delete(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("id");
    // var getBlogPages = BlogPages.findOne({"_id": id});
    // if (getBlogPages) {
      // var getblogImage = getBlogPages.blogImage;
      swal({
        title: "Are you sure?",
        text: "You want to delete this blog!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
      }, function(){
        Meteor.call("deletePackage",id,function(error,result){
            if(error){
                console.log(error.reason);
            }else{
                // Bert.alert("Successfully Deleted..!!");
                swal("Done","Your package has been deleted!.", "success");
            }
        });
      });
    // }
  }
  
  render() {
   return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1> Package Management </h1>
        <ol className="breadcrumb">
          <li>
            <a href="#"><i className="fa fa-files-o"/> Package Management</a></li>
          <li className="active">List Of Packages</li>
        </ol>
      </section>
       <section className="content">
         <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <div className="box box-primary">
                <div className="box-header with-border">
                 <h2 className="box-title">List Of Packages</h2>  
                </div>
                <div className="box-body">  
                  <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <table className="display table table-bordered servicesTable">
                      <thead className="table-head col-lg-12" style={{"padding":"0"}}>
                          <tr className="col-lg-12" style={{"padding":"0"}}>
                              <th className="col-lg-3">Package Name</th>
                              <th className="col-lg-2">Package Duration</th>
                              <th className="col-lg-4">Package Discount</th>
                              <th className="col-lg-3">Image</th>
                              <th className="col-lg-2">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                        { this.props.packages.map((packages,index) =>{
                          return( <tr className="col-lg-12" key={index}>
                                    <tr className="col-lg-12" >
                                      <td className="col-lg-3"> {packages.packageName} </td>
                                      <td className="col-lg-2"> {packages.packageDuration} Days </td> 
                                      <td className="col-lg-4">
                                        {packages.packageDiscount}
                                      </td>
                                      <td className="col-lg-3"><img src={packages.image} className="img-responsive serviceLogo" /></td>
                                      <td className="col-lg-2">
                                        <a href={'/admin/manageservicepackage/'+packages._id} className="editButton" title="Edit">
                                          <i className = "fa fa-pencil"> </i>
                                        </a>
                                           <a href="#" id={packages._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
                                            <i className="fa fa-trash-o"></i>  
                                          </a>
                                      </td>
                                  </tr>
                                  <tr className="col-lg-12 text-danger">
                                    { packages.packageStatus == "Inactive" ?
                                       <div className="col-lg-12">
                                       <span className="col-lg-12"> Service included in this packages is deleted, Edit it for active this package.</span>
                                        </div>
                                        :
                                        ""
                                    }
                                  </tr>
                                    
                                </tr>
                              )
                          })
                        }
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
  } 
}
ListOfPackagesContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe("adminpackages","Manual");
    const packages      = Packages.find({"createdBy" : "Manual"}).fetch()||[];
    // console.log("packages",packages);
    const loading       = !postHandle.ready();
    return {
      loading,
      packages,
    };
})(ListOfPackages);
export default ListOfPackagesContainer;