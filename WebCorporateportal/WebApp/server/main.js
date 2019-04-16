import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import '/imports/admin/userManagement/api/userAccounts.js';
import '/imports/AssureID/company/profile/api/companyProfile.js';
import '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import '/imports/AssureID/company/newRequest/components/companyBulkRequestServices/api/companyBulkRequest.js';
import '/imports/AssureID/company/newRequest/api/Order.js';
import '/imports/AssureID/company/newRequest/api/TempOrder.js';
import '/imports/AssureID/user/api/userProfile.js';
import '/imports/admin/companySettings/api/CompanySettingMaster.js';
import '/imports/admin/adminDashboard/Holiday/api/HolidaysList.js';
import '/imports/AssureID/company/newRequest/api/TicketMaster.js';
import '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';
import '/imports/AssureID/company/companyNewRequest/api/corporateBulkUpload.js';
import '/imports/AssureID/company/companyNewRequest/api/TempCorporateOrder.js';
import '/imports/admin/notificationManagement/api/NotificationTemplate.js';
import '/imports/admin/notificationManagement/api/Notification.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'SEND_SMS': function(toNumber,smsBody) {
    this.unblock();
    return HTTP.call("GET", "http://mahasurvey.in/WebService/MahaSurveyWbSrvce.asmx/SEND_SMS?MOBNO="+toNumber+"&TEXT_MSG="+smsBody);
  }
})