import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';


export default class CustomerComplaints extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }

    componentWillMount(){

        var chart = AmCharts.makeChart( "customercomplaints", {
            "type": "serial",
            "theme": "light",
            "dataProvider": [ {
              "country": "USA",
              "visits": 2025
            }, {
              "country": "China",
              "visits": 1882
            }, {
              "country": "Japan",
              "visits": 1809
            }, {
              "country": "Germany",
              "visits": 1322
            }, {
              "country": "UK",
              "visits": 1122
            }, {
              "country": "France",
              "visits": 1114
            }, {
              "country": "India",
              "visits": 984
            }, {
              "country": "Spain",
              "visits": 711
            }, {
              "country": "Netherlands",
              "visits": 665
            }, {
              "country": "Russia",
              "visits": 580
            }, {
              "country": "South Korea",
              "visits": 443
            }, {
              "country": "Canada",
              "visits": 441
            }, {
              "country": "Brazil",
              "visits": 395
            } ],
            "valueAxes": [ {
              "gridColor": "#FFFFFF",
              "gridAlpha": 0.2,
              "dashLength": 0
            } ],
            "gridAboveGraphs": true,
            "startDuration": 1,
            "graphs": [ {
              "balloonText": "[[category]]: <b>[[value]]</b>",
              "fillAlphas": 0.8,
              "lineAlpha": 0.2,
              "type": "column",
              "valueField": "visits"
            } ],
            "chartCursor": {
              "categoryBalloonEnabled": false,
              "cursorAlpha": 0,
              "zoomable": false
            },
            "categoryField": "country",
            "categoryAxis": {
              "gridPosition": "start",
              "gridAlpha": 0,
              "tickPosition": "start",
              "tickLength": 20
            },
            "export": {
              "enabled": true
            }

        } );

    }

    render(){
        return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap1 noLRPad">
                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel">Customer Complaints                    
                    <span>
                        <a href="/ComingSoon" title="View All">
                            {/* <i className="fa fa-arrow-right pull-right arrowcolor" aria-hidden="true"></i> */}
                        </a>
                    </span>
                </label>
                {/* <div id="customercomplaints" style={{"height":"400"+"px"}}>
                </div> */}

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="customerComplaint">
                    <h4>Coming Soon</h4>
                </div>
                </div>
               
            </div>
        )
    }
}
// AlllocatedTicketsContainer = withTracker(props => { 
   
// })(AlllocatedTickets);
// export default AlllocatedTicketsContainer;
