#!/usr/bin/env node

/*
 * Arknoz Project Media Engine
 * Stage 1 — Wikimedia Commons discovery
 *
 * PURPOSE
 * -------
 * Given a Project title, discover candidate visual assets from
 * Wikimedia Commons and return normalized rights/provenance metadata.
 *
 * IMPORTANT
 * ---------
 * - Discovery only.
 * - No R2 upload.
 * - No Supabase write.
 * - No publication approval.
 * - External API data remains evidence/candidate data.
 *
 * Rights policy V1:
 * - Public Domain / CC0 -> AUTO_SAFE_METADATA
 * - CC BY / CC BY-SA / other free licences -> LICENSED_REVIEW
 * - Missing / unclear licence -> HOLD
 *
 * AUTO_SAFE_METADATA does NOT publish the asset. A later Arknoz
 * publication gate must still confirm project identity, visual match,
 * jurisdiction/FOP where relevant, provenance, transformation and
 * production-storage state.
 */

const COMMONS_API =
  "https://commons.wikimedia.org/w/api.php";

const USER_AGENT =
  "Arknoz-Project-Media-Engine/0.1 (https://arknoz.com)";

function parseArgs(argv) {
  const result = {
    query: "",
    limit: 12,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--query") {
      result.query = String(argv[i + 1] || "").trim();
      i += 1;
      continue;
    }

    if (arg === "--limit") {
      const value = Number(argv[i + 1]);

      if (
        Number.isInteger(value) &&
        value >= 1 &&
        value <= 50
      ) {
        result.limit = value;
      }

      i += 1;
      continue;
    }
  }

  return result;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function metadataValue(extmetadata, key) {
  return stripHtml(
    extmetadata?.[key]?.value ?? ""
  );
}

function normalizeLicense(raw) {
  const value =
    String(raw || "")
      .trim()
      .replace(/\s+/g, " ");

  const lower =
    value.toLowerCase();

  if (
    lower.includes("public domain") ||
    lower === "pd"
  ) {
    return {
      family: "PUBLIC_DOMAIN",
      normalized: value || "Public Domain",
      decision: "AUTO_SAFE_METADATA",
      reason:
        "Commons reports Public Domain metadata.",
    };
  }

  if (
    lower === "cc0" ||
    lower.includes("cc0 1.0") ||
    lower.includes("creative commons zero")
  ) {
    return {
      family: "CC0",
      normalized: value || "CC0",
      decision: "AUTO_SAFE_METADATA",
      reason:
        "Commons reports a CC0 dedication.",
    };
  }

  if (
    lower.includes("cc by-sa") ||
    lower.includes("cc-by-sa") ||
    lower.includes("attribution-sharealike")
  ) {
    return {
      family: "CC_BY_SA",
      normalized: value,
      decision: "LICENSED_REVIEW",
      reason:
        "Free licence metadata is present, but attribution, ShareAlike and architectural/FOP review may still apply.",
    };
  }

  if (
    lower.includes("cc by") ||
    lower.includes("cc-by") ||
    lower.includes("attribution")
  ) {
    return {
      family: "CC_BY",
      normalized: value,
      decision: "LICENSED_REVIEW",
      reason:
        "Free licence metadata is present, but attribution and architectural/FOP review may still apply.",
    };
  }

  if (
    lower.includes("gfdl") ||
    lower.includes("gnu free documentation")
  ) {
    return {
      family: "GFDL",
      normalized: value,
      decision: "LICENSED_REVIEW",
      reason:
        "Free licence metadata is present but requires licence-compliance review.",
    };
  }

  return {
    family: "UNKNOWN",
    normalized: value,
    decision: "HOLD",
    reason:
      "No automatically accepted licence family was identified.",
  };
}

function tokens(value) {
  return new Set(
    String(value || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 3)
  );
}

function relevanceScore(query, title, description) {
  const wanted =
    tokens(query);

  if (wanted.size === 0) {
    return 0;
  }

  const candidate =
    tokens(`${title} ${description}`);

  let matched = 0;

  for (const token of wanted) {
    if (candidate.has(token)) {
      matched += 1;
    }
  }

  return Number(
    (matched / wanted.size).toFixed(3)
  );
}

function inferRole(title, description) {
  const text =
    `${title} ${description}`.toLowerCase();

  if (
    /\b(plan|floor plan|site plan)\b/.test(text)
  ) {
    return "plan";
  }

  if (
    /\b(section|cross section|cross-section)\b/.test(text)
  ) {
    return "section";
  }

  if (
    /\b(elevation|facade drawing|façade drawing)\b/.test(text)
  ) {
    return "elevation";
  }

  if (
    /\b(drawing|diagram|sketch|scheme)\b/.test(text)
  ) {
    return "drawing";
  }

  if (
    /\b(aerial|bird.?s.?eye|drone)\b/.test(text)
  ) {
    return "aerial";
  }

  if (
    /\b(detail|close.?up)\b/.test(text)
  ) {
    return "detail";
  }

  if (
    /\b(night|evening|dusk)\b/.test(text)
  ) {
    return "photography";
  }

  return "photography";
}

