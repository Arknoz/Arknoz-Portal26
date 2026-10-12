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
    "Usage: node scripts/validate-project26-md.cjs <json-file|folder> [report.json]"
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


function loadTs(
  filePath
) {

  const source =
    fs.readFileSync(
      filePath,
      "utf8"
    );


  const result =
    ts.transpileModule(
      source,
      {
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
      result.diagnostics ||
      []
    ).filter(
      (diagnostic) =>
        diagnostic.category ===
        ts.DiagnosticCategory.Error
    );


  if (errors.length) {

    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(
        errors,
        {
          getCanonicalFileName:
            (name) => name,

          getCurrentDirectory:
            () => root,

          getNewLine:
            () => "\n",
        }
      )
    );
  }


  const mod = {
    exports: {},
  };


  const localRequire =
    (specifier) => {

      if (
        typeof specifier === "string" &&
        specifier.startsWith("@/")
      ) {

        const basePath =
          path.join(
            root,
            "src",
            specifier.slice(2)
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
            `Validator cannot resolve Arknoz alias: ${specifier}`
          );
        }

        if (
          resolved.endsWith(".ts") ||
          resolved.endsWith(".tsx")
        ) {
          return loadTs(
            resolved
          );
        }

        return require(
          resolved
        );
      }

      return require(
        specifier
      );
    };


  vm.runInThisContext(
    `(function(require,module,exports){${result.outputText}\n})`,
    {
      filename:
        filePath,
    }
  )(
    localRequire,
    mod,
    mod.exports
  );


  return mod.exports;
}


function readJson(
  filePath
) {

  return JSON.parse(
    fs
      .readFileSync(
        filePath,
        "utf8"
      )
      .replace(
        /^\uFEFF/,
        ""
      )
  );
}


const md =
  loadTs(
    mdPath
  );


if (
  typeof md.validateProject26MD !==
  "function" ||
  typeof md.buildProject26MDRendererModel !==
  "function"
) {

  throw new Error(
    "Project 26 MD exports are incomplete."
  );
}


const inputPath =
  path.resolve(
    inputArg
  );


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
          (file) =>
            file
              .toLowerCase()
              .endsWith(
                ".json"
              )
        )
        .sort()
        .map(
          (file) =>
            path.join(
              inputPath,
              file
            )
        )

    : [
        inputPath,
      ];


const projects =
  [];


for (
  const file
  of files
) {

  const record =
    readJson(
      file
    );


  const projectRecord =
    record &&
    typeof record === "object" &&
    record.project &&
    typeof record.project === "object"
      ? record.project
      : record;


  const validation =
    md.validateProject26MD(
      projectRecord
    );


  let rendererMetrics =
    null;


  if (
    validation.ready
  ) {

    const renderer =
      md.buildProject26MDRendererModel(
        projectRecord
      );


    const structured =
      renderer.structuredRecord;


    const populatedSections =
      Object.values(
        structured
      ).filter(
        (items) =>
          Array.isArray(
            items
          ) &&
          items.length > 0
      ).length;


    rendererMetrics = {

      publicProfile:
        renderer.publicProfile.length,

      structuredSections:
        populatedSections,

      sources:
        renderer.sources.length,

      media:
        renderer.media.length,

      documents:
        renderer.documents.length,
    };
  }


  projects.push({

    file:
      path.relative(
        root,
        file
      ),

    slug:
      projectRecord?.identity?.slug ||
      "(missing)",

    ready:
      validation.ready,

    gates:
      validation.gates,

    metrics:
      validation.metrics,

    rendererMetrics,

    issues:
      validation.issues,
  });
}


const ready =
  projects.filter(
    (project) =>
      project.ready
  ).length;


const hold =
  projects.length -
  ready;


const report = {

  schema:
    "arknoz-project26-md-audit-v1",

  version:
    md.PROJECT26_MD_VERSION,

  projects:
    projects.length,

  summary: {
    ready,
    hold,
  },

  safeguards: {
    databaseWrites:
      false,

    productionWrites:
      false,

    publication:
      false,
  },

  results:
    projects,
};


for (
  const project
  of projects
) {

  console.log(
    [
      project.ready
        ? "READY"
        : "HOLD ",

      project.slug,

      `R01=${project.metrics.record01Claims}`,

      `R01groups=${project.metrics.record01Families}`,

      `R02=${project.metrics.record02Claims}`,

      `R02sections=${project.metrics.record02Sections}`,

      `sources=${project.metrics.sources}`,

      `media=${project.metrics.media}`,

      `evidence=${project.metrics.evidenceCoverage}%`,
    ].join(
      " | "
    )
  );
}


if (outputArg) {

  const output =
    path.resolve(
      outputArg
    );


  fs.mkdirSync(
    path.dirname(
      output
    ),
    {
      recursive:
        true,
    }
  );


  fs.writeFileSync(
    output,
    JSON.stringify(
      report,
      null,
      2
    ) + "\n",
    "utf8"
  );
}


console.log("");
console.log(
  `READY: ${ready}`
);
console.log(
  `HOLD : ${hold}`
);
console.log(
  "DATABASE WRITE: NONE"
);