import React            	 from 'react';
import { FlowRouter }   	 from 'meteor/ostrio:flow-router-extra';
import { Meteor } 			 from 'meteor/meteor';
import { mount }        	 from 'react-mounter';
import Login                 from '/imports/systemSecurity/login/Login.jsx';
import ChangePassword        from '/imports/systemSecurity/changepassword/ChangePassword.jsx';
//Dashboard Layout
import { CorporateLayout }   from '/imports/common/layout/CorporateLayout.jsx';

// Company Profile  
import CreateCompany         from '/imports/AssureID/company/profile/forms/components/CreateCompany.jsx'
import ViewContractAndSOW    from '/imports/AssureID/company/contractAndSow/components/ViewContractAndSow.jsx';
import CompanyProfileView    from '/imports/AssureID/company/console/components/CompanyProfileView.jsx';

//Request for verification
import CompanyUploadRequest    from '/imports/AssureID/company/companyNewRequest/components/CompanyUploadRequest.jsx';

//Show details of the Order
import AllLedgers              from '/imports/AssureID/company/ledger/components/AllLedgers.jsx';

//Report Generating
import OrderGeneration         from '/imports/AssureID/company/ledger/components/reportgeneration/components/OrderGeneration.jsx';

//Comming Soon  
import CommingSoon 		     from '/imports/common/commingSoon/CommingSoon.jsx';
import StaticCaseStatus      from '/imports/AssureID/staticcasestatus/StaticCaseStatus.jsx';
import UserUploadRequest     from '/imports/AssureID/company/companyNewRequest/components/UserUploadRequest.jsx';


//

FlowRouter.route('/', {
	action: function(params, queryParams) {
    	mount(Login);
    }
});
 
FlowRouter.route('/companyForms/:url', {
	action: function(params, queryParams) {
    	mount(CorporateLayout,{content: (<CreateCompany />)});
    }
});
FlowRouter.route('/companyForms/:url/:assureId', {
	action: function(params, queryParams) {
    	mount(CorporateLayout,{content: (<CreateCompany />)});
    }
});
// FlowRouter.route('/company/bulkUpload', {
// 	action: function(params, queryParams) {
//     	mount(AddressService);
//     }
// });

FlowRouter.route('/company/contractAndSow/:assureId', {
    action: function(params, queryParams) {
        mount(CorporateLayout,{content: (<ViewContractAndSOW />)});
    }
}); 

FlowRouter.route('/companyConsole/:id', {
    action: function(params, queryParams) {
        mount(CorporateLayout,{content: (<CompanyProfileView />)});
    }
});
FlowRouter.route('/changePassword', {
    action: function(params, queryParams) {
        mount(ChangePassword);
    }
});

// FlowRouter.route('/companynewRequest/:assureid', {
//     action: function(params, queryParams) {
//         mount(CorporateLayout,{content: (<CompanyUploadRequest />)});
//     }
// });

FlowRouter.route('/companynewRequest/:url/:assureid', {
    action: function(params, queryParams) {
        mount(CorporateLayout,{content: (<CompanyUploadRequest />)});
    }
});


FlowRouter.route('/candidatenewRequest/:assureid', {
    action: function(params, queryParams) {
        mount(CorporateLayout,{content: (<UserUploadRequest />)});
    }
});
FlowRouter.route('/ledger/:assureid', {
    action: function(params, queryParams) {
        mount(CorporateLayout,{content: (<AllLedgers />)});
    }
});
FlowRouter.route('/ledger/:assureid/:serviceid',{
    action: function(params, queryParams){
        mount(CorporateLayout,{content: (<AllLedgers />)});
    }
});

FlowRouter.route('/orderGeneration/:orderid', {
    action: function(params, queryParams) {
        mount(CorporateLayout,{content: (<OrderGeneration />)});
    }
});