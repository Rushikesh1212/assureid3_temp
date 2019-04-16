import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const TicketVideo = new FilesCollection({
    collectionName: 'TicketVideo',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});
