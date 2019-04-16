import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class DashboardFooter extends TrackerReact(Component){
 constructor(){
    super(); 
    this.state ={  
      "subscription" : {
      } 
    }
  }

  render(){
  	return(
  		<footer className="main-footer">
        <div className="pull-right hidden-xs">
        </div>
{/*        <strong>Copyright © 2018 <a href="http://iassureit.com" target="_blank">iAssure International Technologies Pvt. Ltd.</a></strong> All rights
        reserved.
*/}
       Copyright © 2018 iAssure International Technologies Pvt. Ltd. All rights
        reserved.
      </footer>
  		);
  }
}