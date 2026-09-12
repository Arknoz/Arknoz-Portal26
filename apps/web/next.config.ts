import type { NextConfig } from "next";

import {
  assertArknozArchitecture,
} from "./src/lib/validate-arknoz-architecture";

const architecture =
  assertArknozArchitecture();

console.log(
  `[Arknoz architecture] valid · ${architecture.summary.sections} sections · ${architecture.summary.entities} entities · ${architecture.summary.canonicalGeographyEntities} canonical geography · ${architecture.summary.legacyGeographyEntities} legacy geography`
);

const nextConfig: NextConfig = {};

export default nextConfig;