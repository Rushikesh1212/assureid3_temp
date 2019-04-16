import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const PackageImage = new FilesCollection({
    collectionName: 'PackageImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});