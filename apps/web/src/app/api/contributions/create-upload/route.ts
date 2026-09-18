import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createContributionUpload } from "@/lib/contributions/r2-upload";

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

    const upload = await createContributionUpload({
      originalFilename: String(
        body?.filename || ""
      ),

      declaredSizeBytes: Number(
        body?.sizeBytes || 0
      ),

      contributorUserId: user.id,
    });

    return NextResponse.json(
      {
        ok: true,
        upload,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Arknoz create upload failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,

        error:
          error instanceof Error
            ? error.message
            : "Upload session could not be created.",
      },
      {
        status: 400,
      }
    );
  }
}