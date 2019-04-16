import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CorporateOrders } from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';
import ServiceStatistics from './ServiceStatistics.jsx';

class VerificationDashboard extends TrackerReact(Component){ 
    componentDidMount(){
        $('#verificationCarousel .item').each(function(){
            var next = $(this).next();
            if (!next.length) {
              next = $(this).siblings(':first');
            }
            next.children(':first-child').clone().appendTo($(this));
            
            if (next.next().length>0) {
              next.next().children(':first-child').clone().appendTo($(this));
            } else {
                $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
            }
          });
    }

    render(){
        return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 carouselWrap">
                
                <div id="verificationCarousel" className="carousel slide" data-ride="carousel" data-interval="false">
                    <div className="carousel-inner">
                        {
                            this.props.res.length > 0 ?
                                this.props.res.map((itemData,k)=>{
                                    return k==0 ?
                                        <div key={k} className="item active">
                                            {
                                                itemData.map((serviceData,index)=>{
                                                    return(
                                                        <div key={index}>
                                                            <ServiceStatistics  checkdetailsdata={serviceData}/>
                                                        </div>
                                                        
                                                        )
                                                })
                                            }
                                        </div>
                                    :
                                    <div key={k} className="item">
                                        {
                                            itemData.map((serviceData,index)=>{
                                                return(
                                                    <div key={index}>
                                                        <ServiceStatistics  checkdetailsdata={serviceData}/>
                                                    </div>
                                                    
                                                    )
                                            })
                                        }
                                    </div>

                                    // )
                                     
                                    

                                })
                            :
                            // null
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 homepageBlock">
                                <h5>Data Not Available</h5>
                            </div>

                            // <div>

                            // </div>
                            
                        }
                        {/* {
                            this.props.checkDetails.length>0 ?
                                this.props.checkDetails.map((details,ind)=>{
                                    
                                    // return ind<4 ?
                                    return(
                                        <div key={ind}>
                                            <ServiceStatistics  checkdetailsdata={details}/>
                                        </div>
                                    )
                                    // :
                                    // null
                                        
                                })
                            :
                            null
                                
                        } */}
                        
                    </div>

                    <a className="left carousel-control leftControl" href="#verificationCarousel" data-slide="prev">
                    <span className="glyphicon glyphicon-chevron-left"></span>
                    <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control rightControl" href="#verificationCarousel" data-slide="next">
                    <span className="glyphicon glyphicon-chevron-right"></span>
                    <span className="sr-only">Next</span>
                    </a>
                </div>
            </div>
        );
    }
 
}
VerificationDashboardContainer = withTracker(props => {
    var checkDetails = props.detailChecks;
    var res = [], temp = [];
    var count = 0;
    var len = checkDetails.length;
    for(var i=0;i<len;i++){
        temp.push(checkDetails[i]);
        if(count == 3 || i==(len-1)){
            res.push(temp);
            temp = [];
            count = 0;
        }else{
            // temp.push(checkDetails[i]);
            count++;
        }
    }
    return{
        checkDetails,
        res
    }
  
})(VerificationDashboard);
export default VerificationDashboardContainer;
