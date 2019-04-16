import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

class DashboardSidebar extends TrackerReact(Component){
  constructor() {
   super();
    this.state = {
      subscription :{
        // "userData" : Meteor.subscribe("userData",Meteor.userId()), 
      }
    }
  }
   removePersistantSessions(){
      UserSession.delete("progressbarSession", Meteor.userId());
      UserSession.delete("allProgressbarSession", Meteor.userId());
  }

  render(){
  	return(

        <aside className="main-sidebar">
          {/* sidebar: style can be found in sidebar.less */}
          <section className="sidebar">
            {/* Sidebar user panel */}
            <div className="user-panel">
              {!this.props.loading1 ?
              <div className="pull-left image">
               { Meteor.user() ?
                   Meteor.user().profile.userProfile ? 
                      Meteor.user().profile.userProfile == "" ?
                        <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle" alt="User Image" />
                        :
                        <img src={Meteor.user().profile.userProfile} className="img-circle" alt="User Image" />
                     :
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle" alt="User Image" />
                  :
                 <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages//userIcon.png" className="img-circle" alt="User Image" />
               }              
              </div>
              :
              ""
            }
            {!this.props.loading1 ?
                this.props.user ? 
                <div className="pull-left info">
                  <p> {this.props.user.profile.firstname} {this.props.user.profile.lastname}</p>
                  <a href="javascript:void(0)"><i className="fa fa-circle text-success" />Online</a>
                </div>
                :
                ""
              :
              ""
             }
            </div>
            
            {/* sidebar menu: : style can be found in sidebar.less */}
            <ul className="sidebar-menu" data-widget="tree">
              <li className="header">MAIN NAVIGATION</li>
              <li className="">
                <a href="/admin/dashboard" className="active">
                  <i className="fa fa-dashboard" />
                    <span>Dashboard</span>
                </a>
              </li>
              <li className="treeview">
                <a href="JavaScript:void(0);">
                  <i className="fa fa-user" />
                  <span>Master Data</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/ManageLocation">
                      <i className="fa fa-circle-o" /> Manage Locations
                    </a>
                  </li>
                  <li>
                    <a href="/admin/University">
                      <i className="fa fa-circle-o" /> Manage University
                    </a>
                  </li>
                  <li>
                    <a href="/admin/College">
                      <i className="fa fa-circle-o" /> Manage College
                    </a>
                  </li> 
                  <li>
                    <a href="/admin/Qualification">
                      <i className="fa fa-circle-o" /> Manage Qualifications
                    </a>
                  </li>
                  
                  <li>
                    <a href="/admin/PoliceStation">
                      <i className="fa fa-circle-o" /> Manage Police Station
                    </a>
                  </li>
                  <li>
                    <a href="/admin/Checklist">
                      <i className="fa fa-circle-o" /> Check List For Verification
                    </a>
                  </li>        
                  <li>
                    <a href="/admin/CodeAndReason">
                      <i className="fa fa-circle-o" /> Code And Reason
                    </a>
                  </li>
                  <li>
                    <a href="/admin/HolidayList">
                      <i className="fa fa-circle-o" /> Holidays List
                    </a>
                  </li>
                  
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                <i className="fa fa-bell" />
                  <span> Notifications</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  {
                    this.props.userRole == 'superAdmin' ?
                      <li>
                        <a href="/admin/CreateTemplate">
                          <i className="fa fa-circle-o" /> Create New Template
                        </a>
                      </li>
                    :
                    ""
                  }
                  <li>
                    <a href="/admin/ViewTemplates">
                      <i className="fa fa-circle-o" /> View All Templates
                    </a>
                  </li>
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-briefcase" />
                  <span> Service Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  {/*<li>
                    <a href="/admin/adminticketdetails">
                      <i className="fa fa-circle-o" /> Test for tickets
                    </a>
                  </li>*/}
                  <li>
                    <a href="/admin/manageservice">
                      <i className="fa fa-circle-o" /> Add Service
                    </a>
                  </li>
                  <li>
                    <a href="/admin/ListOfServices">
                      <i className="fa fa-circle-o" /> List of Services
                    </a>
                  </li>
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-archive" />
                  <span> Case Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  {/* <li>
                    <Link to="/admin/mytickets">
                      <i className="fa fa-circle-o" /> My Ticket
                    </Link>
                  </li> */}
                 {/* <li>
                    <a href="/admin/maxnoofticketallocate">
                      <i className="fa fa-circle-o" /> Allocate Max No. of Cases
                    </a> 
                  </li>*/}
                  <li>
                    <a href="/admin/ticketdistribution">
                      <i className="fa fa-circle-o" /> SC Case Distribution
                    </a>
                  </li>
                  <li>
                    <a href="/admin/adminticketdetails">
                      <i className="fa fa-circle-o" /> All Tickets Details 
                    </a>
                  </li>
                  
                  {/* <li>
                    <Link to="/ComingSoon">
                      <i className="fa fa-circle-o" /> List Packages
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-archive" />
                  <span> Package Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/manageservicepackage">
                      <i className="fa fa-circle-o" /> Add New Package
                    </a>
                  </li>
                  <li>
                    <a href="/admin/listOfPackages">
                      <i className="fa fa-circle-o" /> List of Packages
                    </a>
                  </li>
                </ul>
              </li>

              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-file-o" />
                  <span> Corporate Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"/>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/createcorporateaccount">
                      <i className="fa fa-circle-o" /> Add Corporate Profile
                    </a>
                  </li>
                  <li>
                    <a href="/admin/AddNewContract">
                      <i className="fa fa-circle-o" /> Add Contract
                    </a>
                  </li>
                  <li>
                    <a href="/admin/ListOfCorporates">
                      <i className="fa fa-circle-o" /> List of Corporates
                    </a>
                  </li>
                  
                  
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-first-order" />
                  <span> Order Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"/>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/listOfCorporateOrders">
                      <i className="fa fa-circle-o" /> List of Orders
                    </a>
                  </li>
                </ul>
              </li>
              {/*<li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-first-order" />
                  <span> Check Management</span>
                </a>
              </li>*/}
              {/* <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-file-o" />
                  <span> Corporate Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"/>
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/ListOfCorporates">
                      <i className="fa fa-circle-o" /> List of Corporates
                    </a>
                  </li>
                  <li>
                    <a href="/admin/AddNewContract">
                      <i className="fa fa-circle-o" /> Add Contract
                    </a>
                  </li>
                </ul>
              </li> */}
              <li>
                <a href="/admin/reports">
                  <i className="fa fa-file-text" />
                    <span>Reporting System</span>
                </a>
              </li>
            
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-users" />
                  <span>User Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/createUser">
                      <i className="fa fa-circle-o" /> Add New Staff
                    </a>
                  </li> 
                  {
                    Roles.userIsInRole(Meteor.userId(),['superAdmin']) ?
                      <li>
                        <a href="/admin/UMRolesList">
                          <i className="fa fa-circle-o" /> Add Role
                        </a>
                      </li>
                    :
                    null
                  }
                  
                  <li>
                    <a href="/admin/UMListOfUsers">
                      <i className="fa fa-circle-o" /> List Of Staff
                    </a>
                  </li>
                  <li>
                    <a href="/corporateuserlist">
                      <i className="fa fa-circle-o" /> List Of SPOC
                    </a>
                  </li>
                  <li>
                    <a href="/admin/listofuserportal">
                      <i className="fa fa-circle-o" /> List Of Users
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </section>
          {/* /.sidebar */}
        </aside>
  	);
  }
}
sidebarContainer = withTracker(props => { 
    var _id  = Meteor.userId();

    const userHandle  = Meteor.subscribe('userData',_id);
    const user        = Meteor.users.findOne({"_id" : _id});
    if(user){
      if (user.roles) {
        if(user.roles.length > 0){
          var userRole = user.roles[0];
        }else{
          var userRole = '';
        }
      }
    }else{
      var userRole = '';
    }
    // console.log(userRole);
    const loading     = !userHandle.ready();
      return {
          loading  : loading,
          user     : user,
          userRole : userRole,
      };
})(DashboardSidebar);
export default sidebarContainer;