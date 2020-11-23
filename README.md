# Google Cloud Storage on express

## Setup

1. Install dependencies

``` shell_script
    npm i
```

2. Export your `Google Credentials`

``` shell_script
    export GOOGLE_APPLICATION_CREDENTIALS="<path-to-project>/<account-service-key>.json"
```

3. Run server

``` shell_script
    npm run dev
```

## Usage

Get the instance (singlenton)

``` typescript
const googleCloudStorageService = GoogleCloudStorageService.instance;
```

Upload a file:

``` typescript
export const uploadFileRoute = router.post(
    '/upload-file',
    async (req: any, res) => {
        const file: UploadedFile = req.files.picture;
        const url = await googleCloudStorageService.upload(
            {
                ...file,
                buffer: file.data,
                size: file.size.toString(),
                fieldname: 'picture',
            },
            {
                bucketName: '<your-bucket-name>'
            },
            {
                uploadAs: '<file-name-to-be-saved>', // Optional
            },
        );
        return res.send({ url, });
    }
);

```
