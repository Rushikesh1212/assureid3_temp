import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const CodeAndReason = new Mongo.Collection("codeAndReason");

if(Meteor.isServer){
   Meteor.publish('codeAndReason',()=>{
       return CodeAndReason.find({});
   });
   Meteor.publish('singleCodeAndReason',(id)=>{ 
       return CodeAndReason.find({"_id":id});
   });   

	 Meteor.methods({
	 	 	'createField':function(code,reason){
    		CodeAndReason.insert({
          'code'    : code,
          'reason'  : reason,
          'createdAt'      : new Date(),
    		}); 
      },
      'updateField':function(id,code,reason){
        CodeAndReason.update({"_id":id},
          {$set:{
            'code'     : code,
            'reason'   : reason,
          }});
      },
      'deleteField':function(id){
        CodeAndReason.remove({"_id":id});
      },
	 });

}
