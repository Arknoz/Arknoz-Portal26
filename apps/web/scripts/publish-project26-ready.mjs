import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const nodeRequire =
  createRequire(import.meta.url);

const ts =
  nodeRequire("typescript");

function fail(message) {
  throw new Error(message);
}

function sql(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "NULL";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return (
    "'" +
    String(value)
      .replaceAll("'", "''") +
    "'"
  );
}

function safeSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function requireEnv(name) {
  const value =
    process.env[name]?.trim();

  if (!value) {
    fail(
      `Missing environment variable: ${name}`
    );
  }

  return value;
}

const packageArg =
  process.argv[2];

const expectedId =
  process.argv[3];

const publishMode =
  process.argv.includes("--publish");

if (
  !packageArg ||
  !expectedId
) {
  fail(
    "Usage: node scripts/publish-project26-ready.mjs <package.json> <ARK-PRJ-ID> [--publish]"
  );
}

if (
  !/^ARK-PRJ-\d{8}$/.test(
    expectedId
  )
) {
  fail(
    `Invalid Arknoz Project ID: ${expectedId}`
  );
}

const root =
  process.cwd();

const repoRoot =
  path.resolve(
    root,
    "..",
    ".."
  );

const packagePath =
  path.resolve(
    root,
    packageArg
  );

const gatePath =
  path.join(
    root,
    "scripts",
    "project26-publication-gate.cjs"
  );

const localPreviewPath =
  path.join(
    root,
    "src",
    "lib",
    "project26-md-local-preview.ts"
  );

if (
  !fs.existsSync(packagePath)
) {
  fail(
    `Package not found: ${packagePath}`
  );
}

if (
  !fs.existsSync(gatePath)
) {
  fail(
    `Publication gate not found: ${gatePath}`
  );
}

const pkg =
  JSON.parse(
    fs.readFileSync(
      packagePath,
      "utf8"
    ).replace(
      /^\uFEFF/,
      ""
    )
  );

const slug =
  String(
    pkg?.project?.identity?.slug ??
    ""
  ).trim();

const title =
  String(
    pkg?.project?.identity?.title ??
    ""
  ).trim();

if (!slug || !title) {
  fail(
    "Project26 identity slug/title missing."
  );
}

console.log("");
console.log(
  "============================================================"
);
console.log(
  " PROJECT26 PRODUCTION PUBLISHER"
);
console.log(
  "============================================================"
);
console.log(`Project : ${title}`);
console.log(`Slug    : ${slug}`);
console.log(`ID      : ${expectedId}`);
console.log(
  `Mode    : ${publishMode ? "PUBLISH" : "PREFLIGHT"}`
);


/* ============================================================
   PROJECT26 RELEASE GATE
   ============================================================ */

const gateReport =
  path.join(
    os.tmpdir(),
    `arknoz-project26-gate-${Date.now()}.json`
  );

const gateRun =
  spawnSync(
    process.execPath,
    [
      gatePath,
      packagePath,
      gateReport,
    ],
    {
      cwd:
        root,

      encoding:
        "utf8",
    }
  );

if (
  gateRun.status !== 0
) {
  console.error(
    gateRun.stdout ?? ""
  );
  console.error(
    gateRun.stderr ?? ""
  );

  fail(
    "Project26 publication gate process failed."
  );
}

const gate =
  JSON.parse(
    fs.readFileSync(
      gateReport,
      "utf8"
    )
  );

try {
  fs.unlinkSync(
    gateReport
  );
}
catch {}

const gateResult =
  gate?.queue?.[0];

if (
  !gateResult ||
  gateResult.release !== "READY" ||
  gateResult.launchReady !== true ||
  gateResult.mdPass !== true ||
  gateResult.researchPackagePass !== true
) {
  console.error(
    JSON.stringify(
      gateResult,
      null,
      2
    )
  );

  fail(
    "Project26 package is not publication READY."
  );
}

console.log("");
console.log(
  "Project26 gate: READY"
);


/* ============================================================
   TYPESCRIPT LOADER
   Uses the same source adapter as local Project26 preview.
   ============================================================ */

const moduleCache =
  new Map();

