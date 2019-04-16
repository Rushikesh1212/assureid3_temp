import React            	 from 'react';
import { FlowRouter }   	 from 'meteor/ostrio:flow-router-extra';
import { Meteor } 		     from 'meteor/meteor';
import { mount }        	 from 'react-mounter';
import Login                 from '/imports/systemSecurity/login/Login.jsx';
//Dashboard Layout
import AdminDashboardLayout   from '/imports/common/layout/AdminDashboardLayout.jsx';
import DataEntryLayout        from '/imports/common/layout/DataEntryLayout.jsx';
import DispatchTeamLayout     from '/imports/common/layout/DispatchTeamLayout.jsx';
import TicketLayout           from '/imports/common/layout/TicketLayout.jsx';




// import admin layout contents
import NotFound               from '/imports/common/notFound/NotFound.jsx';
import CreateTemplate         from '/imports/admin/notificationManagement/components/CreateTemplate.jsx';
import ViewTemplates          from '/imports/admin/notificationManagement/components/ViewTemplates.jsx';
import ServicePage            from '/imports/admin/adminDashboard/serviceManagement/components/ServicePage.jsx';
import ListOfServices         from '/imports/admin/adminDashboard/serviceManagement/components/ListOfServices.jsx';
import EditService            from '/imports/admin/adminDashboard/serviceManagement/components/EditService.jsx';
import AddServicePackage      from '/imports/admin/adminDashboard/packageManagement/components/AddServicePackage.jsx';
import ListOfPackages         from '/imports/admin/adminDashboard/packageManagement/components/ListOfPackages.jsx';
import EditPackages           from '/imports/admin/adminDashboard/packageManagement/components/EditPackages.jsx';
import ManageLocation         from '/imports/admin/adminDashboard/masterData/location/components/ManageLocation.jsx';
import AddEditUniversity      from '/imports/admin/adminDashboard/masterData/university/components/AddEditUniversity.jsx';
import AddEditCollege         from '/imports/admin/adminDashboard/masterData/college/components/AddEditCollege.jsx';
import AddQualificationLevel  from '/imports/admin/adminDashboard/masterData/qualification/components/AddQualificationLevel.jsx';
import AddEditPoliceData      from '/imports/admin/adminDashboard/masterData/policeStation/components/AddEditPoliceData.jsx';
import AddEditChecklist       from '/imports/admin/adminDashboard/masterData/checklist/components/AddEditChecklist.jsx'
import AddEditCodeAndReason   from '/imports/admin/adminDashboard/masterData/codeAndReason/components/AddEditCodeAndReason.jsx';
import AddEditHolidays        from '/imports/admin/adminDashboard/masterData/holidayList/components/AddEditHolidays.jsx'
import CreateUser             from '/imports/admin/userManagement/components/CreateUser.jsx';
import UMRolesList            from '/imports/admin/userManagement/roles/UMRolesList.jsx';
import UMListOfUsers          from '/imports/admin/userManagement/components/UMListOfUsers.jsx';
import CorporateAccountList   from '/imports/admin/userManagement/components/CorporateAccountList.jsx';
import SPOCList               from '/imports/admin/userManagement/components/SPOCList.jsx';
import EditUserProfile        from '/imports/admin/userManagement/components/EditUserProfile.jsx';
import CompanySettingTabs     from '/imports/admin/companySettings/components/CompanySettingTabs.jsx';
import MaxNoOfTicketAllocate  from '/imports/admin/adminDashboard/caseManagement/components/MaxNoOfTicketAllocate.jsx';
import AddNewContract         from '/imports/admin/adminDashboard/corporateManagement/component/AddNewContract.jsx';
import CorporateCreateAccount from '/imports/admin/adminDashboard/corporateManagement/component/CorporateCreateAccount.jsx';
import ListOfCorporates       from '/imports/admin/adminDashboard/corporateManagement/component/ListOfCorporates.jsx';
import ViewContract           from '/imports/admin/adminDashboard/corporateManagement/component/ViewContract.jsx';
import CaseSidebar            from '/imports/common/sidebar/caseSidebar/CaseSidebar.jsx'; 

