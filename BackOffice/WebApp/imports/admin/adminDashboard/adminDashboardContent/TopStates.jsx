import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';


export default class TopStates extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }
    render(){
        return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock innerblock1 tableinnetWrap tableinnetWrap1 noLRPad">
                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel">Top States                    
                        <span>
                            <a href="/admin/assignedtickets" title="View All">
                                {/* <i className="fa fa-arrow-right pull-right arrowcolor" aria-hidden="true"></i> */}
                            </a>
                        </span>
                    </label>

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-8 col-lg-offset-2 col-md-8 col-sm-12 col-xs-12 horizontalwrap">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Maharashtra</span><span className="pull-right">160/200</span></div>                                 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-blue"></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Goa</span><span className="pull-right">152/200</span></div>                                                                                             
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-red"></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Delhi</span><span className="pull-right">142/200</span></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-green"></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Kerla</span><span className="pull-right">130/200</span></div>                                                                                                                                                         
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-yellow"></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Sikkim</span><span className="pull-right">100/200</span></div>                                 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-blue"></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Jammu and Kashmir</span><span className="pull-right">180/200</span></div>                                                                                             
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-red"></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Puducherry</span><span className="pull-right">170/200</span></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-green"></div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead noLRPad"><span className="pull-left">Punjab</span><span className="pull-right">200/200</span></div>                                                                                                                                                         
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-yellow"></div>
                           {/* <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 stateHead">Kokan</label>                                 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-secondary"></div>
                            <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Aur stateHeadangabad</label>                                 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statediv bg-warning"></div> */}
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}
