export class StringUtil {

    public static getUploadFileName(fileName: string, companyName: string): string {
        return `${companyName}-${new Date().getTime()}-${fileName}`;
    }

    public static getFormattedFileName(fileName: string): string {
        return fileName.replace(/ /g, '_');
    }
}