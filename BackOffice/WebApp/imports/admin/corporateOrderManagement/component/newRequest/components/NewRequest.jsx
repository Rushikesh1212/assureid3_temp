import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js' ;
import {Order} from '/imports/admin/orderManagement/api/Order.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {CorporateOrders} from'/imports/admin/corporateOrderManagement/api/CorporateOrder.js';
import BulkUserUpload from '/imports/admin/corporateOrderManagement/component/newRequest/components/UserBulkRequestServices/components/BulkUserUpload.jsx';
import BulkCompanyUpload from '/imports/admin/corporateOrderManagement/component/newRequest/components/companyBulkRequestServices/components/BulkCompanyUpload.jsx';
import CompanyDetails from '/imports/admin/corporateOrderManagement/component/newRequest/components/CompanyDetails.jsx';
import ServiceDetails from '/imports/admin/corporateOrderManagement/component/newRequest/components/ServiceDetails.jsx';
import CorporateDocuments from '/imports/admin/corporateOrderManagement/component/newRequest/components/CorporateDocuments.jsx';
import OrderReport from '/imports/admin/corporateOrderManagement/component/newRequest/components/OrderReport.jsx';
import CandidateOrderList from '/imports/admin/corporateOrderManagement/component/newRequest/components/companyBulkRequestServices/components/CandidateOrderList.jsx';
import "/imports/admin/userManagement/api/userAccounts.js";

class NewRequest extends TrackerReact(Component) {
  constructor(){ 
    super(); 
    this.state ={ 
      "filledBy"      : "Company",
      "service"       : '',
      "serviceId"     : '', 
      "failedList"    : [],
      "subscription"  : {
      } 
    } 
  }
  componentDidMount() { 
    $.validator.addMethod("regxA1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain alphanumeric and some special character.");
          
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    // console.log("component mounted");
    $("#spocEmailForm").validate({
      rules: {
        senderSubject: {
          regxA1: /^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/,
        },
        senderMessage: {
          regxA1: /^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/,
        }
      }
    });
     
  } 
  changeUrl(event){
    event.preventDefault();
    var urltype = $(event.currentTarget).attr('data-urltype');
    FlowRouter.go("/newRequest/"+this.props.corporateOrderId+"/"+urltype+"/"+this.props.assureId+"/"+this.props.serviceId);
  }
  sendmailToSPOC(event){
    event.preventDefault();
    var senderFrom    = "";
    var deoDetail     = Meteor.users.findOne({"_id":Meteor.userId});
    if(deoDetail){
      // senderFrom = deoDetail.emails[0].address;
      senderFrom = "testassureid@gmail.com";
      
    }
    var senderMail    = this.refs.senderMail.value;
    var senderSubject = this.refs.senderSubject.value;
    var senderMessage = this.refs.senderMessage.value;0
    Meteor.call('sendEmailnNotification',senderMail,senderFrom,senderSubject,senderMessage,(err,res)=>{
      if(err){
        swal("Something went wrong!");
        console.log('error ',error);       
      }else{
        
        swal("Mail Send Successfully!!");
        $('#contactDetail').modal('toggle');        
      }
    })
  }
  
  /**Add Completed Status in corporate order */
  closeOrder(event){
    event.preventDefault();
    let corporateId      = $(event.currentTarget).attr("data-corporateid");
    var corporateOrderId = this.props.corporateOrderId;
    var assureId         = this.props.assureId;
    var serviceId        = this.props.serviceId;
    swal({
      title: "Are you sure?",
      text: "You want to close order!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Continue",
      closeOnConfirm: false,
      html: false
    }, function(){
      Meteor.call('updateDEOStatus',corporateId,(error,result)=>{
        if(result){
          swal("Order Close Successfully");
          FlowRouter.go("/newRequest/"+corporateOrderId+"/detailOrder/"+assureId+"/"+serviceId)
        }
      });
    });
  }
    
