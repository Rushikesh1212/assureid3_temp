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
                <h5 className="caseHead">Status Legend</h5>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding outerledgerStatusBlock">
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-info">CR</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Case Received
                        </div> 
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-warning">PA</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Pending from Applicant
                        </div> 
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-primary">DEP</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Data Entry is in progress
                        </div> 
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-primary">VI</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                         Verification Initiated
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding outerledgerStatusBlock">
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-warning">VP</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                         Verification Is In Progress
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-info">VR</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                         Verification Received
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-warning">RP</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Review In Progress
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-danger">IS</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Insufficiency
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding outerledgerStatusBlock">
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-danger">CO</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Case Re-opened
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-info">RG</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Report Generating
                        </div>
                    </div>               
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 blockwrap Bg-success">C</div>
                        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 statusLabel"> 
                            Completed
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}