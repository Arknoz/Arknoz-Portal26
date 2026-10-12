const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const inputArg =
  process.argv[2];

const outputArg =
  process.argv[3];

if (!inputArg) {
  throw new Error(
    "Usage: node scripts/project26-publication-gate.cjs <project26-md-research-package-folder|file> [report.json]"
  );
}

const root =
  process.cwd();

const mdPath =
  path.join(
    root,
    "src",
    "lib",
    "project26-md.ts"
  );

const researchPath =
  path.join(
    root,
    "src",
    "lib",
    "project26-md-research-package.ts"
  );

const contributionsPath =
  path.join(
    root,
    "src",
    "lib",
    "contributions",
    "r2-upload.ts"
  );

function readJson(file) {
  return JSON.parse(
    fs
      .readFileSync(
        file,
        "utf8"
      )
      .replace(
        /^\uFEFF/,
        ""
      )
  );
}

function loadTs(
  file,
  requireMap = {}
) {
  const compiled =
    ts.transpileModule(
      fs.readFileSync(
        file,
        "utf8"
      ),
      {
        fileName: file,

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
      compiled.diagnostics ||
      []
    ).filter(
      (item) =>
        item.category ===
        ts.DiagnosticCategory.Error
    );

  if (errors.length) {
    throw new Error(
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

  const localRequire =
    (id) => {
      if (
        Object.prototype.hasOwnProperty.call(
          requireMap,
          id
        )
      ) {
        return requireMap[id];
      }

      if (
        typeof id === "string" &&
        id.startsWith("@/")
      ) {
        const basePath =
          path.join(
            root,
            "src",
            id.slice(2)
          );

        const candidates = [
          basePath,
          `${basePath}.ts`,
          `${basePath}.tsx`,
          `${basePath}.js`,
          `${basePath}.cjs`,
          path.join(basePath, "index.ts"),
          path.join(basePath, "index.tsx"),
          path.join(basePath, "index.js"),
          path.join(basePath, "index.cjs"),
        ];

        const resolved =
          candidates.find(
            (candidate) =>
              fs.existsSync(candidate)
          );

        if (!resolved) {
          throw new Error(
            `Publication gate cannot resolve Arknoz alias: ${id}`
          );
        }

        if (
          resolved.endsWith(".ts") ||
          resolved.endsWith(".tsx")
        ) {
          return loadTs(
            resolved,
            requireMap
          );
        }

        return require(
          resolved
        );
      }

      return require(id);
    };

  vm.runInThisContext(
    `(function(require,module,exports){${compiled.outputText}\n})`,
    {
      filename: file,
    }
  )(
    localRequire,
    mod,
    mod.exports
  );

  return mod.exports;
}

const md =
  loadTs(
    mdPath
  );

const research =
  loadTs(
    researchPath,
    {
      "@/lib/project26-md":
        md,
    }
  );

let contributionsModule =
  null;

function getContributionsModule() {

  if (
    contributionsModule
  ) {
    return contributionsModule;
  }

  contributionsModule =
    loadTs(
      contributionsPath
    );

  if (
    typeof contributionsModule
      .getApprovedProject26ContributorIntake !==
    "function"
  ) {
    throw new Error(
      "Approved Project26 contributor intake provider is unavailable."
    );
  }

  return contributionsModule;
}

if (
  typeof md.validateProject26MD !==
  "function"
) {
  throw new Error(
    "validateProject26MD export unavailable."
  );
}

if (
  typeof research.ingestProject26MDResearchPackage !==
  "function"
) {
  throw new Error(
    "ingestProject26MDResearchPackage export unavailable."
  );
}

const inputPath =
  path.resolve(
    root,
    inputArg
  );

if (!fs.existsSync(inputPath)) {
  throw new Error(
    `Input does not exist: ${inputPath}`
  );
}

const stat =
  fs.statSync(
    inputPath
  );

const files =
  stat.isDirectory()
    ? fs
        .readdirSync(
          inputPath
        )
        .filter(
          (name) =>
            name
              .toLowerCase()
              .endsWith(
                ".json"
              )
        )
        .sort()
        .map(
          (name) =>
            path.join(
              inputPath,
              name
            )
        )
    : [
        inputPath,
      ];

if (files.length === 0) {
  throw new Error(
    "No Project 26 MD research packages found."
  );
}

(async () => {

const queue =
  [];

const seenSlugs =
  new Set();

for (const file of files) {
  try {
    const candidate =
      readJson(
        file
      );

    let effectiveCandidate =
      candidate;

    const contributorProvenance = {
      required:
        candidate
          ?.research
          ?.intake
          ?.route ===
        "contributor-submitted",

      verified:
        true,

      source:
        "not-required",

      manifestKey:
        null,

      reviewedAt:
        null,

      reviewedByUserId:
        null,

      error:
        null,
    };

    const provenanceIssues =
      [];

    if (
      contributorProvenance
        .required
    ) {

      contributorProvenance
        .verified =
        false;

      contributorProvenance
        .source =
        "r2-admin-review";

      const manifestKey =
        String(
          candidate
            ?.research
            ?.intake
            ?.contributorManifestKey ||
          ""
        )
          .trim();

      contributorProvenance
        .manifestKey =
        manifestKey ||
        null;

      try {

        if (!manifestKey) {
          throw new Error(
            "Contributor manifest key is missing."
          );
        }

        const contributions =
          getContributionsModule();

        const approvedIntake =
          await contributions
            .getApprovedProject26ContributorIntake(
              manifestKey
            );

        /*
         * Do not trust package booleans.
         *
         * Replace the contributor intake control fields
         * with values returned by the authoritative R2
         * Admin-review record.
         */
        effectiveCandidate = {
          ...candidate,

          research: {
            ...candidate.research,

            intake: {
              route:
                approvedIntake
                  .route,

              adminReviewCompleted:
                approvedIntake
                  .adminReviewCompleted,

              contributorManifestKey:
                approvedIntake
                  .contributorManifestKey,

              contributorDeclarationVerified:
                approvedIntake
                  .contributorDeclarationVerified,
            },
          },
        };

        contributorProvenance
          .verified =
          true;

        contributorProvenance
          .reviewedAt =
          approvedIntake
            ?.reviewProvenance
            ?.reviewedAt ||
          null;

        contributorProvenance
          .reviewedByUserId =
          approvedIntake
            ?.reviewProvenance
            ?.reviewedByUserId ||
          null;
      }
      catch (error) {

        contributorProvenance
          .error =
          error?.message ||
          String(
            error
          );

        provenanceIssues.push({
          code:
            "MD_CONTRIBUTOR_ADMIN_PROVENANCE_UNVERIFIED",

          message:
            `Contributor-submitted Project26 intake requires authoritative R2 Admin approval: ${contributorProvenance.error}`,
        });
      }
    }

    const ingest =
      research
        .ingestProject26MDResearchPackage(
          effectiveCandidate
        );

    const record =
      ingest.record;

    const validation =
      ingest.mdValidation ||
      (
        record
          ? md.validateProject26MD(
              record
            )
          : null
      );

    const packageIssues =
      Array.isArray(
        ingest.packageIssues
      )
        ? ingest.packageIssues
        : [];

    const slug =
      String(
        record
          ?.identity
          ?.slug ||
        path.basename(
          file,
          ".json"
        )
      )
        .trim()
        .toLowerCase();

    const duplicate =
      seenSlugs.has(
        slug
      );

    seenSlugs.add(
      slug
    );

    const identityIssues =
      [];

    if (!slug) {
      identityIssues.push({
        code:
          "MD_PROJECT_SLUG_MISSING",

        message:
          "Canonical Project 26 MD slug is missing.",
      });
    }

    if (duplicate) {
      identityIssues.push({
        code:
          "MD_DUPLICATE_PROJECT_SLUG",

        message:
          `Duplicate Project 26 MD slug: ${slug}.`,
      });
    }

    const mdPass =
      validation?.ready ===
      true;

    const researchPackagePass =
      packageIssues.length ===
        0 &&
      provenanceIssues.length ===
        0;

    const launchReady =
      ingest.ready ===
        true &&
      mdPass &&
      researchPackagePass &&
      identityIssues.length ===
        0;

    queue.push({
      slug,

      file:
        path.relative(
          root,
          file
        ),

      release:
        launchReady
          ? "READY"
          : "HOLD",

      launchReady,

      mdPass,

      researchPackagePass,

      issues: [
        ...(
          validation?.issues ||
          []
        ),

        ...packageIssues,
        ...provenanceIssues,
        ...identityIssues,
      ],

      metrics:
        validation?.metrics ||
        {},

      gates:
        validation?.gates ||
        null,

      contributorAdminProvenance:
        contributorProvenance,

      inputMode:
        "project26-md-research-package",
    });
  }
  catch (error) {
    queue.push({
      slug:
        path.basename(
          file,
          ".json"
        ),

      file:
        path.relative(
          root,
          file
        ),

      release:
        "HOLD",

      launchReady:
        false,

      mdPass:
        false,

      researchPackagePass:
        false,

      issues: [
        {
          code:
            "PROJECT26_MD_PACKAGE_INVALID",

          message:
            error?.message ||
            String(
              error
            ),
        },
      ],

      metrics: {},

      gates:
        null,

      inputMode:
        "project26-md-research-package",
    });
  }
}

const ready =
  queue.filter(
    (item) =>
      item.release ===
      "READY"
  ).length;

const hold =
  queue.length -
  ready;

const report = {
  schema:
    "arknoz-project26-md-publication-gate-v1",

  generatedAt:
    new Date()
      .toISOString(),

  policy: {
    project26MDRequired:
      true,

    independentRelease:
      true,

    contributorAdminApprovalRequired:
      true,

    contributorApprovalAuthority:
      "r2-admin-review",

    packageSuppliedContributorFlagsTrusted:
      false,

    databaseWrites:
      false,

    publication:
      false,
  },

  totals: {
    projects:
      queue.length,

    ready,

    hold,
  },

  queue,
};

const reportPath =
  outputArg
    ? path.resolve(
        root,
        outputArg
      )
    : path.join(
        root,
        "research",
        "project26-md",
        "project26-md-publication-report.json"
      );

fs.mkdirSync(
  path.dirname(
    reportPath
  ),
  {
    recursive:
      true,
  }
);

fs.writeFileSync(
  reportPath,
  JSON.stringify(
    report,
    null,
    2
  ) +
  "\n",
  "utf8"
);

console.log("");
console.log(
  "============================================================"
);

console.log(
  " PROJECT 26 MD — PUBLICATION GATE"
);

console.log(
  "============================================================"
);

for (const item of queue) {
  console.log(
    `${item.release.padEnd(5)} | ${item.slug} | md=${item.mdPass ? "pass" : "fail"} | research=${item.researchPackagePass ? "pass" : "fail"}`
  );
}

console.log("");
console.log(
  `READY : ${ready}`
);

console.log(
  `HOLD  : ${hold}`
);

console.log(
  `REPORT: ${reportPath}`
);

console.log(
  "DATABASE WRITE: NONE"
);

console.log(
  "RELEASE RULE  : EACH PROJECT IS INDEPENDENT"
);

console.log(
  "CONTRIBUTOR APPROVAL: AUTHORITATIVE R2 ADMIN REVIEW"
);

})().catch(
  (error) => {

    console.error(
      error?.stack ||
      error?.message ||
      String(
        error
      )
    );

    process.exitCode =
      1;
  }
);