  reopenOrder(event){
    event.preventDefault();
    let corporateId = $(event.currentTarget).attr("data-corporateid");
    var corporateOrderId = this.props.corporateOrderId;
    var assureId         = this.props.assureId;
    var serviceId        = this.props.serviceId;
    swal({
      title: "Are you sure?",
      text: "You want to reopen order!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Continue",
      closeOnConfirm: false,
      html: false 
    }, function(){
      Meteor.call('updateDEOReopenStatus',corporateId,(error,result)=>{
        if(result){
          swal("Order Reopen Successfully");
          FlowRouter.go("/newRequest/"+corporateOrderId+"/newOrder/"+assureId+"/"+serviceId)
        }
      });
    });
  } 
  updateState(data){
    this.setState({"failedList" : data});
  }
  render() {  
    if(!this.props.loading){
      return ( 
        <div className="content-wrapper">
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h2 className="box-title">Order Number : {this.props.corporatDetails.corporateOrderNo}</h2> 
                  </div>
                    <div className="box-body">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock NOpadding">
                          <CompanyDetails spocdetails= {this.props.spocDetails} companyLogo = {this.props.companyDetails.companyLogo ? this.props.companyDetails.companyLogo : "" } companyName={this.props.companyDetails.companyName} companyAssureID = {this.props.companyDetails.companyAssureID} allocatedToUserName = {this.props.corporatDetails.allocatedToUserName}/>
                          <ServiceDetails validServiceArray={this.props.validServiceArray}/>
                          <CorporateDocuments corporatedetails ={this.props.corporatDetails}/>
                          <OrderReport corporatedetails ={this.props.corporatDetails} validServiceArray={this.props.validServiceArray}/>                         
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reportTable NOpadding">
                          {/* {
                            this.props.corporatDetails.DEOStatus == "New" ? */}
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 NOpadding">
                              <button type="button" className={this.props.url == "detailOrder" ? "btn bgColor" :  "btn btn-muted"} data-urltype="detailOrder" onClick={this.changeUrl.bind(this)}>Detail Order</button>
                            </div>
                            {/* :
                            null  
                          } */}
                            
                            {
                              this.props.corporatDetails.DEOStatus == "Completed" ?
                                null
                              :
                                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 NOpadding">
                                  <button type="button" className={this.props.url == "newOrder" ? "btn bgColor" :  "btn btn-muted"} data-urltype="newOrder" onClick={this.changeUrl.bind(this)}>Begin Data Entry</button>                              
                                </div>
                            }
                            
                            {
                              this.props.corporatDetails.DEOStatus!="Completed" ?
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 pull-right NOpadding">
                                  <button type="button" className="btn bgColor" data-corporateid={this.props.corporateOrderId} onClick={this.closeOrder.bind(this)}>Close Order</button>                            
                                </div>
                              :

                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 pull-right NOpadding">
                                  <button type="button" className="btn btn-danger" data-corporateid={this.props.corporateOrderId} onClick={this.reopenOrder.bind(this)}>Reopen</button>                            
                                </div>

                            }
                          

                          {/* ========================================= */}
                          {/* <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#contactDetail">Contact SPOC</button> */}
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 NOpadding pull-right">
                              <button type="button" className="btn bgColor" data-toggle="modal" data-target="#contactDetail">Contact SPOC</button>
                            </div>
                            <div className="modal fade" id="contactDetail" role="dialog">
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title spocTitle">Contact SPOC</h4>
                                  </div>
                                  <div className="modal-body removeBorder">
                                    <form id="spocEmailForm" onSubmit={this.sendmailToSPOC.bind(this)}>
                                      <div className="form-group col-lg-12 col-md-12 col-sm-6 col-xs-6">
                                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <label>SPOC Email
                                          </label>                        
                                          <input type="text" className="form-control loginInputs" id="senderMail" name="senderMail" ref="senderMail" value={this.props.spocDetails ? this.props.spocDetails.spocEmail : ""} disabled/>                                      
                                        </div>
                                      </div>
                                      <div className="form-group col-lg-12 col-md-12 col-sm-6 col-xs-6">
                                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <label>Subject
                                          </label>                        
                                          <input type="text" className="form-control loginInputs" id="senderSubject"  name="senderSubject" ref="senderSubject" required/>                                      
                                        </div>
                                      </div>
                                      <div className="form-group col-lg-12 col-md-12 col-sm-6 col-xs-6">
                                        <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <label>Message
                                          </label>                        
                                          <textarea rows="4" cols="50" className="form-control loginInputs" id="senderMessage" name="senderMessage" ref="senderMessage"  required/>                                      
                                        </div>
                                      </div>

                                      <button type="submit" className="btn btn-info pull-right">Send</button>           

                                    </form>
                                  </div>
                                  <div className="modal-footer removeBorder">
                                    {/* <button type="button" class="btn btn-default" data-dismiss="modal">Send</button> */}
                                  </div>
                                </div> 
                              </div>
                            </div>


                          {/* ================================================= */}
                            
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImgOuter landingBlocks NOpadding">
                           {this.props.url == "newOrder" ?
                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                {this.props.validServiceArray ?
                                    this.props.validServiceArray.length > 0 ?
                                     <div>
                                        <ul className="nav nav-pills nav-tabs empVerification col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                         {this.props.validServiceArray.map((service,index)=>{
                                            return(
                                                <li className="col-lg-2 col-md-3 col-sm-4 col-xs-6 NOpadding" key={index}><a href={"/newRequest/"+this.props.corporateOrderId+"/"+this.props.url+"/"+this.props.assureId+"/"+service.serviceId} className={this.props.serviceId == service.serviceId ? "active": ""}>{service.serviceName}</a></li>
                                              ); 
                                           })
                                         }  
                                        </ul>
                                        {this.props.candidateList.length > 0 ?
                                          <div className="tab-content">
                                            {this.props.validServiceArray.map((service,index)=>{
                                                return(
                                                  <div id={"/newRequest/"+this.props.corporateOrderId+"/"+this.props.url+"/"+this.props.assureId+"/"+service.serviceId} className={this.props.serviceId == service.serviceId ? "tab-pane fade in active" : "tab-pane fade"} key={index}>
                                                    <CandidateOrderList assureId={this.props.assureId ? this.props.assureId : ""} urlValue={this.props.url ? this.props.url : ""} serviceid={service.serviceId} serviceRequired={service.serviceRequired} corporatDetails={this.props.corporatDetails} failedList={this.state.failedList.length > 0 ? this.state.failedList : []}/>
                                                  </div>
                                                  );
                                               })
                                             }
                                          </div>
                                          :
                                          <div className="tab-content">
                                            {this.props.validServiceArray.map((service,index)=>{
                                              return(
                                                  <div id={"/newRequest/"+this.props.corporateOrderId+"/"+this.props.url+"/"+this.props.assureId+"/"+service.serviceId} className={this.props.serviceId == service.serviceId ? "tab-pane fade in active" : "tab-pane fade"} key={index}>
                                                   <BulkCompanyUpload urlValue={this.props.url ? this.props.url : ""} assureId={this.props.assureId ? this.props.assureId : ""} serviceid={service.serviceId} typeid={this.props.serviceId ? this.props.serviceId : ''} serviceRequired={service.serviceRequired} corporatDetails={this.props.corporatDetails} updatefunctionfailedList={this.updateState.bind(this)}/>
                                                  </div>
                                                 );
                                               })
                                             }
                                          </div>    
                                        }
                                                                          
                                      </div>
                                    :
                                    null
                                  :
                                  null
                                }  
                               </div>
                              :
                              null
                           }
                           {this.props.url == "detailOrder" ?
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                {this.props.validServiceArray ?
                                   this.props.validServiceArray.length > 0 ?
                                      <div>
                                        <ul className="nav nav-pills empVerification col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                         {this.props.validServiceArray.map((service,index)=>{
                                            return(
                                                <li className="col-lg-2 col-md-3 col-sm-4 col-xs-6 NOpadding" key={index}><a href={"/newRequest/"+this.props.corporateOrderId+"/"+this.props.url+"/"+this.props.assureId+"/"+service.serviceId} className={this.props.serviceId == service.serviceId ? "active": ""}>{service.serviceName}</a></li>
                                              );
                                           })
                                         }
                                        </ul>
                                       <div className="tab-content">
                                          {this.props.validServiceArray.map((service,index)=>{
                                              return(
                                                <div id={"/newRequest/"+this.props.corporateOrderId+"/"+this.props.url+"/"+this.props.assureId+"/"+service.serviceId} className={this.props.serviceId == service.serviceId ? "tab-pane fade in active" : "tab-pane fade"} key={index}>
                                                  <CandidateOrderList assureId={this.props.assureId ? this.props.assureId : ""} urlValue={this.props.url ? this.props.url : ""} serviceid={service.serviceId} serviceRequired={service.serviceRequired} corporatDetails={this.props.corporatDetails}/>
                                                </div>
                                                );
                                             })
                                           }
                                        </div>
                                      </div>
                                      :
                                      null
                                    :
                                    null
                                  }
                              </div>
                             :
                            null
                            }
                          </div>      
                        </div>
                      </div>
                   </div>
                </div>
            </div> 
          {/* </div> */}
         </section>
       </div>
 
     );
    }else{
      return(
        <span>Loading</span>
        );
    }
    
  } 
}
NewRequestContainer = withTracker(({params}) => {
  var corporateOrderId  = FlowRouter.getParam("corporderid");
  var url               = FlowRouter.getParam("url");   
  var assureId          = FlowRouter.getParam("assureid");
  var serviceId         = FlowRouter.getParam("serviceid");
  const postHandle      = Meteor.subscribe("companyProfileData",assureId);
  const CorporateHandle = Meteor.subscribe("singleCorporateOrder",corporateOrderId);
  const orderHandle     = Meteor.subscribe('orderWithCorporateOrder',corporateOrderId);
  var orderDetails      = [];
  var validServiceArray = [];
  var candidateDetails  = [];   
  const loading         = !postHandle.ready() && !CorporateHandle.ready() && !orderHandle.ready();
  var corporatDetails   = CorporateOrders.findOne({'_id':corporateOrderId});
  if (corporatDetails) {
    validServiceArray   = corporatDetails.packageDetails.servicesIncluded;
  }
  // console.log("validServiceArray :",validServiceArray);
  if (corporatDetails) {
    var orderDetails     = Order.find({"corporateOrderId" : corporateOrderId, 
                                    },{sort:{"createdAt": -1}}).fetch();

     var candidateList = []; 
      if(orderDetails){
        orderDetails.map((order, Index)=>{
          order.candidateDetails.map((candidateDetails, Ind)=>{
            candidateDetails.orderId  = order._id;
            // console.log("candidateDetails",candidateDetails);
            if (candidateDetails.verificationData) {
               var verificationData = candidateDetails.verificationData.filter((obj, i)=>{
                  obj.index = i;
                  return obj.serviceId == serviceId && !obj.ticketDetails;
                 })
                 
                candidateDetails.verificationData = verificationData;
                if (candidateDetails.verificationData.length > 0) {
                  candidateList.push(candidateDetails);
                }
            }              
          });
        });
      }
  }
  var companyDetails   = CompanyProfile.findOne({"companyAssureID" : assureId});
  if(companyDetails){
    var userHandel       = Meteor.subscribe("userData",companyDetails.userId);
    var spocMatchDetails = Meteor.users.findOne({"profile.assureId":assureId});
    if(spocMatchDetails){
        var spocIndex    = spocMatchDetails.profile.authorizedPerson.findIndex(x=> x.address == corporatDetails.companyDetails.SPOCDetails.EmailID);
        if(spocIndex>=0){
          var spocDetails     ={
            "spocName"    : spocMatchDetails.profile.authorizedPerson[spocIndex].accessPersonName,
            "spocEmail"   : spocMatchDetails.profile.authorizedPerson[spocIndex].address,
            "spocContact" : spocMatchDetails.profile.authorizedPerson[spocIndex].accessPersonContact,
            
          };
        }
    }
  }

  // console.log("candidateList :",candidateList)
  return {
    url,
    assureId,
    validServiceArray,
    serviceId,
    corporateOrderId,
    companyDetails,
    loading,
    corporatDetails,
    candidateList,
    spocDetails
  };
})(NewRequest);
export default NewRequestContainer;