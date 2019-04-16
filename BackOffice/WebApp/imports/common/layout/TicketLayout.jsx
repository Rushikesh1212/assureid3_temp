import React,{Component} from 'react';

import DashboardHeader from '/imports/common/header/dashboardHeader/DashboardHeader.jsx';
import DashboardFooter from '/imports/common/footer/dashboardFooter/DashboardFooter.jsx';
import DashboardSidebar from '/imports/common/sidebar/dashboardSidebar/DashboardSidebar.jsx';
// import CaseSidebar      from '/imports/common/sidebar/caseSidebar/CaseSidebar.jsx';
import CaseSidebar     from '/imports/common/sidebar/caseSidebar/CaseSidebar.jsx';
import PropTypes        from 'prop-types';
import Login            from '/imports/systemSecurity/login/Login.jsx';
import { withTracker } from 'meteor/react-meteor-data';

const TicketLayout = ({loggingIn,isTicket,content})=>(
	<div>
    {loggingIn ?
     <div className="hold-transition skin-blue sidebar-mini">
       {isTicket ? 
         <div className="wrapper">
          <DashboardHeader />
          <div className="container-fluid">
            <div className="row">
            {/* {
              Roles.userIsInRole(Meteor.userId(),['admin','superAdmin']) ?
                <DashboardSidebar /> 
              :
              Roles.userIsInRole(Meteor.userId(),['screening committee','team leader','team member','field expert','quality team member','quality team leader']) ?
                <CaseSidebar />      
              
              : */}
              
              {/* Roles.userIsInRole(Meteor.userId(),['dispatch team','data entry operator']) ? */}
                <CaseSidebar />  
            
              {/* :
                null             

            } */}
              <div className="container-fluid main-container">
                <div className="row">       
          		    {content}          
          	  		<DashboardFooter />    
          			</div>
              </div>
            </div>
          </div>
         </div>
         :
         <div className="">
          <p>You are not autherized to view this page.</p>
        </div>
       }
     </div>  
    :
     <Login/>
    }
  </div>
   
); 
TicketLayout.propTypes = {
  loggingIn : PropTypes.bool,
  isTicket  : PropTypes.bool
};

export default TicketsLayout = withTracker(props => {

    const login    = Meteor.userId();
    if(login && Roles.userIsInRole(login, ['screening committee','team leader','team member','field expert','quality team member','quality team leader']) ){
      // console.log("in");
      var loggingIn = true;
      var isTicket   = true;
    }else if(login && !Roles.userIsInRole(login, ['screening committee','team leader','team member','field expert','quality team member','quality team leader'])){
      var loggingIn = true;
      var isTicket   = false;
    }else{
      var loggingIn = false;
      var isTicket   = false;
    }
    // console.log("loggingIn",loggingIn);
    // console.log("isDEO",isDEO);
    return {
        loggingIn,
        isTicket
    }

})(TicketLayout);

  