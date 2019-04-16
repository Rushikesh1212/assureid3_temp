import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// import { UserProfile } from '/imports/AssureID/user/api/userProfile.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';

/*import LogIn from '../forms/LogIn.jsx';*/
class CorporateHeader extends TrackerReact(Component) {
  constructor(){
    super(); 
    this.state ={ 
      "inputSearch"  : '',
      // "searchArray"  : [], 
      "subscription" : {
       
      } 
    };
  }
  logout(event){
    event.preventDefault();
    Meteor.call("logoutUser",Meteor.userId(),function(error,result) {
      if (error) {
       console.log(error.reason);
      }else{
        Meteor.logout();
        FlowRouter.go('/');
      }
    });
  }
  profilePage(event){
    event.preventDefault();
    $('#basic').removeClass('in active');
    $('#locations').removeClass('in active');
    $('#settings').removeClass('in active');
    $('#viewCompany').addClass('in active');
    $('.viewCompany').addClass('active');
    FlowRouter.go("/companyForms/viewCompany/"+this.props.companyProfileObj.companyAssureID);
  }
  // homepage(event){
  //   event.preventDefault();
  //   FlowRouter.replace('/');
  // }
  // inputEffect(event){
  //   event.preventDefault();
  //   $(event.target).removeClass('inputSearchWidth');
  // }
  // buildRegExp(searchText) {
  //   var words = searchText.trim().split(/[ \-\:]+/);
  //   var exps = _.map(words, function(word) {
  //     return "(?=.*" + word + ")";
  //   });
  //   var fullExp = exps.join('') + ".+";
  //   return new RegExp(fullExp, "i");
  // }

  // getTextValueWhenType(event){
  //   var textValue= this.refs.inputSearch.value;
  //   // console.log("textValue",textValue);
  //   if(textValue != ""){
  //     $(event.target).removeClass('inputSearchWidth'); 
  //     var RegExpBuildValue = this.buildRegExp(textValue); 
  //     // console.log('RegExpBuildValue',RegExpBuildValue);
  //     var searchData = Meteor.users.find({"profile.loginAs" : "user",$or:[{'profile.firstname':RegExpBuildValue},{"profile.lastname":RegExpBuildValue}]}).fetch();
  //             // console.log("searchData",searchData);
  //     if(searchData.length > 0){
  //       var searchArray = [];
  //       for(var i=0; i<searchData.length; i++){
  //         var _id         = searchData[i]._id;
  //         var firstname   = searchData[i].profile.firstname;
  //         var lastname    = searchData[i].profile.lastname;
  //         var name        = searchData[i].profile.name;
  //         var loginAs     = searchData[i].profile.loginAs;
  //         searchArray.push({_id, firstname,lastname,name,loginAs});
  //       } 
  //       this.setState({"searchArray":searchArray});
  //     }else{
  //       var comapnyData = CompanyProfile.find({"companyName":RegExpBuildValue }).fetch();
  //       // console.log("comapnyData",comapnyData);
  //       if (comapnyData) {
  //         var searchArray = [];
  //         for(var i=0; i<comapnyData.length; i++){
  //           var _id         = comapnyData[i]._id;
  //           var companyName = comapnyData[i].companyName;
  //           var loginAs     = "company";
  //           searchArray.push({_id,companyName,name,loginAs});
  //         } 
  //         this.setState({"searchArray":searchArray});
  //       }
  //       // swal("User not found!");
  //     }
  //   }else{
  //     this.setState({"searchArray":[]});
  //     $(event.target).addClass('inputSearchWidth'); 
  //     $('#inputSearch').val('');
  //   }
  // }
  // handleChange(event){
  //  event.preventDefault();
  //   const target = event.target;
  //   const value  = target.type === 'checkbox' ? target.checked : target.value;
  //   const name   = target.name;
  //   this.setState({
  //     [name]: event.target.value,
  //   });
  //  }
  // viewProfile(event){
  //   event.preventDefault();

  //   var id = $(event.target).attr('data-id');
  //   var loginAs = $(event.target).attr('data-loginAs');

  //   var userProfile = UserProfile.findOne({'userId': id});
  //   // console.log("userProfile",userProfile);
    
  //   formValues = {
  //     "viewId" : Meteor.userId(),
  //   }
  //   if(userProfile){
  //     if(loginAs == "user"){
  //       if(userProfile.viewedByPeople){
  //         var index = $.grep(userProfile.viewedByPeople, function(obj){return obj.viewId === Meteor.userId();})[0];

  //         if(!index && loginAs == "user"){
  //           Meteor.call("insertViewedUser",formValues,id, function(error,result){
  //             if(error){
  //               console.log(error.reason);
  //             }else{
  //               // swal("Done","Basic Information updated successfully!");   
  //             }
  //           }); 
  //         }
  //       }else{
  //         Meteor.call("insertViewedUser",formValues,id, function(error,result){
  //           if(error){
  //             console.log(error.reason);
  //           }else{
  //             // swal("Done","Basic Information inserted successfully!");   
  //           }
  //         }); 
  //       }
  //       this.setState({"searchArray":[]});
  //       $('#inputSearch').addClass('inputSearchWidth');
  //       $('#inputSearch').val('');
  //       browserHistory.replace('/viewProfile/'+id);
  //     }else{
  //       if(userProfile.viewedByCompanies){
  //         var index = $.grep(userProfile.viewedByCompanies, function(obj){return obj.viewId === Meteor.userId();})[0];
  //         if(!index < 0 && loginAs == "company"){
  //             Meteor.call("insertViewedCompany",formValues,id, function(error,result){
  //               if(error){
  //                 console.log(error.reason);
  //               }else{
  //                 // swal("Done","Basic Information updated successfully!");   
  //               }
  //             }); 
  //           }
  //         }else{
  //           Meteor.call("insertViewedCompany",formValues,id, function(error,result){
  //             if(error){
  //               console.log(error.reason);
  //             }else{
  //               // swal("Done","Basic Information updated successfully!");   
  //             }
  //           }); 
  //         }
  //     }

