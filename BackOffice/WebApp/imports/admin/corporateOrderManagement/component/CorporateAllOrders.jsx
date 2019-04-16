import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CorporateOrders } from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';

class CorporateAllOrders extends TrackerReact(Component){
	constructor(props){
      super(props);
      this.state = {
      } 
  }

  render(){
     return(            
      <div> 
        <div className="content-wrapper">
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h2 className="box-title"> All Orders</h2> 
                  </div>
                    <div className="box-body">
                      <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        {/* {this.props.ticketBucketData[0].orderId} */}
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
                                            {/*<td><a href={"/newRequest/"+orders._id+"/newOrder/"+orders.companyDetails.companyAssureID+"/"+orders.packageDetails.servicesIncluded[0].serviceId}>{Math.round(Math.abs((new Date().getTime() - orders.createdAt.getTime())/(24*60*60*1000)))}</a></td>*/}
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
  }
}
CorporateAllOrdersContainer = withTracker(props => { 
    const handleAllOrdersList      = Meteor.subscribe("allcorporateOrdersOfcompany","company");
    const loading                  = !handleAllOrdersList.ready();
    const allocatedCorporateOrders = CorporateOrders.find({"informationFilledBy" : "company"}).fetch();
    var addNoOfDays = 2;
    if(allocatedCorporateOrders){
      for(i=0;i<allocatedCorporateOrders.length;i++){
        var createdAt = new Date(allocatedCorporateOrders[i].createdAt);
        allocatedCorporateOrders[i].ageing = Math.round(Math.abs((new Date().getTime() - createdAt.getTime())/(24*60*60*1000)));
        var AfterAddedDays = createdAt.setDate(createdAt.getDate() + addNoOfDays);
        var afterAddDaysDate = new Date(AfterAddedDays).toISOString();
        allocatedCorporateOrders[i].dueDate = afterAddDaysDate;
        
        if(allocatedCorporateOrders[i].DEOStatus == "New"){
          allocatedCorporateOrders[i].status = 'New';
          if(afterAddDaysDate >= new Date()){
            allocatedCorporateOrders[i].bgClassName = 'btn-danger';        
          }else{
            allocatedCorporateOrders[i].bgClassName = 'btn-primary';          
          }
          
        }else if(allocatedCorporateOrders[i].DEOStatus == "In Process"){
          allocatedCorporateOrders[i].status = 'In Process' ; 
          if(afterAddDaysDate >= new Date()){
            allocatedCorporateOrders[i].bgClassName = 'btn-danger';        
          }else{
            allocatedCorporateOrders[i].bgClassName = 'btn-warning';                  
          }
        }else if (allocatedCorporateOrders[i].DEOStatus == "Work In Progress") {
          allocatedCorporateOrders[i].status      = 'WIP';  
          if(afterAddDaysDate >= new Date()){
            allocatedCorporateOrders[i].bgClassName = 'btn-danger';        
          }else{
            allocatedCorporateOrders[i].bgClassName = 'btn-success';  
          }
        }else if (allocatedCorporateOrders[i].DEOStatus == "Case Reopened") {
          allocatedCorporateOrders[i].status      = 'Reopen - Discrepancy';  
          allocatedCorporateOrders[i].bgClassName = 'btn-danger';         
        }else if(allocatedCorporateOrders[i].DEOStatus == "Completed"){
          allocatedCorporateOrders[i].status = 'Completed';          
          allocatedCorporateOrders[i].bgClassName = 'btn-success';        
        }
      }
   
    }
    return {
        loading,
        allocatedCorporateOrders,
    };
})(CorporateAllOrders);
export default CorporateAllOrdersContainer;