/**Cases component object */
import AllCases               from '/imports/admin/caseManagement/component/myCases/AllCases.jsx';
import AssignedCases          from '/imports/admin/caseManagement/component/myCases/AssignedCases.jsx';
import OpenCases              from '/imports/admin/caseManagement/component/myCases/OpenCases.jsx';
import ApprovedCases          from '/imports/admin/caseManagement/component/myCases/ApprovedCases.jsx';
import RejectedCases          from '/imports/admin/caseManagement/component/myCases/RejectedCases.jsx';
import CaseDetail             from '/imports/admin/caseManagement/component/caseDetails/CaseDetail.jsx';
import ReportHeader           from '/imports/admin/reportgeneration/components/ReportHeader.jsx';
import EscalatedCases         from '/imports/admin/caseManagement/component/myCases/EscalatedCases.jsx';
import AllOrders              from '/imports/admin/orderManagement/component/AllOrders.jsx';
import OrderDetails           from '/imports/admin/orderManagement/component/OrderDetails.jsx';
import OrderAllocatedToDispatchTeam from '/imports/admin/orderManagement/component/OrderAllocatedToDispatchTeam.jsx';
import OpenOrdersForDispatchTeam from '/imports/admin/orderManagement/component/OpenOrdersForDispatchTeam.jsx';
import CompletedOrdersForDispatchTeam from '/imports/admin/orderManagement/component/CompletedOrdersForDispatchTeam.jsx';
import EscalatedOrdersForDispatchTeam from '/imports/admin/orderManagement/component/EscalatedOrdersForDispatchTeam.jsx';
import OrderGeneration                from '/imports/admin/orderManagement/component/OrderGeneration.jsx';
import CorporateOrdersListforReallocation from '/imports/admin/corporateOrderManagement/component/CorporateOrdersListforReallocation.jsx';
/**Corporate Order Route */
import CorporateAllOrders             from '/imports/admin/corporateOrderManagement/component/CorporateAllOrders.jsx';
import CorporateOrderAllocated        from '/imports/admin/corporateOrderManagement/component/CorporateOrderAllocated.jsx';
import CorporateOpenOrders            from '/imports/admin/corporateOrderManagement/component/CorporateOpenOrders.jsx';
import CorporateCompletedOrders       from '/imports/admin/corporateOrderManagement/component/CorporateCompletedOrders.jsx';
import CorporateEscalatedOrders       from '/imports/admin/corporateOrderManagement/component/CorporateEscalatedOrders.jsx';
/**case Dashboard */
import CaseDashboardindex  from '/imports/admin/caseDashboard/component/CaseDashboardindex.jsx';
/**Admin Dashboard */
import AdminDashboardContentIndex from '/imports/admin/adminDashboard/adminDashboardContent/AdminDashboardContentIndex.jsx';
import NewRequest                 from '/imports/admin/corporateOrderManagement/component/newRequest/components/NewRequest.jsx';
import RequestStatus      from '/imports/admin/corporateOrderManagement/component/newRequest/components/companyBulkRequestServices/components/RequestStatus.jsx';
import AdminTicketDetails from '/imports/remaincasedetails/AdminTicketDetails.jsx';

import UMListOfUserportal from '/imports/admin/userManagement/components/userComponents/UMListOfUserportal.jsx';
import EditUserPro from '/imports/admin/userManagement/components/userComponents/EditUserPro.jsx';

