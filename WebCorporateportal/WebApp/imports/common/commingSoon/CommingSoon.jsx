import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class CommingSoon extends TrackerReact(Component){
	constructor(){ 
    	super(); 
    		this.state ={  
      		"subscription" : {
      		} 
    	}
  	}

  	render() {  
    	return (
    		<div>
    			<h1>Comming Soon</h1>
    		</div>
    	);
    }
}