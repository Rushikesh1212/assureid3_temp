import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { Order } from '/imports/admin/orderManagement/api/Order.js';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import {CorporateOrders} from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';

class AllOrders extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }
    allTicketListDetails(ticketId){
      
      /**================== Ticket Information=================**/
      var sc  = ['NewScrAllocated','ScreenApproved','ScreenRejected'];
      var tl  = ['screenTLAllocated','Assign','Reassign'];
      var tm  = ['AssignAccept','AssignReject','SelfAllocated','ProofSubmit','VerificationPass','TMReviewRemark'];
      var fe  = ['FEAllocated','BAAllocated','ProofSubmit'];
      var qtm = ['VerificationPassQTMAllocated','QAPass','QTMReviewRemark','ReportGenerated'];
      var qtl = ['QAPassQTLAllocated','ReviewPass','QTLReviewRemark','ReportReGenerated'];
      var closeTicket = ['TicketClosed'];
      var tickteObj = {};
      var allTicketList = TicketMaster.findOne({"_id":ticketId});
      
      if(allTicketList){
        
      
        var ticket = allTicketList;
        var scObj  = {'role':'SC',  'date':'','color':'btn-default'};
        var tlObj  = {'role':'TL',  'date':'','color':'btn-default'};
        var tmObj  = {'role':'TM',  'date':'','color':'btn-default'};
        var feObj  = {'role':'','date':'','color':'btn-default'};
        // var feObj  = {'role':'FE',  'date':'','color':'btn-default'};
        var qtmObj = {'role':'QTM', 'date':'','color':'btn-default'};
        var qtlObj = {'role':'QTL', 'date':'','color':'btn-default'};
        var closeObj = {'role':'','date':'','color':'btn-default'};
        var blockDetails = [];
        var ticetEles = ticket.ticketElement;
        var ticketLength = ticetEles.length;
        for(var j=0;j<ticetEles.length;j++){
          var status = ticetEles[j].roleStatus;
          if(status != 'New'){
          var scIndex    = sc.indexOf(status);
          var tlIndex    = tl.indexOf(status);
          var tmIndex    = tm.indexOf(status);
          var feIndex    = fe.indexOf(status);
          var qtmIndex   = qtm.indexOf(status);
          var qtlIndex   = qtl.indexOf(status);
          var closeIndex = closeTicket.indexOf(status);
          if(tmIndex > 0 && feIndex > 0){
            var statusChk = ticetEles[j-1].roleStatus;
            if(statusChk == 'SelfAllocated'){
              feIndex = -1;
            }else{
              tmIndex = -1;
            }
          }
          var a = [scIndex,tlIndex,tmIndex,feIndex,qtmIndex,qtlIndex,closeIndex];
          var maxIndex = Math.max(scIndex,tlIndex,tmIndex,feIndex,qtmIndex,qtlIndex,closeIndex);
          var indexOfMaxValue = a.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0); 
          if(indexOfMaxValue == 0){
            scObj={
              'role':'SC',
              'date': ticket.createdAt,
              'color':'btn-danger',
              'status':status
            }
          }else if(indexOfMaxValue == 1){
            tlObj={
              'role':'TL',
              'date': ticket.createdAt,
              'color':'btn-danger',
              'status':status
            }
            scObj.color = 'btn-success';
          }else if(indexOfMaxValue == 2){
            tmObj={
              'role':'TM',
              'date': ticket.createdAt,
              'color':'btn-success',
              'status':status
            }
            tlObj.color = 'btn-success';            
          }else if(indexOfMaxValue == 3){
            feObj={
              'role':'FE',
              'date': ticket.createdAt,
              'color':'btn-success',
              'status':status
            }
            tmObj.color = 'btn-success';            
          }else if(indexOfMaxValue == 4){
            qtmObj={
              'role':'QTM',
              'date': ticket.createdAt,
              'color':'btn-success',
              'status':status
            }
            tmObj.color = 'btn-success';            
          }else if(indexOfMaxValue == 5){
            qtlObj={
              'role':'QTL',
              'date': ticket.createdAt,
              'color':'btn-success',
              'status':status
            }
            scObj.color = 'btn-success';
            tmObj.color = 'btn-success';                        
            qtmObj.color = 'btn-success';            
          }else if(indexOfMaxValue == 6){
            closeObj={
              'role':'Ticket Close',
              'date': ticket.createdAt,
              'color':'btn-success',
              'status':status
            }
            scObj.color = 'btn-success';
            tmObj.color = 'btn-success';                        
            qtmObj.color = 'btn-success'; 
            qtlObj.color = 'btn-success';   
            tlObj.color = 'btn-success';            
          }
      }
          blockDetails =[scObj,tlObj,tmObj,feObj,qtmObj,qtlObj,closeObj];
          
          
        }// EOF j loop
        tickteObj={
          'ticketNumber' : allTicketList.ticketNumber,
          'status'       : blockDetails,
          'serviceName'  : allTicketList.serviceName, 
        }
      }//EOF allTicketList
      // blockDetails.ticketNumber = allTicketList.ticketNumber;
      
      
      
      return tickteObj;
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
                                    <tr className="hrTableHeader UML-TableTr noLRPad col-lg-12">
                                      <th className="col-lg-1"> Order No.</th>
                                      <th className="col-lg-2"> User Name</th>
                                      <th className="col-lg-2"> Service Purchased </th>
                                      <th className="col-lg-2"> Order Date </th>
                                      <th className="col-lg-1"> Completion Date </th>
                                      <th className="col-lg-1"> Status </th>                          
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      !this.props.loading && this.props.data && this.props.data.length>0 ?
                                        this.props.data.map((orderDetails,index)=>{
                                          return(
                                            <tr key={index}>
                                              <tr>
                                                <td className="col-lg-1">
                                                    <a href={"/admin/orderdetails/"+orderDetails.orderLInk}><br/>
                                                      {orderDetails.orderNo}
                                                    </a>
                                                </td>
                                                <td className="col-lg-2"><a href={"/admin/orderdetails/"+orderDetails.orderLInk}>{orderDetails.userName}</a></td>
                                                <td className="col-lg-2"><a href={"/admin/orderdetails/"+orderDetails.orderLInk}>{orderDetails.service}</a></td>
                                                <td className="col-lg-2"><a href={"/admin/orderdetails/"+orderDetails.orderLInk}>{moment(orderDetails.orderDate).format('DD MMM YYYY')}</a></td>
                                                <td className="col-lg-1"><a href={"/admin/orderdetails/"+orderDetails.orderLInk}>{moment(orderDetails.completionDate).format('DD MMM YYYY')}</a></td>

                                                <td className="col-lg-1"> 
                                                    <div className={'noLRPad col-lg-9 ' + orderDetails.bgClassName}> 
                                                      <a href={"/admin/orderdetails/"+orderDetails.orderLInk} className="statuswcolor">
                                                        {orderDetails.finalStatus}
                                                        {
                                                          orderDetails.deoStatus !="Completed" ?
                                                            <div>Order Not closed by DEO</div>
                                                          :
                                                            null
                                                        }
                                                      </a>
                                                    </div> 
                                                    <i className="fa fa-caret-right orderDownArrow" data-toggle="collapse" data-target={"#collapseme"+index}> </i> 
                                                </td>
                                              </tr>
                                              <tr className="col-lg-12 trBottom">
                                              <div className="collapse out " id={"collapseme"+index}>
                                                    {
                                                      orderDetails.ticketDetails &&  orderDetails.ticketDetails.length > 0 ?
                                                        orderDetails.ticketDetails.map((ticketDetails,i)=>{  
                                                          return(
                                                            <div key={i}  className = "col-lg-12 noLRPad " data-name = {ticketDetails.ticketId}>
                                                              <span className="col-lg-12 noLRPad orderTicketHead">{ this.allTicketListDetails(ticketDetails.ticketId).ticketNumber} - {this.allTicketListDetails(ticketDetails.ticketId).serviceName}</span>
                                                                {
                                                                  ticketDetails.ticketId ?
                                                                    this.allTicketListDetails(ticketDetails.ticketId).status.map((statusData,index)=>{
                                                                      return(
                                                                        statusData.status !="TicketClosed" && statusData.role != "" ?
                                                                          <div key = {index} className="col-lg-2">
                                                                            <div className={"col-lg-12 noLRPad dispatchtldiv "+ statusData.color}>
                                                                              <span className="col-lg-12 noLRPad orderRoleName">{statusData.role!='' ? statusData.role : ""}</span>
                                                                              <span className="col-lg-12 noLRPad">{statusData.date!='' ? moment(statusData.date).format('DD MMM YYYY'):""}</span>
                                                                            </div>
                                                                          </div>
                                                                        :
                                                                        statusData.status =="TicketClosed" ?
                                                                          <div className="col-lg-2 noLRPad" key = {index}>
                                                                            <div className="col-lg-12 noLRPad">
                                                                              <a href={ticketDetails.report}>
                                                                                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pdf.png" className="img-responsive orderpdfimg"/>
                                                                              </a>
                                                                            </div>
                                                                          </div>
                                                                        :
                                                                        null
                                                                      )
                                                                    })
                                                                    :
                                                                    null
                                                                }
                                                                {
                                                                  orderDetails.finalStatus =="New" ?
                                                                      <div className="col-lg-12">
                                                                      <a href={"/admin/orderdetails/"+orderDetails.orderLInk}> 
                                                                        <button type="button" className="col-lg-2 generatereportbtn orderGenerateReport pull-right">Generate Report</button>
                                                                        </a>
                                                                      </div>
                                                                  :
                                                                    null
                                                                } 
                                                            </div>
                                                          ) 
                                                        })
                                                      :
                                                      null
                                                    }
                                                  </div>
                                              </tr>
                                            </tr>
                                          )
                                        })
                                      :
                                      <span>loading</span>
                                    }
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
AllOrderContainer = withTracker(props => { 
    var handleAllOrdersList = Meteor.subscribe("allOrders");
    var handleAllTicketsList = Meteor.subscribe("allTickets");
    var handlecorporateOrder = Meteor.subscribe('allCorporateOrder');  
    var allTicketListDetails = [];
    var orderData = {};
    var orderDisplayData = [];
    var loading = !handleAllOrdersList.ready() && !handleAllTicketsList.ready() && !handlecorporateOrder.ready();
    var _id  = Meteor.userId();
    var data = [];
    // var allOrderList = Order.find({"allocatedToUserid":Meteor.userId()},{sort:{createdAt: 1}}).fetch() || [];
    var allOrderList = Order.find({},{sort:{createdAt: 1}}).fetch() || [];
    
    
    if(allOrderList){
        for(i = 0 ; i < allOrderList.length ; i++){
          var corporateOrderDetails = CorporateOrders.findOne({"_id":allOrderList[i].corporateOrderId});
          // console.log('corporateOrderDetails: ', corporateOrderDetails);

          if(corporateOrderDetails){
              //Travers the CandidateList
              for( j = 0 ; j < allOrderList[i].candidateDetails.length; j++){
                if(allOrderList[i].serviceDetails){
                  var tempData = {
                    "orderNo"       : allOrderList[i].orderNo + ':'+ allOrderList[i].candidateDetails[j].candidateAssureID,
                    "userName"      : allOrderList[i].candidateDetails[j].candidateFirstName+" "+allOrderList[i].candidateDetails[j].candidateLastName,
                    "orderLInk"     : allOrderList[i]._id + '-' + allOrderList[i].candidateDetails[j].candidateId,
                    "service"       : allOrderList[i].serviceDetails.serviceName,
                    "orderDate"     : allOrderList[i].createdAt,
                    "completionDate": allOrderList[i].completedDate,
                  };
                }else{
                  var tempData = {
                    "orderNo"       : allOrderList[i].orderNo + ':'+ allOrderList[i].candidateDetails[j].candidateAssureID,
                    "userName"      : allOrderList[i].candidateDetails[j].candidateFirstName+" "+allOrderList[i].candidateDetails[j].candidateLastName,                
                    "orderLInk"     : allOrderList[i]._id + '-' + allOrderList[i].candidateDetails[j].candidateId,
                    "service" : allOrderList[i].packageDetails.packageName,
                    "orderDate"     : allOrderList[i].createdAt,
                    "completionDate": allOrderList[i].completedDate,
                  };
                }
                switch(allOrderList[i].candidateDetails[j].candidateVerificationStatus){
                  case 'Order Completed - Generating Report' :
                    tempData.finalStatus = 'New';
                    tempData.bgClassName = 'btn-primary';
                    break;
                  case 'Order Completed - Report Completed' :
                    tempData.finalStatus = 'Publish Report';
                    tempData.bgClassName = 'btn-success';
                    break;
                    case 'Completed' :
                    tempData.finalStatus = 'Completed';
                    tempData.bgClassName = 'bg-green';
                    break;
                  case 'In Process' :
                    tempData.finalStatus = 'WIP';
                    tempData.bgClassName = 'btn-warning';
                  break;
                  default :
                    tempData.finalStatus = 'WIP';
                    tempData.bgClassName = 'btn-warning';
                    break;
                } 
                
                tempData.ticketDetails = [];
                if (allOrderList[i].candidateDetails[j].verificationData) {
                  for(k = 0 ; k < allOrderList[i].candidateDetails[j].verificationData.length; k++){
                    if (allOrderList[i].candidateDetails[j].verificationData[k].ticketDetails) {
                      tempData.ticketDetails.push(
                        {
                          "ticketId":allOrderList[i].candidateDetails[j].verificationData[k].ticketDetails.ticketId,
                          "report":allOrderList[i].candidateDetails[j].verificationData[k].ticketDetails.report
                        }
                      );
                    }
                  }
                  if(corporateOrderDetails.DEOStatus){
                    tempData.deoStatus = corporateOrderDetails.DEOStatus;
                  }
                  
                  data.push(tempData);
                }         
              }

          }
           
        }
    }   
    return {
        loading,
        data,
    };
})(AllOrders);
export default AllOrderContainer;
