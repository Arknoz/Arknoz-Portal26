import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { finalizeContributionUpload } from "@/lib/contributions/r2-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const manifestKey = String(
      body?.manifestKey || ""
    );

    const manifest =
      await finalizeContributionUpload(
        manifestKey,
        user.id
      );

    return NextResponse.json({
      ok: true,

      contribution: {
        importId:
          manifest.import.id,

        manifestKey,

        filename:
          manifest.source.original_filename,

        sizeBytes:
          manifest.source.size_bytes,

        sha256:
          manifest.source.sha256,

        status:
          manifest.import.status,

        rights:
          manifest.rights.status,

        publicationAllowed:
          false,
      },
    });
  } catch (error) {
    console.error(
      "Arknoz finalize upload failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Upload could not be finalized.",
      },
      {
        status: 400,
      }
    );
  }
}