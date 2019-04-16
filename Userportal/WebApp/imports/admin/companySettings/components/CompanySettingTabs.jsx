import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Meteor} from 'meteor/meteor';
import {Link} from 'react-router';

import CompanyInformation from './companyInformation.jsx';
import CompanyLocation from './CompanyLocation.jsx';
import CompanyBankDetails from './CompanyBankDetails.jsx';
import CompanyTaxDetails from './CompanyTaxDetails.jsx';

export default class CompanySettingTabs extends TrackerReact(Component) {
  componentDidMount() {
    console.log("companysetting mounted");
    if (!!!$("link[href='/css/dashboard.css']").length > 0) {
      var dashboardCss = document.createElement("link");
      dashboardCss.type = "text/css";
      dashboardCss.rel = "stylesheet";
      dashboardCss.href = "/css/dashboard.css";
      document.head.append(dashboardCss);
    }
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
      console.log("I am appended!");
      var adminLte = document.createElement("script");
      adminLte.type = "text/javascript";
      adminLte.src = "/js/adminLte.js";
      adminLte.setAttribute('id','adminLte');
      $("body").append(adminLte);
    }
  }
  componentWillUnmount(){
    console.log('Companysetting unmounted');
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  render() {

    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>Company Setting
            </h1>
            <ol className="breadcrumb">
              <li>
                <Link to="#"><i className="fa fa-dashboard"/>
                  Home</Link>
              </li>
              <li className="active">Company Setting</li>
            </ol>

          </section>
          {/* /.row */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Company Settings
                    </h3>
                    {/*<div className="box-tools pull-right">
                      <button type="button" className="btn btn-box-tool btn-minus" data-widget="collapse">
                        <i className="fa fa-minus"/>
                      </button>
                      <div className="btn-group">
                        <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                          <i className="fa fa-wrench"/></button>
                        <ul className="dropdown-menu" role="menu">
                          <li>
                            <Link to="#">Action</Link>
                          </li>
                          <li>
                            <Link to="#">Another action
                            </Link>
                          </li>
                          <li>
                            <Link to="#">Something else here</Link>
                          </li>
                          <li className="divider"/>
                          <li>
                            <Link to="#">
                              Separated link
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <button type="button" className="btn btn-box-tool " data-widget="remove">
                        <i className="fa fa-times"/>
                      </button>
                    </div>*/}
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <section className="Content">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="reportWrapper">


                            <div id="parkingreport" className="ReportTabs col-lg-10 col-lg-offset-1">
                              <ul className="nav nav-pills">
                                <li className="active transactionTab CStab col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                  <a data-toggle="pill" href="#companyInformation" className="">
                                    Company Information
                                  </a>
                                </li>
                                <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab CStab">
                                  <a data-toggle="pill" href="#CompanyLocation">
                                    Company Address
                                  </a>
                                </li>
                                <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab CStab">
                                  <a data-toggle="pill" href="#CompanyBankDetails">
                                    Bank Details
                                  </a>
                                </li>
                                <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab CStab">
                                  <a data-toggle="pill" href="#CompanyTaxDetails">
                                    Tax Settings
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="break col-lg-12 col-md-12"></div>
                            <div className="tab-content">
                              <div id="companyInformation" className="tab-pane fade in active">
                                <CompanyInformation/>
                              </div>
                              <div id="CompanyLocation" className="tab-pane fade">
                                <CompanyLocation/>
                              </div>
                              <div id="CompanyBankDetails" className="tab-pane fade">
                                <CompanyBankDetails/>
                              </div>
                              <div id="CompanyTaxDetails" className="tab-pane fade">
                                <CompanyTaxDetails/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  {/* ./box-body */}
                </div>
                {/* /.box */}
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </section>
        </div>
        {/* /.content */}
      </div>
    );

  }

}
