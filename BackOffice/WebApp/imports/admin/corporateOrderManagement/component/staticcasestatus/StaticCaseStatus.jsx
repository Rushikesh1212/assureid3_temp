import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';

export default class StaticCaseStatus extends TrackerReact(Component) {
    constructor(props) {
        super(props); 
    }

    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h5 className="caseHead">Case Status</h5>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockwrap bgOrange">
                        Case Initiated
                    </div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockwrap bgYellow">
                        Verification Started
                    </div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockwrap bgLightOrange">
                        Verification Completed
                    </div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockwrap bgPGeen">
                        Review In Progress
                    </div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockwrap bgGeen">
                        Report Generating
                    </div>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blockwrap bgBlue">
                        Completed
                    </div>
                </div>
            </div>
        )
    }

}