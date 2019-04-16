import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { Match } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
// import { TempOrder } from '/imports/AssureID/company/newRequest/api/Order.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
// import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';

SimpleSchema.defineValidationErrorTransform(error => {
  const ddpError = new Meteor.Error(error.message);
  ddpError.error = 'validation-error';
  ddpError.details = error.details;
  return ddpError;
});

const dataAddressValidation = new SimpleSchema({
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
		regEx : SimpleSchema.RegEx.EmailWithTLD,
	},
	MobileNo: {
	    type: String,
	    regEx: /^[0-9]{10}$/,
	    label:'Mobile Number should be 10 digit number',
	},
  	AadharNumber:{
  		type: String,
  		regEx: /^\d{4}\s\d{4}\s\d{4}$|^$/,
  		optional: true,
  	},
  	TypeofAddress:{
  		type:String,
  		custom:function(){
	  		if(!(this.value == 'permanentAddress' || this.value == 'currentAddress')){
	  			return [
					    { name: 'TypeofAddress', type: 'InValid Data', value: this.value }
					  ];
	  		}
	  	},
	},
	Line1: {
	  	type:String,
	},
	Line2: {
	  	type:String,
	},
	Line3: {
	  	type:String,
	  	optional: true,
	},
  	Landmark: {
  		type:String,
  	},
  	City: {
  		type:String,
  	},
  	State: {
  	 	type: String,
    },
    Country: {
  	 	type: String,
  	},
    Pincode:{
  		type: String,
  		regEx: /^[0-9]{6}$/
    },
  	ResidingFrom:{
  		type: Date,
  	},
  	ResidingTo:{
  		type: Date,
	},
}).newContext();

const dataEducationValidation = new SimpleSchema({
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
		regEx : SimpleSchema.RegEx.EmailWithTLD,
	},
	MobileNo: {
	    type: String,
	    regEx: /^[0-9]{10}$/,
	    label:'Mobile Number should be 10 digit number',
	},
  	AadharNumber:{
  		type: String,
  		regEx: /^\d{4}\s\d{4}\s\d{4}$|^$/,
  		optional: true,
  	},
  	EducationType:{
  		type: String,
  		custom:function(){
	  		if(!(this.value == 'Regular' || this.value == 'Professional')){
	  			return [
					    { name: 'EducationType', type: 'InValid Eduction Type', value: this.value }
					  ];
	  		}
	  	},
  	},
  	EducationLevel:{
  		type: String,
  		custom:function(){
	  		if(!(this.value == 'Post Graduation' || this.value == 'Graduation' || this.value == 'Diploma' || this.value == 'HSC' || this.value == 'SSC' || this.value == 'Below Matriculation')){
	  			return [
					    { name: 'EducationLevel', type: 'InValid Education Level', value: this.value }
					  ];
	  		}
	  	},
	  	optional: true,
  	},	
  	EducationQualification:{
  		type: String,
  		optional: true,
  	},	
  	Specialization:{
  		type: String,
  		optional: true,
  	},	
  	Grades:{
  		type: String,
  		optional: true,
  	},	
  	EducationMode:{
  		type: String,
  		custom:function(){
	  		if(!(this.value == 'Full Time' || this.value == 'Part Time' || this.value == 'Distance')){
	  			return [
					    { name: 'EducationMode', type: 'InValid Data', value: this.value }
					  ];
	  		}
	  	},
	  	optional: true,
  	},	
  	DateAttendedFrom:{
  		type: Date,
  		optional: true,
  	},	
  	DateAttendedTo:{
  		type: Date,
  		optional: true,
  	},	
  	CollegeName:{
  		type: String,
  		optional: true,
  	},	
  	University:{
  		type: String,
  		optional: true,
  	},	
  	CollegeAddress:{
  		type: String,
  		optional: true,
  	},	
  	City:{
  		type: String,
  		optional: true,
  	},	
  	State:{
  		type: String,
  		optional: true,
  	},		
  	Country:{
  		type: String,
  		optional: true,
  	},	
  	Pincode:{
  		type: String,
  		optional: true,
  		regEx: /^[0-9]{6}$/
  	},	
  	RollNo:{
  		type: String,
  		optional: true,
  	},	
  	ProfessionalQualification:{
  		type: String,
  		optional: true,
  	},
  	RegistrationNo:{
  		type: String,
  		optional: true,
  	},
  	DateOfQualification:{
  		type: Date,
  		optional: true,
  	},	
  	QualifyingBodyNm:{
  		type: String,
  		optional: true,
  	},	
  	ProfessionalRollNo:{
  		type: String,
  		optional: true,
  	},
}).newContext();

