// Cloudflare R2 storage client (S3-compatible API).
// Used for storing uploaded assets (course thumbnails, gallery photos, brochures, etc.)
// This file must only be imported from server-side code (API routes / server actions) -
// the credentials below should never be exposed to the browser.

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID as string;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string;

export const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME as string;
// Public base URL if the bucket / a custom domain is exposed publicly, e.g.
// https://pub-xxxxxxxx.r2.dev or https://cdn.furqansaeed.edu.pk
export const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL as string;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function uploadToR2(key: string, body: Buffer | Uint8Array, contentType: string) {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key;
}

export async function getFromR2(key: string) {
  return r2Client.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}

export async function deleteFromR2(key: string) {
  return r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}
