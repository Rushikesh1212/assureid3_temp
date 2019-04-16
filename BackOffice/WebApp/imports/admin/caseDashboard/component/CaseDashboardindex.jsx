import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import HeaderBlock from '/imports/admin/caseDashboard/component/HeaderBlock.jsx';
import AssignToMeTickets from '/imports/admin/caseDashboard/component/AssignToMeTickets.jsx';
import ReopenTickets     from '/imports/admin/caseDashboard/component/ReopenTickets.jsx';
import AllocatedTickets  from '/imports/admin/caseDashboard/component/AllocatedTickets.jsx';
import AllTickets        from '/imports/admin/caseDashboard/component/AllTickets.jsx';

export default class CaseDashboardindex extends TrackerReact(Component){
render(){
    return(
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper dashboardBackground">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>Dashboard 
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-dashboard" /> Home</a></li>
              <li className="active">Dashboard</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            {/* Info boxes */}
            {/* {Roles.userIsInRole(Meteor.userId(),['screening committee','team leader','team member','field expert','quality team member','quality team leader'])? */}
              <div>
                <div className="row">
                  <HeaderBlock /> 
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tablewrap">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <AssignToMeTickets />
                    
                  </div>
                  <div className="col-lg-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <ReopenTickets />                  
                  </div>
                  <div className="col-lg-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <AllocatedTickets />                             
                                        
                  </div>
                  <div className="col-lg-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">

                    <AllTickets />          
                    
                                        
                  </div>
                </div>
              </div>
            {/* : */}
             
              {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tablewrap">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                    <TotalInFlowTickets />          
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 chartwrapper">
                      <TopStates />          
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <TotalBusiness />          
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                    <CustomerComplaints />          
                </div>
              </div> */}
          

          </section>


          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}