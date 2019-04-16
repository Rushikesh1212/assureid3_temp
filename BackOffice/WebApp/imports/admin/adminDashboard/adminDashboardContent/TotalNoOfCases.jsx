import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class TotalNoOfCases extends TrackerReact(Component){
	  constructor(props){
       super(props);
        this.state = {
        } 
    } 

    componentDidMount(){
      
    }



    render(){
         return(    
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
{/*                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap1 innerblock1 tableinnetWrap noLRPad">
*/}                {/*<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel ticketchartTableLabel">Total Number Of Cases                     
                    <span>
                        <a href="/ComingSoon" title="View All">
                        </a>
                    </span>
                </label>*/}
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                  <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12  noLRPad">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                      <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                          <i className="fa fa-ticket iconStyle bg-darkblue" aria-hidden="true"></i>
                      </span>
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext ">
                              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"> <b> Total Cases</b></span>
                              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp;{this.props.allTicketCount}</span>
                          </div>
                      </div>
                    </div>
                  </div> 
                    <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                            <span className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad Bg-success">
                                <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext">
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"> <b> Completed Cases</b></span>
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp; {this.props.allcompletedTicket}</span>
                                </div>                                  
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                            <span className="col-lg-4 col-md-4 col-sm-8 col-xs-8 noLRPad Bg-warning">
                                <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext ">
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"> <b> Pending Cases</b></span>
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp; {this.props.allpendingCases}</span>
                                </div>                                  
                            </div>
                        </div>
                    </div>
                    {/*<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                            <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                <i className="fa fa-ticket iconStyle Bg-danger" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLRPad">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext">
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp;<b> Insufficiency</b></span>
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp; 20</span>
                                </div>                                  
                            </div>
                        </div>
                    </div>*/}
                </div>  
               {/*</div>*/}
            </div>
        )
    }
}
export default TotalNoOfCasesContainer = withTracker(props => {
    var ticketHandle = Meteor.subscribe("allTickets");
    var completedTicketHandle = Meteor.subscribe("allclosedTickets");
    var loading      = !ticketHandle.ready() && !completedTicketHandle.ready(); 
    var allTicketCount   = TicketMaster.find({}).count();
    var allcompletedTicket = TicketMaster.find({"ticketStatus" : "TicketClosed"}).count();
    // console.log("allTicketCount :",allTicketCount);
    // console.log("allcompletedTicket :",allcompletedTicket);
    var allpendingCases = 0;
    if (allTicketCount >= 0 || allcompletedTicket >= 0 ) {
      allpendingCases     = allTicketCount - allcompletedTicket;
    }

    return {
      loading,
      allTicketCount,
      allcompletedTicket,
      allpendingCases
    };
  })(TotalNoOfCases);

