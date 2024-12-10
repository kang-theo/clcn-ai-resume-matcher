import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/models/job";
import { calculateTimeDifference, formatDatetime } from "@/lib/utils";
import { convert } from "html-to-text";
import { TAG_COLORS } from "@/lib/constant";

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
      const job = result.data;
      return NextResponse.json({
        meta: { code: "OK" },
        result: {
          ...job,
          company:
            typeof job.company === "string"
              ? JSON.parse(job.company)
              : job.company,
          posted_at: calculateTimeDifference(job.updated_at),
          created_at: formatDatetime(job.created_at),
          description: convert(job.description),
          tags: job.tags.map((tagRelation: any) => ({
            name: tagRelation.tag.name,
            color: TAG_COLORS[tagRelation.tag.name] || TAG_COLORS.default,
          })),
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
