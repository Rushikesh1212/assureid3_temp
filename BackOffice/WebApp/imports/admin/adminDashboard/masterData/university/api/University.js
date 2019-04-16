import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const University = new Mongo.Collection("university");

if(Meteor.isServer){
   Meteor.publish('university',()=>{
       return University.find({});
   });
   Meteor.publish('singleuniversity',(id)=>{
       return University.find({"_id":id});
   });   

	 Meteor.methods({
	 	 	'createUniversity':function(UniversityName,UniversityStatus){
    		University.insert({
          'UniversityName' : UniversityName,
          'UniversityStatus' : UniversityStatus,
          'createdAt'       : new Date(),
    		});  
      },
      'updateUniversity':function(id,UniversityName,UniversityStatus){
        University.update({"_id":id},{$set:{'UniversityName'  : UniversityName,'UniversityStatus'  : UniversityStatus}});
      },
      'deleteUniversity':function(id){
        University.remove({"_id":id});
      }
	 });

}
