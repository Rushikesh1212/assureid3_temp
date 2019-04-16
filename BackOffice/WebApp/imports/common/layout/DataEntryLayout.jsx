import React,{Component} from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import DashboardHeader from '/imports/common/header/dashboardHeader/DashboardHeader.jsx';
import DashboardFooter from '/imports/common/footer/dashboardFooter/DashboardFooter.jsx';
import DashboardSidebar from '/imports/common/sidebar/dashboardSidebar/DashboardSidebar.jsx';
// import CaseSidebar      from '/imports/common/sidebar/caseSidebar/CaseSidebar.jsx';
import DataEntryOperatorSidebar     from '/imports/common/sidebar/dataEntryOperatorSidebar/DataEntryOperatorSidebar.jsx';
import PropTypes        from 'prop-types';
import Login            from '/imports/systemSecurity/login/Login.jsx';
const DataEntryLayout = ({loggingIn,isDEO,content})=>(
   <div>
    {loggingIn ?
       <div className="hold-transition skin-blue sidebar-mini">
          {isDEO ? 
             <div className="wrapper">
                <DashboardHeader />
                <div className="container-fluid">
                  <div className="row">                 
                      <DataEntryOperatorSidebar />  
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
DataEntryLayout.propTypes = {
  loggingIn : PropTypes.bool,
  isDEO   : PropTypes.bool

};

export default DEOLayout = withTracker(props => {

    const login    = Meteor.userId();
    if(login && Roles.userIsInRole(login, ['data entry operator']) ){
      // console.log("in");
      var loggingIn = true;
      var isDEO   = true;
    }else if(login && !Roles.userIsInRole(login, ['data entry operator'])){
      var loggingIn = true;
      var isDEO   = false;
    }else{
      var loggingIn = false;
      var isDEO   = false;
    }
    // console.log("loggingIn",loggingIn);
    // console.log("isDEO",isDEO);
    return {
        loggingIn,
        isDEO
    }

})(DataEntryLayout);

  