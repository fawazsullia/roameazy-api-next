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
        stream.pipe(res);
    }
}