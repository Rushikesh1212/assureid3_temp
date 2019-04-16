import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Email } from 'meteor/email';

import { NotificationTemplate } from '/imports/admin/notificationManagement/api/NotificationTemplate.js';


sendMailNotification = function(inputObj) {
	
	if(inputObj){
	//============================================================
	//  Mail Function
	//============================================================

	// var fromId 	= getMailId(inputObj.from);
	var fromId 	= inputObj.from;
	var to 		= inputObj.to;  
	var subject	= getSubject(inputObj.templateName);
	var body	= getMessageContent(inputObj.templateName,inputObj.variables);
	console.log('fromId ',fromId);
	Meteor.call('sendEmailnNotification',to, fromId, subject, body,function(error,result){
		if(error){
			swal("sorry error in sendEmailnNotification");
			console.log('error ',error);
		}else{
			
				
			}

	});
	} // if inputObj

}

sendInAppNotification = function(inputObj) {
	if(inputObj){

	//============================================================
	//  Notification Function
	//============================================================
	

		var notifBody    = getNotificationContent(inputObj.templateName,inputObj.variables);
		var toMailId     = getMailId(inputObj.to); 
		var toUserId     = inputObj.to;
		var templateName = inputObj.templateName;
		
		

		// 
		console.log("Inside sendInAppNotification :",templateName,toMailId,toUserId,notifBody,ticketId);

		Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,ticketId,function(error,result){
			if(error){
				
			}else if(result){
				

			}
		}); // end of insertNotification
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

		Meteor.call('SEND_SMS',toNumber,smsBody,function(error,result){
			if(error){
				
			}else{
				
				Meteor.call('insertSMS',toUserId,smsBody,toNumber,function(error,result){
					if(error){
						
					}else if(result){
						

					}
				}); // end of insertSMS
			}
		})

	} // if inputObj

}

getMailId = function(to){
    var userData = Meteor.users.findOne({'emails.address':to});
	if(userData){
		var emailAddress = userData.emails[0].address;
	}//userData
	return emailAddress;
}

getSubject = function(templateName){
	var notificationData = Meteor.subscribe('notificationTemplate');
    var NotificationData = NotificationTemplate.findOne({'templateName':"CompanyRegistration"});
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
		for(i=0; i<tokens.length; i++){			
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

getNotificationContent = function(templateName,varObj){
	var NotificationData = NotificationTemplate.findOne({"templateType" : "Notification",'templateName':templateName});
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

