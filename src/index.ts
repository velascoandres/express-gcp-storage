import express from 'express';
import dotenv from 'dotenv';
import { uploadFileRoute } from './routes/upload-file.route';
import fileUpload from 'express-fileupload';

// init .env config file
dotenv.config();


const app = express();

const port = process.env.PORT;


app.use(
    fileUpload({
        createParentPath: true
    }),
);

app.use('/api', uploadFileRoute);


app.listen(port, () => {
    console.info(`server started at http://localhost:${port}`);
});