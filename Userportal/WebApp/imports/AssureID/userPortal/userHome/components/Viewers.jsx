import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

export default class Viewers extends TrackerReact(Component) {
   componentWillMount() {
    // if(!$("link[href='/css/slick.css']").length > 0){
    //   var slickCss = document.createElement("link");  
    //   slickCss.type="text/css";
    //   slickCss.rel ="stylesheet";
    //   slickCss.href="/css/slick.css";
    //   document.head.append(slickCss); 
    // }

    // if(!$("link[href='/css/slick-theme.css']").length > 0){
    //   var slickThemeCss = document.createElement("link");
    //   slickThemeCss.type="text/css";
    //   slickThemeCss.rel ="stylesheet";
    //   slickThemeCss.href="/css/slick-theme.css";
    //   document.head.append(slickThemeCss);
    // }

    //  $.getScript('/slick/slick.min.js',function() {
    //   $(function(){
    //     // $('.visitedBlock').slick({
    //     //   slidesToShow: 3,
    //     //   slidesToScroll: 1,
    //     //   autoplay: true,
    //     //   autoplaySpeed:4000,

    //     //   });
          
    //    });
    // });
  }
  componentWillUnmount() {
    // $("link[href='/css/slick.css']").remove();
    // $("link[href='/css/slick-theme.css']").remove();
  }
	render() {
    return ( 
    	 <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 outerpaddingForMobile">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding companyOuter landingBlocks">
          <h5 className="text-center"><b>Who viewed your profile</b></h5>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visitedBlock">
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/reliance.gif" />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/infosys.png" />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/ibm.png" />
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 viewedBlock">
            <div>{this.props.viewedByCompanies ? this.props.viewedByCompanies.length : 0}</div>
            <p>Companies viewed your profile</p>
            <div>{this.props.viewedByPeople ? this.props.viewedByPeople.length : 0}</div>
            <p>Individuals viewed your profile</p>
          </div>
          <h6 className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"><a href="#">view more</a></h6>
        </div>
      </div>
    );
  }
}
