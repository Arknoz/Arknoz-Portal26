import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const sourceFile = process.argv[2];

if (
  !sourceFile ||
  !fs.existsSync(sourceFile)
) {
  console.error("");
  console.error(
    "ARKNOZ INGESTION PIPELINE: FAIL"
  );
  console.error(
    "Provide a valid source file path."
  );
  console.error("");
  process.exit(1);
}

const root = process.cwd();

function scriptPath(name) {
  return path.join(
    root,
    "scripts",
    name
  );
}

const requiredScripts = [
  "ingest-upload.mjs",
  "process-import.mjs",
  "build-project-master.mjs",
  "build-page-evidence.mjs",
  "build-visual-evidence.mjs",
  "extract-fact-candidates.mjs",
  "map-project-candidates.mjs",
  "validate-project-candidates.mjs",
  "promote-safe-facts.mjs",
  "build-semantic-review-package.mjs",
  "semantic-review-ai.mjs",
  "audit-semantic-review.mjs",
  "verify-source-backed-facts.mjs",
  "publication-gate.mjs",
  "create-source-declaration.mjs",
];

for (
  const script of
    requiredScripts
) {
  const target =
    scriptPath(script);

  if (
    !fs.existsSync(target)
  ) {
    console.error("");
    console.error(
      "ARKNOZ INGESTION PIPELINE: FAIL"
    );
    console.error(
      `Missing script: scripts\\${script}`
    );
    console.error("");
    process.exit(1);
  }
}

function runStage({
  number,
  title,
  script,
  args = [],
}) {
  console.log("");
  console.log(
    "================================================"
  );
  console.log(
    `STAGE ${number} — ${title}`
  );
  console.log(
    "================================================"
  );

  const result =
    spawnSync(
      process.execPath,
      [
        scriptPath(script),
        ...args,
      ],
      {
        env:
          process.env,

        encoding:
          "utf8",

        stdio: [
          "inherit",
          "pipe",
          "pipe",
        ],

        maxBuffer:
          10 *
          1024 *
          1024,
      }
    );

  const stdout =
    result.stdout ||
    "";

  const stderr =
    result.stderr ||
    "";

  if (
    stdout.trim()
  ) {
    console.log(
      stdout.trim()
    );
  }

  if (
    result.status !== 0
  ) {
    if (
      stderr.trim()
    ) {
      console.error(
        stderr.trim()
      );
    }

    console.error("");
    console.error(
      `ARKNOZ PIPELINE STOPPED AT STAGE ${number}`
    );
    console.error(
      `SCRIPT: ${script}`
    );
    console.error("");
    console.error(
      "PUBLICATION: BLOCKED"
    );
    console.error("");

    process.exit(
      result.status ||
      1
    );
  }

  return {
    stdout,
    stderr,
    status:
      result.status,
  };
}

function extractManifestKey(
  stdout
) {
  const match =
    String(stdout)
      .match(
        /MANIFEST:\s*(.+)/
      );

  if (!match) {
    return null;
  }

  return match[1]
    .trim();
}

function auditReady(
  stdout
) {
  return /READY FOR VERIFICATION:\s*YES/i.test(
    String(stdout)
  );
}

console.log("");
console.log(
  "################################################"
);
console.log(
  "#                                              #"
);
console.log(
  "#      ARKNOZ PROJECT INGESTION PIPELINE       #"
);
console.log(
  "#                  v3                          #"
);
console.log(
  "#                                              #"
);
console.log(
  "################################################"
);
console.log("");

console.log(
  `SOURCE FILE: ${sourceFile}`
);

console.log("");
console.log(
  "MODE: PRIVATE / EVIDENCE-FIRST / MULTIMODAL"
);
console.log(
  "TEXT ANALYSIS: ENABLED"
);
console.log(
  "VISUAL DRAWING ANALYSIS: CONDITIONAL"
);
console.log(
  "AUTO-VERIFICATION: DISABLED"
);
console.log(
  "AUTO-PUBLICATION: DISABLED"
);
console.log("");

/*
 * ==============================================
 * STAGE 01
 * PRIVATE R2 INGESTION
 * ==============================================
 */

const ingestion =
  runStage({
    number:
      "01",

    title:
      "PRIVATE R2 INGESTION",

    script:
      "ingest-upload.mjs",

    args: [
      sourceFile,
    ],
  });

