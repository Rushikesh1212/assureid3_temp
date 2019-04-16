import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class WebsiteFooter extends TrackerReact(Component){
	constructor(){ 
    super(); 
    this.state ={  
      // "searchArray"  : [],
      "subscription" : {
      } 
    }
  }
  componenetDidMount(){

  }
  render(){
  	return(
      <footer className="newFooter">
        <div className="container"> 
          <div className="row">
            <div className="col-sm-6">
            © 2018 A S S U R E I D
            </div>
            <div className="col-sm-6">
              <div className="pull-right">Privacy Policy | Terms & Conditions</div>
            </div>
          </div>          
        </div>      
      </footer>
  	);
  }
}