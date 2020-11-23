import { CreateWriteStreamOptions, Storage } from '@google-cloud/storage';
import { join } from 'path';
import { GoogleCloudStorageOptions, GoogleCloudStoragePerRequestOptions, UploadedFileMetadata } from './interfaces';
import { File } from '@google-cloud/storage/build/src/file';
import { GOOGLE_CLOUD_STORAGE_PUBLIC_URI } from './constants';
import { v4 as uuidV4 } from 'uuid';


export class GoogleCloudStorageService {

    private _storage: Storage = new Storage();
    private static _instance: GoogleCloudStorageService = new GoogleCloudStorageService();


    static get instance(): GoogleCloudStorageService {
        if (GoogleCloudStorageService._instance) {
            return this._instance;
        }
        return new GoogleCloudStorageService();

    }


    get storage(): Storage {
        return this._storage;
    }

    protected generateFileNameGC(
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>): string {
        const fileName = perRequestOptions && perRequestOptions.uploadAs ? perRequestOptions.uploadAs : uuidV4();
        if (perRequestOptions && perRequestOptions.prefix) {
            const prefix = perRequestOptions.prefix;
            return join(prefix, fileName);
        }
        return fileName;
    }

    async upload(
        fileMetadata: UploadedFileMetadata,
        storageOptions: GoogleCloudStorageOptions,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
    ): Promise<string> {
        const googleCloudFileName: string = this.generateFileNameGC(perRequestOptions);
        const formatedFileToUpload: File = this.storage.bucket(storageOptions.bucketName).file(googleCloudFileName);
        // sobrescribir las opciones globales con las opciones de la peticion
        perRequestOptions = {
            ...storageOptions,
            ...perRequestOptions,
        };

        const writeStreamOptions = perRequestOptions && perRequestOptions.writeStreamOptions;


        const streamOptions: CreateWriteStreamOptions = {
            predefinedAcl: 'publicRead',
            ...writeStreamOptions,
        };
        const contentType = fileMetadata.mimetype;

        if (contentType) {
            streamOptions.metadata = { contentType };
        }
        return new Promise((resolve, reject) => {
            formatedFileToUpload
                .createWriteStream(streamOptions)
                .on('error', error => reject(error))
                .on('finish', () => resolve(
                    // Cuando este OK se retornara la uri del archivo subido
                    this.getStorageUrl(googleCloudFileName, perRequestOptions),
                ),
                )
                .end(fileMetadata.buffer);
        });
    }

    // obtener la uri del almacenamiento
    getStorageUrl(
        fileName: string,
        perRequestOptions?: Partial<GoogleCloudStoragePerRequestOptions>,
    ) {
        if (perRequestOptions && perRequestOptions.storageBaseUri) {
            return join(perRequestOptions.storageBaseUri, fileName);
        }
        const bucketName = perRequestOptions && perRequestOptions.bucketName ? perRequestOptions.bucketName : '';
        return GOOGLE_CLOUD_STORAGE_PUBLIC_URI + join(bucketName, fileName);
    }
}