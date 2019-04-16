import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
import { browserHistory } from 'react-router'; 
import { Link } from 'react-router';

class DocumentStatus extends TrackerReact(Component){
	 constructor(props){
    super(props);
    this.state = { 
    }
  }

	render(){
     return( 
        <div className="col-lg-12 col-md-12"> 
          <div className="col-lg-12 col-md-12 comptitle">
	          <div className="col-lg-12">
	            <div className="col-lg-1 sidecls">
	              Service Request
	            </div>
	            <div className="col-lg-1 sidecls">
	              Screening Commitee
	            </div>
	            <div className="col-lg-1 sidecls1">
	              Team Leader
	            </div>
	            <div className="col-lg-1 sidecls1">
	              Team Member
	            </div>
	            <div className="col-lg-1 sidecls1">
	              Field Expert 
	            </div>
	            <div className="col-lg-1 sidecls">
	               Quality Commitee
	             </div>
	            <div className="col-lg-1 sidecls">
	              Report Commitee
	            </div>
           </div>
        </div>

        <div className="col-lg-12 col-md-12 circlebox">
          <div className="col-lg-12 afterdash">
            <div className="col-lg-1 sidecls">
              <div className={this.props.ticket ? "circle1 statusComplete" : "circle1"}></div>
              <div className="dash1"></div>
            </div>

            <div className="col-lg-1 sidecls">
              {this.props.ticketStatus ?
              	 <div className=
	                {this.props.ticketStatus.role == "screening committee" || this.props.ticketStatus.role == "team leader" ?
	                  "circle1 statusComplete" : 
	                  "circle1" 
	                }>
	              </div>
	              :
	              <div className="circle1"> 
                </div>
              }
              <div className="dash1"></div>
            </div>

            <div className="col-lg-1 sidecls">
              {this.props.ticketStatus ?
              	 <div className=
	                {this.props.ticketStatus.role == "team leader" ?
	                  "circle1 statusComplete" : 
	                  "circle1" 
	                }>
	              </div>
	              :
	              <div className="circle1"> 
                </div>
              }
              <div className="dash1"></div>
            </div>

            <div className="col-lg-1 sidecls">
              <div className="circle1"></div>
              <div className="dash1"></div>
            </div>

            <div className="col-lg-1 sidecls">
              <div className="circle1"></div>
              <div className="dash1"></div>
            </div>
            <div className="col-lg-1 sidecls">
              <div className="circle1"></div>
              <div className="dash1"></div>
            </div>

            <div className="col-lg-1 sidecls">
              <div className="circle1"></div>
            </div>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 comptitle">
	        <div className="col-lg-12">
	          <div className="col-lg-1 sidecls">
	          {this.props.ticket ?  
	           moment(this.props.ticket.createdAt).format("D MMM YY")
		           :
		           ""
		         }
	          </div>
	          {this.props.ticketElement[0].role == "screening committee" ?
		          <div className="col-lg-1 sidecls">
		             {moment(this.props.ticketElement[0].createdAt).format("D MMM YY")}
		          </div>
		          :
		          <div className="col-lg-1 sidecls">
	            </div>
	          }
	          {this.props.ticketElement[1] ?
	          	<div>
			          {this.props.ticketElement[1].role == "team leader" ?
				          <div className="col-lg-1 sidecls">
				             {moment(this.props.ticketElement[1].createdAt).format("D MMM YY")}
				          </div>
				          :
				          <div className="col-lg-1 sidecls">
			            </div>
			          }
			        </div>
			        :
               <div className="col-lg-1 sidecls">
			         </div>
			      }
	          <div className="col-lg-1 sidecls">
	          </div>
	          <div className="col-lg-1 sidecls">
	          </div>
	          <div className="col-lg-1 sidecls">
	          </div>
	          <div className="col-lg-1 sidecls">
	          </div>
	        </div>
        </div>
      </div>
     ); 
   }        
}
DocumentStatusContainer = withTracker(props => {  
    var ticket = props.ticket;
    // 
    var ticketStatus = ticket.ticketStatus[0]  || {};
    // 
    var ticketElement = ticket.ticketElement || [];
    // 
    // if(_id){
      return {
          ticket : ticket,
          ticketStatus : ticketStatus,
          ticketElement : ticketElement,
      };
})(DocumentStatus);
export default DocumentStatusContainer;
