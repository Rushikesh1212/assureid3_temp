import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const GeneratedReport = new Mongo.Collection("generatedreport");

if(Meteor.isServer){
    Meteor.publish('allGeneratedReport',()=>{
        return GeneratedReport.find({});
    });
    Meteor.publish('singleGeneratedReport',(_id)=>{
        return GeneratedReport.find({"_id" : _id});
    });
   Meteor.methods({
   	 'insertGeneratedReport':function(formvalue) {
   	     var id  = GeneratedReport.insert({formvalue},(error, result)=>{
             if (error) {
                return error;
             }else{
             	 return result;
             }
          });

      return id;
   	 }
   });

}