import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { QualificationLevel } from '/imports/admin/adminDashboard/masterData/qualification/api/QualificationLevel.js';

class ListOfQualificationLevel extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      qualificationLevel : [],
      "subscription"  : {
        "qualificationLevel" : Meteor.subscribe("qualificationLevel"),
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
    return this.props.qualificationLevel.map((qualificationLevel,index) =>{
      return <tr key={index}>
              <td> {qualificationLevel.QualificationLevelTitle} </td>
              <td>
                <a href={'/admin/Qualification/'+qualificationLevel._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
                <a href="#" id={qualificationLevel._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
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
        text: "You want to delete this page!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
      }, function(){
        Meteor.call("deleteQualificationLevel",id,function(error,result){
            if(error){
                console.log(error.reason);
            }else{
                swal("Done","Your news has been deleted!.", "success");
            }
        });

      });
    }

  render() {
       return (
        
                <div className="box-body ">  
                  <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="">List Of Qualifications</h4>  
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding table-responsive masterDataTable">
                      <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                          <thead>
                              <tr>
                                  <th className="text-center">Title</th>
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
ListOfQualificationLevelContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('qualificationLevel');
    const qualificationLevel  = QualificationLevel.find({}).fetch() || [];
    // console.log("location",location);
    const loading    = !postHandle.ready();
    
      return {
          loading,
          qualificationLevel
      };
})(ListOfQualificationLevel);

export default ListOfQualificationLevelContainer;