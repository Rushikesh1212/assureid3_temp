import React            	 from 'react';
import { FlowRouter }   	 from 'meteor/ostrio:flow-router-extra';
import { Meteor } 			 from 'meteor/meteor';
import { mount }        	 from 'react-mounter';

//Dashboard Layout
import {WebsiteLayout} 		from '/imports/common/layout/websiteLayout/components/WebsiteLayout.jsx';

//Static Pages
import LogIn                     from '/imports/systemSecurity/login/components/LogIn.jsx';
import HomePage				           from '/imports/AssureID/website2/homePage/HomePage.jsx';
import AboutUS				           from '/imports/AssureID/website2/aboutUs/AboutUS.jsx';
import ContactUS                 from '/imports/AssureID/website2/contactUs/ContactUS.jsx';
import IdentityVerification      from '/imports/AssureID/website2/services/IdentityVerification.jsx';
import CorporateVerification     from '/imports/AssureID/website2/services/CorporateVerification.jsx';
import FinancialVerification     from '/imports/AssureID/website2/services/FinancialVerification.jsx';
import Insurance                 from '/imports/AssureID/website2/services/Insurance.jsx';
import InternationalVerification from '/imports/AssureID/website2/services/InternationalVerification.jsx';
import Legal                     from '/imports/AssureID/website2/services/Legal.jsx';
import ProfessionalVerification  from '/imports/AssureID/website2/services/ProfessionalVerification.jsx';
import Tenancy                   from '/imports/AssureID/website2/services/Tenancy.jsx';

FlowRouter.route('/', {
	action: function(params, queryParams) {
    	mount(LogIn); 
    }
});

// FlowRouter.route('/aboutUs', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<AboutUS />)});
//     }
// });

// FlowRouter.route('/services/identityVerification', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<IdentityVerification />)});
//     }
// });

// FlowRouter.route('/services/financialVerification', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<FinancialVerification />)});
//     }
// });

// FlowRouter.route('/services/tenancy', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<Tenancy />)});
//     }
// });

// FlowRouter.route('/services/internationalVerification', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<InternationalVerification />)});
//     }
// });

// FlowRouter.route('/services/legal', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<Legal />)});
//     }
// });

// FlowRouter.route('/services/professionalVerification', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<ProfessionalVerification />)});
//     }
// });

// FlowRouter.route('/services/corporateVerification', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<CorporateVerification />)});
//     }
// });
// FlowRouter.route('/services/insurance', {
//     action: function(params, queryParams) {
//         mount(WebsiteLayout,{content: (<Insurance />)});
//     }
// });

// FlowRouter.route('/contact', {
// 	action: function(params, queryParams) {
//     	mount(WebsiteLayout,{content: (<ContactUS />)});
//     }
// });





// FlowRouter.route('/', {
// 	action: function(params, queryParams) {
//     	mount(ComingSoon);
//    }
// });


//  