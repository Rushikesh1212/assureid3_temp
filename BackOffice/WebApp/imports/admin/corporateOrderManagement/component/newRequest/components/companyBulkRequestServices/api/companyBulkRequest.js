import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor'; 
import { Match } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import {Order} from '/imports/admin/orderManagement/api/Order.js';


// import { TempOrder } from '/imports/AssureID/company/newRequest/api/Order.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
// import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
uppercase = function(str) {
  var array1 = str.split(' ');
  var newarray1 = []; 
    
  for(var x = 0; x < array1.length; x++){
      newarray1.push(array1[x].charAt(0).toUpperCase()+array1[x].slice(1));
  }
  return newarray1.join(' ');
} 

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
		// regEx : SimpleSchema.RegEx.EmailWithTLD,
		custom:function(){
	    var emailid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!emailid.test(this.value)){
				return[
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
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
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
				];
			}
	  }
	},
	AadharNumber:{
		type: String,
		// regEx: /^\d{4}\s\d{4}\s\d{4}$|^$/,
		custom:function(){
	    	var aadharNo = /^\d{4}\s\d{4}\s\d{4}$|^$/;
    		if(this.value != ''){
				if(!aadharNo.test(this.value)){
					return[
						{name:'Aadhar Number',type:'Aadhar Number format should be e.g. xxxx xxxx xxxx.', value:this.value}
					];
				}
			}
	    },
		optional: true,
	},
	TypeofAddress:{
		type:String,
		custom:function(){
  		if(!(this.value == 'permanent' || this.value == 'current')){
  			return [
				    { name: 'TypeofAddress', type: 'Type of Address should be either permanent or current.', value: this.value }
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
		optional: true,
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
		// regEx: /^[0-9]{6}$/
		custom:function(){
	    var pincode = /^[0-9]{6}$/;
			if(!pincode.test(this.value)){
				return[
					{name:'Pincode',type:'InValid pincode format. It should be ex: 123456.', value:this.value}
				];
			}
	    }
  	},
	ResidingFrom :{
		type: String,
		// regEx: /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/,
		// label: "Residing From date should be in 'DD/MM/YYYY' format",	
		custom:function(){
	    var residingFrom = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;
			if(!residingFrom.test(this.value)){
				return[
					{name:'Residing From',type:'Residing From date should be in '+ '"DD/MM/YYYY"'+' format.', value:this.value}
				];
			}
	   }
	},
	ResidingTo :{
		type: String,
		custom:function(){
			if(this.value != 'Present'){
				var givenDate = this.value;
				if(givenDate){
					var vdate = new Date(givenDate);
					if(!vdate){
						return [
			    			{ name: 'ResidingTo', type: 'Residing To date should be in '+ '"DD/MM/YYYY"'+' format.', value: this.value }
			 			];	
					}else{
						var fromDate = new Date(this.field('ResidingFrom').value);
						var toDate = new Date(this.value);
						if(fromDate > toDate){
							return [
								{name: 'DateValidation', type: 'Residing From Date should be less then Residing To.',value:this.value}
							];
						}
					}
				}
			}else{
				if(new Date(this.field('ResidingFrom').value) > new Date()){
					return [
						{name: 'DateValidation', type: 'Residing From date cannot be future date.', value:this.field('ResidingFrom').value}
					];
				}
			}
		}
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
		// regEx : SimpleSchema.RegEx.EmailWithTLD,
		custom:function(){
	    var emailid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!emailid.test(this.value)){
				return[
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
				];
			}
	  }
	},
	MobileNo: {
	   type: String,
	    // regEx: /^[0-9]{10}$/,
	   custom:function(){
	    var mobileNo = /^[0-9]{10}$/;
			if(!mobileNo.test(this.value)){
				return[
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
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
						{name:'Aadhar Number',type:'Aadhar Number format should be e.g. xxxx xxxx xxxx.', value:this.value}
					];
				}
	    },
  		optional: true,
  	},
  	EducationType:{
  		type: String,
  		custom:function(){
	  		if(!(this.value == 'Regular' || this.value == 'Professional')){
	  			return [
					    { name: 'EducationType', type: 'InValid Eduction Type!', value: this.value }
					  ];
	  		}
	  	},
  	},
  	EducationLevel:{
  		type: String,
  		custom:function(){
	  		if(!(this.value == 'Post Graduation' || this.value == 'Graduation' || this.value == 'Diploma' || this.value == 'HSC' || this.value == 'SSC' || this.value == 'Below Matriculation')){
	  			return [
					    { name: 'EducationLevel', type: 'Education Level field has specific value.' , value: this.value }
					  ];
	  		}
	  	},
  	},	
  	EducationQualification:{
  		type: String,
  	},	
  	Specialization:{
  		type: String,
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
					    { name: 'EducationMode', type: 'Educational Mode field has specific value.', value: this.value }
					  ];
	  		}
	  	},
  	},	
  		
  // 	DateAttendedTo:{
  // 		type: String,
  // 		// regEx: /^(\d{2,2})\2(\d{4}|\d{4})$/,
  // 		custom:function(){
		// 	if(this.value != 'Present'){
		// 		var givenDate = this.value;
		// 		if(givenDate){
		// 			var vdate = new Date(givenDate);
		// 			if(!vdate){
		// 				return [
		// 	    			{ name: 'DateAttendedTo', type: 'Date Attended To date should be in MM/YYYY format', value: this.value }
		// 	 			];	
		// 			}
		// 		}
		// 	}
		// }
  // 	},	
  DateAttendedFrom :{
		type: String,
		// regEx: /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/,
		custom:function(){
	    var dateAttendedFrom = /^(0[123456789]|10|11|12)([/])([1-2][0-9][0-9][0-9])$/;
			if(!dateAttendedFrom.test(this.value)){
				return[
					{name:'Date Attended From',type:'Attended From date should be in '+ '"MM/YYYY"'+' format.', value:this.value}
				];
			}
	  }
	},
	DateAttendedTo :{
		type: String,
		custom:function(){
			if(this.value != 'Present'){
				var givenDate = this.value;
				var dateAttendedto = /^(0[123456789]|10|11|12)([/])([1-2][0-9][0-9][0-9])$/;
				if(givenDate){
					var vdate = new Date(givenDate);
					if(!vdate){
						return [
			    			{ name: 'DateValidation', type: 'Attended To date should be in '+ '"MM/YYYY"'+' format.', value: this.value }
			 			];	
					}else{
						var fromDate = new Date(this.field('DateAttendedFrom').value);
						var toDate = new Date(this.value);
						if(fromDate > toDate){
							return [
								{name: 'DateValidation', type: 'Attended From Date should be less then Attended To.',value:this.value}
							];
						}
					}
				}
			}else{
				if(new Date(this.field('DateAttendedFrom').value) > new Date()){
					return [
						{name: 'DateValidation', type: 'Attended From date cannot be future date.', value:this.field('DateAttendedFrom').value}
					];
				}
			}
		}
	},
  	CollegeName:{
  		type: String,
  	},	
  	University:{
  		type: String,
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
  		// regEx: /^[0-9]{6}$/
  		custom:function(){
		    var pincode = /^[0-9]{6}$/;
				if(!pincode.test(this.value)){
					return[
						{name:'Pincode',type:'InValid pincode format. It should be ex: 123456.', value:this.value}
					];
				}
	    }
  	},	
  	RollNo:{
  		type: String,
  		optional: true,
  	},	
  	// ProfessionalQualification:{
  	// 	type: String,
  	// 	optional: true,
  	// },
  	// RegistrationNo:{
  	// 	type: String,
  	// 	optional: true,
  	// },
  	// DateOfQualification:{
  	// 	type: Date,
  	// 	optional: true,
  	// },	
  	// QualifyingBodyNm:{
  	// 	type: String,
  	// 	optional: true,
  	// },	
  	// ProfessionalRollNo:{
  	// 	type: String,
  	// 	optional: true,
  	// },
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
		// regEx : SimpleSchema.RegEx.EmailWithTLD,
		custom:function(){
	    var emailid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!emailid.test(this.value)){
				return[
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
				];
			}
	  }
	},
	MobileNo: {
	  type: String,
	    // regEx: /^[0-9]{10}$/,
	  custom:function(){
	    var mobileNo = /^[0-9]{10}$/;
			if(!mobileNo.test(this.value)){
				return[
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
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
					{name:'Aadhar Number',type:'Aadhar Number format should be e.g. xxxx xxxx xxxx.', value:this.value}
				];
			}
    },
		optional: true,
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
		optional: true,
	}, 
	EmploymentFrom:{
		type: String,
	  // regEx: /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/,
	  custom:function(){
	    var employmentFrom = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;
			if(!employmentFrom.test(this.value)){
				return[
					{name:'Employment From',type:'Employment From date should be in '+ '"DD/MM/YYYY"'+' format.', value:this.value}
				];
			}
	  }
	}, 
  EmploymentTo :{
		type: String,
		custom:function(){
			if(this.value != 'Present'){
				var givenDate = this.value;
				if(givenDate){
					var vdate = new Date(givenDate);
					if(!vdate){
						return [
			    			{ name: 'DateValidation', type: 'Employment To date should be in '+ '"DD/MM/YYYY"'+' format.', value: this.value }
			 			];	
					}else{
						var fromDate = new Date(this.field('EmploymentFrom').value);
						var toDate = new Date(this.value);
						if(fromDate > toDate){
							return [
								{name: 'DateValidation', type: 'Employment From Date should be less then Employment To.',value:this.value}
							];
						}
					}
				}
			}else{
				if(new Date(this.field('EmploymentFrom').value) > new Date()){
					return [
						{name: 'DateValidation', type: 'Employment From date cannot be future date.', value:this.field('EmploymentFrom').value}
					];
				}
			}
		}
	}, 
  	LastSalaryDrawn:{  
  		type: String,
  		optional : true
  	}, 
  	TypeOfEmployement:{
  		type: String, 
  		custom:function(){
	  		if(!(this.value == 'Permanent' || this.value == 'Temporary' || this.value == 'Contractual')){
	  			return [
					    { name: 'TypeOfEmployement', type: 'Type of Employment should be either Permanent or Temporary or Contractual.', value: this.value }
					 ];
	  		}
	  	},
	  	optional: true,
  	}, 
  	DetailOfAgency:{
  		type: String,
  		optional : true,
  	}, 
  	ReasonOfLeaving:{
  		type: String,
  		optional : true,
  	}, 
  	DutiesAndResponsibilites:{
  		type: String,
  		optional : true,
  	}, 
  	ReportingManagerNm:{
  		type: String,
  	}, 
  	PrevDesignation:{
  		type: String,
  	}, 
  	ContactDetails:{
  		type: String, 
  		// regEx: /^[0-9]{10}$/,
  		custom:function(){
		    var contactDetails = /^[0-9]{10}$/;
				if(!contactDetails.test(this.value)){
					return[
						{name:'Contact Details',type:'Contact details should be 10 digits number e.g. 9999999999.', value:this.value}
					];
				}
		  }
  	},	
}).newContext();

