import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { submitContributionForAdminReview } from "@/lib/contributions/r2-upload";

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
    ).trim();

    const contributionType = String(
      body?.contributionType || ""
    ).trim();

    const declarationAccepted =
      body?.declarationAccepted === true;

    const manifest =
      await submitContributionForAdminReview({
        manifestKey,
        contributorUserId: user.id,
        contributionType,
        declarationAccepted,
      });

    return NextResponse.json({
      ok: true,

      contribution: {
        importId:
          manifest?.import?.id || null,

        manifestKey,

        contributionType:
          manifest?.submission
            ?.contribution_type || null,

        reviewStatus:
          manifest?.submission
            ?.review_status || null,

        publicationAllowed:
          manifest?.publication
            ?.allowed === true,
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