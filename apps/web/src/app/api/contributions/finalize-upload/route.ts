import { NextResponse } from "next/server";

import {
  finalizeContributionUpload,
} from "@/lib/contributions/r2-upload";

import {
  createClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: accessStatus,
      error: accessError,
    } = await supabase.rpc(
      "get_my_platform_member_access_status"
    );

    if (accessError) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Member access status could not be verified.",
        },
        {
          status: 503,
        }
      );
    }

    if (accessStatus === "suspended") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Arknoz member access is suspended.",
        },
        {
          status: 403,
        }
      );
    }
    const isPro =
      String(
        user.app_metadata
          ?.membership ??
          ""
      ).toUpperCase() ===
      "PRO";

    if (!isPro) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Arknoz Pro membership is required for contributions.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const manifest =
      await finalizeContributionUpload(
        String(
          body?.manifestKey ||
            ""
        ),
        user.id
      );

    return NextResponse.json({
      ok: true,

      contribution: {
        importId:
          manifest?.import?.id,

        manifestKey:
          String(
            body?.manifestKey ||
              ""
          ),

        filename:
          manifest?.source
            ?.original_filename,

        sizeBytes:
          Number(
            manifest?.source
              ?.size_bytes ||
              0
          ),

        sha256:
          manifest?.source
            ?.sha256,

        status:
          manifest?.import
            ?.status,

        rights:
          manifest?.rights
            ?.status,

        publicationAllowed:
          Boolean(
            manifest
              ?.publication
              ?.allowed
          ),
      },
    });
  } catch (error) {
    console.error(
      "Arknoz finalize contribution failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Contribution source could not be finalized.",
      },
      {
        status: 400,
      }
    );
  }
}