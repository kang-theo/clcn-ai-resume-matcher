import {
  convertSearchParamsToWhereClause,
  convertSortParams,
} from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import {
  createJob,
  listAllJobs,
  deleteJobs,
  listAllJobsByStatus,
} from "@/models/job";
import { NextRequest, NextResponse } from "next/server";
import { newJobSchema } from "@/lib/schema";

export async function GET(req: NextRequest) {
  const session: Session | null = await auth();
  const searchParams = req.nextUrl.searchParams,
    status = searchParams.get("status") || "",
    page = searchParams.get("page") || "1",
    pageSize = searchParams.get("pageSize") || "10",
    sortField = searchParams.get("sortField") || "created_at",
    sortOrder = convertSortParams(searchParams.get("sortOrder")) || "desc",
    whereClause = {
      ...convertSearchParamsToWhereClause(searchParams),
      ...(status !== "all" && { status }),
    };

  try {
    const result: API.ModelRes = await listAllJobsByStatus(
      {
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        search: whereClause,
        sortField,
        sortOrder,
      },
      session?.user?.id!,
      session?.user?.roles.includes("Admin") ?? false
    );

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

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const session: Session | null = await auth();

    const validation = newJobSchema.safeParse({
      ...payload,
      created_by: session?.user.username!,
    });

    if (!validation.success) {
      return NextResponse.json(
        { meta: { code: "E400", message: validation.error.errors } },
        { status: 400 }
      );
    }

    const result: API.ModelRes = await createJob({
      ...payload,
      created_by: session?.user.username!,
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

export async function DELETE(req: NextRequest) {
  const payload = await req.json();

  try {
    const result = await deleteJobs(payload.ids);

    if (result.meta.code === "OK") {
      return NextResponse.json({
        meta: { code: "OK" },
      });
    } else {
      return NextResponse.json(result);
    }
  } catch (err: any) {
    return NextResponse.json(
      { meta: { code: "E500", message: err.message } },
      { status: 500 }
    );
  }
}
