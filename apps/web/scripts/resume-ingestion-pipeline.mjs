import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const manifestKey = process.argv[2];

if (!manifestKey) {
  console.error("");
  console.error("ARKNOZ RESUME PIPELINE: FAIL");
  console.error("Provide an existing R2 manifest key.");
  console.error("");
  process.exit(1);
}

const root = process.cwd();

function scriptPath(name) {
  return path.join(root, "scripts", name);
}

const requiredScripts = [
  "build-page-evidence.mjs",
  "extract-fact-candidates.mjs",
  "map-project-candidates.mjs",
  "validate-project-candidates.mjs",
  "promote-safe-facts.mjs",
  "build-semantic-review-package.mjs",
  "semantic-review-ai.mjs",
  "audit-semantic-review.mjs",
  "reconcile-semantic-review.mjs",
  "verify-source-backed-facts.mjs",
  "publication-gate.mjs",
  "create-source-declaration.mjs",
];

for (const script of requiredScripts) {
  const target = scriptPath(script);

  if (!fs.existsSync(target)) {
    console.error("");
    console.error("ARKNOZ RESUME PIPELINE: FAIL");
    console.error(`Missing script: scripts\\${script}`);
    console.error("");
    process.exit(1);
  }
}

function runStage(number, title, script) {
  console.log("");
  console.log("================================================");
  console.log(`STAGE ${number} — ${title}`);
  console.log("================================================");

  const result = spawnSync(
    process.execPath,
    [
      scriptPath(script),
      manifestKey,
    ],
    {
      env: process.env,
      encoding: "utf8",
      stdio: [
        "inherit",
        "pipe",
        "pipe",
      ],
    }
  );

  const stdout = result.stdout || "";
  const stderr = result.stderr || "";

  if (stdout.trim()) {
    console.log(stdout.trim());
  }

  if (result.status !== 0) {
    if (stderr.trim()) {
      console.error(stderr.trim());
    }

    console.error("");
    console.error(
      `ARKNOZ RESUME PIPELINE STOPPED AT STAGE ${number}`
    );
    console.error(`SCRIPT: ${script}`);
    console.error("");

    process.exit(result.status || 1);
  }

  return stdout;
}

function readyForVerification(stdout) {
  return /READY FOR VERIFICATION:\s*YES/i.test(
    stdout
  );
}

console.log("");
console.log("################################################");
console.log("#                                              #");
console.log("#        ARKNOZ RESUME PIPELINE                #");
console.log("#                                              #");
console.log("################################################");
console.log("");

console.log(`MANIFEST: ${manifestKey}`);
console.log("STARTING FROM: PROJECT MASTER CREATED");
console.log("PUBLICATION: BLOCKED");
console.log("");

//
// STAGE 4
//

runStage(
  "04",
  "PAGE-LEVEL EVIDENCE INDEX",
  "build-page-evidence.mjs"
);

//
// STAGE 5
//

runStage(
  "05",
  "FACT CANDIDATE EXTRACTION",
  "extract-fact-candidates.mjs"
);

//
// STAGE 6
//

runStage(
  "06",
  "PROJECT CANDIDATE MAPPING",
  "map-project-candidates.mjs"
);

//
// STAGE 7
//

runStage(
  "07",
  "QUALITY CONTROL",
  "validate-project-candidates.mjs"
);

//
// STAGE 8
//

runStage(
  "08",
  "SAFE PROVISIONAL PROMOTION",
  "promote-safe-facts.mjs"
);

//
// STAGE 9
//

runStage(
  "09",
  "SEMANTIC REVIEW PACKAGE",
  "build-semantic-review-package.mjs"
);

//
// STAGE 10
//

runStage(
  "10",
  "EVIDENCE-CONSTRAINED AI REVIEW",
  "semantic-review-ai.mjs"
);

//
// STAGE 11A
//

let auditOutput = runStage(
  "11A",
  "SEMANTIC VALIDATION AUDIT",
  "audit-semantic-review.mjs"
);

let ready =
  readyForVerification(
    auditOutput
  );

//
// STAGE 11B — only if necessary
//

if (!ready) {
  console.log("");
  console.log(
    "Incomplete semantic coverage detected."
  );

  console.log(
    "Running targeted reconciliation..."
  );

  runStage(
    "11B",
    "TARGETED SEMANTIC RECONCILIATION",
    "reconcile-semantic-review.mjs"
  );

  //
  // STAGE 11C
  //

  auditOutput = runStage(
    "11C",
    "POST-RECONCILIATION AUDIT",
    "audit-semantic-review.mjs"
  );

  ready =
    readyForVerification(
      auditOutput
    );
}

//
// HARD SAFETY STOP
//

if (!ready) {
  console.log("");
  console.log("################################################");
  console.log("#          ARKNOZ REVIEW HOLD                  #");
  console.log("################################################");
  console.log("");

  console.log(
    "Semantic validation is not clean enough for source verification."
  );

  console.log(
    "SOURCE VERIFICATION: NOT RUN"
  );

  console.log(
    "PUBLICATION: BLOCKED"
  );

  console.log(
    `MANIFEST: ${manifestKey}`
  );

  console.log("");

  process.exit(0);
}

//
// STAGE 12
//

runStage(
  "12",
  "SOURCE-BACKED FACT VERIFICATION",
  "verify-source-backed-facts.mjs"
);

//
// STAGE 13
//

runStage(
  "13",
  "PUBLICATION SAFETY GATE",
  "publication-gate.mjs"
);

//
// STAGE 14
//

runStage(
  "14",
  "SOURCE / CONTRIBUTOR DECLARATION",
  "create-source-declaration.mjs"
);

//
// COMPLETE
//

console.log("");
console.log("################################################");
console.log("#                                              #");
console.log("#     ARKNOZ RESUME PIPELINE COMPLETE          #");
console.log("#                                              #");
console.log("################################################");
console.log("");

console.log("PROJECT MASTER: PASS");
console.log("PAGE EVIDENCE: PASS");
console.log("FACT EXTRACTION: PASS");
console.log("12-DIMENSION MAPPING: PASS");
console.log("QUALITY CONTROL: PASS");
console.log("SEMANTIC REVIEW: PASS");
console.log("SEMANTIC VALIDATION: PASS");
console.log("SOURCE VERIFICATION: COMPLETE");
console.log("SOURCE DECLARATION: CREATED");

console.log("");

console.log("SOURCE AUTHORITY: PENDING");
console.log("RIGHTS: PENDING");
console.log("PUBLICATION: BLOCKED");

console.log("");

console.log(
  "FINAL STATUS: AWAITING CONTRIBUTOR DECLARATION"
);

console.log("");

console.log(
  `MANIFEST: ${manifestKey}`
);

console.log("");