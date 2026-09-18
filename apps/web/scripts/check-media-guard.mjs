import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.resolve(process.cwd(), "src");
const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

const forbiddenImageUrl =
  /https?:\/\/(?:images\.unsplash\.com\/|[^\s"'`)>]*\/globalassets\/images\/|[^\s"'`)>]+\.(?:jpe?g|png|webp|avif|gif|svg)(?:\?[^\s"'`)>]*)?)/i;

const violations = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!codeExtensions.has(path.extname(entry.name))) {
      continue;
    }

    if (entry.name.includes(".bak-")) {
      continue;
    }

    const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      if (forbiddenImageUrl.test(line)) {
        violations.push({
          file: path.relative(process.cwd(), fullPath),
          line: index + 1,
          text: line.trim(),
        });
      }
    });
  }
}

walk(sourceRoot);

if (violations.length > 0) {
  console.error(
    `\n[Arknoz media guard] FAIL · ${violations.length} direct external image URL(s) found.\n`
  );

  for (const violation of violations) {
    console.error(
      `${violation.file}:${violation.line}\n  ${violation.text}\n`
    );
  }

  console.error(
    "Use approved entity_media or an Arknoz-controlled /public visual instead."
  );

  process.exit(1);
}

console.log(
  "[Arknoz media guard] valid · no direct external image URLs in active source"
);