const dataEmployementValidation = new SimpleSchema({
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
		regEx : SimpleSchema.RegEx.EmailWithTLD,
	},
	MobileNo: {
	    type: String,
	    regEx: /^[0-9]{10}$/,
	    label:'Mobile Number should be 10 digit number',
	},
  	AadharNumber:{
  		type: String,
  		regEx: /^\d{4}\s\d{4}\s\d{4}$|^$/,
  		optional: true,
  	},
  	EmployementId:{
  		type: String,
  	}, 
  	NameOfEmployer:{
  		type: String,
  	}, 
  	EmployerAddress:{
  		type: String,
  	},
    City:{
    	type: String,
  	}, 
  	State:{
  		type: String,
  	}, 
  	ContactNo:{
  		type: String,
  	}, 
  	EmployeeCode:{
  		type: String,
  	}, 
  	Designation:{
  		type: String,
  	},
  	Department:{
  		type: String,
  	}, 
  	EmploymentFrom:{
  		type: Date,
  	}, 
  	EmploymentTo:{
  		type: String,
  		custom:function(){
  			console.log('actual date ',this.value);

	  		if(!(this.value == 'Present')){
	  			var dateValue = new Date(this.value);
	  			console.log('date ',dateValue);
	  			if(dateValue == 'Invalid Date'){
	  				console.log('date error ',dateValue, ' value ',this.value);
	  				var x = 'Invalid Date';
		  			return [
						    { name: 'EmploymentTo', type: 'InValid Data', value: x }
						  ];
					// return x;
	  			}
	  		}
	  	},
  	}, 
  	LastSalaryDrawn:{  
  		type: String,
  	}, 
  	TypeOfEmployement:{
  		type: String,
  	}, 
  	DetailOfAgency:{
  		type: String,
  	}, 
  	ReasonOfLeaving:{
  		type: String,
  	}, 
  	DutiesAndResponsibilites:{
  		type: String,
  	}, 
  	ReportingManagerNm:{
  		type: String,
  	}, 
  	PrevDesignation:{
  		type: String,
  	}, 
  	ContactDetails:{
  		type: String, 
  	},	
}).newContext();

const dataIdentityValidation = new SimpleSchema({
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
		regEx : SimpleSchema.RegEx.EmailWithTLD,
	},
	MobileNo: {
	    type: String,
	    regEx: /^[0-9]{10}$/,
	    label:'Mobile Number should be 10 digit number',
	},
  	AadharNumber:{
  		type: String,
  		regEx: /^\d{4}\s\d{4}\s\d{4}$|^$/,
  		optional: true,
  	},
	CardDetails:{
		type: String,
		custom:function(){
	  		if(!(this.value == 'Aadhar' || this.value == 'PANCard' || this.value == 'DrivingCard' || this.value == 'VotingCard' || this.value == 'RationCard' || this.value == 'Passport')){
	  			return [
				    { name: 'EducationType', type: 'InValid Eduction Type', value: this.value }
				];
	  		}
	  	},
	},

}).newContext();

