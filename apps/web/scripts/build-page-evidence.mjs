import crypto from "node:crypto";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { PDFParse } from "pdf-parse";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error(
    'Usage: node --env-file=.env.local scripts\\build-page-evidence.mjs "<manifest-key>"'
  );
  process.exit(1);
}

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

const r2 = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;

async function toBuffer(body) {
  const chunks = [];

  for await (const chunk of body) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function getObjectBuffer(key) {
  const result = await r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return toBuffer(result.Body);
}

async function getJson(key) {
  const buffer = await getObjectBuffer(key);
  return JSON.parse(buffer.toString("utf8"));
}

async function putJson(key, data) {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
    })
  );
}

function cleanText(text = "") {
  return text
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

try {
  const manifest = await getJson(manifestKey);

  const basePath =
    manifestKey.replace(/\/manifest\.json$/, "");

  const extractionKey =
    `${basePath}/processed/extraction.json`;

  const masterKey =
    `${basePath}/master/project-master.json`;

  const extraction = await getJson(extractionKey);
  const master = await getJson(masterKey);

  const sourceKey = manifest?.source?.object_key;

  if (!sourceKey) {
    throw new Error("Missing source object key.");
  }

  const extension =
    manifest?.source?.extension?.toLowerCase();

  if (extension !== ".pdf") {
    throw new Error(
      "Page evidence currently supports PDF files only."
    );
  }

  const sourceBuffer =
    await getObjectBuffer(sourceKey);

  const parser = new PDFParse({
    data: sourceBuffer,
  });

  let pageCount =
    extraction?.source?.page_count || null;

  if (!pageCount) {
    const full = await parser.getText();
    pageCount = full.total;
  }

  const pages = [];

  console.log(
    `Building evidence index for ${pageCount} pages...`
  );

  try {
    for (
      let pageNumber = 1;
      pageNumber <= pageCount;
      pageNumber++
    ) {
      const result = await parser.getText({
        partial: [pageNumber],
      });

      const text = cleanText(result.text);

      const textSha256 = crypto
        .createHash("sha256")
        .update(text)
        .digest("hex");

      pages.push({
        page: pageNumber,
        character_count: text.length,
        text_sha256: textSha256,
        text,
      });

      console.log(
        `PAGE ${pageNumber}: ${text.length} characters`
      );
    }
  } finally {
    await parser.destroy();
  }

  const pagesKey =
    `${basePath}/processed/pages.json`;

  const evidenceIndexKey =
    `${basePath}/evidence/evidence-index.json`;

  const pageDocument = {
    schema: "arknoz-page-extraction-v1",

    import_id: manifest.import.id,

    source: {
      object_key: sourceKey,
      original_filename:
        manifest.source.original_filename,
      source_sha256:
        manifest.source.sha256,
      page_count: pageCount,
    },

    pages,

    generated_at:
      new Date().toISOString(),
  };

  const evidenceIndex = {
    schema: "arknoz-evidence-index-v1",

    import_id: manifest.import.id,

    source: {
      object_key: sourceKey,
      original_filename:
        manifest.source.original_filename,
      source_sha256:
        manifest.source.sha256,
    },

    page_count: pageCount,

    evidence_items: [],

    status: "page_index_ready",

    note:
      "Fact-level evidence items will reference this page index. No facts are auto-approved at this stage.",

    generated_at:
      new Date().toISOString(),
  };

  await putJson(pagesKey, pageDocument);
  await putJson(
    evidenceIndexKey,
    evidenceIndex
  );

  master.evidence =
    master.evidence || {};

  master.evidence.evidence_status =
    "page_index_ready";

  master.evidence.page_index_key =
    pagesKey;

  master.evidence.evidence_index_key =
    evidenceIndexKey;

  await putJson(masterKey, master);

  manifest.processing.page_evidence =
    "complete";

  manifest.evidence.extraction_status =
    "page_index_ready";

  manifest.evidence.page_count =
    pageCount;

  manifest.evidence.page_index_key =
    pagesKey;

  manifest.evidence.evidence_index_key =
    evidenceIndexKey;

  manifest.updated_at =
    new Date().toISOString();

  await putJson(manifestKey, manifest);

  console.log("");
  console.log("PAGE EVIDENCE: PASS");
  console.log(`PAGES: ${pageCount}`);
  console.log(`PAGE INDEX: ${pagesKey}`);
  console.log(
    `EVIDENCE INDEX: ${evidenceIndexKey}`
  );
  console.log("FACT APPROVALS: NONE");
  console.log("PUBLICATION: BLOCKED");
  console.log(
    "STATUS: READY FOR FACT EXTRACTION"
  );
  console.log("");
} catch (error) {
  console.error("");
  console.error("PAGE EVIDENCE: FAIL");
  console.error(
    error?.message || error
  );
  console.error("");
  process.exit(1);
}