const manifestKey =
  extractManifestKey(
    ingestion.stdout
  );

if (!manifestKey) {
  console.error("");
  console.error(
    "ARKNOZ PIPELINE: FAIL"
  );
  console.error(
    "Could not determine manifest key from Stage 01."
  );
  console.error(
    "PUBLICATION: BLOCKED"
  );
  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  `IMPORT MANIFEST: ${manifestKey}`
);

/*
 * ==============================================
 * STAGE 02
 * DOCUMENT PROCESSING + CLASSIFICATION
 * ==============================================
 */

runStage({
  number:
    "02",

  title:
    "DOCUMENT PROCESSING & CLASSIFICATION",

  script:
    "process-import.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 03
 * PROJECT MASTER
 *
 * Current runner is intentionally Project-specific.
 * Non-project entities must route to their own
 * future entity pipelines rather than being forced
 * into Project Master.
 * ==============================================
 */

runStage({
  number:
    "03",

  title:
    "PROJECT MASTER v1",

  script:
    "build-project-master.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 04
 * PAGE EVIDENCE
 * ==============================================
 */

runStage({
  number:
    "04",

  title:
    "PAGE-LEVEL EVIDENCE INDEX",

  script:
    "build-page-evidence.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 04B
 * VISUAL DRAWING EVIDENCE
 *
 * build-visual-evidence.mjs decides whether
 * visual analysis is required.
 *
 * Text-rich non-drawing PDFs may be skipped.
 *
 * Drawing / low-text PDFs are rendered privately
 * and visually analysed.
 *
 * Rendered images remain ephemeral.
 * ==============================================
 */

runStage({
  number:
    "04B",

  title:
    "VISUAL DRAWING EVIDENCE",

  script:
    "build-visual-evidence.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 05
 * TEXT + VISUAL CANDIDATE POOL
 * ==============================================
 */

runStage({
  number:
    "05",

  title:
    "TEXT + VISUAL FACT EXTRACTION",

  script:
    "extract-fact-candidates.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 06
 * PROJECT CANDIDATE MAPPING
 * ==============================================
 */

runStage({
  number:
    "06",

  title:
    "PROJECT CANDIDATE MAPPING",

  script:
    "map-project-candidates.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 07
 * MULTIMODAL QC
 *
 * Text and visual evidence follow separate
 * QC rules.
 *
 * Visual observations cannot be automatically
 * promoted merely because they are readable.
 * ==============================================
 */

runStage({
  number:
    "07",

  title:
    "MULTIMODAL QUALITY CONTROL",

  script:
    "validate-project-candidates.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 08
 * SAFE PROVISIONAL PROMOTION
 * ==============================================
 */

runStage({
  number:
    "08",

  title:
    "SAFE PROVISIONAL PROMOTION",

  script:
    "promote-safe-facts.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 09
 * SEMANTIC REVIEW PACKAGE
 * ==============================================
 */

runStage({
  number:
    "09",

  title:
    "SEMANTIC REVIEW PACKAGE",

  script:
    "build-semantic-review-package.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 10
 * AI SEMANTIC REVIEW
 *
 * Current Stage 10 is visual-aware.
 *
 * It:
 * - receives visual provenance
 * - separates document metadata from Project facts
 * - prevents drawing labels becoming geography
 * - prevents drawing title becoming Project title
 * - caps visual proposal confidence
 * - defaults missing dispositions to uncertain
 * ==============================================
 */

runStage({
  number:
    "10",

  title:
    "EVIDENCE-CONSTRAINED AI SEMANTIC REVIEW",

  script:
    "semantic-review-ai.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 11
 * DETERMINISTIC SEMANTIC AUDIT
 * ==============================================
 */

const audit =
  runStage({
    number:
      "11",

    title:
      "DETERMINISTIC SEMANTIC VALIDATION",

    script:
      "audit-semantic-review.mjs",

    args: [
      manifestKey,
    ],
  });

const ready =
  auditReady(
    audit.stdout
  );

/*
 * ==============================================
 * HARD SAFETY HOLD
 *
 * Old automatic reconciliation is deliberately
 * NOT used here.
 *
 * Current Stage 10 already guarantees candidate
 * disposition. Any remaining audit failure should
 * be inspected rather than silently repaired.
 * ==============================================
 */

if (!ready) {
  console.log("");
  console.log(
    "################################################"
  );
  console.log(
    "#                                              #"
  );
  console.log(
    "#          ARKNOZ REVIEW HOLD                  #"
  );
  console.log(
    "#                                              #"
  );
  console.log(
    "################################################"
  );
  console.log("");

  console.log(
    "SEMANTIC VALIDATION: NOT CLEAN"
  );

  console.log(
    "SOURCE VERIFICATION: NOT RUN"
  );

  console.log(
    "PUBLICATION GATE: NOT RUN"
  );

  console.log(
    "SOURCE DECLARATION: NOT CREATED"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log("");

  console.log(
    "FINAL STATUS: MANUAL SEMANTIC REVIEW REQUIRED"
  );

  console.log("");

  console.log(
    `MANIFEST: ${manifestKey}`
  );

  console.log("");

  process.exit(0);
}

/*
 * ==============================================
 * STAGE 12
 * SOURCE-BACKED VERIFICATION
 *
 * Text evidence:
 *   page + page text hash
 *
 * Visual evidence:
 *   candidate ID
 *   source page
 *   visual evidence record
 *   render SHA-256
 *   visible basis
 *   semantic field guard
 *
 * Source-verified is NOT independently verified.
 * ==============================================
 */

runStage({
  number:
    "12",

  title:
    "SOURCE-BACKED FACT VERIFICATION",

  script:
    "verify-source-backed-facts.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 13
 * PUBLICATION GATE
 *
 * Extraction success alone NEVER permits
 * publication.
 *
 * Authority and rights remain separate gates.
 * ==============================================
 */

runStage({
  number:
    "13",

  title:
    "PUBLICATION SAFETY GATE",

  script:
    "publication-gate.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * STAGE 14
 * CONTRIBUTOR / SOURCE DECLARATION TEMPLATE
 *
 * No authority or rights are invented.
 *
 * The production web form will populate this
 * declaration later.
 * ==============================================
 */

runStage({
  number:
    "14",

  title:
    "SOURCE / CONTRIBUTOR DECLARATION",

  script:
    "create-source-declaration.mjs",

  args: [
    manifestKey,
  ],
});

/*
 * ==============================================
 * FINAL PIPELINE STATE
 *
 * Stage 15 authority review is intentionally
 * NOT executed here.
 *
 * It runs only AFTER the contributor declaration
 * has actually been submitted/populated.
 * ==============================================
 */

console.log("");
console.log(
  "################################################"
);
console.log(
  "#                                              #"
);
console.log(
  "#       ARKNOZ INGESTION COMPLETE              #"
);
console.log(
  "#                                              #"
);
console.log(
  "################################################"
);
console.log("");

console.log(
  "PRIVATE SOURCE STORAGE: PASS"
);

console.log(
  "DOCUMENT PROCESSING: PASS"
);

console.log(
  "PROJECT CLASSIFICATION: PASS"
);

console.log(
  "PROJECT MASTER: PASS"
);

console.log(
  "PAGE EVIDENCE: PASS"
);

console.log(
  "VISUAL EVIDENCE: COMPLETE / NOT REQUIRED"
);

console.log(
  "TEXT + VISUAL FACT EXTRACTION: PASS"
);

console.log(
  "12-DIMENSION MAPPING: PASS"
);

console.log(
  "MULTIMODAL QUALITY CONTROL: PASS"
);

console.log(
  "SEMANTIC AI REVIEW: PASS"
);

console.log(
  "SEMANTIC VALIDATION: PASS"
);

console.log(
  "SOURCE VERIFICATION: COMPLETE"
);

console.log(
  "PUBLICATION SAFETY GATE: COMPLETE"
);

console.log(
  "SOURCE DECLARATION: CREATED"
);

console.log("");

console.log(
  "INDEPENDENT VERIFICATION: NOT AUTOMATIC"
);

console.log(
  "SOURCE AUTHORITY: PENDING"
);

console.log(
  "RIGHTS: PENDING"
);

console.log(
  "PUBLICATION: BLOCKED"
);

console.log("");

console.log(
  "FINAL STATUS: AWAITING CONTRIBUTOR DECLARATION"
);

console.log("");

console.log(
  `MANIFEST: ${manifestKey}`
);

console.log("");