import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CompanyProfile }from '/imports/AssureID/company/profile/api/companyProfile.js';
import { UserProfile } from "/imports/AssureID/user/api/userProfile.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class PaymentMode extends TrackerReact(Component){
  constructor(props){
    super(props);
    // console.log("paymentValues = ",this.props.paymentValues);
    if (this.props.paymentValues) {
      this.state ={ 
        'paymentBy'    : this.props.paymentValues,
        "subscription" : { 
        } 
      };
    }else{
      this.state ={ 
        'paymentBy'    : 'Company',
        "subscription" : { 
        } 
      };
    }   
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps() {
    // if (nextProps.paymentValues) {
   //    this.setState({ 
    //    'paymentBy'    : nextProps.paymentValues,
    //  });
   //  }else{
   //   this.setState({ 
    //    'paymentBy'    : "Candidate",
    //  });
   //  }
   this.handleChange  = this.handleChange.bind(this);
  } 
  componentDidMount(){      
    // $('html, body').scrollTop(0);
  }
  handleChange(event){
   // event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    // console.log("handleChange value = ",event.target.value);
    // console.log(target + '||' + value + '||' + name);
    // this.props.paymentBy({[name]:event.target.value});
    // console.log("this.props.paymentBy",this.props.paymentBy);
    this.props.getPaymentValue(event.target.value);
    this.setState({
      [name]: event.target.value,
    },()=>{
      // var paymentBy = this.state.paymentBy;
     //  // console.log("paymentBy",paymentBy);
      // var companyId = this.props.companyId;
      // Meteor.call('updatepaymentBy',companyId,paymentBy,function(error,result){
      //   if (result) {
      //     console.log(error.reason);
      //   }else{
      //     console.log("updated successfully");
      //   }
      // });
    });  
  }
  render(){
    // console.log("this.state.paymentBy = ",this.state.paymentBy);
    return(
      <form className="companySettngForm basicForm" id="companySettngForm">

       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  nopadLeft nopadRight">
        {/*<label className="companySwitch">
          <input type="checkbox" />
          <span className="companySlider"></span>
        </label>*/} 
        <div className="switch col-lg-9 col-md-9">
          <input type="radio" className="switch-input" name="paymentBy" value="Candidate" id="Candidate" checked={this.state.paymentBy === "Candidate"} onChange={this.handleChange} />
          <label htmlFor="Candidate" className="switch-label switch-label-off">Candidate</label>
          <input type="radio" className="switch-input" name="paymentBy" value="Company" id="Company" checked={this.state.paymentBy === "Company"} onChange={this.handleChange}/>
          <label htmlFor="Company" className="switch-label switch-label-on">Company</label>
          <span className="switch-selection"></span>
        </div> 
      </div>
    </form>

    );
  } 
}