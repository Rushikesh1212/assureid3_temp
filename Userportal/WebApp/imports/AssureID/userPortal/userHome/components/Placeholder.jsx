import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

export default class Placeholder extends TrackerReact(Component) {
	render() {
    return (
    	<div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 outerpaddingForMobile">
	      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding landingBlocks placeholderVerBlock">
	        <h5 className="text-center"><b>Placeholder</b></h5>
	      </div>
	    </div>
    );
  }
} 
