import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Notification = new Mongo.Collection('notification');
export const SMS = new Mongo.Collection('sms');

if(Meteor.isServer){

  Meteor.startup(() => {
    Notification._ensureIndex({ "toUserId": 1});
  });
  
  Meteor.publish('notification',function notification(){
      return Notification.find({});
  });

   Meteor.publish('sms',function sms(){
      return SMS.find({});
  });

  Meteor.publish('userNotification',function userNotification(){
    return Notification.find({"toUserId": Meteor.userId(),  "event": { $exists: true, $ne: null } });
  });
  
  // Meteor.publish('userNotification',function userNotification(){
  //   return Notification.find({"toUserId": Meteor.userId(),  "event": { $exists: true, $ne: null } });
  // });
}

Meteor.methods({
 'insertNotification' : function(eventName,toMailId,toUserId,notifBody,ticketId){
        console.log("Notification.js :",eventName,toMailId,toUserId,notifBody,ticketId);
        var notifData = Notification.findOne({"notificationId":{$exists:true}}, {sort: {notificationId: -1}});

        if(notifData){
        notificationId = notifData.notificationId + 1;
        }else{
          notificationId = 1;
        }

            Notification.insert({
              'notificationId' :notificationId,
              'event'          : eventName,
              'toMailId'       : toMailId,
              'toUserId'       : toUserId,
              'notifBody'      : notifBody,
              'ticketId'       : ticketId,
              'status'         : 'unread',
              'date'           : new Date(),
              'type'           : "notification"
          });

  },

  'insertSMS' : function(toUserId,smsBody,toNumber){
    
    var smsData = SMS.findOne({}, {sort: {smsId: -1}});

    if(smsData){
    smsId = smsData.smsId + 1;
    }else{
      smsId = 1;
    }

        Notification.insert({
          'smsId'      :smsId,
          'toUserId'   : toUserId,
          'smsBody'    : smsBody,
          'status'     : 'unread',
          'date'       : new Date(),
      });

    
    
  },

  'updateNotification' : function(id){
    var updateNotif= Notification.update(
              { "_id" : id },
              { $set: { "status"         : 'Read',  
                                
                       }  
              },
        );//end update 
    return updateNotif;

  },

  'deleteNotification' : function(id){
    Notification.remove({"_id": id});

  },

  'updateSMS' : function(id){
    SMS.update(
              { "_id" : id },
              { $set: { "status"         : 'Read',  
                                
                       }  
              },
        );//end update 

  },

  'deleteSMS' : function(id){
    SMS.remove({"_id": id});

  },

  "getUserNotificationCount" : function(){
      var count = Notification.find({"toUserId": Meteor.userId(),"status":"unread", "event": { $exists: true, $ne: null } }).count();
      console.log("count = ",count);
      return count;
    },

  "markNotificationAsRead" : function(id){
    Notification.update(
      { "_id" : id},
      { $set: { "status" : "read" }
      }
    );
  },
});