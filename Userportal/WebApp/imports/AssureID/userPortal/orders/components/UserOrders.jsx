import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';

class UserOrders extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      "subscription" : {
      }
    };
  }
                       
  showInvoice(event){
  	event.preventDefault();
	  var id = $(event.currentTarget).attr('data-id');
    FlowRouter.go('/ServiceInvoice/'+id);
    Session.set('showInvoice','showInvoice');
  }
  showReports(event){
    event.preventDefault();
	  var id = $(event.currentTarget).attr('data-id');
    FlowRouter.go('/downloadReports/'+id);
  }
  formatRupees(num){
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
  }

  render(){
  	if (!this.props.loading) {
	  	return(
	      <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
	        <div className="servieInnerBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
	          <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
	            <h1 className="text-center headerinvoice">My Orders</h1> 
	              { this.props.orderDetails.length > 0 ?
	              	 this.props.orderDetails.map((orders, index)=>{
	              	 	return(
				            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12" key={index} data-id={orders.invoiceDetails ? orders.invoiceDetails.invoiceId : ""}>
				            	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerOrderBlock" data-id={orders.invoiceDetails ? orders.invoiceDetails.invoiceId : ""}>
		            	      <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 outerOrderImageBlock">
                     			{ orders.serviceDetails ?
                     			    <img src={orders.serviceDetails.serviceImage} className="img-responsive orderImage img-thumbnail" data-id={orders.invoiceDetails ? orders.invoiceDetails.invoiceId : ""}/>
												    :
                             orders.packageDetails ?
                     			    <img src={orders.packageDetails.packageImage} className="img-responsive orderImage img-thumbnail" data-id={orders.invoiceDetails ? orders.invoiceDetails.invoiceId : ""}/>
												    :
												     <img src="/images/assureid/noImage.png" className="img-responsive orderImage img-thumbnail" data-id={orders.invoiceDetails ? orders.invoiceDetails.invoiceId : ""}/>                                  
												  } 
												  {  orders.invoiceDetails ?
														 	orders.orderStatus == "Payment Pending"?
															 <div className="makepaymentbtn">
															 	<a href={"/ServiceInvoice/"+orders.invoiceDetails.invoiceId}>
																	 <button type="button" className="btn btn-info pull-right paymentbtn">Make Payment</button>
																</a>
															 </div>
															 :
															 ""
														  :
														   orders.orderStatus == "Incomplete"?
															 <div className="makepaymentbtn">
															 	<a href={orders.serviceDetails ? "/ServiceRequiredData/"+orders.serviceDetails.serviceId+"-"+orders.serviceDetails.serviceName+"-"+orders._id : "/PackageRequiredData/"+orders.packageDetails.packageId+"-"+orders.packageDetails.packageName+"-"+orders._id }>
																	 <button type="button" className="btn btn-info pull-right paymentbtn">Complete Order</button>
																</a>
															 </div>
															 :
															 ""
												  }
                     		</div>
                       	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 orderInformation" data-id={orders.invoiceDetails ? orders.invoiceDetails.invoiceId : ""}>
                      	  		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding innerorderInformation">
                        	  		{ orders.serviceDetails ?
                                    <h5>{orders.serviceDetails.serviceName}</h5>																	    
                                  :
                                   orders.packageDetails ?
	                         			    <h5>{orders.packageDetails.packageName}</h5>
															    :
															    <h5>-</h5>
															  }
                                {
                                	orders.amountPaid ?
                             	  		<p><i className="fa fa-rupee"></i>{this.formatRupees(orders.amountPaid)}</p>
                             	  	:
                             	  		<p>-</p>
                                }
                        		 </div>
                        		 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                           			<span className="orderDateLabel">Order No. :</span> <span className="orderDateValue">{orders.orderNo}</span>
                          		</div>
                      	  		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                           			<span className="orderDateLabel">Date :</span> <span className="orderDateValue">{moment(orders.createdAt).format("DD/MM/YYYY")}</span>
                          		</div>
                          		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                           			<span className="orderDateLabel orderViewLabel">Status : &nbsp;</span> 
																 {
																 	 orders.orderStatus == "Incomplete" ?
																	   <span className="orderDateValue orderStatusView redColorDiv">{orders.orderStatus}</span>
																	 :
																		orders.orderStatus == "In Process" || orders.orderStatus == "Order Completed - Generating Report" || orders.orderStatus == "Order Completed - Report Completed"?
																			<span className="orderDateValue orderStatusView bg-primary">In Process</span>
																		:
																		orders.orderStatus == "Completed" ?
																			<span className="orderDateValue orderStatusView greenColorDiv">{orders.orderStatus}</span>
																		:
																		orders.orderStatus == "Payment Pending" ?
																		<div>
																			<span className="orderDateValue orderStatusView notpurchaseorderStatusView orderViewLabel">{orders.orderStatus}</span>
																			{/* <button type="button" className="btn btn-info pull-right paymentbtn">Make Payment</button> */}
																		</div>
																		:
																			<span className="orderDateValue orderStatusView bg-primary">{orders.orderStatus}</span>
																 }
                          		</div>
                       		</div> 
                       		{orders.invoiceDetails ?
                       			<div>
	                         		<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1" data-id={orders.invoiceDetails.invoiceId} onClick={this.showInvoice.bind(this)} >
	                         		   <i className="fa fa-file-text-o downloadOrederButtons"  title="View Invoice"></i>
	                         		</div>
	                         		<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1" data-id={orders._id} onClick={this.showReports.bind(this)}>
	                         		  <i className="fa fa-files-o downloadOrederButtons" title="View Report"></i>
	                         		</div>
                         		</div>
                         		:
                         		null
                         	}
                    		</div>
				            </div>	
				            );

		                })
		              : 
		              <span className="text-center">No Order Found!</span>
	              }             
	          </div>
	        </div>
	      </div>
	    );
  	}else{
  		return( 
  			<span className="text-center">Loading</span>
  			);
  	}
    
  }
}
UserOrderPageContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe('alluserOrders',Meteor.userId());
    var   orderDetails  = Order.find({"userId": Meteor.userId()},{sort : {createdAt : -1}}).fetch()|| [];
    const loading       = !postHandle.ready();
    console.log("orderDetails",orderDetails);
    // if(_id){
      return {
          loading,
          orderDetails,
      };
    // }
})(UserOrders);

export default UserOrderPageContainer;