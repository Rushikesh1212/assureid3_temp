import { Meteor } from 'meteor/meteor'; 
import { HTTP } from 'meteor/http';

// import api's
import '/imports/admin/userManagement/api/userAccounts.js'; 
import '/imports/AssureID/userPortal/api/userProfile.js';
import '/imports/AssureID/company/api/companyProfile.js';
import '/imports/admin/companySettings/api/CompanySettingMaster.js';
import '/imports/admin/notificationManagement/components/SendMailnNotification.jsx';
import '/imports/AssureID/userPortal/api/Order.js'; 
import '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import '/imports/admin/adminDashboard/newsFeedManagement/api/NewsFeed.js';
import '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
import '/imports/AssureID/userPortal/api/TicketMaster.js';
import '/imports/admin/notificationManagement/api/NotificationTemplate.js';
import '/imports/admin/notificationManagement/api/Notification.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'SEND_SMS': function (toNumber, smsBody) {
    this.unblock();
    return HTTP.call("GET", "http://mahasurvey.in/WebService/MahaSurveyWbSrvce.asmx/SEND_SMS?MOBNO="+toNumber+"&TEXT_MSG="+smsBody);
  },
});