import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/models/job";
import { calculateTimeDifference, formatDatetime } from "@/lib/utils";

/*
  Bleow option is when you want no caching at all, there are more options
  on the doc depending on your needs. 
*/
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result: API.ModelRes = await getJob(params.id);

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: { code: "OK" },
        result: {
          ...result.data,
          times_ago: calculateTimeDifference(result.data.updated_at),
          created_at: formatDatetime(result.data.created_at),
        },
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
