import * as express from 'express';
import { UploadedFile } from 'express-fileupload';
import { GoogleCloudStorageService } from '../google-cloud-storage/google-cloud-storage.service';

let router = express.Router();
const googleCloudStorageService = GoogleCloudStorageService.instance;


export const uploadFileRoute = router.post(
    '/upload-file',
    async (req: any, res) => {
        const file: UploadedFile = req.files.picture;
        const url = await googleCloudStorageService.upload(
            {
                buffer: file.data,
                mimetype: file.mimetype,
                encoding: file.encoding,
                size: file.size.toString(),
                fieldname: 'picture',
            },
            {
                bucketName: 'pimba_test_gcs'
            },
            {
                writeStreamOptions: {
                    public: true,
                },
                uploadAs: 'archivo-test',
            },
        );
        return res.send({ url, });
    }
);