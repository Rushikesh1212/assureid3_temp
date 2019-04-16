import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// import { CompanyOrder } from '../../company/api/company.js'; 
import { RequestPool } from '/imports/AssureID/company/api/companyProfile.js';
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import { CompanyProfile } from "/imports/AssureID/company/api/companyProfile.js";
import {Order} from '/imports/AssureID/userPortal/api/Order.js';


class MyCart extends TrackerReact(Component){
   constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  }
  componentDidMount(){      
    $('html, body').scrollTop(0);
  }
  render(){
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
          <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 visitedHeight companyVerifColor noProfilePadding">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyOrderPage">
              <h3 className="pull-left companyVieworderNo">Cart</h3>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyOrderfont">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive outerpaddingForMobile ">
                <table className="table companyViewTable cartTable table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="text-center">Sr No.</th>
                      <th className="text-center">Company Name</th>
                      <th className="text-center">Service</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Due Date</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {
                      this.props.selectedArr ?
                        this.props.selectedArr.length > 0 ?
                          this.props.selectedArr.map((companyOrder, index)=>{
                            return(
                              <tr key={index+'companyCart'}>
                                <td>
                                  {index + 1}
                                </td>
                                <td>
                                  {companyOrder.companyName}
                                </td>
                                <td>
                                  {companyOrder.serviceName}
                                </td> 
                                <td>
                                  {companyOrder.price == 'Company' || companyOrder.price == 'Candidate' ? 'Paid by '+companyOrder.price : 'Rs. 100'}
                                </td>
                                <td>
                                  {companyOrder.tatDate ? moment(companyOrder.tatDate).format('DD-MM-YYYY') : ""}
                                </td>
                                <td>
                                  <a href={companyOrder.link}><div className="checkoutMyCart">Checkout</div></a>
                                </td>
                              </tr>                        
                            );
                          })
                        :
                        <tr>
                          <td></td>
                          <td></td>
                          <td>No Data Available</td>
                          <td></td>
                          <td></td>

                        </tr>
                      :
                      <tr></tr>  
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyViewDiv companyOrderPage noProfilePadding" style={{height : '36'+'px'}}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
CompanyOrderContainer = withTracker(({props,params}) => {
  const postHandle    = Meteor.subscribe('companyOrderData');
  const loading       = !postHandle.ready();
  const postHandle2   = Meteor.subscribe('userData',Meteor.userId());
  const loading2      = !postHandle2.ready();
  const postHandle1   = Meteor.subscribe('companyProfileDetails');
  const loading1      = !postHandle1.ready();
  const postHandle3    = Meteor.subscribe('requestPoolData');
  const orderSubscribe = Meteor.subscribe('allOrders');
  const loading3       = !postHandle3.ready();
  var selectedArr      =[];
  // var userAssureID = Meteor.user().profile.assureId;
  var userId           = Meteor.userId();
  var userProfile      = UserProfile.findOne({"userId":userId});
  console.l
  if(userProfile){
    var userAssureID = userProfile.assureId;
    
    if(userAssureID){
      if(userAssureID){
        var requestPool = RequestPool.find({"assureId":userAssureID}).fetch() || []; 
        // console.log("requestPool :",requestPool);
        if(requestPool.length >0){
          for (var i = 0; i < requestPool.length; i++) {
            if(requestPool[i].orderId){
            var order = Order.findOne({'_id':requestPool[i].orderId});  
            // console.log("order :",order);
            if(order){
              if(order.serviceDetails){
                var data = {
                  "orderId"    : requestPool[i].orderId,
                  "companyName": '-',
                  "serviceName": order.serviceDetails.serviceName,
                  "serviceId"  : order.serviceDetails.serviceId,
                  "tatDate"    : order.tatDate,
                  "link"       : '/ServiceRequiredData/'+order.serviceDetails.serviceId+'-'+order.serviceDetails.serviceName+'-'+requestPool[i].orderId,
                }
                if(order.companyDetails){
                  data.companyName =  order.companyDetails.companyName; 
                }
                if(order.paymentBy == 'Candidate Pay'){
                  data.price = order.actualAmount;
                }else{
                  data.price = order.paymentBy;
                }
              }else{
                var data = {
                  "orderId"    : requestPool[i].orderId,
                  "companyName": '-',
                  "serviceName": order.packageDetails.packageName,
                  "serviceId"  : order.packageDetails.packageId,
                  // "price"      : order.actualAmount,
                  "tatDate"    : order.tatDate,
                  "link"       : '/packageRequiredData/'+order.packageDetails.packageId+'-'+order.packageDetails.packageName+'-'+requestPool[i].orderId,             
                }
                if(order.companyDetails){
                  data.companyName =  order.companyDetails.companyName; 
                }
                if(order.paymentBy == 'Candidate Pay'){
                  data.price = order.actualAmount;
                }else{
                  data.price = order.paymentBy;
                }
                
              }
              selectedArr.push(data);
            }
          }  
        } 
      }
    }  
  }
  // console.log("selectedArr",selectedArr);
}  
return {
    selectedArr
  };
})(MyCart);
export default CompanyOrderContainer;