function resolveSourceModule(
  id,
  fromFile
) {
  let basePath;

  if (
    id.startsWith("@/")
  ) {
    basePath =
      path.join(
        root,
        "src",
        id.slice(2)
      );
  }
  else if (
    id.startsWith("./") ||
    id.startsWith("../")
  ) {
    basePath =
      path.resolve(
        path.dirname(
          fromFile
        ),
        id
      );
  }
  else {
    return null;
  }

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.cjs`,
    `${basePath}.json`,
    path.join(
      basePath,
      "index.ts"
    ),
    path.join(
      basePath,
      "index.tsx"
    ),
    path.join(
      basePath,
      "index.js"
    ),
    path.join(
      basePath,
      "index.cjs"
    ),
  ];

  return (
    candidates.find(
      (candidate) =>
        fs.existsSync(
          candidate
        ) &&
        fs.statSync(
          candidate
        ).isFile()
    ) ??
    null
  );
}

function loadTs(file) {
  const resolvedFile =
    path.resolve(
      file
    );

  if (
    moduleCache.has(
      resolvedFile
    )
  ) {
    return moduleCache
      .get(
        resolvedFile
      )
      .exports;
  }

  const compiled =
    ts.transpileModule(
      fs.readFileSync(
        resolvedFile,
        "utf8"
      ),
      {
        fileName:
          resolvedFile,

        compilerOptions: {
          module:
            ts.ModuleKind.CommonJS,

          target:
            ts.ScriptTarget.ES2022,

          esModuleInterop:
            true,

          strict:
            true,
        },

        reportDiagnostics:
          true,
      }
    );

  const errors =
    (
      compiled.diagnostics ??
      []
    ).filter(
      (item) =>
        item.category ===
        ts.DiagnosticCategory.Error
    );

  if (errors.length) {
    fail(
      ts.formatDiagnosticsWithColorAndContext(
        errors,
        {
          getCanonicalFileName:
            (name) =>
              name,

          getCurrentDirectory:
            () =>
              root,

          getNewLine:
            () =>
              "\n",
        }
      )
    );
  }

  const mod = {
    exports: {},
  };

  moduleCache.set(
    resolvedFile,
    mod
  );

  const localRequire =
    (id) => {
      /*
       * "server-only" is a Next.js compile-time boundary marker.
       * The standalone Project26 publisher executes server code
       * directly under Node, so no runtime implementation is needed.
       */
      if (
        id === "server-only"
      ) {
        return {};
      }

      const resolved =
        resolveSourceModule(
          id,
          resolvedFile
        );

      if (resolved) {
        if (
          resolved.endsWith(".ts") ||
          resolved.endsWith(".tsx")
        ) {
          return loadTs(
            resolved
          );
        }

        return nodeRequire(
          resolved
        );
      }

      return nodeRequire(
        id
      );
    };

  const fn =
    vm.runInThisContext(
      `(function(require,module,exports,__filename,__dirname){${compiled.outputText}\n})`,
      {
        filename:
          resolvedFile,
      }
    );

  fn(
    localRequire,
    mod,
    mod.exports,
    resolvedFile,
    path.dirname(
      resolvedFile
    )
  );

  return mod.exports;
}

const previewModule =
  loadTs(
    localPreviewPath
  );

if (
  typeof previewModule
    .getProject26LocalPreview !==
  "function"
) {
  fail(
    "Project26 production adapter entrypoint unavailable."
  );
}

const originalNodeEnv =
  process.env.NODE_ENV;

process.env.NODE_ENV =
  "development";

const preview =
  await previewModule
    .getProject26LocalPreview(
      slug
    );

if (
  originalNodeEnv ===
  undefined
) {
  delete process.env.NODE_ENV;
}
else {
  process.env.NODE_ENV =
    originalNodeEnv;
}

if (!preview?.project) {
  fail(
    "READY Project26 package could not be converted through the production adapter."
  );
}

const detail =
  JSON.parse(
    JSON.stringify(
      preview.project
    )
  );

console.log(
  "Production adapter: PASS"
);


/* ============================================================
   CANONICAL PACKAGE DATA
   ============================================================ */

const sources =
  Array.isArray(
    pkg.project.sources
  )
    ? pkg.project.sources
    : [];

const media =
  Array.isArray(
    pkg.project.media
  )
    ? pkg.project.media
    : [];

if (
  sources.length < 4
) {
  fail(
    `Source count invalid: ${sources.length}`
  );
}

if (
  media.length < 6
) {
  fail(
    `Media count invalid: ${media.length}`
  );
}

const classification =
  pkg.project.classification ??
  {};

function classificationTopic(
  value
) {
  if (
    value &&
    typeof value === "object"
  ) {
    return String(
      value.label ??
      value.slug ??
      ""
    ).trim();
  }

  return String(
    value ??
    ""
  ).trim();
}

const topicValues =
  [
    classification.projectKind,
    classification.primaryCategory,
    ...(
      Array.isArray(
        classification.typologies
      )
        ? classification.typologies
        : []
    ),
    ...(
      Array.isArray(
        classification.useSectors
      )
        ? classification.useSectors
        : []
    ),
  ]
    .map(
      classificationTopic
    )
    .filter(
      Boolean
    );

const topics =
  [
    ...new Set(
      topicValues
    ),
  ];

if (
  topics.length === 0
) {
  fail(
    "No Project topics available."
  );
}

const subsectionKey =
  preview?.entity
    ?.sectionSubsections
    ?.projects?.[0] ||
  safeSlug(
    classification.primaryCategory?.slug ??
    classification.primaryCategory?.label ??
    classification.primaryCategory
  );

if (
  !subsectionKey
) {
  fail(
    "Project subsection could not be resolved."
  );
}

const identityGeography =
  pkg?.project?.identity
    ?.geography;

const geographyLabel =
  typeof identityGeography ===
  "string"
    ? identityGeography
    : (
        identityGeography
          ?.label ??
        null
      );

const geographySlug =
  preview?.entity
    ?.geographySlug ??
  preview?.entity
    ?.geography
    ?.slug ??
  null;

const summary =
  preview?.entity?.summary ??
  pkg?.project?.identity
    ?.summary ??
  detail?.summary ??
  null;

const subtitle =
  preview?.entity
    ?.subtitle ??
  detail?.strapline ??
  null;

const officialUrl =
  sources.find(
    (source) =>
      /edith|farnsworth/i.test(
        String(
          source.publisher ??
          source.label ??
          ""
        )
      )
  )?.url ??
  sources[0]?.url ??
  null;


/* ============================================================
   PROVEN SUPABASE LINKED-SQL PATH
   ============================================================ */

function runSupabaseSql(
  sqlText,
  label,
  {
    showOutput = false,
  } = {}
) {
  const sqlPath =
    path.join(
      os.tmpdir(),
      `arknoz-project26-${Date.now()}-${crypto
        .randomBytes(4)
        .toString("hex")}.sql`
    );

  fs.writeFileSync(
    sqlPath,
    sqlText,
    "utf8"
  );

  const npxCandidate =
    "C:\\Program Files\\nodejs\\npx.cmd";

  const npx =
    fs.existsSync(
      npxCandidate
    )
      ? npxCandidate
      : "npx.cmd";

  const powershell =
    process.env.SystemRoot
      ? path.join(
          process.env.SystemRoot,
          "System32",
          "WindowsPowerShell",
          "v1.0",
          "powershell.exe"
        )
      : "powershell.exe";

  const command =
    `& '${npx.replaceAll("'", "''")}' ` +
    `supabase db query --linked ` +
    `--file '${sqlPath.replaceAll("'", "''")}'`;

  const result =
    spawnSync(
      powershell,
      [
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        command,
      ],
      {
        cwd:
          repoRoot,

        encoding:
          "utf8",

        windowsHide:
          true,
      }
    );

  try {
    fs.unlinkSync(
      sqlPath
    );
  }
  catch {}

  const combined =
    [
      result.stdout ?? "",
      result.stderr ?? "",
    ].join(
      "\n"
    );

  if (
    result.status !== 0
  ) {
    console.error("");
    console.error(
      `${label}: FAIL`
    );
    console.error(
      combined
    );

    fail(
      `${label} failed`
    );
  }

  if (showOutput) {
    console.log("");
    console.log(
      label
    );
    console.log(
      combined.trim()
    );
  }

  return combined;
}


