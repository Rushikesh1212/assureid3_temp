import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {WebApp} from 'meteor/webapp';
import { HTTP } from 'meteor/http';
import { NotificationTemplate } from '/imports/admin/notificationManagement/api/NotificationTemplate.js';

// add api's to server
import '/imports/admin/notificationManagement/api/NotificationTemplate.js';
import '/imports/admin/notificationManagement/api/Notification.js';
import '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import '/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js';
import '/imports/admin/adminDashboard/masterData/university/api/University.js';
import '/imports/admin/adminDashboard/masterData/college/api/College.js';
import '/imports/admin/adminDashboard/masterData/qualification/api/QualificationLevel.js';
import '/imports/admin/adminDashboard/masterData/policeStation/api/PoliceStation.js';
import '/imports/admin/adminDashboard/masterData/codeAndReason/api/CodeAndReason.js';
import '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
import '/imports/admin/userManagement/api/userAccounts.js';
import '/imports/admin/companySettings/api/CompanySettingMaster.js';
import '/imports/admin/companySettings/api/TempLogoImage.js';
import '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
import '/imports/admin/caseManagement/api/TicketMaster.js';
import '/imports/admin/orderManagement/api/Order.js';
import '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';
import '/imports/admin/corporateOrderManagement/component/newRequest/api/TempOrder.js';
import '/imports/admin/corporateOrderManagement/component/newRequest/components/companyBulkRequestServices/api/companyBulkRequest.js';
import {CardValidation} from '/imports/admin/caseManagement/api/Cardvalidation.js';
import './reactNativeAPI.js';
// import '/imports/admin/adminDashboard/corporateManagement/corporatenotification/SendMailnNotificationCorporate.jsx';


Meteor.startup(() => {
  // code to run on server at startup
  WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });

});
   // console.log("plivoData: ",plivoData);
Meteor.methods({
  'SEND_SMS': function (toNumber, smsBody) {
    this.unblock();
    return HTTP.call("GET", "http://mahasurvey.in/WebService/MahaSurveyWbSrvce.asmx/SEND_SMS?MOBNO="+toNumber+"&TEXT_MSG="+smsBody);
  },
  "pancardvalidate":function(panCardNumber,ticketId){  
    var cardValidation = CardValidation.findOne({"_id" : "1"});
    // console.log("cardValidation",cardValidation); 
    if (cardValidation) {
      var settings = {               
      "pan":   panCardNumber          
      }; 
      // console.log("settings",settings); 
      var headerValues = {    
          "Content-Type": "application/json" ,
          "qt_api_key"  : cardValidation.apikeyId,
          "qt_agency_id": cardValidation.agencyId,   
      };
       // console.log("headerValues",headerValues); 
      try {      
        if (Meteor.isServer) {        
         var result = HTTP.call("POST","https://prod.aadhaarapi.com/pan",                               
          // {params: settings,headers:headerValues},(error,res)=>{
          {"data": settings, headers:headerValues},(error,res)=>{
            if(error){
              console.log(error);
            }else{
               console.log('res:',res);
                Meteor.call('updateVerifiedDataToTicket',ticketId,res.content,function(error,result){
                  if (error) {
                    console.log(error);
                  }else{
                    console.log(result);
                  }
                });
              
            }
          });        
         return result;  
        }    
      }catch (err) {     
        console.log(err) // Got a network error, time-out or HTTP error in the 400 or 50range.     
       return false;    
     } 
    }
  },
  
}); 

/**================================ */


