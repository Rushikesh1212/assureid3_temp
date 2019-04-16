import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import { withTracker } from 'meteor/react-meteor-data';
import {Tracker} from 'meteor/tracker';
import { browserHistory } from 'react-router';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Order } from "/imports/website/ServiceProcess/api/Order.js";



// import { UserSubscriptions } from '/imports/website/contactUs/api/SubscriptionMaster.js';

class YearlyReports extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            "subscribe": Meteor.subscribe("OrdersData"),
            
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount(){
        this.contactTracker = Tracker.autorun(()=>{
       
        });
        this.handleChange = this.handleChange.bind(this);
        
    }

    handleChange(event){
        event.preventDefault();
       const target = event.target;
       const name = target.name;

       this.setState({
           [name] : event.target.value,
       });
   }


    currentyear(){
		var yearSession = Session.get('selectedYear');
		if(yearSession){
			var currentYear = yearSession;
		}else{
			var today = new Date();
	        var currentYear = today.getFullYear();
			Session.set("selectedYear",currentYear);
		}

		return currentYear;
	}

	previousYear(event){
		event.preventDefault();
		var selectedYear = $(".inputyearlyValue").val();
		var newYear = moment(selectedYear).subtract(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);
	}

	nextYear(event){
		event.preventDefault();
		var selectedYear = $(".inputyearlyValue").val();
		var newYear = moment(selectedYear).add(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);

    }
    

    dataTableList(){
		var yearFromSess = Session.get("selectedYear");
        
        var thisYear = yearFromSess;
        var yearDateStart = new Date("1/1/" + thisYear);
        var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);

		var reportData =  Order.find({'createdAt':{$gte : yearDateStart, $lt : yearDateEnd },'paymentStatus' : 'paid'}, {sort: {'createdAt': -1}}).fetch();
        var reportDataArr = [];
        var total = 0;
		if(reportData){
			for(i=0;i<reportData.length;i++){
                total = total+(parseInt(reportData[i].totalAmount));
				reportDataArr.push(
					<tr key={reportData[i]._id}>
						 <td>{reportData[i].orderNo}</td>
                         <td>{reportData[i].serviceName}</td>
                         <td>{moment(reportData[i].createdAt).format('DD MMM YYYY')}</td>
                         {/* <td>{reportData[i].paymentMethod}</td> */}
                         {/* <td>{reportData[i].productLength}</td> */}
                         {/* <td>{reportData[i].totalQuantity}</td> */}
                         <td><i className="fa fa-rupee"></i> {(parseInt(reportData[i].totalAmount)).toFixed(2)}</td>
					</tr>
				);
			}
        }
        if(reportData.length>0){
            reportDataArr.push(
                <tr key={1}>
                    <td></td>
                    <td></td>
                    <td className="totalTitle">Total</td>
                    <td className="totalTitle"><i className="fa fa-rupee"></i>&nbsp;{(total).toFixed(2)}</td>
                </tr>
            )
        }
		return reportDataArr;
    }

   
    render(){
        if(!this.props.loading){
            return( 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="sales-report-main-class">
                        <div className="reports-select-date-boxmain">
                            <div className="reports-select-date-boxsec">
                                <div className="reports-select-date-Title">Yearly Reports</div>
                                <div className="input-group">
                                    <span onClick={this.previousYear.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-left" aria-hidden="true"></i></span>
                                    <input onChange={this.handleChange} value={this.currentyear()} name="inputyearlyValue" type="text" className="inputyearlyValue reportsDateRef form-control" placeholder="" aria-label="Brand" aria-describedby="basic-addon1" ref="inputyearlyValue"  />
                                    <span onClick={this.nextYear.bind(this)} className="commonReportArrowPoiner input-group-addon" id="basic-addon1"><i className="fa fa-chevron-circle-right" aria-hidden="true"></i></span>
                                </div>
                            </div>
                        </div>

                        <div className="report-list-downloadMain">
                            {/* <div className="report-list-downloadPdf">
                                <i className="fa fa-file-pdf-o" aria-hidden="true"></i>PDF
                            </div>
                            <div className="report-list-downloadPrint">
                                <i className="fa fa-print" aria-hidden="true"></i>Print
                            </div> */}
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button btn report-list-downloadXLXS"
                                table="subscriber-list-outerTable"
                                filename="tablexls"
                                sheet="tablexls"
                                buttonText="Download as XLS"/>
                        </div>
                    </div>
                
                    <div>
                        <div className="reports-table-main">
                            <table id="subscriber-list-outerTable"  className="subscriber-list-outerTable table table-bordered table-hover table-striped table-striped table-responsive table-condensed table-bordered">
                                <thead>
                                <tr className="table-head  reports-list-outerTR">
                                    <th className=" reports-list-outerTableth">Order No.</th>
                                    <th className=" reports-list-outerTableth">Service Name</th> 
                                    <th className=" reports-list-outerTableth">Date</th>
                                    {/* <th className=" reports-list-outerTableth">Transaction Type</th>
                                    <th className=" reports-list-outerTableth">Product Count</th>
                                    <th className=" reports-list-outerTableth">Quantity</th> */}
                                    <th className=" reports-list-outerTableth">Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                    
                                    {this.dataTableList()} 

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
            );
        }else{
            return(<span>loading...</span>);
        }
    }
}export default YearlyReportsContainer = withTracker((props) => { 
    const postHandle   = Meteor.subscribe('allOrders');
    var loading = !postHandle.ready();
    return{
        loading:loading,
    }

   
})(YearlyReports);