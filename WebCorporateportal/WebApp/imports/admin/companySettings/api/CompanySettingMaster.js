import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const CompanySettings = new Mongo.Collection('companySetting');

if(Meteor.isServer){
  Meteor.publish('companyData',()=>{
    return CompanySettings.find({});
   });
  
}

Meteor.methods({

  'insertCompanyInfo':function(companyInfoFormValue){
    //Insert into collection 

    if(companyInfoFormValue.logoFilename == ''){
      var logoFilename = '';
    }else{
      var logoFilename = companyInfoFormValue.logoFilename;
    }
    
    var count = CompanySettings.find({'companyId':1}).count();

      if(count){
      CompanySettings.update(
      {"companyId"    : 1},
      {$set:
        {
          "companyName"          : companyInfoFormValue.companyName,
          "companyContactNumber" : companyInfoFormValue.companyContactNumber,
          "companyMobileNumber"  : companyInfoFormValue.companyMobileNumber,
          "companyEmail"         : companyInfoFormValue.companyEmail,
          "companyAltEmail"      : companyInfoFormValue.companyAltEmail,
          "logoFilename"         : logoFilename,
          "companyUniqueID"      : companyInfoFormValue.companyUniqueID,
          "companyLogo"          : companyInfoFormValue.companyLogo,
          "companyLocationsInfo" : [{
                                  "mainLocation"     : "Headoffice",
                                  "companyAddress"   : companyInfoFormValue.companyAddress,
                                  "companyPincode"   : companyInfoFormValue.companyPincode,
                                  "companyCity"      : companyInfoFormValue.companyCity,
                                  "companyState"     : companyInfoFormValue.companyState,
                                  "companyCountry"   : companyInfoFormValue.companyCountry,
                                  }],
        }
      }

    );
    }else{
      CompanySettings.insert({
        "companyId"            : 1,
        "companyName"          : companyInfoFormValue.companyName,
        "companyContactNumber" : companyInfoFormValue.companyContactNumber,
        "companyMobileNumber"  : companyInfoFormValue.companyMobileNumber,
        "companyEmail"         : companyInfoFormValue.companyEmail,
        "companyAltEmail"      : companyInfoFormValue.companyAltEmail,
        "logoFilename"         : logoFilename,
        "companyUniqueID"      : companyInfoFormValue.companyUniqueID,
        "companyLogo"          : companyInfoFormValue.companyLogo,
        "companyLocationsInfo" : [{
                                  "mainLocation"     : "Headoffice",
                                  "companyAddress"   : companyInfoFormValue.companyAddress,
                                  "companyPincode"   : companyInfoFormValue.companyPincode,
                                  "companyCity"      : companyInfoFormValue.companyCity,
                                  "companyState"     : companyInfoFormValue.companyState,
                                  "companyCountry"   : companyInfoFormValue.companyCountry,
                                }],
      });
    }
    Meteor.call('tempLogoImageDelete',companyInfoFormValue.logoFilename);


  },

  'insertCompanyLocations':function(companyLocationFormValue){
      var userId = CompanySettings.findOne({"companyId" : 1});
      if(userId){     
        CompanySettings.update({"companyId" : 1},
          {$push:{ companyLocationsInfo : {
              companyLocation: companyLocationFormValue.companyLocation,
              companyAddress : companyLocationFormValue.companyAddress,
              companyPincode : companyLocationFormValue.companyPincode,
              companyCity    : companyLocationFormValue.companyCity,
              companyState   : companyLocationFormValue.companyState,
              companyCountry : companyLocationFormValue.companyCountry,
              
              }
            }
        });
      }
    
  },
  removeCompanyLocation: function(targetedID){
      CompanySettings.update({'companyId': 1}, {$unset : {['companyLocationsInfo.'+targetedID] : 1}});
      CompanySettings.update({'companyId': 1}, {$pull : {'companyLocationsInfo' : null}});
      
  },

  'updateCompanyLocations':function(companyLocationFormValue){
    var companyData = CompanySettings.findOne({"companyId" : 1});
    
    if(companyData){
      CompanySettings.update({'_id' : companyData._id, 'companyLocationsInfo.companyAddress':companyLocationFormValue.companyAddress },
          {$set: {
              'companyLocationsInfo.$.companyLocation': companyLocationFormValue.companyLocation,
              'companyLocationsInfo.$.companyAddress' : companyLocationFormValue.companyAddress,
              'companyLocationsInfo.$.companyPincode' : companyLocationFormValue.companyPincode,
              'companyLocationsInfo.$.companyCity'    : companyLocationFormValue.companyCity,
              'companyLocationsInfo.$.companyState'   : companyLocationFormValue.companyState,
              'companyLocationsInfo.$.companyCountry' : companyLocationFormValue.companyCountry,
              
              }
            }
        );

    }
    

  },

  'updateBankDetails':function(companyBankDetailsFormValue){
    
    var companyData = CompanySettings.findOne({"companyId" : 1});
    if(companyData){
      
      CompanySettings.update({'_id': companyData._id,'bankDetails.ifscCode':companyBankDetailsFormValue.ifscCode},
        {$set:{ 
          'bankDetails.$.accHolderName':companyBankDetailsFormValue.accHolderName,
          'bankDetails.$.bankName'   : companyBankDetailsFormValue.bankName,
          'bankDetails.$.branchName'   : companyBankDetailsFormValue.branchName,
          'bankDetails.$.accNumber'  : companyBankDetailsFormValue.accNumber,
          'bankDetails.$.ifscCode'   : companyBankDetailsFormValue.ifscCode,
            
            
          }
        });
    } //end of if companyData
  },

  removeBankDetails: function(targetedID){
      CompanySettings.update({'companyId': 1}, {$unset : {['bankDetails.'+targetedID] : 1}});
      CompanySettings.update({'companyId': 1}, {$pull : {'bankDetails' : null}});
      
    },
  

  'insertCompanyBankDetails':function(companyBankDetailsFormValue){
    
    
    var companyData = CompanySettings.findOne({"companyId" : 1});
    if(companyData){
        CompanySettings.update({'_id': companyData._id},
          {$push:{ bankDetails : {
              accHolderName : companyBankDetailsFormValue.accHolderName,
              bankName      : companyBankDetailsFormValue.bankName,
              branchName    : companyBankDetailsFormValue.branchName,
              accNumber     : companyBankDetailsFormValue.accNumber,
              ifscCode      : companyBankDetailsFormValue.ifscCode,
              
              }
            }
          });
    } //end of if companyData
  },


  'insertTaxSettings':function(taxSettingsFormValue){
    
    
    // Refer http://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off

    //First find previous day of FromDate. 
    //Update Previous Record for same TaxType. Put ToDate = 1 Day prior to FromDate
    var userId = CompanySettings.findOne({"companyId" : 1});
    if(userId){
      // var fromDate1 = taxSettingsFormValue.effectiveFrom.replace(/-/g, '\/');
      // var toDateForPreviousRecordISOFormat = new Date(new Date(fromDate1) - (24*60*60*1000) );
      // var formateddate = new Date(toDateForPreviousRecordISOFormat);
      
      // //Convert ISO Date in to only date format 2016-06-11
      // var toDateForPreviousRecord = formateddate.getFullYear()+'-' + (formateddate.getMonth()+1) + '-'+formateddate.getDate();
      var fromDate1 = taxSettingsFormValue.effectiveFrom;
      var toDateForPreviousRecord =  moment(fromDate1).subtract(1, "days").format("YYYY-MM-DD");

      var queryResult = CompanySettings.find({'_id': userId._id, 
            'taxSettings.taxType'     : taxSettingsFormValue.taxType , 
            'taxSettings.effectiveTo' : '',}).count();  
      
      
        if(queryResult){
        CompanySettings.update({'taxSettings':
                      {
                        $elemMatch:
                        { 
                          'taxType' : taxSettingsFormValue.taxType , 
                            'effectiveTo' : "",
                          }
                    }
          },
          {$set:{ 
              'taxSettings.$.effectiveTo' : toDateForPreviousRecord,
              
              }
          },
        );

        CompanySettings.update({'_id': userId._id},
          {$push:{ taxSettings :{

              taxType       : taxSettingsFormValue.taxType,
              applicableTax : taxSettingsFormValue.applicableTax,
              effectiveFrom : taxSettingsFormValue.effectiveFrom,
              effectiveTo   : '',
              createdAt     : new Date(),
            }
          }
        },
        );

      }else{
        
        CompanySettings.update({'_id': userId._id},
          {$push:{ taxSettings :{

              taxType       : taxSettingsFormValue.taxType,
              applicableTax : taxSettingsFormValue.applicableTax,
              effectiveFrom : taxSettingsFormValue.effectiveFrom,
              effectiveTo   : '',
              createdAt     : new Date(),
            }
          }
        },
        );
      }
      }
    },
    
    removeTaxDetails: function(targetedID){
         CompanySettings.update({'companyId': 1}, {$unset : {['taxSettings.'+targetedID] : 1}});
         CompanySettings.update({'companyId': 1}, {$pull : {'taxSettings' : null}});
      
      },
  

    'updatetaxSettings':function(taxSettingsFormValue,targetedID){
  
      var companyData = CompanySettings.findOne({"companyId" : 1});
      if(companyData){
        var fromDate1 = taxSettingsFormValue.effectiveFrom.replace(/-/g, '\/');
        var toDateForPreviousRecordISOFormat = new Date(new Date(fromDate1) - (24*60*60*1000) );
        var formateddate = new Date(toDateForPreviousRecordISOFormat);
      
        var toDateForPreviousRecord = formateddate.getFullYear()+'-' + (formateddate.getMonth()+1) + '-'+formateddate.getDate();
        var queryResult = CompanySettings.find({'_id': companyData._id, 
              'taxSettings.taxType' : taxSettingsFormValue.taxType }).count();  
    
      
        CompanySettings.update({'_id': companyData._id, 'taxSettings.taxType':taxSettingsFormValue.taxType},
          {$set:{
              ['taxSettings.'+targetedID+'.taxType']       :taxSettingsFormValue.taxType,
              ['taxSettings.'+targetedID+'.applicableTax'] : taxSettingsFormValue.applicableTax,
              ['taxSettings.'+targetedID+'.effectiveFrom'] : taxSettingsFormValue.effectiveFrom,
              
            
          }
        },
        );

      }
  },

  'insertMaxTicketAllocate':function(formValues){
    CompanySettings.update({'companyId': 1},
          {$push:{ maxnoOfTicketAllocate :{

            maxTicketAllocate : formValues.maxTicketAllocate,
            role              : formValues.role,
              
            }
          }
        },
        );
  },
  
  "updateAllocatedTicket":function (formValues,targetedID) {
     // console.log('maxnoOfTicketAllocate.'+targetedID+'.maxTicketAllocate');
    CompanySettings.update({'companyId': 1},
       {$set:{ 
              ['maxnoOfTicketAllocate.'+targetedID+'.maxTicketAllocate'] : formValues.maxTicketAllocate , 
              ['maxnoOfTicketAllocate.'+targetedID+'.role'] : formValues.role , 
           }
         },
      );  
  },
  "removeAllocatedTickets":function (targetedID) {
    CompanySettings.update({'companyId': 1}, {$unset : {['maxnoOfTicketAllocate.'+targetedID] : 1}});
    CompanySettings.update({'companyId': 1}, {$pull : {'maxnoOfTicketAllocate' : null}});
  },
  'removeCompanyImage':function(id,link){
    CompanySettings.update(
      {'_id':id},
      {
        $unset:{'companyLogo':link}
      }
    )
  }

  
});