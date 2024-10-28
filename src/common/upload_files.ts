// import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { UploadType } from './constants';
import { promises as fs } from 'fs';

export interface UploadFile {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  id: string;
  uploadType: UploadType;
}

export async function uploadFileFromStream(
  createReadStream: () => NodeJS.ReadableStream,
  filename: string,
  id: string,
  uploadType: UploadType,
): Promise<string> {
  const subPath =
    uploadType === UploadType.PROFILE_IMAGE
      ? 'profiles'
      : uploadType === UploadType.PLACE_IMAGE
        ? 'places'
        : 'other';
  const dirPath = join(process.cwd(), `uploads/${subPath}/${id}`);
  await ensureDirectoryExists(dirPath);
  const filePath = join(dirPath, filename);

  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(filePath);
    const readStream = createReadStream();
    readStream.pipe(writeStream);
    writeStream.on('finish', () => resolve(filename));
    writeStream.on('error', reject);
  });
}
export async function uploadFilesFromStream(
  uploadedFiles: UploadFile[],
): Promise<string[]> {
  const result = await Promise.all(
    uploadedFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        uploadFileFromStream(
          file.createReadStream,
          file.filename,
          file.id,
          file.uploadType,
        )
          .then(resolve)
          .catch(reject);
      });
    }),
  );
  return result;
}

async function ensureDirectoryExists(path: string) {
  try {
    await fs.access(path);
  } catch (error) {
    await fs.mkdir(path, { recursive: true });
  }
}
