import React,{Component} from 'react';

import DashboardHeader from '/imports/common/header/dashboardHeader/DashboardHeader.jsx';
import DashboardFooter from '/imports/common/footer/dashboardFooter/DashboardFooter.jsx';
import DashboardSidebar from '/imports/common/sidebar/dashboardSidebar/DashboardSidebar.jsx';
// import CaseSidebar      from '/imports/common/sidebar/caseSidebar/CaseSidebar.jsx';
import OrderSidebar     from '/imports/common/sidebar/orderSidebar/OrderSidebar.jsx';
import PropTypes        from 'prop-types';
import Login            from '/imports/systemSecurity/login/Login.jsx';
import { withTracker } from 'meteor/react-meteor-data';

const DispatchTeamLayout = ({loggingIn,isDT,content})=>(
	<div>
    {loggingIn ?
     <div className="hold-transition skin-blue sidebar-mini">
       {isDT ? 
        <div className="wrapper">
          <DashboardHeader />
          <div className="container-fluid">
            <div className="row">
                <OrderSidebar />  
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
DispatchTeamLayout.propTypes = {
  loggingIn : PropTypes.bool,
  isDT      : PropTypes.bool

};

export default DTLayout = withTracker(props => {

    const login    = Meteor.userId();
    if(login && Roles.userIsInRole(login, ['dispatch team']) ){
      // console.log("in");
      var loggingIn = true;
      var isDT   = true;
    }else if(login && !Roles.userIsInRole(login, ['dispatch team'])){
      var loggingIn = true;
      var isDT   = false;
    }else{
      var loggingIn = false;
      var isDT   = false;
    }
    // console.log("loggingIn",loggingIn);
    // console.log("isDEO",isDEO);
    return {
        loggingIn,
        isDT
    }

})(DispatchTeamLayout);

  