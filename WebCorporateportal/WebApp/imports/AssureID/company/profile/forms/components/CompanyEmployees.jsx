import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
export default class CompanyEmployees extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
   this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps() {
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    // console.log(target + '||' + value + '||' + name);
  
    this.setState({
      [name]: event.target.value,
    });
  }
  componentDidMount(){      
  }

  render(){
    // console.log("this.props.spocperson ",this.props.spocperson)
    return (
      <div>
        {
          this.props.authorisedpersons && this.props.authorisedpersons.length ? 
          this.props.authorisedpersons.map((spocData,index)=>{
            return(
              <div key={index} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadLeft nopadRight companyEmpDiv">
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 nopadLeft">
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle inputFileSpan employeeImg" />
                </div>
                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 companyEmployees nopadLeft nopadRight">
                  <h5>{spocData.accessPersonName}</h5>
                  <h6>{spocData.accessPersonDesignation}</h6>
                  {/* <h6>AssureID</h6> */}
                </div>
              </div>
            )

          })
         
          :
            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 loadingImg">
                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img>
            </div>
        }
        
        {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadLeft nopadRight companyEmpDiv">
          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 nopadLeft">
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="img-circle inputFileSpan employeeImg" />
          </div>
          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 companyEmployees nopadLeft nopadRight">
            <h5>Name</h5>
            <h6>Designation</h6>
            <h6>AssureID</h6>
          </div>
        </div> */}
      </div>
    );
  }
}