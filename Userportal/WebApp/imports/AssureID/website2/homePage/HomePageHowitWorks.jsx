import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class HomePageHowitWorks extends TrackerReact(Component){
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
      <section id="work" className="hero">
        <div className="inner">   
          <div className="container">             
            <div className="row">
              <div className="services_heading">
                <h3>HOW IT <span>WORKS</span></h3>
              </div>
            </div>          
            <div className="row">
              <div className="box-row">         
                <div className="col-md-3 col-sm-6">       
                  <div className="list_item lists_1 clearfix">
                    <div className="list_left list_icon"><i className="fa fa-id-card"></i></div>
                    <div className="list_right">
                      <h4>IDENTIFY </h4>
                      <p>Online: Keywords related to the concerned risk area is tracked every 24 hours on the web. The AI  system crunches data from millions of web pages from across the globe to identify any suspicious information. </p>
                      <div className="desc"></div>
                    </div>
                  </div>        
                </div>          
                <div className="col-md-3 col-sm-6">       
                  <div className="list_item lists_1 clearfix">
                    <div className="list_left list_icon"><i className="fa fa-check"></i></div>
                    <div className="list_right">
                      <h4>EVALUATE </h4>
                      <p>The team of expert analysts at AssureID scans, extracts and analyses the minutest bits of relevant information from the heap of acquired data. </p>
                      <div className="desc"></div>
                    </div>
                  </div>        
                </div>          
                <div className="col-md-3 col-sm-6">       
                  <div className="list_item lists_1 clearfix">
                    <div className="list_left list_icon"><i className="fa fa-tags"></i></div>
                    <div className="list_right">
                      <h4>CLASSIFY </h4>
                      <p>All the potential risks, when identified, are divided into various categories according to the relevant risk areas. This aids to narrow down the search criteria. </p>
                      <div className="desc"></div>
                    </div>
                  </div>        
                </div>
                <div className="col-md-3 col-sm-6">       
                  <div className="list_item lists_1 clearfix">
                    <div className="list_left list_icon"><i className="fa fa-list"></i></div>
                    <div className="list_right">
                      <h4>SUMMARISE </h4>
                      <p>Every identified risk is summarised into a context easy to be understood by you. Thus saving you time and effort to understand them. </p>
                      <div className="desc"></div>
                    </div>
                  </div>        
                </div>                
              </div>
            </div>
          </div>    
        </div>
     </section> 
  	);
  }
}