FlowRouter.route('/', { 
	action: function(params, queryParams) {
    	mount(Login); 
    }
});
FlowRouter.route('/admin/dashboard', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<AdminDashboardContentIndex />)});
    }
});
FlowRouter.route('/admin/CreateTemplate', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<CreateTemplate />)});
    }
});
FlowRouter.route('/admin/CreateTemplate/:id', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<CreateTemplate />)});
    }
});
FlowRouter.route('/admin/ViewTemplates', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<ViewTemplates />)});
    }
});
FlowRouter.route('/admin/manageservice', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<ServicePage />)});
    }
});
FlowRouter.route('/admin/EditService/:id', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<EditService />)});
    }
});
FlowRouter.route('/admin/ListOfServices', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<ListOfServices />)});
    }
});
FlowRouter.route('/admin/manageservicepackage', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<AddServicePackage />)});
    }
});
FlowRouter.route('/admin/listOfPackages', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<ListOfPackages />)});
    }
});
FlowRouter.route('/admin/manageservicepackage/:id', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<EditPackages />)});
    }
});
FlowRouter.route('/admin/ManageLocation', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<ManageLocation />)});
    }
});
FlowRouter.route('/admin/ManageLocation/:id', {
	action: function(params, queryParams) {
    	mount(AdminDashboardLayout,{content: (<ManageLocation />)});
    }
});
FlowRouter.route('/admin/University', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditUniversity />)});
    }
});
FlowRouter.route('/admin/University/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditUniversity />)});
    }
});
FlowRouter.route('/admin/College', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditCollege />)});
    }
});
FlowRouter.route('/admin/College/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditCollege />)});
    }
});
FlowRouter.route('/admin/Qualification', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddQualificationLevel />)});
    }
});
FlowRouter.route('/admin/Qualification/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddQualificationLevel />)});
    }
});
FlowRouter.route('/admin/PoliceStation', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditPoliceData />)});
    }
});
FlowRouter.route('/admin/PoliceStation/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditPoliceData />)});
    }
});
FlowRouter.route('/admin/Checklist', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditChecklist />)});
    }
});
FlowRouter.route('/admin/Checklist/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditChecklist />)});
    }
});
FlowRouter.route('/admin/CodeAndReason', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditCodeAndReason />)});
    }
});
FlowRouter.route('/admin/CodeAndReason/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditCodeAndReason />)});
    }
});
FlowRouter.route('/admin/HolidayList', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditHolidays />)});
    }
});
FlowRouter.route('/admin/HolidayList/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddEditHolidays />)});
    }
});
FlowRouter.route('/admin/createUser', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CreateUser />)});
    }
});
FlowRouter.route('/admin/editProfile/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<EditUserProfile />)});
    }
});
FlowRouter.route('/admin/UMRolesList', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<UMRolesList />)});
    }
});
FlowRouter.route('/admin/UMListOfUsers', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<UMListOfUsers />)});
    }
});
FlowRouter.route('/admin/company-info', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CompanySettingTabs />)});
    }
});
// FlowRouter.route('/admin/maxnoofticketallocate', {
//     action: function(params, queryParams) {
//         mount(AdminDashboardLayout,{content: (<MaxNoOfTicketAllocate />)});
//     }
// });
// FlowRouter.route('/admin/maxnoofticketallocate/:id', {
//     action: function(params, queryParams) {
//         mount(AdminDashboardLayout,{content: (<MaxNoOfTicketAllocate />)});
//     }
// });
FlowRouter.route('/admin/company-info/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CompanySettingTabs />)});
    }
});
FlowRouter.route('/admin/ticketdistribution', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<NotFound />)});
    }
});
FlowRouter.route('/admin/ticketdistribution', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<NotFound />)});
    }
});
FlowRouter.route('/admin/adminticketdetails', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AdminTicketDetails />)});
    }
});
FlowRouter.route('/admin/reports', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<NotFound />)});
    }
});

FlowRouter.route('/admin/AddNewContract', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddNewContract/>)});
    }
});

FlowRouter.route('/admin/AddNewContract/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<AddNewContract/>)});
    }
});

FlowRouter.route('/admin/createcorporateaccount', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CorporateCreateAccount/>)});
    }
});

FlowRouter.route('/admin/createcorporateaccount/:id', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CorporateCreateAccount/>)});
    }
});

FlowRouter.route('/admin/ListOfCorporates', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<ListOfCorporates />)});
    }
});

FlowRouter.route('/admin/ViewContract/', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<ViewContract />)});
    }
});

FlowRouter.route('/admin/ViewContract/:assureId', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<ViewContract />)});
    }
});

// Nilam Add Router for Case
FlowRouter.route('/backoffice/dashboard', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<CaseDashboardindex />)});
    }
});

FlowRouter.route('/admin/alltickets', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<AllCases />)});
    }
});
FlowRouter.route('/admin/assignedtickets', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<AssignedCases />)});
    }
});

FlowRouter.route('/admin/opentickets', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<OpenCases />)});
    }
});
FlowRouter.route('/admin/approvedtickets', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<ApprovedCases />)});
    }
});
FlowRouter.route('/admin/rejectedtickets', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<RejectedCases />)});
    }
});

FlowRouter.route('/admin/escalatedtickets', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<EscalatedCases />)});
    }
});

FlowRouter.route('/admin/ticket/:id', {
    action: function(params, queryParams) {
        mount(TicketLayout,{content: (<CaseDetail />)});
    }
});
FlowRouter.route('/reportHeader/:id', {
    action: function(params, queryParams) {
        mount(ReportHeader);
    }
});

/**Dispatch team routes */


FlowRouter.route('/dispatchteamdashboard', {
    action: function(params, queryParams) {
        mount(DispatchTeamLayout,{content: (<NotFound />)});
        
    }
});

FlowRouter.route('/admin/allorders', {
    action: function(params, queryParams) {
        mount(DispatchTeamLayout,{content: (<AllOrders />)});
    }
});

FlowRouter.route('/admin/orderdetails/:id', {
    action: function(params, queryParams) {
        mount(DispatchTeamLayout,{content: (<OrderDetails />)});
    }
});