/* ============================================================
   COLLISION / EXISTING RECORD CHECK
   ============================================================ */

const conflictOutput =
  runSupabaseSql(
    `
select
  'ARKNOZ_CONFLICT|' ||
  coalesce(
    (
      select
        arknoz_entity_id ||
        '|' ||
        slug ||
        '|' ||
        entity_type ||
        '|' ||
        content_status ||
        '|' ||
        verification_status ||
        '|' ||
        replace(
          title,
          '|',
          ' '
        )
      from public.entities
      where
        slug = ${sql(slug)}
        or
        arknoz_entity_id =
          ${sql(expectedId)}
      order by
        case
          when slug =
            ${sql(slug)}
          then 0
          else 1
        end
      limit 1
    ),
    'NONE'
  );
`,
    "IDENTITY CONFLICT CHECK"
  );

const conflictMatch =
  conflictOutput.match(
    /ARKNOZ_CONFLICT\|([^\r\n]+)/
  );

if (!conflictMatch) {
  fail(
    "Could not read identity conflict check."
  );
}

const conflictValue =
  conflictMatch[1]
    .trim()
    .replace(
      /\s+\|.*$/,
      ""
    );

if (
  !conflictValue.startsWith(
    "NONE"
  )
) {
  const existing =
    conflictValue.split(
      "|"
    );

  const [
    existingId,
    existingSlug,
    existingType,
    existingStatus,
    existingVerification,
    existingTitle,
  ] =
    existing;

  if (
    existingId === expectedId &&
    existingSlug === slug &&
    existingType === "project" &&
    existingStatus === "published" &&
    existingVerification === "source_backed" &&
    existingTitle === title
  ) {
    const countsOutput =
      runSupabaseSql(
        `
select
  'ARKNOZ_COUNTS|' ||
  (
    select count(*)::text
    from public.entity_sources s
    join public.entities e
      on e.id = s.entity_id
    where e.slug =
      ${sql(slug)}
  ) ||
  '|' ||
  (
    select count(*)::text
    from public.entity_media m
    join public.entities e
      on e.id = m.entity_id
    where e.slug =
      ${sql(slug)}
      and m.publishable = true
  ) ||
  '|' ||
  (
    select count(*)::text
    from public.entity_subsections ss
    join public.entities e
      on e.id = ss.entity_id
    where e.slug =
      ${sql(slug)}
      and ss.section_key =
        'projects'
  );
`,
        "EXISTING PROJECT VERIFY"
      );

    const counts =
      countsOutput.match(
        /ARKNOZ_COUNTS\|(\d+)\|(\d+)\|(\d+)/
      );

    if (
      counts &&
      Number(
        counts[1]
      ) ===
        sources.length &&
      Number(
        counts[2]
      ) ===
        media.length &&
      Number(
        counts[3]
      ) >= 1
    ) {
      console.log("");
      console.log(
        "============================================"
      );
      console.log(
        " ALREADY PUBLISHED — HEALTHY"
      );
      console.log(
        "============================================"
      );
      console.log(
        `${expectedId} | ${slug}`
      );
      console.log(
        `Sources: ${sources.length}`
      );
      console.log(
        `Media  : ${media.length}`
      );

      process.exit(0);
    }
  }

  fail(
    `Publication blocked by existing identity: ${conflictValue}`
  );
}


