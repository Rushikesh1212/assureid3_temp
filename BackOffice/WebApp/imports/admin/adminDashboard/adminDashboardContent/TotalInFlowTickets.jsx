import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class TotalInFlowTickets extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    } 

    componentDidMount(){
      var dateArray = [];
      var datavalues = [];
      var datalabels = [];
      var dataWithLabels = [];      
      this.chartTracker = Tracker.autorun( ()=> {
      var handle = Meteor.subscribe("allTickets");
      var allTickets = TicketMaster.find({}).fetch();
   
        
        if(handle.ready()){
          if(allTickets.length> 0){
            for(i=0;i<allTickets.length;i++){
              var dateValue = allTickets[i].orderDate;
              var date = dateValue.toLocaleDateString('en-IN');
               var dateMonth   =  date.split('/');
              dateArray.push({'date':dateMonth[1]});
          }
           
      var pluckDate = _.pluck(dateArray,"date");
      var uniqueMonth = _.uniq(pluckDate);

      if(uniqueMonth.length>0){
        
        for(var j=0;j<uniqueMonth.length;j++){
        var count = 0;
          for(k=0;k<allTickets.length;k++){
            var alldateValue = allTickets[k].orderDate;
            var alldate = alldateValue.toLocaleDateString('en-IN');
            
            // var getuniqueMonth = uniqueMonth[j].split('/');
            var alldateMonth   =  alldate.split('/');
            if(uniqueMonth[j]===alldateMonth[1]){
                count++;
            }
            
          }//EOF k
          var monthName =moment(uniqueMonth[j],"M").format("MMM");

          dataWithLabels.push({'year':monthName,'income':count,'expense':count});
        }//EOF i
        // chartValues(dataWithLabels);
      } 
    }
        }
      
      this.amchartDisplay(dataWithLabels)

      });
      
    }
  
    amchartDisplay(){
      // if(!this.props.loading &&  this.props.dataWithLabels.length > 0 ){
        var chart = AmCharts.makeChart("inflowtickets", {
                "type": "serial",
                "addClassNames": true,
                "theme": "light",
                "autoMargins": false,
                "marginLeft": 30,
                "marginRight": 8,
                "marginTop": 10,
                "marginBottom": 26,
                "balloon": {
                  "adjustBorderColor": false,
                  "horizontalPadding": 10,
                  "verticalPadding": 8,
                  "color": "#ffffff"
                },
              
                "dataProvider": this.props.dataWithLabels,
                "valueAxes": [ {
                  "axisAlpha": 0,
                  "position": "left"
                } ],
                "startDuration": 1,
                "graphs": [ {
                  "alphaField": "alpha",
                  "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                  "fillAlphas": 1,
                  "title": "Cases",
                  "type": "column",
                  "valueField": "income",
                  "dashLengthField": "dashLengthColumn"
                }, {
                  "id": "graph2",
                  "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                  "bullet": "round",
                  "lineThickness": 3,
                  "bulletSize": 7,
                  "bulletBorderAlpha": 1,
                  "bulletColor": "#FFFFFF", 
                  "useLineColorForBulletBorder": true,
                  "bulletBorderThickness": 3,
                  "fillAlphas": 0,
                  "lineAlpha": 1,
                  "title": "Expenses",
                  "valueField": "expenses",
                  "dashLengthField": "dashLengthLine"
                } ],
                "categoryField": "year",
                "categoryAxis": {
                  "gridPosition": "start",
                  "axisAlpha": 0,
                  "tickLength": 0
                },
                "export": {
                  "enabled": true
                }
              } 
            );
            // return (<div id="inflowtickets"></div>);
          // }else{
          //   return(<span>No Data Available</span>)
          // }
    }


    render(){
         return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock tableinnetWrap1 innerblock1 tableinnetWrap noLRPad">
                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel ticketchartTableLabel">Total Inflow Of Cases                     
                    <span>
                        <a href="/ComingSoon" title="View All">
                            {/* <i className="fa fa-arrow-right pull-right arrowcolor" aria-hidden="true"></i> */}
                        </a>
                    </span>
                </label>
               <div id="inflowtickets"></div>
               {/*{this.amchartDisplay()}*/}
                
                </div>
            </div>
        )
    }
  }

  export default TicketInFlowContainer = withTracker(props => {
    var ticketHandle = Meteor.subscribe("allTickets");
    var loading   = !ticketHandle.ready();
    var allTickets = TicketMaster.find({}).fetch();
    var dateArray = [];
    var datavalues = [];
    var datalabels = [];
    var dataWithLabels = [];
    if(allTickets.length> 0){
      for(i=0;i<allTickets.length;i++){
        var dateValue = allTickets[i].orderDate;
        var date = dateValue.toLocaleDateString('en-IN');
         var dateMonth   =  date.split('/');
        dateArray.push({'date':dateMonth[1]});
    }
     
      var pluckDate = _.pluck(dateArray,"date");
      var uniqueMonth = _.uniq(pluckDate);

      if(uniqueMonth.length>0){
        
        for(j=0;j<uniqueMonth.length;j++){
        var count = 0;
          for(k=0;k<allTickets.length;k++){
            var alldateValue = allTickets[k].orderDate;
            var alldate = alldateValue.toLocaleDateString('en-IN');
            
            // var getuniqueMonth = uniqueMonth[j].split('/');
            var alldateMonth   =  alldate.split('/');
            if(uniqueMonth[j]===alldateMonth[1]){
                count++;
            }
            
          }//EOF k
          var monthName =moment(uniqueMonth[j],"M").format("MMM");

          dataWithLabels.push({'year':monthName,'income':count,'expense':count});
        }//EOF i
        // chartValues(dataWithLabels);
      }
    }


    return {
      loading,    
      dataWithLabels
    };
  })(TotalInFlowTickets);
