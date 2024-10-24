import {
  convertSearchParamsToWhereClause,
  convertSortParams,
} from "@/lib/utils";
// import { auth } from "@/lib/auth";
// import { Session } from "next-auth";
import { createJob, listAllJobs, deleteJobs } from "@/models/job";
import { NextRequest, NextResponse } from "next/server";
// import { newJobSchema } from "@/lib/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams,
    page = searchParams.get("page") || "1",
    pageSize = searchParams.get("pageSize") || "10",
    sortField = searchParams.get("sortField") || "created_at",
    sortOrder = convertSortParams(searchParams.get("sortOrder")) || "desc",
    whereClause = convertSearchParamsToWhereClause(searchParams);

  try {
    const result = await listAllJobs({
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      search: whereClause,
      sortField,
      sortOrder,
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
  } catch (err) {
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}
