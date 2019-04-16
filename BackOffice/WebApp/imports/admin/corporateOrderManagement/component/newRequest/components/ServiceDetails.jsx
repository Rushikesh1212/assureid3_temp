import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class ServiceDetails extends TrackerReact(Component) {

        constructor(){ 
            super();
        }

        render(){
            return(
                <div className ="col-lg-6 col-md-6 col-sm-6 col-xs-12 basicInfoOuter noPaddingRight">
                    <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDetailsBlock basicInfoOuter companyServiceDetailsBlock">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6"> 
                        <h5><b>Service Name</b></h5>                                
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                        <h5><b> Check / Service</b></h5>                                
                        </div>
                        {
                        this.props.validServiceArray ?
                            this.props.validServiceArray.length>0 ?
                            this.props.validServiceArray.map((service,index)=>{
                                return(
                                <div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <h5> {service.serviceName ? service.serviceName : "-"}</h5>                         
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <h5> {service.MaxCheck ? service.MaxCheck :"-"}</h5>                                                                                                  
                                    </div>
                                </div>
                                )
                            })
                            
                        :
                            null
                        :
                            null
                        }
                    
                    </div>
                </div>
            )

        }       
}




