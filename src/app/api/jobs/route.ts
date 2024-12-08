import { NextRequest, NextResponse } from "next/server";
import {
  convertSortParams,
  convertSearchParamsToWhereClause,
  calculateTimeDifference,
  formatDatetime,
} from "@/lib/utils";
import { listAllJobs } from "@/models/job";
import { convert } from "html-to-text";

/*
  Bleow option is when you want no caching at all, there are more options
  on the doc depending on your needs. 
*/
export const dynamic = "force-dynamic";

// Define tag color mapping
const TAG_COLORS: { [key: string]: string } = {
  Remote: "bg-orange-100 text-orange-900",
  Hybrid: "bg-yellow-100 text-yellow-900",
  "On-site": "bg-green-100 text-green-900",

  // Experience levels
  "Entry Level": "bg-purple-100 text-purple-900",
  "Mid Level": "bg-blue-100 text-blue-900",
  "Senior Level": "bg-indigo-100 text-indigo-900",

  // Department/Field
  Engineering: "bg-cyan-100 text-cyan-900",
  Finance: "bg-emerald-100 text-emerald-900",
  Design: "bg-pink-100 text-pink-900",

  // Job types
  "Full Stack": "bg-violet-100 text-violet-900",
  Frontend: "bg-rose-100 text-rose-900",
  Backend: "bg-sky-100 text-sky-900",

  // Industry
  Tech: "bg-amber-100 text-amber-900",
  Healthcare: "bg-lime-100 text-lime-900",
  Finance: "bg-teal-100 text-teal-900",

  // Company size
  Startup: "bg-fuchsia-100 text-fuchsia-900",
  Enterprise: "bg-red-100 text-red-900",

  // Default color for any unmatched tags
  default: "bg-gray-100 text-gray-900",
};

// Get all my online resumes
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams,
    page = searchParams.get("page") || "1",
    pageSize = searchParams.get("pageSize") || "10",
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
            times_ago: calculateTimeDifference(job.updated_at),
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
