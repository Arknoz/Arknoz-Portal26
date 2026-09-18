import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const required = [
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`FAIL: Missing ${key}`);
    process.exit(1);
  }
}

const client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;
const key = `_system/connection-tests/arknoz-${Date.now()}.txt`;

try {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: "Arknoz R2 connection test",
      ContentType: "text/plain",
    })
  );

  console.log("WRITE: PASS");

  await client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  console.log("READ/HEAD: PASS");

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  console.log("DELETE CLEANUP: PASS");
  console.log(`BUCKET: ${bucket}`);
  console.log("R2 CONNECTION: PASS");
} catch (error) {
  console.error("R2 CONNECTION: FAIL");
  console.error(error?.name || "Unknown error");
  console.error(error?.message || "");
  process.exit(1);
}