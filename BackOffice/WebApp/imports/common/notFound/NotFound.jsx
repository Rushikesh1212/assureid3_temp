import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class NotFound extends TrackerReact(Component){
	constructor() { 
   super();
    this.state = {
      subscription :{
      }
    }
  }
  render(){
    return(
      <div>
      <div className="content-wrapper">
          <section className="content">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box box-primary">
                   <div className="box-body comingSoonBoxBody">
                     <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                           <h1>Work In Progress</h1>
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