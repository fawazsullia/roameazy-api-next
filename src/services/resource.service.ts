import { Service } from "typedi";
import { UploadUtils } from "../utils/upload.util";
import { Response } from "express";

@Service()
export class ResourceService {

    async get(id: string, res: Response) {
        console.log('id', id);
        const stream = await UploadUtils.getFileFromBucket(id);
        stream.on('error', (err) => {
            console.error('Error reading from GCS:', err);
            throw new Error('Error reading from GCS');
        });
        // res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Transfer-Encoding', 'chunked');
        stream.pipe(res);
    }

    public async create(file: Express.Multer.File, folder?: string) {
        const fileName = file.originalname;
        let newFolder = 'resources';
        if (folder) {
            newFolder = folder;
        }
        const uploadedUrl = await UploadUtils.uploadFileToBucket(file, newFolder, fileName);
        return uploadedUrl;
    }
}