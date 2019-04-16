import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {CompanySettings} from '/imports/admin/companySettings/api/CompanySettingMaster.js';

class UserPortalFooter extends TrackerReact(Component) {
  constructor(){
    super();
    this.state ={
    }
  }

  render() {
      return (
        <div>
          <footer className="footerBackground">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footerBackgroundColor">
              <div className="row">
                <section className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="widget col-lg-12">
                    {/* <h4 className="textWidgetSec">
                      Get Started Today
                    </h4> */}
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/assireID-poweredby.jpg" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footerLogo img-responsive"/>
                  </div>
                </section>
                <section className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                  <div className="widget col-lg-12 ">
                    <h4 className="textWidgetSec">
                      Contact Info
                    </h4>
                    <ul className="ulStyle col-lg-12 NOpadding">             
                      <li className="listStyleSec">
                        <i className="fa fa-home"></i>
                        <span>Address</span>
                      { 
                        !this.props.loading ?
                          this.props.companyInfo && this.props.companyInfo.length>0 ?
                              this.props.companyInfo.map((locInfo,index)=>{
                                return index==0 ?
                                  <div key={index}>
                                    <span>{locInfo.companyAddress}</span><br/>
                                    <span>{locInfo.companyCity}-{locInfo.companyPincode}</span>,<br/>
                                    <span>{locInfo.companyState}</span>,<br/>
                                    <span>{locInfo.companyCountry}</span>.<br/>                                 
                                  </div>
                                :
                                null
                              })
                          :
                          null
                        :
                        null
                      }
                    
                      </li>
                      {/* <li className="listStyleSec">
                        <i className="fa fa-phone"></i>
                          (+xx)-xxxxxxxxxx
                      </li>
                      <li className="listStyleSec">
                        <i className="fa fa-envelope"></i>
                          xyz@assureid.com
                      </li>  */}
                      {/* <li className="listStyleSec">
                        <i className="fa fa-map-marker"></i>
                        Map and Direction
                      </li> */}
                    </ul>
                  </div>
                </section>

                <section className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                  <div className="widget col-lg-12">
                    <h4 className="textWidgetSec">
                    Map and Direction
                    </h4>
                    <div className="recentPostText">
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/assureidlocation.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 footerLogo img-responsive"/>
                    
                      
                    </div>
                  </div>
                </section>
                {/* <section className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                  <div className="widget col-lg-12">
                    <h4 className="textWidgetSec">
                      Employee Connect
                    </h4>
                    <div className="recentPostText">
                      <a href="http://bo.assureid.in" target="_blank">Log In</a>
                    </div>
                  </div>
                </section> */}

              </div>
            </div>
            {/*<div className="footerLine col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>*/} 
            <div id="footer">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 copyrightFooterColor">
                <div className="copyRight col-lg-3 col-md-3 col-sm-12 col-xs-12">
                  © <span style={{fontSize : '17' + 'px'}}>{(new Date()).getFullYear()}</span> <a href="">A S S U R E I D</a>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-12 col-xs-12 footerIcons text-center">
                  <a href="http://www.facebook.com/#" target="_blank" className="footerSymbol">
                    <i className="fa fa-facebook socialIocns" aria-hidden="true"/>
                  </a>
                  <a href="http://www.twitter.com/#" target="_blank" className="footerSymbol">
                    <i className="fa fa-twitter socialIocns" aria-hidden="true"/>
                  </a>
                  <a href="#" target="_blank" className="footerSymbol">
                    <i className="fa fa-pinterest socialIocns" aria-hidden="true"/>
                  </a>
                  <a href="#" target="_blank" className="footerSymbol">
                    <i className="fa fa-behance socialIocns" aria-hidden="true"/>
                  </a>
                  <a href="#" target="_blank" className="footerSymbol">
                    <i className="fa fa-google-plus socialIocns" aria-hidden="true"/>
                  </a>
                  <a href="#" target="_blank" className="footerSymbol">
                    <i className="fa fa-aedin socialIocns" aria-hidden="true"/>
                  </a>
                </div>
                <div className="col-lg-4 col-sm-3 col-md-12 col-xs-12 privacypolicyDiv">
                  <a href="/privacypolicy">Privacy Policy</a> | <a href="/termsandcondition">Terms & Conditions</a>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 disclaimerText">
                  <p><small>Nothing on our website should be construed as legal advice. Always consult with qualified legal counsel for questions or advice on all legal matters.</small></p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      );
    }
}
UserPortalFooterContainer = withTracker(props => {
  const handel = Meteor.subscribe('companyData');
    var companyObj = CompanySettings.findOne({"companyId":1});
    const loading = !handel.ready();
    if(companyObj){
      var companyInfo = companyObj.companyLocationsInfo;
    }
    
    return{
      companyInfo,
      loading,
    };

})(UserPortalFooter);
export default UserPortalFooterContainer;
