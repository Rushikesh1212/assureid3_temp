import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { ChecklistFieldExpert } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';

class ListOfCheckList extends TrackerReact(Component) {
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
  renderTableRow(){
    return this.props.checkList.map((checkListDetails,index) =>{

      return <tr key={index}>
              <td> {checkListDetails.checkListFor} </td>
              <td> {checkListDetails.task} </td>
              <td> {checkListDetails.checkListFrom} </td>
              <td>
                <a href={'/admin/Checklist/'+checkListDetails._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
                <a href="#" id={checkListDetails._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
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
	      Meteor.call("deleteCheckList",id,function(error,result){
	          if(error){
	              console.log(error.reason);
	          }else{
	              swal("Done","Your Check List has been deleted!.", "success");
	          }
	      });

	    });
	  }

  render() {
    if (!this.props.loading) {
      return (
        <div className="box-body ">  
          <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h4 className="">List Of Check List</h4>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding table-responsive masterDataTable">
              <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                  <thead>
                      <tr>
                          <th className="text-center">Checklist For</th>
                          <th className="text-center">Task</th>
                          <th className="text-center">Checklist From</th>
                          <th className="text-center">Actions</th>
                      </tr>
                  </thead>
                 
                  <tbody>
                      {this.props.checkList ? 
                        this.props.checkList.length > 0 ? 
                          this.renderTableRow()
                          :
                          <tr className="col-lg-12">
                              <div className="col-lg-12">
                                <label className ="nodata">Nothing To Dispaly</label>
                              </div>
                          </tr>
                        :
                          <tr className="col-lg-12">
                              <div className="col-lg-12">
                                <label className ="nodata">Nothing To Dispaly</label>
                              </div>
                          </tr>
                      }
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }else{
      return(
        <span>Loading</span>
        );
    }
       
  } 

}
LisstOfCheckListContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('checklistFieldExpert');
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const checkList  = ChecklistFieldExpert.find({},{sort : {createdAt: -1 }}).fetch() || [];
    const loading    = !postHandle.ready();
    
      return {
          loading,
          checkList
      };
})(ListOfCheckList);

export default LisstOfCheckListContainer;
