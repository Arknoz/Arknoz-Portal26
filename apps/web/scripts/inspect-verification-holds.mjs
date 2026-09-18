import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error("Provide manifest key.");
  process.exit(1);
}

const r2 = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;

async function bodyToBuffer(body) {
  const chunks = [];

  for await (const chunk of body) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function getJson(key) {
  const result = await r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const buffer = await bodyToBuffer(result.Body);

  return JSON.parse(
    buffer.toString("utf8")
  );
}

try {
  const basePath = manifestKey.replace(
    /\/manifest\.json$/,
    ""
  );

  const verificationKey =
    `${basePath}/verified/source-verification.json`;

  const verification =
    await getJson(verificationKey);

  const held =
    verification.held_for_review || [];

  const reasonCounts = {};

  console.log("");
  console.log("==============================================");
  console.log("ARKNOZ VERIFICATION HOLD DIAGNOSTIC");
  console.log("==============================================");
  console.log("");

  console.log(`HELD PROPOSALS: ${held.length}`);
  console.log("");

  for (let i = 0; i < held.length; i += 1) {
    const item = held[i];

    console.log("----------------------------------------------");
    console.log(`PROPOSAL ${i + 1}`);
    console.log(`FIELD: ${item.field}`);
    console.log(`VALUE: ${item.value}`);
    console.log(`CONFIDENCE: ${item.confidence}`);
    console.log(
      `CANDIDATES: ${(item.candidate_ids || []).join(", ")}`
    );

    console.log("REASONS:");

    for (const reason of item.reasons || []) {
      console.log(`  - ${reason}`);

      reasonCounts[reason] =
        (reasonCounts[reason] || 0) + 1;
    }

    console.log("");
  }

  console.log("==============================================");
  console.log("REASON SUMMARY");
  console.log("==============================================");

  const sortedReasons =
    Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1]);

  if (!sortedReasons.length) {
    console.log("No hold reasons found.");
  } else {
    for (const [reason, count] of sortedReasons) {
      console.log(`${count} x ${reason}`);
    }
  }

  console.log("");
} catch (error) {
  console.error("");
  console.error("INSPECTION FAILED");
  console.error(error?.message || error);
  console.error("");
  process.exit(1);
}