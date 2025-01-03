import { NextRequest, NextResponse } from "next/server";
import {
  convertSortParams,
  convertSearchParamsToWhereClause,
  calculateTimeDifference,
  formatDatetime,
} from "@/lib/utils";
import { listAllJobs } from "@/models/job";
import { convert } from "html-to-text";
import { TAG_COLORS } from "@/lib/constant";

/*
  Bleow option is when you want no caching at all, there are more options
  on the doc depending on your needs. 
*/
export const dynamic = "force-dynamic";

// Get all my online resumes
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams,
    page = searchParams.get("page") || "1",
    pageSize = searchParams.get("pageSize") || "9",
    sortField = searchParams.get("sortField") || "created_at",
    sortOrder = convertSortParams(searchParams.get("sortOrder")) || "desc",
    whereClause = convertSearchParamsToWhereClause(searchParams);

  try {
    const result: API.ModelRes = await listAllJobs({
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      // TODO: list all published jobs
      search: whereClause,
      sortField,
      sortOrder,
    });

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: { code: "OK" },
        result: {
          ...result.data,
          records: result.data.records.map((job: any) => ({
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
