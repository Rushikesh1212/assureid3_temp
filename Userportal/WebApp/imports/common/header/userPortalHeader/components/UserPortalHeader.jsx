import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'; 
import { UserProfile } from '/imports/AssureID/userPortal/api/userProfile.js';
import { CompanyProfile } from '/imports/AssureID/company/api/companyProfile.js';

class UserPortalHeader extends TrackerReact(Component) {
  constructor(){
    super(); 
    this.state ={ 
      "inputSearch"  : '',
      "searchArray"  : [], 
      "subscription" : {
        "userData"   : Meteor.subscribe("userData"),      
        "serachData" : Meteor.subscribe("userfunction"),      
        "userprofile" : Meteor.subscribe('userprofile',Meteor.userId()),      
      } 
    };
  }
  logout(event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('/');
  }
  profilePage(event){
    // event.preventDefault();
    FlowRouter.go('/viewProfile/'+this.props.usersDetails._id);
    $('.tabContents').find('.active').removeClass('in active');
    $('#menu6').addClass('in active');
    // $('.menu6').addClass('active');
  }
  homepage(event){
    event.preventDefault();
    FlowRouter.go('/');
  }
  inputEffect(event){
    event.preventDefault();
    $(event.target).removeClass('inputSearchWidth');
  }
  buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
      return "(?=.*" + word + ")";
    });

    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
  }

  getTextValueWhenType(event){
    var textValue= this.refs.inputSearch.value;
    // console.log("textValue",textValue);
    if(textValue != ""){
      $(event.target).removeClass('inputSearchWidth'); 
      var RegExpBuildValue = this.buildRegExp(textValue); 
      // console.log('RegExpBuildValue',RegExpBuildValue);
      var searchData = Meteor.users.find({"profile.loginAs" : "user",$or:[{'profile.firstname':RegExpBuildValue},{"profile.lastname":RegExpBuildValue}]}).fetch();
              // console.log("searchData",searchData);
      if(searchData.length > 0){
        var searchArray = [];
        for(var i=0; i<searchData.length; i++){
          var _id         = searchData[i]._id;
          var firstname   = searchData[i].profile.firstname;
          var lastname    = searchData[i].profile.lastname;
          var name        = searchData[i].profile.name;
          var loginAs     = searchData[i].profile.loginAs;
          searchArray.push({_id, firstname,lastname,name,loginAs});
        } 
        this.setState({"searchArray":searchArray});
      }else{
        var comapnyData = CompanyProfile.find({"companyName":RegExpBuildValue }).fetch();
        // console.log("comapnyData",comapnyData);
        if (comapnyData) {
          var searchArray = [];
          for(var i=0; i<comapnyData.length; i++){
            var _id         = comapnyData[i]._id;
            var companyName = comapnyData[i].companyName;
            var loginAs     = "company";
            searchArray.push({_id,companyName,name,loginAs});
          } 
          this.setState({"searchArray":searchArray});
        }
        // swal("User not found!");
      }
    }else{
      this.setState({"searchArray":[]});
      $(event.target).addClass('inputSearchWidth'); 
      $('#inputSearch').val('');
    }
  }
  handleChange(event){
   event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
    
   }
  viewProfile(event){
    event.preventDefault();
    var id = $(event.target).attr('data-id');
    var loginAs = $(event.target).attr('data-loginas');
    const profileHandle = Meteor.subscribe("userprofile",id);
     if (!profileHandle.ready()) {
      var userProfile = UserProfile.findOne({'userId': id});
      var formValues = {
        "viewId" : Meteor.userId(),
      }
      if(userProfile){
        if(loginAs == "user"){
          if(userProfile.viewedByPeople){
            var index = $.grep(userProfile.viewedByPeople, function(obj){return obj.viewId === Meteor.userId();})[0];

            if(!index && loginAs == "user"){
              Meteor.call("insertViewedUser",formValues,id, function(error,result){
                if(error){
                  console.log(error.reason);
                }else{
                  // swal("Done","Basic Information updated successfully!");   
                }
              }); 
            }
          }else{
            Meteor.call("insertViewedUser",formValues,id, function(error,result){
              if(error){
                console.log(error.reason);
              }else{
                // swal("Done","Basic Information inserted successfully!");   
              }
            }); 
          }
          this.setState({"searchArray":[]});
          $('#inputSearch').addClass('inputSearchWidth');
          $('#inputSearch').val('');
          FlowRouter.go('/viewProfile/'+id);
        }else{
          if(userProfile.viewedByCompanies){
            var index = $.grep(userProfile.viewedByCompanies, function(obj){return obj.viewId === Meteor.userId();})[0];
            if(!index < 0 && loginAs == "company"){
                Meteor.call("insertViewedCompany",formValues,id, function(error,result){
                  if(error){
                    console.log(error.reason);
                  }else{
                    // swal("Done","Basic Information updated successfully!");   
                  }
                }); 
              }
            }else{
              Meteor.call("insertViewedCompany",formValues,id, function(error,result){
                if(error){
                  console.log(error.reason);
                }else{
                  // swal("Done","Basic Information updated successfully!");   
                }
              }); 
            }
        }

       }else{
          // console.log("hi");
          var company = CompanyProfile.findOne({"_id": id});
          // console.log("company",company);
          if (company) {       
            this.setState({"searchArray":[]});
            $('#inputSearch').addClass('inputSearchWidth');
            $('#inputSearch').val('');
            FlowRouter.go("/companyForms/viewCompany/"+company.companyAssureID);
          }
          
        }
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar profileHeader">
          <div className="container-fluid formHeaderCon">
            <div className="hidden-lg hidden-md hidden-sm col-xs-12">
              <div className="col-xs-10 searchBlock">
                <input type="text" className="inputSearch inputSearchWidth pull-right" name="inputSearch" ref="inputSearch" id="inputSearch" placeholder="&#xF002;&nbsp;&nbsp;Search Profile"
                  title="Search users or companies profile" onChange={this.handleChange.bind(this)} onInput={this.getTextValueWhenType.bind(this)} onClick={this.inputEffect.bind(this)} />
              </div>
              <div className="col-xs-2 cartBlock">  
                <a href="/cart" className="header-a pull-right"><i className="fa fa-shopping-cart fa-2x"></i></a>
              </div>
            </div>
            <div className="navbar-header col-lg-2 col-md-3 col-sm-3 col-xs-12 nopadRight">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbarThird" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand header-name col-lg-12 col-md-12 col-sm-12 col-xs-9 noProfilePadding" href="" onClick={this.homepage.bind(this)}>
                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/logo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" alt="AssureID logo"/>
              </a> 
            </div> 
            <div id="navbarThird" className="navbar-collapse collapse navbar-right col-xs-12">
              <ul className="nav navbar-nav navbar-right profileHeaderUl">
                <li className="hidden-xs">
                  <input type="text" className="inputSearch inputSearchWidth" name="inputSearch" ref="inputSearch" id="inputSearch" placeholder="&#xF002;&nbsp;&nbsp;Search Profile"
                  title="Search users or companies profile" onInput={this.getTextValueWhenType.bind(this)} onClick={this.inputEffect.bind(this)} />
                </li>
               {/* <li className="active">
                  <a href="/" className="header-a"><span>HOME</span></a>
                </li>*/}
                {/*<li className="dropdown profileHeaderLi">
                  <a href="/aboutUs" className="header-a"><span>ABOUT</span></a>
                </li>*/}
               {/* <li>
                  <a href="#" className="header-a dropdown-toggle" data-toggle="dropdown"><span>SERVICES</span><i className="fa fa-caret-down"></i></a>
                    <ul className="dropdown-menu dropdownMenuProfile">
                       <li><a href="/services/identityVerification">IDENTITY VERIFICATION </a></li>
                        <li><a href="/services/financialVerification">FINANCIAL VERIFICATION </a></li>                           
                        <li><a href="/services/tenancy">TENANCY </a></li>                           
                        <li><a href="/services/internationalVerification">INTERNATIONAL VERIFICATIONS</a></li>                           
                        <li><a href="/services/legal">LEGAL</a></li>                           
                        <li><a href="/services/professionalVerification">PROFESSIONAL VERIFICATION </a></li>                           
                        <li><a href="/services/insurance">INSURANCE </a></li>                           
                        <li><a href="/services/corporateVerification">CORPROATE VERIFICATION </a></li>                           
                    </ul>
                </li>*/}
                
               {/* <li>
                  <a href="/contact" className="header-a"><span>CONTACT</span></a>
                </li>*/}
                <li className="hidden-xs">
                  <a href="/cart" className="header-a"><i className="fa fa-shopping-cart fa-2x">{this.props.count > 0 ?<span className="badge customBadge">{this.props.count}</span> : null}</i></a>
                </li>
                {
                  !this.props.loading ?
                    <li className="dropdown profileHeaderLi">
                      <a href="" className="dropdown-toggle" data-toggle="dropdown">
                        <span>
                          { this.props.usersDetails.profile.userProfile ? 
                            <img src={this.props.usersDetails.profile.userProfile} className="img-circle userIconImage"/>
                            :
                            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle  userIconImage"/>
                          }
                        </span>
                        <span>{this.props.usersDetails.profile.firstname} {this.props.usersDetails.profile.lastname}</span>
                        &nbsp;&nbsp;<i className="fa fa-caret-down"></i>
                      </a>
                      <ul className="dropdown-menu dropdownMenuProfile">
                        <li><a href="/profile">Home</a></li>
                        <li><a href="" id='firstProfileMenu' onClick={this.profilePage.bind(this)}>My Profile</a></li>
                        <li><a href="/myOrders">My Orders</a></li>
                        {/*<li><a href="/companyForms/basic">Create Company</a></li>*/}
                        {/* 
                          this.props.companyProfileObj.map((companyData, index)=>{
                            return(
                              <li key={companyData._id + 'Profile-Console' + index}>
                                <a href={"/companyForms/viewCompany/"+companyData.companyAssureID}>{companyData.companyName+' Profile'}</a>                        
                                <a href={"/companyConsole/"+companyData.companyAssureID}>{companyData.companyName+' Console'}</a>                        
                              </li>
                            );
                          })
                        */}
                        {/*<li>
                          { 
                            this.props.companyProfileObj.map((companyData, index)=>{
                              return(
                                <a href={"/companyForms/viewCompany/"+companyData.companyAssureID} key={companyData._id + index + 'Profile'}>{companyData.companyName+' Profile'}</a>                        
                              );
                            })
                          }
                        </li>
                        <li>
                          { 
                            this.props.companyProfileObj.map((companyData, index)=>{
                              return(
                                <a href={"/companyConsole/"+companyData.companyAssureID} key={companyData._id + index + 'Console'}>{companyData.companyName+' Console'}</a>                        
                              );
                            })
                          }
                        </li>*/}
                        <li><a href="" onClick={this.logout.bind(this)}>Logout</a></li>
                      </ul>
                    </li>
                  :
                  <li><a></a></li> 
                }   
                {/*<li className="">
                  <a href="/" className="" onClick={this.logout.bind(this)}>
                    <span>Logout</span>
                    //<i className="fa fa-bars fa-lg"></i>
                  </a>
                </li>*/}
              </ul>
            </div>
          </div>
        </nav>
        {/*<LogIn />*/}
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-11"></div>
          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-11"></div>
          <div className="col-lg-3  col-md-3 col-sm-3 col-xs-11">
            <ul className="searchProfile">
              { 
                this.state.searchArray.map((searchDetails, index)=>{
                  return(
                    <li key={index + searchDetails._id + '-searchHeader'}>
                      <a onClick={this.viewProfile.bind(this)} data-id={searchDetails._id} data-loginas={searchDetails.loginAs}>
                        {
                          searchDetails.loginAs == 'user' ?
                            searchDetails.firstname != '' || searchDetails.lastname != '' ? searchDetails.firstname + ' ' + searchDetails.lastname : ""
                          :
                            searchDetails.companyName != '' ? searchDetails.companyName : ""   
                        }
                      </a>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      </div>
    );  
  }
}
UserPortalHeaderContainer = withTracker(({props}) => {
  const postHandle1   = Meteor.subscribe('companyProfileDetails');
  const postHandle    = Meteor.subscribe('userData',Meteor.userId());
  const loading       = !postHandle.ready();
  const loading1      = !postHandle1.ready();

  var _id = Meteor.userId();
  const usersDetails  = Meteor.users.findOne({"_id":_id})|| {};
  if (usersDetails) {
    if (usersDetails.profile) {
      var assureid     = usersDetails.profile.assureId;
      const requestPoolHandle = Meteor.subscribe("requestPoolCount",assureid);
      const requestPoolLoading = !requestPoolHandle.ready();
      var count  = Counts.get("requestPoolCount");
      // console.log("count",typeof count);
    }
  }
  var companyProfileObj =[];
  const companyProfileArr = CompanyProfile.find({}).fetch() || [];
  if(companyProfileArr){
    if(companyProfileArr.length > 0){
      for (var i = 0; i < companyProfileArr.length; i++) {
        if(companyProfileArr[i].authorizedPerson){
          if(companyProfileArr[i].authorizedPerson.length > 0){
            for (var j = 0; j < companyProfileArr[i].authorizedPerson.length; j++) {
              if(companyProfileArr[i].authorizedPerson[j].empId == _id){
                companyProfileObj.push({
                  'companyAssureID' : companyProfileArr[i].companyAssureID,
                  '_id' : companyProfileArr[i]._id,
                  'companyName' : companyProfileArr[i].companyName,
                });
              }
            }
          }
        }
      }
    }
  }
  

   
  return {
    loading,
    usersDetails,
    companyProfileObj,
    count
  };
})(UserPortalHeader);

export default UserPortalHeaderContainer;
