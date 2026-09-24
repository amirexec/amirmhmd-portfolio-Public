// S3-compatible media storage — works unmodified against AWS S3, Cloudflare R2,
// or Supabase Storage. Swap the STORAGE_* env vars, nothing else changes.
//
// If no STORAGE_ACCESS_KEY_ID is set (e.g. fresh local dev before a bucket
// exists), files are written to /public/uploads instead so the admin still
// works end to end. Switch to a real bucket any time — nothing else changes.
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

const BUCKET = process.env.STORAGE_BUCKET || "amirmhmd-media";
const PUBLIC_URL = process.env.STORAGE_PUBLIC_URL || "";
const USE_LOCAL = !process.env.STORAGE_ACCESS_KEY_ID;

const s3 = USE_LOCAL
  ? null
  : new S3Client({
      region: process.env.STORAGE_REGION || "auto",
      endpoint: process.env.STORAGE_ENDPOINT || undefined, // unset = real AWS S3
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || "",
      },
      forcePathStyle: !!process.env.STORAGE_ENDPOINT, // needed for R2/Supabase
    });

const LOCAL_DIR = path.join(process.cwd(), "public", "uploads");

export async function uploadFile(
  file: Buffer,
  originalName: string,
  contentType: string
) {
  const ext = originalName.split(".").pop() || "bin";
  const key = `uploads/${randomUUID()}.${ext}`;

  if (USE_LOCAL) {
    await mkdir(LOCAL_DIR, { recursive: true });
    const filename = key.split("/").pop()!;
    await writeFile(path.join(LOCAL_DIR, filename), file);
    return { key, url: `/uploads/${filename}` };
  }

  await s3!.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  const url = PUBLIC_URL ? `${PUBLIC_URL}/${key}` : `/${BUCKET}/${key}`;
  return { key, url };
}

export async function deleteFile(key: string) {
  if (USE_LOCAL) {
    const filename = key.split("/").pop()!;
    await unlink(path.join(LOCAL_DIR, filename)).catch(() => {});
    return;
  }
  await s3!.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
