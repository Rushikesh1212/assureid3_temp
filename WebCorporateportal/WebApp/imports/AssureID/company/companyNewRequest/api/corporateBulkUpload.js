import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { Match } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

SimpleSchema.defineValidationErrorTransform(error => {
  const ddpError = new Meteor.Error(error.message);
  ddpError.error = 'validation-error';
  ddpError.details = error.details; 
  return ddpError;
});

const dataBasicUserInfoValidation = new SimpleSchema({
	FirstName: {
	    type: String,
	    label:'Not a valid First Name' 
	},
	LastName: {
	    type: String,
	    label:'Not a valid Last Name'
	}, 
	EmailID : {
		type: String, 
		// regEx : SimpleSchema.RegEx.EmailWithTLD,
		custom:function(){
	    var emailid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!emailid.test(this.value)){
				return[
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com', value:this.value}
				];
			}
	  }
	},
	MobileNo: {
	  type: String,
	    // regEx: /^[0-9]{10}$/,
	    // label:'Mobile Number should be 10 digit number',
	  custom:function(){
	    var mobileNo = /^[0-9]{10}$/;
			if(!mobileNo.test(this.value)){
				return[
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999', value:this.value}
				];
			}
	  }
	},
	AadharNumber:{
		type: String,
		// regEx: /^\d{4}\s\d{4}\s\d{4}$|^$/,
		custom:function(){
    	var aadharNo = /^\d{4}\s\d{4}\s\d{4}$|^$/;
			if(!aadharNo.test(this.value)){
				return[
					{name:'Aadhar Number',type:'Aadhar Number format should be e.g. xxxx xxxx xxxx', value:this.value}
				];
			}
    },
		optional: true,
	},
	Gender:{
		type: String,
		custom:function(){
  		if(!(this.value == 'Female' || this.value == 'Male' || this.value == 'Other')){
  			return [
				    { name: 'Gender', type: 'Gender only contains Male or Female or Other', value: this.value }
				  ];
  		}
  	},
	},
}).newContext(); 

if(Meteor.isServer){ 
	Meteor.methods({
		//Check CSV User Basic Header
		'companyRequestCheckUsrBasicCSV' : function(csvObject,companyAssureID){
			if(Match.test(csvObject, Array)){
				if(csvObject[0][0] != 'FirstName' || csvObject[0][1] != 'LastName' || csvObject[0][2] != 'EmailID' || csvObject[0][3] != 'MobileNo' || csvObject[0][4] != 'AadharNumber' || csvObject[0][5] != 'Gender')	{
					return 'Data is not in appropriate Format.1';
				}else{
					var data = Meteor.call('corporateUsrBasicUpload',csvObject,companyAssureID);
					if(data){
						return data;
					}
				}	
			}else{
				return 'Data is not in appropriate Format.2';
			}
		},
		'corporateUsrBasicUpload' : function(csvObject,companyAssureID){
			let result = {
				failed        : 0,
				faildList     : [],
				candidateList : [],
 				errorObj      : {},
			};
			var returnValue = false;
			if(Match.test( csvObject, Array)){
				var lengthCSV = csvObject.length;
				// Call Method createTempOrder(compnayAssureID,ServiceID) 
				var tempCorpOrderCreation = new Promise(function(resolve, reject) {
					var candidateDataTempInsert = new Promise(function(resolve, reject){
						csvObject.map((data,index) =>{
							var innerErrorObj  = { 
			 					"rowIndex"   : 0, 
			 					"columnName" : "",
			 					"columnValue": "",
			 					"message"    : "",
			 				}
							if(index != 0 && index != lengthCSV-1){
								dataBasicUserInfoValidation.validate({
									FirstName 			: data[0].trim(),
									LastName  			: data[1].trim(),
									EmailID			  	: data[2].trim(),
									MobileNo 		  	: data[3].trim(),
									AadharNumber		: data[4].trim(),
									Gender          : data[5].trim(),
								}); 
								var dupRes = checkDuplicateInObject(result.candidateList,data[0],data[1],data[2],data[3]);
								// console.log("dupRes",dupRes);
								if(!dataBasicUserInfoValidation.isValid()){
									result.failed = result.failed + 1;
                  innerErrorObj.rowIndex      = index;
                  innerErrorObj.columnName    = dataBasicUserInfoValidation.validationErrors()[0].name;
                  innerErrorObj.columnValue   = dataBasicUserInfoValidation.validationErrors()[0].value;
							    innerErrorObj.message       = dataBasicUserInfoValidation.validationErrors()[0][0].type; 
							    if (innerErrorObj.columnValue) {
							    	result.errorObj             = innerErrorObj;
								  	result.faildList.push(result.errorObj); 
							    }	
									// result.error.push(dataBasicUserInfoValidation.validationErrors()[0]);
								}else{
									var lowecaseEmail = data[2].toLowerCase();
									var userValid     = Meteor.users.findOne({"emails.address" : lowecaseEmail, "roles" : {$in:["backofficestaff", "superAdmin", "admin", "companyuser"]}});
								  if (userValid) {
								  	result.failed = result.failed + 1;
	                  innerErrorObj.rowIndex      = index;
	                  innerErrorObj.columnName    = "EmailID";
	                  innerErrorObj.columnValue   = data[2];
								    innerErrorObj.message       = "Same Email ID cannot double up as a user and staff due to conflict of interest!"; 
								    if (innerErrorObj.columnValue) {
								    	result.errorObj             = innerErrorObj;
									  	result.faildList.push(result.errorObj); 
								    }	
								  }else if (dupRes >= 0) {
								  	result.failed = result.failed + 1; 
	                  innerErrorObj.rowIndex      = index;
	                  innerErrorObj.columnName    = "All columns";
	                  innerErrorObj.columnValue   =  "-";
								    innerErrorObj.message       = "This entry is duplicate in uploaded CSV, Please correct and upload it!"; 
								    if (innerErrorObj.columnValue) {
								    	result.errorObj           = innerErrorObj;
									  	result.faildList.push(result.errorObj); 
								    }	
								  }else{
								  	var data = {
											candidateDetails : {
												candidateFirstName 	: data[0].trim(),
												candidateLastName 	: data[1].trim(),
												candidateEmailId	  : data[2].toLowerCase().trim(),
												candidateMobile     : data[3].trim(),
												candidateAadharNo 	: data[4].trim(),	
												candidateGender     : data[5].trim(),
												candidateVerificationStatus : "New",
											}
										}; 
										if(data){
											result.candidateList.push(data);
										}
								  }								 	
								}
							}
						});
						resolve(result);
					});
					var candidateDataTempInsertCheck = candidateDataTempInsert.then(function(value){
						resolve(result);
					});
				});

				var test = tempCorpOrderCreation.then(function(value) {
				  test = value;
				  returnValue = true; 
				  return value;
				});	
				if(test){
					return test;
				}			
			}else{
				return 'Data is not in appropriate Format.3';	
			}
		}
	});
}
function checkDuplicateInObject(data,FirstName,LastName,emailID,MobileNo) {
	// console.log("data",data);
	var resultIndex = data.findIndex(x => x.candidateDetails.candidateFirstName == FirstName && x.candidateDetails.candidateLastName == LastName && x.candidateDetails.candidateEmailId == emailID.toLowerCase() && x.candidateDetails.candidateMobile == MobileNo );
	// console.log("resultIndex",resultIndex);
	return resultIndex;
	
}