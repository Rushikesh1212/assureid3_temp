import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CorporateOrders } from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';

class CorporateEscalatedOrders extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }
    render(){
    if (!this.props.loading) {
     return(            
        <div> 
          <div className="content-wrapper">
            <section className="content">
              <div className="row">
                <div className="col-md-12">
                  <div className="box">
                    <div className="box-header with-border">
                      <h2 className="box-title"> Escalated Orders</h2> 
                    </div>
                      <div className="box-body">
                        <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div>
                              <div className="reports-table-main">
                              <table id="subscriber-list-outerTable" className="newOrderwrap subscriber-list-outerTable table table-bordered table-hover table-striped table-striped table-responsive table-condensed table-bordered">
                              <thead className="table-head umtblhdr">
                                <tr className="hrTableHeader UML-TableTr noLRPad">
                                  <th>Order No.</th>
                                  <th>Company Name<br/>(AssureID)</th>
                                  <th>Receive Date</th>
                                  <th>Due Date</th>
                                  <th>Aging</th>
                                  <th>Status</th>    
                                </tr>
                              </thead>
                              <tbody>
                              {this.props.allocatedCorporateOrders ? 
                                 this.props.allocatedCorporateOrders.length > 0 ?
                                   this.props.allocatedCorporateOrders.map((orders,index)=>{
                                      return (
                                        <tr key={index}>
                                          <td><a href={"/newRequest/"+orders._id+"/newOrder/"+orders.companyDetails.companyAssureID+"/"+orders.packageDetails.servicesIncluded[0].serviceId}>{orders.corporateOrderNo}</a></td>
                                          <td><a href={"/newRequest/"+orders._id+"/newOrder/"+orders.companyDetails.companyAssureID+"/"+orders.packageDetails.servicesIncluded[0].serviceId}>{orders.companyDetails.companyName}<br/>({orders.companyDetails.companyAssureID})</a></td>
                                          <td><a href={"/newRequest/"+orders._id+"/newOrder/"+orders.companyDetails.companyAssureID+"/"+orders.packageDetails.servicesIncluded[0].serviceId}>{moment(orders.createdAt).format("DD MMM YYYY")}</a></td>
                                          <td><a href={"/newRequest/"+orders._id+"/newOrder/"+orders.companyDetails.companyAssureID+"/"+orders.packageDetails.servicesIncluded[0].serviceId}>{moment(orders.dueDate).format("DD MMM YYYY")}</a></td>
                                          <td><a href={"/newRequest/"+orders._id+"/newOrder/"+orders.companyDetails.companyAssureID+"/"+orders.packageDetails.servicesIncluded[0].serviceId}>{orders.ageing}</a></td>
                                          <td className={"bgtextcolor "+orders.bgClassName}><a href={"/newRequest/"+orders._id+"/newOrder/"+orders.companyDetails.companyAssureID+"/"+orders.packageDetails.servicesIncluded[0].serviceId}>{orders.status}</a></td>
                                          {/* <td className={data.bgClassName}><a href={"/admin/ticket/"+data._id} className="statuswcolor">{data.status}</a></td>        */}

                                        </tr>
                                      );
                                   })
                                 : 
                                 null
                                :
                                null}
                                
                              </tbody>
                            </table>
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                </div> 
              </div>
            </section>
          </div>
        </div>    
      );
    }else{
     return(
      <span>Loading</span>
     ) ;
    }
        
  }
}
// AllOrderContainer = withTracker(props => { 
//     var handleAllOrdersList = Meteor.subscribe("allOrders");
//     var loading = !handleAllOrdersList.ready();
//     var _id  = Meteor.userId();
//     var allOrderList = Order.find({"allocatedToUserid":Meteor.userId()},{sort:{createdAt: 1}}).fetch() || [];

//     if(allOrderList){
//         for(i=0;i< allOrderList.length; i++){
//           if(allOrderList[i].orderStatus == 'Completed - Generating Report') {
//             allOrderList[i].orderStatus = 'New';
//             allOrderList[i].bgClassName = 'btn-warning';
//           } 
//         } 
//     }

//     return {
//         loading,
//         allOrderList
//     };
   
// })(AllOrders);
// export default AllOrderContainer;
CorporateEscalatedOrdersContainer = withTracker(props => { 
    

    const handleAllOrdersList = Meteor.subscribe("allocatedCorporateOrders",Meteor.userId());
    const loading             = !handleAllOrdersList.ready();
    const allocatedCorporateOrders1 = CorporateOrders.find({"allocatedToUserid" : Meteor.userId()}).fetch();
    var addNoOfDays = 2;
    let allocatedCorporateOrders = [];

    for(var i=0;i<allocatedCorporateOrders1.length;i++){
      var createdAt        = new Date(allocatedCorporateOrders1[i].createdAt);
      allocatedCorporateOrders1[i].ageing = Math.round(Math.abs((new Date().getTime() - createdAt.getTime())/(24*60*60*1000)));
      var AfterAddedDays   = createdAt.setDate(createdAt.getDate() + addNoOfDays);
      var afterAddDaysDate = new Date(AfterAddedDays).toISOString();
      allocatedCorporateOrders1[i].dueDate = afterAddDaysDate;
      if(allocatedCorporateOrders1[i].DEOStatus == "New"){
          allocatedCorporateOrders1[i].status = 'New' ;
          if(afterAddDaysDate >= new Date()){
            allocatedCorporateOrders1[i].bgClassName = 'btn-danger';        
            allocatedCorporateOrders.push(allocatedCorporateOrders1[i]);
          }
        }else if(allocatedCorporateOrders1[i].DEOStatus == "In Process"){
          allocatedCorporateOrders1[i].status = 'In Process' ; 
          if(afterAddDaysDate >= new Date()){
            allocatedCorporateOrders1[i].bgClassName = 'btn-danger';        
            allocatedCorporateOrders.push(allocatedCorporateOrders1[i]);        
          } 
        }     
    }
    return {
        loading,
        allocatedCorporateOrders,
    };
})(CorporateEscalatedOrders);
export default CorporateEscalatedOrdersContainer;

