import { NextResponse } from "next/server";

import {
  submitContributionForAdminReview,
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

    const contributionType =
      String(
        body
          ?.contributionType ||
          ""
      );

    const manifest =
      await submitContributionForAdminReview({
        manifestKey:
          String(
            body?.manifestKey ||
              ""
          ),

        supportingManifestKeys:
          Array.isArray(
            body
              ?.supportingManifestKeys
          )
            ? body
                .supportingManifestKeys
                .map(
                  (
                    item: unknown
                  ) =>
                    String(
                      item || ""
                    )
                )
            : [],

        contributorUserId:
          user.id,

        contributionType,

        declarationAccepted:
          body
            ?.declarationAccepted ===
          true,

        details:
          body?.details &&
          typeof body.details ===
            "object" &&
          !Array.isArray(
            body.details
          )
            ? body.details
            : {},
      });

    return NextResponse.json({
      ok: true,

      contribution: {
        importId:
          manifest
            ?.import
            ?.id,

        manifestKey:
          String(
            body?.manifestKey ||
              ""
          ),

        contributionType:
          manifest
            ?.submission
            ?.contribution_type ??
          null,

        title:
          manifest
            ?.submission
            ?.details
            ?.title ??
          null,

        reviewStatus:
          manifest
            ?.submission
            ?.review_status ??
          null,

        submittedAt:
          manifest
            ?.submission
            ?.submitted_at ??
          null,

        evidenceCount:
          manifest
            ?.evidence
            ?.evidence_count ??
          0,
      },
    });
  } catch (error) {
    console.error(
      "Arknoz submit contribution failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Contribution could not be submitted.",
      },
      {
        status: 400,
      }
    );
  }
}