FlowRouter.route('/admin/orderAllocatedToDispatchTeam', {
    action: function(params, queryParams) {
        mount(DispatchTeamLayout,{content: (<OrderAllocatedToDispatchTeam />)});
    }
});

FlowRouter.route('/admin/openOrdersForDispatchTeam', {
    action: function(params, queryParams) {
        mount(DispatchTeamLayout,{content: (<OpenOrdersForDispatchTeam />)});
    }
});

FlowRouter.route('/admin/completedOrdersForDispatchTeam', {
    action: function(params, queryParams) {
        mount(DispatchTeamLayout,{content: (<CompletedOrdersForDispatchTeam />)});
    }
});

FlowRouter.route('/admin/escalatedOrdersForDispatchTeam', {
    action: function(params, queryParams) {
        mount(DispatchTeamLayout,{content: (<NotFound />)});
    }
});
FlowRouter.route('/orderGeneration/:orderid', {
    action: function(params, queryParams) {
        mount(OrderGeneration);
    }
});

FlowRouter.route('/dataentrydashboard', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<NotFound />)});
        
        
    }
});

FlowRouter.route('/admin/allcorporateorders', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<CorporateAllOrders />)});
    }
});

FlowRouter.route('/admin/allcorporateallocatedorders', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<CorporateOrderAllocated />)});
    }
});

FlowRouter.route('/admin/allcorporateopenorders', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<CorporateOpenOrders />)});
    }
});

FlowRouter.route('/admin/allcorporatecompleteorders', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<CorporateCompletedOrders />)});
    }
});
FlowRouter.route('/admin/allcorporateesclatedorders', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<CorporateEscalatedOrders />)});
    }
});



FlowRouter.route('/newRequest/:corporderid/:url/:assureid', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<NewRequest />)});
    }
});
FlowRouter.route('/newRequest/:corporderid/:url/:assureid/:serviceid', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<NewRequest />)});
    }
});
FlowRouter.route('/requestStatus/company/:assureid', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<RequestStatus />)});
    }
});
FlowRouter.route('/requestStatus/company/:assureid/:serviceid', {
    action: function(params, queryParams) {
        mount(DataEntryLayout,{content: (<RequestStatus />)});
    }
});
// FlowRouter.route('/corporateuserlist', {
//     action: function(params, queryParams) {
//         mount(AdminDashboardLayout,{content: (<CorporateAccountList />)});
//     }
// });
FlowRouter.route('/corporateuserlist', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<SPOCList />)});
    }
});

FlowRouter.route('/corporateuserlist', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CorporateAccountList />)});
    }
});

FlowRouter.route('/corporateuserlist', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CorporateAccountList />)});
    }
});


FlowRouter.route('/corporateuserlist', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<CorporateAccountList />)});
    }
});
FlowRouter.route('/newRequest/:corporderid/:url/:assureid', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<NewRequest />)});
    }
});
FlowRouter.route('/newRequest/:corporderid/:url/:assureid/:serviceid', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<NewRequest />)});
    }
});
FlowRouter.route('/requestStatus/company/:assureid', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<RequestStatus />)});
    }
});
FlowRouter.route('/requestStatus/company/:assureid/:serviceid', {
    action: function(params, queryParams) {
        mount(AdminDashboardLayout,{content: (<RequestStatus />)});
    }
});
FlowRouter.route('/admin/AddNewContract/:id/:corporateid', {
        action: function(params, queryParams) {   
            mount(AdminDashboardLayout,{content: (<AddNewContract/>)});    
    }
});

FlowRouter.route('/backoffice/dispactteamdashboard',{
    action: function(params, queryParams) {   
        mount(DispatchTeamLayout,{content: (<NotFound/>)});    
    }
});

FlowRouter.route('/admin/listOfCorporateOrders',{
    action: function(params, queryParams) {   
        mount(AdminDashboardLayout,{content: (<CorporateOrdersListforReallocation/>)});    
    }
});
// FlowRouter.route('/general/adminticketdetails',{
//     action: function(params, queryParams) {   
//         // mount({content: (<AdminTicketDetails/>)});    
//         mount(<AdminTicketDetails />); 
//     }
// });
FlowRouter.route('/admin/listofuserportal',{
    action: function(params, queryParams) {   
        mount(AdminDashboardLayout,{content: (<UMListOfUserportal/>)});    
    }
});
FlowRouter.route('/admin/edituserprofile/:id',{
    action: function(params, queryParams) {   
        mount(AdminDashboardLayout,{content: (<EditUserPro/>)});    
    }
});






