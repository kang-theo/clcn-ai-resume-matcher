import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { analyzeJob } from "@/models/job";

/*
  Bleow option is when you want no caching at all, there are more options
  on the doc depending on your needs. 
*/
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session: Session | null = await auth();
    if (!session) {
      return NextResponse.json(
        {
          meta: { code: "UNAUTHORIZED" },
        },
        { status: 401 }
      );
    }

    // Currently, user only has one resume to analyze
    const result: API.ModelRes = await analyzeJob({
      id: params.id,
      user_id: session.user.id!,
    });

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: { code: "OK" },
        result: result.data,
      });
    } else {
      return NextResponse.json(
        { meta: { code: "E500", message: result.meta.message } },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}