/* ============================================================
   SEQUENCE — DO NOT RESET OR FORCE
   ============================================================ */

const sequenceOutput =
  runSupabaseSql(
    `
select
  'ARKNOZ_SEQUENCE|' ||
  last_value::text ||
  '|' ||
  is_called::text
from public.arknoz_project_entity_seq;
`,
    "PROJECT ID SEQUENCE CHECK"
  );

const sequenceMatch =
  sequenceOutput.match(
    /ARKNOZ_SEQUENCE\|(\d+)\|(true|false|t|f)/
  );

if (!sequenceMatch) {
  fail(
    "Could not read Project ID sequence."
  );
}

const lastValue =
  Number(
    sequenceMatch[1]
  );

const isCalled =
  sequenceMatch[2] ===
    "true" ||
  sequenceMatch[2] ===
    "t";

const nextNumber =
  isCalled
    ? lastValue + 1
    : lastValue;

const expectedNumber =
  Number(
    expectedId.slice(
      -8
    )
  );

console.log("");
console.log(
  `Database next Project ID: ARK-PRJ-${String(nextNumber).padStart(8, "0")}`
);

if (
  nextNumber !==
  expectedNumber
) {
  fail(
    `Publication blocked: database next Project ID is ${nextNumber}, but ${expectedId} requires ${expectedNumber}. Sequence was NOT changed.`
  );
}


