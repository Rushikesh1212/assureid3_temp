import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
import { TempCompanyDocuments } from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {TempCorporateOrder} from '/imports/AssureID/company/companyNewRequest/api/TempCorporateOrder.js';
import CandidateBulkUploadTable from './CandidateBulkUploadTable.jsx';
class BulkUploadMaster extends TrackerReact(Component) {





    render(){
        return(
            <div>
                Something Happened Here
            </div>
        )
    }



 
 
}
BulkUploadMasterContainer = withTracker(({props,params}) => {
 
})(BulkUploadMaster);
export default BulkUploadMasterContainer;