if(Meteor.isServer){
	Meteor.methods({
		//Check CSV Header
		'companyRequestCheckCSV' : function(csvObject,companyAssureID,typeid,serviceRequired){
			if(Match.test(csvObject, Array)){
				switch(serviceRequired){
					case 'AddressForm':	
						if(csvObject[0][0] != 'FirstName' || csvObject[0][1] != 'LastName' || csvObject[0][2] != 'EmailID' || csvObject[0][3] != 'MobileNo' || csvObject[0][4] != 'AadharNumber' || 
							csvObject[0][5] != 'Type of Address' || csvObject[0][6] != 'Line1' || csvObject[0][7] != 'Line2' || csvObject[0][8] != 'Line3' || csvObject[0][9] != 'Landmark' || csvObject[0][10] != 'City' ||
							csvObject[0][11] != 'State' || csvObject[0][12] != 'Country' || csvObject[0][13] != 'Pincode' || csvObject[0][14] != 'Residing From' || csvObject[0][15] != 'Residing To')	{
							return 'Data is not in appropriate Format.1';
						}else{
							var data = '-';
		     				var csvRes = new Promise(function(resolve, reject) {
		     					Meteor.call('companyRequestUploadAddress',csvObject,companyAssureID,typeid,(error, res) => {
		                            if(error){
		                              console.log("companyRequestUploadAddress error : ",error.reason);
		                            }else if(res){
		                              // console.log("companyRequestUploadAddress result : ",res);
		                              if(res){
		                        		data = res;
		                            	resolve(data);
		                              }
		                        	}else{
		                        		console.log('something is wrong');
		                        	}
		                        });
		     				});
		     				// console.log('csvRes:',csvRes);
		            		var test= csvRes.then(function(value) {
							  // console.log('csvRes ',value);
							  test = value;
							  return test;
							});
							if(test){
			                  // console.log("test = ",test);
			                  return test;
							} 
						}				
						break;
					case 'EducationForm':
						if(csvObject[0][0] != 'FirstName' || 
							csvObject[0][1] != 'LastName' || 
							csvObject[0][2] != 'EmailID' || 
							csvObject[0][3] != 'MobileNo' || 
							csvObject[0][4] != 'AadharNumber' || 
							csvObject[0][5] != 'EducationType' || 
							csvObject[0][6] != 'EducationLevel' || 
							csvObject[0][7] != 'EducationQualification' || 
							csvObject[0][8] != 'Specialization' || 
							csvObject[0][9] != 'Grades' || 
							csvObject[0][10] != 'EducationMode' || 
							csvObject[0][11] != 'DateAttendedFrom' || 
							csvObject[0][12] != 'DateAttendedTo' || 
							csvObject[0][13] != 'CollegeName' || 
							csvObject[0][14] != 'University' || 
							csvObject[0][15] != 'CollegeAddress' || 
							csvObject[0][16] != 'City' || 
							csvObject[0][17] != 'State' || 
							csvObject[0][18] != 'Country' || 
							csvObject[0][19] != 'Pincode' || 
							csvObject[0][20] != 'RollNo')	{
								return 'Data is not in appropriate Format.1';
						}else{
		     				var csvRes = new Promise(function(resolve, reject) {
		     					Meteor.call('companyRequestUploadEducation',csvObject,typeid,companyAssureID,(error, res) => {
		                            if(error){
		                              console.log("companyRequestUploadEducation error : ",error.reason);
		                            }else{
		                              console.log("companyRequestUploadEducation result : ",res.error);
		                            	csvResult = res;
		                            	resolve(res);
		                            }
		                        });
		     				});
		     				console.log('csvRes:',csvRes);
		                    
		                    var test= csvRes.then(function(value) {
							  console.log('value ',value);
							  test = value;
							  return test;
							});
							if(test){
			                    console.log("test = ",test);
			                    return test;
							}
						}
						break;
					case 'EmploymentVerification':
						if(csvObject[0][0] != 'FirstName' || 
							csvObject[0][1] != 'LastName' || 
							csvObject[0][2] != 'EmailID' || 
							csvObject[0][3] != 'MobileNo' || 
							csvObject[0][4] != 'AadharNumber' || 
							csvObject[0][5] != 'EmployementId' || 
							csvObject[0][6] != 'NameOfEmployer' || 
							csvObject[0][7] != 'EmployerAddress' || 
							csvObject[0][8] != 'City' || 
							csvObject[0][9] != 'State' || 
							csvObject[0][10] != 'ContactNo' || 
							csvObject[0][11] != 'EmployeeCode' || 
							csvObject[0][12] != 'Designation' || 
							csvObject[0][13] != 'Department' || 
							csvObject[0][14] != 'EmploymentFrom' || 
							csvObject[0][15] != 'EmploymentTo' || 
							csvObject[0][16] != 'LastSalaryDrawn' || 
							csvObject[0][17] != 'TypeOfEmployement' || 
							csvObject[0][18] != 'DetailOfAgency' || 
							csvObject[0][19] != 'ReasonOfLeaving' || 
							csvObject[0][20] != 'DutiesAndResponsibilites' ||
							csvObject[0][21] != 'ReportingManagerNm' ||
							csvObject[0][22] != 'PrevDesignation' ||
							csvObject[0][23] != 'ContactDetails' )	{
								return 'Data is not in appropriate Format.1';
						}else{
		     				var csvRes = new Promise(function(resolve, reject) {
		     					Meteor.call('companyRequestUploadEmployement',csvObject,companyAssureID,(error, res) => {
		                            if(error){
		                              console.log("companyRequestUploadEmployement error : ",error.reason);
		                            }else{
		                              console.log("companyRequestUploadEmployement result : ",res);
		                            	csvResult = res;
		                            	resolve(res);
		                            }
		                        });
		     				});
		     				console.log('csvRes:',csvRes);
		                    
		          			var test= csvRes.then(function(value) {
							  console.log('value ',value);
							  test = value;
							  return test;
							});
							if(test){
			                    console.log("test = ",test);
			                    return test;
							}
						}
						break;
					case 'BasicVerification':
						break;
					case 'IdentityVerification':
						break;
					default:
						return 'Please check with the Admin. It seams there is some issue with the service';	
						break;
				}
				
			}else{
				return 'Data is not in appropriate Format.2';
			}
		},
		//Methods for specific verification
		'companyRequestUploadAddress' : function(csvObject,companyAssureID,typeid){
			let result = {
				failed : 0,
				faildList : [],
			};
			var returnValue = false;
			if(Match.test( csvObject, Array)){
				var lengthCSV = csvObject.length;
				// Call Method createTempOrder(compnayAssureID,ServiceID) 
				var tempOrderCreation = new Promise(function(resolve, reject) {
					Meteor.call('insertBulkUserDataTotempOrder',typeid,companyAssureID,function (error,res) {
						if(error){
								console.log('insertBulkUserDataTotempOrder error',error.reason);
						}else if(res){
							var tempOrderId = res;
							// console.log('insertBulkUserDataTotempOrder result ',result);
							var candidateDataTempInsert = new Promise(function(resolve, reject){
								csvObject.map((data,index) =>{
									if(index != 0 && index != lengthCSV-1){
										dataAddressValidation.validate({
											FirstName 			: data[0],
											LastName  			: data[1],
											EmailID			  	: data[2],
											MobileNo 		  	: data[3],
											AadharNumber		: data[4],
											TypeofAddress		: data[5],
											Line1			    : data[6],
											Line2			    : data[7],
											Line3			    : data[8],
											Landmark		  	: data[9],
											City			    : data[10],
											State			    : data[11],
											Country			  	: data[12],
											Pincode			  	: data[13],
											ResidingFrom		: new Date(data[14]),
											ResidingTo			: new Date(data[15]),   
										});
										if(!dataAddressValidation.isValid()){
											result.failed = result.failed + 1;
											result.faildList.push(index);
											console.log('map result ',result);
										}else{
											//call Meteor to update temporder
											if(data[5] == 'permanentAddress'){
												var candidateInfo = {
								                    "candidateFirstName"          	: data[0],
								                    "candidateLastName"           	: data[1],
								                    "candidateEmailId"            	: data[2],
								                    "candidateMobile"             	: data[3],
								                    "candidateAadharNo"           	: data[4],
								                    "candidateVerificationStatus" 	: "In Process",
										            "candidatepaymentStatus" 		: "Company",
										            "createdAt" 					: new Date(),
										            "verificationData" : [ 
										            	{
										                    "line1" 			: data[6],
										                    "line2" 			: data[7],
										                    "line3" 			: data[8],
										                    "landmark" 			: data[9],
										                    "city" 				: data[10],
										                    "state" 			: data[11],
										                    "country" 			: data[12],
										                    "pincode" 			: data[13],
										                    "residingFrom" 		: data[14],
										                    "residingTo" 		: data[15],
										                    "verifiedStatus" 	: "In Process",
										                    "editStatus" 		: "Open",
										                    "verificationType" 	: data[5],
										                }
										            ]
								                }	
											}else{
												var candidateInfo = {
							                    "candidateFirstName"          	: data[0],
							                    "candidateLastName"           	: data[1],
							                    "candidateEmailId"            	: data[2],
							                    "candidateMobile"             	: data[3],
							                    "candidateAadharNo"           	: data[4],
							                    "candidateVerificationStatus" 	: "In Process",
									            "candidatepaymentStatus" 		: "Company",
									            "createdAt" 					: new Date(),
									            "verificationData" : [ 
									            	{
									                    "tempLine1" 			: data[6],
									                    "tempLine2" 			: data[7],
									                    "tempLine3" 			: data[8],
									                    "tempLandmark" 			: data[9],
									                    "tempCity" 				: data[10],
									                    "tempState" 			: data[11],
									                    "tempCountry" 			: data[12],
									                    "tempPincode" 			: data[13],
									                    "tempresidingFrom" 		: data[14],
									                    "tempresidingTo" 		: data[15],
									                    "verifiedStatus" 		: "In Process",
									                    "editStatus" 			: "Open",
									                    "verificationType" 		: data[5],
									                }
									            ]
							                }
											}
							                  Meteor.call("updateTempOrderCompanyDetails",tempOrderId,candidateInfo);
										}
									}
								});
								resolve(result);
							});
							var candidateDataTempInsertCheck = candidateDataTempInsert.then(function(value){
								resolve(result);
							});
						}
					});
				});

				var test = tempOrderCreation.then(function(value) {
				  // console.log('tempOrderCreation ',value);
				  test = value;
				  returnValue = true; 
				  // console.log('result in ',test, ' returnValue ',returnValue);
				  return value;
				});	
				if(test){
					return test;
				}			
			}else{
				return 'Data is not in appropriate Format.3';	
			}
			
			// return 'data';
		},
		'companyRequestUploadEducation' : function(csvObject,typeid,companyAssureID){
			let result = {
				failed : 0,
				faildList : [],
			};
			var returnValue = false;
			if(Match.test( csvObject, Array)){
				console.log('matched');  
				var lengthCSV = csvObject.length;
				// Call Method createTempOrder(compnayAssureID,ServiceID) 
				var tempOrderCreation = new Promise(function(resolve, reject) {
					Meteor.call('insertBulkUserDataTotempOrder',typeid,companyAssureID,function (error,res) {
						if(error){
								console.log('insertBulkUserDataTotempOrder error',error.reason);
						}else if(res){
							var tempOrderId = res;
							var candidateDataTempInsert = new Promise(function(resolve, reject){
								console.log('length ',lengthCSV);
								csvObject.map((data,index) =>{  
									if(index != 0 && index != lengthCSV-1){
										console.log('DateOfQualification 23',data[23]);
										dataEducationValidation.validate({
											FirstName					: data[0],
											LastName					: data[1],
											EmailID						: data[2],
											MobileNo					: data[3],
											AadharNumber				: data[4],
											EducationType				: data[5],
											EducationLevel				: data[6],
											EducationQualification		: data[7],
											Specialization				: data[8],
											Grades						: data[9],
											EducationMode				: data[10],
											DateAttendedFrom			: new Date(data[11]),
											DateAttendedTo				: new Date(data[12]),
											CollegeName					: data[13],
											University					: data[14],
											CollegeAddress				: data[15],
											City						: data[16],
											State						: data[17],
											Country						: data[18],
											Pincode						: data[19],
											RollNo						: data[20],
											ProfessionalQualification	: data[21],
											RegistrationNo				: data[22],
											DateOfQualification			: new Date(data[23]),	
											QualifyingBodyNm			: data[24],	
											ProfessionalRollNo			: data[25],	
										});
										if(!dataEducationValidation.isValid()){
											result.failed = result.failed + 1;
											var error1 = {
												index : index,
												error : dataEducationValidation.validationErrors(),
											}
											result.faildList.push(error1);
										}else{
											//call Meteor to update temporder
											if(data[5] == 'Regular'){
												var candidateInfo = {
								                    "candidateFirstName"          	: data[0],
								                    "candidateLastName"           	: data[1],
								                    "candidateEmailId"            	: data[2],
								                    "candidateMobile"             	: data[3],
								                    "candidateAadharNo"           	: data[4],
								                    "candidateVerificationStatus" 	: "In Process",
										            "candidatepaymentStatus" 		: "Company",
										            "createdAt" 					: new Date(),
										            "verificationData" : [ 
										            	{
										                    "educationLevel" 			: data[6],
										                    "educationQualification" 	: data[7],
										                    "specialization" 			: data[8],
										                    "grades" 					: data[9],
										                    "educationMode" 			: data[10],
										                    "dateAttendedFrom" 			: new Date(data[11]),
										                    "dateAttendedTo" 			: new Date(data[12]),
										                    "collegeName" 				: data[13],
										                    "university" 				: data[14],
										                    "collegeAddress" 			: data[15],
										                    "city"			 			: data[16],
										                    "state"			 			: data[17],
										                    "country"			 		: data[18],
										                    "pincode"			 		: data[19],
										                    "rollNo"			 		: data[20],
										                    "verifiedStatus" 			: "In Process",
										                    "editStatus" 				: "Open",
										                    "verificationType" 			: 'education',
										                }
										            ]
								                }
							            	}else{
							            		var candidateInfo = {
								                    "candidateFirstName"          	: data[0],
								                    "candidateLastName"           	: data[1],
								                    "candidateEmailId"            	: data[2],
								                    "candidateMobile"             	: data[3],
								                    "candidateAadharNo"           	: data[4],
								                    "candidateVerificationStatus" 	: "In Process",
										            "candidatepaymentStatus" 		: "Company",
										            "createdAt" 					: new Date(),
										            "verificationData" : [ 
										            	{
										                    "professionalQualification" : data[21],
										                    "registrationNo" 			: data[22],
										                    "dateOfQualification" 		: new Date(data[23]),
										                    "qualifyingBodyNm" 			: data[24],
										                    "professionalRollNo" 		: data[25],
										                    "verifiedStatus" 			: "In Process",
										                    "editStatus" 				: "Open",
										                    "verificationType" 			: 'professionalEducation',
										                }
										            ]
								                }
							            	}
							                Meteor.call("updateTempOrderCompanyDetails",tempOrderId,candidateInfo);
										}
									}
								});
								resolve(result);
							});
							var candidateDataTempInsertCheck = candidateDataTempInsert.then(function(value){
								resolve(result);
							});
						}else{
							console.log('something wrong');
						}
					});
				});

				var test = tempOrderCreation.then(function(value) {
				  // console.log('tempOrderCreation ',value);
				  test = value;
				  returnValue = true; 
				  // console.log('result in ',test, ' returnValue ',returnValue);
				  return value;
				});	
				if(test){
					return test;
				}			
			}else{
				return 'Data is not in appropriate Format.3';	
			}
		},
		'companyRequestUploadEmployement' : function(csvObject,typeid,companyAssureID){
			let result = {
				failed : 0,
				faildList : [],
			};
			var returnValue = false;
			if(Match.test( csvObject, Array)){
				console.log('matched');  
				var lengthCSV = csvObject.length;
				// Call Method createTempOrder(compnayAssureID,ServiceID) 
				var tempOrderCreation = new Promise(function(resolve, reject) {
					Meteor.call('insertBulkUserDataTotempOrder',typeid,companyAssureID,function (error,res) {
						if(error){
								console.log('insertBulkUserDataTotempOrder error',error.reason);
						}else if(res){
							var tempOrderId = res;
							var candidateDataTempInsert = new Promise(function(resolve, reject){
								console.log('length ',lengthCSV);
								csvObject.map((data,index) =>{  
									if(index != 0 && index != lengthCSV-1){
										console.log('DateOfQualification 23',data[23]);
										dataEmployementValidation.validate({
											FirstName					: data[0],
											LastName					: data[1],
											EmailID						: data[2],
											MobileNo					: data[3],
											AadharNumber				: data[4],
											EmployementId         		: data[5],
				       						NameOfEmployer        		: data[6],
				       						EmployerAddress       		: data[7],
				       						City             	  		: data[8],
				       						State            			: data[9],
				       						ContactNo               	: data[10],
				       						EmployeeCode            	: data[11],
				       						Designation              	: data[12],
				       						Department               	: data[13],
				       						EmploymentFrom           	: new Date(data[14]),
				       						EmploymentTo             	: data[15],
				       						LastSalaryDrawn          	: data[16],
				       						TypeOfEmployement        	: data[17],
				       						DetailOfAgency           	: data[18],
				       						ReasonOfLeaving		        : data[19],
				       						DutiesAndResponsibilites 	: data[20],
				       						ReportingManagerNm      	: data[21],
				       						PrevDesignation         	: data[22],
				       						ContactDetails				: data[23],
										});
										if(!dataEmployementValidation.isValid()){
											result.failed = result.failed + 1;
											var error1 = {
												index : index,
												error : dataEmployementValidation.validationErrors(),
											}
											result.faildList.push(error1);
										}else{
											//call Meteor to update temporder
											var candidateInfo = {
							                    "candidateFirstName"          	: data[0],
							                    "candidateLastName"           	: data[1],
							                    "candidateEmailId"            	: data[2],
							                    "candidateMobile"             	: data[3],
							                    "candidateAadharNo"           	: data[4],
							                    "candidateVerificationStatus" 	: "In Process",
									            "candidatepaymentStatus" 		: "Company",
									            "createdAt" 					: new Date(),
									            "verificationData" : [ 
									            	{
									                    "employementId"         	: data[5],
							       						"nameOfEmployer"        	: data[6],
							       						"employerAddress"       	: data[7],
							       						"city"             	  		: data[8],
							       						"state"            			: data[9],
							       						"contactNo"               	: data[10],
							       						"employeeCode"            	: data[11],
							       						"designation"              	: data[12],
							       						"department"               	: data[13],
							       						"employmentFrom"           	: new Date(data[14]),
							       						"employmentTo"             	: data[15],
							       						"lastSalaryDrawn"          	: data[16],
							       						"typeOfEmployement"        	: data[17],
							       						"detailOfAgency"           	: data[18],
							       						"reasonOfLeaving"		    : data[19],
							       						"dutiesAndResponsibilites" 	: data[20],
							       						"reportingManagerNm"      	: data[21],
							       						"prevDesignation"         	: data[22],
							       						"contactDetails"			: data[23],
									                    "verifiedStatus" 			: "In Process",
									                    "editStatus" 				: "Open",
									                    "verificationType" 			: 'education',
									                }
									            ]
							                }
											
							                Meteor.call("updateTempOrderCompanyDetails",tempOrderId,candidateInfo);
										}
									}
								});
								resolve(result);
							});
							var candidateDataTempInsertCheck = candidateDataTempInsert.then(function(value){
								resolve(result);
							});
						}else{
							console.log('something wrong');
						}
					});
				});

				var test = tempOrderCreation.then(function(value) {
				  // console.log('tempOrderCreation ',value);
				  test = value;
				  returnValue = true; 
				  // console.log('result in ',test, ' returnValue ',returnValue);
				  return value;
				});	
				if(test){
					return test;
				}			
			}else{
				return 'Data is not in appropriate Format.3';	
			}
		},
	});
}