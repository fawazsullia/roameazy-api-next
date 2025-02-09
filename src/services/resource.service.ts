import { Service } from "typedi";
import { UploadUtils } from "../utils/upload.util";
import { Response } from "express";
import { v4 as uuidV4 } from "uuid"
import { StringUtil } from "../utils/string.util";

@Service()
export class ResourceService {

    async get(id: string, res: Response) {
        console.log('id', id);
        if (!id) {
            return res.end();
        }
        const stream = await UploadUtils.getFileFromBucket(id);
        stream.on('error', (err) => {
            console.error('Error reading from GCS:', err);
            return res.end();
        });
        // res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Transfer-Encoding', 'chunked');
        stream.pipe(res);
    }

    public async create(file: Express.Multer.File, folder?: string, companyName?: string) {
        let fileName = uuidV4();
        if(companyName) {
            fileName = StringUtil.getUploadFileName(fileName, companyName);
        }
        let newFolder = 'resources';
        if (folder) {
            newFolder = folder;
        }
        const uploadedUrl = await UploadUtils.uploadFileToBucket(file, newFolder, fileName);
        return uploadedUrl;
    }
}