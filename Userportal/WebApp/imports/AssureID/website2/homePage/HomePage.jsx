import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import HomePageCarousal 	from '/imports/AssureID/website2/homePage/HomePageCarousal.jsx';
import HomePageServices 	from '/imports/AssureID/website2/homePage//HomePageServices.jsx';
import Sectors 				from '/imports/AssureID/website2/homePage/Sectors.jsx';
import HomePageHowitWorks 	from '/imports/AssureID/website2/homePage/HomePageHowitWorks.jsx';
import Support from '/imports/AssureID/website2/support/Support.jsx';

export default class HomePage extends TrackerReact(Component){
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
    			<HomePageCarousal />
          <HomePageServices />
          <Sectors />
          <HomePageHowitWorks />
          <Support />
    		</div>
    	);
    }
}