import fs from "node:fs";
import path from "node:path";

const appRoot = path.resolve("src/app");

const allowedDirectFooterPages = new Set([
  "access-denied/page.tsx",
  "join/page.tsx",
  "sign-in/page.tsx",
  "unavailable/page.tsx",
  "not-found.tsx",
]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(full);
    }

    return [full];
  });
}

const files = walk(appRoot).filter(
  (file) =>
    file.endsWith("page.tsx") ||
    file.endsWith("not-found.tsx")
);

const violations = [];

for (const file of files) {
  const relative = path
    .relative(appRoot, file)
    .replaceAll("\\", "/");

  const source = fs.readFileSync(file, "utf8");

  const functionalArea =
    relative.startsWith("admin/") ||
    relative.startsWith("dashboard/");

  if (functionalArea) {
    continue;
  }

  if (allowedDirectFooterPages.has(relative)) {
    continue;
  }

  if (
    source.includes('GlobalFooter') &&
    !source.includes('UniversalPublicLastScreen')
  ) {
    violations.push(
      `${relative}: public page uses GlobalFooter directly`
    );
  }

  if (
    source.includes('UniversalArknozLastScreen') &&
    !source.includes('UniversalPublicLastScreen')
  ) {
    violations.push(
      `${relative}: public page uses UniversalArknozLastScreen directly`
    );
  }
}

if (violations.length > 0) {
  console.error("\nARKNOZ PUBLIC ENDING GUARD FAILED\n");

  for (const violation of violations) {
    console.error(`- ${violation}`);
  }

  console.error(
    "\nPublic Arknoz pages must use UniversalPublicLastScreen."
  );

  process.exit(1);
}

console.log(
  "ARKNOZ PUBLIC ENDING GUARD PASSED"
);
