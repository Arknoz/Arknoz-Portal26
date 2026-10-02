import { NextResponse } from "next/server";

import {
  listContributorSubmissions,
} from "@/lib/contributions/r2-upload";

import {
  createClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
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
    const contributions =
      await listContributorSubmissions(
        user.id
      );

    return NextResponse.json({
      ok: true,
      contributions,
    });
  } catch (error) {
    console.error(
      "Arknoz contribution history failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Contribution history could not be loaded.",
      },
      {
        status: 400,
      }
    );
  }
}