function commonsPageUrl(title) {
  return (
    "https://commons.wikimedia.org/wiki/" +
    encodeURIComponent(title)
      .replace(/%3A/gi, ":")
      .replace(/%20/g, "_")
  );
}

async function discoverCommons({
  query,
  limit,
}) {
  const url =
    new URL(COMMONS_API);

  url.searchParams.set(
    "action",
    "query"
  );

  url.searchParams.set(
    "format",
    "json"
  );

  url.searchParams.set(
    "formatversion",
    "2"
  );

  url.searchParams.set(
    "generator",
    "search"
  );

  url.searchParams.set(
    "gsrnamespace",
    "6"
  );

  url.searchParams.set(
    "gsrsearch",
    query
  );

  url.searchParams.set(
    "gsrlimit",
    String(limit)
  );

  url.searchParams.set(
    "prop",
    "imageinfo"
  );

  url.searchParams.set(
    "iiprop",
    "url|size|mime|extmetadata"
  );

  url.searchParams.set(
    "iiurlwidth",
    "1800"
  );

  const response =
    await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

  if (!response.ok) {
    throw new Error(
      `Commons API HTTP ${response.status}`
    );
  }

  const body =
    await response.json();

  const pages =
    Array.isArray(body?.query?.pages)
      ? body.query.pages
      : [];

  const candidates =
    pages
      .map((page) => {
        const image =
          Array.isArray(page.imageinfo)
            ? page.imageinfo[0]
            : null;

        if (!image) {
          return null;
        }

        const metadata =
          image.extmetadata || {};

        const description =
          metadataValue(
            metadata,
            "ImageDescription"
          );

        const licenceName =
          metadataValue(
            metadata,
            "LicenseShortName"
          );

        const licenceUrl =
          metadataValue(
            metadata,
            "LicenseUrl"
          );

        const creator =
          metadataValue(
            metadata,
            "Artist"
          );

        const credit =
          metadataValue(
            metadata,
            "Credit"
          );

        const attributionRequired =
          metadataValue(
            metadata,
            "AttributionRequired"
          );

        const copyrighted =
          metadataValue(
            metadata,
            "Copyrighted"
          );

        const restrictions =
          metadataValue(
            metadata,
            "Restrictions"
          );

        const licenseGate =
          normalizeLicense(
            licenceName
          );

        return {
          source_provider:
            "Wikimedia Commons",

          commons_page_title:
            page.title,

          source_page:
            commonsPageUrl(
              page.title
            ),

          original_url:
            image.url || null,

          preview_url:
            image.thumburl || null,

          width:
            Number(image.width) || null,

          height:
            Number(image.height) || null,

          mime:
            image.mime || null,

          description,

          creator,

          credit,

          license_name:
            licenceName,

          license_url:
            licenceUrl,

          attribution_required:
            attributionRequired,

          copyrighted,

          restrictions,

          provenance_status:
            "source_identified",

          rights_metadata_status:
            "commons_extmetadata_received",

          rights_gate:
            licenseGate.decision,

          rights_family:
            licenseGate.family,

          rights_reason:
            licenseGate.reason,

          publication_approved:
            false,

          public_storage_authorized:
            false,

          database_publication_authorized:
            false,

          inferred_role:
            inferRole(
              page.title,
              description
            ),

          project_match_score:
            relevanceScore(
              query,
              page.title,
              description
            ),
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        return (
          b.project_match_score -
          a.project_match_score
        );
      });

  return candidates;
}

async function main() {
  const args =
    parseArgs(process.argv);

  if (!args.query) {
    console.error(
      "Usage: node project-media-discovery.mjs --query \"Sydney Opera House\" [--limit 12]"
    );

    process.exitCode = 2;
    return;
  }

  const candidates =
    await discoverCommons(args);

  const summary = {
    schema:
      "arknoz.project-media-discovery.v1",

    mode:
      "DISCOVERY_ONLY",

    query:
      args.query,

    candidate_count:
      candidates.length,

    auto_safe_metadata:
      candidates.filter(
        (item) =>
          item.rights_gate ===
          "AUTO_SAFE_METADATA"
      ).length,

    licensed_review:
      candidates.filter(
        (item) =>
          item.rights_gate ===
          "LICENSED_REVIEW"
      ).length,

    hold:
      candidates.filter(
        (item) =>
          item.rights_gate ===
          "HOLD"
      ).length,

    publication_authorized:
      false,

    storage_authorized:
      false,

    database_write_authorized:
      false,

    candidates,
  };

  process.stdout.write(
    JSON.stringify(
      summary,
      null,
      2
    ) + "\n"
  );
}

main().catch((error) => {
  console.error(
    `[Arknoz Project Media Engine] FAIL: ${error.message}`
  );

  process.exitCode = 1;
});