const dataBasicValidation = new SimpleSchema({
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
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
				];
			}
	  }
	},
	MobileNo: {
	  type: String,
	    // regEx: /^[0-9]{10}$/,
	  custom:function(){
	    var mobileNo = /^[0-9]{10}$/;
			if(!mobileNo.test(this.value)){
				return[
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
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
					{name:'Aadhar Number',type:'Aadhar Number format should be e.g. xxxx xxxx xxxx.', value:this.value}
				];
			}
    },
		optional: true,
	},
}).newContext();

const dataIdentityValidation = new SimpleSchema({
	FirstName: {
	    type: String, 
	    label:'Not a valid First Name',
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
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
				];
			}
	  }
	},
	MobileNo: {
	  type: String,
	    // regEx: /^[0-9]{10}$/,
	  custom:function(){
	    var mobileNo = /^[0-9]{10}$/;
			if(!mobileNo.test(this.value)){
				return[
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
				];
			}
	  }
	},
	Type: {
	    type: String, 
		custom:function(){
			if(!(this.value == 'PAN' || this.value == 'Aadhar' || this.value == 'Driving' || this.value == 'Ration' || this.value == 'Passport' || this.value == 'Voting')){
				return [
					  { name: 'TypeofCard', type: 'InValid Card Type!', value: this.value }
					];
			}
		},
	},
	CardNumber: {
		type: String,
		custom:function(){
			switch(this.field('Type').value){
				case 'PAN' :
					var cardNo = /^([a-zA-Z]){3}P([a-zA-Z]){1}([0-9]){4}([a-zA-Z])/;
					if(!cardNo.test(this.value)){
						return[
							{name:'Card Number',type:'Invalid PAN Number!', value:this.value}
						];
					}
					break;
				case 'Aadhar' :
					var cardNo = /^\d{4}\s\d{4}\s\d{4}$|^$/;
					if(!cardNo.test(this.value)){
						return[
							{name:'Card Number',type:'Invalid Aadhar Number!', value:this.value}
						];
					}
					break;
				case 'Driving' :
					var cardNo = /([a-z]{2}-\d{2}[ ,][a-z0-9]{1,2}[a-z]-\d{4})|([a-z]{2} \d{2}[ ,][a-z0-9]{1,2}[a-z] \d{4})/;
					if(!cardNo.test(this.value)){
						return[
							{name:'Card Number',type:'Invalid Driving Number!', value:this.value}
						];
					}
					break;
				case 'Ration' :
					var cardNo = /^[A-za-z']+( [A-Za-z']+)*$/;
					if(!cardNo.test(this.value)){
						return[
							{name:'Card Number',type:'Invalid Ration Number!', value:this.value}
						];
					}
					break;
				case 'Passport' :
					var cardNo =  /^[1-9][0-9]{5}$/;
					if(!cardNo.test(this.value)){
						return[
							{name:'Card Number',type:'Invalid Passport Number!', value:this.value}
						];
					}
					break;
				case 'Voting' :
					var cardNo = /^(?!^0+$)[a-zA-Z0-9]{3,20}$|^$/;
					if(!cardNo.test(this.value)){
						return[
							{name:'Card Number',type:'Invalid Voting Number!', value:this.value}
						];
					}
					break;
				
			};
		},		
	},
}).newContext();

