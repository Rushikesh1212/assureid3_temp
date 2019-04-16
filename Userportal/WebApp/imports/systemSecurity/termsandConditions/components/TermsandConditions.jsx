import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class TermsandConditions extends TrackerReact(Component){
  constructor(){
    super();
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount() {
  }
  

  render(){
    return(
      <div className="">
        <div className="outerOTPWRapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="row">
            <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
              <h2>Terms and Conditions</h2>
            </div>
            <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <p>l hereby declare that the information I have given is true and correct to the best of my knowledge. I understand that a misrepresentation or omission of facts called for herein shall be sufficient cause for cancellation of consideration for employment or dismissal from the Company's service if I have been employed, without liability to the Company.</p>

              <p>l hereby authorize Organization or any third party agent(s) and/or its agents to conduct verification of all statements contained in this record if I am considered for employment. I understand that my employment is subject to satisfactory background verification.</p>

              <p>l hereby authorize Organization or any third party agent(s) appointed by the Company to contact any former employers, educational institutes and all such sources as may be required to verify information provided in my resume and application of employment and to carry out all Background Checks as may be deemed appropriate per the Company's selection procedure. I authorize former employers, agencies, educational institutes and all persons who may have information relevant to this enquiry to release the information to authorize Organization or any third party or their agents. I release all persons from liability on account of such disclosure. I am willing that a photocopy of this authorization be accepted with the same authority as the original.</p>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