  //    }else{
  //       // console.log("hi");
  //       var company = CompanyProfile.findOne({"_id": id});
  //       console.log("company",company);
  //       if (company) {       
  //         this.setState({"searchArray":[]});
  //         $('#inputSearch').addClass('inputSearchWidth');
  //         $('#inputSearch').val('');
  //         browserHistory.replace("/companyForms/viewCompany/"+company.companyAssureID);
  //       }
        
  //     }
  // }

  render() {
    if (!this.props.loading) {
      return (
          <div>
            <nav className="navbar profileHeader">
              <div className="container-fluid formHeaderCon">
                <div className="hidden-lg hidden-md hidden-sm col-xs-12">
                  {/*<div className="col-xs-10 searchBlock">
                    <input type="text" className="inputSearch inputSearchWidth pull-right" name="inputSearch" ref="inputSearch" id="inputSearch" placeholder="&#xF002;&nbsp;&nbsp;Search Profile"
                      title="Search users or companies profile" onChange={this.handleChange.bind(this)} onInput={this.getTextValueWhenType.bind(this)} onClick={this.inputEffect.bind(this)} />
                  </div>*/}
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
                  <a className="navbar-brand header-name col-lg-12 col-md-12 col-sm-12 col-xs-9 noProfilePadding" href="">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/logo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" alt="AssureID logo"/>
                  </a>
                </div> 
                <div id="navbarThird" className="navbar-collapse collapse navbar-right col-xs-12">
                  <ul className="nav navbar-nav navbar-right profileHeaderUl">
                    {/*<li className="hidden-xs">
                      <input type="text" className="inputSearch inputSearchWidth" name="inputSearch" ref="inputSearch" id="inputSearch" placeholder="&#xF002;&nbsp;&nbsp;Search Profile"
                      title="Search users or companies profile" onInput={this.getTextValueWhenType.bind(this)} onClick={this.inputEffect.bind(this)} />
                    </li>*/}
                    {/*<li className="hidden-xs">
                      <a href="/cart" className="header-a"><i className="fa fa-shopping-cart shoppingCart fa-2x"><span className="badge customBadge">0</span></i></a>
                    </li>*/}
                     <li className="dropdown profileHeaderLi">
                        <a href="" className="dropdown-toggle" data-toggle="dropdown">
                          <span>
                           {!this.props.loading1 ?
                            this.props.companyProfileObj ? 
                            this.props.companyProfileObj.companyLogo != "" ?
                              <img src={this.props.companyProfileObj.companyLogo} className="img-circle  userIconImage"/>
                              :
                              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle  userIconImage"/>
                              :
                              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle  userIconImage"/>
                              :
                              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle  userIconImage"/>
                           }
                          </span>
                          <span>{!this.props.loading1 ? this.props.companyProfileObj.companyName : ""}</span>
                          &nbsp;&nbsp;<i className="fa fa-caret-down"></i>
                        </a>
                        {this.props.companyProfileObj ?
                          <ul className="dropdown-menu dropdownMenuProfile">
                            <li><a href="" onClick={this.profilePage.bind(this)}>Profile</a></li>
                            <li><a href={"/companyConsole/"+this.props.companyProfileObj.companyAssureID} >Console</a></li>
                            {/* <li><a href={this.props.validServiceArray.length > 0 ? "/ledger/"+this.props.companyProfileObj.companyAssureID : "/ledger/"+this.props.companyProfileObj.companyAssureID}>Verification Dashboard</a></li> */}
                            <li><a href={"/company/contractAndSow/"+this.props.companyProfileObj.companyAssureID}>Agreement</a></li>
                            <li><a href="" onClick={this.logout.bind(this)} >Logout</a></li>
                          </ul> 
                          :
                          null
                        }
                      </li>                
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        );   
    }else{
      return( 
         <span>Loading</span>
        );
    }
    
  }
}
CorporateHeaderContainer = withTracker(({props}) => {
  const postHandle    = Meteor.subscribe('userData',Meteor.userId());
  const loading       = !postHandle.ready();
  var _id = Meteor.userId();
  const usersDetails  = Meteor.users.findOne({"_id":_id});
  if (usersDetails) {
    if (usersDetails.profile) {
      var assureid = usersDetails.profile.assureId;
    }
  } 
   const postHandle1      = Meteor.subscribe('companyProfileData',assureid);
   const loading1         = !postHandle1.ready();
   var companyProfileObj  = CompanyProfile.findOne({"companyAssureID": assureid});
   var validServiceArray  = [];
   if (companyProfileObj) {
    if (companyProfileObj.contract) {
      // console.log(new Date());
      var validContract = companyProfileObj.contract.filter((contract) => {if( new Date() >= new Date(contract.validFrom) && new Date() <= new Date(contract.validTo) && contract.contractStatus == "Active"){return contract;} });
      if (validContract) {
          var contract = validContract[0];
           validContract.map((validContract) =>{
              var validService = validContract.serviceLevelAgreement.filter((serviceLevelAgreement) => {
              return serviceLevelAgreement.value == true;
            });
              if(validService){
                validServiceArray.push(...validService);
              }
          });
      } 
    } 
  }

  return {
    loading,
    loading1,
    usersDetails,
    companyProfileObj,
    validServiceArray
  };
})(CorporateHeader);
export default CorporateHeaderContainer;

