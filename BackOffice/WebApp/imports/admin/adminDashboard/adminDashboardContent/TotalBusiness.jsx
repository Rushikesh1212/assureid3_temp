import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';


class TotalBusiness extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
        } 
    }
    
    componentDidMount(){
      var serviceArray = [];
      var datavalues = [];
      var datalabels = [];
      var dataWithLabels = [];      
      this.chartTracker = Tracker.autorun( ()=> {
      var handle = Meteor.subscribe("allTickets");
      var allTickets = TicketMaster.find({}).fetch();
    
        
        if(handle.ready()){
          if(allTickets.length> 0){
            for(i=0;i<allTickets.length;i++){
              var serviceValue = allTickets[i].serviceName;
              serviceArray.push({'service':serviceValue});
            }
           
            var pluckService = _.pluck(serviceArray,"service");
            var uniqueService = _.uniq(pluckService);
        
            
            if(uniqueService.length>0){
              for(var j=0;j<uniqueService.length;j++){
                  var ticketDetails = TicketMaster.find({'serviceName':uniqueService[j]}).fetch();
                  var count = ticketDetails.length;
                
                // datavalues.push(count);
                dataWithLabels.push({'country':uniqueService[j],'litres':count});
                
                }//EOF j
        
              }//EOF i
              // chartValues(dataWithLabels);
          }

        }
        
      this.amchartDisplay(dataWithLabels)

      });
      
    }
    amchartDisplay(){
    
      if(!this.props.loading &&  this.props.dataWithLabels.length > 0 ){
          var chart = AmCharts.makeChart( "totalbusiness",{
              "type": "pie",
              "theme": "light",
              "dataProvider": this.props.dataWithLabels,
              "valueField": "litres",
              "titleField": "country",
              "balloon":{
              "fixedPosition":true
              },
              "export": {
                "enabled": true
              }
          });
        return (<div id="totalbusiness"></div>);
      }else{
        return(<span>No Data Available</span>)
      }
    }

    render(){
        return(    
            <div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 noLRPad">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock innerblock1 tableinnetWrap1 tableinnetWrap noLRPad">
                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ticketTableLabel ticketchartTableLabel">Total Business                     
                    <span>
                        <a href="/ComingSoon" title="View All">
                            {/* <i className="fa fa-arrow-right pull-right arrowcolor" aria-hidden="true"></i> */}
                        </a>
                    </span>
                </label>
                <div id="totalbusiness">
                
                  {/* {this.amchartDisplay()} */}
                </div>
                  
                </div>
               
            </div>
        )
    }
}
export default TotalBusinessContainer = withTracker(props => {
  var ticketHandle = Meteor.subscribe("allTickets");
  var loading   = !ticketHandle.ready();
  var allTickets = TicketMaster.find({}).fetch();
  var serviceArray = [];
  var datavalues = [];
  var datalabels = [];
  var dataWithLabels = [];
  if(allTickets.length> 0){
    for(i=0;i<allTickets.length;i++){
      var serviceValue = allTickets[i].serviceName;
      serviceArray.push({'service':serviceValue});
    }
   
    var pluckService = _.pluck(serviceArray,"service");
    var uniqueService = _.uniq(pluckService);

    if(uniqueService.length>0){
      for(j=0;j<uniqueService.length;j++){
          var ticketDetails = TicketMaster.find({'serviceName':uniqueService[j]}).fetch();
          var count = ticketDetails.length;
       
        // datavalues.push(count);
        dataWithLabels.push({'country':uniqueService[j],'litres':count});
        
        }//EOF j

      }//EOF i
      // chartValues(dataWithLabels);
  }

     
  return {
    loading,    
    dataWithLabels
  };
})(TotalBusiness);