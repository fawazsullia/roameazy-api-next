import { Bucket, Storage } from "@google-cloud/storage"
const fs = require("fs/promises");
const path = require('path');

export class UploadUtils {

    // this needs to be written when we buy s3 bucket
    private static storage = new Storage({
        keyFilename: path.join(__dirname, "../../roam-eazy-c91824841f84.json")
    })

    private static bucket = this.storage.bucket('roam-eazy-prod-1')

    public static async uploadFileToBucket(multerFile: Express.Multer.File, folder: string, fileName: string): Promise<string> {
        const uploadsDir = path.join(__dirname, '../uploads');
        const filePath = `${uploadsDir}/${fileName}`;
        const fileBuffer = multerFile.buffer;

        try {
            await fs.mkdir(uploadsDir, { recursive: true });
        } catch (error) {
            console.log(error)
        }
        console.log(filePath, "file path")
        await fs.writeFile(filePath, fileBuffer);
        const options = {
            destination: `${folder}/${fileName}`,
            metadata: {
                contentType: multerFile.mimetype
            },
        }
        console.log(filePath, "file path")
        const uplaodedFile = await this.bucket.upload(filePath, options);
        console.log(uplaodedFile, "uploaded file")
        return uplaodedFile[0]?.metadata?.id ?? "";
    }

    public static getFileFromBucket(id: string) {
        let idSplit = id.split('/');
        idSplit.pop()
        const path = idSplit.slice(1).join('/');
        const file = this.bucket.file(path);
        return file.createReadStream();
    }

}