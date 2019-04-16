import React            	 from 'react';
import { FlowRouter }   	 from 'meteor/ostrio:flow-router-extra';
import { Meteor } 			   from 'meteor/meteor';
import { mount }        	 from 'react-mounter';

//UserPortal Layout
import {UserPortalLayout} 		from '/imports/common/layout/userPortalLayout/components/UserPortalLayout.jsx';

//import content from UserPortalLayout
import ProfileForms from '/imports/AssureID/userPortal/profile/forms/components/ProfileForms.jsx';
import UserHome from '/imports/AssureID/userPortal/userHome/components/UserHome.jsx';
import ServiceInfo from '/imports/AssureID/userPortal/purchase/serviceProcess/components/ServiceInfo.jsx';
import PackageInfo from '/imports/AssureID/userPortal/purchase/packageProcess/components/PackageInfo.jsx';
import ServiceRequiredData from '/imports/AssureID/userPortal/purchase/serviceProcess/components/ServiceRequiredData.jsx';
import PackageRequiredData from '/imports/AssureID/userPortal/purchase/packageProcess/components/PackageRequiredData.jsx';
import UserInvoice from '/imports/AssureID/userPortal/purchase/common/components/UserInvoice.jsx';
import PaymentGateway from '/imports/AssureID/userPortal/purchase/common/components/PaymentGateway.jsx';
import Receipt from '/imports/AssureID/userPortal/purchase/common/components/Receipt.jsx';
import UserOrders from '/imports/AssureID/userPortal/orders/components/UserOrders.jsx';
import TicketReports from '/imports/AssureID/userPortal/reports/components/TicketReports.jsx';
import MyCart from '/imports/AssureID/userPortal/cart/components/MyCart.jsx';
import ReportHeader from '/imports/AssureID/userPortal/reports/components/ReportHeader.jsx';
import TermsandConditions from '/imports/systemSecurity/termsandConditions/components/TermsandConditions.jsx';
FlowRouter.route('/profileForms/:url', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<ProfileForms />)});
    }
});
FlowRouter.route('/viewProfile/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<ProfileForms />)});
    }
});
FlowRouter.route('/profile', { 
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<UserHome />)});
    }
});
FlowRouter.route('/ServiceInfo/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<ServiceInfo />)});
    }
});
FlowRouter.route('/PackageInfo/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<PackageInfo />)});
    }
});
FlowRouter.route('/ServiceRequiredData/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<ServiceRequiredData />)});
    }
});
FlowRouter.route('/PackageRequiredData/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<PackageRequiredData />)});
    }
});
FlowRouter.route('/ServiceInvoice/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<UserInvoice />)});
    }
});
FlowRouter.route('/PaymentGateway/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<PaymentGateway />)});
    }
});
FlowRouter.route('/Receipt/:id', {
	action: function(params, queryParams) {
    	mount(UserPortalLayout,{content: (<Receipt />)});
    }
});
FlowRouter.route('/myOrders', {
    action: function(params, queryParams) {
        mount(UserPortalLayout,{content: (<UserOrders />)});
    }
});
FlowRouter.route('/downloadReports/:id', {
    action: function(params, queryParams) {
        mount(UserPortalLayout,{content: (<TicketReports />)});
    }
});
FlowRouter.route('/cart', {
    action: function(params, queryParams) {
        mount(UserPortalLayout,{content: (<MyCart />)});
    }
});
FlowRouter.route('/reportHeader/:id', {
    action: function(params, queryParams) {
        mount(UserPortalLayout,{content: (<ReportHeader />)});
    }
});
FlowRouter.route('/termsandcondition', {
    action: function(params, queryParams) {
        mount(UserPortalLayout,{content: (<TermsandConditions />)});
    }
});

