import React,{Component} from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import DashboardHeader  from '/imports/common/header/dashboardHeader/DashboardHeader.jsx';
import DashboardFooter  from '/imports/common/footer/dashboardFooter/DashboardFooter.jsx';
import DashboardSidebar from '/imports/common/sidebar/dashboardSidebar/DashboardSidebar.jsx';
import CaseSidebar      from '/imports/common/sidebar/caseSidebar/CaseSidebar.jsx';
import OrderSidebar     from '/imports/common/sidebar/orderSidebar/OrderSidebar.jsx';
import Login            from '/imports/systemSecurity/login/Login.jsx';
import PropTypes        from 'prop-types';

const AdminDashboardLayout = ({loggingIn,isAdmin,content})=>(
	 <div>
   {loggingIn ?
     <div className="hold-transition skin-blue sidebar-mini">
       {isAdmin ?
          <div className="wrapper">
            <DashboardHeader />
            <div className="container-fluid">
              <div className="row">
                  <DashboardSidebar />             
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
AdminDashboardLayout.propTypes = {
  loggingIn : PropTypes.bool,
  isAdmin   : PropTypes.bool

};

export default AdminLayout = withTracker(props => {

    const login    = Meteor.userId();
    if(login && Roles.userIsInRole(login, ['admin','superAdmin']) ){
      // console.log("in");
      var loggingIn = true;
      var isAdmin   = true;
    }else if(login && !Roles.userIsInRole(login, ['admin','superAdmin'])){
      var loggingIn = true;
      var isAdmin   = false;
    }else{
      var loggingIn = false;
      var isAdmin   = false;
    }
    // console.log("loggingIn",loggingIn);
    // console.log("isAdmin",isAdmin);
    return {
        loggingIn,
        isAdmin
    }

})(AdminDashboardLayout);

	