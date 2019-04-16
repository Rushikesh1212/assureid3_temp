import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const ContractDocuments = new FilesCollection({
    collectionName: 'ContractDocuments',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});
  