sendMailNotification = function(inputObj) {
	console.log("inputObj :",inputObj);
	if(inputObj){
	//============================================================
	//  Mail Function
	//============================================================

	// var fromId 	 = getMailId(inputObj.from);
	// var to 		 = getMailId(inputObj.to); 
	 
	// var fromId 	 = inputObj.from;
	var fromId 	 = getMailId(inputObj.from);	
	var to 		 = inputObj.to;
	var subject	 = getSubject(inputObj.templateName);
	var body	 = getMessageContent(inputObj.templateName,inputObj.variables);

	// console.log("from: "+fromId);
	// console.log("to: "+to);
	// console.log("subject: "+subject); 
	// console.log("body: "+body);

	Meteor.call('sendEmailnNotification',to, fromId, subject, body,function(error,result){
		if(error){
			// swal("sorry error in sendEmailnNotification");
		}else{
			console.log('Mail Sent','success', 'growl-top-right');
				
			}

	});
	} // if inputObj

}

sendInAppNotificationServer = function(inputObj) {
	if(inputObj){
		console.log("inputObj :",inputObj);
	//============================================================
	//  Notification Function
	//============================================================
		var notifBody    = getNotificationContentServer(inputObj.templateName,inputObj.variables);
		console.log('notifBody: ', notifBody);
		var toMailId     = getMailId(inputObj.to); 
		var toUserId     = inputObj.to;
		var templateName = inputObj.templateName;
		var ticketId     = inputObj.ticketId; 

		// console.log("notifBody: "+notifBody);
		// console.log("to: "+toUserId);

		// Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,ticketId,function(error,result){
		// 	if(error){
		// 		console.log(error,'danger', 'growl-top-right');
		// 	}else if(result){
		// 		console.log("Notification sent",'success', 'growl-top-right');

		// 	}
		// }); // end of insertNotification
	} // if inputObj

}

sendSMS = function(inputObj) {
	if(inputObj){

	//============================================================
	//  Notification Function
	//============================================================

		var smsBody    = getSMSContent(inputObj.templateName,inputObj.variables);
		var toUserId   = inputObj.to;
		var toNumber   = inputObj.number;

		// console.log("smsBody: "+smsBody);
		// console.log("to: "+toUserId);
		// console.log("toNumber: "+toNumber);

		Meteor.call('SEND_SMS',toNumber,smsBody,function(error,result){
			if(error){
				console.log(error);
			}else{
				console.log('SMS sent');
				Meteor.call('insertSMS',toUserId,smsBody,toNumber,function(error,result){
					if(error){
						console.log(error,'danger', 'growl-top-right');
					}else if(result){
						console.log("SMS sent",'success', 'growl-top-right');

					}
				}); // end of insertSMS
			}
		})

	} // if inputObj

}

getMailId = function(to,templateName){
	
	var userData = Meteor.users.findOne({'_id':to});
	if(userData){
		var emailAddress = userData.emails[0].address;
	}//userData
	return emailAddress;
}

getSubject = function(templateName){
	// var notificationData = Meteor.subscribe('notificationTemplate');
	var NotificationData = NotificationTemplate.findOne({'templateName':templateName});
	if(NotificationData){
		var subject = NotificationData.subject;
	}//NotificationData

	return subject;

}

getMessageContent = function(templateName,varObj){
	// get all content from templatename

	var NotificationData = NotificationTemplate.findOne({"templateType" : "Email",'templateName':templateName});
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace("<p>", "<div>");
		content = content.replace("</p>", "</div>");
		content = content.replace("&nbsp;", " ");
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}


		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData

	return content;
}

getSMSContent = function(templateName,varObj){
	// get all content from templatename

	var NotificationData = NotificationTemplate.findOne({"templateType" : "SMS",'templateName':templateName});
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace("<p>", "<div>");
		content = content.replace("</p>", "</div>");
		content = content.replace("&nbsp;", " ");
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}


		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData

	return content;
}

getNotificationContentServer = function(templateName,varObj){
  console.log("serverside templateName,varObj :",templateName,varObj);
	var NotificationData = NotificationTemplate.findOne({"templateType" : "Notification",'templateName':"FEBESelfAllocatedToUser"});
	console.log('serverside NotificationData: ', NotificationData);
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace("<p>", "<div>");
		content = content.replace("</p>", "</div>");
		content = content.replace("&nbsp;", " ");
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}
		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData
	console.log("content :",content);
	return content;
}