/* ============================================================
   DATABASE ENUM CONTRACT
   ============================================================ */

function readEnumValues(
  table,
  column,
  marker
) {
  const output =
    runSupabaseSql(
      `
select
  ${sql(marker)} ||
  coalesce(
    string_agg(
      e.enumlabel,
      ','
      order by
        e.enumsortorder
    ),
    'TEXT'
  )
from information_schema.columns c
left join pg_type t
  on t.typname =
    c.udt_name
left join pg_enum e
  on e.enumtypid =
    t.oid
where
  c.table_schema =
    'public'
  and
  c.table_name =
    ${sql(table)}
  and
  c.column_name =
    ${sql(column)};
`,
      `ENUM CHECK — ${table}.${column}`
    );

  const regex =
    new RegExp(
      `${marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\r\\n]+)`
    );

  const match =
    output.match(
      regex
    );

  if (!match) {
    return null;
  }

  const raw =
    match[1]
      .trim()
      .replace(
        /\s+\|.*$/,
        ""
      );

  if (
    raw === "TEXT"
  ) {
    return null;
  }

  return new Set(
    raw
      .split(",")
      .map(
        (item) =>
          item.trim()
      )
      .filter(
        Boolean
      )
  );
}

const sourceTypesAllowed =
  readEnumValues(
    "entity_sources",
    "source_type",
    "ARKNOZ_SOURCE_TYPES|"
  );

const rightsAllowed =
  readEnumValues(
    "entity_media",
    "rights_status",
    "ARKNOZ_RIGHTS_TYPES|"
  );

const provenanceAllowed =
  readEnumValues(
    "entity_media",
    "provenance_status",
    "ARKNOZ_PROVENANCE_TYPES|"
  );

function normalizedSourceType(
  raw
) {
  const value =
    String(
      raw ??
      ""
    )
      .trim()
      .toLowerCase();

  switch (value) {

    case "official":
      return "official";

    case "primary":
    case "institutional":
    case "archive":
      return "primary";

    case "academic":
    case "technical":
    case "secondary":
      return "secondary";

    case "partner":
      return "partner";

    case "other":
      return "other";

    default:
      fail(
        `Unsupported Project26 source type: ${value}`
      );
  }
}
function normalizedRights(
  raw
) {
  const value =
    String(
      raw ??
      ""
    )
      .trim()
      .toLowerCase();

  switch (value) {

    case "public-domain":
    case "public_domain":
    case "cc0":
      return "public_domain";

    case "cc-by":
    case "cc-by-sa":
    case "licensed-reuse":
    case "licensed":
      return "licensed";

    default:
      fail(
        `Unsupported Project26 media rights status: ${value}`
      );
  }
}
const verifiedProvenance =
  "verified";

/* ============================================================
   PREFLIGHT COMPLETE
   ============================================================ */

console.log("");
console.log(
  `Sources    : ${sources.length}`
);
console.log(
  `Media      : ${media.length}`
);
console.log(
  `Topics     : ${topics.length}`
);
console.log(
  `Subsection : ${subsectionKey}`
);

if (!publishMode) {
  console.log("");
  console.log(
    "PREFLIGHT: PASS"
  );
  console.log(
    "No database write. No R2 write."
  );

  process.exit(0);
}


/* ============================================================
   R2 — LOCAL CLEARED MEDIA ONLY
   ============================================================ */

const bucket =
  requireEnv(
    "R2_BUCKET_NAME"
  );

const r2 =
  new S3Client({
    region:
      process.env.R2_REGION
        ?.trim() ||
      "auto",

    endpoint:
      requireEnv(
        "R2_ENDPOINT"
      ),

    credentials: {
      accessKeyId:
        requireEnv(
          "R2_ACCESS_KEY_ID"
        ),

      secretAccessKey:
        requireEnv(
          "R2_SECRET_ACCESS_KEY"
        ),
    },
  });

async function headObject(
  key
) {
  try {
    return await r2.send(
      new HeadObjectCommand({
        Bucket:
          bucket,

        Key:
          key,
      })
    );
  }
  catch (error) {
    const status =
      error?.$metadata
        ?.httpStatusCode;

    if (
      status === 404 ||
      error?.name ===
        "NotFound"
    ) {
      return null;
    }

    throw error;
  }
}

