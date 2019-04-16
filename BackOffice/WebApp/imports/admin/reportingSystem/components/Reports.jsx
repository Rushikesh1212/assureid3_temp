import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import {Tracker} from 'meteor/tracker';

// import { UserSubscriptions } from '/imports/website/contactUs/api/SubscriptionMaster.js';

import DailyReports from '/imports/dashboard/reports/DailyReports.jsx';
import WeeklyReports from '/imports/dashboard/reports/WeeklyReports.jsx';
import MonthlyReports from '/imports/dashboard/reports/MonthlyReports.jsx';
import YearlyReports from '/imports/dashboard/reports/YearlyReports.jsx';
import CustomisedReports from '/imports/dashboard/reports/CustomisedReports.jsx';


export default class Reports extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            'currentTabView': "Daily",
        }
        window.scrollTo(0, 0);
        
    }

    componentDidMount(){
        this.contactTracker = Tracker.autorun(()=>{
        //    var handle= Meteor.subscribe('usersubscriptionPublish');
       
        //    if(handle.ready()){
                
        //     }
        });
    }

    changeReportComponent(event){
      var currentComp = $(event.currentTarget).attr('data-currentComp');

      this.setState({
        'currentTabView': currentComp,
      })
    }
   
    render(){
        return( 
            
            <div>
              {/* Content Wrapper. Contains page content */}
              <div className="content-wrapper">
                {/* Content Header (Page header) */}
               
                {/* Main content */}
                <section className="content">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="box">
                        <div className="box-header with-border">
                          {/* <h3 className="box-title">
                            Sales Report
                          </h3> */}
                        
                        </div>
                        {/* /.box-header */}
                        <div className="box-body">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h3 className="reportTitleName">Sales Report</h3>
                                <hr/>

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="sales-report-main-class">
                                    <div className="sales-report-commonpre">
                                        <div  onClick={this.changeReportComponent.bind(this)} data-currentComp="Daily" className={this.state.currentTabView == "Daily" ? "sales-report-common sales-report-today report-currentlyActive" : "sales-report-common sales-report-today"}>
                                          Today
                                        </div>
                                        <div  onClick={this.changeReportComponent.bind(this)} data-currentComp="Weekly"  className={this.state.currentTabView == "Weekly" ? "sales-report-common sales-report-thisweek report-currentlyActive" : "sales-report-common sales-report-thisweek"}>
                                        This Week
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Monthly"  className={this.state.currentTabView == "Monthly" ? "sales-report-common sales-report-thismonth report-currentlyActive" : "sales-report-common sales-report-thismonth"}>
                                        This Month
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Yearly"  className={this.state.currentTabView == "Yearly" ? "sales-report-common sales-report-thisyear report-currentlyActive" : "sales-report-common sales-report-thisyear"}>
                                        This Year
                                        </div>
                                        <div onClick={this.changeReportComponent.bind(this)} data-currentComp="Customised"  className={this.state.currentTabView == "Customised" ? "sales-report-common sales-report-costomised report-currentlyActive" : "sales-report-common sales-report-costomised"}>
                                        Customised
                                        </div>
                                    </div>
                                  </div>
                                </div>

                                
                               {
                                  this.state.currentTabView == "Daily" ? <DailyReports /> : 
                                  this.state.currentTabView == "Weekly" ? <WeeklyReports /> : 
                                  this.state.currentTabView == "Monthly" ? <MonthlyReports /> : 
                                  this.state.currentTabView == "Yearly" ? <YearlyReports />: 
                                  <CustomisedReports />  
                                  
                               }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
      
              </div>
              {/* /.content-wrapper */}
            </div>
            
        );
    }
}