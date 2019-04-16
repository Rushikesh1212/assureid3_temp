import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { HolidaysList } from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js'

class ListOfHolidays extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
         
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
    return this.props.holidaysList.map((holidaysDetails,index) =>{

      return <tr key={index}>
              <td> {moment(holidaysDetails.holidayDate).format("DD MMM YYYY")} </td>
              <td> {holidaysDetails.holidayReason} </td>
              <td>
                <a href={'/admin/HolidayList/'+holidaysDetails._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
                {FlowRouter.getParam('id') == holidaysDetails._id ?
                   null
                  :
                   <a href="#" id={holidaysDetails._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
                    <i className="fa fa-trash-o"></i>  
                  </a>
                 }
              
              </td>
            </tr>;
      });
    }
    delete(e){
     e.preventDefault();
      let id = $(e.currentTarget).attr("id");
      swal({
        title: "Are you sure?",
        text: "You want to delete this field!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
      }, function(){
        Meteor.call("deleteHoliday",id,function(error,result){
            if(error){
                console.log(error.reason);
            }else{
                swal("Done","Field has been deleted!.", "success");
            }
        });

      });
    }

  render() {
    if (!this.props.loading) {
      return (
        <div className="box-body ">  
          <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h4 className="">List Of Holidays</h4>  
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding table-responsive masterDataTable">
              <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                  <thead>
                      <tr>
                          <th className="text-center">Holiday Date</th>
                          <th className="text-center">Holiday Reason</th>
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
    }else{
      return(
        <span>Loading</span>
        );
    }
    
  } 

}
ListOfHolidaysContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('holidaysList');
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const holidaysList  = HolidaysList.find({},{sort :{createdAt : -1}}).fetch() || [];
    const loading    = !postHandle.ready();
    
      return {
          loading,
          holidaysList
      };
})(ListOfHolidays);

export default ListOfHolidaysContainer;
