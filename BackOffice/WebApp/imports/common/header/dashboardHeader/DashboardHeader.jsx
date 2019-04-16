import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { CompanySettings } from '/imports/admin/companySettings/api/CompanySettingMaster.js';
class DashboardHeader extends TrackerReact(Component){
  constructor() { 
   super();
    this.state = {
      subscription :{
        // "userData" : Meteor.subscribe("userData",Meteor.userId()), 
      }
    }
  }
 componentDidMount(){
   if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
 }
 componentWillMount() {
    
  }
  componentWillUnmount(){  
   $("script[src='/js/adminLte.js']").remove(); 
  }
  handleClick(e) {
      e.preventDefault();
      Meteor.logout();
      var path = "/";
      FlowRouter.go(path);
  } 

  render(){
    return(
    <div>
      <header className="main-header">
          {/* Logo */}
          <a href="/admin/dashboard" className="logo">
            {/* mini logo for sidebar mini 50x50 pixels */}
            <span className="logo-mini"><b>A</b>ID</span>
            {/* logo for regular state and mobile devices */}
              <span className="logo-lg">
                  <b>Assure</b>ID
              </span>
          </a>
          {/* Header Navbar: style can be found in header.less */}
          <nav className="navbar navbar-static-top">
            {/* Sidebar hrefggle buthrefn*/}
            <a href="javascript:void(0)" className="sidebar-toggle" data-toggle="push-menu" role="button">
              <span className="sr-only">
                toggle navigation
              </span>
            </a>
            {/* Navbar Right Menu */}
            <div className="navbar-custom-menu">
              <ul className="nav navbar-nav">
              {Roles.userIsInRole(Meteor.userId(),['screening committee','team leader','quality team member','quality team leader'])?
                <li className="allocatedtitle">
                  <span className ="allocatedtitlevalue">Current Allocated Cases </span><br/>
                  <label className="col-lg-12 allocatedtitlevalue">{this.props.count ? this.props.count +'/'+this.props.MaxallocatedTickets : this.props.count/this.props.MaxallocatedTickets}</label>
                </li>
                :
                Roles.userIsInRole(Meteor.userId(),['team member']) ?
                  <li className="allocatedtitle">
                  <span className ="allocatedtitlevalue">Current Allocated Cases </span><br/>
                  <label className="col-lg-12 allocatedtitlevalue">{this.props.count ? this.props.count : " "}</label>
                  </li>
                :
                null
              }

                {/* Notifications: style can be found in dropdown.less */}
                {/* <li className="dropdown notifications-menu">
                  <a href="javascript:void(0)" className="dropdown-toggle" data-hrefggle="dropdown">
                    <i className="fa fa-bell-o" />
                    <span className="label label-warning">0</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="header">You have 10 notifications</li>
                    <li> */}
                      {/* inner menu: contains the actual data */}
                      {/* <ul className="menu">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-users text-aqua" /> 5 new members joined hrefday
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-warning text-yellow" /> Very long description here that may not fit inhref the
                            page and may cause design problems
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-users text-red" /> 5 new members joined
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-shopping-cart text-green" /> 25 sales made
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-user text-red" /> You changed your username
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="footer">
                      <a href="javascript:void(0)">View all</a>
                    </li>
                  </ul>
                </li> */}
                {/* Tasks: style can be found in dropdown.less */}
                
                {/* User Account: style can be found in dropdown.less */}
                <li className="dropdown user user-menu">
                  <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                    {/* <img src={this.currentUser().userProfile} className="user-image" alt="User Image" />
                    <span className="hidden-xs"> {this.currentUser().userName} </span> */}
                   {!this.props.loading ?
                      this.props.user ? 
                      <span className="hidden-xs">  {this.props.user.profile.firstname} {this.props.user.profile.lastname} </span>
                     :
                     ""
                   :
                   ""
                  } 
                 </a>
                  <ul className="dropdown-menu">
                    <li className="user-footer">
                      {/* <div className="pull-left">
                        <a href={`/admin/editProfile/${Meteor.userId()}`} className="btn btn-default btn-flat">Profile</a>
                      </div> */}
                      <div className="">
                        <a href="javascript:void(0)" className="btn btn-default btn-flat" onClick={this.handleClick.bind(this)}>
                          Logout
                        </a> 
                      </div>
                    </li>
                  </ul>
                </li>
                {/* Control Sidebar hrefggle Buthrefn */}
                {Roles.userIsInRole(Meteor.userId(),['screening committee','team leader','team member','field expert','quality team member','quality team leader','dispatch team','data entry operator'])?
                 ""
                :
                  <li>
                    <a href="/admin/company-info" data-hrefggle="control-sidebar">
                      <i className="fa fa-gears" />
                    </a>
                  </li>
                }
              </ul>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}
headerContainer = withTracker(props => { 
    var _id  = Meteor.userId();

    const userHandle  = Meteor.subscribe('userData',_id);
    const companyData = Meteor.subscribe('companyData');
    const user        = Meteor.users.findOne({"_id" : _id}) || {};
    const loading     = !userHandle.ready();
    var count         = 0;
    var roles = Roles.userIsInRole(Meteor.userId(),['screening committee','team leader','quality team member','quality team leader','team member'])
    if(roles){
      if(Meteor.user().count){
         count = Meteor.user().count;
      }else{
         count = 0;
      }
    }
    if (Roles.userIsInRole(Meteor.userId(),['admin','superAdmin'])) {
      var MaxallocatedTickets = "";
    }else{
      var companyDetails =  CompanySettings.findOne({'companyId':1});
       if(companyDetails){
        var maxallocatedArr    = companyDetails.maxnoOfTicketAllocate;
        if(maxallocatedArr){
          var singleObj          =  maxallocatedArr.find(o=>o.role === "screening committee");
          if(singleObj){
            var MaxallocatedTickets = singleObj.maxTicketAllocate;
          }
        }
       }else{
        var MaxallocatedTickets = "";
       }
    }
    console.log("MaxallocatedTickets",MaxallocatedTickets);
    return {
        loading  : loading,
        user     : user,
        MaxallocatedTickets : MaxallocatedTickets,
        count    : count
    };
})(DashboardHeader);
export default headerContainer;
