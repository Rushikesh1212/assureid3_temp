import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
// import { CorporateOrders } from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';
import {TicketMaster} from '/imports/admin/caseManagement/api/TicketMaster.js';
import VerificationDashboard from './VerificationDashboard.jsx';
import SummaryLedger from './SummaryLedger.jsx';
import {Order} from '/imports/admin/orderManagement/api/Order.js';
import AgingReport from './AgingReport.jsx'; 


class StatisticsMasterForAdmin extends TrackerReact(Component){ 
    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap1 innerblock1 noLRPad">
                {/*<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel ticketchartTableLabel">Case Details                                       
                </label>*/}
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                    <SummaryLedger orderList={this.props.orderList} services={this.props.services}/>
                </div> 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad individualWrap">
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6" >
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                            <i className="fa fa-ticket verifDashIcon bg-orange" aria-hidden="true"></i>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad blocktitle">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalCheckBlock">
                                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center noLRPad"> &nbsp; &nbsp;<b> Total Cases</b></span>
                                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp; {this.props.allticketCount ? this.props.allticketCount : 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-11 col-md-11 col-sm-12 col-xs-12 carouselouterWrap"> 
                        <VerificationDashboard detailChecks={this.props.detailChecks}/>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad individualWrap">
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                <i className="fa fa-ticket verifDashIcon bg-orange" aria-hidden="true"></i>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad blocktitle">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalCheckBlock">
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center noLRPad"> &nbsp; &nbsp;<b> Aging Report</b></span>
                                </div>
                        </div>
                    </div>
                    <div className="col-lg-11 col-md-11 col-sm-12 col-xs-12 carouselouterWrap">
                        <AgingReport tatDetailsCases={this.props.tatDetailsCases}/>
                   </div>
                </div>
            </div>
        </div>
        );
    }
 
} 
StatisticsMasterContainer = withTracker(props => {
  
    const postHandle    = Meteor.subscribe('allTickets');
    const serviceHandle = Meteor.subscribe('services');
    const orderHandle   = Meteor.subscribe('allOrders');
    const loading       = !postHandle.ready() && !serviceHandle.ready() && !orderHandle.ready();
    var allticketCount  =  TicketMaster.find({}).count();

    var services        =  Services.find({}).fetch();
    
    var detailChecks    = [];
    var allTotalChecks  = 0;

    var tatDetailsCases = {
        bt : {
            totalbt      : 0,
            lessthen10   : 0,
            lessthen20   : 0,
            grteqthen30  : 0,
        },
        wt : {
            totalwt      : 0,
            lessthen5    : 0,
            lessthen10   : 0,
            lessthen15   : 0,
        },
        dt : 0
    };
    //Start of Calcutions

    var orderList = Order.find({},{sort:{"createdAt": -1}}).fetch();

    orderList.map((orderData,i)=>{	 
        if (orderData.packageDetails) {
           orderData.packageDetails.servicesIncluded.filter(function(serviceData){
               var i = detailChecks.findIndex(x => x.serviceId == serviceData.serviceId);
               if(i <= -1){
                   detailChecks.push({serviceId: serviceData.serviceId, serviceName: serviceData.serviceName,totalChecks : 0, wip: 0, insuff:0, completed:0});
               }
           });
        }
     
    });
   
    orderList.map((orderData,j)=>{
        allTotalChecks += 1;
        var tDate= orderData.tatDate;
        var tatDate =moment(tDate).format('MM-DD-YYYY'); 
        var todaysDate = moment(new Date()).format('MM-DD-YYYY');
        if(orderData.tatDate){
        if(tatDate == todaysDate){
            if(orderData.completedDate){
                tatDetailsCases.wt.totalwt += 1;
                var tatDate  = new Date(orderData.tatDate);
                var cDate    = new Date(orderData.completedDate);
                var timeDiff = Math.abs(tatDate.getTime() - cDate.getTime());
                var ageing   = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if(ageing < 5){
                    tatDetailsCases.wt.lessthen5 += 1;
                }else if(ageing > 4 && ageing < 10){
                    tatDetailsCases.wt.lessthen10 += 1;
                }else{
                    tatDetailsCases.wt.lessthen15 += 1;
                }  

            }else{
                tatDetailsCases.dt+= 1;
            }
        }else{
            if(orderData.completedDate){
                tatDetailsCases.bt.totalbt+= 1;
                var tatDate  = new Date(orderData.tatDate);
                var cDate    = new Date(orderData.completedDate);
                var timeDiff = (cDate.getTime() - tatDate.getTime());
                // console.log('timeDiff: ', timeDiff);
                var ageing   = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if(ageing<0){
                    //Add count in Within TAT Date
                    var exactDays =Math.abs(ageing);
                    // console.log('exactDays: ', exactDays);
                    if(exactDays < 5){
                        tatDetailsCases.wt.lessthen5 += 1;
                    }else if(exactDays > 4 && exactDays < 10){
                        tatDetailsCases.wt.lessthen10 += 1;
                    }else{
                        tatDetailsCases.wt.lessthen15 += 1;
                    } 
                }else if(ageing > 0){
                    //Add count in Beyond TAT Date
                    if(ageing < 10){
                        tatDetailsCases.bt.lessthen10= tatDetailsCases.bt.lessthen10+1;
                    }else if(ageing > 9  && ageing < 20){
                        tatDetailsCases.bt.lessthen20 += 1;
                    }else{
                        tatDetailsCases.bt.grteqthen30 += 1;
                    }  

                }else{
                    //Increase Due Count
                    tatDetailsCases.dt+= 1;
                }
                    
            }else{
                //If completed date is not present it add in beyond TAT 
                var tatDate    = new Date(orderData.tatDate);
                var todaysDate = new Date();
                var timeDiff = Math.abs(todaysDate.getTime() - tatDate.getTime());
                var ageing   = Math.ceil(timeDiff / (1000 * 3600 * 24));
                // console.log('ageing: ', ageing);

                if(ageing < 10){
                    tatDetailsCases.bt.lessthen10= tatDetailsCases.bt.lessthen10+1;
                }else if(ageing > 9  && ageing < 20){
                    tatDetailsCases.bt.lessthen20 += 1;
                }else{
                    tatDetailsCases.bt.grteqthen30 += 1;
                } 
            }
        }
        }
        if (orderData.candidateDetails){
        if(orderData.candidateDetails[0]){
            if(orderData.candidateDetails[0].verificationData){
                var verifyData = orderData.candidateDetails[0].verificationData;
                if(verifyData){
                    verifyData.map((verifData,k)=>{
                        var serviceFind = detailChecks.findIndex(x => x.serviceId == verifData.serviceId);
                        if(serviceFind >= 0){
                            detailChecks[serviceFind].totalChecks += 1;
                            if(verifData.ticketDetails){
                                switch(verifData.ticketDetails.status) {
                                    case 'Completed' :
                                        detailChecks[serviceFind].completed += 1;
                                        break;
                                    case 'Insufficiency' : 
                                        detailChecks[serviceFind].insuff += 1;
                                        break;
                                    default : 
                                        detailChecks[serviceFind].wip += 1;
                                        break;
                                }
                            }else{
                                detailChecks[serviceFind].wip += 1;
                            }
                            
                        }
                    });
                }
            }
        }
        }
    });
    // console.log("allticketCount :",allticketCount);
       return{
        // allcorporateOrders,
        services,
        detailChecks,
        allticketCount,
        tatDetailsCases,
        orderList
    }
})(StatisticsMasterForAdmin);
export default StatisticsMasterContainer;
