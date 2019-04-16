import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
import { Email } from 'meteor/email';

import '/imports/admin/adminDashboard/corporateManagement/corporatenotification/SendMailnNotificationCorporate.jsx';


class CorporateAccountList extends TrackerReact(Component) {
	constructor(props) {
    super(props); 
    this.state = {
      "subscription"  : {
      
      }  
    }; 
  } 
	componentDidMount() {
    $("html,body").scrollTop(0);
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
  updateAccountStatus(event){
    event.preventDefault();
    var targetedID = event.currentTarget.id;
    var targetedStatus = $(event.currentTarget).attr('data-status');
    
    Meteor.call('activeblockCorporateAccount',targetedID,targetedStatus,(error,result)=>{
      if(result){
      }
    });
  }

  sendNotification(event){
    //company name, user name password 
    var userId      = $(event.currentTarget).attr('id'); 
    
    var companyDetails = CompanyProfile.findOne({"userId":userId});
    var userDetails    = Meteor.users.findOne({"_id":userId});
    if(companyDetails && userDetails){  
      var adminData   = Meteor.users.findOne({'roles' : "admin"});
      if(adminData){
        var adminId  = adminData._id;
      }
      var emails = userDetails.profile.authorizedPerson; 
      if(emails.length>0){
        emails.map((emailsData,index)=>{
          var msgvariable = {    
                       
            '[companyname]': companyDetails.companyName,
            '[emailid]'    : emailsData.address,
            '[contactno]'  : emailsData.accessPersonContact
            
          };

        // Format for send Email //
        var inputObj = {
          from         : adminId,
          to           : emailsData.address,
          templateName : 'CompanyRegistration',
          variables    : msgvariable,
        }
        if(!this.props.loading){
          sendMailNotification(inputObj);          
        }
        
        
        // Format for sending SMS //
        var smsObj = {
            to           : emailsData.address,
            templateName : 'CompanyRegistration',
            number       : emailsData.accessPersonContact,
            variables    : msgvariable,
        }
        sendSMS(smsObj);

        // Format for sending notification //
        var notifictaionObj = {
          to           : emailsData.address,
          templateName : 'Account Creation',
          variables    : msgvariable,
        }
        })//EOF map

        Meteor.call('updateUserNotificationStatus',userDetails._id,(error,result)=>{
          if(result == 1){
            swal("Notification send successfully");
          }
        })
      }
    }
  }
  
  render() {
   return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1> Corporate Management </h1>
        <ol className="breadcrumb">
          <li>
            <a href="#"><i className="fa fa-file-o"/> Corporate Management</a></li>
          <li className="active">List Of Corporates</li>
        </ol>
      </section>
       <section className="content">
         <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <div className="box box-primary">
                <div className="box-header with-border">
                 <h2 className="box-title">List Of Corporates</h2>  
                </div>
                <div className="box-body">  
                  <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <table className="display table table-bordered servicesTable">
                      <thead className="table-head">
                          <tr>
                              <th>AssureID</th>                   
                              <th>Corporate Name</th>
                              <th>SPOC's Name</th>
                              <th>SPOC's Contact Number</th>
                              <th>SPOC's Email</th>
                              <th>Payment By</th>
                              <th>Action</th>
                              <th>Notification</th>
                          </tr>
                      </thead>
                      {!this.props.loading ? 
                          <tbody>
                              {this.props.companies.map((companies,index) =>{
                              return( <tr key={index}>
                                        <td>{companies.companyAssureID}</td>                                        
                                        <td>{companies.companyName}</td>
                                        <td><div>
                                         
                                          {
                                            companies.authorizedPerson && companies.authorizedPerson.length>0 ?
                                              companies.authorizedPerson.map((authorizedPerson,i)=>{
                                                return(
                                                  
                                                    <div key={i}>
                                                      {authorizedPerson.accessPersonName ? authorizedPerson.accessPersonName : "-"}
                                                    </div>        
                                                );
                                            })
                                            :
                                            null
                                          }
                                          </div>
                                          </td>
                                          <td><div>
                                         
                                          {
                                            companies.authorizedPerson && companies.authorizedPerson.length>0 ?
                                              companies.authorizedPerson.map((authorizedPerson,i)=>{
                                                return(
                                                  
                                                    <div key={i}>
                                                      {authorizedPerson.accessPersonContact ? authorizedPerson.accessPersonContact :"-"}
                                                    </div>
                                                    // <td>{authorizedPerson.accessPersonName} </td>
                                                    // <td> {authorizedPerson.accessPersonContact} </td>
                                                    // <td> {authorizedPerson.address} </td>
                                                  
                                                  
                                                );
                                            })
                                            :
                                            <span>-</span>
                                          }
                                          </div>
                                          </td>
                                          <td><div>
                                         
                                         {
                                           companies.authorizedPerson && companies.authorizedPerson.length>0 ?
                                             companies.authorizedPerson.map((authorizedPerson,i)=>{
                                               return(
                                                 
                                                   <div key={i}>
                                                     {authorizedPerson.address ? authorizedPerson.address : "-" }
                                                   </div>
                                               );
                                           })
                                           :
                                           null
                                         }
                                         </div>
                                         </td>
                                          
                                       
                                        <td>{companies.paymentBy}</td>
                                        
                                        <td className="actiontd">
                                          {companies.contract ?
                                            <a href={"/admin/ViewContract/"+companies.companyAssureID}>
                                              <i className="fa fa-eye viewBtn1" title="View Contract"></i>
                                            </a>
                                            :
                                            <a href={"/admin/AddNewContract"}>
                                              <i className="fa fa-plus viewBtn1" title="Add Contract"></i>
                                            </a>
                                           
                                          }
                                    
                                          { 
                                            companies.accountStatus=="Active" ?
                                              <button className='activeAccount btn-success' onClick={this.updateAccountStatus.bind(this)} id={companies.userId} data-status = "Block" title="Click To Block Account" ></button>
                                            :

                                              <button className='blockAccount activeAccount btn-default' onClick={this.updateAccountStatus.bind(this)} id={companies.userId} data-status="Active" title="Click To Active Account" ></button>
                                          }
                                          { 
                                            companies.accountStatus=="Active" ?
                                              <a href={"/admin/createcorporateaccount/"+companies._id}>
                                                <button className="editTax fa fa-pencil-square-o noLRpad" title="Edit Account"></button>	
                                              </a>
                                            :
                                              <button className="editTax fa fa-pencil-square-o noLRPad" title="Sorry Your account is blocked" disabled></button>	

                                          } 
                                        </td>
                                        <td>
                                          {
                                            companies.notifStatus !=true && companies.accountStatus!="Active" ? 
                                              <button className='btn btn-primary' onClick={this.sendNotification.bind(this)} id={companies.userId} data-status="Active" title="Notification already send" disabled>
                                              Send Notification
                                              </button>
                                            :

                                              <button className='btn btn-primary' onClick={this.sendNotification.bind(this)} id={companies.userId} data-status="Active" title="Click To Send Notification">
                                              Send Notification
                                              </button>

                                          }
                                         
                                            
                                        </td>
                                     </tr>
                                  );
                              })
                            }
                          </tbody>
                        :
                          <tbody>
                            <tr>Loading</tr>
                          </tbody>
                      }
                    </table>
                  </div>
                </div>
             </div>
            </div>
         </div>
       </section>
    </div>
    );
  } 
}
CorporateAccountListContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe("companyProfileDetails",);
    const companies      = CompanyProfile.find({}).fetch()||[];
    const notificationHandle = Meteor.subscribe('notificationTemplate');
    const adminHandle     = Meteor.subscribe('adminData');

    if(companies && companies.length>0){
      for(var i=0;i<companies.length;i++){
        
        var userHandle  = Meteor.subscribe('userData',companies[i].userId);      
        const userDetails = Meteor.users.findOne({'_id':companies[i].userId});
        if(userDetails){
              
          companies[i].authorizedPerson = userDetails.profile.authorizedPerson;
          companies[i].notifStatus      = userDetails.notificationStatus;
          
        }
      }
    }
      // const loading       = !postHandle.ready();
      
      var loading= !notificationHandle.ready() && !adminHandle.ready();
    return {
      loading,
      companies,
    };
})(CorporateAccountList);
export default CorporateAccountListContainer;