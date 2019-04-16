import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Order } from '/imports/admin/orderManagement/api/Order.js';
class OrderReport extends TrackerReact(Component) {
        constructor(){
            super();
        }
        render(){
            return(
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 corporateDetailsBlock">
                    <h3 className="candidateReportHead col-lg-2 col-md-12 col-sm-12 col-xs-12"><strong>Order Report</strong></h3>
                     <div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 reportTable">
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 candidateReportBlock">                            
                                Total Candidate<br/>({this.props.corporateDetails.totalCandidateNumber ? this.props.corporateDetails.totalCandidateNumber : 0})
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 candidateReportBlock">                                                        
                                Expected Checks<br/>({this.props.corporateDetails.totalCandidateNumber ? this.props.corporateDetails.totalCandidateNumber : 0}* {this.props.totalMaxCheck}) = {this.props.totalExpecedChecks ? this.props.totalExpecedChecks : 0}
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 candidateReportBlock">                                                    
                                Actual Checks<br/>({this.props.actualCheck ? this.props.actualCheck : 0})
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <i className="fa fa-caret-right expandCursor pull-right" title="Click to expand list" aria-hidden="true"  data-toggle="collapse" data-target="#orderReport"></i>
                        </div>
                    </div>
                    <div className="table-responsive reportTable collapse col-lg-12 col-md-12 col-sm-12 col-xs-12" id="orderReport">                                     
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                    
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Service Name</th>
                                        <th>Expected Checks</th>
                                        <th>Actual Checks</th>                                       
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.orderReportTabel && this.props.orderReportTabel.length > 0 ?
                                            this.props.orderReportTabel.map((reportData,index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <td>{reportData.serviceName}</td>
                                                        <td>{reportData.totalCandidateNumber ? reportData.totalCandidateNumber : 0}*{reportData.serviceCount ? reportData.serviceCount : 0} = {reportData.totalCandidateNumber * reportData.serviceCount}</td>
                                                        {/* <td>2*2 = 4</td> */}
                                                        <td>{reportData.serviceActualChecks ? reportData.serviceActualChecks : "-"}</td> 
                                                    </tr>     
                                                )
                                            })
                                        :
                                        <tr>
                                        <td></td>
                                        <td>No Data Availabel</td>
                                        <td></td> 
                                    </tr>     
                                    }
                                   
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )

        }       
}
OrderReportContainer = withTracker((props) => {
    var corporateDetails = props.corporatedetails;
    // console.log('corporateDetails: ', corporateDetails);
    var serviceArray     = props.validServiceArray;
    // console.log('serviceArray: ', serviceArray);
    var orderReportTabel = [];
    var serviceDetails   = {};
    var serviceNameArray = [];
    var totalExpecedChecks = 0;
    var totalServiceCount  = 0;
    var totalMaxCheck = 0;
    var serviceDetails     = {};
    var handleOrderWithCorpOrder = Meteor.subscribe("orderWithCorporateOrder",corporateDetails._id);
    var loading = !handleOrderWithCorpOrder.ready();
    if (serviceArray && corporateDetails){
        totalExpecedChecks = corporateDetails.exceptedChecks;
        // console.log('totalExpecedChecks: ', totalExpecedChecks);
        actualCheck  = corporateDetails.actualChecks;
        // console.log('actualCheck: ', actualCheck);
        // actualCheck        = 
        if(serviceArray.length > 0 ){
            for(var i=0;i<serviceArray.length;i++){
                
                totalMaxCheck += parseInt(serviceArray[i].MaxCheck);
                totalServiceCount += parseInt(serviceArray[i].MaxCheck);
                serviceDetails = {
                    serviceId    : serviceArray[i].serviceId,
                    serviceName  : serviceArray[i].serviceName,
                    serviceCount : parseInt(serviceArray[i].MaxCheck),
                    totalCandidateNumber : parseInt(corporateDetails.totalCandidateNumber),
                    serviceActualChecks  : parseInt(serviceArray[i].actualServiceCheck)
                }
                orderReportTabel.push(serviceDetails);
            }
        }
    }

    // var j=0;
    // var actualCheck = 0;
    // if (corporateDetails.orderDetails) {       
    //     if(corporateDetails.orderDetails.length > 0){
    //         for(j=0;j<corporateDetails.orderDetails.length;j++){
    //             var numOfVerifications = Order.findOne({"_id" : corporateDetails.orderDetails[j].orderId});
    //             if(numOfVerifications){
    //                 if(numOfVerifications.candidateDetails[0] && numOfVerifications.candidateDetails[0].verificationData){
    //                     actualCheck+=numOfVerifications.candidateDetails[0].verificationData.length;
    //                 }
    //             }
    //             serviceNameArray.push({"serviceName":corporateDetails.orderDetails[j].serviceId});
    //         }

    //         }            
    //         /** find unique service name form serviceNameArray*/
    //         var serviceName = _.pluck(serviceNameArray,"serviceName"); 
    //         var uniqueServiceName = _.uniq(serviceName);
    //         uniqueServiceName.map((serviceData,index)=>{
    //         var serviceActualChecks = 0;
    //         /** map with orderDetails*/
    //             corporateDetails.orderDetails.map((corporateData ,index)=>{
    //                 if(serviceData == corporateData.serviceId){
    //                     /** if match add serviceActualChecks*/                        
    //                     serviceActualChecks+= parseInt(corporateData.numberOfVerifications);
    //                 }
    //             });

    //             orderReportTabel.map((data,index)=>{
    //                 if(data.serviceId == serviceData){
    //                     orderReportTabel[index].serviceActualChecks= serviceActualChecks;   
    //                 }
    //             });
    //         });
    // }
    // console.log("orderReportTabel :",orderReportTabel);

    return {
        corporateDetails,
        totalExpecedChecks,
        totalServiceCount,
        actualCheck,
        orderReportTabel,
        totalMaxCheck

    };
  })(OrderReport);
  export default OrderReportContainer;

