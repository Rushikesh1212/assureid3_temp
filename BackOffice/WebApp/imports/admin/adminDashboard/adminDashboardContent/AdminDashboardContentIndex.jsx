import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
// import TotalNoOfCases from '/imports/admin/adminDashboard/adminDashboardContent/TotalNoOfCases.jsx';
// import TotalInFlowTickets from '/imports/admin/adminDashboard/adminDashboardContent/TotalInFlowTickets.jsx';
// import TopStates from '/imports/admin/adminDashboard/adminDashboardContent/TopStates.jsx';
// import TotalBusiness from '/imports/admin/adminDashboard/adminDashboardContent/TotalBusiness.jsx';
// import CustomerComplaints from '/imports/admin/adminDashboard/adminDashboardContent/TotalBusiness.jsx';
import StatisticsMasterForAdmin from '/imports/admin/adminDashboard/adminDashboardContent/StatisticsMasterForAdmin.jsx';

export default class AdminDashboardContentIndex extends TrackerReact(Component){
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
            
             
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tablewrap">
                {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                <TotalNoOfCases />
                </div>
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
                </div>*/}
                <StatisticsMasterForAdmin/>
              </div>
          

          </section>


          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}