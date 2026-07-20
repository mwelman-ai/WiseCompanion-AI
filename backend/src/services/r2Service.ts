import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const bucketName = process.env.R2_BUCKET_NAME || '';
const publicUrl = process.env.R2_PUBLIC_URL || '';

export const isR2Configured = !!(accountId && accessKeyId && secretAccessKey && bucketName);

console.log(`[R2 Service] Mode: ${isR2Configured ? 'LIVE CLOUDFLARE R2' : 'MOCK LOCAL STORAGE (Fallback)'}`);

const s3Client = isR2Configured
  ? new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region: 'auto',
    })
  : null;

export const r2Service = {
  /**
   * Uploads a file (buffer) to Cloudflare R2 or local storage fallback.
   * @param fileBuffer The binary content of the file
   * @param originalName The original name of the file (e.g., photo.jpg)
   * @param mimeType The file MIME type (e.g., image/jpeg)
   * @returns The public URL of the uploaded file
   */
  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const fileExtension = path.extname(originalName) || '.bin';
    const randomName = crypto.randomBytes(16).toString('hex');
    const key = `${randomName}${fileExtension}`;

    if (isR2Configured && s3Client) {
      try {
        console.log(`[R2 Service] Uploading ${originalName} to R2 bucket: ${bucketName}...`);
        
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        });

        await s3Client.send(command);
        
        // Construct public URL
        const domain = publicUrl 
          ? publicUrl.replace(/\/$/, '') 
          : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com`;
          
        const fileUrl = `${domain}/${key}`;
        console.log(`[R2 Service] Upload successful. URL: ${fileUrl}`);
        return fileUrl;
      } catch (error) {
        console.error('[R2 Service] R2 Upload Error, falling back to local storage:', error);
        // Fall through to local storage if live upload fails
      }
    }

    // Local Mock Fallback Storage
    console.log(`[R2 Service] Storing ${originalName} locally (mock)...`);
    try {
      const uploadDir = path.resolve('public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localPath = path.join(uploadDir, key);
      fs.writeFileSync(localPath, fileBuffer);

      // Return a relative URL that can be served by express.static
      const localUrl = `/uploads/${key}`;
      console.log(`[R2 Service] Local upload successful. URL: ${localUrl}`);
      return localUrl;
    } catch (localError) {
      console.error('[R2 Service] Local fallback storage error:', localError);
      throw new Error('Failed to store file in either R2 or local storage');
    }
  }
};
