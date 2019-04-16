import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const College = new Mongo.Collection("college");

if(Meteor.isServer){
   Meteor.publish('college',()=>{
       return College.find({});
   });
   Meteor.publish('singlecollege',(id)=>{
       return College.find({"_id":id});
   });   

	 Meteor.methods({
	 	 	'createCollegeData':function(collegeName,universityName,collegeStatus){
    		College.insert({
          'collegeName'    : collegeName,
          'universityName' : universityName,
          'collegeStatus'  : collegeStatus,
          'createdAt'      : new Date(),
    		}); 
      },
      'updateCollegeData':function(id,collegeName,universityName,collegeStatus){
        College.update({"_id":id},
          {$set:{
            'collegeName'     : collegeName,
            'universityName'  : universityName,
            'collegeStatus'   : collegeStatus,
          }});
      },
      'deleteCollege':function(id){
        College.remove({"_id":id});
      }
	 });

}
