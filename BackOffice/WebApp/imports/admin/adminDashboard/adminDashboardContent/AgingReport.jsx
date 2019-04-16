import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CorporateOrders } from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';
import ServiceStatistics from './ServiceStatistics.jsx';

class AgingReport extends TrackerReact(Component){ 

    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 carouselWrap">
                {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 individualWrap">
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                        <div className="col-lg-5 col-md-5 col-sm-6 col-xs-6 noLRPad">
                                <i className="fa fa-ticket verifDashIcon bg-orange" aria-hidden="true"></i>
                        </div>
                        <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 noLRPad blocktitle">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext">
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Total Checks</span>
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12">&nbsp; &nbsp; {this.props.allTotalChecks ? this.props.allTotalChecks : 0}</span>
                                </div>
                        </div>
                    </div>
                </div> */}
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 agingwrap">
                    {/* beyond TAT */}
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 masterWrap">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 plateBlock noLRPad">
                            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad">
                                <i className="fa fa-bar-chart verifDashIcon iconColor" aria-hidden="true"></i>
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6 serviceHead">
                                <label>Beyond TAT</label><br/>
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.bt.totalbt :"0"}</label>
                            </div>
                        </div>
                        <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                        <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                            <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 leftColorBox">
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <label>{'< 10'}</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.bt.lessthen10 :"0"}</label>
                            </div>
                        </div>

                        <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                        <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                            <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 completedBg">
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <label>{'< 20'}</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.bt.lessthen20 :"0"}</label>
                            </div>
                        </div>

                        <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                        <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                            <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 insifficiencyBg">
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <label>{'> 30'}</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.bt.grteqthen30 :"0"}</label>
                            </div>
                        </div>

                    </div>
                    {/* Within TAT */}
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 masterWrap">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 plateBlock noLRPad">
                            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad">
                                <i className="fa fa-bar-chart verifDashIcon iconColor" aria-hidden="true"></i>
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6 serviceHead">
                                <label>Within TAT</label><br/>
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.wt.totalwt :"0"}</label>
                            </div>
                        </div>
                        <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                        <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                            <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 leftColorBox">
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <label>{'< 5'}</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.wt.lessthen5 :"0"}</label>
                            </div>
                        </div>

                        <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                        <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                            <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 completedBg">
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <label>{'< 10'}</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.wt.lessthen10 :"0"}</label>
                            </div>
                        </div>

                        <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                        <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                            <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 insifficiencyBg">
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <label>{'< 15'}</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.wt.lessthen15 :"0"}</label>
                            </div>
                        </div>

                    </div>
                    {/* Due Today */}
                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 masterWrap">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 plateBlock noLRPad">
                            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad">
                                <i className="fa fa-bar-chart verifDashIcon iconColor" aria-hidden="true"></i>
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6 serviceHead">
                                <label>Due Today</label><br/>
                                <label>{this.props.tatDetailsCases ? this.props.tatDetailsCases.dt : 0}</label>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
 
}
AgingReportContainer = withTracker(props => {
    var tatDetails = props.tatDetailsCases;
    return{
        tatDetails
    }
  
})(AgingReport);
export default AgingReportContainer;