const dataReferenceValidation = new SimpleSchema({
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
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
				];
			}
	  	}
	},
	MobileNo: {
	  type: String,
	    // label:'Mobile Number should be 10 digit number',
	  custom:function(){
	    var mobileNo = /^[0-9]{10}$/;
			if(!mobileNo.test(this.value)){
				return[
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
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
						{name:'Aadhar Number',type:'Aadhar Number format should be e.g. xxxx xxxx xxxx.', value:this.value}
					];
				}
	    },
		optional: true,
	},
	ReferralFirstName:{
		type: String, 
	},
	ReferralLastName:{
		type: String, 
	},
	ReferralMobileNum:{
		type: String,
	    // label:'Mobile Number should be 10 digit number',
	  	custom:function(){
	    	var mobileNo = /^[0-9]{10}$/;
			if(!mobileNo.test(this.value)){
				return[
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
				];
			}
	  	}
	},
	ReferralEmailID:{
		type: String,
		// regEx : SimpleSchema.RegEx.EmailWithTLD,
		custom:function(){
	    	var emailid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!emailid.test(this.value)){
				return[
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
				];
			}
	  	}
	},
	ReferralOrganization:{
		type: String, 
	},
	ReferralDesignation:{
		type: String, 
	},
	ReferralRelationship:{
		type: String, 
	},
	ReferralAssociatedSinceMonths:{
		type: String, 
	}
	  
}).newContext();
const dataCriminalValidation = new SimpleSchema({
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
					{name:'Email ID',type:'Email Id should be like e.g. johndoe@gmail.com.', value:this.value}
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
					{name:'Mobile Number',type:'Mobile Number should be 10 digits number e.g. 9999999999.', value:this.value}
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
						{name:'Aadhar Number',type:'Aadhar Number format should be e.g. xxxx xxxx xxxx.', value:this.value}
					];
				}
	    },
		optional: true,
	},
	TypeofAddress:{
		type:String,
		custom:function(){
  		if(!(this.value == 'permanent' || this.value == 'current')){
  			return [
				    { name: 'TypeofAddress', type: 'Type of Address should be either permanent or current.', value: this.value }
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
		optional: true,
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
		// regEx: /^[0-9]{6}$/
		custom:function(){
	    var pincode = /^[0-9]{6}$/;
			if(!pincode.test(this.value)){
				return[
					{name:'Pincode',type:'InValid pincode format. It should be ex: 123456.', value:this.value}
				];
			}
	    }
  	},
	ResidingFrom :{
		type: String,
		// regEx: /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/,
		// label: "Residing From date should be in 'DD/MM/YYYY' format",	
		custom:function(){
	    var residingFrom = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;
			if(!residingFrom.test(this.value)){
				return[
					{name:'Residing From',type:'Residing From date should be in '+ '"DD/MM/YYYY"'+' format.', value:this.value}
				];
			}
	   }
	},
	ResidingTo :{
		type: String,
		custom:function(){
			if(this.value != 'Present'){
				var givenDate = this.value;
				if(givenDate){
					var vdate = new Date(givenDate);
					if(!vdate){
						return [
			    			{ name: 'ResidingTo', type: 'Residing To date should be in '+ '"DD/MM/YYYY"'+' format.', value: this.value }
			 			];	
					}else{
						var fromDate = new Date(this.field('ResidingFrom').value);
						var toDate = new Date(this.value);
						if(fromDate > toDate){
							return [
								{name: 'DateValidation', type: 'Residing From Date should be less then Residing To.',value:this.value}
							];
						}
					}
				}
			}else{
				if(new Date(this.field('ResidingFrom').value) > new Date()){
					return [
						{name: 'DateValidation', type: 'Residing From date cannot be future date.', value:this.field('ResidingFrom').value}
					];
				}
			}
		}
	},	
	FatherFirstName:{
		type: String, 
	},
	FatherLastName:{
 		type: String, 
	},
	DateOfBirth:{
		type: String,
		// regEx: /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/,
		custom:function(){
    var dateOfBirth = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;
		if(!dateOfBirth.test(this.value)){
			return[
				{name:'Date Of Birth',type:'Date Of Birth should be in DD/MM/YYYY format', value:this.value}
			];
		}
   }
	}
}).newContext();

if(Meteor.isServer){
	Meteor.methods({
		//Check CSV Header
		'companyRequestCheckCSV' : function(csvObject,corporateOrderId,serviceRequired,serviceid){
			if(Match.test(csvObject, Array)){
				switch(serviceRequired){
					case 'AddressForm':	
						if(csvObject[0][0] != 'FirstName' || 
							csvObject[0][1] != 'LastName' || 
							csvObject[0][2] != 'EmailID'  || 
							csvObject[0][3] != 'MobileNo' || 
							csvObject[0][4] != 'AadharNumber' || 
							csvObject[0][5] != 'Type of Address' || 
							csvObject[0][6] != 'Address Line1' || 
							csvObject[0][7] != 'Address Line2' || 
							csvObject[0][8] != 'Address Line3' || 
							csvObject[0][9] != 'Landmark' || 
							csvObject[0][10] != 'City' ||
							csvObject[0][11] != 'State' || 
							csvObject[0][12] != 'Country' || 
							csvObject[0][13] != 'Pincode' || 
							csvObject[0][14] != 'Residing From' || 
							csvObject[0][15] != 'Residing To')	{
								return 'Data is not in appropriate Format.1'; 
						}else{
							var data = Meteor.call('companyRequestUploadAddress',csvObject,corporateOrderId,serviceid);
							if(data){
								return data;
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
							csvObject[0][20] != 'RollNo')	
						{
							return 'Data is not in appropriate Format.1';
						}else{
							var data = Meteor.call('companyRequestUploadEducation',csvObject,corporateOrderId,serviceid);
							if(data){
								return data;
							}
						}
						break;
					case 'WorkForm':
						if(csvObject[0][0] != 'FirstName' || 
							csvObject[0][1] != 'LastName' || 
							csvObject[0][2] != 'EmailID' || 
							csvObject[0][3] != 'MobileNo' || 
							csvObject[0][4] != 'AadharNumber' || 
							csvObject[0][5] != 'NameOfEmployer' || 
							csvObject[0][6] != 'EmployerAddress' || 
							csvObject[0][7] != 'City' || 
							csvObject[0][8] != 'State' ||  
							csvObject[0][9] != 'ContactNo' || 
							csvObject[0][10] != 'EmployeeCode' || 
							csvObject[0][11] != 'Designation' || 
							csvObject[0][12] != 'Department' || 
							csvObject[0][13] != 'EmploymentFrom' || 
							csvObject[0][14] != 'EmploymentTo' || 
							csvObject[0][15] != 'LastSalaryDrawn' || 
							csvObject[0][16] != 'TypeOfEmployement' || 
							csvObject[0][17] != 'DetailOfAgency' || 
							csvObject[0][18] != 'ReasonOfLeaving' || 
							csvObject[0][19] != 'DutiesAndResponsibilites' ||
							csvObject[0][20] != 'ReportingManagerNm' ||
							csvObject[0][21] != 'PrevDesignation' ||
							csvObject[0][22] != 'ContactDetails' )	{
								return 'Data is not in appropriate Format.1';
						}else{
							var data = Meteor.call('companyRequestUploadEmployement',csvObject,corporateOrderId,serviceid);
							if(data){
								return data;
							}
						}
						break;
					case 'BasicVerification':
						break;
					case 'StatutoryForm':
						if(csvObject[0][0] != 'FirstName' || 
							csvObject[0][1] != 'LastName' || 
							csvObject[0][2] != 'EmailID' || 
							csvObject[0][3] != 'MobileNo' || 
							csvObject[0][4] != 'CardType' || 
							csvObject[0][5] != 'CardNumber'
						) 
						{
							return 'Data is not in appropriate Format.1';
						}else{
							var data = Meteor.call('companyRequestUploadIdentity',csvObject,corporateOrderId,serviceid);
							if(data){
								return data;
							}							
						}
						break;
					case 'ReferenceForm':
						if(csvObject[0][0] != 'FirstName' || 
							csvObject[0][1] != 'LastName' || 
							csvObject[0][2] != 'EmailID' || 
							csvObject[0][3] != 'MobileNo' || 
							csvObject[0][4] != 'AadharNumber' || 
							csvObject[0][5] != 'ReferralFirstName' || 
							csvObject[0][6] != 'ReferralLastName' || 
							csvObject[0][7] != 'ReferralMobileNum' || 
							csvObject[0][8] != 'ReferralEmailID' ||  
							csvObject[0][9] != 'ReferralOrganization' || 
							csvObject[0][10] != 'ReferralDesignation' || 
							csvObject[0][11] != 'ReferralRelationship' || 
							csvObject[0][12] != 'ReferralAssociatedSinceMonths' )	{
								return 'Data is not in appropriate Format.1';
						}else{
							var data = Meteor.call('companyRequestUploadReference',csvObject,corporateOrderId,serviceid);
							if(data){
								return data;
							}
						}
						break;
					case 'CriminalRecords':	
						if(csvObject[0][0] != 'FirstName' || 
							csvObject[0][1] != 'LastName' || 
							csvObject[0][2] != 'EmailID'  || 
							csvObject[0][3] != 'MobileNo' || 
							csvObject[0][4] != 'AadharNumber' || 
							csvObject[0][5] != 'Type of Address' || 
							csvObject[0][6] != 'Address Line1' || 
							csvObject[0][7] != 'Address Line2' || 
							csvObject[0][8] != 'Address Line3' || 
							csvObject[0][9] != 'Landmark' || 
							csvObject[0][10] != 'City' ||
							csvObject[0][11] != 'State' || 
							csvObject[0][12] != 'Country' ||  
							csvObject[0][13] != 'Pincode' || 
							csvObject[0][14] != 'Residing From' || 
							csvObject[0][15] != 'Residing To' ||
							csvObject[0][16] != 'FatherFirstName' ||
							csvObject[0][17] != 'FatherLastName' ||
							csvObject[0][18] != 'DateOfBirth' 
							)	{
								return 'Data is not in appropriate Format.1'; 
						}else{
							var data = Meteor.call('companyRequestUploadCriminal',csvObject,corporateOrderId,serviceid);
							if(data){
								return data;
							}
						}				
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
		'companyRequestUploadAddress' : function(csvObject,corporateOrderId,serviceid){
			let result = {
				failed : 0,
				faildList : [],
				errorObj      : {},
				candidateNotListed : {
					count : 0,
					notListed : [],
				},
				successCount : 0,
			};
			if(Match.test( csvObject, Array)){
				// UserSession.set("all"+corporateOrderId+"-"+serviceid, csvObject.length-2, Meteor.userId());
				var lengthCSV = csvObject.length;
				var counter   = -1;
				csvObject.map((data,index) =>{
					var innerErrorObj      = { 
	 					"rowIndex"   : 0, 
	 					"columnName" : "",
	 					"columnValue": "",
	 					"message"    : "",
	 				}
					if(index != 0 && index != lengthCSV-1){
						counter += 1;
						dataAddressValidation.validate({
							FirstName 			: data[0].trim(),
							LastName  			: data[1].trim(),
							EmailID			  	: data[2].trim(),
							MobileNo 		  	: data[3].trim(),
							AadharNumber		: data[4].trim(),
							TypeofAddress		: data[5].trim(),
							Line1			      : data[6].trim(),
							Line2			      : data[7].trim(),
							Line3			      : data[8].trim(),
							Landmark		  	: data[9].trim(),
							City			      : data[10].trim(),
							State			      : data[11].trim(), 
							Country			  	: data[12].trim(),
							Pincode			  	: data[13].trim(),
							ResidingFrom		: data[14].trim().slice(1, -1),
							ResidingTo			: data[15].trim().slice(1, -1),   
						});
						if(!dataAddressValidation.isValid()){
							result.failed = result.failed + 1;
              innerErrorObj.rowIndex      = index;
              innerErrorObj.columnName    = dataAddressValidation.validationErrors()[0].name;
              innerErrorObj.columnValue   = dataAddressValidation.validationErrors()[0].value;
					    innerErrorObj.message       = dataAddressValidation.validationErrors()[0][0].type; 
					    if (innerErrorObj.columnValue) {
					    	result.errorObj             = innerErrorObj;
						  	result.faildList.push(result.errorObj); 
					    }					    
							// result.faildList.push(index);
							// result.error.push(dataAddressValidation.validationErrors()[0]);
							// console.log('data upload error ',dataAddressValidation.validationErrors()0);
						}else{
							// console.log('in else');
							if(data[5] == 'permanent'){
								var candidateInfo = {
	                			"candidateFirstName"          	: data[0].trim(),
	                			"candidateLastName"           	: data[1].trim(),
	                			"candidateEmailId"            	: data[2].toLowerCase().trim(),
	                			"candidateMobile"             	: data[3].trim(),
	               				"candidateAadharNo"           	: data[4].trim(),
               					"candidateVerificationStatus" 	: "In Process",
			            			"candidatepaymentStatus" 	    	: "Company",
			            			"createdAt" 				        	  : new Date(),
			            			"verificationData" : [ 
			            									{
			                    								"line1" 		           	: data[6].trim(),
			                    								"line2" 		           	: data[7].trim(),
			                    								"line3" 		          	: data[8].trim(),
			                    								"landmark" 	    	      : data[9].trim(),
			                    								"city" 				          : data[10].trim(), 
			                    								"state" 			          : data[11].trim(),
			                    								"country" 			        : data[12].trim(),
			                    								"pincode" 			        : data[13].trim(),
			                    								"residingFrom" 		      : data[14].trim().slice(1, -1),
			                    								"residingTo" 		        : data[15] == "Present" ? "Present" : data[15].trim().slice(1,-1),
			                    								"verifiedStatus"	      : "In Process",
			                    								"editStatus" 			      : "Open",
			                    								"verificationType" 	    : 'permanentAddress',
			                    								"serviceRequired"       : "AddressForm",
			                    								"verificationDataStatus": "Data Entry is in progress",
			                    								"bgColor"               : "Bg-primary"
			                								}
			            								]
	              				}	
							}else{
								var candidateInfo = {
									"candidateFirstName"          	: data[0].trim(),
									"candidateLastName"           	: data[1].trim(),
									"candidateEmailId"            	: data[2].toLowerCase().trim(),
									"candidateMobile"             	: data[3].trim(),
									"candidateAadharNo"           	: data[4].trim(),
									"candidateVerificationStatus" 	: "In Process",
    								"candidatepaymentStatus" 		    : "Company",
    								"createdAt" 					          : new Date(),
    								"verificationData" : [  
    														{
            													"tempLine1" 			  : data[6].trim(),
            													"tempLine2" 			  : data[7].trim(),
            													"tempLine3" 			  : data[8].trim(),
            													"tempLandmark" 		  : data[9].trim(),
            													"tempCity" 				  : data[10].trim(),
            													"tempState" 			  : data[11].trim(),
            													"tempCountry" 			: data[12].trim(),
            													"tempPincode" 			: data[13].trim(),
            													"tempresidingFrom" 	: data[14].trim().slice(1, -1),
            													"tempresidingTo" 		: data[15] == "Present" ? "Present" : data[15].trim().slice(1,-1),
            													"verifiedStatus" 		: "In Process",
            													"editStatus" 		  	: "Open",
            													"verificationType" 	: 'currentAddress',
			                    						"serviceRequired"       : "AddressForm",
            													"verificationDataStatus" : "Data Entry is in progress",
			                    						"bgColor"               : "Bg-primary"
        													}
    													]
                				}
							}
							if(candidateInfo){
								var res = Meteor.call("updateOrderCandidateInfo",corporateOrderId,candidateInfo,serviceid);
								if(res == 'Candidate is not list in the order given by the Company'){
									result.candidateNotListed.notListed.push(index);
									result.candidateNotListed.count += 1;
								}
								// else{
        //            UserSession.set(corporateOrderId+"-"+serviceid,index,Meteor.userId());
								// }
							}
						}
					}
				});		
				if(counter == -1 ){
					return 'No data is available';
				}else{
					return result;
				}
			}else{
				return 'Data is not in appropriate Format.3';	
			}
			// return 'data';
		},
		'companyRequestUploadEducation' : function(csvObject,corporateOrderId,serviceid){
			let result = {
				failed : 0,
				faildList : [],
				candidateNotListed : {
					count : 0,
					notListed : [],
				},
				errorObj      : {},
			};
			if(Match.test(csvObject, Array)){ 
				var lengthCSV = csvObject.length;
				var counter = -1;
				csvObject.map((data,index) =>{ 
				  var innerErrorObj = { 
	 					"rowIndex"   : 0, 
	 					"columnName" : "",
	 					"columnValue": "",
	 					"message"    : "",
	 				}
					if(index != 0 && index != lengthCSV-1){
						counter += 1;
						dataEducationValidation.validate({
							FirstName					  : data[0].trim(),
							LastName					  : data[1].trim(),
							EmailID						  : data[2].trim(),
							MobileNo					  : data[3].trim(),
							AadharNumber				: data[4].trim(),
							EducationType				: uppercase(data[5].trim()),
							EducationLevel			  	: uppercase(data[6].trim()),
							EducationQualification	: data[7].trim(),
							Specialization				  : data[8].trim(),
							Grades						      : data[9].trim(),
							EducationMode				    : uppercase(data[10].trim()),
							DateAttendedFrom			  : data[11].trim().slice(1, -1),
							DateAttendedTo			  	: data[12].trim().slice(1, -1),
							CollegeName					    : data[13].trim(),
							University					    : data[14].trim(),
							CollegeAddress				  : data[15].trim(),
							City					       	  : data[16].trim(),
							State						        : data[17].trim(),
							Country						      : data[18].trim(),
							Pincode						      : data[19].trim(),
							RollNo						      : data[20].trim(),
						});
						if(!dataEducationValidation.isValid()){
							// console.log('data upload error ',dataEducationValidation.validationErrors());
							result.failed = result.failed + 1;
              innerErrorObj.rowIndex      = index;
              innerErrorObj.columnName    = dataEducationValidation.validationErrors()[0].name;
              innerErrorObj.columnValue   = dataEducationValidation.validationErrors()[0].value;
					    innerErrorObj.message       = dataEducationValidation.validationErrors()[0][0].type; 
					    if (innerErrorObj.columnValue) {
					    	result.errorObj           = innerErrorObj;
						  	result.faildList.push(result.errorObj); 
					    }		
							// console.log('in if result',result);
						}else{
							//call Meteor to update temporder
							var candidateInfo = {
					              "candidateFirstName"          	: data[0].trim(),
					              "candidateLastName"           	: data[1].trim(),
					              "candidateEmailId"            	: data[2].toLowerCase().trim(),
					              "candidateMobile"             	: data[3].trim(),
					              "candidateAadharNo"           	: data[4].trim(),
					              "candidateVerificationStatus" 	: "In Process",
						            "candidatepaymentStatus" 	     	: "Company",
						            "createdAt" 					: new Date(),
						            "verificationData" : [ 
						            	{
						                    "educationLevel" 			    : uppercase(data[6].trim()),
						                    "educationQualification" 	: data[7].trim(),
						                    "specialization" 			    : data[8].trim(),
						                    "grades" 				          : data[9].trim(),
						                    "educationMode" 			    : uppercase(data[10].trim()),
						                    "dateAttendedFrom" 			  : data[11].trim().slice(1, -1),
						                    "dateAttendedTo" 			    : data[12] == "Present" ? "Present" : data[12].trim().slice(1, -1),
						                    "collegeName" 				    : data[13].trim(),
						                    "university" 				      : data[14].trim(),
						                    "collegeAddress" 			    : data[15].trim(),
						                    "city"			 			        : data[16].trim(),
						                    "state"			 			        : data[17].trim(),
						                    "country"			 		        : data[18].trim(),
						                    "pincode"			 		        : data[19].trim(),
						                    "rollNo"			 		        : data[20].trim(),
						                    "verifiedStatus" 			    : "In Process",
						                    "editStatus" 				      : "Open",
						                    "verificationType" 			  : 'education',
			                    			"serviceRequired"         : "EducationForm",
						                    "verificationDataStatus" 	: "Data Entry is in progress",
			                    			"bgColor"                 : "Bg-primary"
						                }
						            ]
					        }

					      if(candidateInfo){
								var res = Meteor.call("updateOrderCandidateInfo",corporateOrderId,candidateInfo,serviceid);
								if(res == 'Candidate is not list in the order given by the Company'){
									result.candidateNotListed.notListed.push(index);
									result.candidateNotListed.count += 1;
									
								}
							}
						}
					}
				});
				if(counter == -1 ){
					return 'No data is available';
				}else{
					return result;
				}
			}else{
				return 'Data is not in appropriate Format.3';	
			}
		},
		'companyRequestUploadEmployement' : function(csvObject,corporateOrderId,serviceid){
			let result = {
				failed : 0,
				faildList : [],
				candidateNotListed : {
					count : 0,
					notListed : [],
				},
				errorObj      : {},
			};
			if(Match.test( csvObject, Array)){
				var lengthCSV = csvObject.length;
				var counter = -1;
				csvObject.map((data,index) =>{
					var innerErrorObj  = { 
		 					"rowIndex"   : 0, 
		 					"columnName" : "",
		 					"columnValue": "",
		 					"message"    : "",
		 				}
					if(index != 0 && index != lengthCSV-1){
						counter += 1;
						dataEmployementValidation.validate({
							FirstName				      : data[0].trim(),
							LastName				      : data[1].trim(),
							EmailID				        : data[2].trim(),
							MobileNo				      : data[3].trim(),
							AadharNumber			    : data[4].trim(),
							NameOfEmployer        : data[5].trim(),
							EmployerAddress      	: data[6].trim(),
							City             	  	: data[7].trim(),
							State            	   	: data[8].trim(),
							ContactNo            	: data[9].trim(),
							EmployeeCode         	: data[10].trim(),
							Designation          	: data[11].trim(),
							Department           	: data[12].trim(),
							EmploymentFrom       	: data[13].trim().slice(1, -1),
							EmploymentTo         	: data[14].trim().slice(1, -1),
							LastSalaryDrawn      	: data[15].trim(),
							TypeOfEmployement     : uppercase(data[16].trim()),
							DetailOfAgency       	: data[17].trim(),
							ReasonOfLeaving       : data[18].trim(),
							DutiesAndResponsibilites : data[19].trim(),
							ReportingManagerNm    : data[20].trim(),
							PrevDesignation      	: data[21].trim(),
							ContactDetails		    : data[22].trim(),
						});
						if(!dataEmployementValidation.isValid()){
							result.failed = result.failed + 1;
              innerErrorObj.rowIndex      = index;
              innerErrorObj.columnName    = dataEmployementValidation.validationErrors()[0].name;
              innerErrorObj.columnValue   = dataEmployementValidation.validationErrors()[0].value;
					    innerErrorObj.message       = dataEmployementValidation.validationErrors()[0][0].type; 
					    if (innerErrorObj.columnValue) {
					    	result.errorObj           = innerErrorObj;
							  result.faildList.push(result.errorObj);
					    }
							// console.log('in if result',result);
							// console.log('data upload error ',dataEmployementValidation.validationErrors());
						}else{
							var candidateInfo = {
		            "candidateFirstName"          	: data[0].trim(),
		            "candidateLastName"           	: data[1].trim(),
		            "candidateEmailId"            	: data[2].toLowerCase().trim(), 			        
		            "candidateMobile"             	: data[3].trim(),
		            "candidateAadharNo"           	: data[4].trim(),
		            "candidateVerificationStatus" 	: "In Process",
		            "candidatepaymentStatus" 		    : "Company",
		            "createdAt" 					          : new Date(),
		            "verificationData" : [ 
												            	{
												            		 "nameOfEmployer"           : data[5].trim(),
																	       "employerAddress"          : data[6].trim(),
																	       "employerCity"             : data[7].trim(),
																	       "employerState"            : data[8].trim(),
																	       "contactNo"                : data[9].trim(),
																	       "employeeCode"             : data[10].trim(),
																	       "designation"              : data[11].trim(),
																	       "department"               : data[12].trim(),
																	       "employmentFrom"           : data[13].trim().slice(1, -1),
																	       "employmentTo"             : data[14] == "Present" ? "Present" : data[14].trim().slice(1, -1),
																	       "lastSalaryDrawn"          : data[15].trim(),
																	       "typeOfEmployement"        : uppercase(data[16].trim()), 
																	       "detailOfAgency"           : data[17].trim(),
																	       "reasonOfLeaving"          : data[18].trim(),
																	       "dutiesAndResponsibilites" : data[19].trim(),
																	       "reportingManagerNm"       : data[20].trim(),
																	       "prevDesignation"          : data[21].trim(),
																	       "contactDetails"           : data[22].trim(),
																				 "verifiedStatus" 	        : "In Process",
																				 "editStatus" 		      	  : "Open",
																				 "verificationType"     	  : "employement",
			                              		 "serviceRequired"          : "WorkForm",
																				 "verificationDataStatus"   : "Data Entry is in progress",
			                    							 "bgColor"                  : "Bg-primary"
													             }
		            ]
		          }
		          if(candidateInfo){
								var res = Meteor.call("updateOrderCandidateInfo",corporateOrderId,candidateInfo,serviceid);
								if(res == 'Candidate is not list in the order given by the Company'){
									result.candidateNotListed.notListed.push(index);
									result.candidateNotListed.count += 1;
								}
							}
						}
					}
				});
				if(counter == -1 ){
					return 'No data is available';
				}else{
					return result;
				}
			}else{
				return 'Data is not in appropriate Format.3';	
			}
		},
		'companyRequestUploadIdentity' : function(csvObject,corporateOrderId,serviceid){
			let result = {
				failed : 0,
				faildList : [],
				candidateNotListed : {
					count : 0,
					notListed : [],
				},
				errorObj      : {},
			};
				if(Match.test( csvObject, Array)){
					var lengthCSV = csvObject.length;
					var counter = -1;
					csvObject.map((data,index) =>{
						var innerErrorObj  = { 
		 					"rowIndex"   : 0, 
		 					"columnName" : "",
		 					"columnValue": "",
		 					"message"    : "",
		 				}
						if(index != 0 && index != lengthCSV-1){
							counter += 1;
							dataIdentityValidation.validate({
								FirstName					      : data[0].trim(),
								LastName					      : data[1].trim(),
								EmailID				      		: data[2].trim(),
								MobileNo					      : data[3].trim(),
								Type							      : data[4].trim(),
								CardNumber 						  : data[5].trim()
							});
							if(!dataIdentityValidation.isValid()){
								result.failed = result.failed + 1;
                innerErrorObj.rowIndex      = index;
                innerErrorObj.columnName    = dataIdentityValidation.validationErrors()[0].name;
                innerErrorObj.columnValue   = dataIdentityValidation.validationErrors()[0].value;
						    innerErrorObj.message       = dataIdentityValidation.validationErrors()[0][0].type; 
						    if (innerErrorObj.columnValue) {
						    	result.errorObj             = innerErrorObj;
							  	result.faildList.push(result.errorObj); 
						    }	
							}else{
								var candidateInfo = {
		              	  "candidateFirstName"          	: data[0].trim(),
		            			"candidateLastName"           	: data[1].trim(),
											"candidateEmailId"            	: data[2].toLowerCase().trim(), 			        
											"candidateMobile"             	: data[3].trim(),
											"candidateVerificationStatus" 	: "In Process",
		            			"candidatepaymentStatus" 		    : "Company",
			            		"createdAt" 					          : new Date(),
											"verificationData" 				      : []
								};
								// 'Ration' || this.value == 'Passport' || this.value == 'Voting')){	
								var verificationDt = {                     
									"cardNo"            		: data[5].trim(),            
									"proofOfDocument"   		: '',            
									"fileExt"           		: '',            
									"fileName"          		: '',            
									"proofOfDocument2"  		: '',            
									"fileExt2"          		: '',            
									"fileName2"         		: '',            
									"serviceRequired"   		 : "StatutoryForm", 
									"verifiedStatus" 	     	 : "In Process",
			            "editStatus" 		         : "Open",
					  			"verificationType"     	 : "Identity",
			            "serviceRequired"        : "StatutoryForm",
		  						"verificationDataStatus" : "Data Entry is in progress",  
		  						"bgColor"                : "Bg-primary"
								}	
								if(verificationDt){
									switch(data[4]){
										case 'PAN' 	:
											verificationDt.identityType = "Pan Card";
											break; 
										case 'Aadhar':
											verificationDt.identityType = "Aadhar Card";
											break;
										case 'Driving':
											verificationDt.identityType = "Driving License";
											break;
										case 'Ration' :
											verificationDt.identityType = "Ration Card";
											break;
										case 'Passport' :
											verificationDt.identityType = "Passport";
											break;
										case 'Voting' :
											verificationDt.identityType = "Voting Card";
											break;
										default:
											verificationDt.identityType = "";
											break;
									}
									
									if(verificationDt.identityType){
										candidateInfo.verificationData.push(verificationDt);
									}
		              if(candidateInfo.verificationData.length > 0){              	
						     		var res = Meteor.call("updateOrderCandidateInfo",corporateOrderId,candidateInfo,serviceid);
										if(res == 'Candidate is not list in the order given by the Company'){
											result.candidateNotListed.notListed.push(index);
											result.candidateNotListed.count += 1;
										}
									}	
								}									
							}
						}
					}); 
		      if(counter == -1 ){
						return 'No data is available';
					}else{
						return result;
					}
				}else{
					return 'Data is not in appropriate Format.3';	
				}
		},
		'companyRequestUploadReference' : function(csvObject,corporateOrderId,serviceid){
			let result = { 
				failed : 0,
				faildList : [],
				errorObj      : {},
				candidateNotListed : {
					count : 0,
					notListed : [],
				},
				successCount : 0,
			};
			if(Match.test( csvObject, Array)){
				var lengthCSV = csvObject.length;
				var counter   = -1;
				csvObject.map((data,index) =>{
					var innerErrorObj      = { 
	 					"rowIndex"   : 0, 
	 					"columnName" : "",
	 					"columnValue": "",
	 					"message"    : "",
	 				}
					if(index != 0 && index != lengthCSV-1){
						counter += 1;
						dataReferenceValidation.validate({
							FirstName 							  : data[0].trim(),
							LastName  							  : data[1].trim(),
							EmailID			  					  : data[2].trim(),
							MobileNo 		  					  : data[3].trim(),
							AadharNumber						  : data[4].trim(),
							ReferralFirstName					: data[5].trim(),
							ReferralLastName    			: data[6].trim(),
							ReferralMobileNum    			: data[7].trim(),
							ReferralEmailID	     			: data[8].trim(),
							ReferralOrganization			: data[9].trim(),
							ReferralDesignation    		: data[10].trim(),
							ReferralRelationship   		: data[11].trim(), 
							ReferralAssociatedSinceMonths : data[12].trim(),
						});
						if(!dataReferenceValidation.isValid()){
							result.failed = result.failed + 1;
              	innerErrorObj.rowIndex      = index;
           			innerErrorObj.columnName    = dataReferenceValidation.validationErrors()[0].name;
         				innerErrorObj.columnValue   = dataReferenceValidation.validationErrors()[0].value;
					    	innerErrorObj.message       = dataReferenceValidation.validationErrors()[0][0].type; 
					    	if (innerErrorObj.columnValue) {
					    		result.errorObj             = innerErrorObj;
						  		result.faildList.push(result.errorObj); 
					    	}					    
							// result.faildList.push(index);
							// result.error.push(dataAddressValidation.validationErrors()[0]);
							// console.log('data upload error ',dataAddressValidation.validationErrors()0);
						}else{
							// console.log('in else');
							var candidateInfo = {
                		  "candidateFirstName"          	: data[0].trim(),
                			"candidateLastName"           	: data[1].trim(),
                			"candidateEmailId"            	: data[2].toLowerCase().trim(),
                 			"candidateMobile"             	: data[3].trim(), 
               				"candidateAadharNo"           	: data[4].trim(),
             					"candidateVerificationStatus" 	: "In Process",
		            			"candidatepaymentStatus" 		    : "Company",
		            			"createdAt" 				        	  : new Date(),
		            			"verificationData" : [ 
        									{
        										"referralFirstName"					    : data[5].trim(),
										     	  "referralLastName"    			    : data[6].trim(),
											      "referralMobileNum"    			    : data[7].trim(),
											      "referralEmailID"	    			    : data[8].trim(),
										       	"referralOrganization"				  : data[9].trim(), 
										      	"referralDesignation"    			  : data[10].trim(),
											      "referralRelationship"   			  : data[11].trim(), 
										       	"referralAssociatedSinceMonths" : data[12].trim(),
            								"verifiedStatus"				      	: "In Process",
            								"editStatus" 						        : "Open",
            								"verificationType" 	    			  : 'reference',
			                      "serviceRequired"               : "ReferenceForm",
            								"verificationDataStatus"			  : "Data Entry is in progress",
			                    	"bgColor"                       : "Bg-primary",
            								"documents"                     : [],
            							}
        								]
              				}	
              				
							if(candidateInfo){
								var res = Meteor.call("updateOrderCandidateInfo",corporateOrderId,candidateInfo,serviceid);
								if(res == 'Candidate is not list in the order given by the Company'){
									result.candidateNotListed.notListed.push(index);
									result.candidateNotListed.count += 1;
								}
							}
						}
					}
				});		
				if(counter == -1 ){
					return 'No data is available';
				}else{
					return result;
				}
			}else{
				return 'Data is not in appropriate Format.3';	
			}
			// return 'data';
		},
    'companyRequestUploadCriminal' : function(csvObject,corporateOrderId,serviceid){
			let result = {
				failed : 0,
				faildList : [],
				errorObj      : {},
				candidateNotListed : {
					count : 0,
					notListed : [],
				},
				successCount : 0,
			};
			if(Match.test( csvObject, Array)){
				var lengthCSV = csvObject.length;
				var counter   = -1;
				csvObject.map((data,index) =>{
					var innerErrorObj      = { 
	 					"rowIndex"   : 0, 
	 					"columnName" : "",
	 					"columnValue": "",
	 					"message"    : "",
	 				}
					if(index != 0 && index != lengthCSV-1){
						counter += 1;
						dataCriminalValidation.validate({
							FirstName 			: data[0].trim(),
							LastName  			: data[1].trim(),
							EmailID			  	: data[2].trim(),
							MobileNo 		  	: data[3].trim(),
							AadharNumber		: data[4].trim(),
							TypeofAddress		: data[5].trim(),
							Line1			      : data[6].trim(),
							Line2			      : data[7].trim(),
							Line3			      : data[8].trim(),
							Landmark		  	: data[9].trim(),
							City			      : data[10].trim(),
							State			      : data[11].trim(), 
							Country			  	: data[12].trim(),
							Pincode			  	: data[13].trim(),
							ResidingFrom		: data[14].trim().slice(1, -1),
							ResidingTo			: data[15].trim().slice(1, -1),
							FatherFirstName : data[16].trim(),
							FatherLastName  : data[17].trim(),
							DateOfBirth     : data[18].trim().slice(1,-1),
						});
						if(!dataCriminalValidation.isValid()){
							result.failed = result.failed + 1;
              innerErrorObj.rowIndex      = index;
              innerErrorObj.columnName    = dataCriminalValidation.validationErrors()[0].name;
              innerErrorObj.columnValue   = dataCriminalValidation.validationErrors()[0].value;
					    innerErrorObj.message       = dataCriminalValidation.validationErrors()[0][0].type; 
					    if (innerErrorObj.columnValue) {
					    	result.errorObj           = innerErrorObj;
						  	result.faildList.push(result.errorObj); 
					    }					    
							// result.faildList.push(index);
							// result.error.push(dataAddressValidation.validationErrors()[0]);
							// console.log('data upload error ',dataAddressValidation.validationErrors()0);
						}else{
							// console.log('in else');
							if(data[5] == 'permanent'){
								var candidateInfo = {
	                			"candidateFirstName"          	: data[0].trim(),
	                			"candidateLastName"           	: data[1].trim(),
	                			"candidateEmailId"            	: data[2].toLowerCase().trim(),
	                			"candidateMobile"             	: data[3].trim(),
	               				"candidateAadharNo"           	: data[4].trim(),
               					"candidateVerificationStatus" 	: "In Process",
			            			"candidatepaymentStatus" 		    : "Company",
			            			"createdAt" 				        	  : new Date(),
			            			"verificationData" : [ 
          									{
                  								"line1" 			: data[6].trim(),
                  								"line2" 			: data[7].trim(),
                  								"line3" 			: data[8].trim(),
                  								"landmark" 	  : data[9].trim(),
                  								"city" 				: data[10].trim(), 
                  								"state" 			: data[11].trim(),
                  								"country" 			  : data[12].trim(),
                  								"pincode" 			  : data[13].trim(),
                  								"residingFrom" 		: data[14].trim().slice(1, -1),
                  								"residingTo" 	   	: data[15] == "Present" ? "Present" : data[15].trim().slice(1,-1),
                  								"fatherFirstName" : data[16].trim(),
                  								"fatherLastName"  : data[17].trim(),
                  								"dateOfBirth"     : data[18].trim().slice(1,-1),
                  								"verifiedStatus"	: "In Process",
                  								"editStatus" 			: "Open",
                  								"verificationType" 	    : 'permanentAddress',
			                            "serviceRequired"       : "AddressForm",
                  								"verificationDataStatus": "Data Entry is in progress",
			                    				"bgColor"               : "Bg-primary",
                  								"documents"             : [],
              								}
          								]
	              				}	
							}else{
								var candidateInfo = {
									"candidateFirstName"          	: data[0].trim(),
									"candidateLastName"           	: data[1].trim(),
									"candidateEmailId"            	: data[2].toLowerCase().trim(),
									"candidateMobile"             	: data[3].trim(),
									"candidateAadharNo"           	: data[4].trim(),
									"candidateVerificationStatus" 	: "In Process",
    							"candidatepaymentStatus" 		    : "Company",
    							"createdAt" 					          : new Date(),
  								"verificationData" : [  
										{
													"tempLine1" 			  : data[6].trim(),
													"tempLine2" 			  : data[7].trim(),
													"tempLine3" 			  : data[8].trim(),
													"tempLandmark" 		  : data[9].trim(),
													"tempCity" 				  : data[10].trim(),
													"tempState" 			  : data[11].trim(),
													"tempCountry" 			: data[12].trim(),
													"tempPincode" 			: data[13].trim(),
													"tempresidingFrom" 	: data[14].trim().slice(1, -1),
													"tempresidingTo" 		: data[15] == "Present" ? "Present" : data[15].trim().slice(1,-1),
													"fatherFirstName"   : data[16].trim(),
          								"fatherLastName"    : data[17].trim(),
          								"dateOfBirth"       : data[18].trim().slice(1,-1),
													"verifiedStatus" 		: "In Process",
													"editStatus" 		  	: "Open",
													"verificationType" 	: 'currentAddress',
			                    "serviceRequired"       : "AddressForm",
													"verificationDataStatus" : "Data Entry is in progress",
			                     "bgColor"               : "Bg-primary",
													 "documents"             : [],
											}
									]
                }
							}
							if(candidateInfo){
								var res = Meteor.call("updateOrderCandidateInfo",corporateOrderId,candidateInfo,serviceid);
								if(res == 'Candidate is not list in the order given by the Company'){
									result.candidateNotListed.notListed.push(index);
									result.candidateNotListed.count += 1;
								}
							}
						}
					}
				});		
				if(counter == -1 ){
					return 'No data is available';
				}else{
					return result;
				}
			}else{
				return 'Data is not in appropriate Format.3';	
			}
			// return 'data';
		},


		/**Update ticket and order status to terminate */
		'terminateTicketOrder':function(allDetailsElem){
			console.log("allDetailsElem :",allDetailsElem);
			var userDetails = Meteor.users.findOne({"_id":allDetailsElem.userId});
			if(userDetails){
				var userName = userDetails.profile.firstname +" "+userDetails.profile.lastname;  
			}
			var insertData={      
				"userId" : allDetailsElem.userId,
				"userName" : userName,
				"allocatedToUserid" : "",
				"allocatedToUserName" : "",
				"role" : "data entry operator",
				"roleStatus" : "Terminate",
				"msg" : allDetailsElem.terminateReason,
				"createdAt" : new Date(),
				"tatDate" : ""    
			}
			/**Update ticket status to terminate*/
			TicketMaster.update(
				{'_id':allDetailsElem.ticketId},
				{
					$push:{
						'ticketElement' : insertData,
					},
					$set:{
						'ticketStatus': "Terminate"
					}
				}
			)
			/**To update perticular ticket status in order tabel do following things*/
			var updateTicket = Order.update(
				{"_id":allDetailsElem.orderId, "candidateDetails.candidateId" : allDetailsElem.candidateId},
				{
					$set:{
						["candidateDetails.$.verificationData."+allDetailsElem.verificationId+".ticketDetails.status"] : "Terminate",
						["candidateDetails.$.verificationData."+allDetailsElem.verificationId+".ticketDetails.terminationReason"]  : allDetailsElem.terminateReason,
						
					}
				}
			);
			return updateTicket;
		}
	});
}