function contentTypeFor(
  file
) {
  const ext =
    path.extname(
      file
    ).toLowerCase();

  if (
    ext === ".png"
  ) {
    return "image/png";
  }

  if (
    ext === ".webp"
  ) {
    return "image/webp";
  }

  return "image/jpeg";
}

const uploadedMedia = [];
const createdKeys = [];

async function cleanupNewKeys() {
  if (
    createdKeys.length === 0
  ) {
    return;
  }

  console.log("");
  console.log(
    "Cleaning newly-created R2 objects..."
  );

  for (
    const key of
    [...createdKeys]
      .reverse()
  ) {
    try {
      await r2.send(
        new DeleteObjectCommand({
          Bucket:
            bucket,

          Key:
            key,
        })
      );

      console.log(
        `  removed ${key}`
      );
    }
    catch (error) {
      console.error(
        `  cleanup warning: ${error.message}`
      );
    }
  }
}

let databaseCommitted =
  false;

try {

  console.log("");
  console.log(
    "=== R2 MEDIA PUBLICATION ==="
  );

  for (
    let index = 0;
    index < media.length;
    index++
  ) {
    const item =
      media[index];

    const src =
      String(
        item.src ?? ""
      ).trim();

    if (
      !src.startsWith(
        "/media/"
      )
    ) {
      fail(
        `Project26 media ${item.id} is not a local cleared /media/ asset.`
      );
    }

    const localFile =
      path.join(
        root,
        "public",
        src.replace(
          /^\//,
          ""
        )
      );

    if (
      !fs.existsSync(
        localFile
      )
    ) {
      fail(
        `Local media missing: ${localFile}`
      );
    }

    const buffer =
      fs.readFileSync(
        localFile
      );

    if (
      buffer.length <
      10000
    ) {
      fail(
        `Media unexpectedly small: ${localFile}`
      );
    }

    const fileName =
      path.basename(
        localFile
      );

    const key =
      `public-media/projects/` +
      `${expectedId.toLowerCase()}/` +
      `${slug}/` +
      `${fileName}`;

    const publicUrl =
      `/media/${key}`;

    const existing =
      await headObject(
        key
      );

    if (existing) {
      if (
        Number(
          existing.ContentLength
        ) !==
        buffer.length
      ) {
        fail(
          `R2 collision: ${key}`
        );
      }

      console.log(
        `  ${index + 1}/${media.length} reuse: ${fileName}`
      );
    }
    else {
      await r2.send(
        new PutObjectCommand({
          Bucket:
            bucket,

          Key:
            key,

          Body:
            buffer,

          ContentType:
            contentTypeFor(
              localFile
            ),

          CacheControl:
            "public, max-age=31536000, immutable",
        })
      );

      const verify =
        await headObject(
          key
        );

      if (
        !verify ||
        Number(
          verify.ContentLength
        ) !==
          buffer.length
      ) {
        fail(
          `R2 verification failed: ${key}`
        );
      }

      createdKeys.push(
        key
      );

      console.log(
        `  ${index + 1}/${media.length} upload: ${fileName}`
      );
    }

    const rightsStatus =
      normalizedRights(
        item.rightsStatus
      );

    uploadedMedia.push({
      ...item,

      src:
        publicUrl,

      attribution:
        item.sourceLabel ??
        null,

      license:
        item.rightsStatus ===
          "public-domain"
          ? "Public Domain"
          : item.rightsStatus,

      rightsStatus,

      provenanceStatus:
        verifiedProvenance,
    });
  }

  if (
    uploadedMedia.length !==
    media.length
  ) {
    fail(
      "Not all Project26 media were prepared."
    );
  }

  detail.media =
    uploadedMedia;

  detail.sources =
    detail.sources?.length
      ? detail.sources
      : sources.map(
          (source) => ({
            label:
              source.label,

            href:
              source.url,

            organisation:
              source.publisher ??
              undefined,
          })
        );


  /* ============================================================
     ATOMIC DATABASE PUBLICATION
     ============================================================ */

  const topicsValues =
    topics
      .map(
        (topic) =>
          `    (p, ${sql(topic)})`
      )
      .join(
        ",\n"
      );

  const sourceValues =
    sources
      .map(
        (source) =>
          `    (` +
          `p, ` +
          `${sql(source.label)}, ` +
          `${sql(source.publisher ?? null)}, ` +
          `${sql(source.url)}, ` +
          `${sql(normalizedSourceType(source.type))}, ` +
          `now()` +
          `)`
      )
      .join(
        ",\n"
      );

  const mediaValues =
    uploadedMedia
      .map(
        (
          item,
          index
        ) =>
          `    (` +
          `p, ` +
          `${sql(item.role)}, ` +
          `${sql(item.src)}, ` +
          `${sql(item.alt ?? null)}, ` +
          `${sql(item.sourceUrl ?? null)}, ` +
          `${sql(item.attribution ?? null)}, ` +
          `${sql(item.license ?? null)}, ` +
          `${sql(item.rightsStatus)}, ` +
          `${sql(item.provenanceStatus)}, ` +
          `true, ` +
          `${index}` +
          `)`
      )
      .join(
        ",\n"
      );

  const detailJson =
    JSON.stringify(
      detail
    );

  const canonicalPath =
    `/projects/${slug}`;

  const transaction =
    `
begin;

select
  pg_advisory_xact_lock(
    hashtext(
      'arknoz-project26-production-publication-v1'
    )
  );

do $publish$

declare
  seq_last bigint;
  seq_called boolean;

  p public.entities.id%type;
  a public.entities.arknoz_entity_id%type;

begin

  select
    last_value,
    is_called
  into
    seq_last,
    seq_called
  from public.arknoz_project_entity_seq;

  if (
    seq_last <>
      ${lastValue}
    or
    seq_called <>
      ${isCalled ? "true" : "false"}
  ) then
    raise exception
      'PUBLICATION BLOCKED: Project sequence changed before commit';
  end if;

  if exists (
    select 1
    from public.entities
    where
      slug =
        ${sql(slug)}
      or
      arknoz_entity_id =
        ${sql(expectedId)}
  ) then
    raise exception
      'PUBLICATION BLOCKED: slug or Arknoz ID already exists';
  end if;

  insert into public.entities (
    entity_type,
    slug,
    canonical_path,
    title,
    subtitle,
    summary,
    geography_label,
    geography_slug,
    trust_label,
    official_url,
    content_status,
    verification_status,
    detail,
    is_featured,
    sort_rank,
    last_verified_at,
    published_at
  )
  values (
    'project',
    ${sql(slug)},
    ${sql(canonicalPath)},
    ${sql(title)},
    ${sql(subtitle)},
    ${sql(summary)},
    ${sql(geographyLabel)},
    ${sql(geographySlug)},
    'Project26 READY',
    ${sql(officialUrl)},
    'published',
    'source_backed',
    ${sql(detailJson)}::jsonb,
    false,
    0,
    now(),
    now()
  )
  returning
    id,
    arknoz_entity_id
  into
    p,
    a;

  if a <>
    ${sql(expectedId)}
  then
    raise exception
      'PUBLICATION FAILED: expected ${expectedId}, got %',
      a;
  end if;

  insert into public.entity_subsections (
    entity_id,
    section_key,
    subsection_key
  )
  values (
    p,
    'projects',
    ${sql(subsectionKey)}
  );

  insert into public.entity_topics (
    entity_id,
    topic
  )
  values
${topicsValues};

  insert into public.entity_sources (
    entity_id,
    label,
    organisation,
    url,
    source_type,
    last_checked_at
  )
  values
${sourceValues};

  insert into public.entity_media (
    entity_id,
    role,
    url,
    alt,
    source_url,
    attribution,
    license,
    rights_status,
    provenance_status,
    publishable,
    sort_order
  )
  values
${mediaValues};

  if not exists (
    select 1
    from public.entities
    where
      id = p
      and
      arknoz_entity_id =
        ${sql(expectedId)}
      and
      slug =
        ${sql(slug)}
      and
      content_status =
        'published'
      and
      verification_status =
        'source_backed'
      and
      published_at is not null
  ) then
    raise exception
      'PUBLICATION FAILED: live entity verification failed';
  end if;

  if (
    select count(*)
    from public.entity_sources
    where entity_id = p
  ) <>
    ${sources.length}
  then
    raise exception
      'PUBLICATION FAILED: source count mismatch';
  end if;

  if (
    select count(*)
    from public.entity_media
    where
      entity_id = p
      and
      publishable = true
  ) <>
    ${uploadedMedia.length}
  then
    raise exception
      'PUBLICATION FAILED: media count mismatch';
  end if;

  if not exists (
    select 1
    from public.entity_subsections
    where
      entity_id = p
      and
      section_key =
        'projects'
      and
      subsection_key =
        ${sql(subsectionKey)}
  ) then
    raise exception
      'PUBLICATION FAILED: Project subsection missing';
  end if;

end;

$publish$;

commit;
`;

  console.log("");
  console.log(
    "=== DATABASE PUBLICATION ==="
  );

  runSupabaseSql(
    transaction,
    `DATABASE PUBLICATION — ${title}`,
    {
      showOutput:
        true,
    }
  );

  databaseCommitted =
    true;


  /* ============================================================
     POST-PUBLICATION VERIFY
     ============================================================ */

  const verifyOutput =
    runSupabaseSql(
      `
select
  'ARKNOZ_VERIFY|' ||
  e.arknoz_entity_id ||
  '|' ||
  e.slug ||
  '|' ||
  e.content_status ||
  '|' ||
  e.verification_status ||
  '|' ||
  (
    select count(*)::text
    from public.entity_sources s
    where s.entity_id =
      e.id
  ) ||
  '|' ||
  (
    select count(*)::text
    from public.entity_media m
    where
      m.entity_id =
        e.id
      and
      m.publishable =
        true
  ) ||
  '|' ||
  (
    select count(*)::text
    from public.entity_topics t
    where t.entity_id =
      e.id
  )
from public.entities e
where
  e.slug =
    ${sql(slug)}
limit 1;
`,
      "POST-PUBLICATION VERIFY",
      {
        showOutput:
          true,
      }
    );

  const verifyMatch =
    verifyOutput.match(
      /ARKNOZ_VERIFY\|(ARK-PRJ-\d{8})\|([^|]+)\|([^|]+)\|([^|]+)\|(\d+)\|(\d+)\|(\d+)/
    );

  if (!verifyMatch) {
    fail(
      "Published project could not be verified."
    );
  }

  if (
    verifyMatch[1] !== expectedId ||
    verifyMatch[2] !== slug ||
    verifyMatch[3] !== "published" ||
    verifyMatch[4] !== "source_backed" ||
    Number(
      verifyMatch[5]
    ) !==
      sources.length ||
    Number(
      verifyMatch[6]
    ) !==
      uploadedMedia.length
  ) {
    fail(
      `Published verification mismatch: ${verifyMatch[0]}`
    );
  }

  const auditDirectory =
    path.join(
      root,
      "research",
      "project26-md",
      "publication-audit"
    );

  fs.mkdirSync(
    auditDirectory,
    {
      recursive:
        true,
    }
  );

  const auditPath =
    path.join(
      auditDirectory,
      `${slug}-${Date.now()}.json`
    );

  fs.writeFileSync(
    auditPath,
    JSON.stringify(
      {
        schema:
          "arknoz-project26-production-publication-v1",

        publishedAt:
          new Date()
            .toISOString(),

        arknozEntityId:
          expectedId,

        slug,

        title,

        contentStatus:
          "published",

        verificationStatus:
          "source_backed",

        sources:
          sources.length,

        media:
          uploadedMedia.length,

        topics:
          Number(
            verifyMatch[7]
          ),

        subsection:
          subsectionKey,

        project26Gate:
          "READY",

        r2: {
          createdKeys:
            createdKeys.length,

          totalMedia:
            uploadedMedia.length,
        },
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("");
  console.log(
    "============================================================"
  );
  console.log(
    " PROJECT26 PRODUCTION PUBLICATION: PASS"
  );
  console.log(
    "============================================================"
  );
  console.log(
    `${expectedId} | ${title}`
  );
  console.log(
    `/projects/${slug}`
  );
  console.log(
    `Sources: ${sources.length}`
  );
  console.log(
    `Media  : ${uploadedMedia.length}`
  );
  console.log(
    `Topics : ${verifyMatch[7]}`
  );
  console.log(
    `Audit  : ${auditPath}`
  );
}
catch (error) {

  if (
    !databaseCommitted
  ) {
    await cleanupNewKeys();
  }

  throw error;
}