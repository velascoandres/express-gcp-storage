import { StorageOptions, CreateWriteStreamOptions } from '@google-cloud/storage';

export interface GoogleCloudStorageOptions extends StorageOptions {
    bucketName: string;
    storageBaseUri?: string;
}

export interface GoogleCloudStoragePerRequestOptions extends GoogleCloudStorageOptions {
    writeStreamOptions?: CreateWriteStreamOptions;
    prefix?: string;
    uploadAs?: string;
}

export interface UploadedFileMetadata {
    fieldname: string;
    originalname?: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: string;
    storageUrl?: string;
}